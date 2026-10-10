import { MOVE_KEYS, type MoveKey, type TeamPokemon } from "@/types";

export const baseMoveId = (move: string) =>
  move.startsWith("hiddenpower") ? "hiddenpower" : move;

export const canSelectMove = (
  member: Readonly<TeamPokemon>,
  key: MoveKey,
  move: string,
) =>
  !move ||
  !MOVE_KEYS.some(
    other => other !== key && baseMoveId(member[other]) === baseMoveId(move),
  );
