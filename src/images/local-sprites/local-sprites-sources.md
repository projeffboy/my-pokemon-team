# Local sprite sources

These 38 sprites are the 3D model renders of mega evolutions from Pokemon Legends: Z-A and its DLC. They are bundled because Pokemon Showdown hosted no sprites for these formes when they were added. `PokemonSprite.tsx` uses a local sprite before it tries any Showdown URL.

- Added on August 28, 2026, in commit `0c9c5be`. Every file is a 192 × 192 PNG named after the pokemon's Showdown ID.
- The site they were downloaded from was not recorded, and it is not important: they are stand-ins until Showdown hosts these formes, and many sites carry the same renders. Do not spend time tracing it.
- The renders are official Pokemon artwork: © Nintendo, Creatures Inc., and GAME FREAK inc.

## What Showdown hosts

There were 47 sprites at first. On September 19, 2026, every forme was checked against the three Showdown folders `PokemonSprite.tsx` can request (`ani` .gif at `md` and up, `dex` .png below that, `gen5` .png as the fallback):

| Showdown has         | Formes                                                                                                                                                                                                                           |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ani`, `dex`, `gen5` | `chandelure-mega`, `chesnaught-mega`, `chimecho-mega`, `crabominable-mega`, `delphox-mega`, `drampa-mega`, `excadrill-mega`, `floette-mega`, `golurk-mega`, `greninja-mega`, `hawlucha-mega`, `meowstic-fmega`, `meowstic-mmega` |
| `ani` only           | `barbaracle-mega`, `dragalge-mega`, `eelektross-mega`, `falinks-mega`, `malamar-mega`, `pyroar-mega`, `raichu-megax`, `raichu-megay`, `scolipede-mega`, `scrafty-mega`, `staraptor-mega`                                         |
| `gen5` only          | `absol-megaz`, `baxcalibur-mega`, `garchomp-megaz`, `golisopod-mega`, `lucario-megaz`                                                                                                                                            |
| nothing              | `darkrai-mega`, `heatran-mega`, `magearna-mega`, `magearna-originalmega`, `tatsugiri-curlymega`, `tatsugiri-droopymega`, `tatsugiri-stretchymega`, `zeraora-mega`, `zygarde-mega`                                                |

Every `ani` .gif in the first two rows is a single-frame still of about 3 KB, not an animation. Showdown's real animations have 60 or more frames and are over 100 KB.

Nine more formes had all three folders and a real animation, so they were deleted that day and now use Showdown's animated sprites: `clefable-mega`, `victreebel-mega`, `starmie-mega`, `dragonite-mega`, `meganium-mega`, `feraligatr-mega`, `skarmory-mega`, `froslass-mega`, and `emboar-mega`.

None of the 38 sprites left here can be animated yet. `PokemonSprite.tsx` requests only `gen5` for any pokemon whose `altSpriteNum` is `1320 + 93` or higher, which is exactly these 38, so deleting one shows Showdown's 96 × 96 static `gen5` sprite, or a broken image if there is none. Once Showdown animates a forme, check that its `ani` .gif has more than one frame and that its `dex` .png exists, exempt it from that `gen5` rule, and then delete its local sprite and its line in `index.ts`.
