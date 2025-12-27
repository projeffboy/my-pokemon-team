---
applyTo: "**"
---

This is a Vite + React + React Compiler + Rolldown + TS project

Only add comments, if the code itself is not self-explanatory enough, or as a header comment.

After making any file changes, YOU MUST make sure that `npm run build` and `npm test --tests/e2e/casual-team.spec.js --project="Mobile Chrome" && npm test` still passes, this is to prevent regressions. If you run into a couple of failed tests from `npm test`, it could be due to flakiness. Just run those tests individually, and if they pass, then good.

## Use the mui-mcp server to answer any MUI questions --

- 1. call the "useMuiDocs" tool to fetch the docs of the package relevant in the question
- 2. call the "fetchDocs" tool to fetch any additional docs if needed using ONLY the URLs present in the returned content.
- 3. repeat steps 1-2 until you have fetched all relevant docs for the given question
- 4. use the fetched content to answer the question
