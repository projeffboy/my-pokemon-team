import { test, expect } from "fixtures";
import { clickMenuItem, openManageTeamMenu, openTeamTools } from "helper";
import type { Page } from "@playwright/test";
import { createSavedTeam } from "@/shared/team";
import type { SavedTeam } from "@/types";

const openTeams = async (page: Page) => {
  await openTeamTools(page);
  await page.getByRole("button", { name: "Teams", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Teams", exact: true }),
  ).toBeVisible();
};

const openRowDelete = async (page: Page, name: string) => {
  await openTeams(page);
  await page
    .getByRole("button", { name: `Options for ${name}`, exact: true })
    .click();
  await clickMenuItem(page, "Delete");
  return page.getByRole("dialog", { name: `Delete ${name}?`, exact: true });
};

const savedState = (page: Page) =>
  page.evaluate(() => {
    const { teams, currentTeamId } = JSON.parse(
      localStorage.getItem("mypokemonteam")!,
    ) as { teams: SavedTeam[]; currentTeamId: string };
    return { teams, currentTeamId };
  });

test.describe("Delete team - Integration Tests", () => {
  for (const action of ["toolbar Clear", "Teams row Delete"]) {
    test(`${action} closes when another tab deletes its target and preserves the surviving teams`, async ({
      page,
      context,
    }) => {
      test.setTimeout(60000);
      const target = createSavedTeam({
        name: "Removal target",
        generation: 9,
      });
      target.id = "target";
      target.team[0].name = "carbink";
      const survivor = createSavedTeam({
        name: "Surviving team",
        generation: 9,
        format: "OU",
        filters: {
          type: "Ice",
          region: "Unova",
          ability: "Levitate",
          moves: "Recover",
        },
      });
      survivor.id = "survivor";
      survivor.team[0] = {
        name: "cryogonal",
        nickname: "Snowflake",
        item: "leftovers",
        ability: "Levitate",
        move1: "icebeam",
        move2: "recover",
        move3: "rapidspin",
        move4: "protect",
        level: 63,
        happiness: 85,
        gender: "N",
        shiny: true,
        teraType: "Water",
        nature: "Timid",
        evs: { hp: 4, spa: 252, spe: 252 },
        ivs: { atk: 0 },
      };
      const control = createSavedTeam({
        name: "Unrelated team",
        generation: 9,
      });
      control.id = "control";
      control.team[0].name = "carvanha";
      const teams = [target, survivor, control];
      await page.addInitScript(teams => {
        if (sessionStorage.getItem("seeded-delete-teams")) return;
        localStorage.setItem(
          "mypokemonteam",
          JSON.stringify({
            teams,
            currentTeamId: "target",
            isMoreOpen: true,
            locale: "en",
          }),
        );
        sessionStorage.setItem("seeded-delete-teams", "true");
      }, teams);
      const link = Buffer.from("Carbink").toString("base64url");
      await page.goto(`/?gen=9&team=${link}`, {
        waitUntil: "domcontentloaded",
      });
      await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Carbink");
      await expect
        .poll(() => savedState(page))
        .toEqual({
          teams,
          currentTeamId: target.id,
        });

      if (action === "toolbar Clear") {
        await openManageTeamMenu(page);
        await clickMenuItem(page, "Clear");
      } else await openRowDelete(page, target.name);
      await expect(
        page.getByRole("dialog", { name: "Delete Removal target?" }),
      ).toBeVisible();

      const peer = await context.newPage();
      await peer.goto(page.url(), { waitUntil: "domcontentloaded" });
      await expect(peer.getByLabel("Pokemon 1's name")).toHaveValue("Carbink");
      const peerDelete = await openRowDelete(peer, target.name);
      await peerDelete
        .getByRole("button", { name: "Delete", exact: true })
        .click();
      await expect
        .poll(() => savedState(page))
        .toEqual({
          teams: [survivor, control],
          currentTeamId: survivor.id,
        });
      await page.bringToFront();
      await expect(
        page.getByRole("dialog", { name: /^Delete .*\?$/ }),
      ).toBeHidden();
      await peer.close();
      const teamsDialog = page.getByRole("dialog", {
        name: "Teams",
        exact: true,
      });
      if (await teamsDialog.isVisible()) {
        await teamsDialog
          .getByRole("button", { name: "Close", exact: true })
          .click();
        await expect(teamsDialog).toBeHidden();
      }
      await expect(page.getByLabel("Pokemon 1's name")).toHaveValue(
        "Cryogonal",
      );
      expect(await savedState(page)).toEqual({
        teams: [survivor, control],
        currentTeamId: survivor.id,
      });

      await openManageTeamMenu(page);
      await clickMenuItem(page, "Clear");
      const freshDelete = page.getByRole("dialog", {
        name: "Delete Surviving team?",
        exact: true,
      });
      await expect(freshDelete).toBeVisible();
      await freshDelete
        .getByRole("button", { name: "Delete", exact: true })
        .click();
      await expect(freshDelete).toBeHidden();
      await expect
        .poll(() => savedState(page))
        .toEqual({
          teams: [control],
          currentTeamId: control.id,
        });
      await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Carvanha");
    });
  }
});
