import { test, expect } from "@playwright/test";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import { LETS_GO, LEGENDS_ARCEUS, LEGENDS_ZA } from "@/shared/game-variants";
import {
  battleFormatFromUrl,
  generationSettingsFromUrl,
  syncTeamSettingsToUrl,
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
    expect(generationSettingsFromUrl()).toEqual(settings);
    syncTeamSettingsToUrl(url, settings);
    expect(url.search).toBe("?game=champions");
    expect(generationSettingsFromUrl()).toEqual(settings);
  });
});

for (const profile of profiles.filter(
  profile => profile.slug !== "champions",
)) {
  test(`${profile.slug} is coming soon and cannot select a game through the URL`, () => {
    const url = new URL(`https://mypokemonteam.com/?game=${profile.slug}`);
    withUrl(url, () => {
      expect(generationSettingsFromUrl()).toBeUndefined();
      url.searchParams.set("gen", String(profile.generation));
      expect(generationSettingsFromUrl()).toEqual({
        generation: profile.generation,
        format: "",
      });
      syncTeamSettingsToUrl(url, profile);
      expect(url.search).toBe(`?gen=${profile.generation}`);
    });
  });
}

test("links carry the battle format only when it is set", () => {
  const url = new URL("https://mypokemonteam.com/?gen=4");
  withUrl(url, () => {
    expect(battleFormatFromUrl()).toBeUndefined();
    syncTeamSettingsToUrl(url, {
      generation: 4,
      format: "",
      battleFormat: "doubles",
    });
    expect(url.search).toBe("?battle=doubles&gen=4");
    expect(battleFormatFromUrl()).toBe("doubles");
    syncTeamSettingsToUrl(url, { generation: 4, format: "" });
    expect(url.search).toBe("?gen=4");
    url.searchParams.set("battle", "triples");
    expect(battleFormatFromUrl()).toBeUndefined();
  });
});

test("unpublished display-name game values are not URL aliases", () => {
  for (const { format } of profiles) {
    const url = new URL("https://mypokemonteam.com/");
    url.searchParams.set("game", format);
    withUrl(url, () => expect(generationSettingsFromUrl()).toBeUndefined());
  }
});
