import { test, expect } from "@playwright/test";
import pokedex from "@/data/pokedex";
import {
  bulbapediaUrl,
  serebiiDexUrl,
  showdownDexUrl,
  smogonDexUrl,
} from "@/shared/dex-urls";
import { introducedIn } from "@/store/filtering";
import { LATEST_GENERATION } from "@/shared/generations";
import type { Generation, PokedexEntry } from "@/types";

// Pokemon whose names or formes need care in a URL
const NICE_POKEMON = [
  "mrmime",
  "mimejr",
  "farfetchd",
  "sirfetchd",
  "flabebe",
  "typenull",
  "nidoranf",
  "nidoranm",
  "hooh",
  "porygonz",
  "jangmoo",
  "kommoo",
  "tapukoko",
  "urshifurapidstrike",
  "rotomwash",
  "charizardmegax",
  "venusaurgmax",
  "meowthgalar",
  "ogerponwellspring",
  "necrozmaduskmane",
  "zygarde10",
  "oricoriopau",
  "basculegionf",
  "greattusk",
  "ironvaliant",
  "wochien",
  "pikachuoriginal",
  "arceusfire",
  "silvallysteel",
];

const RANDOM_COUNT = 10;

// Playwright's runner and its workers each build the test list, so they draw
// the same pokemon: a seed from the environment, else a new one each day
const seed = process.env.DEX_LINKS_SEED ?? new Date().toDateString();
const random = (() => {
  let state = [...seed].reduce((hash, char) => {
    return Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  }, 2166136261);
  return () => {
    state = (Math.imul(state ^ (state >>> 15), state | 1) >>> 0) ^ state;
    state = (state + Math.imul(state ^ (state >>> 7), state | 61)) >>> 0;
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
})();

const isStandard = ({ num = 0, isNonstandard }: PokedexEntry) =>
  num > 0 && !isNonstandard;

const pickRandom = (ids: string[], count: number) => {
  const pool = [...ids];
  const picked: string[] = [];
  while (picked.length < count && pool.length) {
    const [id] = pool.splice(Math.floor(random() * pool.length), 1);
    if (id) picked.push(id);
  }
  return picked;
};

const standardIds = Object.entries(pokedex)
  .filter(([, entry]) => isStandard(entry))
  .map(([id]) => id);
const randomPokemon = pickRandom(
  standardIds.filter(id => !NICE_POKEMON.includes(id)),
  RANDOM_COUNT,
);

// Each pokemon in the latest generation, and the random ones in their first generation as well
const cases = [...NICE_POKEMON, ...randomPokemon].flatMap(id => {
  const entry = pokedex[id];
  if (!entry) throw new Error(`${id} is not in the pokedex`);
  const generations = new Set<Generation>([LATEST_GENERATION as Generation]);
  if (randomPokemon.includes(id)) generations.add(introducedIn(entry));
  return [...generations].map(generation => ({ id, entry, generation }));
});

// The sites write the name with single accented characters and a straight apostrophe
const plainText = (text: string) => text.normalize("NFC").replace(/’/g, "'");

const describeCase = ({
  entry,
  generation,
}: {
  entry: PokedexEntry;
  generation: Generation;
}) => `${entry.name} in Gen ${generation}`;

test.describe("Smogon dex links", () => {
  for (const c of cases) {
    test(describeCase(c), async ({ request }) => {
      const url = smogonDexUrl(
        c.generation,
        c.entry.baseSpecies ?? c.entry.name ?? c.id,
      );
      const response = await request.get(url);
      expect(response.status(), url).toBe(200);
    });
  }
});

test.describe("Serebii dex links", () => {
  for (const c of cases) {
    test(describeCase(c), async ({ request }) => {
      const url = serebiiDexUrl(
        c.generation,
        c.entry.num ?? 0,
        c.entry.baseSpecies ?? c.entry.name ?? c.id,
      );
      const response = await request.get(url);
      expect(response.status(), url).toBe(200);
    });
  }
});

test.describe("Showdown dex links", () => {
  // The dex renders in the browser, and shows the number only for a pokemon it knows
  for (const c of cases.filter(({ generation }) => generation === 9)) {
    test(describeCase(c), async ({ page }) => {
      const url = showdownDexUrl(c.id);
      await page.goto(url, { waitUntil: "domcontentloaded" });
      const heading = await page.locator("h1").first().textContent();
      expect(plainText(heading ?? ""), url).toContain(
        plainText(`${c.entry.name} #${c.entry.num}`),
      );
    });
  }
});

test.describe("Bulbapedia links", () => {
  for (const c of cases.filter(({ generation }) => generation === 9)) {
    test(describeCase(c), async ({ page }) => {
      const name = c.entry.baseSpecies ?? c.entry.name ?? c.id;
      const url = bulbapediaUrl(name);
      const response = await page.goto(url, { waitUntil: "domcontentloaded" });
      // Bulbapedia's bot protection challenges automated browsers
      test.skip(
        response?.status() === 403,
        "Bulbapedia challenged the browser instead of serving the page",
      );
      expect(response?.status(), url).toBe(200);
      const heading = await page.locator("h1").first().textContent();
      expect(plainText(heading ?? ""), url).toContain(
        plainText(name.replace(/^Nidoran-[FM]$/, "Nidoran")),
      );
    });
  }
});
