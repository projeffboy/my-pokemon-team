import type { Team, TeamPokemon } from "@/types";

export function createTeam(...members: Partial<TeamPokemon>[]): Team {
  return Array.from({ length: 6 }, (_, i): TeamPokemon => ({
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
