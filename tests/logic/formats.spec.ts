import { test, expect } from "@playwright/test";
import {
  CHAMPIONS_FORMAT,
  formatsForGeneration,
  formatForGeneration,
  parseShowdownFormatId,
} from "@/shared/formats";
import { GENERATIONS } from "@/shared/generations";

for (const generation of GENERATIONS) {
  test(`Gen ${generation} offers its Showdown tier formats`, () => {
    const expected = [
      ...(generation === 9 ? [CHAMPIONS_FORMAT] : []),
      "Uber",
      "OU: Over Used",
      "UU: Under Used",
      ...(generation === 3 || generation >= 5 ? ["RU: Rarely Used"] : []),
      "NU: Never Used",
      "PU",
      "ZU",
      ...(generation !== 2 ? ["Little Cup (LC)"] : []),
      ...(generation >= 8 ? ["Doubles Uber"] : []),
      ...(generation >= 3 ? ["Doubles OU"] : []),
      ...(generation >= 7 ? ["Doubles UU"] : []),
    ];
    expect(formatsForGeneration(generation)).toEqual(expected);
  });
}

test("generation changes keep supported formats and clear unavailable ones", () => {
  expect(formatForGeneration("OU: Over Used", 1)).toBe("OU: Over Used");
  expect(formatForGeneration("RU: Rarely Used", 4)).toBe("");
  expect(formatForGeneration("Doubles UU", 6)).toBe("");
  expect(formatForGeneration(CHAMPIONS_FORMAT, 8)).toBe("");
  expect(formatForGeneration("", 9)).toBe("");
});

test("old imports still preserve their format even when no longer selectable", () => {
  expect(parseShowdownFormatId("gen2lc")).toEqual({
    generation: 2,
    format: "Little Cup (LC)",
  });
});
