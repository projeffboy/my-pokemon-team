import store from "@/store";

export default function getPokemonLabel(teamIndex: number) {
  const pokemon = store.team[teamIndex].name;
  return `Pokemon ${teamIndex + 1} (${store.pkmnName(pokemon) || "empty"})`;
}
