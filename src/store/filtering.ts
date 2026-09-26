import pokedex from "@/data/pokedex";
import formats from "@/data/formats";
import { isPokemonType } from "@/types";
import type {
  Generation,
  Pokedex,
  PokedexEntry,
  PokemonFilters,
} from "@/types";
import { CHAMPIONS_FORMAT, TIER_BY_FORMAT } from "@/shared/formats";
import { LATEST_GENERATION } from "@/shared/generations";
import { pokemonAbilities } from "@/shared/pokedex";

type Filters = Readonly<
  Partial<Pick<PokemonFilters, "generation" | "ability">> &
    Pick<PokemonFilters, "format" | "region" | "type">
>;

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

// Showdown numbers CAP (fan-made) pokemon from -1 down, and Pokestar pokemon from -5000 down
const isCap = (num: number | undefined) =>
  num !== undefined && num < 0 && num > -5000;

// The generation a species or forme first appeared in, following Showdown's dex-species.ts
export function introducedIn({
  num = 0,
  forme = "",
  gen,
}: PokedexEntry): Generation {
  if (gen !== undefined) return Math.min(9, Math.max(1, gen)) as Generation;
  if (num >= 906 || forme.includes("Paldea")) return 9;
  if (num >= 810 || ["Gmax", "Galar", "Galar-Zen", "Hisui"].includes(forme))
    return 8;
  if (num >= 722 || forme.startsWith("Alola") || forme === "Starter") return 7;
  if (num >= 650 || forme.includes("Mega") || forme === "Primal") return 6;
  if (num >= 494) return 5;
  if (num >= 387) return 4;
  if (num >= 252) return 3;
  if (num >= 152) return 2;
  return 1;
}

// Megas and primals skipped gen 8, and Gigantamax formes only exist there.
// Gen 9 covers everything, including Legends: Z-A's megas.
export function isInGeneration(entry: PokedexEntry, generation: Generation) {
  if (generation === LATEST_GENERATION) return true;
  const forme = entry.forme ?? "";
  if (forme.includes("Mega") || forme === "Primal")
    return generation !== 8 && generation >= introducedIn(entry);
  if (forme === "Gmax" || forme === "Eternamax") return generation === 8;
  return introducedIn(entry) <= generation;
}

// CAP pokemon still load from share links and imports; they are only hidden from the options
export function filterPokemon({
  generation = LATEST_GENERATION,
  format,
  region,
  type,
  ability = "",
}: Filters) {
  return Object.keys(
    filterByFormat(
      filterByRegion(
        filterByType(filterByAbility(filterByGeneration(withoutCap(pokedex)))),
      ),
    ),
  );

  function filterByGeneration(pokedex: Pokedex): Pokedex {
    if (generation === LATEST_GENERATION) return pokedex;
    return Object.fromEntries(
      Object.entries(pokedex).filter(([, entry]) =>
        isInGeneration(entry, generation),
      ),
    );
  }

  function filterByAbility(pokedex: Pokedex): Pokedex {
    if (!ability) return pokedex;
    return Object.fromEntries(
      Object.entries(pokedex).filter(([pokemon]) =>
        pokemonAbilities(pokemon).includes(ability),
      ),
    );
  }

  function withoutCap(pokedex: Pokedex): Pokedex {
    return Object.fromEntries(
      Object.entries(pokedex).filter(([, { num }]) => !isCap(num)),
    );
  }

  function filterByFormat(pokedex: Pokedex) {
    if (format === "") {
      return pokedex;
    }

    const filteredPokedex: Pokedex = {};

    if (format === CHAMPIONS_FORMAT) {
      return Object.fromEntries(
        Object.entries(pokedex).filter(
          ([pokemon]) => formats[pokemon]?.champions,
        ),
      );
    }

    const tierAbbreviationByFormat = TIER_BY_FORMAT;

    const smogonSinglesTiers = [
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
      "ZUBL",
      "ZU",
      "(PU)",
      "NFE",
      "LC Uber",
      "LC",
    ];

    if (smogonSinglesTiers.includes(tierAbbreviationByFormat[format] ?? "")) {
      return filterByTier(smogonSinglesTiers, "tier");
    } else if (
      ["DUber", "DOU", "DUU"].includes(tierAbbreviationByFormat[format] ?? "")
    ) {
      return filterByTier(["DUber", "DOU", "DUU", "(DUU)"], "doublesTier");
    }

    function filterByTier(
      arrayOfTiers: string[],
      tierType: "tier" | "doublesTier",
    ) {
      let tierMatched = false;

      for (const tier of arrayOfTiers) {
        // If the tier matches or it's a lower tier
        if (tierAbbreviationByFormat[format] === tier || tierMatched) {
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
    const filteredPokedex: Pokedex = {};

    if (type) {
      for (const [pokemon, pokemonProperties] of Object.entries(pokedex)) {
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
