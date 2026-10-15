import { test, expect } from "@playwright/test";
import { loadGenerationTransferData } from "@/shared/generation-transfer-data";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import { DEFAULT_TEAM_SETTINGS } from "@/shared/team";
import { planOldWebsiteTeam } from "@/store/old-website";
import { parseTeamText } from "@/store/team-text";
import { createTeam } from "./shared/team";

const data = await loadGenerationTransferData();

test("a Gen 6–9 team keeps its sets and names each set detail left behind", () => {
  const { text, losses } = planOldWebsiteTeam(
    createTeam(
      {
        name: "dragapult",
        item: "choicespecs",
        ability: "Infiltrator",
        move1: "shadowball",
        move2: "dracometeor",
        nickname: "Phantom",
        level: 50,
        gender: "F",
        shiny: true,
        happiness: 0,
        teraType: "Ghost",
        nature: "timid",
        evs: { spa: 252, spe: 252 },
        ivs: { atk: 0 },
      },
      { name: "tinkaton", item: "airballoon", ability: "Pickpocket" },
    ),
    DEFAULT_TEAM_SETTINGS,
    data,
  );
  expect(losses).toEqual([
    {
      index: 0,
      pokemon: "dragapult",
      entries: [],
      details: [
        "nickname",
        "level",
        "gender",
        "shiny",
        "happiness",
        "teraType",
        "nature",
        "evs",
        "ivs",
      ],
    },
  ]);
  expect(text).toBe(
    "Dragapult @ Choice Specs\nAbility: Infiltrator\n- Shadow Ball\n- Draco Meteor\n-\n-\n\n" +
      "Tinkaton @ Air Balloon\nAbility: Pickpocket\n-\n-\n-\n-\n\n",
  );
});

test("a Gen 2 team names the items and moves Generations 6–9 lack, in Gen 2 terms", () => {
  const { text, losses } = planOldWebsiteTeam(
    createTeam({
      name: "fearow",
      item: "polkadotbow",
      move1: "payday",
      move2: "drillpeck",
      statExperience: { atk: 65535 },
      evs: { atk: 255 },
      ivs: { def: 21 },
    }),
    { generation: 2, format: "" },
    data,
  );
  expect(losses).toHaveLength(1);
  expect(losses[0]?.entries.map(({ field, value }) => [field, value])).toEqual([
    ["item", "polkadotbow"],
    ["move", "payday"],
  ]);
  expect(losses[0]?.details).toEqual(["statExperience", "dvs"]);
  const [fearow] = parseTeamText(text);
  expect(fearow).toMatchObject({ name: "fearow", item: "", move1: "" });
  expect(fearow?.move2).toBe("drillpeck");
});

test("a forme missing from Generations 6–9 goes as its base species", () => {
  const { text, losses } = planOldWebsiteTeam(
    createTeam({ name: "pichuspikyeared", move1: "thundershock" }),
    { generation: 4, format: "" },
    data,
  );
  expect(losses[0]?.entries[0]).toMatchObject({
    field: "pokemon",
    value: "pichuspikyeared",
    replacement: "pichu",
  });
  expect(parseTeamText(text)[0]?.name).toBe("pichu");
});

test("Champions training is named SPs, and its fixed level is not a loss", () => {
  const { losses } = planOldWebsiteTeam(
    createTeam({ name: "garchomp", level: 50, evs: { atk: 32 } }),
    { generation: 9, format: CHAMPIONS_FORMAT },
    data,
  );
  expect(losses[0]?.details).toEqual(["sps"]);
});

test("an empty team has nothing to carry", () => {
  expect(planOldWebsiteTeam(createTeam(), DEFAULT_TEAM_SETTINGS, data)).toEqual(
    { text: "", losses: [] },
  );
});
