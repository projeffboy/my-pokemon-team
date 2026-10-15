import items from "@/data/items";
import moves from "@/data/moves";
import pokedex from "@/data/pokedex";
import {
  MOVE_KEYS,
  type Generation,
  type MoveKey,
  type ReadonlyTeam,
  type TeamPokemon,
} from "@/types";
import {
  createEmptyTeam,
  getAutoSelectedAbility,
  getAutoSelectedItem,
} from "@/shared/team";
import { pokemonAbilities } from "@/shared/pokedex";
import { generationRules } from "@/shared/generation-rules";
import { isItemAvailable } from "./learnsets";

// An entry left out of a slot, with the text or ID it had. `pokemon` is the
// slot's pokemon, or "" when the pokemon itself was left out.
export interface DroppedEntry {
  teamIndex: number;
  pokemon: string;
  field: "pokemon" | "item" | "ability" | MoveKey;
  value: string;
}

// Every ability the pokemon has had in any generation
export const anyGenerationAbilities = (pokemon: string) =>
  Array.from({ length: 9 }, (_, i) =>
    pokemonAbilities(pokemon, (i + 1) as Generation),
  ).flat();

// The team without the pokemon, items, abilities, and moves that the game data
// no longer has, such as a move a data update renamed. As in a link, an item or
// ability left out is auto-selected again.
export function removeMissingEntries(
  team: ReadonlyTeam,
  generation: Generation,
  format = "",
) {
  const rules = generationRules(generation, format);
  const kept = createEmptyTeam();
  const dropped: DroppedEntry[] = [];
  team.forEach((member, teamIndex) => {
    const pokemon = member.name;
    if (pokemon && !pokedex[pokemon]) {
      dropped.push({
        teamIndex,
        pokemon: "",
        field: "pokemon",
        value: pokemon,
      });
      return;
    }
    const next: TeamPokemon = { ...member };
    kept[teamIndex] = next;
    if (!pokemon) return;
    const drop = (field: Exclude<DroppedEntry["field"], "pokemon">) =>
      dropped.push({ teamIndex, pokemon, field, value: member[field] });
    if (member.item && !items[member.item]) {
      drop("item");
      next.item =
        rules.items ?
          getAutoSelectedItem(pokemon, "", item =>
            isItemAvailable(item, generation, format),
          )
        : "";
    }
    if (
      member.ability &&
      member.ability !== "No Ability" &&
      !anyGenerationAbilities(pokemon).includes(member.ability)
    ) {
      drop("ability");
      next.ability =
        rules.abilities ?
          getAutoSelectedAbility(pokemon, generation, format)
        : "";
    }
    for (const key of MOVE_KEYS)
      if (member[key] && !moves[member[key]]) {
        drop(key);
        next[key] = "";
      }
  });
  return { team: kept, dropped };
}
