// scripts/update-data.ts loads this file on its own, so it can only import types
import type { Generation } from "@/types";

export const SHOWDOWN_SPRITES = "https://play.pokemonshowdown.com/sprites";
// vercel.json and vite.config.ts forward this path of the site to SHOWDOWN_SPRITES
export const PROXIED_SPRITES = "/showdown-sprites";

// Showdown has no sprite under these names, because they look like another forme
const FILENAME_EXCEPTIONS: Record<string, string> = {
  raticatealolatotem: "raticate-alola",
  marowakalolatotem: "marowak-alola",
  ribombeetotem: "ribombee",
  araquanidtotem: "araquanid",
  lurantistotem: "lurantis",
  salazzletotem: "salazzle",
  togedemarutotem: "togedemaru",
  mimikyubustedtotem: "mimikyu-busted",
  greninjabond: "greninja",
  rockruffdusk: "rockruff",
  toxtricitylowkeygmax: "toxtricity-gmax",
};

// Showdown has only gen 5 sprites for these, animated for Dialga-Origin and Miraidon
const GEN5_ONLY = [
  "dialgaorigin",
  "palkiaorigin",
  "pichuspikyeared",
  "miraidon",
];

// Showdown's `ani` sprites for these are single frames, unlike its `gen5ani` ones
const STILL_ANI = ["darmanitanzen", "ferroseed"];

// Each past generation's own games' sprites; later generations share the current ones
const PAST_FOLDERS: Partial<Record<Generation, string>> = {
  1: "gen1rb",
  2: "gen2",
  3: "gen3",
  4: "gen4",
  5: "gen5ani",
};

type SpriteEntry = { num?: number; forme?: string; baseSpecies?: string };

const toId = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, "");

// A forme's sprite is named after its base species and forme, e.g. "vivillon-icysnow"
function spriteFilename(pokemon: string, entry?: SpriteEntry) {
  const exception = FILENAME_EXCEPTIONS[pokemon];
  if (exception) return exception;
  if (!entry?.forme || !entry.baseSpecies) return pokemon;
  return `${toId(entry.baseSpecies)}-${toId(entry.forme)}`;
}

// The folders to try in order, ending with the still gen 5 sprite
function spriteFolders(
  pokemon: string,
  num: number | undefined,
  iconIndex: number | undefined,
  isSmall: boolean,
  generation: Generation,
  still: boolean,
) {
  // Showdown has not animated the Legends: Z-A megas, which start at 1320 + 93.
  // The CAP pokemon's icons come after them, but their numbers are negative.
  if (num === 0 || ((num ?? 0) > 0 && (iconIndex ?? -1) >= 1320 + 93))
    return ["gen5"];
  const past = PAST_FOLDERS[generation];
  const gen5Only = GEN5_ONLY.includes(pokemon);
  if (!still && (past === "gen5ani" || (!past && !isSmall))) {
    // Where Showdown has no `ani` animation, it may still have a BW-style one
    const ani = past || gen5Only || STILL_ANI.includes(pokemon) ? [] : ["ani"];
    return [...ani, "gen5ani", "gen5"];
  }
  if (gen5Only || past === "gen5ani") return ["gen5"];
  const folder =
    past ??
    ((num && 810 <= num && num <= 898) || pokemon.includes("galar") ?
      "bw"
    : "dex");
  return [folder, "gen5"];
}

// `iconIndex` is the pokemon's altSpriteNum; `isSmall` is below the md breakpoint;
// `still` asks for a static sprite in place of an animated one. A pokemon the
// generation's games lack falls back to its static gen 5 sprite.
export function spriteUrls(
  pokemon: string,
  entry: SpriteEntry | undefined,
  iconIndex: number | undefined,
  isSmall: boolean,
  generation: Generation,
  shiny = false,
  still = false,
) {
  const filename = spriteFilename(pokemon, entry);
  const folders = spriteFolders(
    pokemon,
    entry?.num,
    iconIndex,
    isSmall,
    generation,
    still,
  );
  const variant = shiny && folders[0] !== "gen1rb" ? "-shiny" : "";
  const paths = folders.map(
    folder =>
      `${folder}${variant}/${filename}.${folder.endsWith("ani") ? "gif" : "png"}`,
  );
  return {
    filename,
    sources: paths.map(path => `${SHOWDOWN_SPRITES}/${path}`),
    // The same ones through the site's own address, for networks that block Showdown
    proxied: paths.map(path => `${PROXIED_SPRITES}/${path}`),
  };
}
