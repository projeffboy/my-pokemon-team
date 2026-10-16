import { test, expect } from "fixtures";
import {
  clickMenuItem,
  closeDialog,
  openFilters,
  openImportExport,
  selectDialogOption,
  selectPokemon,
} from "helper";
import type { BrowserContext, Page } from "@playwright/test";

const CREATE_URL = "https://pokepast.es/create";

interface PokepasteRequest {
  method: string;
  url: string;
  form: URLSearchParams;
}

// Answers whatever the site sends to pokepast.es and lists it
const mockPokepaste = async (context: BrowserContext) => {
  const requests: PokepasteRequest[] = [];
  await context.route("https://pokepast.es/**", route => {
    const request = route.request();
    requests.push({
      method: request.method(),
      url: request.url(),
      form: new URLSearchParams(request.postData() ?? ""),
    });
    return route.fulfill({
      contentType: "text/html",
      body: "<title>Pasted</title>",
    });
  });
  return requests;
};

// Presses Upload to PokePaste, which opens pokepast.es in a new tab
const upload = async (page: Page, context: BrowserContext) => {
  const dialog = page.getByRole("dialog", { name: "Import/Export" });
  const newTab = context.waitForEvent("page");
  await dialog
    .getByRole("button", { name: "Upload to PokePaste", exact: true })
    .click();
  const tab = await newTab;
  await expect(tab).toHaveTitle("Pasted");
  return tab;
};

const renameTeam = async (page: Page, name: string) => {
  await page.getByRole("button", { name: "Teams", exact: true }).click();
  await page
    .getByRole("button", { name: "Options for Team 1", exact: true })
    .click();
  await clickMenuItem(page, "Edit team name");
  const dialog = page.getByRole("dialog", { name: "Edit team name" });
  await dialog.getByLabel("Team name").fill(name);
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog).toBeHidden();
  await closeDialog(page, "Close");
};

test.describe("Import/Export Form: Upload to PokePaste - Integration Tests", () => {
  test("posts the team's name, text, and game to a new pokepast.es tab", async ({
    page,
    context,
  }) => {
    const requests = await mockPokepaste(context);
    await selectPokemon(page, "Nosepass");
    await renameTeam(page, "Rock Slide Ranch");
    await openImportExport(page);
    const dialog = page.getByRole("dialog", { name: "Import/Export" });
    const text = await dialog.getByRole("textbox").inputValue();
    expect(text).toMatch(/^Nosepass/);

    const tab = await upload(page, context);

    expect(tab.url()).toBe(CREATE_URL);
    expect(await tab.evaluate(() => window.opener === null)).toBe(true);
    expect(requests).toHaveLength(1);
    const [request] = requests;
    expect(request?.method).toBe("POST");
    expect(request?.url).toBe(CREATE_URL);
    expect([...(request?.form.keys() ?? [])].sort()).toEqual([
      "notes",
      "paste",
      "title",
    ]);
    expect(request?.form.get("title")).toBe("Rock Slide Ranch");
    expect(request?.form.get("paste")?.replaceAll("\r\n", "\n")).toBe(text);
    expect(request?.form.get("notes")).toBe("Format: gen9");

    // The site's own tab keeps the dialog and leaves no form behind
    await expect(dialog).toBeVisible();
    await expect(page.locator(`form[action="${CREATE_URL}"]`)).toHaveCount(0);
  });

  test("posts the text in the box, including edits the team does not have yet", async ({
    page,
    context,
  }) => {
    const requests = await mockPokepaste(context);
    await openImportExport(page);
    const dialog = page.getByRole("dialog", { name: "Import/Export" });
    const text = "Plusle @ Leftovers\nAbility: Plus\n- Thunder Wave\n- Facade";
    await dialog.getByRole("textbox").fill(text);

    await upload(page, context);

    expect(requests).toHaveLength(1);
    expect(requests[0]?.form.get("title")).toBe("Team 1");
    expect(requests[0]?.form.get("paste")?.replaceAll("\r\n", "\n")).toBe(text);
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("");
  });

  test("sends the id of the game and format the team is set to", async ({
    page,
    context,
  }) => {
    const requests = await mockPokepaste(context);
    await page.getByRole("combobox", { name: "Generation" }).click();
    await page
      .getByRole("option")
      .and(page.locator('[data-value="8"]'))
      .click();
    await expect(page.locator(".MuiMenu-paper")).toBeHidden();
    await openFilters(page);
    await selectDialogOption(page, "Format", "OU: Over Used");
    await closeDialog(page);
    await openImportExport(page);
    await page.getByRole("dialog").getByRole("textbox").fill("Grumpig");

    await upload(page, context);

    expect(requests).toHaveLength(1);
    expect(requests[0]?.form.get("notes")).toBe("Format: gen8ou");
  });
});
