import { test, expect } from "fixtures";
import {
  selectPokemon,
  selectMove,
  turnOnAdvanced,
  getTeamTextFromUrl,
  openAdvanced,
} from "helper";
import { createSavedTeam, createSearchFilters } from "@/shared/team";
import { initialStoredState } from "@/store/teams-storage";
import { parseTeamText } from "@/store/team-text";
import { toBase64Url } from "@/app/shared/base64url";

test("loading identical saved sets persists the selected team's identity", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  const alpha = createSavedTeam({
    name: "Alpha",
    generation: 9,
    format: "OU: Over Used",
    team: parseTeamText("Cloyster\n- Surf"),
    filters: { ...createSearchFilters(), type: "Ice" },
  });
  const beta = createSavedTeam({
    name: "Beta",
    generation: 9,
    format: "UU: Under Used",
    team: parseTeamText("Cloyster\n- Surf"),
    filters: { ...createSearchFilters(), type: "Water" },
  });
  await page.evaluate(
    state => localStorage.setItem("mypokemonteam", JSON.stringify(state)),
    { ...initialStoredState(), teams: [alpha, beta], currentTeamId: beta.id },
  );
  await page.goto(`/?team=${toBase64Url("Cloyster\n- Surf")}`);
  await page.getByRole("button", { name: "Teams", exact: true }).click();
  await page.getByRole("button", { name: "Load Alpha", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("mypokemonteam") ?? "{}")
            .currentTeamId,
      ),
    )
    .toBe(alpha.id);
  await page.reload();
  await page.getByRole("button", { name: "Teams", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Load Alpha", exact: true }),
  ).toHaveAttribute("aria-current", "true");
});

test("reload retains final rapid EV edits while a new shared link takes precedence", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  await selectPokemon(page, "Tentacruel");
  await selectMove(page, "Surf", 1);
  await turnOnAdvanced(page);
  await page
    .getByRole("button", { name: "More details for slot 1", exact: true })
    .click();
  const slider = page.getByRole("slider", { name: "HP EVs", exact: true });
  await slider.focus();
  for (let i = 0; i < 60; i++) await page.keyboard.press("ArrowRight");
  let finalHp = Number(await slider.getAttribute("aria-valuenow"));
  // A timer can finish on the final keypress; make one more edit if it did.
  for (
    let i = 0;
    i < 5 && getTeamTextFromUrl(page).includes(`EVs: ${finalHp} HP`);
    i++
  ) {
    await page.keyboard.press("ArrowRight");
    finalHp = Number(await slider.getAttribute("aria-valuenow"));
  }
  expect(finalHp).toBeGreaterThanOrEqual(60);
  expect(getTeamTextFromUrl(page)).not.toContain(`EVs: ${finalHp} HP`);
  await page.reload();
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Tentacruel");
  await expect
    .poll(() => getTeamTextFromUrl(page))
    .toContain(`EVs: ${finalHp} HP`);
  await page.goto(`/?team=${toBase64Url("Tentacruel\nEVs: 13 HP\n- Surf")}`);
  await expect.poll(() => getTeamTextFromUrl(page)).toContain("EVs: 13 HP");
  await page
    .getByRole("button", { name: "More details for slot 1", exact: true })
    .click();
  await expect(slider).toHaveAttribute("aria-valuenow", "13");
});

test("another tab's different-slot edit preserves an unfinished name search", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  await selectPokemon(page, "Donphan");
  await expect
    .poll(() =>
      page.evaluate(() =>
        JSON.parse(localStorage.getItem("mypokemonteam") ?? "{}").teams?.some(
          (team: { team: { name: string }[] }) =>
            team.team[0]?.name === "donphan",
        ),
      ),
    )
    .toBe(true);
  const other = await context.newPage();
  await other.setViewportSize({ width: 1200, height: 900 });
  await other.goto(page.url());
  const search = other.getByLabel("Pokemon 1's name");
  await expect(search).toHaveValue("Donphan");
  await search.fill("pik");
  await selectPokemon(page, "Slugma", 1);
  await expect(other.getByLabel("Pokemon 2's name")).toHaveValue("Slugma");
  await expect(search).toHaveValue("pik");
  await expect(search).toBeFocused();
  await other.close();
});

test("opening the displayed shared URL during a pending write respects that link", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  await selectPokemon(page, "Tentacool");
  await selectMove(page, "Surf");
  await turnOnAdvanced(page);
  await page
    .getByRole("button", { name: "More details for slot 1", exact: true })
    .click();
  const slider = page.getByRole("slider", { name: "HP EVs", exact: true });
  await slider.focus();
  for (let i = 0; i < 60; i++) await page.keyboard.press("ArrowRight");
  let finalHp = Number(await slider.getAttribute("aria-valuenow"));
  for (
    let i = 0;
    i < 5 && getTeamTextFromUrl(page).includes(`EVs: ${finalHp} HP`);
    i++
  ) {
    await page.keyboard.press("ArrowRight");
    finalHp = Number(await slider.getAttribute("aria-valuenow"));
  }
  const sharedUrl = page.url();
  const sharedHp = parseTeamText(getTeamTextFromUrl(page))[0]?.evs?.hp ?? 0;
  expect(sharedHp).not.toBe(finalHp);
  await page.goto(sharedUrl);
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Tentacool");
  await page
    .getByRole("button", { name: "More details for slot 1", exact: true })
    .click();
  await expect(slider).toHaveAttribute("aria-valuenow", String(sharedHp));
});

test("Back and Forward override a pending address-bar write", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto(`/?team=${toBase64Url("Seadra\n- Surf")}`);
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Seadra");
  await page.evaluate(() => history.pushState(null, "", location.href));
  await turnOnAdvanced(page);
  await page
    .getByRole("button", { name: "More details for slot 1", exact: true })
    .click();
  const slider = page.getByRole("slider", { name: "HP EVs", exact: true });
  await slider.focus();
  for (let i = 0; i < 60; i++) await page.keyboard.press("ArrowRight");
  const forwardHp = parseTeamText(getTeamTextFromUrl(page))[0]?.evs?.hp ?? 0;
  expect(forwardHp).toBeGreaterThan(0);
  await page.goBack();
  await expect(page.getByRole("dialog", { name: "More details" })).toBeHidden();
  expect(getTeamTextFromUrl(page)).not.toContain("EVs:");
  await openAdvanced(page);
  await expect(slider).toHaveAttribute("aria-valuenow", "0");
  await page.goForward();
  await expect(page.getByRole("dialog", { name: "More details" })).toBeHidden();
  await openAdvanced(page);
  await expect(slider).toHaveAttribute("aria-valuenow", String(forwardHp));
});

test("pending early edits survive URL sync restarting when availability finishes loading", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  let release = () => {};
  const held = new Promise<void>(resolve => {
    release = resolve;
  });
  await page.route("**/src/data/generation-transfer.json*", async route => {
    await held;
    await route.continue();
  });
  await page.goto("/?gen=9", { waitUntil: "domcontentloaded" });
  await selectPokemon(page, "Tentacruel");
  await turnOnAdvanced(page);
  await page
    .getByRole("button", { name: "More details for slot 1", exact: true })
    .click();
  const slider = page.getByRole("slider", { name: "HP EVs", exact: true });
  await slider.focus();
  for (let i = 0; i < 60; i++) await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveAttribute("aria-valuenow", "60");
  const loaded = page.waitForResponse("**/src/data/generation-transfer.json*");
  release();
  await loaded;
  await expect.poll(() => getTeamTextFromUrl(page)).toContain("EVs: 60 HP");
  await expect(slider).toHaveAttribute("aria-valuenow", "60");
});
