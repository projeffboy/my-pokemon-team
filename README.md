# [My Pokemon Team](https://mypokemonteam.com)

### All purpose Pokemon Teambuilder at [mypokemonteam.com](https://mypokemonteam.com)

![My Pokemon Team Screenshot](src/images/mypokemonteam-screenshot.PNG)

## What makes this teambuilder special?

1. You can import/export your team to Pokemon Showdown
2. It's very accurate, it takes into account special abilities (Levitate, Thick Fat, Filter, Sap Sipper, Aerilate, Wonder Guard, etc.) and moves (Freeze Dry, Flying Press, Seismic Toss, Judgment, etc.)
3. There's a team checklist.
4. The sprites are animated, which is nice

## Architecture

This is a single-page application with no backend. Pokemon data comes from local files in [src/data](src/data), sourced from Pokemon Showdown. The production site is hosted on Vercel at [mypokemonteam.com](https://mypokemonteam.com).

- UI: React and Material UI (MUI).
- Build and typechecking: Vite and TypeScript.
- Linting and formatting: ESLint and Prettier.
- State management: MobX with mobx-react.
- Virtualized lists: react-window.
- Browser testing: Playwright.
- Direct rule testing: Playwright's test runner in Node, without a browser.

See [package.json](package.json) for dependency versions and the exact script definitions.

The single [MobX store](src/store.ts) owns team edits, search filter selections, and snackbar state. Its computed getters delegate to pure functions in [learnsets](src/store/learnsets.ts), [team coverage and defence](src/store/coverage.ts), and [filtering](src/store/filtering.ts). Shared [effectiveness rules](src/store/shared/effectiveness.ts) calculate type matchups and special move types. These modules read the bundled data and explicit inputs without importing the store or MobX.

## Local development

Use Node 24, as specified in [.nvmrc](.nvmrc). With nvm installed, set up a fresh checkout and start the app with:

```sh
nvm install
nvm use
npm ci
npm start
```

The development server runs at [localhost:3000](http://localhost:3000). `npm run dev` starts the same server.

To build the production app into `build/` and preview it locally:

```sh
npm run build
npm run preview
```

Vite preview uses port 4173 by default. It serves the existing build, so rebuild after making changes.

## Updating Pokemon data

Refresh the Pokemon Showdown data in `src/data` with:

```sh
npm run update:data
```

This update is run manually when new data is needed. It reads the `pokemon-showdown` and `pokemon-showdown-client` repositories cloned next to this one; set `SHOWDOWN_ROOT` and `SHOWDOWN_CLIENT_ROOT` to use other locations.

Learnsets combine every generation with the games Showdown keeps in separate mods: Pokemon Champions, Legends: Z-A, Legends: Arceus, and BDSP. To include another game, add its mod to `learnsetMods` in `scripts/update-data.mjs`.

To keep the bundle small, the script only keeps the fields the app reads. To use another Showdown field, add it to `projections` in `scripts/update-data.mjs` and to the matching type in `src/types.ts`, then rerun the update. `src/data/viable-moves.ts` is a frozen list (Showdown no longer flags viable moves) and is not regenerated.

## Testing

After setting up the project, install the Playwright browsers and run all checks:

```sh
npx playwright install --with-deps chromium webkit
npm test
```

`npm test` checks the application and test types, lints, runs the direct logic tests, builds and smoke-tests the production app, then runs the development browser tests. Both browser suites use all four Playwright browser profiles. Playwright starts and stops the servers automatically. `npm run build` runs Vite alone, so use `npm test` for the full set of checks.

`npm run test:logic` runs [direct rule tests](tests/logic/logic-tests.md) once in Node without starting a browser or Vite. These cover effectiveness, learnset inheritance, special moves, filtering, team parsing, and MobX recomputation. Run a subset with, for example, `npm run test:logic -- learnsets`.

`npm run test:dev` runs only the development browser tests, using Vite on port 3000. These verify that the UI connects the rules to the controls and displayed results. Pass Playwright options to this command to narrow the run, for example `npm run test:dev -- --project="Desktop Chrome"`.

`npm run test:smoke` creates a fresh production build in `build/` and serves it with Vite preview on port 4173. These quick checks confirm the homepage and a bundled image load, selected Pokemon and ability survive reloading, and a saved team link restores its Pokemon, ability, item, and move. External requests are blocked to keep the checks independent of third-party services, and uncaught browser errors fail the tests. Keep port 4173 free, even when testing locally. The smoke tests do not deploy the site or check Vercel's hosting configuration.

`npm run typecheck` checks the application and test types without running tests. It also runs `tsconfig.checked.json`, which enables `noUncheckedIndexedAccess` for the store, calculation, and team parsing modules. Expand that config as additional modules handle missing indexed values explicitly. The standalone `test:logic`, `test:dev`, and `test:smoke` commands do not run typechecking themselves.

`npm run lint` runs ESLint and checks Prettier formatting; `npm run format` applies the formatting. Generated files in `src/data` are excluded from both.

### CI

The [CI workflow](.github/workflows/ci.yml) runs these checks on pull requests and manual dispatch only. It keeps typechecking, linting, logic tests, production smoke tests, and development browser tests as separate steps. CI uses `npm ci` to install the locked dependencies and keeps all suites' Playwright reports and available failure traces in the `playwright-results` artifact for seven days. Logic reports and results use `playwright-logic-report/` and `logic-test-results/`; smoke reports and results use `playwright-smoke-report/` and `smoke-test-results/`. To use Playwright's CI settings locally, run `CI=true npm test` with ports 3000 and 4173 free.

## Major Credits

- Nintendo, The Pokemon Company, Game Freak
- [Pokemon Showdown](https://pokemonshowdown.com/): animated sprites, non-animated sprites, and all the pokemon data (thanks Zarel!)
- [Typescript React framework](https://reactjs.org/)
- [Material UI](https://material-ui.com/)
- [MobX state management](https://mobx.js.org/)

## Minor Credits

- [Bulbapedia's Type Chart](https://bulbapedia.bulbagarden.net/wiki/Type)
- [Non-table Type Chart](https://pinterest.ca/pin/307159637067301004/)
- [Assigning each type a color](https://guiguilegui.wordpress.com/2016/05/23/pokemon-type-classifier-using-their-colors')
- [r/stunfisk](https://reddit.com/r/stunfisk)
