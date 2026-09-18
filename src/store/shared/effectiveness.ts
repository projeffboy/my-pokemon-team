import type { Pokedex, Moves, PokemonType } from "@/types";
import pokedexData from "@/data/pokedex";
import movesData from "@/data/moves";
import typechart from "@/data/typechart";
import { isPokemonType } from "@/types";

const pokedex: Pokedex = pokedexData;
const moves: Moves = movesData;

// Defence scores: -2 = 4x, -1 = 2x, 0 = 1x, 1 = 0.5x, 2 = 0.25x, 3 = immune.
export function typeAgainstPokemon(
  type: PokemonType,
  pokemon: string,
  pokemonAbility?: string,
  item?: string,
) {
  const pokemonTypes = pokedex[pokemon]?.types || [];
  const [type1, type2] = pokemonTypes;
  const type1Resistance = type1 && isPokemonType(type1) ? typechart[type1][type] : 0;

  let effectiveness = type1Resistance;

  if (type2) {
    const type2Resistance = isPokemonType(type2) ? typechart[type2][type] : 0;

    if (type1Resistance === 2 || type2Resistance === 2) {
      effectiveness = 3;
    } else {
      effectiveness += type2Resistance;
    }
  } else if (effectiveness === 2) {
    effectiveness = 3;
  }

  // Take into account ability for pokemon's resistances
  if (pokemonAbility) {
    switch (pokemonAbility) {
      // Abilities that make you immune to certain types
      case "Volt Absorb":
      case "Lightning Rod":
      case "Motor Drive":
        if (type === "Electric") {
          effectiveness = 3;
        }
        break;
      case "Flash Fire":
      case "Well-Baked Body":
        if (type === "Fire") {
          effectiveness = 3;
        }
        break;
      case "Sap Sipper":
        if (type === "Grass") {
          effectiveness = 3;
        }
        break;
      case "Levitate":
      case "Eelevate":
      case "Earth Eater":
        if (type === "Ground") {
          effectiveness = 3;
        }
        break;
      case "Water Absorb":
      case "Storm Drain":
        if (type === "Water") {
          effectiveness = 3;
        }
        break;
      case "Water Bubble":
        if (type === "Fire") {
          effectiveness += 1;
        }
        break;
      case "Wonder Guard":
        if (effectiveness >= 0) {
          effectiveness = 3;
        }
        break;
      // Abilities that halve damage from certain types
      case "Thick Fat":
        if (type === "Fire" || type === "Ice") {
          effectiveness += 1;
        }
        break;
      case "Heatproof":
        if (type === "Fire") {
          effectiveness += 1;
        }
        break;
      // Abilities that cushion moves
      case "Solid Rock":
      case "Filter":
      case "Prism Armor":
        if (effectiveness === -1) {
          effectiveness = -0.5;
        } else if (effectiveness === -2) {
          effectiveness = -1.5;
        }
        break;
      case "Fluffy":
        if (type === "Fire") {
          effectiveness -= 1;
        }
        break;
      case "Dry Skin":
        if (type === "Fire") {
          effectiveness -= 1;
        } else if (type === "Water") {
          effectiveness = 3;
        }
        break;
      case "Purifying Salt":
        if (type === "Ghost") {
          effectiveness += 1;
        }
        break;
      default:
    }
  }

  // If pokemon wields an air balloon
  if (
    item &&
    item === "airballoon" &&
    type === "Ground" &&
    effectiveness < 2
  ) {
    effectiveness += 1;
  }

  return effectiveness;
}

// Tells you the move's type based on the pokemon using it and its ability
// E.g. Arceus-Bug using Judgment or Aerilate Mega-Pinsir using Return.
export function moveType(move: string, pokemon: string, ability?: string) {
  const rawType = moves[move]?.type;
  let moveType: PokemonType | undefined =
    rawType && isPokemonType(rawType) ? rawType : undefined;

  const abilitiesThatChangeNormalMoves: Record<string, PokemonType> = {
    Aerilate: "Flying",
    Pixilate: "Fairy",
    Refrigerate: "Ice",
    Galvanize: "Electric",
  };

  if (
    ability &&
    abilitiesThatChangeNormalMoves[ability] &&
    moveType === "Normal"
  ) {
    moveType = abilitiesThatChangeNormalMoves[ability] || moveType;
  } else if (ability === "Normalize") {
    moveType = "Normal";
  } else if (move === "judgment") {
    const pokemonProperties = pokedex[pokemon];
    moveType =
      pokemonProperties?.types?.find(isPokemonType) ?? moveType;
  } else if (move === "ivycudgel") {
    const pokemonProperties = pokedex[pokemon];
    moveType =
      pokemonProperties?.types?.filter(isPokemonType).at(-1) ?? moveType;
  } else if (move === "technoblast") {
    // For Genesect
    switch (pokemon) {
      case "genesectdouse":
        moveType = "Water";
        break;
      case "genesectshock":
        moveType = "Electric";
        break;
      case "genesectburn":
        moveType = "Fire";
        break;
      case "genesectchill":
        moveType = "Ice";
        break;
      default:
    }
  } else if (move === "multiattack") {
    // For Silvally
    const type = pokemon.replace("silvally", "") || "normal";
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);

    if (isPokemonType(capitalizedType)) moveType = capitalizedType;
  } else if (
    ability === "Liquid Voice" &&
    moves[move]?.flags?.sound === 1
  ) {
    moveType = "Water";
  }

  return moveType;
}

export function isMoveStrongEnough(move: string) {
  const moveProperties = moves[move];

  return (
    moveProperties &&
    moveProperties.category !== "Status" &&
    (Number(moveProperties.basePower || 0) >= 40 ||
      moveProperties.multihit ||
      moveProperties.basePowerCallback ||
      moveProperties.onModifyMove)
  );
}

// Tells you the effectiveness of a move against a type
// For status and weak moves, this function will return undefined
export function moveAgainstType(
  move: string,
  typeAgainst: PokemonType,
  pokemon: string,
  ability?: string,
) {
  const attackType = moveType(move, pokemon, ability);

  if (move === "freezedry" && typeAgainst === "Water") {
    return -1;
  } else if (move === "flyingpress") {
    // since flying press is part flying and fighting
    return typechart[typeAgainst].Flying + typechart[typeAgainst].Fighting;
  } else if (isMoveStrongEnough(move)) {
    return attackType ?
        (typechart[typeAgainst]?.[attackType] ?? undefined)
      : undefined;
  }
}
