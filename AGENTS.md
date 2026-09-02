# About the Project

Pokemon teambuilder web app.

# Tech Stack

- Frontend framework: React 19
- Build tool: Vite 7
- Type checking: TypeScript 5.8
- UI library: Material UI (MUI) 7
- State management: MobX 6 + mobx-react
- Testing: Playwright
- More:
  - Virtualized lists: react-window

There is no backend, all the data comes from static local files in `/src/data`, which is taken from Pokemon Showdown with `npm run update:data`. This command is manually run periodically to update the data.

For more info, check `/package.json`

# Testing

Testing is very important, because it checks for regressions when changing development files.
Test commands: `npm run typecheck && npm test`. If you are modifying UI, run `npm run test:update-snapshots` first.

When changing development files:

1. Before editing anything, run the tests first. If it fails, abort. Otherwise, we cannot confirm if any regressions found in step 2 are caused by you.
2. After you complete your task, you MUST run the tests. If the tests fail, either figure out what you did wrong to cause the regressions, or give up and let me know.

# General Coding Conventions

Aim to write concise code without sacrificing readability/maintainability.
Do not add comments unless you think it is necessary or very helpful. Make them concise.

Make sure to use MUI best practices when making UI related code changes.
When inside the `sx` prop, use their syntax if possible, so `p: 1` instead of `padding: 4px`.
For CSS, do not use `!important` unless there is no other way.

State is managed via a single MobX store (src/store.ts, `makeAutoObservable` + `enforceActions: "never"`); components mutate it directly.

# Other

`npm start` starts the website at `localhost:3000`.

Ask me clarification questions if necessary in response to my prompt.
