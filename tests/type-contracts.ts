import type {
  TeamPokemonProperties,
  MoveKey,
  PokemonType,
  Moves,
} from "@/types";
import { createTypeScores } from "@/store/coverage";
import { typeAgainstPokemon } from "@/store/shared/effectiveness";

export function checkTypeContracts(
  member: TeamPokemonProperties,
  moves: Moves,
  key: MoveKey,
) {
  member[key] = "surf";
  // @ts-expect-error Unknown team properties must not be writable.
  member.move5 = "surf";
  // @ts-expect-error Calculations require a standard Pokemon type.
  typeAgainstPokemon("Waterr", "lumineon");
  const type: PokemonType = "Water";
  const score: number = createTypeScores()[type];
  // @ts-expect-error Dataset lookups require a missing-entry check.
  const move: NonNullable<Moves[string]> = moves["unknown"];
  return { score, move };
}
