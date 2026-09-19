import { test, expect } from "@playwright/test";
import { getAutoSelectedItem } from "@/shared/team";

test.describe("auto-selected items", () => {
  const cases: [string, string][] = [
    ["blastoisemega", "blastoisinite"],
    ["charizardmegax", "charizarditex"],
    ["charizardmegay", "charizarditey"],
    ["raichumegay", "raichunitey"],
    ["absolmegaz", "absolitez"],
    ["garchompmegaz", "garchompitez"],
    ["lucariomegaz", "lucarionitez"],
    ["sharpedomega", "sharpedonite"],
    ["dragonitemega", "dragoninite"],
    ["arceuselectric", "zapplate"],
    ["genesectdouse", "dousedrive"],
    ["silvallyghost", "ghostmemory"],
    ["giratinaorigin", "griseouscore"],
    ["groudonprimal", "redorb"],
    ["zaciancrowned", "rustedsword"],
    ["ogerponwellspring", "wellspringmask"],
  ];

  for (const [pokemon, item] of cases) {
    test(`${pokemon} holds ${item}`, () => {
      expect(getAutoSelectedItem(pokemon, "leftovers")).toBe(item);
    });
  }

  for (const pokemon of ["mrmimegalar", "meganium", "yanmega", "rayquazamega", "arceus", ""]) {
    test(`"${pokemon}" keeps its current item`, () => {
      expect(getAutoSelectedItem(pokemon, "leftovers")).toBe("leftovers");
    });
  }
});
