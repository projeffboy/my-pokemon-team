import { test, expect } from "@playwright/test";
import { searchFilter } from "@/app/shared/search-filter";

// Each option is a dropdown's translated name followed by its English name
const filter = searchFilter((option: string) => option);
const matches = (options: string[], inputValue: string) =>
  filter(options, { inputValue });

test.describe("dropdown search", () => {
  test("full-width letters and digits typed with a Japanese IME find half-width names", () => {
    const names = [
      "メガリザードンX Charizard-Mega-X",
      "メガリザードンY Charizard-Mega-Y",
      "ポリゴン2 Porygon2",
      "ポリゴンZ Porygon-Z",
      "10まんボルト Thunderbolt",
      "1000まんボルト 10,000,000 Volt Thunderbolt",
    ];
    expect(matches(names, "リザードンＸ")).toEqual([
      "メガリザードンX Charizard-Mega-X",
    ]);
    expect(matches(names, "ポリゴン２")).toEqual(["ポリゴン2 Porygon2"]);
    expect(matches(names, "１０まん")).toEqual(["10まんボルト Thunderbolt"]);
    expect(matches(names, "１０００")).toEqual([
      "1000まんボルト 10,000,000 Volt Thunderbolt",
    ]);
    // An IME's full-width space separates words like a normal one
    expect(matches(names, "メガリザードンＸ　Ｃｈａｒｉｚａｒｄ")).toEqual([
      "メガリザードンX Charizard-Mega-X",
    ]);
  });

  test("full-width letters typed with a Chinese IME find half-width names", () => {
    const names = [
      "超级喷火龙X Charizard-Mega-X",
      "超级喷火龙Y Charizard-Mega-Y",
    ];
    expect(matches(names, "喷火龙Ｘ")).toEqual([
      "超级喷火龙X Charizard-Mega-X",
    ]);
  });

  test("hiragana and half-width katakana find katakana names", () => {
    const names = [
      "ピカチュウ Pikachu",
      "ガブリアス Garchomp",
      "ヴォルケニオン Volcanion",
    ];
    expect(matches(names, "ぴかちゅう")).toEqual(["ピカチュウ Pikachu"]);
    expect(matches(names, "がぶ")).toEqual(["ガブリアス Garchomp"]);
    expect(matches(names, "ゔぉる")).toEqual(["ヴォルケニオン Volcanion"]);
    expect(matches(names, "ﾋﾟｶﾁｭｳ")).toEqual(["ピカチュウ Pikachu"]);
    // A voiced kana still tells apart its unvoiced one
    expect(matches(names, "かぶ")).toEqual([]);
  });

  test("case and accents are still ignored, as before", () => {
    const names = ["Flabébé Flabébé", "Pokémon Pokemon", "Garchomp Garchomp"];
    expect(matches(names, "flabebe")).toEqual(["Flabébé Flabébé"]);
    expect(matches(names, "FLABÉBÉ")).toEqual(["Flabébé Flabébé"]);
    expect(matches(names, "GARCH")).toEqual(["Garchomp Garchomp"]);
    expect(matches(names, "")).toEqual(names);
    expect(matches(names, "xyz")).toEqual([]);
  });
});
