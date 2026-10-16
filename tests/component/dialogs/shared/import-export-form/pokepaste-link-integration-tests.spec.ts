import { test, expect } from "fixtures";
import { openImportExport, selectPokemon, showSlot } from "helper";
import type { BrowserContext, Page, Route } from "@playwright/test";

const ID = "0123456789abcdef";
const OTHER_ID = "fedcba9876543210";
const LINK_FAILED =
  "Could not fetch a team from that link. Make sure you copied the full link, or paste the team text instead.";

interface Paste {
  paste: string;
  title?: string;
  author?: string;
  notes?: string;
}

type Reply = Parameters<Route["fulfill"]>[0] | "network error";

const json = (paste: Paste): Reply => ({
  contentType: "application/json",
  body: JSON.stringify(paste),
});

// The pastes pokepast.es has: Windows line breaks, as it keeps them
const PASTES: Record<string, Paste> = {
  [ID]: {
    title: "Rain team",
    author: "someone",
    notes: "Format: gen8ou",
    paste:
      "Slaking @ Choice Band\r\nAbility: Truant\r\n- Facade\r\n- Hyper Voice\r\n\r\nGrumpig @ Leftovers\r\nAbility: Thick Fat\r\n- Psychic\r\n- Thunder Wave\r\n",
  },
  [OTHER_ID]: { paste: "Regirock @ Leftovers\r\n- Stone Edge\r\n" },
};

// Answers pokepast.es' /<id>/json as the site does, with CORS open to any page, and
// lists the paths it is asked for. `wait` holds the answers back.
const mockPokepaste = async (
  context: BrowserContext,
  respond: (id: string) => Reply = id =>
    PASTES[id] ? json(PASTES[id]) : { status: 404, body: "Not found" },
  wait?: Promise<unknown>,
) => {
  const requests: string[] = [];
  await context.route("https://pokepast.es/**", async route => {
    const { pathname } = new URL(route.request().url());
    requests.push(pathname);
    await wait;
    const reply = respond(pathname.split("/")[1] ?? "");
    // The request is gone when the dialog was closed meanwhile
    if (reply === "network error") await route.abort().catch(() => {});
    else
      await route
        .fulfill({ ...reply, headers: { "access-control-allow-origin": "*" } })
        .catch(() => {});
  });
  return requests;
};

const getDialog = (page: Page) =>
  page.getByRole("dialog", { name: "Import/Export" });

const updateButton = (page: Page) =>
  getDialog(page).getByRole("button", { name: "Update", exact: true });

// Types the text, waits until Update is ready for it, and presses it
const update = async (page: Page, text: string) => {
  await getDialog(page).getByRole("textbox").fill(text);
  await expect(updateButton(page)).toBeEnabled();
  await updateButton(page).click();
};

const gameValue = (page: Page) => page.locator("header .MuiSelect-nativeInput");

test.describe("Import/Export Form: pokepast.es links - Integration Tests", () => {
  test("replaces the team with the pokemon of a link, but not its title or game", async ({
    page,
    context,
  }) => {
    const requests = await mockPokepaste(context);
    await openImportExport(page);
    await getDialog(page)
      .getByRole("textbox")
      .fill(`https://pokepast.es/${ID}`);
    await expect(updateButton(page)).toBeEnabled();
    expect(requests).toEqual([]);

    await updateButton(page).click();

    await expect(getDialog(page)).toBeHidden();
    expect(requests).toEqual([`/${ID}/json`]);
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Slaking");
    await expect(page.getByLabel("Pokemon 1's item")).toHaveValue(
      "Choice Band",
    );
    await expect(page.getByLabel("Pokemon 1's ability")).toHaveValue("Truant");
    await expect(page.getByLabel("Pokemon 1's move2")).toHaveValue(
      "Hyper Voice",
    );
    await showSlot(page, 1);
    await expect(page.getByLabel("Pokemon 2's name")).toHaveValue("Grumpig");
    await expect(page.getByLabel("Pokemon 2's move2")).toHaveValue(
      "Thunder Wave",
    );

    await expect(gameValue(page)).toHaveValue("9");
    await page.getByRole("button", { name: "Teams", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Load Team 1", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /Rain team/ })).toHaveCount(
      0,
    );
  });

  for (const [shape, link] of [
    ["a link to the paste's raw text", `https://pokepast.es/${ID}/raw?x`],
    ["a plain http link with www", `http://www.pokepast.es/${ID}`],
    ["a link with spaces around it", `  https://pokepast.es/${ID}  \n`],
  ])
    test(`reads ${shape}`, async ({ page, context }) => {
      const requests = await mockPokepaste(context);
      await openImportExport(page);

      await update(page, link);

      await expect(getDialog(page)).toBeHidden();
      expect(requests).toEqual([`/${ID}/json`]);
      await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Slaking");
    });

  test("replaces each link line of the text with its paste and keeps the other lines", async ({
    page,
    context,
  }) => {
    const requests = await mockPokepaste(context);
    await openImportExport(page);

    await update(
      page,
      `Plusle @ Leftovers\n- Thunder Wave\n\nhttps://pokepast.es/${OTHER_ID}\n\nMinun`,
    );

    await expect(getDialog(page)).toBeHidden();
    expect(requests).toEqual([`/${OTHER_ID}/json`]);
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Plusle");
    await showSlot(page, 1);
    await expect(page.getByLabel("Pokemon 2's name")).toHaveValue("Regirock");
    await showSlot(page, 2);
    await expect(page.getByLabel("Pokemon 3's name")).toHaveValue("Minun");
  });

  test("fetches every link in the text", async ({ page, context }) => {
    const requests = await mockPokepaste(context);
    await openImportExport(page);

    await update(
      page,
      `https://pokepast.es/${OTHER_ID}\n\nhttps://pokepast.es/${ID}`,
    );

    await expect(getDialog(page)).toBeHidden();
    expect([...requests].sort()).toEqual([`/${ID}/json`, `/${OTHER_ID}/json`]);
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Regirock");
    await showSlot(page, 1);
    await expect(page.getByLabel("Pokemon 2's name")).toHaveValue("Slaking");
  });

  for (const [problem, reply] of [
    ["an unknown paste", { status: 404, body: "Not found" }],
    ["a server error", { status: 500, body: "Oops" }],
    ["a reply that is not JSON", { body: "<html>A paste</html>" }],
    ["JSON that is not a paste", { body: '{"title":"No paste"}' }],
    ["a network error", "network error"],
  ] as [string, Reply][])
    test(`says so, and changes nothing, after ${problem}`, async ({
      page,
      context,
    }) => {
      const requests = await mockPokepaste(context, () => reply);
      await selectPokemon(page, "Seviper");
      await openImportExport(page);
      const dialog = getDialog(page);
      const box = dialog.getByRole("textbox");
      const link = `https://pokepast.es/${ID}`;

      await update(page, link);

      await expect(dialog.getByText(LINK_FAILED)).toBeVisible();
      await expect(box).toHaveAttribute("aria-invalid", "true");
      await expect(box).toHaveValue(link);
      await expect(updateButton(page)).toBeEnabled();
      await expect(dialog.getByRole("progressbar")).toHaveCount(0);
      expect(requests).toEqual([`/${ID}/json`]);
      await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Seviper");

      await box.fill(`${link}\n`);
      await expect(dialog.getByText(LINK_FAILED)).toHaveCount(0);
      await expect(box).toHaveAttribute("aria-invalid", "false");
    });

  test("one failing link among several changes nothing", async ({
    page,
    context,
  }) => {
    await mockPokepaste(context);
    await selectPokemon(page, "Crawdaunt");
    await openImportExport(page);

    await update(
      page,
      `https://pokepast.es/${ID}\nhttps://pokepast.es/aaaaaaaaaaaaaaaa`,
    );

    await expect(getDialog(page).getByText(LINK_FAILED)).toBeVisible();
    await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Crawdaunt");
  });

  test.describe("while a link is being fetched", () => {
    let release: () => void;
    let requests: string[];

    test.beforeEach(async ({ page, context }) => {
      const wait = new Promise<void>(resolve => (release = resolve));
      requests = await mockPokepaste(context, undefined, wait);
      await selectPokemon(page, "Vigoroth");
      await openImportExport(page);
      await update(page, `https://pokepast.es/${ID}`);
      await expect.poll(() => requests).toEqual([`/${ID}/json`]);
    });

    test("Update shows that it is loading and cannot be pressed again", async ({
      page,
    }) => {
      const dialog = getDialog(page);
      await expect(dialog.getByRole("progressbar")).toBeVisible();
      await expect(updateButton(page)).toBeDisabled();

      release();

      await expect(dialog).toBeHidden();
      await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Slaking");
      expect(requests).toEqual([`/${ID}/json`]);
    });

    for (const close of ["Cancel", "Escape"])
      test(`${close} applies nothing when the paste arrives later`, async ({
        page,
      }) => {
        const dialog = getDialog(page);
        await expect(dialog.getByRole("progressbar")).toBeVisible();
        if (close === "Cancel")
          await dialog
            .getByRole("button", { name: "Cancel", exact: true })
            .click();
        else await page.keyboard.press("Escape");
        await expect(dialog).toBeHidden();

        release();
        await openImportExport(page);
        await expect(dialog.getByRole("textbox")).toHaveValue(/^Vigoroth/);
        await expect(dialog.getByText(LINK_FAILED)).toHaveCount(0);
        await dialog.getByRole("button", { name: "Cancel" }).click();
        await expect(page.getByLabel("Pokemon 1's name")).toHaveValue(
          "Vigoroth",
        );
        await expect(
          page.getByRole("alert", { includeHidden: true }),
        ).toHaveCount(0);
      });
  });
});
