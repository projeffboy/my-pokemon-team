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
import { gameFormat } from "./formats";
import { COMBINED_GENERATIONS_PROFILE } from "./generation-profile";

export const DEFAULT_TEAM_SETTINGS = {
  generation: 9 as const,
  generationProfile: COMBINED_GENERATIONS_PROFILE,
  format: "",
} as const;

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
  const team = {
    id: newTeamId(),
    name: "",
    generation: LATEST_GENERATION as Generation,
    format: "",
    team: createEmptyTeam(),
    ...settings,
    filters: { ...createSearchFilters(), ...settings.filters },
  };
  if (team.generation !== 9 || gameFormat(team.format))
    delete team.generationProfile;
  return team;
}

// What a required item replaced: Giratina-Origin held the Griseous Orb before Gen 9
const EARLIER_REQUIRED_ITEMS: Record<string, string> = {
  griseouscore: "griseousorb",
};

// Each required item with the item it replaced, e.g. [griseouscore, griseousorb]
function requiredItemGroups(pokemon: string): string[][] {
  const { requiredItem, requiredItems = [] } = pokedex[pokemon] ?? {};
  return [requiredItem, ...requiredItems]
    .map(name => (name && itemNameInverse(name)) || "")
    .filter(item => item)
    .map(item => {
      const earlier = EARLIER_REQUIRED_ITEMS[item];
      return earlier ? [item, earlier] : [item];
    });
}

// E.g. Blastoisinite for Blastoise-Mega, or Zap Plate (listed before Electrium Z) for Arceus-Electric.
// Given the team's game, it is the first of them that game has.
export function getAutoSelectedItem(
  pokemon: string,
  pokemonItem: string,
  isAvailable?: (item: string) => boolean,
): string {
  const items = requiredItemGroups(pokemon).flat();

  return (isAvailable && items.find(isAvailable)) || items[0] || pokemonItem;
}

// The item to hold instead when a game needs another version of a required item,
// e.g. the Griseous Orb for a Griseous Core Giratina-Origin moved to Gen 4
export function requiredItemReplacement(
  pokemon: string,
  item: string,
  isAvailable: (item: string) => boolean,
): string | undefined {
  const group = requiredItemGroups(pokemon).find(group => group.includes(item));
  if (!group || group.find(isAvailable) === item) return undefined;
  const replacement = getAutoSelectedItem(pokemon, "", isAvailable);
  return replacement !== item && isAvailable(replacement) ?
      replacement
    : undefined;
}

// E.g. Thick Fat for Venusaur-Mega, its only ability
export function getAutoSelectedAbility(
  pokemon: string,
  generation: Generation = LATEST_GENERATION,
  format = "",
): string {
  const abilities = pokemonAbilities(pokemon, generation, format);
  return abilities.length === 1 ? (abilities[0] ?? "") : "";
}
