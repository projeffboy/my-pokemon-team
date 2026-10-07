import { test, expect } from "@playwright/test";
import { universalTransferChanges } from "@/store/generation-transfer/universal-changes";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import { createTeam } from "./shared/team";

const configured = createTeam({
  name: "slowking",
  item: "leftovers",
  ability: "owntempo",
  nature: "Bold",
  gender: "M",
  shiny: true,
  happiness: 0,
  ivs: { atk: 0 },
  evs: { hp: 4 },
});

test("Champions rules summarize configured fields on carrying Pokemon", () => {
  const changes = universalTransferChanges(
    { generation: 3, format: "" },
    { generation: 9, format: CHAMPIONS_FORMAT },
    configured,
  );
  expect(changes.fixedLevel).toBe(50);
  expect(changes.removed).toEqual(["happiness", "ivs"]);
  expect(changes.training).toEqual({ from: "evs", to: "sps" });
  for (const value of ["100", "56"])
    expect(
      changes.isUniversal({
        index: 0,
        pokemon: "gardevoir",
        field: "level",
        value,
        replacement: "50",
      }),
    ).toBe(true);
  expect(
    changes.isUniversal({
      index: 0,
      pokemon: "gardevoir",
      field: "move",
      value: "hiddenpowerdragon",
    }),
  ).toBe(false);
  expect(
    changes.isUniversal({
      index: 0,
      pokemon: "gardevoir",
      field: "item",
      value: "Choice Band",
    }),
  ).toBe(false);
});

test("older games remove whole unsupported systems even when ability names differ", () => {
  const changes = universalTransferChanges(
    { generation: 3, format: "" },
    { generation: 2, format: "" },
    configured,
  );
  expect(changes.removed).toEqual(["ability", "nature"]);
  expect(changes.ivsConversion).toBe("dvs");
  for (const value of ["Own Tempo", "Guts"])
    expect(
      changes.isUniversal({
        index: 0,
        pokemon: "slowking",
        field: "ability",
        value,
      }),
    ).toBe(true);
  expect(
    changes.isUniversal({
      index: 0,
      pokemon: "slowking",
      field: "item",
      value: "Choice Band",
    }),
  ).toBe(false);
});

test("universal messages describe system changes rather than rules already shared by both games", () => {
  const same = universalTransferChanges(
    { generation: 3, format: "" },
    { generation: 4, format: "" },
    configured,
  );
  expect(same.removed).toEqual([]);
  expect(same.fixedLevel).toBeUndefined();
  expect(same.ivsConversion).toBeUndefined();
  expect(same.training).toBeUndefined();
  const older = universalTransferChanges(
    { generation: 2, format: "" },
    { generation: 1, format: "" },
    configured,
  );
  expect(older.removed).toEqual(["item", "gender", "shiny", "happiness"]);
  expect(older.ivsConversion).toBeUndefined();
  expect(older.training).toBeUndefined();
});

test("omits unset fields and default IVs or zero training values", () => {
  for (const team of [
    createTeam({ name: "golduck" }),
    createTeam({ name: "golduck", ivs: { atk: 31 }, evs: { hp: 0 } }),
  ]) {
    const changes = universalTransferChanges(
      { generation: 3, format: "" },
      { generation: 1, format: "" },
      team,
    );
    expect(changes.removed).toEqual([]);
    expect(changes.ivsConversion).toBeUndefined();
    expect(changes.training).toBeUndefined();
    expect(
      changes.isUniversal({ index: 0, pokemon: "golduck", field: "ivs" }),
    ).toBe(true);
  }
});

test("only lists configured fields on named team slots", () => {
  const team = createTeam({
    name: "golduck",
    ability: "damp",
    ivs: { atk: 0 },
  });
  team[1].nature = "Bold";
  const changes = universalTransferChanges(
    { generation: 3, format: "" },
    { generation: 1, format: "" },
    team,
  );
  expect(changes.removed).toEqual(["ability"]);
  expect(changes.ivsConversion).toBe("dvs");
  expect(changes.training).toBeUndefined();
});
