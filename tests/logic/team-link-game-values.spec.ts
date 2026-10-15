import { test, expect } from "./fixtures";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import { LETS_GO, LEGENDS_ARCEUS, LEGENDS_ZA } from "@/shared/game-variants";
import { DEFAULT_TEAM_SETTINGS } from "@/shared/team";
import {
  battleFormatFromUrl,
  encodeTeamForUrl,
  generationSettingsFromUrl,
  importTeamFromUrlParameter,
  syncTeamSettingsToUrl,
} from "@/app/shared/team-link";
import { toBase64Url } from "@/app/shared/base64url";
import {
  parseTeamsText,
  parseTeamText,
  serializeTeam,
} from "@/store/team-text";

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

// Both Legends games were Coming soon Oct 10–13, 2026, so no link named them by display name
test("the Legends games' display names are not URL aliases", () => {
  for (const format of [LEGENDS_ARCEUS, LEGENDS_ZA]) {
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

const comingSoonTeams = [
  {
    format: LETS_GO,
    text: `=== [gen7letsgoou] Kanto Bubbles ===

Eevee-Starter (F)
Level: 50
EVs: 200 HP / 200 Atk / 200 Def / 200 SpA / 200 SpD / 200 Spe
Modest Nature
- Bouncy Bubble
- Veevee Volley

Persian-Alola
- Night Slash`,
    details: [
      "EVs: 200 HP / 200 Atk / 200 Def / 200 SpA / 200 SpD / 200 Spe",
      "- Bouncy Bubble",
    ],
  },
  {
    format: LEGENDS_ARCEUS,
    text: `=== [gen8legendsarceus] Hisui Spikes ===

Overqwil
Effort Levels: 10 Atk / 3 Spe
Adamant Nature
- Barb Barrage
- Crunch

Electrode-Hisui
- Chloroblast`,
    details: ["Effort Levels: 10 Atk / 3 Spe", "- Chloroblast"],
  },
];

// Links do not name a Coming soon game, so a team in one shows its generation's link
for (const { format, text, details } of comingSoonTeams) {
  test(`a reload reopens a saved ${format} team, which links show by its generation`, ({
    store,
  }) => {
    const [{ name, ...settings }] = parseTeamsText(text);
    expect(settings.format).toBe(format);
    const other = store.currentTeam;
    const saved = store.addTeam({ ...settings, name });
    const savedText = serializeTeam(saved.team, saved.generation, format);
    // The game's own details, which the link's text, read in its generation, has to match
    for (const detail of details) expect(savedText).toContain(detail);
    const url = new URL("https://mypokemonteam.com/");
    url.searchParams.set("team", encodeTeamForUrl());
    syncTeamSettingsToUrl(url, saved);
    expect(url.searchParams.get("gen")).toBe(String(saved.generation));
    expect(url.searchParams.has("game")).toBe(false);
    const open = () =>
      withUrl(url, () =>
        importTeamFromUrlParameter(url.searchParams.get("team") ?? ""),
      );

    // As a reload does: a new draft, then this tab's team, then the link
    store.openUnsavedTeam();
    store.selectTeam(saved.id);
    open();
    expect(store.currentTeamId).toBe(saved.id);
    expect(store.currentTeam.format).toBe(format);
    expect(serializeTeam(store.team, saved.generation, format)).toBe(savedText);
    expect(store.teams).toHaveLength(2);

    // From any other team, the link opens in its generation, as the game is Coming soon
    store.selectTeam(other.id);
    open();
    expect(store.currentTeamId).not.toBe(saved.id);
    expect(store.currentTeam).toMatchObject({
      generation: saved.generation,
      format: "",
    });
  });
}

// Links made Oct 10–13, 2026 named Let's Go by display name, as in ?game=Let%E2%80%99s+Go&gen=7,
// which opens in Gen 7 while Let's Go is Coming soon
test("Let's Go links made with the display-name game value open in Gen 7, or as the open saved team", ({
  store,
}) => {
  const [{ name, ...settings }] = parseTeamsText(comingSoonTeams[0].text);
  const saved = store.addTeam({ ...settings, name });
  const url = new URL("https://mypokemonteam.com/");
  url.searchParams.set("game", LETS_GO);
  url.searchParams.set("gen", "7");
  url.searchParams.set(
    "team",
    toBase64Url(serializeTeam(saved.team, 7, LETS_GO)),
  );
  expect(url.search).toContain("game=Let%E2%80%99s+Go&gen=7");
  withUrl(url, () => {
    expect(generationSettingsFromUrl()).toEqual({
      settings: { generation: 7, format: "" },
      unrecognized: true,
    });
    store.openUnsavedTeam();
    store.selectTeam(saved.id);
    importTeamFromUrlParameter(url.searchParams.get("team") ?? "");
    expect(store.currentTeamId).toBe(saved.id);
    expect(store.currentTeam.format).toBe(LETS_GO);
  });
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
