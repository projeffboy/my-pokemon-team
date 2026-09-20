# About the Project

React/Vite Pokemon teambuilder web app. It is a single-page app with no backend, hosted on Vercel. Merging to `master` deploys to production.

See [README.md](README.md) for setup and the test commands, and [package.json](package.json) for current command definitions and dependency versions.

## Architecture

State is managed via a single MobX store (`src/store.ts`, `makeAutoObservable` + `enforceActions: "never"`); components mutate it directly. Its computed getters delegate to pure functions in `src/store/` (learnsets, coverage, filtering, effectiveness), which take explicit inputs and never import the store or MobX. Components may also call these functions directly, as the team stats tooltips do. `src/shared/` holds helpers needed by both the store and the app (name lookups, empty teams, auto-selected items).

`src/data/` is generated from Pokemon Showdown by `npm run update:data`. To change it, edit `scripts/update-data.mjs` and rerun it instead of editing the files by hand.

## Testing

While iterating, run the narrowest check that covers your change, such as `npm run test:logic -- learnsets` or `npm run test:dev -- --project="Desktop Chrome" team-checklist`. Before finishing, run the full `npm test` once. For documentation-only changes `npm run lint` is enough, since Prettier also checks Markdown. Fix failures before finishing; if you cannot resolve them, report the remaining failures.

`test:dev` reuses whatever is already serving port 3000, so make sure that is this checkout's dev server and not another worktree's.

Rule tests (effectiveness, learnsets, filtering, parsing) go in `tests/logic/`, and UI wiring tests go in the browser suites; see [logic-tests.md](tests/logic/logic-tests.md).

In the browser suites, a unit test exercises one UI group, such as Team Defence, and an integration test exercises several, such as Team Defence and the pokemon inputs. Snackbars do not count as a separate group.

Browser tests import `test` and `expect` from `"fixtures"`, which opens the site before each test, and page helpers such as `selectPokemon` from `"helper"`. Both are path aliases in `tests/tsconfig.json`. The smoke suite is the exception: it imports `test` from `@playwright/test`, because it has to block external requests before it opens the site.

When choosing example pokemon for a test, try to choose pokemon that haven't been selected for other tests, so the tests cover more of the data.

## File Structure Conventions

### App

Inside `src/`, `App.tsx` and `app/` mirror the component tree, so a file's path tells you who renders it. Four rules (rule 3 overrules rules 1-2):

1. A file that has children gets a sibling folder named after it in kebab-case, holding only those children. `TeamStats.tsx` owns `team-stats/`.
2. Imports point down: `./child-folder/Thing`. Siblings cannot be imported, except that files in the same `shared/` folder may import each other.
3. When more than one file needs the same thing, it moves to a `shared/` folder at their nearest common ancestor. That includes a parent and its own children: `PokemonTeam.tsx` and both team viewers render `PokemonInputs`, so it lives in `pokemon-team/shared/`.
4. If an import cannot be reached with `./` or a single `../`, use the `@` alias (`@/*` maps to `src/*`). No `../../` (ESLint enforces this).

### Tests

`tests/component/` mirrors `src/app/`, with one exception: every tested component gets a kebab-case folder, even if it has no children in `src`. So `src/app/main/more-info/TeamChecklist.tsx` is tested in `tests/component/main/more-info/team-checklist/`, holding `unit-tests.spec.ts` and/or `integration-tests.spec.ts`. When a folder needs more than one file of the same kind, prepend a descriptive name (e.g. `team-defence-unit-tests.spec.ts`). Tests spanning siblings live in their nearest common ancestor folder.

Whole-team user flows live in `tests/e2e/`.

Production smoke tests live in `tests/smoke/`. Keep them focused on essential user flows against the production build. Block external requests and fail on uncaught browser errors.

## General Coding Conventions

Aim to write concise code without sacrificing readability/maintainability.
Do not add comments unless you think it is necessary or very helpful. Make them concise.

`noUncheckedIndexedAccess` is on for `src/`: handle a missing indexed value explicitly rather than with a `!` assertion.

## Styling Conventions

Do not use `!important` in any styles, whether in `sx`, `style`, or CSS, unless there is no other way.

When inside the `sx` prop, use MUI's syntax. For example, `p: 1` instead of `padding: "8px"`.

Support both colour schemes: use theme palette values, or `theme.applyStyles("dark", ...)` when a colour must differ.

For responsive styling, use MUI's breakpoint objects, such as `sx={{ px: { xs: 0, md: 1 } }}`. When logic needs the breakpoint, use the hooks in `src/app/shared/WidthContext.tsx` instead of calling `useMediaQuery`.

## Images

Host images statically with the site, except for sprites and icons from Smogon / Pokemon Showdown, which may use their external URLs.

Images that the code imports go in `src/images/`: Vite gives them hashed filenames, ships only the ones that are imported, and fails the build if one is missing. `public/` is only for files that something outside the bundle fetches by a fixed URL, such as the favicon, `robots.txt`, and the link-preview screenshot named in `index.html`. `vercel.json` caches every image for a year as immutable, so when replacing a `public/` image, give it a new filename.

Keep source documentation for downloaded images in a `*-sources.md` file beside them, like `src/images/type-chart-sources.md`.

## Share Links

The address bar always holds the current team as `?team=`, the base64url encoding of its Showdown team text (`src/app/TeamLinkSync.tsx`, `src/app/shared/team-link.ts`, `src/app/shared/team-text.ts`). Players bookmark and post these links, so every link made so far must keep loading the same team. Do not rename the `team` parameter, change the encoding, or make `parseTeamText` reject text it accepts today. If the format has to change, keep decoding the old one as well.

The text holds display names, which are matched exactly. When a data update renames or removes a pokemon, item, or move, old links silently lose that entry, so mention such renames when you see them.

## Update Log

`src/app/footer/UpdateLog.tsx` is for changes players notice, such as "added Regulation M-C pokemon" or "Meganium can now learn Dazzling Gleam". Add an entry for those, newest first; never for refactors, tooling, or other code-only changes.

## Ads

`src/app/RAMP.ts` is the Playwire ad integration, which earns the site's revenue to pay for its maintenance and upkeep. Only change it for a clear efficiency gain, and put that change in its own commit so it can be reverted alone if revenue drops.

## Other

Ask me clarification questions if necessary in response to my prompt.
