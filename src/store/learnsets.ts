import learnsets from "@/data/learnsets";
import pokedex from "@/data/pokedex";
import moves from "@/data/moves";
import viableMoves from "@/data/viable-moves";
import type { ReadonlyTeam } from "@/types";
import { baseForme as getBaseForme, previousEvolution } from "./shared/pokemon";

const REGIONS = ["alola", "galar", "hisui", "paldea"];
const completeLearnsets = new Map<string, readonly string[]>();

export function completeLearnset(pokemon: string): readonly string[] {
  let learnset = completeLearnsets.get(pokemon);
  if (!learnset) {
    learnset = Object.freeze(buildCompleteLearnset(pokemon));
    completeLearnsets.set(pokemon, learnset);
  }

  return learnset;
}

function buildCompleteLearnset(pokemon: string): string[] {
  let completeLearnset: string[] = learnsets[pokemon] || [];

  let baseForme = getBaseForme(pokemon) || pokemon; // since learnsets[pokemon] requires pokemon to be at its base forme

  const isRegional = REGIONS.some(region => pokemon.includes(region));

  if (!isRegional) {
    completeLearnset = [...completeLearnset, ...(learnsets[baseForme] || [])];
  }

  while (true) {
    const prevo = previousEvolution(baseForme);
    if (!prevo) break;
    baseForme = prevo;

    // Regional formes are walked from their base forme, so switch back to the regional prevo
    // E.g. Persian-Alola => Persian => Meowth => Meowth-Alola
    const otherFormes = (isRegional && pokedex[baseForme]?.otherFormes) || [];
    const region =
      REGIONS.find(region =>
        otherFormes.some(forme => forme.toLowerCase().includes(region)),
      ) ?? "";

    // Append previous evolution learnset to current learnset
    completeLearnset = [
      ...completeLearnset,
      ...(learnsets[baseForme + region] || []),
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
    const hiddenpowers = pokemonTypes.map(type => "hiddenpower" + type);

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

export function getTeamLearnsets(team: ReadonlyTeam, viableOnly: boolean) {
  const values = team.map(({ name }) => {
    const learnset = name ? completeLearnset(name) : [];
    return viableOnly ?
        learnset.filter(move => viableMoves.has(move))
      : learnset;
  });

  return {
    values,
    labels: values.map(learnset => learnset.map(move => moves[move]?.name)),
  };
}
