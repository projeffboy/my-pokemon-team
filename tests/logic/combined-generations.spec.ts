import { test, expect } from "./fixtures";
import { initialStoredState, sanitizeSavedTeam } from "@/store/teams-storage";
import { parseTeamBackup, serializeTeamBackup } from "@/store/team-backup";
import { COMBINED_GENERATIONS_FORMAT } from "@/shared/generation-profile";
import {
  generationLearnset,
  availableItems,
  completeLearnset,
  canItLearn,
  learnsetsReady,
} from "@/store/learnsets";
import {
  generationSettingsFromUrl,
  syncGenerationToUrl,
  importTeamFromUrlParameter,
} from "@/app/shared/team-link";
import { loadGenerationTransferData } from "@/shared/generation-transfer-data";
import { planGenerationTransfer } from "@/store/generation-transfer";
import { createTeam } from "./shared/team";
import { createSavedTeam } from "@/shared/team";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import {
  parseTeamsText,
  serializeTeams,
  parseTeamText,
  serializeTeam,
} from "@/store/team-text";
import { filterPokemon } from "@/store/filtering";
import {
  pokemonAbilities,
  pokemonBaseStats,
  pokemonTypes,
  hasNoAbility,
} from "@/shared/pokedex";
import { getAutoSelectedAbility } from "@/shared/team";
import { completeSet, isSetComplete, randomizeSlotLabel } from "@/store/random";
import { validateTeam } from "@/store/validation";
import pokedex from "@/data/pokedex";

test("combined profiles survive saved-team loading and JSON backups", () => {
  const state = initialStoredState();
  expect(sanitizeSavedTeam(state.teams[0])?.generationProfile).toBe("6-9");
  const backup = parseTeamBackup(
    serializeTeamBackup({
      teams: state.teams,
      currentTeamId: state.currentTeamId,
    }),
  );
  expect(backup?.teams[0]?.generationProfile).toBe("6-9");
  expect(
    sanitizeSavedTeam({ ...state.teams[0], generation: 8 })?.generationProfile,
  ).toBeUndefined();
});

test("combined pools keep Gen 6–9 options while excluding earlier-only items", ({
  store,
}) => {
  store.currentTeam.generationProfile = "6-9";
  expect(store.gamePokemon).toContain("greninja");
  expect(store.gamePokemon).toContain("urshifu");
  expect(store.gamePokemon).not.toContain("missingno");
  expect(
    generationLearnset("tyranitar", 9, COMBINED_GENERATIONS_FORMAT),
  ).toContain("pursuit");
  expect(
    availableItems(["berserkgene"], 9, COMBINED_GENERATIONS_FORMAT),
  ).toEqual([]);
  expect(
    availableItems(
      ["adrenalineorb", "garchompite"],
      9,
      COMBINED_GENERATIONS_FORMAT,
    ),
  ).toEqual(["adrenalineorb", "garchompite"]);
  store.currentTeam.format = "OU: Over Used";
  expect(store.dataFormat).toBe(COMBINED_GENERATIONS_FORMAT);
  store.currentTeam.generationProfile = undefined;
  store.currentTeam.generation = 8;
  store.currentTeam.format = "";
  expect(store.gamePokemon).not.toContain("greninja");
});

test("changing to the combined pool retains otherwise unavailable species and moves", async () => {
  const data = await loadGenerationTransferData();
  const team = createTeam(
    { name: "tyranitar", move1: "pursuit" },
    { name: "greninja", move1: "waterpulse" },
  );
  const plan = planGenerationTransfer(
    team,
    { generation: 8, format: "" },
    9,
    COMBINED_GENERATIONS_FORMAT,
    data,
  );
  expect(plan.team[0]?.move1).toBe("pursuit");
  expect(plan.team[1]?.name).toBe("greninja");
  expect(plan.losses).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ field: "pokemon" })]),
  );
});

test("combined and individual generations have distinct URLs; team-only links default to the combined profile", () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "location");
  const url = new URL("https://mypokemonteam.com/?team=test&gen=9");
  syncGenerationToUrl(url, {
    generation: 9,
    format: "OU: Over Used",
    generationProfile: "6-9",
  });
  expect(url.searchParams.get("gen")).toBe("6-9");
  expect([...url.searchParams.keys()]).toEqual(["gen", "team"]);
  expect(url.searchParams.has("mode")).toBe(false);
  try {
    Object.defineProperty(globalThis, "location", {
      configurable: true,
      value: url,
    });
    expect(generationSettingsFromUrl().settings).toMatchObject({
      generationProfile: "6-9",
      generation: 9,
    });
    syncGenerationToUrl(url, { generation: 9, format: "" });
    expect(url.searchParams.get("gen")).toBe("9");
    expect(generationSettingsFromUrl().settings).toEqual({
      generation: 9,
      format: "",
    });
    url.searchParams.delete("gen");
    expect(generationSettingsFromUrl().settings).toMatchObject({
      generation: 9,
      generationProfile: "6-9",
    });
  } finally {
    if (descriptor) Object.defineProperty(globalThis, "location", descriptor);
    else Reflect.deleteProperty(globalThis, "location");
  }
});

test("New Team keeps the combined profile when a regular Gen 9 empty team already exists", ({
  store,
}) => {
  const combined = store.currentTeam;
  combined.generationProfile = "6-9";
  combined.team[0] = {
    ...combined.team[0],
    name: "porygonz",
    item: "",
    ability: "",
    move1: "",
    move2: "",
    move3: "",
    move4: "",
  };
  store.addTeam({ generationProfile: undefined });
  store.currentTeamId = combined.id;
  expect(store.openEmptyTeam().team.generationProfile).toBe("6-9");
});

test("deleting the last saved team retains its combined profile for the replacement", ({
  store,
}) => {
  store.currentTeam.generationProfile = "6-9";
  store.deleteTeam(store.currentTeamId);
  expect(store.currentTeam.generationProfile).toBe("6-9");
});

test("MissingNo remains Gen 1-only when choosing the combined pool", async () => {
  expect(
    filterPokemon({ generation: 1, format: "", region: "", type: "" }),
  ).toContain("missingno");
  const data = await loadGenerationTransferData();
  const plan = planGenerationTransfer(
    createTeam({ name: "missingno" }),
    { generation: 1, format: "" },
    9,
    COMBINED_GENERATIONS_FORMAT,
    data,
  );
  expect(plan.losses).toContainEqual(
    expect.objectContaining({ field: "pokemon", value: "missingno" }),
  );
});

for (const header of ["gen9", "gen9ou"]) {
  test(`an explicit ${header} import clears the active combined profile`, ({
    store,
  }) => {
    store.currentTeam.generationProfile = "6-9";
    const imported = parseTeamsText(
      `=== [${header}] Imported ===\n\nSerperior\nAbility: Contrary\n- Leaf Storm`,
    )[0];
    expect(imported).toBeDefined();
    const added = store.addTeam(imported);
    expect(added.generationProfile).toBeUndefined();
    expect(added.generation).toBe(9);
    expect(added.format).toBe(header === "gen9ou" ? "OU: Over Used" : "");
  });
}

test("mixed text backups restore each team's own profile, including named empty teams", ({
  store,
}) => {
  const teams = [
    createSavedTeam({ name: "Empty / Combined", generationProfile: "6-9" }),
    createSavedTeam({
      name: "Combined / Dark",
      generationProfile: "6-9",
      format: "OU: Over Used",
      team: createTeam({
        name: "tyranitar",
        ability: "Sand Stream",
        item: "leftovers",
        move1: "pursuit",
      }),
    }),
    createSavedTeam({
      name: "Regular",
      team: createTeam({
        name: "serperior",
        ability: "Contrary",
        move1: "leafstorm",
      }),
    }),
    createSavedTeam({
      name: "Champions",
      format: CHAMPIONS_FORMAT,
      team: createTeam({
        name: "garchomp",
        ability: "Rough Skin",
        move1: "earthquake",
      }),
    }),
  ];
  const text = serializeTeams(teams);
  store.currentTeam.format = CHAMPIONS_FORMAT;
  const restored = parseTeamsText(text).map(team => store.addTeam(team));
  const payload = ({
    name,
    generation,
    format,
    generationProfile,
    team,
  }: (typeof teams)[number]) => ({
    name,
    generation,
    format,
    generationProfile,
    team,
  });
  expect(restored.map(payload)).toEqual(teams.map(payload));
});

test("text backups retain a combined profile when every team is empty", () => {
  const teams = [
    createSavedTeam({ name: "Combined empty", generationProfile: "6-9" }),
    createSavedTeam({ name: "Regular empty" }),
  ];
  expect(parseTeamsText(serializeTeams(teams))).toMatchObject([
    { name: "Combined empty", generation: 9, generationProfile: "6-9" },
    { name: "Regular empty", generation: 9 },
  ]);
  expect(
    parseTeamsText(serializeTeams(teams))[1]?.generationProfile,
  ).toBeUndefined();
});

for (const header of ["gen8ou", "gen9champions"]) {
  test(`combined metadata cannot override an incompatible ${header} header`, () => {
    const parsed = parseTeamsText(
      `=== [${header}] Imported ===\n\nKingdra\n# mypokemonteam generation profile: 6-9\nAbility: Swift Swim\n- Surf`,
    )[0];
    expect(parsed?.generationProfile).toBeUndefined();
    expect(parsed?.team[0]?.name).toBe("kingdra");
  });
}

test("combined transfers retain Gengar's historical ability without warning", async () => {
  const data = await loadGenerationTransferData();
  const original = createTeam({
    name: "gengar",
    ability: "Levitate",
    move1: "shadowball",
  });
  const plan = planGenerationTransfer(
    original,
    { generation: 6, format: "" },
    9,
    COMBINED_GENERATIONS_FORMAT,
    data,
  );
  expect(plan.team).toEqual(original);
  expect(plan.losses).toEqual([]);
  expect(original[0]?.ability).toBe("Levitate");
});

test("combined transfer keeps a valid selected ability", async () => {
  const data = await loadGenerationTransferData();
  const plan = planGenerationTransfer(
    createTeam({ name: "gengar", ability: "Cursed Body" }),
    { generation: 7, format: "" },
    9,
    COMBINED_GENERATIONS_FORMAT,
    data,
  );
  expect(plan.team[0]?.ability).toBe("Cursed Body");
  expect(plan.losses).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ field: "ability" })]),
  );
});

test("historical abilities work in pickers, search filters, automatic selection, and random sets", async ({
  store,
}) => {
  store.currentTeam.generationProfile = "6-9";
  store.selectPokemon(0, "gengar");
  expect(store.teamAbilities[0]).toEqual(["Levitate", "Cursed Body"]);
  expect(store.team[0]?.ability).toBe("");
  expect(getAutoSelectedAbility("gengar", 9, COMBINED_GENERATIONS_FORMAT)).toBe(
    "",
  );
  store.filters.ability = "Levitate";
  expect(store.filteredPokemon).toContain("gengar");
  expect(store.filterAbilities).toContain("Levitate");
  const gengar = store.team[0];
  expect(gengar).toBeDefined();
  if (!gengar) throw new Error("Missing team slot");
  expect(
    completeSet(gengar, [], () => 0, 9, COMBINED_GENERATIONS_FORMAT).ability,
  ).toBe("Levitate");
  expect(
    validateTeam(
      createTeam({ name: "gengar", ability: "Levitate" }),
      9,
      COMBINED_GENERATIONS_FORMAT,
    ),
  ).toEqual([]);
  store.currentTeam.generationProfile = undefined;
  expect(store.filteredPokemon).not.toContain("gengar");
  expect(store.teamAbilities[0]).toEqual(["Cursed Body"]);
});

test("combined options include the special games and exclude species and moves outside the range", async ({
  store,
}) => {
  store.currentTeam.generationProfile = "6-9";
  for (const name of [
    "pikachustarter",
    "eeveestarter",
    "kleavor",
    "venusaurgmax",
    "garchompmega",
  ])
    expect(store.gamePokemon).toContain(name);
  expect(store.gamePokemon).not.toContain("pokestarufo");
  expect(
    generationLearnset("eeveestarter", 9, COMBINED_GENERATIONS_FORMAT),
  ).toContain("baddybad");
  expect(
    generationLearnset("gengar", 9, COMBINED_GENERATIONS_FORMAT),
  ).toContain("rage");
  expect(generationLearnset("gengar", 8)).not.toContain("rage");
  expect(
    generationLearnset("bulbasaur", 9, COMBINED_GENERATIONS_FORMAT),
  ).not.toContain("ancientpower");
  expect(
    pokemonAbilities("gengar", 9, COMBINED_GENERATIONS_FORMAT),
  ).not.toContain("No Ability");
  expect(
    pokemonAbilities("eeveestarter", 9, COMBINED_GENERATIONS_FORMAT),
  ).toEqual(["No Ability"]);
});

test("combined transfers remove earlier-only options and individual Gen 9 still removes historical abilities", async () => {
  const data = await loadGenerationTransferData();
  const original = createTeam(
    {
      name: "gengar",
      ability: "Levitate",
      item: "berserkgene",
      move1: "shadowball",
      move2: "rage",
    },
    { name: "bulbasaur", move1: "ancientpower" },
  );
  const plan = planGenerationTransfer(
    original,
    { generation: 2, format: "" },
    9,
    COMBINED_GENERATIONS_FORMAT,
    data,
  );
  expect(plan.team[0]).toMatchObject({
    ability: "Levitate",
    item: "",
    move1: "shadowball",
    move2: "rage",
  });
  expect(plan.losses).toContainEqual(
    expect.objectContaining({ field: "item", value: "berserkgene" }),
  );
  expect(plan.losses).toContainEqual(
    expect.objectContaining({ field: "move", value: "ancientpower" }),
  );
  const native = planGenerationTransfer(
    createTeam({ name: "gengar", ability: "Levitate" }),
    { generation: 9, format: "", generationProfile: "6-9" },
    9,
    "",
    data,
  );
  expect(native.losses).toContainEqual(
    expect.objectContaining({ field: "ability", value: "Levitate" }),
  );
});

test("combined calculations use latest stats and types", () => {
  expect(pokemonBaseStats("dugtrio", 9, COMBINED_GENERATIONS_FORMAT)?.atk).toBe(
    100,
  );
  expect(pokemonBaseStats("dugtrio", 6)?.atk).toBe(80);
  expect(pokemonTypes("clefable", 9)).toEqual(["Fairy"]);
});

test("the combined format accepts every move its learnsets offer", async () => {
  await learnsetsReady;
  for (const name of Object.keys(pokedex))
    expect(
      generationLearnset(name, 9, COMBINED_GENERATIONS_FORMAT).filter(
        move => !canItLearn(move, name, 9, COMBINED_GENERATIONS_FORMAT),
      ),
      name,
    ).toEqual([]);
});

test("the combined format accepts a move its pokemon lost after Gen 7", async () => {
  await learnsetsReady;
  expect(generationLearnset("audino", 8)).not.toContain("return");
  expect(
    generationLearnset("audino", 9, COMBINED_GENERATIONS_FORMAT),
  ).toContain("return");
  expect(canItLearn("return", "audino", 9, COMBINED_GENERATIONS_FORMAT)).toBe(
    true,
  );
  expect(
    parseTeamText("Audino\n- Return", 9, COMBINED_GENERATIONS_FORMAT)[0]?.move1,
  ).toBe("return");
});

test("combined learnsets include special-game moves for alternate formes without unlearnable battle moves", async ({
  store,
}) => {
  store.currentTeam.generationProfile = "6-9";
  for (const [pokemon, move] of [
    ["vivillonfancy", "weatherball"],
    ["toxtricitylowkey", "zapcannon"],
    ["tatsugiristretchy", "ancientpower"],
  ] as const) {
    const learnset = generationLearnset(
      pokemon,
      9,
      COMBINED_GENERATIONS_FORMAT,
    );
    expect(learnset).toContain(move);
    const data = await loadGenerationTransferData();
    const plan = planGenerationTransfer(
      createTeam({ name: pokemon, move1: move }),
      { generation: 9, format: "", generationProfile: "6-9" },
      9,
      COMBINED_GENERATIONS_FORMAT,
      data,
    );
    expect(plan.team[0]?.move1).toBe(move);
    expect(plan.losses).toEqual([]);
  }
  expect(
    generationLearnset("smeargle", 9, COMBINED_GENERATIONS_FORMAT),
  ).not.toContain("breakneckblitz");
});

function withLocation(url: string, run: () => void) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "location");
  try {
    Object.defineProperty(globalThis, "location", {
      configurable: true,
      value: new URL(url),
    });
    run();
  } finally {
    if (descriptor) Object.defineProperty(globalThis, "location", descriptor);
    else Reflect.deleteProperty(globalThis, "location");
  }
}

test("all union-only move additions survive team text and backup round trips", async () => {
  await learnsetsReady;
  const additions = Object.keys(pokedex).flatMap(name =>
    generationLearnset(name, 9, COMBINED_GENERATIONS_FORMAT)
      .filter(move => !completeLearnset(name).includes(move))
      .map(move => ({ name, move })),
  );
  expect(additions.length).toBeGreaterThan(0);
  for (const { name, move } of additions) {
    const team = createTeam({ name, move1: move });
    const text = serializeTeam(team, 9, COMBINED_GENERATIONS_FORMAT);
    expect(
      parseTeamText(text, 9, COMBINED_GENERATIONS_FORMAT)[0]?.move1,
      `${name}: ${move}`,
    ).toBe(move);
    const backup = serializeTeams([
      createSavedTeam({ name: "Union", team, generationProfile: "6-9" }),
    ]);
    expect(parseTeamsText(backup)[0]?.team[0]?.move1, `${name}: ${move}`).toBe(
      move,
    );
  }
});

test("union recognition is scoped to the combined profile without narrowing legacy imports", async () => {
  await learnsetsReady;
  const text = "Vivillon-Fancy\n- Weather Ball";
  expect(
    canItLearn("weatherball", "vivillonfancy", 9, COMBINED_GENERATIONS_FORMAT),
  ).toBe(true);
  for (const format of ["", CHAMPIONS_FORMAT])
    expect(parseTeamText(text, 9, format)[0]?.move1).toBe("");
  expect(parseTeamText(text, 8)[0]?.move1).toBe("");
  expect(parseTeamText("Gengar\n- Rage", 8)[0]?.move1).toBe("rage");
});

for (const gen of ["6-9", "9", ""]) {
  test(`URL imports use the implied ${gen || "default combined"} ability pool`, ({
    store,
  }) => {
    withLocation(
      `https://mypokemonteam.com/${gen ? `?gen=${gen}` : ""}`,
      () => {
        importTeamFromUrlParameter(
          Buffer.from("Gengar\n- Shadow Ball").toString("base64url"),
        );
        expect(store.team[0]?.ability).toBe(gen === "9" ? "Cursed Body" : "");
        expect(store.currentTeam.generationProfile).toBe(
          gen === "9" ? undefined : "6-9",
        );
      },
    );
  });
}

test("a union link retains its new move instead of matching a differently saved set", ({
  store,
}) => {
  store.currentTeam.generationProfile = "6-9";
  store.team[0] = {
    ...store.team[0],
    ...createTeam({
      name: "vivillonfancy",
      ability: "Compound Eyes",
      move1: "weatherball",
    })[0],
  };
  const saved = store.currentTeam;
  withLocation("https://mypokemonteam.com/?gen=6-9", () => {
    importTeamFromUrlParameter(
      Buffer.from(
        "Vivillon-Fancy\nAbility: Compound Eyes\n- Dazzling Gleam",
      ).toString("base64url"),
    );
    expect(store.team[0]?.move1).toBe("dazzlinggleam");
    expect(saved.team[0]?.move1).toBe("weatherball");
    expect(store.currentTeamId).not.toBe(saved.id);
  });
});

for (const name of ["eeveestarter", "pikachustarter"]) {
  test(`${name}'s ability absence stays complete through sharing and imports`, ({
    store,
  }) => {
    store.currentTeam.generationProfile = "6-9";
    store.selectPokemon(0, name);
    const member = store.team[0];
    if (!member) throw new Error("Missing slot");
    const moves = generationLearnset(name, 9, COMBINED_GENERATIONS_FORMAT);
    Object.assign(member, {
      item: "leftovers",
      move1: moves[0],
      move2: moves[1],
      move3: moves[2],
      move4: moves[3],
    });
    expect(hasNoAbility(name, 9, COMBINED_GENERATIONS_FORMAT)).toBe(true);
    const restored = parseTeamText(
      serializeTeam(store.team, 9, COMBINED_GENERATIONS_FORMAT),
      9,
      COMBINED_GENERATIONS_FORMAT,
    )[0];
    if (!restored) throw new Error("Missing restored slot");
    expect(restored).toEqual(member);
    for (const ability of ["", "No Ability"]) {
      const absent = { ...restored, ability };
      expect(isSetComplete(absent, 9, COMBINED_GENERATIONS_FORMAT)).toBe(true);
      expect(
        randomizeSlotLabel(absent, undefined, 9, COMBINED_GENERATIONS_FORMAT),
      ).toBe("Randomize pokemon");
      expect(
        randomizeSlotLabel(
          { ...absent, item: "" },
          undefined,
          9,
          COMBINED_GENERATIONS_FORMAT,
        ),
      ).toBe("Randomize item");
    }
    withLocation("https://mypokemonteam.com/?gen=6-9", () => {
      importTeamFromUrlParameter(
        Buffer.from(
          serializeTeam(store.team, 9, COMBINED_GENERATIONS_FORMAT),
        ).toString("base64url"),
      );
      expect(store.team[0]?.ability).toBe("No Ability");
    });
  });
}

test("cleared real abilities stay cleared and remain unfinished in native and combined teams", async () => {
  await learnsetsReady;
  for (const format of ["", COMBINED_GENERATIONS_FORMAT]) {
    const text =
      "Gengar @ Leftovers\nAbility: No Ability\n- Shadow Ball\n- Sludge Bomb\n- Dark Pulse\n- Thunderbolt";
    const member = parseTeamText(text, 9, format)[0];
    if (!member) throw new Error("Missing slot");
    expect(member.ability).toBe("");
    expect(hasNoAbility("gengar", 9, format)).toBe(false);
    expect(isSetComplete(member, 9, format)).toBe(false);
    expect(randomizeSlotLabel(member, undefined, 9, format)).toBe(
      "Randomize ability",
    );
  }
  expect(hasNoAbility("unknown", 9, COMBINED_GENERATIONS_FORMAT)).toBe(false);
});

test("unheaded text uses the selected mode while explicit headers override it", async () => {
  await learnsetsReady;
  const defaults = {
    generation: 9 as const,
    generationProfile: "6-9" as const,
    format: "OU: Over Used",
  };
  const text = "Vivillon-Fancy\n- Weather Ball";
  const inferred = parseTeamsText(text, defaults)[0];
  expect(inferred).toMatchObject({
    generation: 9,
    generationProfile: "6-9",
    format: "OU: Over Used",
  });
  expect(inferred?.team[0]?.move1).toBe("weatherball");
  const explicit = parseTeamsText(
    `=== [gen9] Native ===\n\n${text}`,
    defaults,
  )[0];
  expect(explicit?.generationProfile).toBeUndefined();
  expect(explicit?.format).toBe("");
  expect(explicit?.team[0]?.move1).toBe("");
  expect(
    parseTeamsText("Clefable\n- Metronome", { generation: 1, format: "" })[0],
  ).toMatchObject({ generation: 1, format: "" });
  expect(parseTeamsText(text)[0]?.generationProfile).toBeUndefined();
});
