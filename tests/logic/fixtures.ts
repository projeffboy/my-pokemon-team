import { test as base } from "@playwright/test";
import store from "@/store";
import { createTeam } from "./shared/team";

const emptyFilters = { ...store.searchFilters };

function resetStore() {
  store.team = createTeam();
  store.searchFilters = { ...emptyFilters };
}

export const test = base.extend<{ store: typeof store }>({
  store: async ({}, use) => {
    resetStore();
    try {
      await use(store);
    } finally {
      resetStore();
    }
  },
});

export { expect } from "@playwright/test";
