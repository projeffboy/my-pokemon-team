import path from "node:path";
import { fileURLToPath } from "node:url";
import type { FormatBans } from "../../src/types.ts";
import { GENERATIONS } from "../../src/shared/generations.ts";
import { projectFormatBans, type ShowdownEntry } from "./transforms.ts";
import { typeScriptRequire } from "./typescript-require.ts";

interface Format {
  exists: boolean;
}
type Entries = { all: () => ShowdownEntry[] };
interface Dex {
  formats: {
    get: (id: string) => Format;
    getRuleTable: (format: Format) => Map<string, string>;
  };
  forFormat: (format: Format) => {
    gen: number;
    abilities: Entries;
    items: Entries;
    moves: Entries;
  };
}

// Each Smogon tier's bans in every generation the Format filter offers it,
// from the rule tables that Showdown's own team validator reads
export function formatBansData(showdownRoot: string): FormatBans {
  const { require, restore } = typeScriptRequire();
  try {
    const { Dex: dex } = require(path.join(showdownRoot, "sim/dex.ts")) as {
      Dex: Dex;
    };
    // Its imports have no file extensions, which only `require` resolves here
    const { TIER_BY_FORMAT, formatsForGeneration, showdownFormatId } = require(
      fileURLToPath(new URL("../../src/shared/formats.ts", import.meta.url)),
    ) as typeof import("../../src/shared/formats.ts");
    const data: FormatBans = {};
    for (const generation of [...GENERATIONS].reverse()) {
      for (const tier of formatsForGeneration(generation)) {
        if (!(tier in TIER_BY_FORMAT)) continue;
        const id = showdownFormatId(generation, tier);
        const format = dex.formats.get(id);
        if (!format.exists) {
          console.warn(`Showdown has no ${id} format, so it has no bans.`);
          continue;
        }
        const formatDex = dex.forFormat(format);
        const table = (kind: "abilities" | "items" | "moves") =>
          Object.fromEntries(
            formatDex[kind].all().map(entry => [String(entry.id), entry]),
          );
        data[id] = projectFormatBans({
          gen: formatDex.gen,
          rules: [...dex.formats.getRuleTable(format).keys()],
          abilities: table("abilities"),
          items: table("items"),
          moves: table("moves"),
        });
      }
    }
    return data;
  } finally {
    restore();
  }
}
