# About the Project

React/Vite Pokemon teambuilder web app. It is a single-page app with no backend, hosted on Vercel.

See [README.md](README.md) for setup and the test commands, and [package.json](package.json) for current command definitions and dependency versions.

## Architecture

State is managed via a single MobX store (`src/store.ts`, `makeAutoObservable` + `enforceActions: "never"`); components mutate it directly. Its computed getters delegate to pure functions in `src/store/` (learnsets, coverage, filtering, effectiveness), which take explicit inputs and never import the store or MobX. Code used by both the store and the app lives in `src/shared/`.

`src/data/` is generated from Pokemon Showdown by `npm run update:data`. To change it, edit `scripts/update-data.mjs` and rerun it instead of editing the files by hand. The exception is `viable-moves.ts`, which is hand-maintained.

## Testing

After changing development files, run `npm test`. Fix failures before finishing; if you cannot resolve them, report the remaining failures.

`test:dev` reuses whatever is already serving port 3000, so make sure that is this checkout's dev server and not another worktree's.

Test rules (effectiveness, learnsets, filtering, parsing) in `tests/logic/` and UI wiring in the browser suites; see [logic-tests.md](tests/logic/logic-tests.md).

When choosing example pokemon(s) for your test, try to choose pokemon that haven't been selected for other tests, so the tests cover more of the data.

## File Structure Conventions

### App

Inside `src/`, `App.tsx` and `app/` mirror the component tree, so a file's path tells you who renders it. Four rules (rule 3 overrules rules 1-2):

1. A file that has children gets a sibling folder named after it in kebab-case, holding only those children. `TeamStats.tsx` owns `team-stats/`.
2. Imports point down: `./child-folder/Thing`. Siblings cannot be imported.
3. When two siblings or cousins need the same thing, it moves to a `shared/` folder at their nearest common ancestor.
4. If an import cannot be reached with `./` or a single `../`, use the `@` alias (`@/*` maps to `src/*`). No `../../` (ESLint enforces this).

### Tests

`tests/component/` mirrors `src/app/`, with one exception: every tested component gets a kebab-case folder, even if it has no children in `src`. So `src/app/main/more-info/TeamChecklist.tsx` is tested in `tests/component/main/more-info/team-checklist/`, holding `unit-tests.spec.ts` and/or `integration-tests.spec.ts`. When a folder needs more than one file of the same kind, prepend a descriptive name (e.g. `team-defence-unit-tests.spec.ts`). Tests spanning siblings live in their nearest common ancestor folder.

Whole-team user flows live in `tests/e2e/`.

Production smoke tests live in `tests/smoke/`. Keep them focused on essential user flows against the production build. Block external requests and fail on uncaught browser errors.

## General Coding Conventions

Aim to write concise code without sacrificing readability/maintainability.
Do not add comments unless you think it is necessary or very helpful. Make them concise.

New modules should handle missing indexed values explicitly; add them to `tsconfig.checked.json`, which enables `noUncheckedIndexedAccess`.

## Styling Conventions

For CSS, do not use `!important` unless there is no other way.

When inside the `sx` prop, use their syntax. For example, `p: 1` instead of `padding: "8px"`.

Support both colour schemes: use theme palette values, or `theme.applyStyles("dark", ...)` when a colour must differ.

For breakpoints, use the hooks in `src/app/shared/WidthContext.tsx` instead of calling `useMediaQuery`.

## Images

Host images statically with the site, except for sprites and icons from Smogon / Pokemon Showdown, which may use their external URLs. Keep source documentation for downloaded images.

## Update Log

`src/app/footer/UpdateLog.tsx` is for changes players notice, such as "added Regulation M-C pokemon" or "Meganium can now learn Dazzling Gleam". Add an entry for those; never for refactors, tooling, or other code-only changes.

## Ads

`src/app/RAMP.ts` is the Playwire ad integration, which earns the site's revenue to pay for its maintenance and upkeep. Only change it for a clear efficiency gain, and put that change in its own commit so it can be reverted alone if revenue drops.

## Other

Ask me clarification questions if necessary in response to my prompt.
