# Local sprite sources

These 47 sprites are the 3D model renders of the mega evolutions from Pokemon Legends: Z-A and its DLC. They are bundled because Pokemon Showdown hosted no sprites for these formes when they were added. `PokemonSprite.tsx` uses a local sprite before it tries any Showdown URL.

- Added on August 28, 2026, in commit `0c9c5be`. Every file is a 192 × 192 PNG named after the pokemon's Showdown ID.
- The site they were downloaded from was not recorded, and it is not important: they are stand-ins until Showdown hosts these formes, and many sites carry the same renders. Do not spend time tracing it.
- The renders are official Pokemon artwork: © Nintendo, Creatures Inc., and GAME FREAK inc.

As of September 19, 2026, Showdown hosts its own sprites for some of these formes, such as `dragonite-mega`, `greninja-mega`, `meganium-mega`, `floette-mega`, and `meowstic-fmega`. It still has none for others, such as `falinks-mega`, `zeraora-mega`, `zygarde-mega`, `tatsugiri-curlymega`, and `magearna-originalmega`. A local sprite can be deleted, along with its line in `index.ts`, once Showdown hosts that forme.
