# Header face sources

Downloaded on October 9, 2026. The original PNG files retain their artwork, dimensions, and transparency. The header's SVG wrappers embed the original PNG bytes unchanged and use tight view boxes to trim transparent margins.

- `garchomp-shuffle-face.png`: Garchomp's icon from Pokémon Shuffle, downloaded from [Bulbagarden Archives: Shuffle445.png](https://archives.bulbagarden.net/wiki/File:Shuffle445.png) ([original PNG](https://archives.bulbagarden.net/media/upload/5/54/Shuffle445.png)). The canvas is 256 × 256 pixels; nontransparent artwork occupies 198 × 190 pixels, starting at (26, 28). `garchomp-shuffle-face-cropped.svg` displays those bounds. `public/favicon-garchomp-cropped-2026.svg` is an identical copy of that wrapper, given a fresh filename because public images are cached as immutable. The earlier `public/favicon-garchomp-2026.png` retains the uncropped PNG. The home screen icons in `public/manifest.webmanifest` are made from this PNG: `public/app-icon-garchomp-192-2026.png` and `public/app-icon-garchomp-512-2026.png` are the whole canvas scaled with `sips -z 192 192` and `sips -z 512 512`, and `public/app-icon-garchomp-maskable-512-2026.png` is the artwork's bounds scaled to 356 pixels wide and centred on an opaque 512 × 512 square of `#eee`, so that the artwork stays inside the maskable safe zone, a circle whose radius is 40% of the icon's width.
- `jigglypuff-shuffle-face.png`: Jigglypuff's icon from Pokémon Shuffle, downloaded from [Bulbagarden Archives: Shuffle039.png](https://archives.bulbagarden.net/wiki/File:Shuffle039.png) ([original PNG](https://archives.bulbagarden.net/media/upload/8/85/Shuffle039.png)). The canvas is 256 × 256 pixels; nontransparent artwork occupies 182 × 177 pixels, starting at (39, 40). `jigglypuff-shuffle-face-cropped.svg` displays those bounds.
- `indeedee-masters-face.png`: male Indeedee's icon from Pokémon Masters EX, downloaded from [Bulbagarden Archives: MastersIcon0876.png](https://archives.bulbagarden.net/wiki/File:MastersIcon0876.png) ([original PNG](https://archives.bulbagarden.net/media/upload/9/94/MastersIcon0876.png)). The canvas is 128 × 128 pixels; the nontransparent artwork spans its full bounds. Previously used in the header because Indeedee does not have a Pokémon Shuffle icon; now the avatar on the Credits author card.

These are official Pokémon game images. The source pages identify them as copyrighted game imagery and label their use as fair use; they are not freely licensed artwork. Pokémon © Nintendo, Creatures Inc., and GAME FREAK inc.

The download sources for the older Venusaur and Charizard face images in this directory were not recorded.

The Old website button shows the old website's two header faces, restored byte for byte from [commit 2d2bff3](https://github.com/projeffboy/my-pokemon-team/commit/2d2bff34afc852e7413c979ed4d10ee1f2af7f03):

- `landorus-face.png`: the original `src/landorus-face.png`, Pokemon Shuffle artwork.
- `ogerpon-teal-mask-by-jormxdos.png`: the original `src/ogerpon-teal-mask-by-jormxdos.png`, Shuffle-style fan art of Teal Mask Ogerpon by JormXDOS.

The button draws each face 24px tall, so it imports `landorus-face-96.png` and `ogerpon-teal-mask-by-jormxdos-96.png`: the same artwork scaled to fit 96px with `sips -Z 96`, four times the drawn size, which stays sharp on high-density screens at about a tenth of the originals' size. The originals stay here unshipped, as nothing imports them. Remake the copies from them if the button's faces ever grow.
