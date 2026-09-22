import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import store from "@/store";
import pokedex from "@/data/pokedex";
import questionMark from "@/images/question-mark.png";
import altSpriteNum from "@/data/altSpriteNum";
import localSprites from "@/images/local-sprites";
import { useBreakpoint } from "@/app/shared/WidthContext";
import { spriteUrls } from "./pokemon-sprite/sprite-urls";

const localSpritesMap = localSprites as Record<string, string>;

const PokemonSprite = observer(function PokemonSprite({
  teamIndex,
  forceFullSize = false,
}: {
  teamIndex: number;
  forceFullSize?: boolean;
}) {
  const breakpoint = useBreakpoint();
  const width =
    forceFullSize && (breakpoint === "xs" || breakpoint === "sm") ?
      "md"
    : breakpoint;
  const isSmall = width === "sm" || width === "xs"; // below 960px
  const pokemon = store.team[teamIndex]?.name ?? ""; // unhyphenated name
  const sprite =
    pokemon ?
      spriteUrls(pokemon, pokedex[pokemon], altSpriteNum[pokemon], isSmall)
    : undefined;
  const localSprite = localSpritesMap[pokemon];

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
        alt={sprite?.filename ?? "question-mark"}
        // A bundled sprite, else Showdown's, else the question mark placeholder
        src={localSprite || sprite?.src || questionMark}
        onError={e => {
          // Prevent infinite loops if the fallback image also fails
          e.currentTarget.onerror = null;
          if (sprite) e.currentTarget.src = sprite.fallback;
        }}
        sx={{
          maxHeight: isSmall ? 160 : 96,
          maxWidth: "100%",
          width: isSmall ? "100%" : "auto",
        }}
      />
    </Box>
  );
});

export default PokemonSprite;
