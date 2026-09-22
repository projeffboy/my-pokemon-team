# Icon sheet sources

`pokemonicons-sheet.png` and `itemicons-sheet.png` are Pokemon Showdown's icon sheets, from `https://play.pokemonshowdown.com/sprites/`. They are bundled so that a change on Showdown's side cannot move or remove icons under the data in `src/data`.

Downloaded on September 21, 2026, unmodified; Showdown last changed both on June 21, 2026. `npm run update:data` compares the PNGs byte for byte with Showdown's copies and reports when either one differs.

The app imports the `.webp` copies, made from the PNGs with `cwebp -lossless -z 9`, which are smaller with the same pixels. Regenerate them whenever a PNG is replaced.
