import moves from "@/data/moves";
import formats from "@/data/formats";
import typechart from "@/data/typechart";
import pastGenerations from "@/data/past-generations";
import { LATEST_GENERATION } from "./generations";
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
export const moveTypeIn = (move: string, generation = LATEST_GENERATION) => {
  const past = pastGenerations[generation];
  return past && move in past.moves ? past.moves[move] : moves[move]?.type;
};

export const moveDataIn = (move: string, generation = LATEST_GENERATION) =>
  pastGenerations[generation]?.moveData?.[move] ?? moves[move];

export const pokemonFormatIn = (
  pokemon: string,
  generation = LATEST_GENERATION,
) => pastGenerations[generation]?.formats?.[pokemon] ?? formats[pokemon];

// Damage taken by each type from each attacking type. A generation without its
// own chart shares the next one's.
export function typechartIn(generation: Generation): PastTypeChart {
  for (let gen = generation; gen < LATEST_GENERATION; gen++) {
    const chart = pastGenerations[gen]?.typechart;
    if (chart) return chart;
  }
  return typechart;
}
