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
import { pokemonNameInverse } from "@/shared/names";

const REGIONS = ["alola", "galar", "hisui", "paldea"];
const completeLearnsets = new Map<string, readonly string[]>();

// The learnsets are most of the bundled data, so they load after the app instead of blocking it.
// Until then every learnset is empty.
let learnsets: Learnsets = {};
let availability: GenerationTransferData | undefined;
let learnableMoves: Set<string> | undefined;
export const learnsetsReady: Promise<void> = Promise.all([
  loadGenerationTransferData(),
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

// The forme that a forme of a forme is based on, e.g. Darmanitan-Galar for
// Darmanitan-Galar-Zen, and Urshifu-Rapid-Strike for its Gigantamax
function parentForme(pokemon: string) {
  const { baseSpecies, forme } = pokedex[pokemon] ?? {};
  if (!baseSpecies || !forme) return undefined;
  const parts = forme.split("-");
  while (parts.length > 1) {
    parts.pop();
    const parent = pokemonNameInverse(`${baseSpecies}-${parts.join("-")}`);
    if (parent) return parent;
  }
  return undefined;
}

// The pokemon whose learnsets `pokemon` inherits, itself first
function learnsetSources(pokemon: string, isPrevo = false): string[] {
  const parent = parentForme(pokemon);
  if (parent) return [pokemon, ...learnsetSources(parent)];

  const baseForme = getBaseForme(pokemon);
  const isRegional = REGIONS.some(region => pokemon.includes(region));
  // Other formes also learn their base forme's moves. A regional forme does not:
  // its line is its own, e.g. Pikachu for Raichu-Alola and Meowth-Alola for Persian-Alola.
  // Nor does a forme that something evolves from, e.g. Basculegion's White-Striped Basculin.
  if (baseForme && !isRegional && !isPrevo)
    return [pokemon, ...learnsetSources(baseForme)];

  let prevo = previousEvolution(pokemon);
  // A forme without a line of its own follows its base forme's, in its region where there is one
  const basePrevo =
    prevo || !baseForme ? undefined : previousEvolution(baseForme);
  if (basePrevo) {
    const otherFormes = pokedex[basePrevo]?.otherFormes ?? [];
    const region =
      REGIONS.find(region =>
        otherFormes.some(forme => forme.toLowerCase().includes(region)),
      ) ?? "";
    prevo = `${basePrevo}${region}`;
  }
  return [pokemon, ...(prevo ? learnsetSources(prevo, true) : [])];
}

function buildCompleteLearnset(pokemon: string): string[] {
  let completeLearnset = learnsetSources(pokemon).flatMap(
    source => learnsets[source] ?? [],
  );

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
  return complete.filter(
    move =>
      !!(
        (availability?.pokemon[pokemon]?.moves[
          move.startsWith("hiddenpower") ? "hiddenpower" : move
        ] ?? 0) & bit
      ),
  );
}
