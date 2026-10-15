import moves from "@/data/moves";
import pokedex from "@/data/pokedex";
import formats from "@/data/formats";
import typechart from "@/data/typechart";
import pastGenerations from "@/data/past-generations";
import gameVariants from "@/data/game-variants";
import { LATEST_GENERATION } from "./generations";
import { pokemonNameInverse } from "./names";
import {
  POKEMON_TYPES,
  type Generation,
  type PastTypeChart,
  type PokemonType,
} from "@/types";

// The generation's types, as the type grids list them: 15 in gen 1, 17 until gen 5
export const typesIn = (generation: Generation): readonly PokemonType[] =>
  pastGenerations[generation]?.types ?? POKEMON_TYPES;

// E.g. 'bite' => 'Dark', or 'Normal' in gen 1
export const moveTypeIn = (
  move: string,
  generation = LATEST_GENERATION,
  format = "",
) => {
  const past = pastGenerations[generation];
  return (
    gameVariants[format]?.moves?.[move]?.type ??
    (past && move in past.moves ? past.moves[move] : moves[move]?.type)
  );
};

export const moveDataIn = (
  move: string,
  generation = LATEST_GENERATION,
  format = "",
) =>
  gameVariants[format]?.moves?.[move] ??
  pastGenerations[generation]?.moveData?.[move] ??
  moves[move];

const ownFormatIn = (pokemon: string, generation: Generation) =>
  pastGenerations[generation]?.formats?.[pokemon] ?? formats[pokemon];

// A forme without tiers of its own, such as Arceus-Fire, takes those of the
// species it changes from, as in Showdown's dex-species.ts
export const pokemonFormatIn = (
  pokemon: string,
  generation = LATEST_GENERATION,
) => {
  const format = ownFormatIn(pokemon, generation);
  if (format?.tier || format?.doublesTier) return format;
  const { changesFrom, baseSpecies } = pokedex[pokemon] ?? {};
  const parent = pokemonNameInverse(changesFrom ?? baseSpecies ?? "");
  if (!parent || parent === pokemon) return format;
  const { tier, doublesTier } = ownFormatIn(parent, generation) ?? {};
  return { ...format, tier, doublesTier };
};

// Damage taken by each type from each attacking type. A generation without its
// own chart shares the next one's.
export function typechartIn(generation: Generation): PastTypeChart {
  for (let gen = generation; gen < LATEST_GENERATION; gen++) {
    const chart = pastGenerations[gen]?.typechart;
    if (chart) return chart;
  }
  return typechart;
}
