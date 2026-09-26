import viableMoves from "@/data/viable-moves";
import type { TeamPokemon } from "@/types";
import { pokemonAbilities } from "@/shared/pokedex";
import { getAutoSelectedItem } from "@/shared/team";

type Random = () => number;

export function pickRandom<T>(
  options: readonly T[],
  random: Random = Math.random,
): T | undefined {
  return options[Math.floor(random() * options.length)];
}

// A random pokemon from the options, preferring ones not already on the team
export function randomPokemon(
  options: readonly string[],
  taken: readonly string[],
  random: Random = Math.random,
) {
  const fresh = options.filter(pokemon => !taken.includes(pokemon));
  return pickRandom(fresh.length ? fresh : options, random) ?? "";
}

// A random set: one of its abilities, its required item, and four different
// moves, drawn from its viable moves when it has enough of them
export function randomSet(
  pokemon: string,
  learnset: readonly string[],
  random: Random = Math.random,
): TeamPokemon {
  const viable = learnset.filter(move => viableMoves.has(move));
  const pool = [...(viable.length >= 4 ? viable : learnset)];
  const moves: string[] = [];
  while (moves.length < 4 && pool.length) {
    const move = pickRandom(pool, random) ?? "";
    pool.splice(pool.indexOf(move), 1);
    moves.push(move);
  }
  return {
    name: pokemon,
    item: getAutoSelectedItem(pokemon, ""),
    ability: pickRandom(pokemonAbilities(pokemon), random) ?? "",
    move1: moves[0] ?? "",
    move2: moves[1] ?? "",
    move3: moves[2] ?? "",
    move4: moves[3] ?? "",
  };
}
