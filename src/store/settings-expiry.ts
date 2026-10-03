import { STORAGE_KEY } from "./teams-storage";

// When the player last opened the site, as milliseconds since 1970
export const LAST_VISIT_KEY = "mypokemonteam-last-visit";

// The drag hint comes back to a player who has been away three months
export const SLOT_DRAG_LIFETIME = 91 * 24 * 60 * 60 * 1000;

// Forgets the settings that have outlived the time since the last visit, and
// records this one. Saved teams never expire.
export function expireSettings(storage: Storage | undefined, now: number) {
  try {
    const lastVisit = Number(storage?.getItem(LAST_VISIT_KEY));
    if (lastVisit > 0 && now - lastVisit > SLOT_DRAG_LIFETIME) {
      const raw: unknown = JSON.parse(storage?.getItem(STORAGE_KEY) ?? "null");
      if (typeof raw === "object" && raw !== null && "knowsSlotDrag" in raw) {
        delete raw.knowsSlotDrag;
        storage?.setItem(STORAGE_KEY, JSON.stringify(raw));
      }
    }
    storage?.setItem(LAST_VISIT_KEY, String(now));
  } catch {
    // Unreadable or full storage keeps the settings as they are
  }
}
