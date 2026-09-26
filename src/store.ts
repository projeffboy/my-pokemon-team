import { makeAutoObservable, configure, reaction, toJS } from "mobx";
import type {
  Generation,
  PokemonFilters,
  SavedTeam,
  SearchFilters,
  SortOrder,
  Team,
} from "./types";
import { MOVE_KEYS } from "./types";
import {
  completeLearnset,
  getTeamLearnsets,
  learnsetsReady,
} from "./store/learnsets";
import { calculateTypeDefence, calculateTypeCoverage } from "./store/coverage";
import { filterPokemon } from "./store/filtering";
import { sortPokemon } from "./store/sorting";
import { evaluateChecklist } from "./store/checklist";
import { randomPokemon, randomSet } from "./store/random";
import {
  initialStoredState,
  loadStoredState,
  saveStoredState,
  type StoredState,
} from "./store/teams-storage";
import {
  createSavedTeam,
  getAutoSelectedAbility,
  getAutoSelectedItem,
  isTeamEmpty,
} from "./shared/team";
import { clearDetails } from "./shared/set-details";
import { pokemonName } from "./shared/names";
import { pokemonAbilities } from "./shared/pokedex";

// Components mutate the store directly.
configure({ enforceActions: "never" });

export type DialogName =
  | "teams"
  | "teamSettings"
  | "importTeam"
  | "editTeam"
  | "advanced"
  | "info"
  | "filters"
  | "sort";

const HISTORY_LIMIT = 50;

const storage = typeof localStorage === "undefined" ? undefined : localStorage;

const teamKey = (team: Team) => JSON.stringify(toJS(team));

class Store {
  constructor() {
    const stored = loadStoredState(storage) ?? initialStoredState();
    this.teams = stored.teams;
    this.currentTeamId = stored.currentTeamId;
    this.isMoreOpen = stored.isMoreOpen;
    this.sort = stored.sort;
    this.lastSnapshot = teamKey(this.team);
    this.historyTeamId = this.currentTeamId;

    makeAutoObservable<Store, "lastSnapshot" | "historyTeamId">(this, {
      lastSnapshot: false,
      historyTeamId: false,
    });

    learnsetsReady.then(
      () => {
        this.learnsetsLoaded = true;
      },
      () =>
        this.openSnackbar(
          "The move lists could not be loaded. Reload the page to try again.",
        ),
    );

    reaction(
      () => JSON.stringify(this.storedState),
      json => saveStoredState(storage, JSON.parse(json) as StoredState),
      { delay: 250 },
    );

    // Undo history is per team, so switching teams starts it afresh
    reaction(
      () => this.currentTeamId,
      teamId => {
        this.historyTeamId = teamId;
        this.past = [];
        this.future = [];
        this.lastSnapshot = teamKey(this.team);
      },
    );

    // Records the team before each burst of edits, so undo steps back through them
    reaction(
      () => teamKey(this.team),
      snapshot => {
        if (snapshot === this.lastSnapshot) return;
        this.past = [...this.past, this.lastSnapshot].slice(-HISTORY_LIMIT);
        this.future = [];
        this.lastSnapshot = snapshot;
      },
      { delay: 400 },
    );
  }

  learnsetsLoaded = false;

  // Saved teams, of which one is being edited

  teams: SavedTeam[];
  currentTeamId: string;

  get currentTeam(): SavedTeam {
    const team =
      this.teams.find(({ id }) => id === this.currentTeamId) ?? this.teams[0];
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
    const names = new Set(this.teams.map(({ name }) => name));
    let number = this.teams.length + 1;
    while (names.has(`Team ${number}`)) number++;
    return `Team ${number}`;
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

  selectTeam(id: string) {
    if (this.teams.some(team => team.id === id)) this.currentTeamId = id;
  }

  deleteTeam(id: string) {
    const index = this.teams.findIndex(team => team.id === id);
    if (index === -1) return;
    const { generation, format } = this.teams.splice(index, 1)[0] ?? {};
    if (!this.teams.length) {
      this.teams.push(createSavedTeam({ name: "Team 1", generation, format }));
    }
    if (this.currentTeamId === id) {
      const neighbour = this.teams[Math.min(index, this.teams.length - 1)];
      if (neighbour) this.currentTeamId = neighbour.id;
    }
  }

  duplicateTeam(id: string) {
    const index = this.teams.findIndex(team => team.id === id);
    const source = this.teams[index];
    if (!source) return;
    const { id: _sourceId, ...settings } = toJS(source);
    const copy = createSavedTeam({
      ...settings,
      name: `${source.name || "Team"} copy`,
    });
    this.teams.splice(index + 1, 0, copy);
    this.currentTeamId = copy.id;
    return copy;
  }

  setTeamSettings(
    id: string,
    settings: { name: string; generation: Generation; format: string },
  ) {
    const team = this.teams.find(team => team.id === id);
    if (team) Object.assign(team, settings);
  }

  // A team opened from a link: the current team if it is empty or the same,
  // else the saved team it matches, else a new team
  openTeamFromLink(team: Team) {
    const key = teamKey(team);
    if (isTeamEmpty(this.team) || teamKey(this.team) === key) {
      this.team = team;
      return;
    }
    const saved = this.teams.find(saved => teamKey(saved.team) === key);
    if (saved) this.currentTeamId = saved.id;
    else this.addTeam({ team });
  }

  // The current team

  get teamPokemon() {
    return this.team.map(({ name }) => name);
  }

  get isTeamEmpty() {
    return isTeamEmpty(this.team);
  }

  get teamAbilities() {
    return this.team.map(({ name }) => pokemonAbilities(name));
  }

  // A boolean computed, so typing in the move filter does not rebuild the learnsets on every keystroke
  get viableMovesOnly() {
    return !!this.filters.moves;
  }

  get teamLearnsets() {
    if (!this.learnsetsLoaded) return { values: [], labels: [] };
    return getTeamLearnsets(this.team, this.viableMovesOnly);
  }

  // Choosing a pokemon resets the slot, then fills in its only item and ability
  // when it has one, e.g. Blastoisinite and Thick Fat for Blastoise-Mega
  selectPokemon(teamIndex: number, name: string) {
    const member = this.team[teamIndex];

    if (!member) return;
    member.name = name;
    member.item = getAutoSelectedItem(name, "");
    member.ability = getAutoSelectedAbility(name);
    for (const key of MOVE_KEYS) member[key] = "";
    clearDetails(member);
  }

  // Moves a pokemon to another slot, and that slot's pokemon to this one
  swapSlots(teamIndex: number, otherIndex: number) {
    const member = this.team[teamIndex];
    const other = this.team[otherIndex];
    if (!member || !other || teamIndex === otherIndex) return;
    this.team[teamIndex] = other;
    this.team[otherIndex] = member;
  }

  // A random pokemon from the filtered options, with a random set
  randomizeSlot(teamIndex: number) {
    if (teamIndex < 0 || teamIndex >= this.team.length) return;
    const pokemon = randomPokemon(this.filteredPokemon, this.teamPokemon);
    if (!pokemon) return;
    this.team[teamIndex] = randomSet(pokemon, completeLearnset(pokemon));
  }

  randomizeTeam() {
    for (let i = 0; i < this.team.length; i++) this.randomizeSlot(i);
  }

  resetDetails(teamIndex: number) {
    const member = this.team[teamIndex];
    if (member) clearDetails(member);
  }

  get typeDefence() {
    return calculateTypeDefence(this.team);
  }

  get typeCoverage() {
    return calculateTypeCoverage(this.team);
  }

  get checklist() {
    return evaluateChecklist(this.team);
  }

  // The Name dropdown's options

  filters: SearchFilters = {
    type: "",
    region: "",
    ability: "",
    moves: "",
  };

  sort: SortOrder;

  get searchFilters(): PokemonFilters {
    const { generation, format } = this.currentTeam;
    return { ...this.filters, generation, format };
  }

  get filteredPokemon() {
    return sortPokemon(filterPokemon(this.searchFilters), this.sort);
  }

  get filteredPokemonNames() {
    return this.filteredPokemon.map(pokemonName);
  }

  // Undo and redo, per team

  private past: string[] = [];
  private future: string[] = [];
  private lastSnapshot: string;
  private historyTeamId: string;

  get canUndo() {
    return this.past.length > 0;
  }

  get canRedo() {
    return this.future.length > 0;
  }

  undo() {
    const snapshot = this.past[this.past.length - 1];
    if (snapshot === undefined) return;
    this.past = this.past.slice(0, -1);
    this.future = [...this.future, this.lastSnapshot];
    this.restore(snapshot);
  }

  redo() {
    const snapshot = this.future[this.future.length - 1];
    if (snapshot === undefined) return;
    this.future = this.future.slice(0, -1);
    this.past = [...this.past, this.lastSnapshot];
    this.restore(snapshot);
  }

  private restore(snapshot: string) {
    this.lastSnapshot = snapshot;
    this.team = JSON.parse(snapshot) as Team;
  }

  // UI state

  // On phones and tablets, "More" shows the team tools, filters, and advanced sets
  isMoreOpen: boolean;

  dialog: { name: DialogName; teamIndex: number } | null = null;

  openDialog(name: DialogName, teamIndex = 0) {
    this.dialog = { name, teamIndex };
  }

  closeDialog() {
    this.dialog = null;
  }

  isSnackbarOpen = false;
  snackbarMessage = "";

  openSnackbar(message: string) {
    this.isSnackbarOpen = true;
    this.snackbarMessage = message;
  }

  private get storedState(): StoredState {
    return {
      teams: this.teams,
      currentTeamId: this.currentTeamId,
      isMoreOpen: this.isMoreOpen,
      sort: this.sort,
    };
  }
}

export default new Store();
