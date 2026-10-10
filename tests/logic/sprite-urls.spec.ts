import { test, expect } from "@playwright/test";
import { spriteUrls } from "@/app/shared/pokemon-sprite/sprite-urls";

const bulbasaur = { num: 1 };

test("sprites come from the generation's own games, animated from gen 5", () => {
  const src = (isSmall: boolean, generation: 1 | 2 | 5 | 9) =>
    spriteUrls("bulbasaur", bulbasaur, undefined, isSmall, generation).src;
  expect(src(false, 1)).toMatch(/\/gen1rb\/bulbasaur\.png$/);
  expect(src(true, 2)).toMatch(/\/gen2\/bulbasaur\.png$/);
  expect(src(false, 5)).toMatch(/\/gen5ani\/bulbasaur\.gif$/);
  expect(src(false, 9)).toMatch(/\/ani\/bulbasaur\.gif$/);
  expect(src(true, 9)).toMatch(/\/dex\/bulbasaur\.png$/);
});

test("pokemon Showdown only has static sprites for stay static in every generation", () => {
  const { src, fallback } = spriteUrls(
    "miraidon",
    { num: 1008 },
    undefined,
    false,
    1,
  );
  expect(src).toMatch(/\/gen5\/miraidon\.png$/);
  expect(fallback).toBe(src);
});

test("shiny sprites keep the selected generation, image type and shiny fallback", () => {
  for (const [generation, folder, extension] of [
    [2, "gen2-shiny", "png"],
    [3, "gen3-shiny", "png"],
    [4, "gen4-shiny", "png"],
    [5, "gen5ani-shiny", "gif"],
    [9, "ani-shiny", "gif"],
  ] as const) {
    const { src, fallback } = spriteUrls(
      "bulbasaur",
      bulbasaur,
      undefined,
      false,
      generation,
      true,
    );
    expect(src).toBe(
      `https://play.pokemonshowdown.com/sprites/${folder}/bulbasaur.${extension}`,
    );
    expect(fallback).toMatch(/\/gen5-shiny\/bulbasaur\.png$/);
  }
  expect(
    spriteUrls("bulbasaur", bulbasaur, undefined, true, 9, true).src,
  ).toMatch(/\/dex-shiny\/bulbasaur\.png$/);
  expect(
    spriteUrls("bulbasaur", bulbasaur, undefined, false, 1, true).src,
  ).toMatch(/\/gen1rb\/bulbasaur\.png$/);
  const staticShiny = spriteUrls(
    "miraidon",
    { num: 1008 },
    undefined,
    false,
    9,
    true,
  );
  expect(staticShiny.src).toMatch(/\/gen5-shiny\/miraidon\.png$/);
  expect(staticShiny.fallback).toBe(staticShiny.src);
});
