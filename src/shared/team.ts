import pokedex from "@/data/pokedex";
import type {
  Generation,
  SavedTeam,
  SearchFilters,
  Team,
  TeamPokemon,
} from "@/types";
import { itemNameInverse } from "./names";
import { pokemonAbilities } from "./pokedex";
import { LATEST_GENERATION } from "./generations";
import { CHAMPIONS_FORMAT, CHAMPIONS_GENERATION } from "./formats";

export const DEFAULT_TEAM_SETTINGS = {
  generation: CHAMPIONS_GENERATION,
  format: CHAMPIONS_FORMAT,
};

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

export const createSearchFilters = (): SearchFilters => ({
  type: "",
  region: "",
  ability: "",
  moves: "",
});

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
    filters: { ...createSearchFilters(), ...settings.filters },
  };
}

// What a required item replaced: Giratina-Origin held the Griseous Orb before Gen 9
const EARLIER_REQUIRED_ITEMS: Record<string, string> = {
  griseouscore: "griseousorb",
};

// E.g. Blastoisinite for Blastoise-Mega, or Zap Plate (listed before Electrium Z) for Arceus-Electric.
// Given the team's game, it is the first of them that game has.
export function getAutoSelectedItem(
  pokemon: string,
  pokemonItem: string,
  isAvailable?: (item: string) => boolean,
): string {
  const { requiredItem, requiredItems = [] } = pokedex[pokemon] ?? {};
  const items = [requiredItem, ...requiredItems]
    .map(name => (name && itemNameInverse(name)) || "")
    .flatMap(item => [item, EARLIER_REQUIRED_ITEMS[item] ?? ""])
    .filter(item => item);

  return (isAvailable && items.find(isAvailable)) || items[0] || pokemonItem;
}

// E.g. Thick Fat for Venusaur-Mega, its only ability
export function getAutoSelectedAbility(
  pokemon: string,
  generation: Generation = LATEST_GENERATION,
): string {
  const abilities = pokemonAbilities(pokemon, generation);
  return abilities.length === 1 ? (abilities[0] ?? "") : "";
}
