# Sprite animation sources

The front-facing normal and shiny animations are bundled from the
[PokeAPI sprite collection](https://github.com/PokeAPI/sprites):

- Gen 2: `sprites/pokemon/versions/generation-ii/crystal/animated` (GIF).
- Gen 3: `sprites/pokemon/versions/generation-iii/emerald/animated` (APNG).
- Gen 4: `sprites/pokemon/versions/generation-iv/heartgold-soulsilver/animated` (APNG).

Downloaded October 6, 2026. `source-revision.txt` records the source commit.
Artwork belongs to Nintendo, Creatures Inc., and GAME FREAK inc.; PokeAPI
collects the original game sprites.

Run `node scripts/update-sprite-animations.ts` to refresh the files and
`manifest.json`. It matches PokeAPI Pokémon identifiers to the app's Showdown
IDs and records each animation's frame delays. Only sprites present in the
app's Pokédex are included. Unsupported formes keep their static sprites.

The site plays one cycle on page load and when a Pokémon is selected, then restores its
Showdown still sprite. Reduced motion skips playback. The animations are
served from the site; there are no runtime requests to PokeAPI or GitHub.
