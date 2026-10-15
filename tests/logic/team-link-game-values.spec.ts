import { test, expect } from "@playwright/test";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import { LETS_GO, LEGENDS_ARCEUS, LEGENDS_ZA } from "@/shared/game-variants";
import {
  generationSettingsFromUrl,
  syncGenerationToUrl,
} from "@/app/shared/team-link";

const profiles = [
  { slug: "champions", format: CHAMPIONS_FORMAT, generation: 9 },
  { slug: "lets-go", format: LETS_GO, generation: 7 },
  { slug: "legends-arceus", format: LEGENDS_ARCEUS, generation: 8 },
  { slug: "legends-za", format: LEGENDS_ZA, generation: 9 },
] as const;

function withUrl(url: URL, run: () => void) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "location");
  Object.defineProperty(globalThis, "location", {
    configurable: true,
    value: url,
  });
  try {
    run();
  } finally {
    if (descriptor) Object.defineProperty(globalThis, "location", descriptor);
    else Reflect.deleteProperty(globalThis, "location");
  }
}

const games = profiles.filter(({ slug }) =>
  ["champions", "legends-za"].includes(slug),
);

for (const { slug, format, generation } of games) {
  test(`${slug} links select their game and serialize without gen`, () => {
    const url = new URL(`https://mypokemonteam.com/?game=${slug}&gen=1`);
    const settings = { generation, format };
    withUrl(url, () => {
      expect(generationSettingsFromUrl()).toEqual(settings);
      syncGenerationToUrl(url, settings);
      expect(url.search).toBe(`?game=${slug}`);
      expect(generationSettingsFromUrl()).toEqual(settings);
    });
  });
}

for (const profile of profiles.filter(profile => !games.includes(profile))) {
  test(`${profile.slug} is coming soon and cannot select a game through the URL`, () => {
    const url = new URL(`https://mypokemonteam.com/?game=${profile.slug}`);
    withUrl(url, () => {
      expect(generationSettingsFromUrl()).toBeUndefined();
      url.searchParams.set("gen", String(profile.generation));
      expect(generationSettingsFromUrl()).toEqual({
        generation: profile.generation,
        format: "",
      });
      syncGenerationToUrl(url, profile);
      expect(url.search).toBe(`?gen=${profile.generation}`);
    });
  });
}

test("unpublished display-name game values are not URL aliases", () => {
  for (const { format } of profiles) {
    const url = new URL("https://mypokemonteam.com/");
    url.searchParams.set("game", format);
    withUrl(url, () => expect(generationSettingsFromUrl()).toBeUndefined());
  }
});
