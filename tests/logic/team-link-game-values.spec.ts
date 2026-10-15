import { test, expect } from "./fixtures";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import { LETS_GO, LEGENDS_ARCEUS, LEGENDS_ZA } from "@/shared/game-variants";
import {
  generationSettingsFromUrl,
  importTeamFromUrlParameter,
  syncGenerationToUrl,
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

test("Champions links select Gen 9 and serialize without gen", () => {
  const url = new URL("https://mypokemonteam.com/?game=champions&gen=1");
  const settings = { generation: 9, format: CHAMPIONS_FORMAT } as const;
  withUrl(url, () => {
    expect(generationSettingsFromUrl()).toEqual(settings);
    syncGenerationToUrl(url, settings);
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
      syncGenerationToUrl(url, profile);
      expect(url.search).toBe(`?gen=${profile.generation}`);
    });
  });
}

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
  url.searchParams.set("game", CHAMPIONS_FORMAT);
  url.searchParams.set(
    "team",
    toBase64Url(serializeTeam(team, 9, CHAMPIONS_FORMAT)),
  );
  expect(url.search).toContain("game=Pokemon+Champions+%28M-C%29");
  withUrl(url, () => {
    expect(generationSettingsFromUrl()).toEqual({
      generation: 9,
      format: CHAMPIONS_FORMAT,
    });
    importTeamFromUrlParameter(url.searchParams.get("team") ?? "");
    expect(store.currentTeamId).toBe(saved.id);
    syncGenerationToUrl(url, store.currentTeam);
    expect(url.searchParams.get("game")).toBe("champions");
  });
});

test("unpublished display-name game values are not URL aliases", () => {
  for (const { format } of profiles.filter(
    profile => profile.slug !== "champions",
  )) {
    const url = new URL("https://mypokemonteam.com/");
    url.searchParams.set("game", format);
    withUrl(url, () => expect(generationSettingsFromUrl()).toBeUndefined());
  }
});
