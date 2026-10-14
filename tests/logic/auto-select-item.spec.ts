import { test, expect } from "@playwright/test";
import { getAutoSelectedItem } from "@/shared/team";
import { isItemAvailable, learnsetsReady } from "@/store/learnsets";
import type { Generation } from "@/types";

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

  for (const pokemon of [
    "mrmimegalar",
    "meganium",
    "yanmega",
    "rayquazamega",
    "arceus",
    "",
  ]) {
    test(`"${pokemon}" keeps its current item`, () => {
      expect(getAutoSelectedItem(pokemon, "leftovers")).toBe("leftovers");
    });
  }

  test("Giratina-Origin holds the Griseous Orb before Gen 9, which has the Griseous Core", async () => {
    await learnsetsReady;
    const item = (generation: Generation) =>
      getAutoSelectedItem("giratinaorigin", "", item =>
        isItemAvailable(item, generation),
      );
    for (const generation of [4, 5, 6, 7, 8] as const)
      expect(item(generation)).toBe("griseousorb");
    expect(item(9)).toBe("griseouscore");
  });

  test("an item-dependent forme holds the first of its items that the generation has", async () => {
    await learnsetsReady;
    expect(
      getAutoSelectedItem("arceuselectric", "", item =>
        isItemAvailable(item, 4),
      ),
    ).toBe("zapplate");
    // No Gen 2 item suits it, so it keeps the item Showdown names first
    expect(
      getAutoSelectedItem("arceuselectric", "", item =>
        isItemAvailable(item, 2),
      ),
    ).toBe("zapplate");
  });
});
