import pokedex from "@/data/pokedex";
import viableMoves from "@/data/viable-moves";
import { loadGenerationTransferData } from "@/shared/generation-transfer-data";
import { generationBit, generationRules } from "@/shared/generation-rules";
import type {
  Generation,
  GenerationTransferData,
  Learnsets,
  ReadonlyTeam,
} from "@/types";
import { englishNames, type Names } from "@/i18n/names";
import { baseForme as getBaseForme, previousEvolution } from "./shared/pokemon";

const REGIONS = ["alola", "galar", "hisui", "paldea"];
const completeLearnsets = new Map<string, readonly string[]>();

// The learnsets are most of the bundled data, so they load after the app instead of blocking it.
// Until then every learnset is empty.
let learnsets: Learnsets = {};
let availability: GenerationTransferData | undefined;
export const learnsetsReady: Promise<void> = Promise.all([
  loadGenerationTransferData(),
  import("@/data/learnsets.json", {
    with: { type: "json" },
  }),
]).then(([data, module]) => {
  availability = data;
  learnsets = module.default;
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
  let completeLearnset: string[] = learnsets[pokemon] ?? [];

  let baseForme = getBaseForme(pokemon) ?? pokemon; // since learnsets[pokemon] requires pokemon to be at its base forme

  const isRegional = REGIONS.some(region => pokemon.includes(region));

  if (!isRegional) {
    completeLearnset = [...completeLearnset, ...(learnsets[baseForme] ?? [])];
  }

  while (true) {
    const prevo = previousEvolution(baseForme);
    if (!prevo) break;
    baseForme = prevo;

    // Regional formes are walked from their base forme, so switch back to the regional prevo
    // E.g. Persian-Alola => Persian => Meowth => Meowth-Alola
    const otherFormes =
      isRegional ? (pokedex[baseForme]?.otherFormes ?? []) : [];
    const region =
      REGIONS.find(region =>
        otherFormes.some(forme => forme.toLowerCase().includes(region)),
      ) ?? "";

    // Append previous evolution learnset to current learnset
    completeLearnset = [
      ...completeLearnset,
      ...(learnsets[`${baseForme}${region}`] ?? []),
    ];
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

// Can `pokemon` learn `move`?
export const canItLearn = (
  move: string | undefined,
  pokemon: string,
): boolean => (move ? completeLearnset(pokemon).includes(move) : false);

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
        learnset.filter(move => viableMoves.has(move))
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
export function generationLearnset(
  pokemon: string,
  generation: Generation,
  format = "",
) {
  const complete = completeLearnset(pokemon);
  // The regular latest-generation editor is National Dex; game variants use their native pools.
  if (generation === 9 && !format) return complete;
  const bit = generationBit(generation, format);
  return complete.filter(
    move =>
      !!(
        (availability?.pokemon[pokemon]?.moves[
          move.startsWith("hiddenpower") ? "hiddenpower" : move
        ] ?? 0) & bit
      ),
  );
}
