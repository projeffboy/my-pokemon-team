import { makeAutoObservable, configure } from "mobx";
import type { SearchFilters, Team } from "./types";
import { MOVE_KEYS } from "./types";
import { getTeamLearnsets } from "./store/learnsets";
import { calculateTypeDefence, calculateTypeCoverage } from "./store/coverage";
import { filterPokemon } from "./store/filtering";
import { evaluateChecklist } from "./store/checklist";
import { createEmptyTeam, getAutoSelectedItem } from "./shared/team";
import { pokemonName } from "./shared/names";
import { pokemonAbilities } from "./shared/pokedex";

// Components mutate the store directly.
configure({ enforceActions: "never" });

class Store {
  constructor() {
    makeAutoObservable(this);
  }

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

  get teamLearnsets() {
    return getTeamLearnsets(this.team, !!this.searchFilters.moves);
  }

  clearTeamPokemonProperties(teamIndex: number) {
    const member = this.team[teamIndex];

    if (!member) return;
    member.name = "";
    member.item = "";
    member.ability = "";
    for (const key of MOVE_KEYS) member[key] = "";
  }

  // E.g. select Blastoisinite when the user chooses Blastoise-Mega
  autoSelectItem() {
    for (const member of this.team) {
      member.item = getAutoSelectedItem(member.name, member.item);
    }
  }

  // E.g. select Thick Fat when the user chooses Venusaur-Mega, its only ability
  autoSelectAbility() {
    this.teamAbilities.forEach((pokemonAbilities, i) => {
      const member = this.team[i];
      const ability = pokemonAbilities[0];
      if (member && pokemonAbilities.length === 1 && ability !== undefined) {
        member.ability = ability;
      }
    });
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
