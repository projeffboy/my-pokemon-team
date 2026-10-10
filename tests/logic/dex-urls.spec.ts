import { test, expect } from "@playwright/test";
import pokedex from "@/data/pokedex";
import {
  bulbapediaUrl,
  serebiiDexUrl,
  showdownDexUrl,
  smogonDexUrl,
} from "@/shared/dex-urls";

test.describe("dex links", () => {
  test("Smogon pages are named after the base species in each generation's games", () => {
    expect(smogonDexUrl(9, "Garchomp")).toBe(
      "https://www.smogon.com/dex/sv/pokemon/garchomp/",
    );
    expect(smogonDexUrl(1, "Mr. Mime")).toBe(
      "https://www.smogon.com/dex/rb/pokemon/mr-mime/",
    );
    expect(smogonDexUrl(7, "Type: Null")).toContain("/sm/pokemon/type-null/");
    expect(smogonDexUrl(6, "Flabébé")).toContain("/xy/pokemon/flabebe/");
    expect(smogonDexUrl(8, "Farfetch'd")).toContain("/ss/pokemon/farfetchd/");
    expect(smogonDexUrl(8, "Farfetch’d")).toContain("/ss/pokemon/farfetchd/");
    expect(smogonDexUrl(4, "Porygon-Z")).toContain("/dp/pokemon/porygon-z/");
    expect(smogonDexUrl(2, "Ho-Oh")).toContain("/gs/pokemon/ho-oh/");
  });

  test("Bulbapedia pages are named after the pokemon, with Nidoran's gender signs", () => {
    expect(bulbapediaUrl("Mr. Mime")).toBe(
      "https://bulbapedia.bulbagarden.net/wiki/Mr._Mime_(Pok%C3%A9mon)",
    );
    expect(bulbapediaUrl("Nidoran-F")).toBe(
      "https://bulbapedia.bulbagarden.net/wiki/Nidoran%E2%99%80_(Pok%C3%A9mon)",
    );
    // Showdown writes the accents as combining marks and a curly apostrophe
    expect(bulbapediaUrl("Flabe\u0301be\u0301")).toContain(
      "/wiki/Flab%C3%A9b%C3%A9_(",
    );
    expect(bulbapediaUrl("Type: Null")).toContain("/wiki/Type:_Null_(");
    expect(bulbapediaUrl("Farfetch’d")).toContain("/wiki/Farfetch'd_(");
  });

  test("Serebii pages are numbered per generation until Gen 8, and named in Gen 9", () => {
    expect(serebiiDexUrl(7, 445, "Garchomp")).toBe(
      "https://www.serebii.net/pokedex-sm/445.shtml",
    );
    expect(serebiiDexUrl(1, 35, "Clefable")).toBe(
      "https://www.serebii.net/pokedex/035.shtml",
    );
    expect(serebiiDexUrl(8, 1, "Bulbasaur")).toBe(
      "https://www.serebii.net/pokedex-swsh/001.shtml",
    );
    // Serebii's Scarlet and Violet dex has no page for Type: Null or Nidoran
    expect(serebiiDexUrl(9, 445, "Garchomp")).toBe(
      "https://www.serebii.net/pokemon/garchomp/",
    );
    expect(serebiiDexUrl(9, 772, "Type: Null")).toContain(
      "/pokemon/type:null/",
    );
    expect(serebiiDexUrl(9, 29, "Nidoran-F")).toContain("/pokemon/nidoranf/");
    expect(serebiiDexUrl(9, 122, "Mr. Mime")).toContain("/pokemon/mr.mime/");
    expect(serebiiDexUrl(9, 83, "Farfetch’d")).toContain(
      "/pokemon/farfetch'd/",
    );
    expect(serebiiDexUrl(9, 669, "Flabe\u0301be\u0301")).toContain(
      "/pokemon/flabebe/",
    );
    expect(serebiiDexUrl(9, 785, "Tapu Koko")).toContain("/pokemon/tapukoko/");
    expect(serebiiDexUrl(9, 250, "Ho-Oh")).toContain("/pokemon/ho-oh/");
  });

  test("Showdown dex pages use every pokemon's Showdown ID", () => {
    expect(showdownDexUrl("Urshifu-Rapid-Strike")).toBe(
      "https://dex.pokemonshowdown.com/pokemon/urshifurapidstrike",
    );
    expect(showdownDexUrl("Flabébé")).toContain("/pokemon/flabebe");
    for (const [id, { name = "" }] of Object.entries(pokedex)) {
      expect(showdownDexUrl(name), name).toBe(showdownDexUrl(id));
    }
  });
});
