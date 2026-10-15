import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";

const folder = "src/images/sprite-animations";

test("no bundled animation is a copy of another pokemon's in the same folder", () => {
  const manifest: Record<string, { file: string }> = JSON.parse(
    readFileSync(`${folder}/manifest.json`, "utf8"),
  );
  const owners = new Map<string, string>();
  const copies: string[] = [];
  for (const [key, { file }] of Object.entries(manifest)) {
    const hash = createHash("sha256")
      .update(readFileSync(`${folder}/${file}`))
      .digest("hex");
    const id = `${key.split("/")[0]}:${hash}`;
    const owner = owners.get(id);
    if (owner) copies.push(`${key} = ${owner}`);
    else owners.set(id, key);
  }
  expect(copies).toEqual([]);
});
