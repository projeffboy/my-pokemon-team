import { makeAutoObservable, configure } from "mobx";
import pokedex from "./data/pokedex";
import items from "./data/items";
import moves from "./data/moves";
import type { SearchFilters, Team } from "./types";
import { MOVE_KEYS, isPokemonType } from "./types";
import { getTeamLearnsets } from "./store/learnsets";
import { calculateTypeDefence, calculateTypeCoverage } from "./store/coverage";
import { filterPokemon } from "./store/filtering";
import { evaluateChecklist } from "./store/checklist";
import { createEmptyTeam, getAutoSelectedItem } from "./shared/team";

// Components mutate the store directly.
configure({ enforceActions: "never" });

class Store {
  constructor() {
    makeAutoObservable(this);
  }

  pokemonType(pokemon: string) {
    return pokedex[pokemon]?.types?.filter(isPokemonType) || [];
  }

  abilities(pokemon: string) {
    return pokedex[pokemon]?.abilities || {};
  }

  // Input a pokemon ID to return its pokemon name
  // E.g. 'squirtle' => 'Squirtle'
  pokemonName(pokemon: string) {
    return pokedex[pokemon]?.name;
  }

  get itemsArr() {
    return Object.keys(items);
  }

  get itemNamesArr() {
    return Object.values(items).map(itemProperties => itemProperties.name);
  }

  itemName(item: string) {
    return items[item]?.name || "";
  }

  // Get the proper name of move
  moveName(move: string) {
    return moves[move]?.name;
  }

  team: Team = createEmptyTeam();

  replaceTeam(team: Team) {
    this.team = team;
  }

  // Get the team's six pokemon id/name (pokemon)
  get teamPokemon() {
    return this.team.map(teamPokemonProperties => teamPokemonProperties.name);
  }

  // Check if team is empty
  get isTeamEmpty() {
    return !this.teamPokemon.some(pokemon => pokemon);
  }

  // Get team's possible abilities (in 2D array)
  get teamAbilities() {
    return this.team.map(({ name }) => Object.values(this.abilities(name)));
  }

  get teamLearnsets() {
    return getTeamLearnsets(this.team, !!this.searchFilters.moves);
  }

  // Clear a team pokemon's properties
  clearTeamPokemonProperties(teamIndex: number) {
    const teamPokemonProperties = this.team[teamIndex];

    if (!teamPokemonProperties) return;
    teamPokemonProperties.name = "";
    teamPokemonProperties.item = "";
    teamPokemonProperties.ability = "";
    for (const key of MOVE_KEYS) teamPokemonProperties[key] = "";
  }

  // Auto-select the item if necessary
  // E.g. Select Blastoisinite when the user chooses Mega Blastoise
  autoSelectItem() {
    for (const member of this.team) {
      member.item = getAutoSelectedItem(member.name, member.item);
    }
  }

  // Auto select the pokemon's ability if it only has one ability.
  // E.g. Select Thick Fat when the user chooses Venusaur-Mega
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
    return this.filteredPokemon.map(pokemon => this.pokemonName(pokemon));
  }

  isSnackbarOpen = false;
  snackbarMsg = "";

  openSnackbar(msg: string) {
    this.isSnackbarOpen = true;
    this.snackbarMsg = msg;
  }
}

export default new Store();
