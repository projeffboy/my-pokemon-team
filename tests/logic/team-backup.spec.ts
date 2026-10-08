import { test, expect } from "./fixtures";
import {
  MAX_TEAM_BACKUP_BYTES,
  mergeTeamBackup,
  parseTeamBackup,
  serializeTeamBackup,
  type TeamBackup,
  type TeamBackupCollection,
} from "@/store/team-backup";
import { Store } from "@/store";
import { createSavedTeam } from "@/shared/team";
import {
  initialStoredState,
  stableJson,
  STORAGE_KEY,
} from "@/store/teams-storage";
import type { SavedTeam } from "@/types";
import { createTeam } from "./shared/team";

function collection(): TeamBackupCollection {
  const complete: SavedTeam = {
    ...createSavedTeam({
      name: "Complete backup ☀",
      generation: 1,
      format: "Retired format",
      filters: {
        type: "Future type",
        region: "Unknown region",
        ability: "Retired Ability",
        moves: "Viable",
      },
      team: createTeam({
        name: "removedspecies",
        item: "removeditem",
        ability: "Retired Ability",
        move1: "removedmove",
        move2: "futuremove",
        nickname: "雪 @ (Copy)\n",
        level: -2.5,
        happiness: 300.5,
        gender: "N",
        shiny: false,
        teraType: "Future type",
        nature: "removednature",
        evs: { hp: -1, spa: 999.5 },
        ivs: { atk: 45 },
        statExperience: { spa: 12345, spd: 54321 },
        effortLevels: { def: 15 },
      }),
    }),
    id: "complete",
  };
  const empty = { ...createSavedTeam({ name: "" }), id: "empty" };
  const draftTeam = {
    ...createSavedTeam({
      name: "Linked draft",
      generation: 8,
      format: "Legends: Arceus",
      team: createTeam({}, { name: "kleavor", effortLevels: { atk: 9 } }),
    }),
    id: "draft",
  };
  return { teams: [complete, empty], currentTeamId: draftTeam.id, draftTeam };
}

const document = (): TeamBackup => ({
  format: "mypokemonteam",
  version: 1,
  ...collection(),
});

test("versioned JSON keeps every team field, set detail, empty slot, and linked draft", () => {
  const source = collection();
  const text = serializeTeamBackup(source);
  expect(parseTeamBackup(text)).toEqual({
    format: "mypokemonteam",
    version: 1,
    ...source,
  });
  expect(parseTeamBackup(`\uFEFF${text}`)).toEqual(parseTeamBackup(text));
  expect(text.endsWith("\n")).toBe(true);
});

test("invalid or unsupported JSON backups are rejected without keeping only their valid teams", () => {
  expect(parseTeamBackup("not JSON")).toBeUndefined();
  for (const replacement of [
    { format: "another-app" },
    { version: 2 },
    { version: "1" },
    { currentTeamId: "missing" },
    { teams: [] },
    { futureField: true },
  ]) {
    const backup = { ...document(), ...replacement, draftTeam: undefined };
    expect(parseTeamBackup(JSON.stringify(backup))).toBeUndefined();
  }
  const backup = document();
  expect(
    parseTeamBackup(
      JSON.stringify({ ...backup, teams: [...backup.teams, { id: "bad" }] }),
    ),
  ).toBeUndefined();
});

test("duplicate IDs and invalid selection references are rejected across saved teams and drafts", () => {
  const backup = document();
  const first = backup.teams[0]!;
  for (const invalid of [
    { ...backup, teams: [first, first] },
    { ...backup, draftTeam: first },
    { ...backup, currentTeamId: "" },
  ])
    expect(parseTeamBackup(JSON.stringify(invalid))).toBeUndefined();
});

test("team records, filters, and all six slots require their complete structure", () => {
  for (const change of [
    { id: "" },
    { name: null },
    { generation: "9" },
    { generation: 10 },
    { format: null },
    { filters: { type: "" } },
    { filters: { type: "", region: "", ability: "", moves: "", extra: "" } },
    { team: [] },
    { team: createTeam().slice(0, 5) },
    { team: [...createTeam(), createTeam()[0]] },
    { futureField: "never discard this" },
  ]) {
    const backup = document();
    expect(
      parseTeamBackup(
        JSON.stringify({
          ...backup,
          teams: [{ ...backup.teams[0], ...change }],
        }),
      ),
    ).toBeUndefined();
  }
});

test("slot field types and stat maps reject malformed values while finite illegal values survive", () => {
  for (const change of [
    { name: 5 },
    { move1: null },
    { gender: "X" },
    { shiny: "yes" },
    { nickname: null },
    { level: "50" },
    { happiness: null },
    { evs: [252] },
    { ivs: { extra: 31 } },
    { effortLevels: { hp: "10" } },
    { statExperience: { spa: null } },
    { futureDetail: "never discard this" },
  ]) {
    const backup = document();
    const first = backup.teams[0]!;
    const invalid = {
      ...first,
      team: [{ ...first.team[0], ...change }, ...first.team.slice(1)],
    };
    expect(
      parseTeamBackup(JSON.stringify({ ...backup, teams: [invalid] })),
    ).toBeUndefined();
  }
  const backup = document();
  Reflect.deleteProperty(backup.teams[0]!.team[0]!, "move1");
  expect(parseTeamBackup(JSON.stringify(backup))).toBeUndefined();
});

test("nonfinite numbers cannot be silently exported as null", () => {
  for (const value of [NaN, Infinity, -Infinity]) {
    const source = collection();
    source.teams[0]!.team[0]!.happiness = value;
    expect(() => serializeTeamBackup(source)).toThrow("Invalid team backup");
  }
});

test("sparse slot arrays cannot produce backups that fail their own import validation", () => {
  const source = collection();
  Reflect.deleteProperty(source.teams[0]!.team, "0");
  expect(() => serializeTeamBackup(source)).toThrow("Invalid team backup");
});

test("size limits use UTF-8 bytes and reject oversized imports and exports", () => {
  const source = collection();
  source.teams[0]!.name = "é".repeat(MAX_TEAM_BACKUP_BYTES / 2);
  const text = JSON.stringify({
    format: "mypokemonteam",
    version: 1,
    ...source,
  });
  expect(text.length).toBeLessThan(MAX_TEAM_BACKUP_BYTES);
  expect(new TextEncoder().encode(text).byteLength).toBeGreaterThan(
    MAX_TEAM_BACKUP_BYTES,
  );
  expect(parseTeamBackup(text)).toBeUndefined();
  expect(() => serializeTeamBackup(source)).toThrow("Team backup is too large");
  expect(
    parseTeamBackup(" ".repeat(MAX_TEAM_BACKUP_BYTES + 1)),
  ).toBeUndefined();
});

test("additive merges remap colliding IDs and leave source and existing records untouched", () => {
  const backup = document();
  const existing = { ...createSavedTeam({ name: "Keep me" }), id: "complete" };
  const before = stableJson({ backup, existing });
  const { added, skipped } = mergeTeamBackup([existing], backup);
  expect(skipped).toBe(0);
  expect(added).toHaveLength(3);
  expect(new Set([existing.id, ...added.map(team => team.id)]).size).toBe(4);
  expect(added[0]).toEqual({ ...backup.teams[0], id: added[0]!.id });
  expect(added[2]).toEqual({ ...backup.draftTeam, id: added[2]!.id });
  expect(stableJson({ backup, existing })).toBe(before);
  added[0]!.team[0]!.evs!.hp = 42;
  expect(backup.teams[0]!.team[0]!.evs!.hp).toBe(-1);
});

test("deduplication preserves intentional identical-team multiplicity and makes repeat restore idempotent", () => {
  const original = createSavedTeam({
    name: "Two identical saved copies",
    team: createTeam({ name: "relicanth" }),
  });
  const first = { ...original, id: "first" };
  const second = { ...original, id: "second" };
  const backup: TeamBackup = {
    format: "mypokemonteam",
    version: 1,
    teams: [first, second],
    currentTeamId: first.id,
  };
  const imported = mergeTeamBackup([original], backup);
  expect(imported.added).toHaveLength(1);
  expect(imported.skipped).toBe(1);
  const repeated = mergeTeamBackup([original, ...imported.added], backup);
  expect(repeated.added).toEqual([]);
  expect(repeated.skipped).toBe(2);
});

test("names, filters, profiles, and set values all distinguish otherwise similar teams", () => {
  const original = createSavedTeam({
    name: "Original",
    team: createTeam({ name: "druddigon" }),
  });
  for (const changed of [
    { ...original, name: "Another name" },
    { ...original, generation: 8 as const },
    { ...original, format: "OU: Over Used" },
    { ...original, filters: { ...original.filters, type: "Dragon" } },
    { ...original, team: createTeam({ name: "druddigon", shiny: false }) },
  ]) {
    const backup: TeamBackup = {
      format: "mypokemonteam",
      version: 1,
      teams: [changed],
      currentTeamId: changed.id,
    };
    expect(mergeTeamBackup([original], backup).added).toHaveLength(1);
  }
});

test("restore keeps the current team, draft, history, and existing records while adding all backup teams", ({
  store,
}) => {
  store.selectPokemon(0, "crustle");
  store.openUnsavedTeam(createTeam({ name: "archeops", move1: "acrobatics" }));
  const current = store.currentTeam;
  const saved = stableJson(store.teams);
  const currentSnapshot = stableJson(current);
  const backupText = serializeTeamBackup(collection());
  expect(store.restoreTeamBackup(backupText)).toEqual({ added: 3, skipped: 0 });
  expect(store.currentTeamId).toBe(current.id);
  expect(store.currentTeam).toBe(current);
  expect(stableJson(store.currentTeam)).toBe(currentSnapshot);
  expect(stableJson(store.teams.slice(0, 1))).toBe(saved);
  expect(store.canUndo).toBe(false);
  expect(store.teams).toHaveLength(4);
  expect(store.restoreTeamBackup(backupText)).toEqual({ added: 0, skipped: 3 });
  expect(store.currentTeam).toBe(current);
  store.team[0]!.move2 = "rockslide";
  expect(store.teams).toHaveLength(5);
  store.undo();
  expect(store.team[0]!.move2).toBe("");
});

test("export includes saved empty teams and the unsaved draft without promoting it", ({
  store,
}) => {
  store.openUnsavedTeam(createTeam({}, { name: "beheeyem", move1: "psychic" }));
  const current = store.currentTeam;
  const text = store.exportTeamBackup();
  const backup = parseTeamBackup(text);
  expect(backup?.teams).toHaveLength(1);
  expect(backup?.teams[0]?.team).toEqual(createTeam());
  expect(backup?.currentTeamId).toBe(current.id);
  expect(backup?.draftTeam).toEqual(current);
  expect(store.teams).toHaveLength(1);
  expect(store.restoreTeamBackup(text)).toEqual({ added: 0, skipped: 2 });
  expect(store.currentTeam).toBe(current);
  expect(store.teams).toHaveLength(1);
});

test("a malformed restore never partially adds teams or changes current editing state", ({
  store,
}) => {
  store.selectPokemon(0, "gogoat");
  const before = store.exportTeamBackup();
  const backup = document();
  const invalid = JSON.stringify({
    ...backup,
    teams: [...backup.teams, { id: "bad" }],
  });
  expect(store.restoreTeamBackup(invalid)).toBeUndefined();
  expect(store.exportTeamBackup()).toBe(before);
});

test("restored complete records survive local saving, another setting change, and reload", async () => {
  const items = new Map<string, string>();
  const storage = {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => {
      items.set(key, value);
    },
  } as unknown as Storage;
  const store = new Store(storage);
  const source = collection();
  const before = store.currentTeamId;
  expect(store.restoreTeamBackup(serializeTeamBackup(source))?.added).toBe(3);
  await new Promise(resolve => setTimeout(resolve, 500));
  expect(items.has(STORAGE_KEY)).toBe(true);
  store.nameView = "grid";
  await new Promise(resolve => setTimeout(resolve, 500));
  expect(store.currentTeamId).toBe(before);
  const restored = store.teams.find(
    team => team.name === source.teams[0]!.name,
  )!;
  expect(restored).toEqual({ ...source.teams[0], id: restored.id });
  const reloaded = new Store(storage);
  expect(reloaded.findTeam(restored.id)).toEqual(restored);
  expect(reloaded.restoreTeamBackup(serializeTeamBackup(source))).toEqual({
    added: 0,
    skipped: 3,
  });
});

test("a failed restore save keeps complete noncurrent teams available for backup and later recovery", async () => {
  let saved = JSON.stringify(initialStoredState());
  let canSave = false;
  const storage = {
    getItem: () => saved,
    setItem: (_key: string, value: string) => {
      if (!canSave) throw new Error("QuotaExceededError");
      saved = value;
    },
  } as unknown as Storage;
  const store = new Store(storage);
  store.selectTeam(store.teams[0]!.id);
  const currentId = store.currentTeamId;
  const source = collection();
  const imported = [...source.teams, source.draftTeam!];
  store.restoreTeamBackup(serializeTeamBackup(source));
  await new Promise(resolve => setTimeout(resolve, 500));
  expect(store.saveFailed).toBe(true);
  expect(store.currentTeamId).toBe(currentId);
  expect(JSON.parse(saved).teams).toHaveLength(1);
  const rescued = parseTeamBackup(store.exportTeamBackup());
  expect(store.saveFailed).toBe(true);
  expect(rescued?.teams).toHaveLength(4);
  for (const team of imported) {
    const restored = rescued?.teams.find(
      candidate => candidate.name === team.name,
    );
    expect(restored).toEqual({ ...team, id: expect.any(String) });
  }
  canSave = true;
  store.nameView = "grid";
  await new Promise(resolve => setTimeout(resolve, 500));
  expect(store.saveFailed).toBe(false);
  const reloaded = new Store(storage);
  expect(reloaded.teams).toEqual(rescued?.teams);
  expect(reloaded.saveFailed).toBe(false);
});

for (const operation of ["export", "restore"] as const) {
  test(`${operation} reads other tabs' latest saved teams while preserving pending local edits and history`, () => {
    const local = createSavedTeam({
      name: "Local",
      generation: 7,
      team: createTeam({ name: "komala" }),
    });
    const remote = createSavedTeam({
      name: "Remote",
      team: createTeam({ name: "oricorio" }),
    });
    const saved = {
      ...initialStoredState(),
      teams: [local, remote],
      currentTeamId: local.id,
    };
    let text = JSON.stringify(saved);
    const storage = {
      getItem: () => text,
      setItem: (_key: string, value: string) => {
        text = value;
      },
    } as unknown as Storage;
    const store = new Store(storage);
    store.selectTeam(local.id);
    store.team[0]!.move1 = "return";
    const arrival = createSavedTeam({
      name: "Other tab arrival",
      team: createTeam({ name: "minccino" }),
    });
    const theirs = structuredClone(saved);
    theirs.teams[1]!.name = "Changed elsewhere";
    theirs.teams.push(arrival);
    text = JSON.stringify(theirs);
    if (operation === "export") {
      const backup = parseTeamBackup(store.exportTeamBackup());
      expect(backup?.teams.map(team => team.name)).toEqual([
        "Local",
        "Changed elsewhere",
        "Other tab arrival",
      ]);
      expect(backup?.teams[0]?.team[0]?.move1).toBe("return");
    } else {
      expect(
        store.restoreTeamBackup(
          serializeTeamBackup({
            teams: [arrival],
            currentTeamId: arrival.id,
          }),
        ),
      ).toEqual({ added: 0, skipped: 1 });
    }
    expect(store.currentTeamId).toBe(local.id);
    expect(store.team[0]!.move1).toBe("return");
    expect(store.teams).toHaveLength(3);
    expect(store.findTeam(remote.id)?.name).toBe("Changed elsewhere");
    store.undo();
    expect(store.team[0]!.move1).toBe("");
    expect(store.team[0]!.name).toBe("komala");
  });
}
