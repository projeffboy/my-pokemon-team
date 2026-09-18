import learnsets from "@/data/learnsets";
import pokedexData from "@/data/pokedex";
import moves from "@/data/moves";
import oldMovesData from "@/data/old-moves";
import type { Pokedex, OldMoves, ReadonlyTeam } from "@/types";
import { baseForme as getBaseForme, previousEvolution } from "./shared/pokemon";

const pokedex: Pokedex = pokedexData;

const oldMoves: OldMoves = oldMovesData;

export function completeLearnset(pokemon: string): string[] {
  let completeLearnset: string[] = learnsets[pokemon] || [];

  let baseForme = getBaseForme(pokemon) || pokemon; // since learnsets[pokemon] requires pokemon to be at its base forme

  let isRegional = false;

  if (
    pokemon.includes("alola") ||
    pokemon.includes("galar") ||
    pokemon.includes("hisui") ||
    pokemon.includes("paldea")
  ) {
    isRegional = true;
  } else {
    completeLearnset = [...completeLearnset, ...(learnsets[baseForme] || [])];
  }

  while (true) {
    const prevo = previousEvolution(baseForme);
    if (!prevo) break;
    baseForme = prevo;
    baseForme = baseForme
      .replace("\u2019", "") // sirfetch'd
      .replace(".", "") // fixes the mr. mime family
      .replace("é", "e")
      .replace("é", "e")
      .replace("-", "");

    let region = "";
    const pokemonFormeEntry = pokedex[baseForme];
    if (isRegional && pokemonFormeEntry?.otherFormes) {
      const otherFormes = pokemonFormeEntry.otherFormes;
      if (otherFormes.some(forme => forme.includes("Alola"))) {
        region = "alola";
      } else if (otherFormes.some(forme => forme.includes("Galar"))) {
        region = "galar";
      } else if (otherFormes.some(forme => forme.includes("Hisui"))) {
        region = "hisui";
      } else if (otherFormes.some(forme => forme.includes("Paldea"))) {
        region = "paldea";
      }
    }
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
export const canItLearn = (move: string | undefined, pokemon: string): boolean =>
  move ? completeLearnset(pokemon).includes(move) : false;

export function getTeamLearnsets(team: ReadonlyTeam, viableOnly: boolean) {
  const values = team.map(({ name }) => {
    const learnset = name ? completeLearnset(name) : [];
    return viableOnly ? learnset.filter(move => oldMoves[move]?.isViable) : learnset;
  });

  return {
    values,
    labels: values.map(learnset => learnset.map(move => moves[move]?.name)),
  };
}
