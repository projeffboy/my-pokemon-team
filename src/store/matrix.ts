import {
  MOVE_KEYS,
  type Generation,
  type PokemonType,
  type ReadonlyTeam,
} from "@/types";
import { pokemonTypes } from "@/shared/pokedex";
import { typesIn } from "@/shared/generation-data";
import { LATEST_GENERATION } from "@/shared/generations";
import { english, type Translation } from "@/i18n/translation";
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

// A row per type of the generation
export type Matrix = Partial<Record<PokemonType, (MatrixCell | null)[]>>;

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

export function defenceMultiplier(
  type: PokemonType,
  pokemon: string,
  ability = "",
  item = "",
  generation = LATEST_GENERATION,
) {
  if (ability === "Dry Skin" && type === "Fire") {
    return (
      scoreToMultiplier(
        typeAgainstPokemon(type, pokemon, "", item, generation),
      ) * 1.25
    );
  }
  return scoreToMultiplier(
    typeAgainstPokemon(type, pokemon, ability, item, generation),
  );
}

export function defenceMatrix(
  team: ReadonlyTeam,
  { t, names }: Translation = english,
  generation: Generation = LATEST_GENERATION,
): Matrix {
  const against = (type: PokemonType, name: string, ability = "", item = "") =>
    defenceMultiplier(type, name, ability, item, generation);
  return Object.fromEntries(
    typesIn(generation).map(type => [
      type,
      team.map(({ name, ability, item }) => {
        if (!name) return null;
        const multiplier = against(type, name, ability, item);
        const cause =
          multiplier === against(type, name) ? undefined
          : (
            item === "airballoon" && against(type, name, ability) !== multiplier
          ) ?
            names.item(item)
          : names.ability(ability);
        const types = pokemonTypes(name, generation).map(names.type).join("/");
        return {
          multiplier,
          reason: t.matrix.defenceReason(
            names.type(type),
            multiplier,
            names.pokemon(name),
            types,
            cause,
          ),
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
  generation: Generation,
) {
  const score = moveAgainstType(move, target, pokemon, ability, generation);
  if (score === undefined) return undefined;
  return scoreToMultiplier(
    move === "flyingpress" ? score
    : score === 2 ? 3
    : score,
  );
}

// Each slot's best damaging move against each type
export function coverageMatrix(
  team: ReadonlyTeam,
  { t, names }: Translation = english,
  generation: Generation = LATEST_GENERATION,
): Matrix {
  return Object.fromEntries(
    typesIn(generation).map(target => [
      target,
      team.map(member => {
        const { name, ability } = member;
        if (!name) return null;
        const moves = MOVE_KEYS.map(key => member[key]).filter(
          move => move && isMoveStrongEnough(move),
        );
        let best: { move: string; multiplier: number } | undefined;
        for (const move of moves) {
          const multiplier = moveMultiplier(
            move,
            target,
            name,
            ability,
            generation,
          );
          if (multiplier !== undefined && multiplier > (best?.multiplier ?? -1))
            best = { move, multiplier };
        }
        if (!best) {
          return {
            multiplier: 1,
            reason: t.matrix.noDamagingMove(names.pokemon(name)),
          };
        }
        const type =
          best.move === "flyingpress" ?
            `${names.type(moveType(best.move, name, ability, generation) ?? "")}/${names.type("Flying")}`
          : names.type(moveType(best.move, name, ability, generation) ?? "");
        return {
          multiplier: best.multiplier,
          reason: t.matrix.coverageReason(
            names.pokemon(name),
            names.move(best.move),
            type,
            best.multiplier,
            names.type(target),
          ),
        };
      }),
    ]),
  ) as Matrix;
}
