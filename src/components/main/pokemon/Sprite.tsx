import { observer } from "mobx-react";
import store from "store";
import pokedex from "data/pokedex";
import questionMark from "assets/question-mark.png";
import Box from "@mui/material/Box";
import useWidth from "useWidth";

const Sprite = observer(({ teamSlot }: { teamSlot: number }) => {
  const width = useWidth();
  const pokemon = store.team[teamSlot].name; // unhyphenated name
  const pokedexNumber = pokemon && (pokedex as any)[pokemon].num;

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
      const spriteFilenamePart2 = store
        .forme(pokemon)
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
    pokedexNumber >= 899 ||
    pokedexNumber == 0 ||
    (pokemon && pokemon.includes("paldea")) ||
    ["dialgaorigin", "palkiaorigin", "basculinwhitestriped"].includes(pokemon)
  ) {
    typeOfSprite = "gen5";
    imgFormat = "png";
  }

  /* Either Return Sprite or Mini Sprite */
  return (
    <Box
      sx={{
        minWidth: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gridRow: { xs: "2 / 7", md: "2 / 5" },
      }}
    >
      {
        <Box
          component="img"
          alt={spriteFilename || "question-mark"}
          /* URL from Pokemon Showdown */
          src={
            spriteFilename
              ? `https://play.pokemonshowdown.com/sprites/${typeOfSprite}/${spriteFilename}.${imgFormat}`
              : // The placeholder (question mark) sprite
                questionMark
          }
          /* Apply miniSprite class if it's a mini sprite */
          sx={{
            maxHeight: "100%",
            maxWidth: "100%",
            ...(width === "sm" && { width: "100%" }),
            ...((width === "lg" || width === "xl") && { maxHeight: "96px" }),
          }}
        />
      }
    </Box>
  );
});

export default Sprite;
