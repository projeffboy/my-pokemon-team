import { test, expect } from "./fixtures";
import { createTeam } from "./shared/team";
import { createSavedTeam } from "@/shared/team";
import {
  LEGACY_LINK_PARSING_OPTIONS,
  parseTeamText,
  parseTeamsText,
  serializeTeam,
  serializeTeams,
} from "@/store/team-text";
import {
  encodeTeamForUrl,
  importTeamFromUrlParameter,
} from "@/app/shared/team-link";
import { fromBase64Url, toBase64Url } from "@/app/shared/base64url";
import { getStatExperience } from "@/shared/generation-rules";
import { STAT_KEYS } from "@/types";
import { sanitizeSavedTeam } from "@/store/teams-storage";

function withGenerationUrl(generation: number, run: () => void) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "location");
  Object.defineProperty(globalThis, "location", {
    configurable: true,
    value: new URL(`https://example.test/?gen=${generation}`),
  });
  try {
    run();
  } finally {
    if (previous) Object.defineProperty(globalThis, "location", previous);
    else Reflect.deleteProperty(globalThis, "location");
  }
}

test("explicit blank abilities survive text import and new links; old links retain auto-selection", ({
  store,
}) => {
  for (const line of ["Ability: ", "Trait: ", "Ability: No Ability"])
    expect(parseTeamText(`Gengar\n${line}\n- Shadow Ball`, 6)[0].ability).toBe(
      "",
    );
  expect(parseTeamText("Gengar\n- Shadow Ball", 6)[0].ability).toBe("Levitate");
  withGenerationUrl(6, () => {
    for (const line of ["", "Ability: "]) {
      importTeamFromUrlParameter(
        toBase64Url(`Gengar\n${line ? `${line}\n` : ""}- Shadow Ball`),
      );
      expect(store.team[0].ability).toBe("Levitate");
    }
    store.currentTeam.generation = 6;
    store.replaceTeam(createTeam({ name: "gengar", move1: "shadowball" }));
    const encoded = encodeTeamForUrl();
    expect(fromBase64Url(encoded)).toContain("Ability: No Ability");
    store.replaceTeam(createTeam());
    importTeamFromUrlParameter(encoded);
    expect(store.team[0].ability).toBe("");
    expect(store.team[0].move1).toBe("shadowball");
  });
});

test("old auto-filled ability links still select the matching cleared saved team", ({
  store,
}) => {
  store.currentTeam.generation = 6;
  store.replaceTeam(createTeam({ name: "gengar", move1: "shadowball" }));
  const id = store.currentTeamId;
  withGenerationUrl(6, () => {
    importTeamFromUrlParameter(
      toBase64Url("Gengar @ \nAbility: \n- Shadow Ball\n-\n-\n-\n\n"),
    );
    expect(store.currentTeamId).toBe(id);
    expect(store.team[0].ability).toBe("");
    expect(store.teams).toHaveLength(1);
  });
});

for (const generation of [1, 2] as const) {
  test(`Gen ${generation} external omitted EVs mean full training; old site text and links keep zero`, ({
    store,
  }) => {
    const bare = "Hypno\n- Psychic";
    const external = parseTeamText(bare, generation)[0];
    for (const stat of STAT_KEYS) expect(external.evs?.[stat]).toBe(252);
    expect(getStatExperience(external, "spa")).toBe(252 ** 2);
    expect(
      parseTeamText("Hypno\nAbility: No Ability\n- Psychic", generation)[0].evs,
    ).toEqual(external.evs);
    const ownOld = "Hypno @ \nAbility: \n- Psychic\n-\n-\n-";
    for (const text of [
      ownOld,
      "Hypno\nEVs: 0 HP\n- Psychic",
      "Hypno\nStat Experience: \n- Psychic",
    ])
      expect(parseTeamText(text, generation)[0].evs).toBeUndefined();
    expect(
      parseTeamsText(`=== [gen${generation}] Old backup ===\n\n${ownOld}`)[0]
        ?.team[0].evs,
    ).toBeUndefined();
    withGenerationUrl(generation, () => {
      for (const text of [bare, ownOld]) {
        importTeamFromUrlParameter(toBase64Url(text));
        expect(store.team[0].evs).toBeUndefined();
      }
      store.addTeam({
        generation,
        format: "",
        team: createTeam({ name: "hypno", move1: "psychic" }),
      });
      const id = store.currentTeamId;
      const encoded = encodeTeamForUrl();
      expect(fromBase64Url(encoded)).toContain(
        "EVs: 0 HP / 0 Atk / 0 Def / 0 SpA / 0 SpD / 0 Spe",
      );
      importTeamFromUrlParameter(encoded);
      expect(store.currentTeamId).toBe(id);
      expect(store.team[0].evs).toBeUndefined();
    });
  });

  test(`Gen ${generation} zero-training exports and backups retain zero; modern defaults stay omitted`, () => {
    const team = createTeam({ name: "hypno", move1: "psychic" });
    const exported = serializeTeam(team, generation);
    expect(exported).toContain("EVs: 0 HP");
    expect(parseTeamText(exported, generation)).toEqual(team);
    expect(serializeTeam(team, 3)).not.toContain("EVs:");
    const backup = serializeTeams([createSavedTeam({ generation, team })]);
    expect(backup).toContain("EVs: 0 HP");
    expect(parseTeamsText(backup)[0]?.team).toEqual(team);
    const nonzero = createTeam({
      name: "hypno",
      evs: { hp: 100 },
      statExperience: { hp: 9999 },
    });
    expect(
      parseTeamText(serializeTeam(nonzero, generation), generation),
    ).toEqual(nonzero);
  });
}

test("Gen 7 old omitted-IV links keep default IVs, while new capped sets write explicit IVs", ({
  store,
}) => {
  const text = "Raikou\nAbility: Pressure\n- Hidden Power Ice";
  withGenerationUrl(7, () => {
    importTeamFromUrlParameter(toBase64Url(text));
    expect(store.team[0].ivs).toBeUndefined();
    expect(parseTeamText(text, 7)[0].ivs).toBeUndefined();
    store.currentTeam.generation = 7;
    store.replaceTeam(
      createTeam({
        name: "raikou",
        ability: "Pressure",
        move1: "hiddenpowerice",
      }),
    );
    const encoded = encodeTeamForUrl();
    expect(fromBase64Url(encoded)).toContain(
      "IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe",
    );
    store.replaceTeam(createTeam());
    importTeamFromUrlParameter(encoded);
    expect(store.team[0].ivs).toBeUndefined();
    expect(store.team[0].move1).toBe("hiddenpowerice");
  });
  expect(
    parseTeamText(text, 7, "", LEGACY_LINK_PARSING_OPTIONS)[0].ivs,
  ).toBeUndefined();
});

test("new explicitly cleared links do not select a saved team with an auto-selected ability", ({
  store,
}) => {
  store.currentTeam.generation = 6;
  store.replaceTeam(
    createTeam({ name: "gengar", ability: "Levitate", move1: "shadowball" }),
  );
  const id = store.currentTeamId;
  const text = serializeTeam(
    createTeam({ name: "gengar", move1: "shadowball" }),
    6,
  );
  withGenerationUrl(6, () => importTeamFromUrlParameter(toBase64Url(text)));
  expect(store.currentTeamId).not.toBe(id);
  expect(store.team[0].ability).toBe("");
  expect(store.teams).toHaveLength(1);
});

test("raw old legacy saves without EVs retain zero training", () => {
  const saved = sanitizeSavedTeam({
    id: "old",
    name: "Old",
    generation: 1,
    team: [{ name: "hypno", move1: "psychic" }],
  });
  expect(saved?.team[0]?.evs).toBeUndefined();
  expect(getStatExperience(saved?.team[0] ?? createTeam()[0], "spa")).toBe(0);
});

test("old omitted-IV links still select the saved capped set they previously matched", ({
  store,
}) => {
  store.currentTeam.generation = 7;
  store.currentTeam.format = "";
  store.replaceTeam(
    createTeam({
      name: "raikou",
      ability: "Pressure",
      move1: "hiddenpowerice",
    }),
  );
  const id = store.currentTeamId;
  withGenerationUrl(7, () =>
    importTeamFromUrlParameter(
      toBase64Url(
        "Raikou @ \nAbility: Pressure\n- Hidden Power Ice\n-\n-\n-\n\n",
      ),
    ),
  );
  expect(store.currentTeamId).toBe(id);
  expect(store.team[0].ivs).toBeUndefined();
  expect(store.teams).toHaveLength(1);
});

for (const generation of [2, 3, 6] as const) {
  test(`Gen ${generation} old Hidden Power links preserve omitted IVs while external imports infer them`, ({
    store,
  }) => {
    const text = "Raikou\n- Hidden Power Ice";
    withGenerationUrl(generation, () => {
      importTeamFromUrlParameter(toBase64Url(text));
      expect(store.team[0].ivs).toBeUndefined();
      expect(store.team[0].move1).toBe("hiddenpowerice");
    });
    expect(parseTeamText(text, generation)[0].ivs).toBeDefined();
    const explicit = "Raikou\nIVs: 0 Atk / 30 Def\n- Hidden Power Ice";
    expect(
      parseTeamText(explicit, generation, "", LEGACY_LINK_PARSING_OPTIONS)[0]
        .ivs,
    ).toEqual({ atk: 0, def: 30 });
  });
}
