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

export interface GameLogo {
  src: string;
  name: string;
  // A box front with the game's mascot, shown at twice a wordmark's height
  isBoxFront?: true;
}

// See game-logos-sources.md
export const CHAMPIONS_LOGO: GameLogo = {
  src: champions,
  name: "Pokémon Champions",
};

// Each generation's games, in release order
export const GAME_LOGOS: Record<Generation, GameLogo[]> = {
  1: [
    { src: red, name: "Pokémon Red", isBoxFront: true },
    { src: blue, name: "Pokémon Blue", isBoxFront: true },
    { src: yellow, name: "Pokémon Yellow", isBoxFront: true },
  ],
  2: [
    { src: gold, name: "Pokémon Gold", isBoxFront: true },
    { src: silver, name: "Pokémon Silver", isBoxFront: true },
    { src: crystal, name: "Pokémon Crystal", isBoxFront: true },
  ],
  3: [
    { src: ruby, name: "Pokémon Ruby" },
    { src: sapphire, name: "Pokémon Sapphire" },
    { src: emerald, name: "Pokémon Emerald" },
    { src: firered, name: "Pokémon FireRed" },
    { src: leafgreen, name: "Pokémon LeafGreen" },
  ],
  4: [
    { src: diamond, name: "Pokémon Diamond" },
    { src: pearl, name: "Pokémon Pearl" },
    { src: platinum, name: "Pokémon Platinum" },
    { src: heartgold, name: "Pokémon HeartGold" },
    { src: soulsilver, name: "Pokémon SoulSilver" },
  ],
  5: [
    { src: black, name: "Pokémon Black" },
    { src: white, name: "Pokémon White" },
    { src: black2, name: "Pokémon Black 2" },
    { src: white2, name: "Pokémon White 2" },
  ],
  6: [
    { src: x, name: "Pokémon X" },
    { src: y, name: "Pokémon Y" },
    { src: omegaruby, name: "Pokémon Omega Ruby" },
    { src: alphasapphire, name: "Pokémon Alpha Sapphire" },
  ],
  7: [
    { src: sun, name: "Pokémon Sun" },
    { src: moon, name: "Pokémon Moon" },
    { src: ultrasun, name: "Pokémon Ultra Sun" },
    { src: ultramoon, name: "Pokémon Ultra Moon" },
    { src: letsgopikachu, name: "Pokémon: Let's Go, Pikachu!" },
    { src: letsgoeevee, name: "Pokémon: Let's Go, Eevee!" },
  ],
  8: [
    { src: sword, name: "Pokémon Sword" },
    { src: shield, name: "Pokémon Shield" },
    { src: brilliantdiamond, name: "Pokémon Brilliant Diamond" },
    { src: shiningpearl, name: "Pokémon Shining Pearl" },
    { src: legendsarceus, name: "Pokémon Legends: Arceus" },
  ],
  9: [
    { src: scarlet, name: "Pokémon Scarlet" },
    { src: violet, name: "Pokémon Violet" },
    { src: legendsza, name: "Pokémon Legends: Z-A" },
  ],
};
