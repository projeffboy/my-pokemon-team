import { test as base } from "@playwright/test";
import store from "@/store";
import { learnsetsReady } from "@/store/learnsets";
import { DEFAULT_SORT } from "@/store/sorting";
import { createSavedTeam } from "@/shared/team";

const emptyFilters = { ...store.filters };

function resetStore() {
  const team = createSavedTeam({ name: "Team 1" });
  store.teams = [team];
  store.currentTeamId = team.id;
  store.filters = { ...emptyFilters };
  store.sort = { ...DEFAULT_SORT };
}

export const test = base.extend<{ store: typeof store }>({
  store: async ({}, use) => {
    await learnsetsReady;
    resetStore();
    try {
      await use(store);
    } finally {
      resetStore();
    }
  },
});

export { expect } from "@playwright/test";
