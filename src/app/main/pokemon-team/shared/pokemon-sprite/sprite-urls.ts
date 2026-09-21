// scripts/update-data.mjs loads this file on its own, so it cannot import anything

const SHOWDOWN_SPRITES = "https://play.pokemonshowdown.com/sprites";

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

const GEN5_ONLY = [
  "dialgaorigin",
  "palkiaorigin",
  "basculinwhitestriped",
  "ursaluna",
  "pichuspikyeared",
  "miraidon",
];

type SpriteEntry = { num?: number; forme?: string; baseSpecies?: string };

const toId = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, "");

// A forme's sprite is named after its base species and forme, e.g. "vivillon-icysnow"
function spriteFilename(pokemon: string, entry?: SpriteEntry) {
  const exception = FILENAME_EXCEPTIONS[pokemon];
  if (exception) return exception;
  if (!entry?.forme || !entry.baseSpecies) return pokemon;
  return `${toId(entry.baseSpecies)}-${toId(entry.forme)}`;
}

function spriteFolder(
  pokemon: string,
  num: number | undefined,
  iconIndex: number | undefined,
  isSmall: boolean,
) {
  if (
    (num !== undefined && 984 <= num && num <= 995) ||
    num === 0 ||
    (iconIndex ?? -1) >= 1320 + 93 ||
    GEN5_ONLY.includes(pokemon)
  ) {
    return "gen5";
  }
  if (!isSmall) return "ani";
  return (num && 810 <= num && num <= 898) || pokemon.includes("galar") ?
      "bw"
    : "dex";
}

// `iconIndex` is the pokemon's altSpriteNum; `isSmall` is below the md breakpoint
export function spriteUrls(
  pokemon: string,
  entry: SpriteEntry | undefined,
  iconIndex: number | undefined,
  isSmall: boolean,
) {
  const filename = spriteFilename(pokemon, entry);
  const folder = spriteFolder(pokemon, entry?.num, iconIndex, isSmall);
  return {
    filename,
    src: `${SHOWDOWN_SPRITES}/${folder}/${filename}.${folder === "ani" ? "gif" : "png"}`,
    fallback: `${SHOWDOWN_SPRITES}/gen5/${filename}.png`,
  };
}
