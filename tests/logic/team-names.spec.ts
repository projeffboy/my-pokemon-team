import { test, expect } from "./fixtures";
import { nextDuplicateName } from "@/store/team-names";
import en from "@/i18n/en";
import fr from "@/i18n/fr";
import ja from "@/i18n/ja";

for (const messages of [en, fr, ja]) {
  const { copyOf } = messages.team;
  test(`numbers duplicate names using ${copyOf("Rain")}`, () => {
    expect(nextDuplicateName(copyOf("Rain"), [], copyOf)).toBe(
      `${copyOf("Rain")} 2`,
    );
    expect(nextDuplicateName(`${copyOf("Rain")} 2`, [], copyOf)).toBe(
      `${copyOf("Rain")} 3`,
    );
    expect(nextDuplicateName(copyOf(copyOf("Rain")), [], copyOf)).toBe(
      `${copyOf("Rain")} 3`,
    );
  });
}

test("preserves numbers and copy text inside the original team name", () => {
  const { copyOf } = en.team;
  expect(nextDuplicateName("Rain 2026", [], copyOf)).toBe("Rain 2026 copy");
  expect(nextDuplicateName("Rain copy ideas", [], copyOf)).toBe(
    "Rain copy ideas copy",
  );
});

test("copy numbering stays exact when names exceed JavaScript's safe integer range", () => {
  const { copyOf } = en.team;
  expect(
    nextDuplicateName(
      "Rain copy 9007199254740991",
      ["Rain copy 9007199254740992"],
      copyOf,
    ),
  ).toBe("Rain copy 9007199254740993");
  expect(nextDuplicateName("Rain copy 9007199254740992", [], copyOf)).toBe(
    "Rain copy 9007199254740993",
  );
});
