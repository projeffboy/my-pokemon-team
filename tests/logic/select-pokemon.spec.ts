import { test, expect } from "./fixtures";

test("selecting a pokemon resets the slot and auto-selects its only item and ability", ({
  store,
}) => {
  const member = store.team[1];
  member.move1 = "earthquake";

  store.selectPokemon(1, "gyaradosmega");
  expect(member).toMatchObject({
    name: "gyaradosmega",
    item: "gyaradosite",
    ability: "Mold Breaker",
    move1: "",
  });

  store.selectPokemon(1, "kingdra");
  expect(member).toMatchObject({ name: "kingdra", item: "", ability: "" });
});

test("selecting a pokemon leaves the other slots alone", ({ store }) => {
  const other = store.team[3];
  other.name = "pidgeotmega";
  other.item = "leftovers";
  other.ability = "";

  store.selectPokemon(0, "sceptilemega");
  expect(other).toMatchObject({ item: "leftovers", ability: "" });
});

test("the Item dropdown offers an auto-selected required item that the game lacks", ({
  store,
}) => {
  expect(store.teamItems).not.toContain("bugmemory");
  store.selectPokemon(0, "silvallybug");
  store.selectPokemon(1, "necrozmaultra");
  expect(store.team[0]?.item).toBe("bugmemory");
  expect(store.team[1]?.item).toBe("ultranecroziumz");
  expect(store.teamItems).toEqual(
    expect.arrayContaining(["bugmemory", "ultranecroziumz"]),
  );
  expect(store.teamItems).not.toContain("firememory");

  store.currentTeam.generation = 8;
  store.selectPokemon(0, "dialgaorigin");
  store.selectPokemon(1, "palkiaorigin");
  expect(store.team[0]?.item).toBe("adamantcrystal");
  expect(store.teamItems).toEqual(
    expect.arrayContaining(["adamantcrystal", "lustrousglobe"]),
  );

  // Gen 7 does not list Dialga-Origin, so its item stays out
  store.currentTeam.generation = 7;
  expect(store.gamePokemon).not.toContain("dialgaorigin");
  expect(store.teamItems).not.toContain("adamantcrystal");
});
