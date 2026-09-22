import store from "@/store";
import { pokemonName } from "@/shared/names";

export default function getPokemonLabel(teamIndex: number) {
  const pokemon = store.team[teamIndex]?.name ?? "";
  return `Pokemon ${teamIndex + 1} (${pokemonName(pokemon) || "empty"})`;
}
