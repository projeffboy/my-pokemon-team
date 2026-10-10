import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pokedex from "../src/data/pokedex.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "src/images/sprite-animations");
const repository = "https://api.github.com/repos/PokeAPI/sprites";

async function read(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  return response;
}

function duration(data: Buffer) {
  let milliseconds = 0;
  if (data.subarray(0, 3).toString() === "GIF") {
    for (let i = 0; i < data.length - 7; i++) {
      if (data[i] === 0x21 && data[i + 1] === 0xf9 && data[i + 2] === 4)
        milliseconds += Math.max(20, data.readUInt16LE(i + 4) * 10);
    }
  } else {
    for (let i = 8; i < data.length - 12;) {
      const length = data.readUInt32BE(i);
      if (data.toString("ascii", i + 4, i + 8) === "fcTL") {
        const numerator = data.readUInt16BE(i + 28);
        const denominator = data.readUInt16BE(i + 30) || 100;
        milliseconds += Math.max(20, (numerator / denominator) * 1000);
      }
      i += length + 12;
    }
  }
  if (!milliseconds) throw new Error("Sprite has no animation frames");
  return Math.ceil(milliseconds);
}

const { sha } = (await (await read(`${repository}/commits/master`)).json()) as {
  sha: string;
};
const csv = await (
  await read(
    "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon.csv",
  )
).text();
const aliases: Record<string, string> = {
  deoxysnormal: "deoxys",
  wormadamplant: "wormadam",
  giratinaaltered: "giratina",
  shayminland: "shaymin",
};
const names = new Map(
  csv
    .trim()
    .split("\n")
    .slice(1)
    .map(row => {
      const [id = "", identifier = ""] = row.split(",");
      const name = identifier.replace(/[^a-z0-9]/g, "");
      return [id, aliases[name] ?? name];
    }),
);
const games = [
  [2, "generation-ii/crystal", "gif"],
  [3, "generation-iii/emerald", "png"],
  [4, "generation-iv/heartgold-soulsilver", "png"],
] as const;
const manifest: Record<string, { file: string; duration: number }> = {};
let bytes = 0;
for (const [generation, game, extension] of games) {
  for (const shiny of [false, true]) {
    const directory = `sprites/pokemon/versions/${game}/animated${shiny ? "/shiny" : ""}`;
    const files = (await (
      await read(`${repository}/contents/${directory}?ref=${sha}`)
    ).json()) as { name: string; type: string; download_url: string }[];
    const pending = files.filter(file => {
      const name = names.get(path.parse(file.name).name);
      return file.type === "file" && !!name && !!pokedex[name];
    });
    await fs.mkdir(path.join(output, `${generation}${shiny ? "-shiny" : ""}`), {
      recursive: true,
    });
    await Promise.all(
      Array.from({ length: 6 }, async () => {
        for (let file = pending.pop(); file; file = pending.pop()) {
          const name = names.get(path.parse(file.name).name);
          if (!name) continue;
          const key = `${generation}${shiny ? "-shiny" : ""}/${name}`;
          const filename = `${key}.${extension}`;
          const data = Buffer.from(
            await (await read(file.download_url)).arrayBuffer(),
          );
          manifest[key] = { file: filename, duration: duration(data) };
          await fs.writeFile(path.join(output, filename), data);
          bytes += data.length;
        }
      }),
    );
    console.log(
      `Downloaded Gen ${generation}${shiny ? " shiny" : ""} animations`,
    );
  }
}
const sorted = Object.fromEntries(
  Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)),
);
await fs.writeFile(
  path.join(output, "manifest.json"),
  `${JSON.stringify(sorted, null, 2)}\n`,
);
await fs.writeFile(path.join(output, "source-revision.txt"), `${sha}\n`);
console.log(`${Object.keys(manifest).length} animations, ${bytes} bytes`);
