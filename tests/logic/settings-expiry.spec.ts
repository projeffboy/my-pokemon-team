import { test, expect } from "@playwright/test";
import {
  expireSettings,
  LAST_VISIT_KEY,
  SLOT_DRAG_LIFETIME,
} from "@/store/settings-expiry";

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 8, 29);

const storageWith = (lastVisit: number | undefined) => {
  const items = new Map<string, string>([
    ["mypokemonteam", JSON.stringify({ teams: [], knowsSlotDrag: true })],
  ]);
  if (lastVisit !== undefined) items.set(LAST_VISIT_KEY, String(lastVisit));
  const storage = {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => void items.set(key, value),
  } as unknown as Storage;
  const knows = () =>
    (JSON.parse(items.get("mypokemonteam") ?? "{}") as Record<string, unknown>)
      .knowsSlotDrag;
  return { items, storage, knows };
};

test("forgets the drag hint after three months away, and records the visit", () => {
  const away = storageWith(NOW - SLOT_DRAG_LIFETIME - DAY);
  expireSettings(away.storage, NOW);
  expect(away.knows()).toBeUndefined();
  expect(away.items.get(LAST_VISIT_KEY)).toBe(String(NOW));

  const back = storageWith(NOW - SLOT_DRAG_LIFETIME + DAY);
  expireSettings(back.storage, NOW);
  expect(back.knows()).toBe(true);
});

test("keeps the drag hint on the first recorded visit", () => {
  const first = storageWith(undefined);
  expireSettings(first.storage, NOW);
  expect(first.knows()).toBe(true);
  expect(first.items.get(LAST_VISIT_KEY)).toBe(String(NOW));
});

test("survives missing or broken storage", () => {
  expect(() => expireSettings(undefined, NOW)).not.toThrow();
  const broken = {
    getItem: () => {
      throw new Error("blocked");
    },
  } as unknown as Storage;
  expect(() => expireSettings(broken, NOW)).not.toThrow();
});
