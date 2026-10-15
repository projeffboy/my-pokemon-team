import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";
import pokedex from "@/data/pokedex";
import altSpriteNum from "@/data/altSpriteNum";
import { spriteUrls } from "@/app/shared/pokemon-sprite/sprite-urls";
import { filterPokemon } from "@/store/filtering";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import { LATEST_GENERATION } from "@/shared/generations";

const SHOWDOWN_SPRITES = "https://play.pokemonshowdown.com/sprites";

// PokemonSprite.tsx shows a bundled sprite before any of Showdown's
const localSprites = new Set(
  fs
    .readdirSync(
      fileURLToPath(new URL("../../src/images/local-sprites", import.meta.url)),
    )
    .map(file => path.parse(file).name),
);

const offered = [
  ...new Set(
    ["", CHAMPIONS_FORMAT].flatMap(format =>
      filterPokemon({
        generation: LATEST_GENERATION,
        format,
        region: "",
        type: "",
      }),
    ),
  ),
];

const name = (pokemon: string) => pokedex[pokemon]?.name ?? pokemon;
const urls = (pokemon: string, isSmall: boolean) =>
  spriteUrls(
    pokemon,
    pokedex[pokemon],
    altSpriteNum[pokemon],
    isSmall,
    LATEST_GENERATION,
  );

// The pokemon that `check` names, asking Showdown about a batch of them at a time
async function listPokemon(
  check: (pokemon: string) => Promise<string | undefined>,
) {
  const listed: string[] = [];
  for (let i = 0; i < offered.length; i += 32) {
    const results = await Promise.all(offered.slice(i, i + 32).map(check));
    listed.push(...results.filter(result => result !== undefined));
  }
  return listed;
}

// Each frame of an animated GIF starts with a graphic control extension
function frameCount(gif: Buffer) {
  let frames = 0;
  for (let i = 0; i + 2 < gif.length; i++)
    if (gif[i] === 0x21 && gif[i + 1] === 0xf9 && gif[i + 2] === 4) frames++;
  return frames;
}

test.describe("Gen 9 and Champions sprites", () => {
  test.slow();

  test("every pokemon has an animated or still sprite at both sizes", async ({
    request,
  }) => {
    const exists = async (url: string) => (await request.head(url)).ok();
    const missing = await listPokemon(async pokemon => {
      if (localSprites.has(pokemon)) return;
      for (const isSmall of [false, true]) {
        const { src, fallback } = urls(pokemon, isSmall);
        if (!(await exists(src)) && !(await exists(fallback)))
          return `${name(pokemon)}${isSmall ? " below md" : ""}`;
      }
    });
    expect(missing, "Pokemon with neither sprite").toEqual([]);
  });

  test("every pokemon that Showdown animates is animated at md and up", async ({
    request,
  }) => {
    const stills = await listPokemon(async pokemon => {
      const { filename, src } = urls(pokemon, false);
      if (!localSprites.has(pokemon) && src.endsWith(".gif")) return;
      const response = await request.get(
        `${SHOWDOWN_SPRITES}/ani/${filename}.gif`,
      );
      if (response.ok() && frameCount(await response.body()) > 1)
        return name(pokemon);
    });
    expect(
      stills,
      "Pokemon with a still sprite that Showdown animates",
    ).toEqual([]);
  });
});
