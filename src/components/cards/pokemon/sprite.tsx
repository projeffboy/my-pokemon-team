import React from "react";
import Box from "@mui/material/Box";
import { observer } from "mobx-react";
import store from "../../../store";
import pokedex from "../../../data/pokedex";
import { pokemonInputStyles as spriteStyles } from "../../../styles";
import questionMark from "../../../images/question-mark.png";
import altSpriteNum from "../../../data/altSpriteNum";
import localSprites from "../../../images/local-sprites";
import { useBreakpoint } from "../../../width-context";

interface SpriteProps {
  teamIndex: number;
  forceFullSize?: boolean;
}

const pokedexMap = pokedex as Record<string, { num?: number }>;
const altSpriteNumMap = altSpriteNum as Record<string, number>;
const localSpritesMap = localSprites as Record<string, string>;

const Sprite = observer(function Sprite(props: SpriteProps) {
  const { teamIndex, forceFullSize = false } = props;
  const breakpoint = useBreakpoint();
  const width =
    forceFullSize && (breakpoint === "xs" || breakpoint === "sm")
      ? "md"
      : breakpoint;
  const pokemon = store.team[teamIndex].name; // unhyphenated name
  const pokedexNumber = pokemon ? pokedexMap[pokemon]?.num : undefined;

  let spriteFilename = pokemon; // the filename of the pokemon sprite (usually just the pokemon name)

  // If user has chosen a pokemon
  if (pokemon) {
    // Raticate Alola Totem's URL is the exception
    if (pokemon === "raticatealolatotem") {
      spriteFilename = "raticate-totem-a";
    } else if (pokemon === "mimikyubustedtotem") {
      spriteFilename = "mimikyu-totem-busted";
    }
    // We only need to modify spriteFilename if the pokemon has an alternate forme
    else if (store.forme(pokemon)) {
      /*
       * the sprite filename consists of two parts:
       * base species name and forme name
       * separated by a hyphen
       * all lowercase
       */
      const spriteFilenamePart1 = store.baseForme(pokemon);
      const forme = store.forme(pokemon);
      const spriteFilenamePart2 = (forme || "")
        .toLowerCase()
        .replace("-", "");
      spriteFilename = `${spriteFilenamePart1}-${spriteFilenamePart2}`;

      spriteFilename = spriteFilename.replace("%", "").replace("'", "");
    }
  }

  /* Mini Sprite (for smaller screen sizes) */
  let typeOfSprite = "ani";
  let imgFormat = "gif";
  if (width === "sm" || width === "xs") {
    // below 960px
    typeOfSprite = "dex";
    if (
      (pokedexNumber && 810 <= pokedexNumber && pokedexNumber <= 898) ||
      (pokemon && pokemon.includes("galar"))
    ) {
      typeOfSprite = "bw";
    }

    imgFormat = "png";
  }

  if (
    (pokedexNumber !== undefined &&
      984 <= pokedexNumber &&
      pokedexNumber <= 995) ||
    pokedexNumber === 0 ||
    (pokemon && (altSpriteNumMap[pokemon] ?? -1) >= 1320 + 93) ||
    [
      "dialgaorigin",
      "palkiaorigin",
      "basculinwhitestriped",
      "ursaluna",
      "pichuspikyeared",
      "miraidon",
    ].includes(pokemon)
  ) {
    typeOfSprite = "gen5";
    imgFormat = "png";
  }

  const localSprite = pokemon ? localSpritesMap[pokemon] : undefined;

  /* Either Return Sprite or Mini Sprite */
  return (
    <Box sx={{ ...spriteStyles.gridItem, ...spriteStyles.spriteContainer }}>
      <img
        alt={spriteFilename || "question-mark"}
        /* URL from Pokemon Showdown */
        src={
          localSprite ||
          (spriteFilename
            ? `https://play.pokemonshowdown.com/sprites/${typeOfSprite}/${spriteFilename}.${imgFormat}`
            : // The placeholder (question mark) sprite
              questionMark)
        }
        onError={e => {
          // Prevent infinite loops if the fallback image also fails
          e.currentTarget.onerror = null;
          e.currentTarget.src = `https://play.pokemonshowdown.com/sprites/gen5/${spriteFilename}.png`;
        }}
        /* Apply miniSprite style if it's a mini sprite */
        style={{
          ...spriteStyles.sprite,
          ...(width === "sm" || width === "xs" ? spriteStyles.miniSprite : {}),
          ...(width === "lg" || width === "xl"
            ? spriteStyles.smallerSprite
            : {}),
        }}
      />
    </Box>
  );
});

export default Sprite;
