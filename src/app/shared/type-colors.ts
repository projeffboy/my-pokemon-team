import { getContrastRatio } from "@mui/material/styles";
import { POKEMON_TYPES, type PokemonType } from "@/types";

export const TYPE_COLORS: Record<PokemonType, string> = {
  Bug: "#a8b820",
  Dark: "#6f5747",
  Dragon: "#7036fc",
  Electric: "#f9d130",
  Fairy: "#fd67d7",
  Fighting: "#c02f27",
  Fire: "#f17f2e",
  Flying: "#a990f1",
  Ghost: "#715799",
  Grass: "#78c850",
  Ground: "#e1c067",
  Ice: "#95d7d8",
  Normal: "#a9a878",
  Poison: "#a03fa1",
  Psychic: "#f95788",
  Rock: "#b89f38",
  Steel: "#b8b8d0",
  Water: "#6890f0",
};

// Text on a type's colour: white where it reads as small text, and near-black elsewhere
export const TYPE_TEXT_COLORS = Object.fromEntries(
  POKEMON_TYPES.map(type => [
    type,
    getContrastRatio("#fff", TYPE_COLORS[type]) >= 4.5 ? "#fff" : (
      "rgba(0, 0, 0, 0.87)"
    ),
  ]),
) as Record<PokemonType, string>;
