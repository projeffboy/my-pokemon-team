import moves from "@/data/moves";
import formats from "@/data/formats";
import typechart from "@/data/typechart";
import pastGenerations from "@/data/past-generations";
import gameVariants from "@/data/game-variants";
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

export const pokemonFormatIn = (
  pokemon: string,
  generation = LATEST_GENERATION,
) => pastGenerations[generation]?.formats?.[pokemon] ?? formats[pokemon];

// Showdown's Gen 3-4 data has no doubles tiers, so it uses the singles tier, and
// Doubles OU there bans Uber and AG except for these pokemon
const SINGLES_TIER_DOUBLES_OU_UNBANS: Partial<
  Record<Generation, readonly string[]>
> = {
  3: ["wobbuffet", "wynaut"],
  4: ["machamp", "manaphy", "mew", "salamence", "wobbuffet", "wynaut"],
};

// E.g. 'garchomp' => 'DUber' in gen 4, and 'salamence' => 'DOU' there
export function doublesTierIn(pokemon: string, generation = LATEST_GENERATION) {
  const { tier, doublesTier } = pokemonFormatIn(pokemon, generation) ?? {};
  const unbans = SINGLES_TIER_DOUBLES_OU_UNBANS[generation];
  if (doublesTier || !unbans || !tier) return doublesTier;
  if (tier === "Uber" || tier === "AG")
    return unbans.includes(pokemon) ? "DOU" : "DUber";
  // As in later generations, unevolved pokemon stay out of the doubles tiers
  return tier === "NFE" || tier === "LC" ? tier : "DOU";
}

// Damage taken by each type from each attacking type. A generation without its
// own chart shares the next one's.
export function typechartIn(generation: Generation): PastTypeChart {
  for (let gen = generation; gen < LATEST_GENERATION; gen++) {
    const chart = pastGenerations[gen]?.typechart;
    if (chart) return chart;
  }
  return typechart;
}
