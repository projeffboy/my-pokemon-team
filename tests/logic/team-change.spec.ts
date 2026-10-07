import { test, expect } from "@playwright/test";
import { describeTeamChange } from "@/store/team-change";
import { english, loadTranslation } from "@/i18n/translation";
import { createTeam } from "./shared/team";

test("pokemon changes identify the slot and both species without listing reset fields", () => {
  const before = createTeam({ name: "dragalge", move1: "sludgebomb" });
  const after = createTeam({ name: "clawitzer" });
  expect(describeTeamChange(before, after)).toBe("place Clawitzer in slot 1");
  expect(describeTeamChange(after, before)).toBe("place Dragalge in slot 1");
});

test("move, item and ability changes use display names and include empty values", () => {
  const before = createTeam({
    name: "bronzong",
    move2: "psychic",
    item: "leftovers",
    ability: "Levitate",
  });
  const after = createTeam({
    name: "bronzong",
    move2: "psyshock",
    item: "sitrusberry",
    ability: "Heatproof",
  });
  expect(describeTeamChange(before, after)).toBe(
    "replace Psychic with Psyshock for Bronzong; replace Leftovers with Sitrus Berry for Bronzong; 1 more change",
  );
  expect(
    describeTeamChange(
      createTeam({ name: "bronzong" }),
      createTeam({ name: "bronzong", ability: "Levitate" }),
    ),
  ).toBe("add Levitate to Bronzong");
});

test("advanced changes include their stat and normalize omitted defaults", () => {
  const before = createTeam({ name: "reuniclus" });
  const after = createTeam({
    name: "reuniclus",
    evs: { hp: 252 },
    ivs: { spe: 0 },
  });
  expect(describeTeamChange(before, after)).toBe(
    "change HP EVs to 252 for Reuniclus; change Spe IVs to 0 for Reuniclus",
  );
  expect(
    describeTeamChange(
      before,
      createTeam({
        name: "reuniclus",
        level: 100,
        shiny: false,
        evs: { hp: 0 },
        ivs: { spe: 31 },
      }),
    ),
  ).toBeUndefined();
});

test("swaps name both pokemon and empty-slot moves name the destination", () => {
  const before = createTeam(
    { name: "copperajah", item: "leftovers" },
    { name: "sandaconda" },
  );
  expect(describeTeamChange(before, createTeam(before[1], before[0]))).toBe(
    "swap Sandaconda and Copperajah",
  );
  expect(
    describeTeamChange(
      createTeam({ name: "copperajah" }),
      createTeam({}, { name: "copperajah" }),
    ),
  ).toBe("place Copperajah in slot 2");
});

test("whole-team edits summarize the remaining slots instead of overflowing the snackbar", () => {
  const after = createTeam(
    ...["raikou", "entei", "suicune", "articuno", "zapdos", "moltres"].map(
      name => ({ name }),
    ),
  );
  expect(describeTeamChange(createTeam(), after)).toBe(
    "place Raikou in slot 1; place Entei in slot 2; 4 more changes",
  );
  expect(describeTeamChange(after, after)).toBeUndefined();
});

test("messages use the current language for labels and names", async () => {
  const translation = await loadTranslation("fr");
  const description = describeTeamChange(
    createTeam({ name: "bulbasaur", move1: "tackle" }),
    createTeam({ name: "bulbasaur", move1: "growl" }),
    translation,
  );
  expect(description).toContain(translation.names.pokemon("bulbasaur"));
  expect(description).toBe(
    translation.t.team.replacedValue(
      translation.names.move("tackle"),
      translation.names.move("growl"),
      translation.names.pokemon("bulbasaur"),
    ),
  );
});

test("duplicate species retain their slot context", () => {
  const before = createTeam(
    { name: "darmanitan", move1: "thrash" },
    { name: "darmanitan" },
  );
  const after = createTeam(
    { name: "darmanitan", move1: "substitute" },
    { name: "darmanitan" },
  );
  expect(describeTeamChange(before, after, english)).toBe(
    "replace Thrash with Substitute for Darmanitan, slot 1",
  );
});
