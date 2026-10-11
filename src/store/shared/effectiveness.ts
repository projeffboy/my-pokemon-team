import type { Generation, PokemonType, TeamPokemon } from "@/types";
import moves from "@/data/moves";
import items from "@/data/items";
import pokedex from "@/data/pokedex";
import { pokemonTypes } from "@/shared/pokedex";
import { moveDataIn, moveTypeIn, typechartIn } from "@/shared/generation-data";
import { LATEST_GENERATION } from "@/shared/generations";
import { isPokemonType } from "@/types";
import { hiddenPowerPower } from "@/shared/hidden-power";

export const activeItem = (
  item: string | undefined,
  ability: string | undefined,
  generation: number,
) =>
  (
    generation < 2 ||
    (generation >= 3 && ability === "Klutz" && !items[item ?? ""]?.ignoreKlutz)
  ) ?
    ""
  : (item ?? "");

export function effectivePokemonTypes(
  pokemon: string,
  ability = "",
  item = "",
  generation = LATEST_GENERATION,
) {
  const held = items[activeItem(item, ability, generation)];
  if (ability === "Multitype" && pokemon.startsWith("arceus"))
    return [held?.onPlate ?? "Normal"];
  if (ability === "RKS System" && pokemon.startsWith("silvally"))
    return [held?.onMemory ?? "Normal"];
  return pokemonTypes(pokemon, generation);
}

export const isTypelessMove = (move: string, generation: number) =>
  generation <= 4 && (move === "futuresight" || move === "doomdesire");

export const IMMUNE_SCORE = Infinity;

// Defence scores count halvings: -2 = 4x, -1 = 2x, 0 = 1x, 1 = 0.5x,
// 2 = 0.25x, 3 = 0.125x. Immunity stays separate from finite resistances.
// The generation decides the pokemon's types and the type chart.
export function typeAgainstPokemon(
  type: PokemonType,
  pokemon: string,
  pokemonAbility?: string,
  item?: string,
  generation = LATEST_GENERATION,
) {
  if (generation < 3) pokemonAbility = undefined;
  item = activeItem(item, pokemonAbility, generation);
  const typechart = typechartIn(generation);
  const [type1, type2] = effectivePokemonTypes(
    pokemon,
    pokemonAbility,
    item,
    generation,
  );
  const grounded = item === "ironball" && type === "Ground";
  const resistance = (defender: PokemonType | "Bird" | undefined) => {
    const value =
      defender && defender !== "Bird" ? (typechart[defender]?.[type] ?? 0) : 0;
    return (
        value === 2 &&
          (item === "ringtarget" || (grounded && defender === "Flying"))
      ) ?
        0
      : value;
  };
  const type1Resistance = resistance(type1);

  let effectiveness = type1Resistance;

  if (type2) {
    const type2Resistance = resistance(type2);

    if (type1Resistance === 2 || type2Resistance === 2) {
      effectiveness = IMMUNE_SCORE;
    } else {
      effectiveness += type2Resistance;
    }
  } else if (effectiveness === 2) {
    effectiveness = IMMUNE_SCORE;
  }
  // Since Gen 5, Iron Ball makes all Ground effectiveness neutral on Flying holders.
  if (grounded && generation >= 5 && (type1 === "Flying" || type2 === "Flying"))
    effectiveness = 0;

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
          effectiveness = IMMUNE_SCORE;
        }
        break;
      case "Flash Fire":
      case "Well-Baked Body":
        if (type === "Fire") {
          effectiveness = IMMUNE_SCORE;
        }
        break;
      case "Sap Sipper":
        if (type === "Grass") {
          effectiveness = IMMUNE_SCORE;
        }
        break;
      case "Levitate":
      case "Eelevate":
        if (type === "Ground" && !grounded) effectiveness = IMMUNE_SCORE;
        break;
      case "Earth Eater":
        if (type === "Ground") {
          effectiveness = IMMUNE_SCORE;
        }
        break;
      case "Water Absorb":
      case "Storm Drain":
        if (
          type === "Water" &&
          (pokemonAbility !== "Storm Drain" || generation >= 5)
        ) {
          effectiveness = IMMUNE_SCORE;
        }
        break;
      case "Water Bubble":
        if (type === "Fire") {
          effectiveness += 1;
        }
        break;
      case "Wonder Guard":
        if (effectiveness >= 0) {
          effectiveness = IMMUNE_SCORE;
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
          effectiveness = IMMUNE_SCORE;
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

  if (item === "airballoon" && type === "Ground") effectiveness = IMMUNE_SCORE;

  return effectiveness;
}

// Tells you the move's type based on the pokemon using it and its ability
// E.g. Arceus-Bug using Judgment or Aerilate Mega-Pinsir using Return.
export function moveType(
  move: string,
  pokemon: string,
  ability?: string,
  generation = LATEST_GENERATION,
  item?: string,
) {
  if (generation < 3) ability = undefined;
  const rawType = moveTypeIn(move, generation);
  let moveType: PokemonType | undefined =
    rawType && isPokemonType(rawType) ? rawType : undefined;
  const held = items[activeItem(item, ability, generation)];

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
    (generation <= 4 || !preservesType) &&
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
      item === undefined ? (pokemonTypes(pokemon, generation)[0] ?? moveType)
      : held?.zMove ? "Normal"
      : (held?.onPlate ?? "Normal");
  } else if (move === "ivycudgel") {
    moveType = pokemonTypes(pokemon, generation).at(-1) ?? moveType;
  } else if (move === "technoblast") {
    if (item !== undefined) return held?.onDrive ?? "Normal";
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
    if (item !== undefined) return held?.onMemory ?? "Normal";
    // For Silvally
    const type = pokemon.replace("silvally", "") || "normal";
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);

    if (isPokemonType(capitalizedType)) moveType = capitalizedType;
  } else if (move === "naturalgift") {
    moveType = held?.naturalGift?.type ?? moveType;
  } else if (ability === "Liquid Voice" && moves[move]?.flags?.sound === 1) {
    moveType = "Water";
  }

  return moveType;
}

export function flingItem(
  item: string | undefined,
  ability: string | undefined,
  generation: number,
  pokemon: string,
) {
  if (generation < 4 || (generation >= 5 && ability === "Klutz"))
    return undefined;
  const held = items[item ?? ""];
  const species = pokedex[pokemon]?.baseSpecies ?? pokedex[pokemon]?.name ?? "";
  const blocked =
    held?.zMove ||
    (generation === 4 && ability === "Multitype") ||
    (held?.onPlate && species === "Arceus") ||
    (held?.onMemory && species === "Silvally") ||
    held?.megaStone?.[species] ||
    (item === "griseousorb" &&
      (generation === 4 || (generation <= 8 && species === "Giratina"))) ||
    (item?.endsWith("mask") && species === "Ogerpon");
  return blocked ? undefined : held?.fling;
}

export function isMoveUsable(
  move: string,
  pokemon: string,
  item: string | undefined,
  ability: string | undefined,
  generation: Generation,
) {
  if (
    generation >= 6 &&
    activeItem(item, ability, generation) === "assaultvest" &&
    moveDataIn(move, generation)?.category === "Status" &&
    move !== "mefirst"
  )
    return false;
  const types = effectivePokemonTypes(pokemon, ability, item, generation);
  if (move === "burnup") return types.includes("Fire");
  if (move === "doubleshock") return types.includes("Electric");
  if (move === "fling") return !!flingItem(item, ability, generation, pokemon);
  return true;
}

export function isMoveStrongEnough(
  move: string,
  item?: string,
  ability?: string,
  generation = LATEST_GENERATION,
  pokemon = "",
  happiness = 255,
  member?: Readonly<TeamPokemon>,
) {
  if (!isMoveUsable(move, pokemon, item, ability, generation)) return false;
  if (moves[move] && move.startsWith("hiddenpower") && member)
    return hiddenPowerPower(member, generation) >= 40;
  if (move === "return" || move === "frustration")
    return (
      Math.max(
        1,
        Math.floor(
          ((move === "return" ? happiness : 255 - happiness) * 10) / 25,
        ),
      ) >= 40
    );
  const moveProperties = moveDataIn(move, generation);
  const held = items[activeItem(item, ability, generation)];
  if (move === "naturalgift")
    return (
      (held?.naturalGift?.basePower ?? 0) - (generation <= 5 ? 20 : 0) >= 40
    );
  if (move === "fling")
    return (
      (flingItem(item, ability, generation, pokemon)?.basePower ?? 0) >= 40
    );

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
  item?: string,
  happiness = 255,
  member?: Readonly<TeamPokemon>,
) {
  if (generation < 3) ability = undefined;
  const attackType = moveType(move, pokemon, ability, generation, item);
  const defender = typechartIn(generation)[typeAgainst];

  if (
    !isMoveStrongEnough(
      move,
      item,
      ability,
      generation,
      pokemon,
      happiness,
      member,
    ) ||
    !attackType
  )
    return undefined;
  if (isTypelessMove(move, generation)) return 0;
  if (move === "skydrop" && typeAgainst === "Flying") return IMMUNE_SCORE;
  if (
    move === "synchronoise" &&
    !effectivePokemonTypes(pokemon, ability, item, generation).includes(
      typeAgainst,
    )
  )
    return IMMUNE_SCORE;
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
    if (score === 2) return IMMUNE_SCORE;
    return (score ?? 0) + (defender?.Flying ?? 0);
  }
  return score;
}
