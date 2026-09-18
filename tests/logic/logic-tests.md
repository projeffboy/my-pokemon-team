# Logic tests

Run `npm run test:logic` to test pure rules, store integration, and parsing directly in Node. This suite uses Playwright's test runner without browser fixtures or a web server, and runs once instead of once per browser profile. It is included in `npm test` and CI.

- `effectiveness.spec.ts` covers type matchups, defensive abilities, and item modifiers.
- `learnsets.spec.ts` covers evolution and forme inheritance, regional exclusions, Hidden Power variants, and invalid inputs.
- `special-moves.spec.ts` covers move type changes, Freeze-Dry, Flying Press, and coverage eligibility.
- `coverage.spec.ts` covers team defence scores, STAB, duplicate moves, and input immutability.
- `filtering.spec.ts` covers formats, tiers, regions, types, and combined filters.
- `store-integration.spec.ts` checks that MobX recomputes results after team and filter edits.
- `parsing.spec.ts` covers Showdown text, nicknames, invalid entries, team and move limits, serialization, and URL encoding.

Rule tests import functions from `src/store/` and use plain team objects. They need no MobX store or reset fixture. Tests use the bundled Pokemon data and explicit expected results.

For store integration and team parsing, import `test` and `expect` from `./fixtures` and request the `store` fixture. It resets the singleton's team and search filters before and after each test.

Keep browser tests in `tests/component`, `tests/e2e`, and `tests/smoke` for UI wiring, including selection controls, scores, tooltips, import dialogs, and share links.
