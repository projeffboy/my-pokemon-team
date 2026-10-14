import type { Generation } from "@/types";
import champions from "./champions.png";
import alphasapphire from "./alphasapphire.png";
import black from "./black.png";
import blue from "./blue.png";
import black2 from "./black2.png";
import brilliantdiamond from "./brilliantdiamond.png";
import crystal from "./crystal.png";
import diamond from "./diamond.png";
import emerald from "./emerald.png";
import firered from "./firered.png";
import gold from "./gold.png";
import heartgold from "./heartgold.png";
import leafgreen from "./leafgreen.png";
import legendsarceus from "./legendsarceus.png";
import legendsza from "./legendsza.png";
import letsgoeevee from "./letsgoeevee.png";
import letsgopikachu from "./letsgopikachu.png";
import moon from "./moon.png";
import omegaruby from "./omegaruby.png";
import pearl from "./pearl.png";
import platinum from "./platinum.png";
import red from "./red.png";
import ruby from "./ruby.png";
import sapphire from "./sapphire.png";
import scarlet from "./scarlet.png";
import shield from "./shield.png";
import shiningpearl from "./shiningpearl.png";
import silver from "./silver.png";
import soulsilver from "./soulsilver.png";
import sun from "./sun.png";
import sword from "./sword.png";
import ultramoon from "./ultramoon.png";
import ultrasun from "./ultrasun.png";
import violet from "./violet.png";
import white from "./white.png";
import white2 from "./white2.png";
import x from "./x.png";
import y from "./y.png";
import yellow from "./yellow.png";

// The files' height in pixels: a wordmark's, and a box front's
const LOGO_HEIGHT = 56;
const BOX_FRONT_HEIGHT = 112;

export interface GameLogo {
  src: string;
  // The file's width in pixels, which gives the logo's room before the file has loaded
  width: number;
  name: string;
  // A box front with the game's mascot, shown at twice a wordmark's height
  isBoxFront?: true;
}

export const logoAspectRatio = ({ width, isBoxFront }: GameLogo) =>
  width / (isBoxFront ? BOX_FRONT_HEIGHT : LOGO_HEIGHT);

// See game-logos-sources.md
export const CHAMPIONS_LOGO: GameLogo = {
  src: champions,
  width: 109,
  name: "Pokémon Champions",
};

// Each generation's games, in release order
export const GAME_LOGOS: Record<Generation, GameLogo[]> = {
  1: [
    { src: red, width: 99, name: "Pokémon Red", isBoxFront: true },
    { src: blue, width: 99, name: "Pokémon Blue", isBoxFront: true },
    { src: yellow, width: 99, name: "Pokémon Yellow", isBoxFront: true },
  ],
  2: [
    { src: gold, width: 99, name: "Pokémon Gold", isBoxFront: true },
    { src: silver, width: 99, name: "Pokémon Silver", isBoxFront: true },
    { src: crystal, width: 99, name: "Pokémon Crystal", isBoxFront: true },
  ],
  3: [
    { src: ruby, width: 105, name: "Pokémon Ruby" },
    { src: sapphire, width: 107, name: "Pokémon Sapphire" },
    { src: emerald, width: 104, name: "Pokémon Emerald" },
    { src: firered, width: 94, name: "Pokémon FireRed" },
    { src: leafgreen, width: 94, name: "Pokémon LeafGreen" },
  ],
  4: [
    { src: diamond, width: 107, name: "Pokémon Diamond" },
    { src: pearl, width: 107, name: "Pokémon Pearl" },
    { src: platinum, width: 104, name: "Pokémon Platinum" },
    { src: heartgold, width: 106, name: "Pokémon HeartGold" },
    { src: soulsilver, width: 103, name: "Pokémon SoulSilver" },
  ],
  5: [
    { src: black, width: 92, name: "Pokémon Black" },
    { src: white, width: 92, name: "Pokémon White" },
    { src: black2, width: 100, name: "Pokémon Black 2" },
    { src: white2, width: 99, name: "Pokémon White 2" },
  ],
  6: [
    { src: x, width: 144, name: "Pokémon X" },
    { src: y, width: 126, name: "Pokémon Y" },
    { src: omegaruby, width: 89, name: "Pokémon Omega Ruby" },
    { src: alphasapphire, width: 98, name: "Pokémon Alpha Sapphire" },
  ],
  7: [
    { src: sun, width: 106, name: "Pokémon Sun" },
    { src: moon, width: 121, name: "Pokémon Moon" },
    { src: ultrasun, width: 109, name: "Pokémon Ultra Sun" },
    { src: ultramoon, width: 120, name: "Pokémon Ultra Moon" },
    { src: letsgopikachu, width: 128, name: "Pokémon: Let's Go, Pikachu!" },
    { src: letsgoeevee, width: 114, name: "Pokémon: Let's Go, Eevee!" },
  ],
  8: [
    { src: sword, width: 56, name: "Pokémon Sword" },
    { src: shield, width: 50, name: "Pokémon Shield" },
    { src: brilliantdiamond, width: 90, name: "Pokémon Brilliant Diamond" },
    { src: shiningpearl, width: 92, name: "Pokémon Shining Pearl" },
    { src: legendsarceus, width: 76, name: "Pokémon Legends: Arceus" },
  ],
  9: [
    { src: scarlet, width: 94, name: "Pokémon Scarlet" },
    { src: violet, width: 96, name: "Pokémon Violet" },
    { src: legendsza, width: 121, name: "Pokémon Legends: Z-A" },
  ],
};
