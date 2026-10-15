import fs from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

// A `require` that compiles TypeScript in memory, so Showdown's simulator can run here.
// Call `restore` once done with what it loaded.
export function typeScriptRequire() {
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
  const restore = () => {
    if (previous) require.extensions[".ts"] = previous;
    else delete require.extensions[".ts"];
  };
  return { require, restore };
}
