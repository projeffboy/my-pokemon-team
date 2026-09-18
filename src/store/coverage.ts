import pokedex from "@/data/pokedex";
import type { ReadonlyTeam } from "@/types";
import {
  typeAgainstPokemon,
  moveType,
  isMoveStrongEnough,
  moveAgainstType,
} from "./shared/effectiveness";

export function createTypeScores(): Record<string, number> {
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

export function calculateTypeDefence(team: ReadonlyTeam) {
  const scores = createTypeScores();

  for (const { name, ability, item } of team) {
    if (!name) continue;

    for (const type of Object.keys(scores)) {
      const score = typeAgainstPokemon(type, name, ability, item);
      scores[type] += Math.max(-1.5, Math.min(1.5, score));
    }
  }

  return scores;
}

export function calculateTypeCoverage(team: ReadonlyTeam) {
  const scores = createTypeScores();
  if (!team.some(pokemon => pokemon.name)) return scores;

  for (const pokemon of team) {
    const { name, ability } = pokemon;
    const typesUsed = new Set<string | undefined>();
    const specialMovesUsed = new Set<string>();

    const moves = [pokemon.move1, pokemon.move2, pokemon.move3, pokemon.move4];
    for (const move of moves) {
      if (!move || !isMoveStrongEnough(move)) continue;

      const type = moveType(move, name, ability);
      const isSpecialMove = move === "freezedry" || move === "flyingpress";
      if (isSpecialMove ? specialMovesUsed.has(move) : typesUsed.has(type)) {
        continue;
      }

      const hasStab = type && pokedex[name]?.types?.includes(type);
      for (const target of Object.keys(scores)) {
        if (moveAgainstType(move, target, name, ability) === -1) {
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
