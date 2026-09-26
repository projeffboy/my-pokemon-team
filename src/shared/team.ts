import pokedex from "@/data/pokedex";
import type { Generation, SavedTeam, Team, TeamPokemon } from "@/types";
import { itemNameInverse } from "./names";
import { pokemonAbilities } from "./pokedex";
import { LATEST_GENERATION } from "./generations";

export function createEmptyTeam(): Team {
  return Array.from({ length: 6 }, (): TeamPokemon => ({
    name: "",
    item: "",
    ability: "",
    move1: "",
    move2: "",
    move3: "",
    move4: "",
  }));
}

export const isTeamEmpty = (team: readonly Readonly<TeamPokemon>[]) =>
  !team.some(({ name }) => name);

const newTeamId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ?
    crypto.randomUUID()
  : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function createSavedTeam(
  settings: Partial<Omit<SavedTeam, "id">> = {},
): SavedTeam {
  return {
    id: newTeamId(),
    name: "",
    generation: LATEST_GENERATION as Generation,
    format: "",
    team: createEmptyTeam(),
    ...settings,
  };
}

// E.g. Blastoisinite for Blastoise-Mega, or Zap Plate (listed before Electrium Z) for Arceus-Electric
export function getAutoSelectedItem(
  pokemon: string,
  pokemonItem: string,
): string {
  const { requiredItem, requiredItems } = pokedex[pokemon] ?? {};
  const itemName = requiredItem ?? requiredItems?.[0];

  return (itemName && itemNameInverse(itemName)) || pokemonItem;
}

// E.g. Thick Fat for Venusaur-Mega, its only ability
export function getAutoSelectedAbility(pokemon: string): string {
  const abilities = pokemonAbilities(pokemon);
  return abilities.length === 1 ? (abilities[0] ?? "") : "";
}
