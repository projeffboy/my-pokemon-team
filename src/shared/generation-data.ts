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

// Showdown's Gen 3-4 data has no doubles tiers, so it uses the singles tier, and
// Doubles OU there bans Uber and AG except for the unbanned pokemon
const SINGLES_TIER_DOUBLES: Partial<
  Record<Generation, { lastDexNumber: number; unbans: readonly string[] }>
> = {
  3: { lastDexNumber: 386, unbans: ["wobbuffet", "wynaut"] },
  4: {
    lastDexNumber: 493,
    unbans: ["machamp", "manaphy", "mew", "salamence", "wobbuffet", "wynaut"],
  },
};

// The lowest dex number among each pokemon's evolutions, e.g. 'murkrow' => 430
// (Honchkrow). Formes are skipped: up to gen 4, their prevos evolve anyway.
const firstEvolutionNumber = new Map<string, number>();
for (const { prevo, forme, num = 0 } of Object.values(pokedex)) {
  const id = prevo && !forme && num > 0 && pokemonNameInverse(prevo);
  if (id)
    firstEvolutionNumber.set(
      id,
      Math.min(num, firstEvolutionNumber.get(id) ?? num),
    );
}

// E.g. 'garchomp' => 'DUber' in gen 4, and 'salamence' => 'DOU' there
export function doublesTierIn(pokemon: string, generation = LATEST_GENERATION) {
  const { tier, doublesTier } = pokemonFormatIn(pokemon, generation) ?? {};
  const singles = SINGLES_TIER_DOUBLES[generation];
  if (doublesTier || !singles || !tier) return doublesTier;
  if (tier === "Uber" || tier === "AG")
    return singles.unbans.includes(pokemon) ? "DOU" : "DUber";
  // As in later generations, unevolved pokemon stay out of the doubles tiers,
  // even those with a singles tier, like Abra (ZU in gen 3)
  if (tier === "NFE" || tier === "LC") return tier;
  const evolution = firstEvolutionNumber.get(pokemon);
  return evolution && evolution <= singles.lastDexNumber ? "NFE" : "DOU";
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
