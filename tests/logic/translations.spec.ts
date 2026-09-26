import { test, expect } from "./fixtures";
import en from "@/i18n/en";
import { detectLocale, LOCALES } from "@/i18n/locales";
import { englishNames, localizedNames } from "@/i18n/names";
import { english, loadTranslation, type Translation } from "@/i18n/translation";
import ja from "@/data/translations/ja.json" with { type: "json" };
import { sortPokemon } from "@/store/sorting";
import { defenceMatrix } from "@/store/matrix";
import { validateTeam } from "@/store/validation";
import { loadStoredState } from "@/store/teams-storage";
import { createTeam } from "./shared/team";

const japanese: Translation = {
  locale: "ja",
  t: en,
  names: localizedNames(ja),
};

test("the browser's first supported language wins, and Chinese picks its script", () => {
  expect(detectLocale(["fr-CA", "en-US"])).toBe("fr");
  expect(detectLocale(["pt-BR", "ja"])).toBe("ja");
  expect(detectLocale(["zh-TW"])).toBe("zh-Hant");
  expect(detectLocale(["zh-Hant-HK"])).toBe("zh-Hant");
  expect(detectLocale(["zh-CN"])).toBe("zh-Hans");
  expect(detectLocale(["zh"])).toBe("zh-Hans");
  expect(detectLocale(["pt-BR"])).toBe("en");
  expect(detectLocale([])).toBe("en");
});

test("English names are the data's own, and IDs pass through", () => {
  expect(englishNames.pokemon("mrmime")).toBe("Mr. Mime");
  expect(englishNames.move("hiddenpowerfire")).toBe("Hidden Power Fire");
  expect(englishNames.item("")).toBe("");
  expect(englishNames.ability("Thick Fat")).toBe("Thick Fat");
  expect(englishNames.nature("jolly")).toBe("Jolly");
  expect(englishNames.type("Fire")).toBe("Fire");
  expect(englishNames.pokemon("notapokemon")).toBe("notapokemon");
});

test("translated names fall back to English where PokeAPI has none", () => {
  const { names } = japanese;
  expect(names.pokemon("mrmime")).toBe("バリヤード");
  expect(names.pokemon("charizardmegax")).toBe("メガリザードンX");
  expect(names.pokemon("raichualola")).toBe("ライチュウ (アローラのすがた)");
  expect(names.pokemon("missingno")).toBe("MissingNo.");
  expect(names.move("hiddenpowerfire")).toBe("めざめるパワー ほのお");
  expect(names.item("leftovers")).toBe("たべのこし");
  expect(names.item("berserkgene")).toBe("Berserk Gene");
  expect(names.ability("Thick Fat")).toBe("あついしぼう");
  expect(names.nature("jolly")).toBe("ようき");
  expect(names.type("Stellar")).toBe("ステラ");
  expect(names.region("Hisui")).toBe("ヒスイ");
});

test("sorting by name keeps formes with their species in another language", () => {
  const sorted = sortPokemon(
    ["charizardmegax", "charmander", "charizard", "raichualola", "raichu"],
    { by: "name", descending: false },
    japanese,
  );
  // ヒトカゲ, ライチュウ, リザードン and its mega
  expect(sorted).toEqual([
    "charmander",
    "raichu",
    "raichualola",
    "charizard",
    "charizardmegax",
  ]);
  expect(
    sortPokemon(["charizardmegax", "charmander", "charizard"], {
      by: "name",
      descending: false,
    }),
  ).toEqual(["charizard", "charizardmegax", "charmander"]);
});

test("matrix reasons and team problems name things in the current language", () => {
  const team = createTeam(
    { name: "bronzong", ability: "Levitate" },
    { name: "bronzong", ability: "Heatproof" },
  );
  expect(defenceMatrix(team, japanese).Ground[0]?.reason).toBe(
    "じめん does 0x to ドータクン (はがね/エスパー) with ふゆう",
  );
  expect(validateTeam(team, 9, "", japanese)).toEqual([
    "Two pokemon are ドータクン (Species Clause).",
  ]);
});

test("every language has the same message keys as English", async () => {
  const keysOf = (value: unknown, prefix = ""): string[] =>
    typeof value === "object" && value !== null && !Array.isArray(value) ?
      Object.entries(value).flatMap(([key, child]) =>
        keysOf(child, `${prefix}${key}.`),
      )
    : [`${prefix}${typeof value}`];
  for (const locale of LOCALES) {
    const { t, names } = await loadTranslation(locale);
    expect(keysOf(t), locale).toEqual(keysOf(en));
    expect(names.pokemon("pikachu"), locale).not.toBe("pikachu");
    expect(t.checklist.items.spinner.short, locale).toBeTruthy();
  }
  expect(await loadTranslation("en")).toBe(english);
});

test("the store loads a language on demand and keeps it in the saved state", async ({
  store,
}) => {
  const storage = new Map<string, string>();
  store.locale = "ja";
  await expect.poll(() => store.translation.locale).toBe("ja");
  expect(store.filteredPokemonNames[0]).not.toBe("Abomasnow");
  expect(store.translation.names.pokemon("pikachu")).toBe("ピカチュウ");
  expect(store.addTeam().name).toBe(store.translation.t.team.teamNumber(2));
  const stored = loadStoredState({
    getItem: () => JSON.stringify({ teams: store.teams, locale: "ja" }),
    setItem: (key: string, value: string) => storage.set(key, value),
  } as unknown as Storage);
  expect(stored?.locale).toBe("ja");
  expect(
    loadStoredState({
      getItem: () => JSON.stringify({ teams: store.teams, locale: "tlh" }),
    } as unknown as Storage)?.locale,
  ).toBeUndefined();
  store.locale = "en";
  await expect.poll(() => store.translation.locale).toBe("en");
});
