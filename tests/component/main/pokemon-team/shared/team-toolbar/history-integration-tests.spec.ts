import type { Page } from "@playwright/test";
import { test, expect } from "fixtures";
import { openTeamTools, selectMove, selectPokemon } from "helper";

type Action = "Undo" | "Redo";

const toolbarButton = (page: Page, action: Action) =>
  page
    .getByRole("toolbar", { name: "Team actions" })
    .getByRole("button", { name: action, exact: true });

const act = async (page: Page, action: Action) => {
  await toolbarButton(page, action).click();
};

const expectEnabled = async (page: Page, action: Action, enabled: boolean) => {
  await expect(toolbarButton(page, action)).toBeEnabled({ enabled });
};

test.describe("History - Integration Tests", () => {
  test("quick Undo and Redo stack independently and keep only the newest three", async ({
    page,
  }) => {
    await selectPokemon(page, "Slowking");
    await page.waitForTimeout(500);
    await selectMove(page, "Scald");
    await page.waitForTimeout(500);
    const alerts = page.getByRole("alert");
    const removed = "Undo add Scald to Slowking";
    const added = "Redo add Scald to Slowking";
    await act(page, "Undo");
    await act(page, "Redo");
    await expect(alerts).toHaveText([removed, added]);
    await act(page, "Undo");
    await act(page, "Redo");
    await expect(alerts).toHaveText([added, removed, added]);
    const ids = await alerts.evaluateAll(elements =>
      elements.map(element => element.getAttribute("aria-describedby")),
    );
    expect(new Set(ids).size).toBe(3);
    const boxes = await alerts.all();
    let bottom = 0;
    for (const alert of boxes) {
      const box = await alert.boundingBox();
      if (!box) throw new Error("Missing notification bounds");
      expect(box.y).toBeGreaterThanOrEqual(bottom);
      bottom = box.y + box.height;
    }
    await alerts
      .nth(1)
      .getByRole("button", { name: "Close", exact: true })
      .click();
    await expect(alerts).toHaveText([added, added]);
    await page.keyboard.press("Escape");
    await expect(alerts).toHaveCount(1);
  });

  test("notifications expire independently while a newer notification remains", async ({
    page,
  }) => {
    await selectPokemon(page, "Slowking");
    await page.waitForTimeout(500);
    await selectMove(page, "Scald");
    await page.waitForTimeout(500);
    await act(page, "Undo");
    await page.waitForTimeout(1500);
    await act(page, "Redo");
    await page.mouse.move(0, 0);
    const alerts = page.getByRole("alert");
    await expect(alerts).toHaveText([
      "Undo add Scald to Slowking",
      "Redo add Scald to Slowking",
    ]);
    await expect(alerts).toHaveText(["Redo add Scald to Slowking"], {
      timeout: 3500,
    });
    await expect(alerts).toHaveCount(0, { timeout: 5000 });
  });

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
    await expect(page.getByRole("alert").last()).toHaveText(
      "Undo add Scald to Slowking",
    );
    await act(page, "Undo");
    await expect(name).toHaveValue("");
    await expect(page.getByRole("alert").last()).toHaveText(
      "Undo place Slowking in slot 1",
    );
    await expectEnabled(page, "Undo", false);
    await expectEnabled(page, "Redo", true);

    await act(page, "Redo");
    await expect(name).toHaveValue("Slowking");
    await act(page, "Redo");
    await expect(page.getByLabel("Pokemon 1's move1")).toHaveValue("Scald");
    await expect(page.getByRole("alert").last()).toHaveText(
      "Redo add Scald to Slowking",
    );
    await expectEnabled(page, "Redo", false);
    await page.waitForTimeout(500);
    await selectMove(page, "Surf");
    await act(page, "Undo");
    await expect(page.getByRole("alert").last()).toHaveText(
      "Undo replace Scald with Surf for Slowking",
    );
    await act(page, "Redo");
    await expect(page.getByRole("alert").last()).toHaveText(
      "Redo replace Scald with Surf for Slowking",
    );
  });

  test("the snackbar undoes a randomized team", async ({ page }) => {
    const name = page.getByLabel("Pokemon 1's name");
    const move = page.getByLabel("Pokemon 1's move1");
    await selectPokemon(page, "Ludicolo");
    await page.waitForTimeout(500);

    await openTeamTools(page);
    await page.getByRole("button", { name: "Randomize team" }).click();
    // A random pokemon comes with moves
    await expect(move).not.toHaveValue("");
    await page
      .getByRole("alert")
      .last()
      .getByRole("button", { name: "Undo" })
      .click();

    await expect(name).toHaveValue("Ludicolo");
    await expect(move).toHaveValue("");
    await expect(page.getByRole("alert").last()).toHaveText(
      "Undo randomize team",
    );
    await act(page, "Redo");
    await expect(page.getByRole("alert").last()).toHaveText(
      "Redo randomize team",
    );
  });
});
