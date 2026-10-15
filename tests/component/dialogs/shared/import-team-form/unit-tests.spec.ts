import { test, expect } from "fixtures";
import { openEditPokepaste } from "helper";

test.describe("Import Team Form - Unit Tests", () => {
  test("says the set details are kept only when the selected game has them", async ({
    page,
  }) => {
    await openEditPokepaste(page);
    const dialog = page.getByRole("dialog", { name: "Edit Pokepaste" });
    await expect(dialog).toContainText(
      "Nicknames, levels, genders, shiny, happiness, tera types, natures, EVs, and IVs are kept when the selected game has them.",
    );
  });
});
