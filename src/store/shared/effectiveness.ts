import type { PokemonType } from "@/types";
import moves from "@/data/moves";
import { pokemonTypes } from "@/shared/pokedex";
import { moveDataIn, moveTypeIn, typechartIn } from "@/shared/generation-data";
import { LATEST_GENERATION } from "@/shared/generations";
import { isPokemonType } from "@/types";

// Defence scores: -2 = 4x, -1 = 2x, 0 = 1x, 1 = 0.5x, 2 = 0.25x,
// 3 = immune, 4 = 0.125x.
// The generation decides the pokemon's types and the type chart.
export function typeAgainstPokemon(
  type: PokemonType,
  pokemon: string,
  pokemonAbility?: string,
  item?: string,
  generation = LATEST_GENERATION,
) {
  if (generation < 3) pokemonAbility = undefined;
  if (generation < 2) item = undefined;
  const typechart = typechartIn(generation);
  const [type1, type2] = pokemonTypes(pokemon, generation);
  const type1Resistance = type1 ? (typechart[type1]?.[type] ?? 0) : 0;

  let effectiveness = type1Resistance;

  if (type2) {
    const type2Resistance = typechart[type2]?.[type] ?? 0;

    if (type1Resistance === 2 || type2Resistance === 2) {
      effectiveness = 3;
    } else {
      effectiveness += type2Resistance;
    }
  } else if (effectiveness === 2) {
    effectiveness = 3;
  }

  const halveDamage = () => {
    if (effectiveness !== 3)
      effectiveness = effectiveness === 2 ? 4 : effectiveness + 1;
  };

  // Take into account ability for pokemon's resistances
  if (pokemonAbility) {
    switch (pokemonAbility) {
      // Abilities that make you immune to certain types
      case "Volt Absorb":
      case "Lightning Rod":
      case "Motor Drive":
        if (
          type === "Electric" &&
          (pokemonAbility !== "Lightning Rod" || generation >= 5)
        ) {
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
        if (
          type === "Water" &&
          (pokemonAbility !== "Storm Drain" || generation >= 5)
        ) {
          effectiveness = 3;
        }
        break;
      case "Water Bubble":
        if (type === "Fire") {
          halveDamage();
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
          halveDamage();
        }
        break;
      case "Heatproof":
        if (type === "Fire") {
          halveDamage();
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
          halveDamage();
        }
        break;
      default:
    }
  }

  if (item === "airballoon" && type === "Ground") effectiveness = 3;

  return effectiveness;
}

// Tells you the move's type based on the pokemon using it and its ability
// E.g. Arceus-Bug using Judgment or Aerilate Mega-Pinsir using Return.
export function moveType(
  move: string,
  pokemon: string,
  ability?: string,
  generation = LATEST_GENERATION,
) {
  if (generation < 3) ability = undefined;
  const rawType = moveTypeIn(move, generation);
  let moveType: PokemonType | undefined =
    rawType && isPokemonType(rawType) ? rawType : undefined;

  const abilitiesThatChangeNormalMoves: Partial<Record<string, PokemonType>> = {
    Aerilate: "Flying",
    Pixilate: "Fairy",
    Refrigerate: "Ice",
    Galvanize: "Electric",
    Dragonize: "Dragon",
  };

  const preservesType = [
    "judgment",
    "multiattack",
    "naturalgift",
    "revelationdance",
    "struggle",
    "technoblast",
    "terrainpulse",
    "weatherball",
  ].includes(move);
  if (
    !preservesType &&
    ability &&
    abilitiesThatChangeNormalMoves[ability] &&
    moveType === "Normal"
  ) {
    moveType = abilitiesThatChangeNormalMoves[ability] || moveType;
  } else if (
    ability === "Normalize" &&
    moveType &&
    !preservesType &&
    (generation <= 6 || !move.startsWith("hiddenpower"))
  ) {
    moveType = "Normal";
  } else if (move === "revelationdance") {
    moveType = pokemonTypes(pokemon, generation)[0] ?? moveType;
  } else if (move === "aurawheel") {
    moveType = pokemon === "morpekohangry" ? "Dark" : "Electric";
  } else if (move === "ragingbull") {
    const types: Record<string, PokemonType> = {
      taurospaldeacombat: "Fighting",
      taurospaldeablaze: "Fire",
      taurospaldeaaqua: "Water",
    };
    moveType = types[pokemon] ?? moveType;
  } else if (move === "judgment") {
    moveType = pokemonTypes(pokemon, generation)[0] ?? moveType;
  } else if (move === "ivycudgel") {
    moveType = pokemonTypes(pokemon, generation).at(-1) ?? moveType;
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
  } else if (ability === "Liquid Voice" && moves[move]?.flags?.sound === 1) {
    moveType = "Water";
  }

  return moveType;
}

export function isMoveStrongEnough(
  move: string,
  generation = LATEST_GENERATION,
) {
  const moveProperties = moveDataIn(move, generation);

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
  generation = LATEST_GENERATION,
) {
  if (generation < 3) ability = undefined;
  const attackType = moveType(move, pokemon, ability, generation);
  const defender = typechartIn(generation)[typeAgainst];

  if (!isMoveStrongEnough(move, generation) || !attackType) return undefined;
  let score = defender?.[attackType];
  if (
    (ability === "Scrappy" || ability === "Mind's Eye") &&
    typeAgainst === "Ghost" &&
    (attackType === "Normal" || attackType === "Fighting")
  )
    score = 0;
  if (
    move === "thousandarrows" &&
    attackType === "Ground" &&
    typeAgainst === "Flying"
  )
    return 0;
  if (move === "freezedry" && attackType === "Ice" && typeAgainst === "Water")
    return -1;
  if (move === "flyingpress") {
    if (score === 2) return 3;
    return (score ?? 0) + (defender?.Flying ?? 0);
  }
  return score;
}
