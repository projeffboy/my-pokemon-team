import type { PokemonType } from "@/types";
import moves from "@/data/moves";
import items from "@/data/items";
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
  if (generation < 2 || (generation >= 4 && pokemonAbility === "Klutz"))
    item = undefined;
  const typechart = typechartIn(generation);
  const types = pokemonTypes(pokemon, generation);
  const [type1, type2] = types;
  const grounded = item === "ironball" && generation >= 4;
  const ignoresTypeImmunity = item === "ringtarget" && generation >= 5;
  const resistance = (pokemonType: PokemonType | undefined) => {
    const score = pokemonType ? (typechart[pokemonType]?.[type] ?? 0) : 0;
    return (
        score === 2 && (ignoresTypeImmunity || (grounded && type === "Ground"))
      ) ?
        0
      : score;
  };
  const type1Resistance = resistance(type1);

  let effectiveness = type1Resistance;

  if (type2) {
    const type2Resistance = resistance(type2);

    if (type1Resistance === 2 || type2Resistance === 2) {
      effectiveness = 3;
    } else {
      effectiveness += type2Resistance;
    }
  } else if (effectiveness === 2) {
    effectiveness = 3;
  }

  // From Gen 5, Iron Ball also makes Flying holders take neutral Ground damage.
  if (
    grounded &&
    generation >= 5 &&
    type === "Ground" &&
    types.includes("Flying")
  )
    effectiveness = 0;

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
        if (type === "Ground" && !grounded) {
          effectiveness = 3;
        }
        break;
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
  format = "",
  item?: string,
) {
  if (generation < 3) ability = undefined;
  if (generation >= 4 && ability === "Klutz") item = "";
  const rawType = moveTypeIn(move, generation, format);
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
    moveType =
      item === undefined ?
        (pokemonTypes(pokemon, generation)[0] ?? moveType)
      : (items[item]?.onPlate ?? moveType);
  } else if (move === "ivycudgel") {
    moveType = pokemonTypes(pokemon, generation).at(-1) ?? moveType;
  } else if (move === "technoblast") {
    // For Genesect
    if (item !== undefined) moveType = items[item]?.onDrive ?? moveType;
    else
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
    moveType =
      item === undefined ?
        (pokemonTypes(pokemon, generation)[0] ?? moveType)
      : (items[item]?.onMemory ?? moveType);
  } else if (move === "naturalgift" && item !== undefined) {
    moveType = items[item]?.naturalGift?.type ?? moveType;
  } else if (ability === "Liquid Voice" && moves[move]?.flags?.sound === 1) {
    moveType = "Water";
  }

  if (
    ability === "Normalize" &&
    generation <= 4 &&
    move !== "struggle" &&
    moveType
  )
    moveType = "Normal";

  return moveType;
}

export function isMoveStrongEnough(
  move: string,
  generation = LATEST_GENERATION,
  format = "",
  item?: string,
  ability?: string,
) {
  // Every Natural Gift berry has at least 60 power, in every generation.
  if (move === "naturalgift")
    return (
      !(generation >= 4 && ability === "Klutz") &&
      !!items[item ?? ""]?.naturalGift?.type
    );
  const moveProperties = moveDataIn(move, generation, format);

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
  format = "",
  item?: string,
) {
  if (generation < 3) ability = undefined;
  const attackType = moveType(move, pokemon, ability, generation, format, item);
  const defender = typechartIn(generation)[typeAgainst];

  if (
    !isMoveStrongEnough(move, generation, format, item, ability) ||
    !attackType
  )
    return undefined;
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
