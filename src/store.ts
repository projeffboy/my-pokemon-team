import {
  makeAutoObservable,
  configure,
  observableRef,
  reaction,
  toJS,
} from "mobx";
import type {
  Generation,
  MoveKey,
  NameView,
  MoveSortOrder,
  PokemonFilters,
  SavedTeam,
  SearchFilters,
  SortOrder,
  Team,
  SnackbarNotification,
  SnackbarKind,
} from "./types";
import { generationRules, variantGeneration } from "./shared/generation-rules";
import { formatForGeneration } from "./shared/formats";
import { allItemIds } from "./shared/names";
import { MOVE_KEYS } from "./types";
import {
  generationLearnset,
  availableItems,
  availablePokemon,
  getTeamLearnsets,
  learnsetsReady,
} from "./store/learnsets";
import { calculateTypeDefence, calculateTypeCoverage } from "./store/coverage";
import { filterPokemon } from "./store/filtering";
import { sortPokemon, sortMoves } from "./store/sorting";
import { evaluateChecklist } from "./store/checklist";
import {
  completeSet,
  isSetComplete,
  randomPokemon,
  randomSet,
  randomizedFieldsMessage,
} from "./store/random";
import { serializeTeam } from "./store/team-text";
import { nextDuplicateName } from "./store/team-names";
import {
  mergeTeamBackup,
  parseTeamBackup,
  serializeTeamBackup,
} from "./store/team-backup";
import { describeTeamChange } from "./store/team-change";
import {
  initialStoredState,
  getBrowserStorage,
  loadStoredState,
  mergeStoredState,
  saveStoredState,
  stableJson,
  STORAGE_KEY,
  type StoredState,
} from "./store/teams-storage";
import { expireSettings } from "./store/settings-expiry";
import {
  createSavedTeam,
  getAutoSelectedAbility,
  getAutoSelectedItem,
  isTeamEmpty,
} from "./shared/team";
import { clearDetails } from "./shared/set-details";
import { canSelectMove } from "./shared/moves";
import { matchHiddenPower } from "./shared/hidden-power";
import { pokemonAbilities } from "./shared/pokedex";
import { typesIn } from "./shared/generation-data";
import { detectLocale, type Locale } from "./i18n/locales";
import { english, loadTranslation, type Translation } from "./i18n/translation";

// Components mutate the store directly.
configure({ enforceActions: "never" });

export type DialogName =
  | "teams"
  | "importTeam"
  | "editTeam"
  | "advanced"
  | "info"
  | "filters"
  | "sort";

const HISTORY_LIMIT = 50;

const browserStorage = getBrowserStorage();
expireSettings(browserStorage, Date.now());
const browserLanguages =
  typeof navigator === "undefined" ? [] : navigator.languages;

const teamKey = (team: Team) => stableJson(toJS(team));

export class Store {
  constructor(private readonly storage = browserStorage) {
    const loaded = loadStoredState(storage);
    const stored = loaded ?? initialStoredState();
    this.teams = stored.teams;
    this.currentTeamId = stored.currentTeamId;
    this.isMoreOpen = stored.isMoreOpen;
    this.sort = stored.sort;
    this.moveSort = stored.moveSort;
    this.nameView = stored.nameView;
    this.chosenLocale = stored.locale;
    this.knowsSlotDrag = stored.knowsSlotDrag ?? false;
    this.lastRead = structuredClone(stored);
    if (loaded) this.openUnsavedTeam();
    this.lastSnapshot = teamKey(this.team);

    makeAutoObservable<
      Store,
      "lastSnapshot" | "lastRead" | "draftSnapshot" | "storage"
    >(this, {
      lastSnapshot: false,
      lastRead: false,
      draftSnapshot: false,
      storage: false,
      translationReady: false,
      translation: observableRef,
    });

    learnsetsReady.then(
      () => {
        this.learnsetsLoaded = true;
      },
      () =>
        this.openSnackbar(
          this.translation.t.team.learnsetsFailed,
          false,
          "error",
        ),
    );

    this.translationReady = this.loadLocale(this.locale);
    reaction(
      () => this.locale,
      locale => this.loadLocale(locale),
    );

    reaction(
      () => stableJson(this.currentTeam),
      snapshot => {
        if (
          this.draftTeam?.id === this.currentTeamId &&
          snapshot !== this.draftSnapshot
        ) {
          this.teams.push(this.draftTeam);
          this.draftTeam = null;
        }
      },
    );

    reaction(
      () => JSON.stringify(this.storedState),
      () => this.save(),
      { delay: 250 },
    );
    if (typeof addEventListener !== "undefined") {
      // An edit made just before leaving the page would miss the delayed save above
      addEventListener("pagehide", () => this.save());
      addEventListener("storage", ({ key, storageArea }) => {
        if (key === STORAGE_KEY && storageArea === storage)
          this.readOtherTabs();
      });
    }

    // Undo history is per team, so switching teams starts it afresh
    reaction(
      () => this.currentTeamId,
      () => {
        if (this.draftTeam?.id !== this.currentTeamId) this.draftTeam = null;
        this.resetHistory();
      },
    );

    // Records the team before each burst of edits, so undo steps back through them
    reaction(
      () => teamKey(this.team),
      snapshot => this.recordEdit(snapshot),
      { delay: 400 },
    );
  }

  learnsetsLoaded = false;

  // Saved teams, of which one is being edited

  teams: SavedTeam[];
  currentTeamId: string;
  saveFailed = false;
  private draftTeam: SavedTeam | null = null;
  private draftSnapshot = "";

  findTeam(id: string) {
    return (
      this.teams.find(team => team.id === id) ??
      (this.draftTeam?.id === id ? this.draftTeam : undefined)
    );
  }

  get currentTeam(): SavedTeam {
    const team = this.findTeam(this.currentTeamId) ?? this.teams[0];
    if (!team) throw new Error("There is always at least one team");
    return team;
  }

  get team(): Team {
    return this.currentTeam.team;
  }

  set team(team: Team) {
    this.currentTeam.team = team;
  }

  replaceTeam(team: Team) {
    this.team = team;
  }

  private nextTeamName() {
    const { teamNumber } = this.translation.t.team;
    const names = new Set(this.teams.map(({ name }) => name));
    let number = this.teams.length + 1;
    while (names.has(teamNumber(number))) number++;
    return teamNumber(number);
  }

  // A linked or fresh team stays out of saved teams until its first edit.
  openUnsavedTeam(
    team?: Team,
    settings?: Pick<SavedTeam, "generation"> &
      Partial<Pick<SavedTeam, "format">>,
  ) {
    const { generation, format } = this.currentTeam;
    const draft = createSavedTeam({
      name: this.nextTeamName(),
      generation,
      format:
        settings ? formatForGeneration(format, settings.generation) : format,
      ...settings,
      ...(team && { team }),
    });
    this.draftSnapshot = stableJson(draft);
    this.draftTeam = draft;
    this.currentTeamId = draft.id;
  }

  // A new team in the current team's generation and format, which becomes the current one
  addTeam(settings: Partial<Omit<SavedTeam, "id">> = {}) {
    const { generation, format } = this.currentTeam;
    const team = createSavedTeam({
      name: this.nextTeamName(),
      generation,
      format,
      ...settings,
    });
    this.teams.push(team);
    this.currentTeamId = team.id;
    return team;
  }

  exportTeamBackup() {
    this.readOtherTabs();
    return serializeTeamBackup({
      teams: toJS(this.teams),
      currentTeamId: this.currentTeamId,
      ...(this.draftTeam && { draftTeam: toJS(this.draftTeam) }),
    });
  }

  restoreTeamBackup(text: string) {
    const backup = parseTeamBackup(text);
    if (!backup) return undefined;
    this.readOtherTabs();
    const existing =
      this.draftTeam ? [...this.teams, this.draftTeam] : this.teams;
    const { added, skipped } = mergeTeamBackup(existing, backup);
    try {
      serializeTeamBackup({
        teams: [...toJS(this.teams), ...added],
        currentTeamId: this.currentTeamId,
        ...(this.draftTeam && { draftTeam: toJS(this.draftTeam) }),
      });
    } catch (error) {
      return error instanceof RangeError ?
          { error: "tooLarge" as const }
        : undefined;
    }
    this.teams.push(...added);
    return { added: added.length, skipped };
  }

  // Switches to an empty team of the current generation and format, adding one if needed
  openEmptyTeam() {
    const { generation, format } = this.currentTeam;
    const existing = [this.currentTeam, ...this.teams].find(
      team =>
        team.generation === generation &&
        team.format === format &&
        isTeamEmpty(team.team),
    );
    if (!existing) return { team: this.addTeam(), isNew: true };
    this.currentTeamId = existing.id;
    return { team: existing, isNew: false };
  }

  selectTeam(id: string) {
    if (this.teams.some(team => team.id === id)) this.currentTeamId = id;
  }

  deleteTeam(id: string) {
    if (this.draftTeam?.id === id) {
      this.openUnsavedTeam();
      return;
    }
    const index = this.teams.findIndex(team => team.id === id);
    if (index === -1) return;
    const { generation, format } = this.teams.splice(index, 1)[0] ?? {};
    if (!this.teams.length) {
      const name = this.translation.t.team.teamNumber(1);
      this.teams.push(createSavedTeam({ name, generation, format }));
    }
    if (this.currentTeamId === id) {
      const neighbour = this.teams[Math.min(index, this.teams.length - 1)];
      if (neighbour) this.currentTeamId = neighbour.id;
    }
  }

  duplicateTeam(id: string) {
    const index = this.teams.findIndex(team => team.id === id);
    const source = this.findTeam(id);
    if (!source || isTeamEmpty(source.team)) return;
    const { id: _sourceId, ...settings } = toJS(source);
    const { copyOf, unnamedTeam } = this.translation.t.team;
    const copy = createSavedTeam({
      ...settings,
      name: nextDuplicateName(
        source.name || unnamedTeam,
        this.teams.map(team => team.name),
        copyOf,
      ),
    });
    this.teams.splice(index === -1 ? this.teams.length : index + 1, 0, copy);
    this.currentTeamId = copy.id;
    return copy;
  }

  transferTeamGeneration(
    generation: Generation,
    format: string,
    team: Team,
    newTeam: boolean,
  ) {
    if (newTeam) {
      if (this.draftTeam?.id === this.currentTeamId) {
        this.teams.push(this.draftTeam);
        this.draftTeam = null;
      }
      this.addTeam({ generation, format, team, filters: toJS(this.filters) });
    } else {
      Object.assign(this.currentTeam, { generation, format, team });
    }
    this.resetHistory();
  }

  renameTeam(id: string, name: string) {
    const team = this.findTeam(id);
    if (team) team.name = name;
  }

  // Link text matches saved teams even when the text leaves out empty slots.
  openTeamFromLink(
    team: Team,
    settings?: Pick<SavedTeam, "generation"> &
      Partial<Pick<SavedTeam, "format">>,
  ) {
    if (isTeamEmpty(team)) return;
    const text = serializeTeam(team);
    const preferredId =
      this.draftTeam ? this.lastRead.currentTeamId : this.currentTeamId;
    const matches = (saved: SavedTeam) =>
      serializeTeam(saved.team) === text &&
      (!settings ||
        (saved.generation === settings.generation &&
          (settings.format === undefined || saved.format === settings.format)));
    const saved =
      this.teams.find(saved => saved.id === preferredId && matches(saved)) ??
      this.teams.find(matches);
    if (saved) this.currentTeamId = saved.id;
    else this.openUnsavedTeam(team, settings);
  }

  // The current team

  get teamPokemon() {
    return this.team.map(({ name }) => name);
  }

  get isTeamEmpty() {
    return isTeamEmpty(this.team);
  }

  get rules() {
    return generationRules(
      this.currentTeam.generation,
      this.currentTeam.format,
    );
  }

  get teamItems() {
    if (!this.learnsetsLoaded) return [];
    return availableItems(
      allItemIds,
      this.currentTeam.generation,
      this.currentTeam.format,
    );
  }

  get analysisTeam() {
    return this.team.map(member => ({
      ...member,
      ability: this.rules.abilities ? member.ability : "",
      item: this.rules.items ? member.item : "",
    }));
  }

  get filterAbilities() {
    if (!this.learnsetsLoaded) return [];
    const { generation, format } = this.currentTeam;
    const species = filterPokemon({ generation, format, type: "", region: "" });
    return [
      ...new Set(
        (variantGeneration(format) ?
          availablePokemon(species, generation, format)
        : species
        ).flatMap(name => pokemonAbilities(name, generation)),
      ),
    ];
  }

  get teamAbilities() {
    return this.team.map(({ name }) =>
      this.rules.abilities ?
        pokemonAbilities(name, this.currentTeam.generation)
      : [],
    );
  }

  // A boolean computed, so typing in the move filter does not rebuild the learnsets on every keystroke
  get viableMovesOnly() {
    return !!this.filters.moves;
  }

  get teamLearnsets() {
    if (!this.learnsetsLoaded) return { values: [], labels: [] };
    const learnsets = getTeamLearnsets(
      this.team,
      this.viableMovesOnly,
      this.translation.names,
      this.currentTeam.generation,
      this.currentTeam.format,
    );
    const values = learnsets.values.map(moves =>
      sortMoves(
        moves,
        this.moveSort,
        this.currentTeam.generation,
        this.translation,
      ),
    );
    return {
      values,
      labels: values.map(moves => moves.map(this.translation.names.move)),
    };
  }

  // Choosing a pokemon resets the slot, then fills in its only item and ability
  // when it has one, e.g. Blastoisinite and Thick Fat for Blastoise-Mega
  selectPokemon(teamIndex: number, name: string) {
    const member = this.team[teamIndex];

    if (!member) return;
    member.name = name;
    member.item = this.rules.items ? getAutoSelectedItem(name, "") : "";
    member.ability =
      this.rules.abilities ?
        getAutoSelectedAbility(name, this.currentTeam.generation)
      : "";
    for (const key of MOVE_KEYS) member[key] = "";
    clearDetails(member);
    this.pokemonSelection = {
      teamId: this.currentTeamId,
      teamIndex,
      sequence: (this.pokemonSelection?.sequence ?? 0) + 1,
    };
  }

  selectMove(teamIndex: number, key: MoveKey, move: string) {
    const member = this.team[teamIndex];
    if (!member || !canSelectMove(member, key, move)) return;
    member[key] = move;
    matchHiddenPower(
      member,
      move,
      this.currentTeam.generation,
      this.currentTeam.format,
    );
  }

  pokemonSelection: {
    teamId: string;
    teamIndex: number;
    sequence: number;
  } | null = null;

  // Moves a pokemon to another slot, and that slot's pokemon to this one
  swapSlots(teamIndex: number, otherIndex: number) {
    const member = this.team[teamIndex];
    const other = this.team[otherIndex];
    if (!member || !other || teamIndex === otherIndex) return;
    this.team[teamIndex] = other;
    this.team[otherIndex] = member;
  }

  // Moves a pokemon to another slot, and the ones in between over by one
  moveSlot(teamIndex: number, otherIndex: number) {
    const member = this.team[teamIndex];
    if (!member || !this.team[otherIndex] || teamIndex === otherIndex) return;
    this.team.splice(teamIndex, 1);
    this.team.splice(otherIndex, 0, member);
  }

  // Whether the player has dragged a slot tab or dismissed the hint about it
  knowsSlotDrag = false;

  // The slot tabs explain dragging once there are pokemon to reorder
  get showDragHint() {
    return (
      !this.knowsSlotDrag && this.team.filter(({ name }) => name).length > 1
    );
  }

  // A random pokemon from the filtered options, with a random set
  // Fills in whatever the slot's set lacks, and a complete or empty slot gets a
  // fresh random pokemon
  randomizeSlot(teamIndex: number) {
    const member = this.team[teamIndex];
    if (!member) return;
    if (
      member.name &&
      !isSetComplete(
        member,
        this.currentTeam.generation,
        this.currentTeam.format,
      )
    ) {
      const completed = completeSet(
        member,
        generationLearnset(
          member.name,
          this.currentTeam.generation,
          this.currentTeam.format,
        ),
        Math.random,
        this.currentTeam.generation,
        this.currentTeam.format,
      );
      this.recordEdit();
      this.team[teamIndex] = completed;
      this.recordEdit();
      return randomizedFieldsMessage(member, completed, this.translation);
    }
    const pokemon = randomPokemon(this.filteredPokemon, this.teamPokemon);
    if (!pokemon) return;
    this.recordEdit();
    this.team[teamIndex] = randomSet(
      pokemon,
      generationLearnset(
        pokemon,
        this.currentTeam.generation,
        this.currentTeam.format,
      ),
      Math.random,
      this.currentTeam.generation,
      this.currentTeam.format,
    );
    this.recordEdit();
    return this.translation.t.team.randomizedPokemon;
  }

  // Six fresh picks: only the ones made so far count as taken, so the pokemon
  // being replaced do not force a repeat when the filters leave six options
  randomizeTeam() {
    this.recordEdit();
    const options = this.filteredPokemon;
    const chosen: string[] = [];
    for (let i = 0; i < this.team.length; i++) {
      const pokemon = randomPokemon(options, chosen);
      if (!pokemon) return;
      chosen.push(pokemon);
      this.team[i] = randomSet(
        pokemon,
        generationLearnset(
          pokemon,
          this.currentTeam.generation,
          this.currentTeam.format,
        ),
        Math.random,
        this.currentTeam.generation,
        this.currentTeam.format,
      );
    }
    this.recordEdit(teamKey(this.team), true);
  }

  resetDetails(teamIndex: number) {
    const member = this.team[teamIndex];
    if (member) clearDetails(member);
  }

  get typeDefence() {
    return calculateTypeDefence(this.analysisTeam, this.currentTeam.generation);
  }

  get typeCoverage() {
    return calculateTypeCoverage(
      this.analysisTeam,
      this.currentTeam.generation,
      this.currentTeam.format,
    );
  }

  get checklist() {
    return evaluateChecklist(
      this.analysisTeam,
      this.currentTeam.generation,
      this.currentTeam.format,
    );
  }

  // The Name dropdown's options

  get filters(): SearchFilters {
    return this.currentTeam.filters;
  }

  set filters(filters: SearchFilters) {
    this.currentTeam.filters = filters;
  }

  sort: SortOrder;
  moveSort: MoveSortOrder;

  get searchFilters(): PokemonFilters {
    const { generation, format } = this.currentTeam;
    const { type } = this.filters;
    // A type filter from a later generation does not apply to an earlier one
    return {
      ...this.filters,
      ability: this.rules.abilities ? this.filters.ability : "",
      type: typesIn(generation).some(known => known === type) ? type : "",
      generation,
      format,
    };
  }

  get filteredPokemon() {
    if (variantGeneration(this.currentTeam.format) && !this.learnsetsLoaded)
      return [];
    const pokemon = filterPokemon(this.searchFilters);
    return sortPokemon(
      variantGeneration(this.currentTeam.format) ?
        availablePokemon(
          pokemon,
          this.currentTeam.generation,
          this.currentTeam.format,
        )
      : pokemon,
      this.sort,
      this.translation,
      this.currentTeam.generation,
      this.currentTeam.format,
    );
  }

  get filteredPokemonNames() {
    return this.filteredPokemon.map(this.translation.names.pokemon);
  }

  // Undo and redo, per team

  private past: { snapshot: string; randomizedTeam: boolean }[] = [];
  private future: { snapshot: string; randomizedTeam: boolean }[] = [];
  private lastSnapshot: string;

  private resetHistory() {
    this.past = [];
    this.future = [];
    this.lastSnapshot = teamKey(this.team);
  }

  // Undo and redo record first, so an edit the delayed reaction has yet to see is kept
  private recordEdit(snapshot = teamKey(this.team), randomizedTeam = false) {
    if (snapshot === this.lastSnapshot) return;
    this.past = [
      ...this.past,
      { snapshot: this.lastSnapshot, randomizedTeam },
    ].slice(-HISTORY_LIMIT);
    this.future = [];
    this.lastSnapshot = snapshot;
  }

  get canUndo() {
    return this.past.length > 0;
  }

  get canRedo() {
    return this.future.length > 0;
  }

  undo() {
    this.recordEdit();
    const entry = this.past.at(-1);
    if (!entry) return;
    this.past = this.past.slice(0, -1);
    this.future = [...this.future, { ...entry, snapshot: this.lastSnapshot }];
    const previous = this.team;
    this.restore(entry.snapshot);
    const action =
      entry.randomizedTeam ?
        this.translation.t.team.randomizeTeamAction
      : describeTeamChange(
          this.team,
          previous,
          this.translation,
          this.currentTeam.generation,
          this.currentTeam.format,
        );
    return action ? this.translation.t.team.undoAction(action) : undefined;
  }

  redo() {
    this.recordEdit();
    const entry = this.future.at(-1);
    if (!entry) return;
    this.future = this.future.slice(0, -1);
    this.past = [...this.past, { ...entry, snapshot: this.lastSnapshot }];
    const previous = this.team;
    this.restore(entry.snapshot);
    const action =
      entry.randomizedTeam ?
        this.translation.t.team.randomizeTeamAction
      : describeTeamChange(
          previous,
          this.team,
          this.translation,
          this.currentTeam.generation,
          this.currentTeam.format,
        );
    return action ? this.translation.t.team.redoAction(action) : undefined;
  }

  private restore(snapshot: string) {
    this.lastSnapshot = snapshot;
    this.team = JSON.parse(snapshot) as Team;
  }

  // UI state

  // The language the visitor chose. Until they choose, the browser's applies
  // and nothing is saved, so a change of browser language is followed.
  chosenLocale: Locale | undefined;

  get locale(): Locale {
    return this.chosenLocale ?? detectLocale(browserLanguages);
  }

  set locale(locale: Locale) {
    this.chosenLocale = locale;
  }

  // The text and names on screen, which load on demand
  translation: Translation = english;

  // Settles when the language the page opens in has loaded, or failed to
  readonly translationReady: Promise<void>;

  // Choosing the language again retries a load that failed
  chooseLocale(locale: Locale) {
    const isRetry = locale === this.locale;
    this.chosenLocale = locale;
    if (isRetry && this.translation.locale !== locale) this.loadLocale(locale);
  }

  // A language chosen in the meantime wins, and a failed load leaves the
  // previous language on screen
  private loadLocale(locale: Locale) {
    return loadTranslation(locale).then(
      translation => {
        if (locale !== this.locale) return;
        this.translation = translation;
        if (typeof document !== "undefined")
          document.documentElement.lang = locale;
      },
      () =>
        this.openSnackbar(this.translation.t.languageFailed, false, "error"),
    );
  }

  // "More" shows the slot tools: filters, sort, and advanced sets, plus the team toolbar on phones and tablets
  isMoreOpen: boolean;

  // How the Name dropdown lists its options
  nameView: NameView;

  // The open dialog, with the team slot or saved team it is about
  dialog: { name: DialogName; teamIndex: number; teamId: string } | null = null;

  openDialog(
    name: DialogName,
    { teamIndex = 0, teamId = this.currentTeamId } = {},
  ) {
    this.dialog = { name, teamIndex, teamId };
  }

  closeDialog() {
    this.dialog = null;
  }

  snackbars: SnackbarNotification[] = [];
  private nextSnackbarId = 0;

  openSnackbar(message: string, undoable = false, kind: SnackbarKind = "info") {
    this.snackbars = [
      ...this.snackbars,
      {
        id: this.nextSnackbarId++,
        kind,
        message,
        undoable,
        teamId: this.currentTeamId,
        snapshot: undoable ? teamKey(this.team) : "",
        undoSnapshot: undoable ? this.snackbarUndoSnapshot : undefined,
      },
    ].slice(-3);
  }

  closeSnackbar(id: number) {
    this.snackbars = this.snackbars.filter(
      notification => notification.id !== id,
    );
  }

  canUndoSnackbar(notification: SnackbarNotification) {
    return (
      notification.undoable &&
      notification.teamId === this.currentTeamId &&
      notification.snapshot === teamKey(this.team) &&
      notification.undoSnapshot !== undefined &&
      notification.undoSnapshot === this.snackbarUndoSnapshot
    );
  }

  private get snackbarUndoSnapshot() {
    return teamKey(this.team) !== this.lastSnapshot ?
        this.lastSnapshot
      : this.past.at(-1)?.snapshot;
  }

  // The saved state as this tab last read or saved it, which tells what other
  // tabs have changed since, and what this tab has yet to save
  private lastRead: StoredState;

  // Takes in what other tabs saved, so that saving here does not undo it
  private readOtherTabs() {
    const theirs = loadStoredState(this.storage);
    if (!theirs) return;
    const snapshot = teamKey(this.team);
    const { generation, format } = this.currentTeam;
    const mine = this.storedState;
    const selectionChanged = mine.currentTeamId !== this.lastRead.currentTeamId;
    const merged = mergeStoredState(this.lastRead, mine, theirs);
    this.teams = merged.teams;
    if (!this.draftTeam) this.currentTeamId = merged.currentTeamId;
    this.isMoreOpen = merged.isMoreOpen;
    this.sort = merged.sort;
    this.moveSort = merged.moveSort;
    this.nameView = merged.nameView;
    this.chosenLocale = merged.locale;
    this.knowsSlotDrag = merged.knowsSlotDrag ?? false;
    this.lastRead = {
      ...theirs,
      currentTeamId:
        selectionChanged ? theirs.currentTeamId : merged.currentTeamId,
    };
    if (
      teamKey(this.team) !== snapshot ||
      this.currentTeam.generation !== generation ||
      this.currentTeam.format !== format
    )
      this.resetHistory();
    if (
      this.saveFailed &&
      stableJson(this.storedState) === stableJson(this.lastRead)
    )
      this.saveFailed = false;
  }

  // A tab with nothing of its own to save leaves the saving to the tab in use:
  // were it to save what it just read, it could undo a newer save
  private save() {
    this.readOtherTabs();
    if (stableJson(this.storedState) === stableJson(this.lastRead)) {
      this.saveFailed = false;
      return;
    }
    const state = JSON.parse(JSON.stringify(this.storedState)) as StoredState;
    const saved = saveStoredState(this.storage, state);
    this.saveFailed = !saved;
    if (saved) this.lastRead = state;
  }

  private get storedState(): StoredState {
    return {
      teams: this.teams,
      currentTeamId:
        this.draftTeam ? this.lastRead.currentTeamId : this.currentTeamId,
      isMoreOpen: this.isMoreOpen,
      sort: this.sort,
      moveSort: this.moveSort,
      nameView: this.nameView,
      ...(this.chosenLocale && { locale: this.chosenLocale }),
      ...(this.knowsSlotDrag && { knowsSlotDrag: true }),
    };
  }
}

export default new Store();
