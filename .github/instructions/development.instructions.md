---
applyTo: "**"
---

Only add comments if the code itself is not self-explanatory enough or as a header comment.

After making any file changes, YOU MUST make sure that `npm run build` and `npm test --tests/e2e/casual-team.spec.js --project="Mobile Chrome" && npm test` still passes, this is to prevent regressions. If you run into a couple of failed tests from `npm test`, it could be due to flakiness. Just run those tests individually, and if they pass, then good.
