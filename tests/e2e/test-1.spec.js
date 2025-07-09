import { test, expect } from "@playwright/test";

/*
 * Things tested:
 * - selecting both a basic pokemon and a pokemon of another forme
 * - selecting moves, some of which can affect the team checklist
 * - selecting items
 * - selecting abilities
 * - setting filters
 * - team defence's accuracy
 * - team type coverage's accuracy
 * - team checklist's accuracy
 */
test("Sanity E2E Test", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page
    .locator("#react-select-react-select-single-0-name--value")
    .getByText("Name")
    .click();
  await page.locator("#react-select-single-0-name").fill("klink");
  await page.getByText("Klink", { exact: true }).click();
  await page
    .locator("#react-select-react-select-single-0-item--value")
    .getByText("Item")
    .click();
  await page.locator("#react-select-single-0-item").fill("choice");
  await page
    .locator("div")
    .filter({ hasText: /^Choice Scarf$/ })
    .click();
  await page
    .locator("#react-select-react-select-single-1-name--value")
    .getByText("Name")
    .click();
  await page.locator("#react-select-single-1-name").fill("hisui");
  await page.getByText("Typhlosion-Hisui").click();
  await page
    .locator("#react-select-react-select-single-2-name--value")
    .getByText("Name")
    .click();
  await page.locator("#react-select-single-2-name").fill("charizard");
  await page.getByText("Charizard-Mega-Y").click();
  await page
    .locator(
      "div:nth-child(3) > .MuiPaper-root-232 > .Pokemon-gridContainer-259 > div:nth-child(2) > .Select > .Select-control > .Select-arrow-zone > .Select-arrow"
    )
    .click();
  await page.locator("#react-select-single-2-move1").fill("air sl");
  await page.getByRole("rowgroup").locator("div").click();
  await page
    .locator("#react-select-react-select-single-2-move2--value")
    .getByText("Move")
    .click();
  await page.locator("#react-select-single-2-move2").fill("dragon p"); // TODO: for a more diverse test, instead of typing into the placeholder, we could scroll to the option before clicking it
  await page.getByText("Dragon Pulse").click();
  await page
    .locator("#react-select-react-select-single-1-ability--value")
    .getByText("Ability")
    .click();
  await page.getByText("Frisk").click();
  await page
    .locator("#react-select-react-select-single-2-move3--value")
    .getByText("Move")
    .click();
  await page.locator("#react-select-single-2-move3").fill("roost");
  await page.getByText("Roost", { exact: true }).click();
  await page
    .locator(
      "div:nth-child(3) > .MuiFormControl-root-345 > .MuiInputBase-root-278 > .MuiSelect-root-367 > .MuiSelect-select-368"
    )
    .click();
  await page.getByRole("option", { name: "Johto" }).click();
  await page
    .locator(
      "div:nth-child(4) > .MuiPaper-root-232 > .Pokemon-gridContainer-259 > div > .Select > .Select-control > .Select-arrow-zone"
    )
    .first()
    .click();
  await page.locator("#react-select-single-3-name").fill("cam");
  await page.getByText("Nothing found (Or you haven't").click(); // TODO: change this to an assertion
  await page.locator("#react-select-single-3-name").fill("pichu");
  await page.getByText("Pichu", { exact: true }).click();
  await page
    .locator(
      ".Select.MuiInputBase-input-288.MuiInput-input-273.has-value.is-clearable.is-focused > .Select-control > .Select-clear-zone > .MuiSvgIcon-root-223"
    )
    .click();
  await page.getByRole("tab", { name: "Team Checklist" }).click();
  await expect(page.locator("#root")).toMatchAriaSnapshot(`
    - option "Klink" [selected]
    - combobox
    - text: Move
    - combobox
    - img "klink"
    - text: Move
    - combobox
    - text: Move
    - combobox
    - text: Move
    - combobox
    - option "Choice Scarf" [selected]
    - combobox
    - text: Ability
    - combobox
    - option "Typhlosion-Hisui" [selected]
    - combobox
    - text: Move
    - combobox
    - img "typhlosion-hisui"
    - text: Move
    - combobox
    - text: Move
    - combobox
    - text: Move
    - combobox
    - text: Item
    - combobox
    - option "Frisk" [selected]
    - combobox
    - option "Charizard-Mega-Y" [selected]
    - combobox
    - option "Air Slash" [selected]
    - combobox
    - img "charizard-megay"
    - option "Dragon Pulse" [selected]
    - combobox
    - option "Roost" [selected]
    - combobox
    - text: Move
    - combobox
    - option "Charizardite Y" [selected]
    - combobox
    - option "Drought" [selected]
    - combobox
    - text: Name
    - combobox
    - text: Move
    - combobox
    - img "question-mark"
    - text: Move
    - combobox
    - text: Move
    - combobox
    - text: Move
    - combobox
    - text: Item
    - combobox
    - text: Ability
    - combobox
    - text: Name
    - combobox
    - text: Move
    - combobox
    - img "question-mark"
    - text: Move
    - combobox
    - text: Move
    - combobox
    - text: Move
    - combobox
    - text: Item
    - combobox
    - text: Ability
    - combobox
    - text: Name
    - combobox
    - text: Move
    - combobox
    - img "question-mark"
    - text: Move
    - combobox
    - text: Move
    - combobox
    - text: Move
    - combobox
    - text: Item
    - combobox
    - text: Ability
    - combobox
    `);

  await expect(page.locator("#root")).toMatchAriaSnapshot(`
      - heading "Team Defence" [level=6]
      - text: Bug +4 Dark -1 Dragon +1 Electric -1 Fairy +3 Fighting +1.5 Fire +1 Flying +1 Ghost -1 Grass +3.5 Ground -0.5 Ice +2 Normal +2.5 Poison +2.5 Psychic +1 Rock -1.5 Steel +3 Water -2
      - heading "Team Type Coverage" [level=6]
      - text: Bug +2 Dark 0 Dragon +1 Electric 0 Fairy 0 Fighting +2 Fire 0 Flying 0 Ghost 0 Grass +2 Ground 0 Ice 0 Normal 0 Poison 0 Psychic 0 Rock 0 Steel 0 Water 0
      - banner:
        - tablist:
          - tab "Search Filters"
          - tab "Team Checklist" [selected]
          - tab "Save/Load Team"
      - text: General Entry Hazard Spinner/Defogger Reliable Recovery Defensive Cleric Status Move Phazer Offensive Boosting Move Volt-turn Move Choice Item
      `);

  await expect(
    page
      .locator(
        "div:nth-child(4) > div > .MuiSvgIcon-root-223 > path:nth-child(2)"
      )
      .first()
  ).toBeVisible();

  await expect(
    page.locator(
      "div:nth-child(3) > div:nth-child(4) > div > .MuiSvgIcon-root-223 > path:nth-child(2)"
    )
  ).toBeVisible();
});
