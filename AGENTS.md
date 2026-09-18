# About the Project

React/Vite Pokemon teambuilder web app.

Before making changes, read [README.md](README.md) for the project overview, setup instructions, and testing workflow. Use [package.json](package.json) for current command definitions and dependency versions.

## Testing

After changing development files, run `npm test`. Fix failures before finishing; if you cannot resolve them, report the remaining failures.

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

Production smoke tests live in `tests/smoke/`. Keep them focused on essential user flows against the production build. Block external requests and fail on uncaught browser errors.

## General Coding Conventions

Aim to write concise code without sacrificing readability/maintainability.
Do not add comments unless you think it is necessary or very helpful. Make them concise.

State is managed via a single MobX store (src/store.ts, `makeAutoObservable` + `enforceActions: "never"`); components mutate it directly.

## Styling Conventions

For CSS, do not use `!important` unless there is no other way.

Make sure to use MUI best practices when making UI related code changes.
When inside the `sx` prop, use their syntax. For example, `p: 1` instead of `padding: 4px`.

## Images

Host images statically with the site, except for sprites and icons from Smogon / Pokemon Showdown, which may use their external URLs. Keep source documentation for downloaded images.

## Other

Ask me clarification questions if necessary in response to my prompt.

Don't touch `RAMP.ts` or code related to it.
