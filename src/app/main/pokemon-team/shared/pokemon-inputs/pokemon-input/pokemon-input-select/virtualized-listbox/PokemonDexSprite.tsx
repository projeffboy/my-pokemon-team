import Box from "@mui/material/Box";
import pokedex from "@/data/pokedex";
import altSpriteNum from "@/data/altSpriteNum";
import localSprites from "@/images/local-sprites";
import questionMark from "@/images/question-mark.png";
import { spriteUrls } from "@/app/shared/pokemon-sprite/sprite-urls";

const localSpritesMap = localSprites as Record<string, string>;

export default function PokemonDexSprite({ pokemon }: { pokemon: string }) {
  const sprite = spriteUrls(
    pokemon,
    pokedex[pokemon],
    altSpriteNum[pokemon],
    true,
    9,
  );
  const sources = [
    ...new Set(
      [
        localSpritesMap[pokemon],
        sprite.src,
        sprite.fallback,
        questionMark,
      ].filter((source): source is string => !!source),
    ),
  ];
  return (
    <Box
      key={pokemon}
      component="img"
      alt=""
      src={sources[0]}
      onError={event => {
        const image = event.currentTarget;
        const next =
          sources[sources.indexOf(image.getAttribute("src") ?? "") + 1];
        if (next) image.src = next;
      }}
      sx={{ width: 88, height: 88, maxWidth: "100%", objectFit: "contain" }}
    />
  );
}
