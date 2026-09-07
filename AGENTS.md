# About the Project

Pokemon teambuilder web app.

## Tech Stack

- Frontend framework: React 19
- Build tool: Vite 7
- Type checking: TypeScript 5.8
- UI library: Material UI (MUI) 7
- State management: MobX 6 + mobx-react
- Testing: Playwright
- More:
  - Virtualized lists: react-window

Production: Website is hosted on https://mypokemonteam.com using Vercel
Development: `npm start` starts the website at `localhost:3000`.

This is a single page application (SPA).

There is no backend, all the data comes from static local files in `/src/data`, which is taken from Pokemon Showdown with `npm run update:data`. This command is manually run periodically to update the data.

For more info, check `/package.json`

## Scripts

According to `/package.json`:

```jsonc
  "scripts": {
    "start": "vite",
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "update:data": "node scripts/update-data.mjs", // update data files
    "test": "playwright test",
    "test:update-snapshots": "playwright test tests/snapshot/snapshot-tests.spec.ts --update-snapshots", // update snapshots
    "typecheck": "tsc --noEmit && tsc --noEmit -p tests/tsconfig.json"
  },
```

## Testing

### Executing Tests

Testing is very important, because it checks for regressions when changing development files.
Test commands: `npm run typecheck && npm test`. If you are modifying UI, run `npm run test:update-snapshots` first.

When changing development files:

1. Before editing anything, run the tests first. If it fails, abort. Otherwise, we cannot confirm if any regressions found in step 2 are caused by you.
2. After you complete your task, you MUST run the tests. If the tests fail, either figure out what you did wrong to cause the regressions, or give up and let me know.

### Writing Tests

When choosing example pokemon(s) for your test, try to choose pokemon that haven't been selected for other tests.

## File Structure Conventions

### App

Inside `src/`, `App.tsx` and `app/` mirror the component tree, so a file's path tells you who renders it. Four rules (rule 3 overrules rules 1-2):

1. A file that has children gets a sibling folder named after it in kebab-case, holding only those children. `TeamStats.tsx` owns `team-stats/`.
2. Imports point down: `./child-folder/Thing`. Siblings cannot be imported.
3. When two siblings or cousins need the same thing, it moves to a `shared/` folder at their nearest common ancestor.
4. If an import cannot be reached with `./` or a single `../`, use the `@` alias (`@/*` maps to `src/*`). No `../../`.

### Tests

`tests/component/` mirrors `src/app/`, with one exception: every tested component gets a kebab-case folder, even if it has no children in `src`. So `src/app/main/more-info/TeamChecklist.tsx` is tested in `tests/component/main/more-info/team-checklist/`, holding `unit-tests.spec.ts` and/or `integration-tests.spec.ts`. When a folder needs more than one file of the same kind, prepend a descriptive name (e.g. `team-defence-unit-tests.spec.ts`). Tests spanning siblings live in their nearest common ancestor folder.

## General Coding Conventions

Aim to write concise code without sacrificing readability/maintainability.
Do not add comments unless you think it is necessary or very helpful. Make them concise.

State is managed via a single MobX store (src/store.ts, `makeAutoObservable` + `enforceActions: "never"`); components mutate it directly.

## Styling Conventions

For CSS, do not use `!important` unless there is no other way.

Make sure to use MUI best practices when making UI related code changes.
When inside the `sx` prop, use their syntax. For example, `p: 1` instead of `padding: 4px`.

## Other

Ask me clarification questions if necessary in response to my prompt.

Don't touch `RAMP.ts` or code related to it.
