import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import store from "@/store";
import pokedex from "@/data/pokedex";
import questionMark from "@/images/question-mark.png";
import altSpriteNum from "@/data/altSpriteNum";
import localSprites from "@/images/local-sprites";
import { isShinyInGeneration } from "@/shared/generation-rules";
import { useIsMdDown } from "./WidthContext";
import { useTranslation } from "./TranslationContext";
import { spriteUrls } from "./pokemon-sprite/sprite-urls";
import { useSelectionAnimation } from "./pokemon-sprite/use-selection-animation";
import { useSpriteAnimation } from "./pokemon-sprite/use-sprite-animation";

const localSpritesMap = localSprites as Record<string, string>;

const PokemonSprite = observer(function PokemonSprite({
  teamIndex,
  forceFullSize = false,
  maxHeight,
  fitContainer = false,
}: {
  teamIndex: number;
  forceFullSize?: boolean;
  maxHeight?: number;
  fitContainer?: boolean;
}) {
  // Below 960px the team viewers show dex sprites, except in a slot's card
  const isSmall = useIsMdDown() && !forceFullSize;
  const { names } = useTranslation();
  const member = store.team[teamIndex];
  const pokemon = member?.name ?? ""; // unhyphenated name
  const generation = store.currentTeam.generation;
  const classicSprite = !!pokemon && generation >= 2 && generation <= 4;
  const shiny = !!member && isShinyInGeneration(member, generation);
  const animation = useSpriteAnimation(
    pokemon,
    generation,
    shiny,
    classicSprite,
  );
  const selection = store.pokemonSelection;
  const imageRef = useSelectionAnimation(
    (
      selection?.teamId === store.currentTeamId &&
        selection.teamIndex === teamIndex
    ) ?
      selection.sequence
    : undefined,
    classicSprite,
    animation,
  );
  const sprite =
    pokemon ?
      spriteUrls(
        pokemon,
        pokedex[pokemon],
        altSpriteNum[pokemon],
        isSmall,
        store.currentTeam.generation,
        shiny,
      )
    : undefined;
  const localSprite = localSpritesMap[pokemon];
  const sources = [
    ...new Set(
      [
        shiny ? undefined : localSprite,
        ...(sprite?.sources ?? []),
        ...(sprite?.proxied ?? []),
        localSprite,
        questionMark,
      ].filter((src): src is string => !!src),
    ),
  ];
  const heightLimit =
    fitContainer ?
      `min(100%, ${maxHeight ?? 96}px)`
    : `${maxHeight ?? (isSmall ? 160 : 96)}px`;

  /* Either Return Sprite or Mini Sprite */
  return (
    <Box
      sx={{
        minWidth: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: fitContainer ? "100%" : undefined,
        width:
          fitContainer || (classicSprite && isSmall) ? "100%"
          : classicSprite ? 96
          : undefined,
        maxWidth: "100%",
        aspectRatio: classicSprite && !fitContainer ? "1" : undefined,
      }}
    >
      <Box
        key={sources[0]}
        component="img"
        ref={imageRef}
        // The slot's tab or name input already says when it is empty
        alt={pokemon ? names.pokemon(pokemon) : ""}
        src={sources[0]}
        onError={e => {
          const image = e.currentTarget;
          const next =
            sources[sources.indexOf(image.getAttribute("src") ?? "") + 1];
          if (next) image.src = next;
        }}
        sx={{
          maxHeight:
            classicSprite ?
              `calc(${heightLimit} * var(--sprite-scale, 1))`
            : heightLimit,
          maxWidth:
            classicSprite ? "calc(100% * var(--sprite-scale, 1))" : "100%",
          width:
            classicSprite ?
              `calc(${isSmall ? "100%" : "96px"} * var(--sprite-scale, 1))`
            : isSmall ? "100%"
            : "auto",
        }}
      />
    </Box>
  );
});

export default PokemonSprite;
