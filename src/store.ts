import { makeAutoObservable, configure } from "mobx";
import type { SearchFilters, Team } from "./types";
import { MOVE_KEYS } from "./types";
import { getTeamLearnsets, learnsetsReady } from "./store/learnsets";
import { calculateTypeDefence, calculateTypeCoverage } from "./store/coverage";
import { filterPokemon } from "./store/filtering";
import { evaluateChecklist } from "./store/checklist";
import {
  createEmptyTeam,
  getAutoSelectedAbility,
  getAutoSelectedItem,
} from "./shared/team";
import { pokemonName } from "./shared/names";
import { pokemonAbilities } from "./shared/pokedex";

// Components mutate the store directly.
configure({ enforceActions: "never" });

class Store {
  constructor() {
    makeAutoObservable(this);
    learnsetsReady.then(
      () => {
        this.learnsetsLoaded = true;
      },
      () =>
        this.openSnackbar(
          "The move lists could not be loaded. Reload the page to try again.",
        ),
    );
  }

  learnsetsLoaded = false;

  team: Team = createEmptyTeam();

  replaceTeam(team: Team) {
    this.team = team;
  }

  get teamPokemon() {
    return this.team.map(({ name }) => name);
  }

  get isTeamEmpty() {
    return !this.teamPokemon.some(pokemon => pokemon);
  }

  get teamAbilities() {
    return this.team.map(({ name }) => pokemonAbilities(name));
  }

  // A boolean computed, so typing in the move filter does not rebuild the learnsets on every keystroke
  get viableMovesOnly() {
    return !!this.searchFilters.moves;
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

  searchFilters: SearchFilters = {
    format: "",
    region: "",
    type: "",
    moves: "",
  };

  get filteredPokemon() {
    return filterPokemon(this.searchFilters);
  }

  get filteredPokemonNames() {
    return this.filteredPokemon.map(pokemonName);
  }

  isSnackbarOpen = false;
  snackbarMessage = "";

  openSnackbar(message: string) {
    this.isSnackbarOpen = true;
    this.snackbarMessage = message;
  }
}

export default new Store();
