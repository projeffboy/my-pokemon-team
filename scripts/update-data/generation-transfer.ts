import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";
import type { GenerationTransferData } from "../../src/types.ts";

interface Entry {
  exists: boolean;
  gen: number;
  isNonstandard: string | null;
  abilities: Record<string, string>;
  requiredItem?: string;
}
interface Dex {
  gen: number;
  species: {
    get: (id: string) => Entry;
    getMovePool: (id: string) => Set<string>;
  };
  moves: { get: (id: string) => Entry };
  items: { get: (id: string) => Entry };
  abilities: { get: (id: string) => Entry };
  mod: (mod: string) => Dex;
}

// Compile Showdown's source in memory; its generation-aware dex supplies the move pools.
export function generationTransferData(
  showdownRoot: string,
  pokemonIds: string[],
  itemIds: string[],
): GenerationTransferData {
  const require = createRequire(import.meta.url);
  const previous = require.extensions[".ts"];
  require.extensions[".ts"] = (module, filename) => {
    const { outputText } = ts.transpileModule(
      fs.readFileSync(filename, "utf8"),
      {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2022,
        },
      },
    );
    (
      module as typeof module & {
        _compile: (code: string, filename: string) => void;
      }
    )._compile(outputText, filename);
  };
  try {
    const { Dex: dex } = require(path.join(showdownRoot, "sim/dex.ts")) as {
      Dex: Dex;
    };
    const data: GenerationTransferData = { pokemon: {}, items: {} };
    const targets = [
      ["gen1"],
      ["gen2"],
      ["gen3"],
      ["gen4"],
      ["gen5"],
      ["gen6"],
      ["gen7"],
      ["gen8", "gen8bdsp", "gen8legends"],
      ["gen9", "gen9legends"],
      ["champions"],
      ["gen8legends"],
      ["gen9legends"],
      ["gen7letsgo"],
    ];
    for (const [index, mods] of targets.entries()) {
      const bit = 2 ** index;
      for (const mod of mods) {
        const target = dex.mod(mod);
        const available = (entry: Entry) =>
          entry.exists && entry.gen <= target.gen && !entry.isNonstandard;
        if (target.gen > 1) {
          for (const id of itemIds) {
            if (available(target.items.get(id)))
              data.items[id] = (data.items[id] ?? 0) | bit;
          }
        }
        for (const id of pokemonIds) {
          const species = target.species.get(id);
          if (!available(species)) continue;
          // Z-A's stones inherit SV's Past/Future tags, although its Mega formes use them.
          if (mod === "gen9legends" && species.requiredItem) {
            const item = target.items.get(species.requiredItem);
            const id = species.requiredItem
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "");
            if (item.exists && item.gen <= target.gen)
              data.items[id] = (data.items[id] ?? 0) | bit;
          }
          const entry = (data.pokemon[id] ??= {
            generations: 0,
            moves: {},
            abilities: {},
          });
          entry.generations |= bit;
          if (target.gen >= 3) {
            for (const ability of Object.values(species.abilities)) {
              if (available(target.abilities.get(ability)))
                entry.abilities[ability] =
                  (entry.abilities[ability] ?? 0) | bit;
            }
          }
          for (const move of target.species.getMovePool(id)) {
            if (available(target.moves.get(move)))
              entry.moves[move] = (entry.moves[move] ?? 0) | bit;
          }
        }
      }
    }
    return data;
  } finally {
    if (previous) require.extensions[".ts"] = previous;
    else delete require.extensions[".ts"];
  }
}
