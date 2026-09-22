# Icon sheet sources

`pokemonicons-sheet.png` and `itemicons-sheet.png` are Pokemon Showdown's icon sheets, from `https://play.pokemonshowdown.com/sprites/`. They are bundled so that a change on Showdown's side cannot move or remove icons under the data in `src/data`.

Downloaded on September 21, 2026, unmodified; Showdown last changed both on June 21, 2026. `npm run update:data` reports when either one differs from Showdown's copy. They stay PNG rather than WebP so that check compares the file the app ships.
