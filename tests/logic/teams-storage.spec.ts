import { test, expect } from "@playwright/test";
import {
  initialStoredState,
  loadStoredState,
  mergeStoredState,
  saveStoredState,
  sanitizeSavedTeam,
  type StoredState,
} from "@/store/teams-storage";
import { createSavedTeam } from "@/shared/team";
import { createTeam } from "./shared/team";
import { CHAMPIONS_FORMAT } from "@/shared/formats";

test("saved happiness survives a reload and is omitted for unsupported profiles", () => {
  const regular = createSavedTeam({
    generation: 3,
    team: createTeam({ name: "zangoose", happiness: 0 }),
  });
  const saved = sanitizeSavedTeam(JSON.parse(JSON.stringify(regular)));
  expect(saved?.team[0]?.happiness).toBe(0);
  expect(
    sanitizeSavedTeam({ ...regular, generation: 1 })?.team[0]?.happiness,
  ).toBeUndefined();
  expect(
    sanitizeSavedTeam({ ...regular, generation: 9, format: CHAMPIONS_FORMAT })
      ?.team[0]?.happiness,
  ).toBeUndefined();
  for (const happiness of [-1, 256, NaN, Infinity, "0"])
    expect(
      sanitizeSavedTeam({ ...regular, team: [{ name: "zangoose", happiness }] })
        ?.team[0]?.happiness,
    ).toBeUndefined();
});

test("fresh storage defaults to Champions while existing regular Gen 9 saves keep their profile", () => {
  const initial = initialStoredState();
  expect(initial.teams[0]).toMatchObject({
    generation: 9,
    format: CHAMPIONS_FORMAT,
  });
  const legacy = {
    ...initial,
    teams: [{ ...initial.teams[0], format: "" }],
  };
  expect(
    loadStoredState(fakeStorage(JSON.stringify(legacy)).storage)?.teams[0],
  ).toMatchObject({ generation: 9, format: "" });
});

const fakeStorage = (value: string | null) => {
  const items = new Map<string, string>();
  if (value !== null) items.set("mypokemonteam", value);
  return {
    items,
    storage: {
      getItem: (key: string) => items.get(key) ?? null,
      setItem: (key: string, value: string) => void items.set(key, value),
    } as unknown as Storage,
  };
};

test("move sorting defaults for old saves and survives new saves", () => {
  const state = initialStoredState();
  const { moveSort: _moveSort, ...oldState } = state;
  expect(
    loadStoredState(fakeStorage(JSON.stringify(oldState)).storage)?.moveSort,
  ).toEqual({ by: "name", descending: false });
  expect(
    loadStoredState(
      fakeStorage(
        JSON.stringify({
          ...state,
          moveSort: { by: "type", descending: true },
        }),
      ).storage,
    )?.moveSort,
  ).toEqual({ by: "type", descending: true });
  expect(
    loadStoredState(
      fakeStorage(
        JSON.stringify({
          ...state,
          moveSort: { by: "item", descending: true },
        }),
      ).storage,
    )?.moveSort,
  ).toEqual({ by: "name", descending: false });
});

test("tabs merge independent Pokemon and move sorting changes", () => {
  const base = initialStoredState();
  const mine = { ...base, sort: { by: "num" as const, descending: true } };
  const theirs = {
    ...base,
    moveSort: { by: "type" as const, descending: true },
  };
  const merged = mergeStoredState(base, mine, theirs);
  expect(merged.sort).toEqual(mine.sort);
  expect(merged.moveSort).toEqual(theirs.moveSort);
});

test("returns nothing without storage, valid JSON, or teams", () => {
  expect(loadStoredState(undefined)).toBeUndefined();
  expect(loadStoredState(fakeStorage("{").storage)).toBeUndefined();
  expect(loadStoredState(fakeStorage('{"teams":[]}').storage)).toBeUndefined();
  expect(loadStoredState(fakeStorage('{"teams":[5]}').storage)).toBeUndefined();
});

test("fills in defaults and drops malformed fields", () => {
  const { storage } = fakeStorage(
    JSON.stringify({
      teams: [
        {
          id: "a",
          name: 3,
          generation: 12,
          team: [
            { name: "milotic", level: "50", shiny: true, evs: { hp: 4 } },
            "junk",
          ],
        },
      ],
      currentTeamId: "missing",
      isMoreOpen: "yes",
      sort: { by: "num", descending: true },
    }),
  );
  const state = loadStoredState(storage);
  expect(state?.currentTeamId).toBe("a");
  expect(state?.isMoreOpen).toBe(false);
  expect(state?.sort).toEqual({ by: "num", descending: true });
  expect(state?.nameView).toBe("list");
  storage.setItem(
    "mypokemonteam",
    JSON.stringify({
      teams: [{ id: "a" }],
      sort: { by: "unknown", descending: true },
    }),
  );
  expect(loadStoredState(storage)?.sort).toEqual({
    by: "num",
    descending: false,
  });
  expect(state?.teams[0]).toMatchObject({
    id: "a",
    name: "",
    generation: 9,
    format: "",
  });
  expect(state?.teams[0].team).toHaveLength(6);
  expect(state?.teams[0].team[0]).toEqual({
    name: "milotic",
    item: "",
    ability: "",
    move1: "",
    move2: "",
    move3: "",
    move4: "",
    shiny: true,
    evs: { hp: 4 },
  });
  expect(state?.teams[0].team[1].name).toBe("");
  expect(sanitizeSavedTeam({ name: "no id" })).toBeUndefined();
});

test("loads all name views and defaults unknown views to List", () => {
  for (const view of ["list", "grid", "big-grid", "unknown"]) {
    const { storage } = fakeStorage(
      JSON.stringify({
        teams: [{ id: "a" }],
        nameView: view,
      }),
    );
    expect(loadStoredState(storage)?.nameView).toBe(
      view === "unknown" ? "list" : view,
    );
  }
});

test("saves the state and survives a storage that throws", () => {
  const { items, storage } = fakeStorage(null);
  const state = {
    teams: [],
    currentTeamId: "",
    isMoreOpen: true,
    sort: { by: "name" as const, descending: false },
    moveSort: { by: "name" as const, descending: false },
    nameView: "grid" as const,
  };
  saveStoredState(storage, state);
  expect(JSON.parse(items.get("mypokemonteam") ?? "")).toEqual(state);

  const throwing = {
    setItem: () => {
      throw new Error("QuotaExceededError");
    },
  } as unknown as Storage;
  expect(() => saveStoredState(throwing, state)).not.toThrow();
  expect(() => saveStoredState(undefined, state)).not.toThrow();
});

test.describe("another tab's saves", () => {
  const clone = (state: StoredState) => structuredClone(state);
  const savedTeam = (id: string, name: string) => ({
    ...createSavedTeam({ name }),
    id,
  });
  const base = (): StoredState => ({
    ...initialStoredState(),
    teams: [savedTeam("rain", "Rain"), savedTeam("sun", "Sun")],
    currentTeamId: "rain",
  });

  test("takes the other tab's new, changed, and deleted teams, and its language", () => {
    const mine = base();
    const theirs = clone(mine);
    theirs.teams = [
      { ...theirs.teams[0], team: createTeam({ name: "pelipper" }) },
      savedTeam("sand", "Sand"),
    ];
    theirs.currentTeamId = "sand";
    theirs.locale = "fr";

    const merged = mergeStoredState(clone(mine), mine, theirs);
    expect(merged.teams.map(({ name }) => name)).toEqual(["Rain", "Sand"]);
    expect(merged.teams[0].team[0].name).toBe("pelipper");
    expect(merged.currentTeamId).toBe("rain");
    expect(merged.locale).toBe("fr");
  });

  test("keeps what this tab changed, added, or deleted", () => {
    const saved = base();
    const mine = clone(saved);
    mine.teams = [
      { ...mine.teams[1], team: createTeam({ name: "torkoal" }) },
      savedTeam("hail", "Hail"),
    ];
    mine.sort = { by: "spe", descending: true };
    const theirs = clone(saved);
    theirs.teams[0].name = "Heavy rain";
    theirs.teams[1].name = "Harsh sun";

    const merged = mergeStoredState(saved, mine, theirs);
    expect(merged.teams.map(({ name }) => name)).toEqual(["Sun", "Hail"]);
    expect(merged.teams[0].team[0].name).toBe("torkoal");
    expect(merged.sort).toEqual({ by: "spe", descending: true });
  });

  test("keeps this tab's teams as they are when nothing differs but the order of their details", () => {
    const mine = base();
    mine.teams[0].team[0] = {
      ...createTeam({ name: "kingdra" })[0],
      nature: "modest",
      level: 50,
    };
    const theirs = loadStoredState(
      fakeStorage(JSON.stringify(mine)).storage,
    ) as StoredState;
    expect(Object.keys(theirs.teams[0].team[0])).not.toEqual(
      Object.keys(mine.teams[0].team[0]),
    );

    const merged = mergeStoredState(clone(mine), mine, theirs);
    expect(merged.teams[0]).toBe(mine.teams[0]);
    expect(merged.teams[1]).toBe(mine.teams[1]);
  });

  test("moves to the other tab's team when this tab's is gone", () => {
    const mine = base();
    const theirs = clone(mine);
    theirs.teams = [theirs.teams[1]];
    theirs.currentTeamId = "sun";
    expect(mergeStoredState(clone(mine), mine, theirs).currentTeamId).toBe(
      "sun",
    );
  });
});

test("remembers that the player knows slots drag, in any tab", () => {
  const load = (knowsSlotDrag: unknown) =>
    loadStoredState(
      fakeStorage(JSON.stringify({ teams: [{ id: "a" }], knowsSlotDrag }))
        .storage,
    )?.knowsSlotDrag;
  expect(load(true)).toBe(true);
  expect(load("yes")).toBeUndefined();

  const base = initialStoredState();
  const knows = { ...base, knowsSlotDrag: true };
  expect(mergeStoredState(base, base, knows).knowsSlotDrag).toBe(true);
  expect(mergeStoredState(base, knows, base).knowsSlotDrag).toBe(true);
  expect(mergeStoredState(base, base, base).knowsSlotDrag).toBeUndefined();
});

test("team filters load with defaults, survive saving, and merge across teams", () => {
  const base = initialStoredState();
  const first = base.teams[0]!;
  const second = createSavedTeam({ name: "Second" });
  base.teams.push(second);
  const mine = structuredClone(base);
  const theirs = structuredClone(base);
  mine.teams[0]!.filters = {
    type: "Grass",
    region: "Johto",
    ability: "Chlorophyll",
    moves: "Viable",
  };
  theirs.teams[1]!.filters.type = "Water";
  const merged = mergeStoredState(base, mine, theirs);
  const { storage } = fakeStorage(null);
  saveStoredState(storage, merged);
  const loaded = loadStoredState(storage)!;
  expect(loaded.teams[0]!.filters).toEqual(mine.teams[0]!.filters);
  expect(loaded.teams[1]!.filters.type).toBe("Water");
  const { filters: _filters, ...oldTeam } = first;
  expect(sanitizeSavedTeam(oldTeam)?.filters).toEqual({
    type: "",
    region: "",
    ability: "",
    moves: "",
  });
  expect(
    sanitizeSavedTeam({ ...first, filters: { type: "Fire", region: 5 } })
      ?.filters,
  ).toEqual({ type: "Fire", region: "", ability: "", moves: "" });
});
