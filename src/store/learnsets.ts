import { COMBINED_GENERATIONS_FORMAT } from "@/shared/generation-profile";
import { CAP_FORMAT } from "@/shared/formats";
import { viableMovesIn } from "@/data/viable-moves";
import pokedex from "@/data/pokedex";
import { itemNameInverse, pokemonNameInverse } from "@/shared/names";
import { loadGenerationTransferData } from "@/shared/generation-transfer-data";
import { generationBit, generationRules } from "@/shared/generation-rules";
import type {
  Generation,
  GenerationTransferData,
  Learnsets,
  ReadonlyTeam,
} from "@/types";
import { englishNames, type Names } from "@/i18n/names";
import {
  baseForme,
  CAP_BANNED_POKEMON,
  isCapPokemon,
  previousEvolution,
} from "./shared/pokemon";

const completeLearnsets = new Map<string, readonly string[]>();
const legacyLearnsets = new Map<string, readonly string[]>();

// The learnsets are most of the bundled data, so they load after the app instead of blocking it.
// Until then every learnset is empty.
let learnsets: Learnsets = {};
let availability: GenerationTransferData | undefined;
let learnableMoves: Set<string> | undefined;
export const learnsetsReady: Promise<void> = Promise.all([
  loadGenerationTransferData().then(data => {
    availability = data;
    return data;
  }),
  import("@/data/learnsets.json", {
    with: { type: "json" },
  }),
]).then(([data, module]) => {
  availability = data;
  learnsets = module.default;
  learnableMoves = undefined;
  completeLearnsets.clear();
  legacyLearnsets.clear();
});

export function completeLearnset(pokemon: string): readonly string[] {
  let learnset = completeLearnsets.get(pokemon);
  if (!learnset) {
    learnset = Object.freeze(buildCompleteLearnset(pokemon));
    completeLearnsets.set(pokemon, learnset);
  }

  return learnset;
}

// Before formes followed Showdown's inheritance, one with its own learnset but no prevo, such as a
// totem or Bloodmoon Ursaluna, learned its first stage's whole learnset. Links made then can hold
// those moves, so they still load with them.
function legacyLearnset(pokemon: string): readonly string[] {
  let learnset = legacyLearnsets.get(pokemon);
  if (!learnset) {
    learnset = Object.freeze(buildCompleteLearnset(pokemon, true));
    legacyLearnsets.set(pokemon, learnset);
  }

  return learnset;
}

function buildCompleteLearnset(pokemon: string, legacy = false): string[] {
  const completeLearnset: string[] = [];
  const checked = new Set<string>();
  let parent: string | undefined = pokemon;
  while (parent && !checked.has(parent)) {
    checked.add(parent);
    completeLearnset.push(...(learnsets[parent] ?? []));
    parent = learnsetParent(parent, legacy);
  }

  // Sketch copies nearly every move, which the per-game data lists for Smeargle.
  // That data counts Z-Moves, which no pokemon learns, so they are left out.
  if (completeLearnset.includes("sketch")) {
    learnableMoves ??= new Set(Object.values(learnsets).flat());
    completeLearnset.push(
      ...Object.keys(availability?.pokemon[pokemon]?.moves ?? {}).filter(move =>
        learnableMoves?.has(move),
      ),
    );
  }

  return withHiddenPowers(completeLearnset);
}

// Without duplicates, and with Hidden Power of every type but Fairy where it learns Hidden Power
function withHiddenPowers(learnset: string[]): string[] {
  const moves = [...new Set(learnset)];
  if (!moves.includes("hiddenpower")) return moves;
  const types = [
    "bug",
    "dark",
    "dragon",
    "electric",
    "fighting",
    "fire",
    "flying",
    "ghost",
    "grass",
    "ground",
    "ice",
    "poison",
    "psychic",
    "rock",
    "steel",
    "water",
  ];
  return [
    ...moves.filter(move => move !== "hiddenpower"),
    "hiddenpower",
    ...types.map(type => `hiddenpower${type}`),
  ];
}

// The old website's rule, which the moves carried there must pass: a forme's own moves, its
// base forme's unless it is regional, and its prevos', with no Sketch
export function oldWebsiteLearnset(pokemon: string): string[] {
  const regions = ["alola", "galar", "hisui", "paldea"];
  const regional = regions.some(region => pokemon.includes(region));
  const base = baseForme(pokemon) ?? pokemon;
  const learnset = [
    ...(learnsets[pokemon] ?? []),
    ...((!regional && learnsets[base]) || []),
  ];
  for (
    let prevo = previousEvolution(base);
    prevo;
    prevo = previousEvolution(prevo)
  ) {
    // A regional forme's prevos are walked from its base forme, then switched back to a regional
    // forme, e.g. Persian-Alola => Meowth => Meowth-Alola
    const otherFormes = (regional && pokedex[prevo]?.otherFormes) || [];
    const region =
      regions.find(region =>
        otherFormes.some(forme => forme.toLowerCase().includes(region)),
      ) ?? "";
    learnset.push(...(learnsets[`${prevo}${region}`] ?? []));
  }
  return withHiddenPowers(learnset);
}

function learnsetParent(pokemon: string, legacy: boolean): string | undefined {
  const entry = pokedex[pokemon];
  if (!entry) return undefined;
  if (!learnsets[pokemon] && entry.forme) {
    return pokemonNameInverse(entry.changesFrom ?? entry.baseSpecies ?? "");
  }
  if (entry.prevo) return previousEvolution(pokemon);
  if (entry.changesFrom && entry.baseSpecies !== "Kyurem")
    return pokemonNameInverse(entry.changesFrom);
  // Formes such as cap Pikachu and totems inherit only their first stage's Gen 9 egg moves,
  // which the data update adds to their own learnsets.
  return legacy ? legacyFirstStage(pokemon) : undefined;
}

function legacyFirstStage(pokemon: string): string | undefined {
  let base = pokemonNameInverse(pokedex[pokemon]?.baseSpecies ?? "");
  let prevo = base && previousEvolution(base);
  if (!prevo) return undefined;
  while (prevo) {
    base = prevo;
    prevo = previousEvolution(base);
  }
  return base;
}

// Preserve legacy move acceptance; union-only additions apply just to the combined mode.
export const canItLearn = (
  move: string | undefined,
  pokemon: string,
  generation: Generation = 9,
  format = "",
  { acceptLegacyFormeInheritance = false } = {},
): boolean =>
  !!move &&
  ((acceptLegacyFormeInheritance ? legacyLearnset : completeLearnset)(
    pokemon,
  ).includes(move) ||
    (format === COMBINED_GENERATIONS_FORMAT &&
      generationLearnset(pokemon, generation, format).includes(move)));

export function getTeamLearnsets(
  team: ReadonlyTeam,
  viableOnly: boolean,
  names: Names = englishNames,
  generation?: Generation,
  format = "",
) {
  const values = team.map(({ name }) => {
    const learnset =
      name ?
        generation ? generationLearnset(name, generation, format)
        : completeLearnset(name)
      : [];
    return viableOnly ?
        learnset.filter(move => viableMovesIn(generation).has(move))
      : learnset;
  });

  return {
    values,
    labels: values.map(learnset => learnset.map(names.move)),
  };
}

// CAP-only items are in no game, so the CAP format adds those its pokemon need, e.g. Vile Vial
const capFormatItems = new Set(
  Object.entries(pokedex).flatMap(([pokemon, { requiredItem }]) => {
    const item =
      isCapPokemon(pokemon) &&
      pokemon !== CAP_BANNED_POKEMON &&
      requiredItem &&
      itemNameInverse(requiredItem);
    return item ? [item] : [];
  }),
);
export function availableItems(
  items: readonly string[],
  generation: Generation,
  format = "",
) {
  if (!generationRules(generation, format).items) return [];
  const bit = generationBit(generation, format);
  return items.filter(
    item =>
      !!((availability?.items[item] ?? 0) & bit) ||
      (format === CAP_FORMAT && capFormatItems.has(item)),
  );
}
export function availablePokemon(
  pokemon: readonly string[],
  generation: Generation,
  format = "",
) {
  const bit = generationBit(generation, format);
  return pokemon.filter(
    id => !!((availability?.pokemon[id]?.generations ?? 0) & bit),
  );
}
// A past generation's pokemon without those its games lack, e.g. Greninja in Gen 8,
// whose moves would all be missing. Pokemon that learn no moves in any game, such as
// the Pokestars, stay.
export function obtainablePokemon(
  pokemon: readonly string[],
  generation: Generation,
  format = "",
) {
  const available = new Set(availablePokemon(pokemon, generation, format));
  return pokemon.filter(
    id => available.has(id) || !completeLearnset(id).length,
  );
}
export const isItemAvailable = (
  item: string,
  generation: Generation,
  format = "",
) => availableItems([item], generation, format).length > 0;
// Whether any pokemon learns the move in the game. The regular latest-generation editor is
// National Dex, so every move is in it.
export function isMoveAvailable(
  move: string,
  generation: Generation,
  format = "",
) {
  if (generation === 9 && !format) return true;
  const bit = generationBit(generation, format);
  return Object.values(availability?.pokemon ?? {}).some(
    ({ moves }) => !!((moves[move] ?? 0) & bit),
  );
}
// Every move that any of the pokemon learns in the generation
export const generationMoves = (
  pokemon: readonly string[],
  generation: Generation,
  format = "",
) => [
  ...new Set(pokemon.flatMap(id => generationLearnset(id, generation, format))),
];
// CAP pokemon have Gen 9 moves too: those with a Gen 9 source in Showdown's CAP learnsets
export function generationLearnset(
  pokemon: string,
  generation: Generation,
  format = "",
) {
  const complete = completeLearnset(pokemon);
  // The regular latest-generation editor is National Dex; game variants use their native pools.
  if (generation === 9 && !format) return complete;
  const bit = generationBit(generation, format);
  let pool = complete;
  if (format === COMBINED_GENERATIONS_FORMAT) {
    learnableMoves ??= new Set(Object.values(learnsets).flat());
    pool = [
      ...new Set([
        ...complete,
        ...Object.keys(availability?.pokemon[pokemon]?.moves ?? {}).filter(
          move => learnableMoves?.has(move),
        ),
      ]),
    ];
  }
  return pool.filter(
    move =>
      !!(
        (availability?.pokemon[pokemon]?.moves[
          move.startsWith("hiddenpower") ? "hiddenpower" : move
        ] ?? 0) & bit
      ),
  );
}
