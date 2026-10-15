import { test, expect } from "./fixtures";
import { test as plainTest } from "@playwright/test";
import { createTeam } from "./shared/team";
import { Store } from "@/store";
import { createSavedTeam } from "@/shared/team";
import { removeMissingEntries } from "@/store/dropped-entries";
import {
  LEGACY_LINK_PARSING_OPTIONS,
  parseTeamText,
  parseTeamTextReport,
  serializeTeam,
} from "@/store/team-text";
import { initialStoredState, type StoredState } from "@/store/teams-storage";
import { importTeamFromUrlParameter } from "@/app/shared/team-link";
import { toBase64Url } from "@/app/shared/base64url";

const settle = () => new Promise(resolve => setTimeout(resolve, 500));

test.describe("what team text leaves out", () => {
  test("names each unrecognized pokemon, item, ability, and move with its slot", () => {
    const text = `Imaginarymon @ Leftovers
- Tackle

Toucannon @ Imaginary Orb
Ability: Imaginary Beak
- Beak Blast
- Iron Hed
- Spore
-

Cetitan
- Hidden Power [Fire]`;
    const { team, dropped } = parseTeamTextReport(text);
    expect(team).toEqual(parseTeamText(text));
    expect(team[1]).toEqual({
      name: "toucannon",
      item: "",
      ability: "",
      move1: "beakblast",
      move2: "",
      move3: "",
      move4: "",
    });
    expect(dropped).toEqual([
      { teamIndex: 0, pokemon: "", field: "pokemon", value: "Imaginarymon" },
      {
        teamIndex: 1,
        pokemon: "toucannon",
        field: "item",
        value: "Imaginary Orb",
      },
      {
        teamIndex: 1,
        pokemon: "toucannon",
        field: "ability",
        value: "Imaginary Beak",
      },
      { teamIndex: 1, pokemon: "toucannon", field: "move2", value: "Iron Hed" },
      { teamIndex: 1, pokemon: "toucannon", field: "move3", value: "Spore" },
      {
        teamIndex: 2,
        pokemon: "cetitan",
        field: "move1",
        value: "Hidden Power [Fire]",
      },
    ]);
  });

  test("names nothing for empty moves and items, blank abilities, or the site's own text", () => {
    const own = createTeam(
      {
        name: "espathra",
        item: "choicescarf",
        ability: "Speed Boost",
        move1: "luminacrash",
      },
      { name: "lokix", move1: "firstimpression" },
    );
    for (const [text, generation] of [
      ["Lokix @ \nAbility: \n- First Impression\n-\n-\n-\n\n", 9],
      ["Espathra\nAbility: No Ability\n- Lumina Crash", 9],
      [serializeTeam(own), 9],
      [serializeTeam(own, 2), 2],
    ] as const)
      expect(
        parseTeamTextReport(text, generation, "", LEGACY_LINK_PARSING_OPTIONS)
          .dropped,
        text,
      ).toEqual([]);
  });
});

test.describe("what a saved team lost to a data update", () => {
  const outdated = () =>
    createTeam(
      { name: "arboliva", item: "leftovers", move1: "gigadrain" },
      { name: "imaginarymon", item: "leftovers", move1: "tackle" },
      {
        name: "cameruptmega",
        item: "imaginarycameruptite",
        ability: "Imaginary Magma",
        move1: "eruption",
        move2: "imaginaryflare",
      },
    );

  test("leaves out the entries the data lacks, auto-selecting the item and ability again", () => {
    const team = outdated();
    const before = structuredClone(team);
    const result = removeMissingEntries(team, 9);
    expect(team).toEqual(before);
    expect(result.team).toEqual(
      createTeam(
        { name: "arboliva", item: "leftovers", move1: "gigadrain" },
        {},
        {
          name: "cameruptmega",
          item: "cameruptite",
          ability: "Sheer Force",
          move1: "eruption",
        },
      ),
    );
    expect(result.dropped).toEqual([
      { teamIndex: 1, pokemon: "", field: "pokemon", value: "imaginarymon" },
      {
        teamIndex: 2,
        pokemon: "cameruptmega",
        field: "item",
        value: "imaginarycameruptite",
      },
      {
        teamIndex: 2,
        pokemon: "cameruptmega",
        field: "ability",
        value: "Imaginary Magma",
      },
      {
        teamIndex: 2,
        pokemon: "cameruptmega",
        field: "move2",
        value: "imaginaryflare",
      },
    ]);
    expect(removeMissingEntries(result.team, 9).dropped).toEqual([]);
  });

  test("opening the team removes them once, names them, and starts its history afresh", ({
    store,
  }) => {
    const first = store.currentTeamId;
    const saved = createSavedTeam({ name: "Old", team: outdated() });
    store.teams.push(saved);
    const text = serializeTeam(saved.team);
    expect(text).toContain("Camerupt-Mega @ imaginarycameruptite");
    expect(text).toContain("- imaginaryflare");

    store.selectTeam(saved.id);
    expect(store.team[1]?.name).toBe("");
    expect(store.team[2]).toMatchObject({ item: "cameruptite", move2: "" });
    expect(store.canUndo).toBe(false);
    expect(store.currentDroppedEntries).toMatchObject({
      teamId: saved.id,
      source: "savedTeam",
      text,
    });
    expect(store.currentDroppedEntries?.entries).toHaveLength(4);

    // The notice stays with its team until it is dismissed
    store.selectTeam(first);
    expect(store.currentDroppedEntries).toBeNull();
    store.selectTeam(saved.id);
    expect(store.currentDroppedEntries?.entries).toHaveLength(4);
    store.droppedEntries = null;
    store.selectTeam(first);
    store.selectTeam(saved.id);
    expect(store.currentDroppedEntries).toBeNull();
  });

  plainTest(
    "the saved state keeps none of them, so the notice shows once",
    async () => {
      const saved = createSavedTeam({ name: "Old", team: outdated() });
      let state = JSON.stringify({
        ...initialStoredState(),
        teams: [saved],
        currentTeamId: saved.id,
      } satisfies StoredState);
      const storage = {
        getItem: () => state,
        setItem: (_key: string, value: string) => {
          state = value;
        },
      } as unknown as Storage;

      const store = new Store(storage);
      store.selectTeam(saved.id);
      expect(store.currentDroppedEntries?.entries).toHaveLength(4);
      await settle();
      const stored = (JSON.parse(state) as StoredState).teams[0]?.team;
      expect(stored?.[1]?.name).toBe("");
      expect(stored?.[2]?.move2).toBe("");

      const reloaded = new Store(storage);
      reloaded.selectTeam(saved.id);
      expect(reloaded.currentDroppedEntries).toBeNull();
      expect(reloaded.team[2]?.item).toBe("cameruptite");
    },
  );
});

test.describe("what a share link lost", () => {
  test("is named above the team it opens until another link opens", ({
    store,
  }) => {
    const text =
      "Houndstone @ Imaginary Collar\nAbility: Fluffy\n- Shadow Ball\n- Imaginary Howl";
    importTeamFromUrlParameter(toBase64Url(text));
    expect(store.team[0]).toMatchObject({
      name: "houndstone",
      item: "",
      ability: "Fluffy",
      move1: "shadowball",
      move2: "",
    });
    expect(store.currentDroppedEntries).toEqual({
      teamId: store.currentTeamId,
      source: "link",
      text,
      entries: [
        {
          teamIndex: 0,
          pokemon: "houndstone",
          field: "item",
          value: "Imaginary Collar",
        },
        {
          teamIndex: 0,
          pokemon: "houndstone",
          field: "move2",
          value: "Imaginary Howl",
        },
      ],
    });

    importTeamFromUrlParameter(toBase64Url("Houndstone\n- Shadow Ball"));
    expect(store.droppedEntries).toBeNull();
  });

  test("with no pokemon left is named above the visitor's own team", ({
    store,
  }) => {
    const id = store.currentTeamId;
    importTeamFromUrlParameter(toBase64Url("Imaginarymon @ Leftovers"));
    expect(store.currentTeamId).toBe(id);
    expect(store.currentDroppedEntries?.entries).toEqual([
      { teamIndex: 0, pokemon: "", field: "pokemon", value: "Imaginarymon" },
    ]);
  });
});
