import { test, expect } from "@playwright/test";
import { universalTransferChanges } from "@/store/generation-transfer/universal-changes";
import { CHAMPIONS_FORMAT } from "@/shared/formats";

test("Champions rules cover every carrying Pokemon regardless of its level or custom IVs", () => {
  const changes = universalTransferChanges(
    { generation: 3, format: "" },
    { generation: 9, format: CHAMPIONS_FORMAT },
  );
  expect(changes.fixedLevel).toBe(50);
  expect(changes.removed).toEqual(["ivs"]);
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
  );
  expect(same.removed).toEqual([]);
  expect(same.fixedLevel).toBeUndefined();
  expect(same.ivsConversion).toBeUndefined();
  expect(same.training).toBeUndefined();
  const older = universalTransferChanges(
    { generation: 2, format: "" },
    { generation: 1, format: "" },
  );
  expect(older.removed).toEqual(["item", "gender", "shiny"]);
  expect(older.ivsConversion).toBeUndefined();
  expect(older.training).toBeUndefined();
});
