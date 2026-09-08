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
- State management: MobX with mobx-react.
- Virtualized lists: react-window.
- Browser testing: Playwright.

See [package.json](package.json) for dependency versions and the exact script definitions.

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

This update is run manually when new data is needed.

## Testing

After setting up the project, install the Playwright browsers and run all checks:

```sh
npx playwright install --with-deps chromium webkit
npm test
```

`npm test` checks the application and test types, builds and smoke-tests the production app, then runs the development tests. Both suites use all four Playwright browser profiles. Playwright starts and stops the servers automatically. `npm run build` runs Vite alone, so use `npm test` for the full set of checks.

`npm run test:dev` runs only the development tests, using Vite on port 3000. Pass Playwright options to this command to narrow the run, for example `npm run test:dev -- --project="Desktop Chrome"`.

`npm run test:smoke` creates a fresh production build in `build/` and serves it with Vite preview on port 4173. These quick checks confirm the homepage and a bundled image load, selected Pokemon and ability survive reloading, and a saved team link restores its Pokemon, ability, item, and move. External requests are blocked to keep the checks independent of third-party services, and uncaught browser errors fail the tests. Keep port 4173 free, even when testing locally. The smoke tests do not deploy the site or check Vercel's hosting configuration.

`npm run typecheck` checks the application and test types without running browser tests. The standalone `test:dev` and `test:smoke` commands do not run typechecking themselves.

### CI

The [CI workflow](.github/workflows/ci.yml) runs these checks on pull requests and manual dispatch only. It keeps typechecking, production smoke tests, and development tests as separate steps. CI uses `npm ci` to install the locked dependencies and keeps both suites' Playwright reports and available failure traces in the `playwright-results` artifact for seven days. Smoke reports and results use `playwright-smoke-report/` and `smoke-test-results/` so the development tests do not overwrite them. To use Playwright's CI settings locally, run `CI=true npm test` with ports 3000 and 4173 free.

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
