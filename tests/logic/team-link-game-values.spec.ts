import { test, expect } from "@playwright/test";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import { LETS_GO, LEGENDS_ARCEUS, LEGENDS_ZA } from "@/shared/game-variants";
import { DEFAULT_TEAM_SETTINGS } from "@/shared/team";
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

test("Champions links select Gen 9 and serialize without gen", () => {
  const url = new URL("https://mypokemonteam.com/?game=champions&gen=1");
  const settings = { generation: 9, format: CHAMPIONS_FORMAT } as const;
  withUrl(url, () => {
    expect(generationSettingsFromUrl()).toEqual({
      settings,
      unrecognized: false,
    });
    syncGenerationToUrl(url, settings);
    expect(url.search).toBe("?game=champions");
    expect(generationSettingsFromUrl()).toEqual({
      settings,
      unrecognized: false,
    });
  });
});

for (const profile of profiles.filter(
  profile => profile.slug !== "champions",
)) {
  test(`${profile.slug} is coming soon and cannot select a game through the URL`, () => {
    const url = new URL(`https://mypokemonteam.com/?game=${profile.slug}`);
    withUrl(url, () => {
      expect(generationSettingsFromUrl()).toEqual({
        settings: DEFAULT_TEAM_SETTINGS,
        unrecognized: true,
      });
      url.searchParams.set("gen", String(profile.generation));
      expect(generationSettingsFromUrl()).toEqual({
        settings: { generation: profile.generation, format: "" },
        unrecognized: true,
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
    withUrl(url, () =>
      expect(generationSettingsFromUrl()).toEqual({
        settings: DEFAULT_TEAM_SETTINGS,
        unrecognized: true,
      }),
    );
  }
});

test("missing, empty, unsupported, and conflicting gen and game values", () => {
  const combined = DEFAULT_TEAM_SETTINGS;
  const champions = { generation: 9, format: CHAMPIONS_FORMAT };
  const gen8 = { generation: 8, format: "" };
  const cases = [
    ["", combined, false],
    ["?team=abc", combined, false],
    ["?gen=6-9", combined, false],
    ["?gen=8", gen8, false],
    ["?gen=", combined, false],
    ["?game=", combined, false],
    ["?gen=&game=", combined, false],
    ["?gen=8&game=", gen8, false],
    ["?gen=6-9&game=", combined, false],
    ["?gen=10", combined, true],
    ["?gen=0", combined, true],
    ["?gen=gen8", combined, true],
    ["?game=foo", combined, true],
    ["?gen=8&game=foo", gen8, true],
    ["?gen=6-9&game=foo", combined, true],
    ["?gen=10&game=foo", combined, true],
    ["?gen=8&game=champions", champions, false],
    ["?gen=10&game=champions", champions, false],
    ["?gen=&game=champions", champions, false],
  ] as const;
  for (const [search, settings, unrecognized] of cases)
    withUrl(new URL(`https://mypokemonteam.com/${search}`), () =>
      expect(generationSettingsFromUrl(), search).toEqual({
        settings,
        unrecognized,
      }),
    );
});
