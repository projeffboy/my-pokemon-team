import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";
import { pokemonIconPosition } from "@/app/shared/pokemon-icon/icon-position";
import altSpriteNum from "@/data/altSpriteNum";
import pokedex from "@/data/pokedex";

const icon = (id: string) =>
  pokemonIconPosition(pokedex[id].num ?? 0, altSpriteNum[id]);
const questionMark = { left: 0, top: 0 };

test("pokemon icons come from their dex number or Showdown's forme index", () => {
  expect(icon("chikorita")).toEqual({ left: 40 * 8, top: 30 * 12 });
  expect(icon("pecharunt")).toEqual({ left: 40 * 5, top: 30 * 85 });
  expect(icon("syclant")).toEqual(pokemonIconPosition(0, 1560));
  expect(icon("castformsunny")).toEqual(
    pokemonIconPosition(351, altSpriteNum.castformsunny),
  );
});

test("pokemon without an icon on the sheet show the question mark", () => {
  expect(icon("pokestarsmeargle")).toEqual(questionMark);
  expect(icon("pokestarufo2")).toEqual(questionMark);
  expect(icon("scraptor")).toEqual(questionMark);
  expect(pokemonIconPosition(1026)).toEqual(questionMark);
  expect(pokemonIconPosition(2000)).toEqual(questionMark);
});

test("every pokemon's icon is on the bundled sheet", () => {
  const sheet = readFileSync("src/images/icon-sheets/pokemonicons-sheet.png");
  const [width, height] = [sheet.readUInt32BE(16), sheet.readUInt32BE(20)];
  const outside = Object.keys(pokedex).filter(id => {
    const { left, top } = icon(id);
    return left < 0 || top < 0 || left + 40 > width || top + 30 > height;
  });
  expect(outside).toEqual([]);
});
