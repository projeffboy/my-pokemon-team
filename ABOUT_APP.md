This is a one-page app, there doesn't need to be routing.

We used create-react-app.

Uses React.
Uses MobX, not Redux. ANd with decorators.

/src folder contains all the source code.
tsconfig.json disables decorator warnings (decorates are needed for MobX).

All the data about pokemon, the abilities, items, etc. are store in the /src/data folder.

We use ES6:
-const (default) and let, never var
-destructuring
-template strings
-dynamic imports
-arrow functions
-classes

Stylesheet is in /src/styles.js

Huge credits to Pokemon Showdown

This app was created and debugged with Visual Studio Code, which is why there's a .vscode folder. The launch.json inside helps with debugging.

Using tilde for indexOf
responsiveness, lg, xl, etc.

recompose is not used.