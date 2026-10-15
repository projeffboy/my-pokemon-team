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

test("picking the slot's own pokemon again keeps its set", ({ store }) => {
  store.selectPokemon(0, "gardevoir");
  const member = store.team[0]!;
  Object.assign(member, {
    move1: "moonblast",
    item: "choicescarf",
    ability: "Trace",
    nickname: "Gigi",
  });
  const before = JSON.stringify(member);
  store.selectPokemon(0, "gardevoir");
  expect(JSON.stringify(member)).toBe(before);
});
