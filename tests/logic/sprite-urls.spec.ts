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
