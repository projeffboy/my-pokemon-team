import { test, expect } from "@playwright/test";
import { spriteUrls } from "@/app/shared/pokemon-sprite/sprite-urls";
import vercel from "../../vercel.json" with { type: "json" };
import pokedex from "@/data/pokedex";
import altSpriteNum from "@/data/altSpriteNum";

const bulbasaur = { num: 1 };

test("sprites come from the generation's own games, animated from gen 5", () => {
  const src = (isSmall: boolean, generation: 1 | 2 | 5 | 9) =>
    spriteUrls("bulbasaur", bulbasaur, undefined, isSmall, generation)
      .sources[0];
  expect(src(false, 1)).toMatch(/\/gen1rb\/bulbasaur\.png$/);
  expect(src(true, 2)).toMatch(/\/gen2\/bulbasaur\.png$/);
  expect(src(false, 5)).toMatch(/\/gen5ani\/bulbasaur\.gif$/);
  expect(src(false, 9)).toMatch(/\/ani\/bulbasaur\.gif$/);
  expect(src(true, 9)).toMatch(/\/dex\/bulbasaur\.png$/);
});

test("newer pokemon that Showdown animates are animated, unlike the Legends: Z-A megas", () => {
  const sources = (pokemon: string, isSmall = false) =>
    spriteUrls(pokemon, pokedex[pokemon], altSpriteNum[pokemon], isSmall, 9)
      .sources;
  expect(sources("greattusk")[0]).toMatch(/\/ani\/greattusk\.gif$/);
  expect(sources("ursaluna")[0]).toMatch(/\/ani\/ursaluna\.gif$/);
  expect(sources("basculinwhitestriped")[0]).toMatch(
    /\/ani\/basculin-whitestriped\.gif$/,
  );
  expect(sources("irontreads", true)[0]).toMatch(/\/dex\/irontreads\.png$/);
  // CAP icons come after the Z-A megas', but Showdown animates CAP pokemon
  expect(sources("kerfluffle")[0]).toMatch(/\/ani\/kerfluffle\.gif$/);
  expect(sources("scovillainmega")).toEqual([
    expect.stringMatching(/\/gen5\/scovillain-mega\.png$/),
  ]);
});

test("a pokemon with no `ani` animation, or a still one, tries Showdown's BW-style one before its still sprite", () => {
  const folders = (pokemon: string, isSmall: boolean) =>
    spriteUrls(
      pokemon,
      pokedex[pokemon],
      altSpriteNum[pokemon],
      isSmall,
      9,
    ).sources.map(url => url.split("/").slice(-2).join("/"));
  expect(folders("ironthorns", false)).toEqual([
    "ani/ironthorns.gif",
    "gen5ani/ironthorns.gif",
    "gen5/ironthorns.png",
  ]);
  expect(folders("ironthorns", true)).toEqual([
    "dex/ironthorns.png",
    "gen5/ironthorns.png",
  ]);
  expect(folders("miraidon", false)).toEqual([
    "gen5ani/miraidon.gif",
    "gen5/miraidon.png",
  ]);
  expect(folders("miraidon", true)).toEqual(["gen5/miraidon.png"]);
  expect(folders("ferroseed", false)).toEqual([
    "gen5ani/ferroseed.gif",
    "gen5/ferroseed.png",
  ]);
  expect(folders("ferroseed", true)).toEqual([
    "dex/ferroseed.png",
    "gen5/ferroseed.png",
  ]);
});

test("pokemon with only gen 5 sprites use the still one in the generations before", () => {
  expect(
    spriteUrls("miraidon", { num: 1008 }, undefined, false, 1).sources,
  ).toEqual([expect.stringMatching(/\/gen5\/miraidon\.png$/)]);
});

test("the site's own address retries each of the sprite's sources, for networks that block Showdown", () => {
  const { sources, proxied } = spriteUrls(
    "bulbasaur",
    bulbasaur,
    undefined,
    false,
    9,
    true,
  );
  expect(proxied).toEqual([
    "/showdown-sprites/ani-shiny/bulbasaur.gif",
    "/showdown-sprites/gen5ani-shiny/bulbasaur.gif",
    "/showdown-sprites/gen5-shiny/bulbasaur.png",
  ]);
  // vercel.json forwards each one to the same file on Showdown
  const [rewrite] = vercel.rewrites;
  const forwarded = proxied.map(url =>
    url.replace(
      rewrite.source.replace(":path*", ""),
      rewrite.destination.replace(":path*", ""),
    ),
  );
  expect(forwarded).toEqual(sources);
});

test("the site's own address caches sprites, and their 404s, only as long as Showdown does", () => {
  const { proxied } = spriteUrls("bulbasaur", bulbasaur, undefined, false, 9);
  // Of the header rules that match a path, the last one wins
  const rule = vercel.headers.at(-1);
  for (const url of proxied) {
    expect(url).toMatch(new RegExp(`^${rule?.source}$`));
  }
  expect(rule?.headers).toEqual([
    { key: "Cache-Control", value: "public, max-age=691200" },
  ]);
});

test("shiny sprites keep the selected generation, image type and shiny fallback", () => {
  for (const [generation, folder, extension] of [
    [2, "gen2-shiny", "png"],
    [3, "gen3-shiny", "png"],
    [4, "gen4-shiny", "png"],
    [5, "gen5ani-shiny", "gif"],
    [9, "ani-shiny", "gif"],
  ] as const) {
    const { sources } = spriteUrls(
      "bulbasaur",
      bulbasaur,
      undefined,
      false,
      generation,
      true,
    );
    expect(sources[0]).toBe(
      `https://play.pokemonshowdown.com/sprites/${folder}/bulbasaur.${extension}`,
    );
    expect(sources.at(-1)).toMatch(/\/gen5-shiny\/bulbasaur\.png$/);
  }
  expect(
    spriteUrls("bulbasaur", bulbasaur, undefined, true, 9, true).sources[0],
  ).toMatch(/\/dex-shiny\/bulbasaur\.png$/);
  expect(
    spriteUrls("bulbasaur", bulbasaur, undefined, false, 9, true).sources[1],
  ).toMatch(/\/gen5ani-shiny\/bulbasaur\.gif$/);
  expect(
    spriteUrls("bulbasaur", bulbasaur, undefined, false, 1, true).sources[0],
  ).toMatch(/\/gen1rb\/bulbasaur\.png$/);
  expect(
    spriteUrls("palkiaorigin", pokedex.palkiaorigin, undefined, true, 9, true)
      .sources,
  ).toEqual([expect.stringMatching(/\/gen5-shiny\/palkia-origin\.png$/)]);
});
