import { COMBINED_GENERATIONS_FORMAT } from "@/shared/generation-profile";
import { viableMovesIn } from "@/data/viable-moves";
import pokedex from "@/data/pokedex";
import { pokemonNameInverse } from "@/shared/names";
import { loadGenerationTransferData } from "@/shared/generation-transfer-data";
import { generationBit, generationRules } from "@/shared/generation-rules";
import type {
  Generation,
  GenerationTransferData,
  Learnsets,
  ReadonlyTeam,
} from "@/types";
import { englishNames, type Names } from "@/i18n/names";
import { previousEvolution } from "./shared/pokemon";

const completeLearnsets = new Map<string, readonly string[]>();

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
});

export function completeLearnset(pokemon: string): readonly string[] {
  let learnset = completeLearnsets.get(pokemon);
  if (!learnset) {
    learnset = Object.freeze(buildCompleteLearnset(pokemon));
    completeLearnsets.set(pokemon, learnset);
  }

  return learnset;
}

function buildCompleteLearnset(pokemon: string): string[] {
  let completeLearnset: string[] = [];
  const checked = new Set<string>();
  let parent: string | undefined = pokemon;
  while (parent && !checked.has(parent)) {
    checked.add(parent);
    completeLearnset.push(...(learnsets[parent] ?? []));
    parent = learnsetParent(parent);
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

  // turning array to set removes duplicates then back to array
  completeLearnset = Array.from(new Set(completeLearnset));

  // Add in all the hidden powers
  if (completeLearnset.includes("hiddenpower")) {
    // hidden power normal is already included by default
    const pokemonTypes = [
      // no hidden power fairy btw
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
    const hiddenpowers = pokemonTypes.map(type => `hiddenpower${type}`);

    // remove hidden power normal
    completeLearnset.splice(completeLearnset.indexOf("hiddenpower"), 1);

    // add all hidden powers together
    completeLearnset.push("hiddenpower");
    completeLearnset.push(...hiddenpowers);
  }

  return completeLearnset;
}

function learnsetParent(pokemon: string): string | undefined {
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
  return undefined;
}

// Preserve legacy move acceptance; union-only additions apply just to the combined mode.
export const canItLearn = (
  move: string | undefined,
  pokemon: string,
  generation: Generation = 9,
  format = "",
): boolean =>
  !!move &&
  (completeLearnset(pokemon).includes(move) ||
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

export function availableItems(
  items: readonly string[],
  generation: Generation,
  format = "",
) {
  if (!generationRules(generation, format).items) return [];
  const bit = generationBit(generation, format);
  return items.filter(item => !!((availability?.items[item] ?? 0) & bit));
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
// Every move that any of the pokemon learns in the generation
export const generationMoves = (
  pokemon: readonly string[],
  generation: Generation,
  format = "",
) => [
  ...new Set(pokemon.flatMap(id => generationLearnset(id, generation, format))),
];
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
