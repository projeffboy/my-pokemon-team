import { test, expect } from "./fixtures";
import { nextDuplicateName } from "@/store/team-names";
import { LOCALES } from "@/i18n/locales";
import { loadTranslation } from "@/i18n/translation";
import en from "@/i18n/en";

for (const locale of LOCALES) {
  test(`${locale} numbers copies of a numbered team apart from its number`, async () => {
    const { copyOf, teamNumber } = (await loadTranslation(locale)).t.team;
    const team = teamNumber(2);
    const first = nextDuplicateName(team, [team], copyOf);
    expect(first).toBe(copyOf(team));
    const second = nextDuplicateName(first, [team, first], copyOf);
    expect(second).toBe(copyOf(team, 2n));
    expect(nextDuplicateName(second, [team, first, second], copyOf)).toBe(
      copyOf(team, 3n),
    );
    expect(nextDuplicateName(team, [team, first, second], copyOf)).toBe(
      copyOf(team, 3n),
    );
    expect(nextDuplicateName(copyOf(copyOf("Rain")), [], copyOf)).toBe(
      copyOf("Rain", 3n),
    );
  });
}

test("a copy of a copy in French counts copies instead of the team's own number", async () => {
  const { copyOf } = (await loadTranslation("fr")).t.team;
  const first = nextDuplicateName("Équipe 2", ["Équipe 2"], copyOf);
  expect(first).toBe("Copie de Équipe 2");
  expect(nextDuplicateName(first, ["Équipe 2", first], copyOf)).toBe(
    "Copie 2 de Équipe 2",
  );
  expect(nextDuplicateName("Copie 2 de Équipe 2", [], copyOf)).toBe(
    "Copie 3 de Équipe 2",
  );
});

test("English copy names keep their wording", () => {
  const { copyOf } = en.team;
  const first = nextDuplicateName("Team 2", ["Team 2"], copyOf);
  expect(first).toBe("Team 2 copy");
  expect(nextDuplicateName(first, ["Team 2", first], copyOf)).toBe(
    "Team 2 copy 2",
  );
  expect(nextDuplicateName("Rain copy 2", [], copyOf)).toBe("Rain copy 3");
  expect(nextDuplicateName("Rain copy copy", [], copyOf)).toBe("Rain copy 3");
});

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
