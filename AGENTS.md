# About the Project

Pokemon teambuilder web app.

Check package.json for the tech stack and commands like `npm start`.
After you complete your task, check for regressions with `npm test`. If your are editing the UI run `npm run test:update-snapshots` before testing.

State is managed via a single MobX store (src/store.ts, `makeAutoObservable` + `enforceActions: "never"`); components mutate it directly. Prettier formats all files.

Make sure to use MUI best practices when adding UI related code.

Do not add comments unless you think it is necessary or very helpful. Make them concise.
