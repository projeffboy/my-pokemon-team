import pokedex from "@/data/pokedex";
import formatsData from "@/data/formats";
import { isPokemonType } from "@/types";
import type { Formats, Pokedex, SearchFilters } from "@/types";

type PokemonFilters = Readonly<Pick<SearchFilters, "format" | "region" | "type">>;
const formats: Formats = formatsData;

export function filterPokemon({ format, region, type }: PokemonFilters) {
  return Object.keys(
    filterByFormat(filterByRegion(filterByType({ ...pokedex }))),
  );

  function filterByFormat(pokedex: Pokedex) {
    if (format === "") {
      return pokedex;
    }

    let filteredPokedex: Pokedex = {};

    if (format === "Battle Stadium Singles") {
      let banlist = [
        "calyrex",
        "celebi",
        "cosmoem",
        "cosmog",
        "dialga",
        "diancie",
        "eternatus",
        "giratina",
        "groudon",
        "hooh",
        "jirachi",
        "keldeo",
        "kyogre",
        "kyurem",
        "lugia",
        "lunala",
        "magearna",
        "marshadow",
        "melmetal",
        "meltan",
        "mew",
        "mewtwo",
        "necrozma",
        "palkia",
        "rayquaza",
        "reshiram",
        "solgaleo",
        "victini",
        "volcanion",
        "xerneas",
        "yveltal",
        "zacian",
        "zamazenta",
        "zarude",
        "zekrom",
        "zeraora",
        "zygarde",
      ];

      filteredPokedex = { ...pokedex };

      for (const pokemon of banlist) {
        const { otherFormes } = pokedex[pokemon] ?? {};

        // Don't just delete the banned pokemon, delete its other formes
        // E.g. delete giratina, as well as giratinaorigin
        if (otherFormes) {
          otherFormes.forEach(
            otherForme => delete filteredPokedex[otherForme],
          );
        }
        delete filteredPokedex[pokemon];
      }
      return filteredPokedex;
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

    filteredPokedex = {}; // clear out filteredPokedex

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
    if (region) {
      const regionNumberRange: Record<string, [number, number]> = {
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
      const range = regionNumberRange[region];
      if (!range) {
        return {};
      }
      let filteredPokedex: Pokedex = {};

      // Only return pokemon from a certain region based on pokedex number
      for (const [pokemon, pokemonProperties] of Object.entries(pokedex)) {
        const num = pokemonProperties.num;
        if (
          num !== undefined &&
          num >= range[0] &&
          num <= range[1] &&
          // If Kanto region, remove alola forms
          !(region === "Kanto" && pokemon.includes("alola")) &&
          !(region !== "Galar" && pokemon.includes("galar")) &&
          !(region !== "Paldea" && pokemon.includes("paldea"))
        ) {
          filteredPokedex[pokemon] = pokemonProperties;
        }
      }

      // If Alola region, add alola forms
      if (region === "Alola") {
        for (const [pokemon, pokemonProperties] of Object.entries(pokedex)) {
          if (pokemon.includes("alola")) {
            filteredPokedex[pokemon] = pokemonProperties;
          }
        }
      }
      // If Galar region, add galar forms
      if (region === "Galar") {
        for (const [pokemon, pokemonProperties] of Object.entries(pokedex)) {
          if (pokemon.includes("galar")) {
            filteredPokedex[pokemon] = pokemonProperties;
          }
        }
      }
      // If Hisui region, add hisui forms
      if (region === "Hisui") {
        for (const [pokemon, pokemonProperties] of Object.entries(pokedex)) {
          if (
            pokemon.includes("hisui") ||
            ["dialgaorigin", "palkiaorigin"].includes(pokemon)
          ) {
            filteredPokedex[pokemon] = pokemonProperties;
          }
        }
      }
      // If Paldea region, add paldea forms
      if (region === "Paldea") {
        for (const [pokemon, pokemonProperties] of Object.entries(pokedex)) {
          if (pokemon.includes("paldea")) {
            filteredPokedex[pokemon] = pokemonProperties;
          }
        }
      }

      return filteredPokedex;
    } else {
      return pokedex;
    }
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
