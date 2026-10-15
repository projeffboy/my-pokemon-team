import { type PokemonType, type ReadonlyTeam } from "@/types";
import { typesIn } from "@/shared/generation-data";
import { LATEST_GENERATION } from "@/shared/generations";
import {
  typeAgainstPokemon,
  moveType,
  isMoveStrongEnough,
  isTypelessMove,
  moveAgainstType,
  effectivePokemonTypes,
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
    const typesUsed = new Map<PokemonType | undefined, Set<PokemonType>>();

    const moves = [pokemon.move1, pokemon.move2, pokemon.move3, pokemon.move4];
    for (const move of moves) {
      if (
        !move ||
        isTypelessMove(move, generation) ||
        !isMoveStrongEnough(
          move,
          item,
          ability,
          generation,
          name,
          pokemon.happiness,
          pokemon,
          format,
        )
      )
        continue;

      const type = moveType(move, name, ability, generation, item, format);
      // Flying Press is also a Flying move, so it shares its targets with Flying moves
      const groups = new Set([
        type,
        ...(move === "flyingpress" ? ["Flying" as const] : []),
      ]);
      const targetSets = [...groups].map(group => {
        const targets = typesUsed.get(group) ?? new Set<PokemonType>();
        typesUsed.set(group, targets);
        return targets;
      });

      const hasStab =
        type &&
        effectivePokemonTypes(name, ability, item, generation).includes(type);
      for (const target of typesIn(generation)) {
        if (
          moveAgainstType(
            move,
            target,
            name,
            ability,
            generation,
            item,
            pokemon.happiness,
            pokemon,
            format,
          ) === -1
        ) {
          // Moves of one type, such as Ice Beam and Freeze-Dry, count each target once
          if (!targetSets.some(targets => targets.has(target)))
            scores[target] += hasStab ? 2 : 1;
          for (const targets of targetSets) targets.add(target);
        }
      }
    }
  }

  return scores;
}
