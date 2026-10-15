import {
  MOVE_KEYS,
  type Generation,
  type PokemonType,
  type ReadonlyTeam,
  type TeamPokemon,
} from "@/types";
import { typesIn } from "@/shared/generation-data";
import { LATEST_GENERATION } from "@/shared/generations";
import { english, type Translation } from "@/i18n/translation";
import {
  isMoveStrongEnough,
  moveAgainstType,
  moveType,
  typeAgainstPokemon,
  effectivePokemonTypes,
  isTypelessMove,
  IMMUNE_SCORE,
  conversionType,
} from "./shared/effectiveness";

// How hard one attacking type hits one slot, with the reason for the Matrix Analysis tooltip
export interface MatrixCell {
  multiplier: number;
  reason: string;
}

// A row per type of the generation
export type Matrix = Partial<Record<PokemonType, (MatrixCell | null)[]>>;

// Filter-like abilities use half-step scores for their 25% damage reduction.
export function scoreToMultiplier(score: number) {
  if (score === IMMUNE_SCORE) return 0;
  if (score === -1.5) return 3;
  if (score === -0.5) return 1.5;
  return 2 ** -score;
}

// E.g. ×4, ×2, ½, ¼, ⅛, 0, or "" for neutral
export function formatMultiplier(multiplier: number) {
  switch (multiplier) {
    case 1:
      return "";
    case 0.5:
      return "½";
    case 0.25:
      return "¼";
    case 0.125:
      return "⅛";
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
  if (generation >= 3 && ability === "Dry Skin" && type === "Fire") {
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
      team.map(member => {
        const { name, ability, item } = member;
        if (!name) return null;
        const multiplier = against(type, name, ability, item);
        const cause =
          item && against(type, name, ability) !== multiplier ? names.item(item)
          : multiplier !== against(type, name) ? names.ability(ability)
          : undefined;
        const types = effectivePokemonTypes(name, ability, item, generation)
          .map(names.type)
          .join("/");
        const reason = t.matrix.defenceReason(
          names.type(type),
          multiplier,
          names.pokemon(name),
          types,
          cause,
        );
        // The cell keeps the types it switches in with, and notes Conversion's on a second line
        const converted = conversionType(member, generation);
        return {
          multiplier,
          reason:
            converted ?
              `${reason}\n${t.matrix.conversion(names.move("conversion"), names.type(converted))}`
            : reason,
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
  item: string,
  happiness?: number,
  member?: Readonly<TeamPokemon>,
  format = "",
) {
  const score = moveAgainstType(
    move,
    target,
    pokemon,
    ability,
    generation,
    item,
    happiness,
    member,
    format,
  );
  if (score === undefined) return undefined;
  const multiplier = scoreToMultiplier(
    move === "flyingpress" ? score
    : score === 2 ? IMMUNE_SCORE
    : score,
  );
  // Tinted Lens doubles not very effective hits
  return (
      generation >= 4 &&
        ability === "Tinted Lens" &&
        multiplier > 0 &&
        multiplier < 1
    ) ?
      multiplier * 2
    : multiplier;
}

// Each slot's best damaging move against each type
export function coverageMatrix(
  team: ReadonlyTeam,
  { t, names }: Translation = english,
  generation: Generation = LATEST_GENERATION,
  format = "",
): Matrix {
  return Object.fromEntries(
    typesIn(generation).map(target => [
      target,
      team.map(member => {
        const { name, ability, item } = member;
        if (!name) return null;
        const moves = MOVE_KEYS.map(key => member[key]).filter(
          move =>
            move &&
            isMoveStrongEnough(
              move,
              item,
              ability,
              generation,
              name,
              member.happiness,
              member,
              format,
            ),
        );
        let best: { move: string; multiplier: number } | undefined;
        for (const move of moves) {
          const multiplier = moveMultiplier(
            move,
            target,
            name,
            ability,
            generation,
            item,
            member.happiness,
            member,
            format,
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
        const bestType = names.type(
          moveType(
            best.move,
            name,
            ability,
            generation,
            item,
            format,
            member,
          ) ?? "",
        );
        const type =
          isTypelessMove(best.move, generation) ? "???"
          : best.move === "flyingpress" ? `${bestType}/${names.type("Flying")}`
          : bestType;
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
