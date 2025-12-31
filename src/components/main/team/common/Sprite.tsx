import { observer } from "mobx-react";
import store from "store";
import pokedex from "data/pokedex";
import questionMark from "assets/question-mark.png";
import Box from "@mui/material/Box";
import useWidth from "useWidth";

const Sprite = observer(
  ({ teamSlot, dex }: { teamSlot: number; dex?: boolean }) => {
    const width = useWidth();

    const pokemon = store.team[teamSlot].name;
    const pokedexNumber = pokemon ? (pokedex as any)[pokemon].num : -1;

    // TODO: make it more inline with pokemon showdown logic

    let spriteFilename = pokemon;
    // If user has chosen a pokemon
    if (pokemon) {
      if (pokemon === "raticatealolatotem") {
        spriteFilename = "raticate-totem-a";
      } else if (pokemon === "mimikyubustedtotem") {
        spriteFilename = "mimikyu-totem-busted";
      }
      // We only need to modify spriteFilename if the pokemon has an alternate forme
      else if (store.forme(pokemon)) {
        // the sprite filename consists of the base species name and forme name, separated by a hyphen, all lowercase
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
    let spriteType = "ani";
    let imageFormat = "gif";
    if (
      (pokedexNumber && pokedexNumber >= 810) ||
      (pokemon && ["galar", "paldea"].includes(pokemon)) ||
      ["dialgaorigin", "palkiaorigin", "basculinwhitestriped"].includes(pokemon)
    ) {
      spriteType = "bw";
      imageFormat = "png";
    } else if (dex) {
      spriteType = "dex";
      imageFormat = "png";
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
        <Box
          component="img"
          alt={spriteFilename || "question-mark"}
          /* URL from Pokemon Showdown */
          src={
            spriteFilename
              ? `https://play.pokemonshowdown.com/sprites/${spriteType}/${spriteFilename}.${imageFormat}`
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
      </Box>
    );
  }
);

export default Sprite;
