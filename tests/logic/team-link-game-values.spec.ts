import { test, expect } from "./fixtures";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import { LETS_GO, LEGENDS_ARCEUS, LEGENDS_ZA } from "@/shared/game-variants";
import { DEFAULT_TEAM_SETTINGS } from "@/shared/team";
import {
  battleFormatFromUrl,
  generationSettingsFromUrl,
  importTeamFromUrlParameter,
  syncTeamSettingsToUrl,
} from "@/app/shared/team-link";
import { toBase64Url } from "@/app/shared/base64url";
import { parseTeamText, serializeTeam } from "@/store/team-text";

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
      expect(generationSettingsFromUrl()).toEqual({
        settings,
        unrecognized: false,
      });
      syncTeamSettingsToUrl(url, settings);
      expect(url.search).toBe(`?game=${slug}`);
      expect(generationSettingsFromUrl()).toEqual({
        settings,
        unrecognized: false,
      });
    });
  });
}

for (const profile of profiles.filter(profile => !games.includes(profile))) {
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

// Oct 10–13, 2026 links wrote the format's display name, as in ?game=Pokemon+Champions+%28M-C%29
test("Champions links made with the display-name game value still open as Champions", ({
  store,
}) => {
  const team = parseTeamText(
    "Garchomp @ Choice Scarf\nAbility: Rough Skin\nEVs: 32 Atk / 2 SpD / 32 Spe\nJolly Nature\n- Earthquake",
    9,
    CHAMPIONS_FORMAT,
  );
  const saved = store.addTeam({
    generation: 9,
    format: CHAMPIONS_FORMAT,
    team,
  });
  store.addTeam();
  const url = new URL("https://mypokemonteam.com/");
  // The value published Oct 10–13, 2026, independent of the current name
  url.searchParams.set("game", "Pokemon Champions (M-C)");
  url.searchParams.set(
    "team",
    toBase64Url(serializeTeam(team, 9, CHAMPIONS_FORMAT)),
  );
  expect(url.search).toContain("game=Pokemon+Champions+%28M-C%29");
  withUrl(url, () => {
    expect(generationSettingsFromUrl()).toEqual({
      settings: { generation: 9, format: CHAMPIONS_FORMAT },
      unrecognized: false,
    });
    importTeamFromUrlParameter(url.searchParams.get("team") ?? "");
    expect(store.currentTeamId).toBe(saved.id);
    syncTeamSettingsToUrl(url, store.currentTeam);
    expect(url.searchParams.get("game")).toBe("champions");
  });
});

test("unpublished display-name game values are not URL aliases", () => {
  for (const { format } of profiles.filter(
    profile => profile.slug !== "champions",
  )) {
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
  const za = { generation: 9, format: LEGENDS_ZA };
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
    ["?game=Pokemon+Champions+%28M-C%29", champions, false],
    ["?game=legends-za", za, false],
    ["?gen=8&game=legends-za", za, false],
    ["?gen=6-9&game=legends-za", za, false],
    ["?gen=10&game=legends-za", za, false],
  ] as const;
  for (const [search, settings, unrecognized] of cases)
    withUrl(new URL(`https://mypokemonteam.com/${search}`), () =>
      expect(generationSettingsFromUrl(), search).toEqual({
        settings,
        unrecognized,
      }),
    );
});
