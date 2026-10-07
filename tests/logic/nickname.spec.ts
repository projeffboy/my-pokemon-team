import { test, expect } from "@playwright/test";
import { nicknameLimit, shortenNickname } from "@/shared/nickname";
import type { Locale } from "@/i18n/locales";
import { loadTranslation } from "@/i18n/translation";
import { validateTeam } from "@/store/validation";
import { parseTeamText, serializeTeam } from "@/store/team-text";
import { planGenerationTransfer } from "@/store/generation-transfer";
import { loadGenerationTransferData } from "@/shared/generation-transfer-data";
import type { Generation } from "@/types";
import { createTeam } from "./shared/team";

test("nickname limits follow the games' generations and supported languages", () => {
  const limits: [Locale[], number[]][] = [
    [
      ["en", "es", "fr", "de", "it", "pt-BR"],
      [10, 10, 10, 10, 10, 12, 12, 12, 12],
    ],
    [
      ["ja", "ko"],
      [5, 5, 5, 5, 5, 6, 6, 6, 6],
    ],
    [
      ["zh-Hans", "zh-Hant"],
      [10, 10, 10, 10, 10, 12, 6, 6, 6],
    ],
  ];
  for (const [locales, expected] of limits) {
    for (const locale of locales) {
      const actual = Array.from({ length: 9 }, (_, index) =>
        nicknameLimit((index + 1) as Generation, locale),
      );
      expect(actual, locale).toEqual(expected);
    }
  }
});

test("nickname shortening preserves spaces and never splits a supplementary character", () => {
  expect(shortenNickname("Very Big Bird", 10)).toBe("Very Big B");
  expect(shortenNickname("Bird", 12)).toBe("Bird");
  expect(shortenNickname("123456789😀", 10)).toBe("123456789");
});

test("old share links preserve long nicknames but validation reports the game's limit", async () => {
  const original = "ABCDEFGHIJKLMNO (Golduck)\n-\n";
  const team = parseTeamText(original);
  expect(team[0]?.nickname).toBe("ABCDEFGHIJKLMNO");
  expect(serializeTeam(team)).toContain("ABCDEFGHIJKLMNO (Golduck)");
  expect(validateTeam(team, 5, "")).toContain(
    "Golduck's nickname must be 10 characters or fewer.",
  );
  expect(validateTeam(team, 6, "")).toContain(
    "Golduck's nickname must be 12 characters or fewer.",
  );
  const japanese = await loadTranslation("ja");
  expect(validateTeam(team, 6, "", japanese)).toContain(
    japanese.t.validation.nicknameTooLong(japanese.names.pokemon("golduck"), 6),
  );
  expect(team[0]?.nickname).toBe("ABCDEFGHIJKLMNO");
  expect(
    validateTeam(
      createTeam({ name: "golduck", nickname: "ABCDEFGHIJ" }),
      5,
      "",
    ),
  ).toEqual([]);
});

test("generation transfers preview nickname shortening without changing the source", async () => {
  const data = await loadGenerationTransferData();
  const team = createTeam({ name: "golduck", nickname: "ABCDEFGHIJKL" });
  const from = { generation: 6 as const, format: "" };
  const old = planGenerationTransfer(team, from, 5, "", data);
  expect(old.team[0]?.nickname).toBe("ABCDEFGHIJ");
  expect(old.losses).toEqual([
    {
      index: 0,
      pokemon: "golduck",
      field: "nickname",
      value: "ABCDEFGHIJKL",
      replacement: "ABCDEFGHIJ",
    },
  ]);
  const modern = planGenerationTransfer(team, from, 9, "", data);
  expect(modern.team[0]?.nickname).toBe("ABCDEFGHIJKL");
  expect(modern.losses).not.toContainEqual(
    expect.objectContaining({ field: "nickname" }),
  );
  const japanese = planGenerationTransfer(team, from, 5, "", data, "ja");
  expect(japanese.team[0]?.nickname).toBe("ABCDE");
  expect(team[0]?.nickname).toBe("ABCDEFGHIJKL");
});
