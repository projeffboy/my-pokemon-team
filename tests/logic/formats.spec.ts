import { test, expect } from "@playwright/test";
import formatBans from "@/data/format-bans";
import {
  CAP_FORMAT,
  CHAMPIONS_FORMAT,
  TIER_BY_FORMAT,
  formatsForGeneration,
  formatForGeneration,
  formatShortName,
  parseShowdownFormatId,
  showdownFormatId,
} from "@/shared/formats";
import { GENERATIONS } from "@/shared/generations";
import { COMBINED_GENERATIONS_PROFILE } from "@/shared/generation-profile";

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
      ...(generation === 9 ? [CAP_FORMAT] : []),
      ...(generation >= 8 ? ["Doubles Uber"] : []),
      ...(generation >= 3 ? ["Doubles OU"] : []),
      ...(generation >= 7 ? ["Doubles UU"] : []),
    ];
    expect(formatsForGeneration(generation)).toEqual(expected);
  });
}

test("every Smogon tier on offer has its bans from Showdown", () => {
  const offered = GENERATIONS.flatMap(generation =>
    formatsForGeneration(generation)
      .filter(format => format in TIER_BY_FORMAT)
      .map(format => showdownFormatId(generation, format)),
  );
  expect(Object.keys(formatBans).sort()).toEqual(offered.sort());
});

test("generation changes keep supported formats and clear unavailable ones", () => {
  expect(formatForGeneration("OU: Over Used", 1)).toBe("OU: Over Used");
  expect(formatForGeneration("RU: Rarely Used", 4)).toBe("");
  expect(formatForGeneration("Doubles UU", 6)).toBe("");
  expect(formatForGeneration(CHAMPIONS_FORMAT, 8)).toBe("");
  expect(formatForGeneration(CAP_FORMAT, 8)).toBe("");
  expect(formatForGeneration("", 9)).toBe("");
});

test("Generations 6–9 leaves out CAP, whose pokemon are in no game", () => {
  const combined = formatsForGeneration(9, COMBINED_GENERATIONS_PROFILE);
  expect(combined).toContain("OU: Over Used");
  expect(combined).not.toContain(CAP_FORMAT);
  expect(formatForGeneration(CAP_FORMAT, 9)).toBe(CAP_FORMAT);
  expect(formatForGeneration(CAP_FORMAT, 9, COMBINED_GENERATIONS_PROFILE)).toBe(
    "",
  );
  expect(
    formatForGeneration("OU: Over Used", 9, COMBINED_GENERATIONS_PROFILE),
  ).toBe("OU: Over Used");
});

test("the CAP format round-trips through Showdown's team header ID", () => {
  expect(showdownFormatId(9, CAP_FORMAT)).toBe("gen9cap");
  expect(parseShowdownFormatId("gen9cap")).toEqual({
    generation: 9,
    format: CAP_FORMAT,
  });
  expect(formatShortName(CAP_FORMAT)).toBe("CAP");
});

test("old imports still preserve their format even when no longer selectable", () => {
  expect(parseShowdownFormatId("gen2lc")).toEqual({
    generation: 2,
    format: "Little Cup (LC)",
  });
});

test("legacy Showdown tier IDs use their historical generation", () => {
  expect(parseShowdownFormatId("ou")).toEqual({
    generation: 6,
    format: "OU: Over Used",
  });
  expect(parseShowdownFormatId(" UU ")).toEqual({
    generation: 6,
    format: "UU: Under Used",
  });
  expect(parseShowdownFormatId("gen7ou")).toEqual({
    generation: 7,
    format: "OU: Over Used",
  });
  expect(parseShowdownFormatId("")).toEqual({ generation: 9, format: "" });
  expect(parseShowdownFormatId("unknown-format")).toEqual({
    generation: 9,
    format: "",
  });
});

test("unknown IDs beginning with a legacy tier keep the latest-generation default", () => {
  for (const id of [
    "outside",
    "outline",
    "double's unknown",
    "doublesoucustom",
  ])
    expect(parseShowdownFormatId(id)).toEqual({ generation: 9, format: "" });
});
