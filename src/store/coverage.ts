import { type PokemonType, type ReadonlyTeam } from "@/types";
import { pokemonTypes } from "@/shared/pokedex";
import { typesIn } from "@/shared/generation-data";
import { LATEST_GENERATION } from "@/shared/generations";
import {
  typeAgainstPokemon,
  moveType,
  isMoveStrongEnough,
  moveAgainstType,
} from "./shared/effectiveness";

export function createTypeScores(): Record<PokemonType, number> {
  return {
    Bug: 0,
    Dark: 0,
    Dragon: 0,
    Electric: 0,
    Fairy: 0,
    Fighting: 0,
    Fire: 0,
    Flying: 0,
    Ghost: 0,
    Grass: 0,
    Ground: 0,
    Ice: 0,
    Normal: 0,
    Poison: 0,
    Psychic: 0,
    Rock: 0,
    Steel: 0,
    Water: 0,
  };
}

export function calculateTypeDefence(
  team: ReadonlyTeam,
  generation = LATEST_GENERATION,
) {
  const scores = createTypeScores();

  for (const { name, ability, item } of team) {
    if (!name) continue;

    for (const type of typesIn(generation)) {
      const score = typeAgainstPokemon(type, name, ability, item, generation);
      scores[type] += Math.max(-1.5, Math.min(1.5, score));
    }
  }

  return scores;
}

export function calculateTypeCoverage(
  team: ReadonlyTeam,
  generation = LATEST_GENERATION,
  format = "",
) {
  const scores = createTypeScores();
  if (!team.some(pokemon => pokemon.name)) return scores;

  for (const pokemon of team) {
    const { name, ability, item } = pokemon;
    const typesUsed = new Set<PokemonType | undefined>();
    const specialMovesUsed = new Set<string>();

    const moves = [pokemon.move1, pokemon.move2, pokemon.move3, pokemon.move4];
    for (const move of moves) {
      if (!move || !isMoveStrongEnough(move, generation, format, item, ability))
        continue;

      const type = moveType(move, name, ability, generation, format, item);
      const isSpecialMove = move === "freezedry" || move === "flyingpress";
      if (isSpecialMove ? specialMovesUsed.has(move) : typesUsed.has(type)) {
        continue;
      }

      const hasStab = type && pokemonTypes(name, generation).includes(type);
      for (const target of typesIn(generation)) {
        if (
          moveAgainstType(
            move,
            target,
            name,
            ability,
            generation,
            format,
            item,
          ) === -1
        ) {
          scores[target] += hasStab ? 2 : 1;
        }
      }

      if (isSpecialMove) {
        specialMovesUsed.add(move);
      } else {
        typesUsed.add(type);
      }
    }
  }

  return scores;
}
