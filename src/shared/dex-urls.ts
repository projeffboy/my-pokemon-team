import type { Generation } from "@/types";

// Smogon's strategy dex is organised by each generation's main games
const SMOGON_DEX_CODES: Record<Generation, string> = {
  1: "rb",
  2: "gs",
  3: "rs",
  4: "dp",
  5: "bw",
  6: "xy",
  7: "sm",
  8: "ss",
  9: "sv",
};

// Serebii's dexes of the generations whose games had every pokemon, by number
const SEREBII_DEX_PATHS: Partial<Record<Generation, string>> = {
  1: "pokedex",
  2: "pokedex-gs",
  3: "pokedex-rs",
  4: "pokedex-dp",
  5: "pokedex-bw",
  6: "pokedex-xy",
  7: "pokedex-sm",
  8: "pokedex-swsh",
};

// Serebii's national dex keeps the punctuation but not the spaces or accents
const SEREBII_NAMES: Record<string, string> = {
  "Nidoran-F": "nidoranf",
  "Nidoran-M": "nidoranm",
};

// Bulbapedia names the pages after the pokemon with its gender sign
const BULBAPEDIA_NAMES: Record<string, string> = {
  "Nidoran-F": "Nidoran♀",
  "Nidoran-M": "Nidoran♂",
};

// E.g. flabebe for Flabébé, or farfetchd for Farfetch’d
const plainName = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f'’]/g, "")
    .toLowerCase();

// E.g. https://www.smogon.com/dex/sv/pokemon/garchomp/ for any Garchomp forme
export function smogonDexUrl(generation: Generation, baseSpeciesName: string) {
  const slug = plainName(baseSpeciesName)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `https://www.smogon.com/dex/${SMOGON_DEX_CODES[generation]}/pokemon/${slug}/`;
}

// E.g. https://bulbapedia.bulbagarden.net/wiki/Mr._Mime_(Pok%C3%A9mon), with
// Farfetch'd's straight apostrophe and Flabébé's accents as single characters
export function bulbapediaUrl(baseSpeciesName: string) {
  const name = (BULBAPEDIA_NAMES[baseSpeciesName] ?? baseSpeciesName)
    .normalize("NFC")
    .replace(/’/g, "'")
    .replace(/ /g, "_");
  return encodeURI(`https://bulbapedia.bulbagarden.net/wiki/${name}_(Pokémon)`);
}

// E.g. https://www.serebii.net/pokedex-sm/445.shtml, or https://www.serebii.net/pokemon/garchomp/
// in Gen 9, since Serebii's Scarlet and Violet dex leaves out the pokemon not in those games
export function serebiiDexUrl(
  generation: Generation,
  num: number,
  baseSpeciesName: string,
) {
  const path = SEREBII_DEX_PATHS[generation];
  if (path)
    return `https://www.serebii.net/${path}/${`${num}`.padStart(3, "0")}.shtml`;
  const slug =
    SEREBII_NAMES[baseSpeciesName] ??
    baseSpeciesName
      .normalize("NFD")
      .replace(/[\u0300-\u036f ]/g, "")
      .replace(/’/g, "'")
      .toLowerCase();
  return `https://www.serebii.net/pokemon/${slug}/`;
}

// E.g. https://dex.pokemonshowdown.com/pokemon/garchompmega, for the forme itself
export const showdownDexUrl = (pokemonName: string) =>
  `https://dex.pokemonshowdown.com/pokemon/${plainName(pokemonName).replace(/[^a-z0-9]/g, "")}`;
