import pokedex from "@/data/pokedex";
import formats from "@/data/formats";
import { isPokemonType } from "@/types";
import { baseForme } from "./shared/pokemon";
import type { Pokedex, SearchFilters } from "@/types";

type PokemonFilters = Readonly<Pick<SearchFilters, "format" | "region" | "type">>;

const REGION_NUMBER_RANGE: Record<string, [number, number]> = {
  Kanto: [1, 151],
  Johto: [152, 251],
  Hoenn: [252, 386],
  Sinnoh: [387, 493],
  Unova: [494, 649],
  Kalos: [650, 721],
  Alola: [722, 809],
  Galar: [810, 898],
  Hisui: [899, 905],
  Paldea: [906, 1025],
};

// Regional formes belong to the region they were introduced in, not their pokedex number's region
const REGIONAL_FORMES: Record<string, string> = {
  Alola: "alola",
  Galar: "galar",
  Hisui: "hisui",
  Paldea: "paldea",
};
const HISUI_ORIGIN_FORMES = ["dialgaorigin", "palkiaorigin"];

const BATTLE_STADIUM_BANNED_TAGS = ["Restricted Legendary", "Mythical"];

function isBannedFromBattleStadium(pokemon: string | undefined) {
  return !!pokedex[pokemon ?? ""]?.tags?.some(tag =>
    BATTLE_STADIUM_BANNED_TAGS.includes(tag),
  );
}

export function filterPokemon({ format, region, type }: PokemonFilters) {
  return Object.keys(
    filterByFormat(filterByRegion(filterByType({ ...pokedex }))),
  );

  function filterByFormat(pokedex: Pokedex) {
    if (format === "") {
      return pokedex;
    }

    const filteredPokedex: Pokedex = {};

    if (format === "Battle Stadium Singles") {
      // Formes share their base species' ban
      // E.g. exclude giratina, as well as giratinaorigin
      return Object.fromEntries(
        Object.entries(pokedex).filter(
          ([pokemon]) =>
            !isBannedFromBattleStadium(pokemon) &&
            !isBannedFromBattleStadium(baseForme(pokemon)),
        ),
      );
    }

    const tierAbbr: Record<string, string> = {
      Uber: "Uber",
      "OU: Over Used": "OU",
      "UU: Under Used": "UU",
      "RU: Rarely Used": "RU",
      "NU: Never Used": "NU",
      PU: "PU",
      ZU: "ZU",
      "Little Cup (LC)": "LC",
      "Doubles Uber": "DUber",
      "Doubles OU": "DOU",
      "Doubles UU": "DUU",
    };

    let smogonSinglesTiers = [
      "Uber",
      "OU",
      "UUBL",
      "UU",
      "RUBL",
      "RU",
      "NUBL",
      "NU",
      "PUBL",
      "PU",
      "ZU",
      "(PU)",
      "NFE",
      "LC Uber",
      "LC",
    ];

    if (smogonSinglesTiers.includes(tierAbbr[format] ?? "")) {
      return filterByTier(smogonSinglesTiers, "tier");
    } else if (["DUber", "DOU", "DUU"].includes(tierAbbr[format] ?? "")) {
      return filterByTier(["DUber", "DOU", "DUU", "(DUU)"], "doublesTier");
    }

    function filterByTier(arrayOfTiers: string[], tierType: string) {
      let tierMatched = false;

      for (const tier of arrayOfTiers) {
        // If the tier matches or it's a lower tier
        if (tierAbbr[format] === tier || tierMatched) {
          tierMatched = true;

          // Add all the pokemon from that tier to filteredPokedex
          for (const [pokemon, entry] of Object.entries(pokedex)) {
            if (formats[pokemon]?.[tierType] === tier) {
              filteredPokedex[pokemon] = entry;
            }
          }
        }
      }

      return filteredPokedex;
    }

    return filteredPokedex;
  }

  function filterByRegion(pokedex: Pokedex) {
    if (!region) {
      return pokedex;
    }

    const range = REGION_NUMBER_RANGE[region];
    if (!range) {
      return {};
    }

    const regionalForme = REGIONAL_FORMES[region];
    const otherRegionalFormes = Object.values(REGIONAL_FORMES).filter(
      forme => forme !== regionalForme,
    );
    const filteredPokedex: Pokedex = {};

    for (const [pokemon, pokemonProperties] of Object.entries(pokedex)) {
      const num = pokemonProperties.num;
      const isInNumberRange =
        num !== undefined && num >= range[0] && num <= range[1];

      // E.g. Alola includes vulpixalola, and Kanto excludes it
      if (
        (regionalForme && pokemon.includes(regionalForme)) ||
        (region === "Hisui" && HISUI_ORIGIN_FORMES.includes(pokemon)) ||
        (isInNumberRange &&
          !otherRegionalFormes.some(forme => pokemon.includes(forme)))
      ) {
        filteredPokedex[pokemon] = pokemonProperties;
      }
    }

    return filteredPokedex;
  }

  function filterByType(pokedex: Pokedex) {
    let filteredPokedex: Pokedex = {};

    if (type) {
      for (const [pokemon, pokemonProperties] of Object.entries(pokedex)) {
        // minor bug: cosmetic formes should not be omitted
        if (
          pokemonProperties.types &&
          isPokemonType(type) &&
          pokemonProperties.types.includes(type)
        ) {
          filteredPokedex[pokemon] = pokemonProperties;
        }
      }

      return filteredPokedex;
    } else {
      return pokedex;
    }
  }
}
