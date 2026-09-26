import { test, expect } from "fixtures";
import { selectMove, selectPokemon } from "helper";

test.describe("History - Integration Tests", () => {
  test("undoes and redoes the team's edits", async ({ page }) => {
    const undo = page.getByRole("button", { name: "Undo" });
    const redo = page.getByRole("button", { name: "Redo" });
    const name = page.getByLabel("Pokemon 1's name");
    await expect(undo).toBeDisabled();

    // Edits within 400ms of each other are one step, so each edit gets its own step here
    await selectPokemon(page, "Slowking");
    await expect(undo).toBeEnabled();
    await page.waitForTimeout(500);
    await selectMove(page, "Scald");
    await expect(page.getByLabel("Pokemon 1's move1")).toHaveValue("Scald");
    await page.waitForTimeout(500);

    await undo.click();
    await expect(page.getByLabel("Pokemon 1's move1")).toHaveValue("");
    await expect(name).toHaveValue("Slowking");
    await undo.click();
    await expect(name).toHaveValue("");
    await expect(undo).toBeDisabled();

    await redo.click();
    await expect(name).toHaveValue("Slowking");
    await redo.click();
    await expect(page.getByLabel("Pokemon 1's move1")).toHaveValue("Scald");
    await expect(redo).toBeDisabled();
  });
});
