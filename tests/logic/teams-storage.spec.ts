import { test, expect } from "@playwright/test";
import {
  loadStoredState,
  saveStoredState,
  sanitizeSavedTeam,
} from "@/store/teams-storage";

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

test("saves the state and survives a storage that throws", () => {
  const { items, storage } = fakeStorage(null);
  const state = {
    teams: [],
    currentTeamId: "",
    isMoreOpen: true,
    sort: { by: "name" as const, descending: false },
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
