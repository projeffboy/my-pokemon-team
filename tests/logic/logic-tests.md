# Logic tests

Run `npm run test:logic` to test pure rules, store integration, and parsing directly in Node. This suite uses Playwright's test runner without browser fixtures or a web server, and runs once instead of once per browser profile. It is included in `npm test` and CI.

- `effectiveness.spec.ts` covers type matchups, defensive abilities, and item modifiers.
- `learnsets.spec.ts` covers evolution and forme inheritance, regional exclusions, Hidden Power variants, and invalid inputs.
- `special-moves.spec.ts` covers move type changes, Freeze-Dry, Flying Press, and coverage eligibility.
- `checklist.spec.ts` covers the team checklist's rules: hazards, removal, recovery, Wish with Protect, status, clerics, phazers, boosting, pivot moves, and choice items.
- `coverage.spec.ts` covers team defence scores, STAB, duplicate moves, and input immutability.
- `filtering.spec.ts` covers formats, tiers, regions, types, abilities, generations, and combined filters.
- `sorting.spec.ts` covers the Name dropdown's sort orders: name, pokedex number, format, base stats, and tie-breaking.
- `random.spec.ts` covers random pokemon and set choices.
- `matrix.spec.ts` covers the Matrix Analysis cells and their reasons.
- `validation.spec.ts` covers the Name and Format dialog's team check: legality, abilities, required items, repeated moves, EVs, levels, tera types, and clauses.
- `pokedex.spec.ts` checks inherited cosmetic-form data and distinct battle formes.
- `store-integration.spec.ts` checks that MobX recomputes results after team and filter edits.
- `select-pokemon.spec.ts` checks that choosing a pokemon in a slot resets it, auto-selects its only item and ability, and leaves the other slots alone.
- `auto-select-item.spec.ts` covers required items for megas, primals, and item-dependent formes.
- `parsing.spec.ts` covers Showdown text, nicknames, invalid entries, team and move limits, serialization, URL encoding, and atomic team replacement.
- `set-details.spec.ts` covers the set details in Showdown text (nickname, gender, level, shiny, tera type, EVs, nature, IVs) and backups with several teams.
- `teams.spec.ts` checks the store's saved teams, slot tools, and undo history.
- `teams-storage.spec.ts` covers loading and saving the teams from localStorage, including malformed data.
- `update-data.spec.ts` covers the data update's pure transforms in `scripts/update-data/transforms.ts`: field projections, cosmetic formes, champions legality, learnset merging, viable moves, the type chart, rename reports, and the rendered file format.
- `update-translations.spec.ts` covers the translation update's pure transforms in `scripts/update-translations/transforms.ts`: CSV parsing, species and forme names, the mega and regional templates, Hidden Power, Z-Move and Z-Crystal suffixes, abilities with a detail, duplicate names, the report, and the rendered file format.
- `translations.spec.ts` covers the language detection, the English fallback of translated names, name sorting by species in another language, translated matrix reasons and team problems, every language having English's message keys, and the store loading a language and saving the choice.

Rule tests import functions from `src/store/` and use plain team objects. They need no MobX store or reset fixture. Tests use the bundled Pokemon data and explicit expected results.

Team parsing tests call `parseTeamText` and check the returned team directly. For store integration, serialization, and URL imports, import `test` and `expect` from `./fixtures` and request the `store` fixture. It resets the singleton's teams, filters, and sort order before and after each test.

Keep browser tests in `tests/component`, `tests/e2e`, and `tests/smoke` for UI wiring, including selection controls, scores, tooltips, import dialogs, and share links.
