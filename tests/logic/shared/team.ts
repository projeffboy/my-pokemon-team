import type { TeamPokemonProperties } from "@/types";

export function createTeam(...members: Partial<TeamPokemonProperties>[]) {
  return Array.from({ length: 6 }, (_, i): TeamPokemonProperties => ({
    name: "",
    item: "",
    ability: "",
    move1: "",
    move2: "",
    move3: "",
    move4: "",
    ...members[i],
  }));
}
