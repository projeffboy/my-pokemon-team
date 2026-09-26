import store from "@/store";
import type { Translation } from "@/i18n/translation";

// E.g. "Pokemon 2 (Pikachu)" or "Pokemon 2 (empty)", for the slot tabs
export default function getPokemonLabel(
  teamIndex: number,
  { t, names }: Translation,
) {
  const pokemon = store.team[teamIndex]?.name ?? "";
  return t.team.slotWith(
    teamIndex + 1,
    pokemon ? names.pokemon(pokemon) : undefined,
  );
}
