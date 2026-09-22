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

  store.selectPokemon(1, "bronzong");
  expect(member).toMatchObject({ name: "bronzong", item: "", ability: "" });
});

test("selecting a pokemon leaves the other slots alone", ({ store }) => {
  const other = store.team[3];
  other.name = "pidgeotmega";
  other.item = "leftovers";
  other.ability = "";

  store.selectPokemon(0, "sceptilemega");
  expect(other).toMatchObject({ item: "leftovers", ability: "" });
});
