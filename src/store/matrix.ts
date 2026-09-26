import typechart from "@/data/typechart";
import {
  MOVE_KEYS,
  POKEMON_TYPES,
  type PokemonType,
  type ReadonlyTeam,
} from "@/types";
import { moveName, pokemonName } from "@/shared/names";
import { pokemonTypes } from "@/shared/pokedex";
import {
  isMoveStrongEnough,
  moveAgainstType,
  moveType,
  typeAgainstPokemon,
} from "./shared/effectiveness";

// How hard one attacking type hits one slot, with the reason for the Matrix Analysis tooltip
export interface MatrixCell {
  multiplier: number;
  reason: string;
}

export type Matrix = Record<PokemonType, (MatrixCell | null)[]>;

// Defence scores: -2 = 4x, -1 = 2x, 0 = 1x, 1 = 0.5x, 2 = 0.25x, 3 = immune;
// Filter-like abilities give -1.5 = 3x and -0.5 = 1.5x
const MULTIPLIER_BY_SCORE: Record<string, number> = {
  "-2": 4,
  "-1.5": 3,
  "-1": 2,
  "-0.5": 1.5,
  "0": 1,
  "1": 0.5,
  "2": 0.25,
  "3": 0,
};

export const scoreToMultiplier = (score: number) =>
  MULTIPLIER_BY_SCORE[`${score}`] ?? 1;

// E.g. ×4, ×2, ½, ¼, 0, or "" for neutral
export function formatMultiplier(multiplier: number) {
  switch (multiplier) {
    case 1:
      return "";
    case 0.5:
      return "½";
    case 0.25:
      return "¼";
    case 0:
      return "0";
    default:
      return `×${multiplier}`;
  }
}

const typesLabel = (pokemon: string) => pokemonTypes(pokemon).join("/");

export function defenceMatrix(team: ReadonlyTeam): Matrix {
  return Object.fromEntries(
    POKEMON_TYPES.map(type => [
      type,
      team.map(({ name, ability, item }) => {
        if (!name) return null;
        const score = typeAgainstPokemon(type, name, ability, item);
        const multiplier = scoreToMultiplier(score);
        const plain = scoreToMultiplier(typeAgainstPokemon(type, name));
        const cause =
          multiplier === plain ? ""
          : (
            item === "airballoon" &&
            scoreToMultiplier(typeAgainstPokemon(type, name, ability)) !==
              multiplier
          ) ?
            " with Air Balloon"
          : ` with ${ability}`;
        return {
          multiplier,
          reason: `${type} does ${multiplier}x to ${pokemonName(name)} (${typesLabel(name)})${cause}`,
        };
      }),
    ]),
  ) as Matrix;
}

// The multiplier of a move's type against a defending type
function moveMultiplier(
  move: string,
  target: PokemonType,
  pokemon: string,
  ability: string,
) {
  if (move === "flyingpress") {
    const flying = typechart[target].Flying;
    const fighting = typechart[target].Fighting;
    if (flying === 2 || fighting === 2) return 0;
    return scoreToMultiplier(flying) * scoreToMultiplier(fighting);
  }
  const score = moveAgainstType(move, target, pokemon, ability);
  if (score === undefined) return undefined;
  return scoreToMultiplier(score === 2 ? 3 : score);
}

// Each slot's best damaging move against each type
export function coverageMatrix(team: ReadonlyTeam): Matrix {
  return Object.fromEntries(
    POKEMON_TYPES.map(target => [
      target,
      team.map(member => {
        const { name, ability } = member;
        if (!name) return null;
        const moves = MOVE_KEYS.map(key => member[key]).filter(
          move => move && isMoveStrongEnough(move),
        );
        let best: { move: string; multiplier: number } | undefined;
        for (const move of moves) {
          const multiplier = moveMultiplier(move, target, name, ability);
          if (multiplier !== undefined && multiplier > (best?.multiplier ?? -1))
            best = { move, multiplier };
        }
        if (!best) {
          return {
            multiplier: 1,
            reason: `${pokemonName(name)} has no damaging move`,
          };
        }
        const type =
          best.move === "flyingpress" ?
            "Fighting/Flying"
          : (moveType(best.move, name, ability) ?? "");
        return {
          multiplier: best.multiplier,
          reason: `${pokemonName(name)}'s ${moveName(best.move)} (${type}) does ${best.multiplier}x to ${target}`,
        };
      }),
    ]),
  ) as Matrix;
}
