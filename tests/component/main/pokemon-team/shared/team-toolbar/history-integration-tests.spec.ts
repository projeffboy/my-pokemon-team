import type { Page } from "@playwright/test";
import { test, expect } from "fixtures";
import {
  clickMenuItem,
  isMdDown,
  openManageTeamMenu,
  openTeamTools,
  selectMove,
  selectPokemon,
} from "helper";

type Action = "Undo" | "Redo";

const toolbarButton = (page: Page, action: Action) =>
  page
    .getByRole("toolbar", { name: "Team actions" })
    .getByRole("button", { name: action, exact: true });

// Undo and redo are toolbar buttons on desktops, and Manage Team menu items below that
const act = async (page: Page, action: Action) => {
  if (isMdDown(page)) {
    await openManageTeamMenu(page);
    await clickMenuItem(page, action);
  } else await toolbarButton(page, action).click();
};

const expectEnabled = async (page: Page, action: Action, enabled: boolean) => {
  if (!isMdDown(page)) {
    await expect(toolbarButton(page, action)).toBeEnabled({ enabled });
    return;
  }
  await openManageTeamMenu(page);
  await expect(
    page.getByRole("menuitem", { name: action, exact: true }),
  ).toBeEnabled({ enabled });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toBeHidden();
};

test.describe("History - Integration Tests", () => {
  test("undoes and redoes the team's edits", async ({ page }) => {
    const name = page.getByLabel("Pokemon 1's name");
    await expectEnabled(page, "Undo", false);
    await expectEnabled(page, "Redo", false);

    // Edits within 400ms of each other are one step, so each edit gets its own step here
    await selectPokemon(page, "Slowking");
    await expectEnabled(page, "Undo", true);
    await expectEnabled(page, "Redo", false);
    await page.waitForTimeout(500);
    await selectMove(page, "Scald");
    await expect(page.getByLabel("Pokemon 1's move1")).toHaveValue("Scald");
    await page.waitForTimeout(500);

    await act(page, "Undo");
    await expect(page.getByLabel("Pokemon 1's move1")).toHaveValue("");
    await expect(name).toHaveValue("Slowking");
    await act(page, "Undo");
    await expect(name).toHaveValue("");
    await expectEnabled(page, "Undo", false);
    await expectEnabled(page, "Redo", true);

    await act(page, "Redo");
    await expect(name).toHaveValue("Slowking");
    await act(page, "Redo");
    await expect(page.getByLabel("Pokemon 1's move1")).toHaveValue("Scald");
    await expectEnabled(page, "Redo", false);
  });

  test("the snackbar undoes a randomized team", async ({ page }) => {
    const name = page.getByLabel("Pokemon 1's name");
    const move = page.getByLabel("Pokemon 1's move1");
    await selectPokemon(page, "Ludicolo");
    await page.waitForTimeout(500);

    await openTeamTools(page);
    await page.getByRole("button", { name: "Randomize Team" }).click();
    // A random pokemon comes with moves
    await expect(move).not.toHaveValue("");
    await page.getByRole("alert").getByRole("button", { name: "Undo" }).click();

    await expect(name).toHaveValue("Ludicolo");
    await expect(move).toHaveValue("");
    await expect(page.getByRole("alert")).toHaveText("Undid the last change");
  });
});
