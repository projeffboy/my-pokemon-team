import { makeAutoObservable, configure } from "mobx";
import pokedexData from "./data/pokedex";
import itemsData from "./data/items";
import movesData from "./data/moves";
import type {
  Pokedex,
  Moves,
  Items,
  SearchFilters,
  Team,
} from "./types";
import { completeLearnset, canItLearn, getTeamLearnsets } from "./store/learnsets";
import {
  createTypeScores,
  calculateTypeDefence,
  calculateTypeCoverage,
} from "./store/coverage";
import { filterPokemon } from "./store/filtering";
import {
  typeAgainstPokemon,
  moveType,
  isMoveStrongEnough,
  moveAgainstType,
} from "./store/shared/effectiveness";
import {
  baseForme,
  pokemonNameInverse,
  previousEvolution,
} from "./store/shared/pokemon";
import { createEmptyTeam, getAutoSelectedItem } from "./store/shared/team";

const pokedex: Pokedex = pokedexData;
const moves: Moves = movesData;
const items: Items = itemsData;

// Components mutate the store directly.
configure({ enforceActions: "never" });

class Store {
  constructor() {
    makeAutoObservable(this);
  }

  get cleanSlate() {
    return createTypeScores();
  }

  pokemonType(pokemon: string) {
    return pokedex[pokemon]?.types || [];
  }

  abilities(pokemon: string) {
    return pokedex[pokemon]?.abilities || {};
  }

  // Input a pokemon ID to return its pokemon name
  // E.g. 'squirtle' => 'Squirtle'
  pokemonName(pokemon: string) {
    return pokedex[pokemon]?.name;
  }

  pokemonNameInverse(name: string) {
    return pokemonNameInverse(name);
  }

  baseForme(pokemon: string) {
    return baseForme(pokemon);
  }

  forme(pokemon: string) {
    return pokedex[pokemon]?.forme;
  }

  previousEvolution(pokemon: string) {
    return previousEvolution(pokemon);
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

  itemNameInverse(itemName: string) {
    return this.itemsArr[this.itemNamesArr.indexOf(itemName)];
  }

  completeLearnset(pokemon: string) {
    return completeLearnset(pokemon);
  }

  canItLearn(move: string | undefined, pokemon: string) {
    return canItLearn(move, pokemon);
  }

  // Get the proper name of move
  moveName(move: string) {
    return moves[move]?.name;
  }

  // Inverse function of moveName
  moveNameInverse(moveName: string) {
    for (const move in moves) {
      if (moveName === this.moveName(move)) {
        return move;
      }
    }
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

  // Get the team's six items (in array form)
  get teamItems() {
    return this.team.map(teamPokemonProperties => teamPokemonProperties.item);
  }

  // Get the team's moves that the user chose (in 1D array)
  get teamMoves() {
    const teamMoves: string[] = [];

    this.team.forEach(teamPokemonProperties => {
      teamMoves.push(
        teamPokemonProperties.move1,
        teamPokemonProperties.move2,
        teamPokemonProperties.move3,
        teamPokemonProperties.move4,
      );
    });

    return teamMoves;
  }

  // Basically the above but a 2D array,
  // It's an array of 6 arrays (for each pokemon),
  // Each containing 4 elements (for the 4 moves)
  get teamFourMoveslots() {
    return this.team.map(teamPokemonProperties => [
      teamPokemonProperties.move1,
      teamPokemonProperties.move2,
      teamPokemonProperties.move3,
      teamPokemonProperties.move4,
    ]);
  }

  // Get team's possible abilities (in 2D array)
  get teamAbilities() {
    return this.team.map(teamPokemonProperties => {
      if (teamPokemonProperties.name) {
        const teamPokemonAbilities =
          pokedex[teamPokemonProperties.name]?.abilities || {};

        return Object.values(teamPokemonAbilities) as string[];
      } else {
        return [];
      }
    });
  }

  // Does the team contain moves that inflict non-volatile status?
  // E.g. toxic inflicts poison, thunder wave inflicts paralysis
  get anyStatusMoves() {
    return this.teamMoves.some(
      move =>
        moves[move] &&
        (moves[move].status ||
          (moves[move].secondary &&
            moves[move].secondary.chance === 100 &&
            moves[move].secondary.status)),
    );
  }

  // Does the team contain boosting moves that increase by two or more stages?
  get anyBoostingMoves() {
    return this.teamMoves.some(
      move =>
        move === "curse" ||
        (moves[move] &&
          moves[move].boosts &&
          Object.values(moves[move].boosts).reduce(
            (sum, num) => sum + num,
            0,
          ) >= 2),
    );
  }

  get teamLearnsets() {
    return getTeamLearnsets(this.team, !!this.searchFilters.moves);
  }

  // Get the team's types
  get teamTypes() {
    let teamTypes = [];

    for (const teamPokemonProperties of this.team) {
      const pokemon = teamPokemonProperties.name;

      if (pokemon) {
        const pokemonTypes = pokedex[pokemon]?.types || []; // that pokemon's types

        teamTypes.push(pokemonTypes);
      } else {
        teamTypes.push([]);
      }
    }

    return teamTypes;
  }

  // Does the team have these items?
  doesTeamHaveItems(items: string[]) {
    // array input
    return this.teamItems.some(teamItem => items.includes(teamItem));
  }

  // Does the team have this one particular item?
  doesTeamHaveMove = (move: string) => this.teamMoves.includes(move); // String input

  doesTeamHaveMoves(moves: string[]) {
    return this.teamMoves.some(teamMove => moves.includes(teamMove));
  }

  // Does any team pokemon have all of these moves?
  doesTeamPokemonHaveTheseMoves(moves: (string | string[])[]) {
    return this.teamFourMoveslots.some(teamFourMoveslot =>
      moves.every(move => {
        if (Array.isArray(move)) {
          return move.some(altMove => teamFourMoveslot.includes(altMove));
        } else {
          return teamFourMoveslot.includes(move);
        }
      }),
    );
  }

  // Clear a team pokemon's properties
  clearTeamPokemonProperties(teamIndex: number) {
    const teamPokemonProperties = this.team[teamIndex];

    for (const property in teamPokemonProperties) {
      teamPokemonProperties[property] = "";
    }
  }

  // Auto-select the item if necessary
  // E.g. Select Blastoisite when the user chooses Mega Blastoise
  autoSelectItem() {
    for (const member of this.team) {
      member.item = getAutoSelectedItem(member.name, member.item);
    }
  }

  // Auto select the pokemon's ability if it only has one ability.
  // E.g. Select Thick Fat when the user chooses Venusaur-Mega
  autoSelectAbility() {
    this.teamAbilities.forEach((pokemonAbilities, i) => {
      if (pokemonAbilities.length === 1) {
        this.team[i].ability = pokemonAbilities[0];
      }
    });
  }

  typeAgainstPokemon(
    type: string,
    pokemon: string,
    ability?: string,
    item?: string,
  ) {
    return typeAgainstPokemon(type, pokemon, ability, item);
  }

  moveType(move: string, pokemon: string, ability?: string) {
    return moveType(move, pokemon, ability);
  }

  isMoveStrongEnough(move: string) {
    return isMoveStrongEnough(move);
  }

  moveAgainstType(move: string, type: string, pokemon: string, ability?: string) {
    return moveAgainstType(move, type, pokemon, ability);
  }

  get typeDefence() {
    return calculateTypeDefence(this.team);
  }

  get typeCoverage() {
    return calculateTypeCoverage(this.team);
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
