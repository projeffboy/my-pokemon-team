import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CasinoIcon from "@mui/icons-material/Casino";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { useIsMdDown } from "@/app/shared/WidthContext";
import { useTranslation } from "@/app/shared/TranslationContext";
import { useTypeIcons } from "@/app/main/shared/TypeIconContext";
import { TYPE_COLORS, TYPE_TEXT_COLORS } from "@/app/shared/type-colors";
import { pokemonTypes } from "@/shared/pokedex";
import { isShinyInGeneration } from "@/shared/generation-rules";
import typeIcons from "@/images/type-icons";
import type { SyntheticEvent } from "react";
import useDiceRoll from "@/app/shared/use-dice-roll";
import PokemonInput from "./pokemon-inputs/PokemonInput";
import PokemonSprite from "@/app/shared/PokemonSprite";
import SlotMoveHandle from "./pokemon-inputs/SlotMoveHandle";
import useSlotDrag, { dropTarget } from "./use-slot-drag";
import { MOVE_KEYS } from "@/types";
import { randomizeSlotLabel } from "@/store/random";

const SLOT_INFO_CLASS = "slot-info";

// The buttons' font, for measuring their labels
const BUTTON_FONT = "500 12px Roboto, Helvetica, Arial, sans-serif";
let canvas: CanvasRenderingContext2D | null | undefined;
const textWidth = (text: string) => {
  canvas ??= document.createElement("canvas").getContext("2d");
  if (!canvas) return 7 * text.length;
  canvas.font = BUTTON_FONT;
  return canvas.measureText(text).width;
};

// Two of these share a card's left column, so they are as compact as a labelled button gets
const buttonRow = { display: "flex", gap: 0.5, containerType: "inline-size" };
const smallButton = {
  flex: "1 1 0",
  minWidth: 0,
  // With the row's 4px of padding, as tall as one of the inputs beside it
  height: 28,
  px: 0.5,
  fontSize: 12,
  letterSpacing: 0,
  textTransform: "none",
  whiteSpace: "nowrap",
  "& .MuiButton-startIcon": { mr: 0.5, ml: 0, "& > svg": { fontSize: 16 } },
} as const;

// One team slot: the name, sprite, and slot tools on the left, and the moves,
// item, and ability on the right. Another slot's card can be dropped on it, and
// a copy of it follows the pointer while it is dragged.
const PokemonInputs = observer(function PokemonInputs({
  teamIndex,
  isDragOverlay = false,
}: {
  teamIndex: number;
  isDragOverlay?: boolean;
}) {
  const translation = useTranslation();
  const { t, names } = translation;
  const isMdDown = useIsMdDown();
  const hasTypeIcons = useTypeIcons();
  const showTools = store.isMoreOpen;
  const member = store.team[teamIndex];
  const pokemon = member?.name ?? "";
  const randomTitle =
    member ?
      randomizeSlotLabel(
        member,
        translation,
        store.currentTeam.generation,
        store.currentTeam.format,
      )
    : t.team.randomizePokemon;
  const label = names.pokemon(pokemon);
  const { setCardRef, setGripRef, listeners, isDragged, isTarget } =
    useSlotDrag(teamIndex, isDragOverlay);
  const detailsIconAt = Math.ceil(textWidth(t.team.advanced)) + 60;
  const randomAt = detailsIconAt + Math.ceil(textWidth(t.team.random)) + 4;
  const randomizeAt = Math.max(
    randomAt + 1,
    detailsIconAt + Math.ceil(textWidth(t.team.randomize)) + 4,
  );
  const diceRoll = useDiceRoll();
  const randomize = (event: SyntheticEvent<HTMLElement>) => {
    const teamId = store.currentTeamId;
    diceRoll.onClick(event, () => {
      if (store.currentTeamId !== teamId) return;
      const message = store.randomizeSlot(teamIndex);
      if (message) store.openSnackbar(message, true, "random");
    });
  };

  return (
    <Box
      ref={setCardRef}
      sx={[
        theme => ({
          position: "relative",
          display: "grid",
          columnGap: 1,
          gridTemplateColumns: "1fr 1fr",
          // Keep the first slot's info button visible; later slots reveal it
          // when hovered or focused with a mouse on desktop.
          "@media (hover: hover)": {
            [theme.breakpoints.up("md")]: {
              [`& .${SLOT_INFO_CLASS}`]: {
                opacity: teamIndex === 0 ? 1 : 0,
                transition: "opacity .15s",
              },
              [`&:hover .${SLOT_INFO_CLASS}, &:focus-within .${SLOT_INFO_CLASS}`]:
                { opacity: 1 },
            },
          },
        }),
        isTarget && { ...dropTarget, outlineOffset: 6 },
        isDragged && { opacity: 0.4 },
      ]}
      role="region"
      aria-label={t.team.slot(teamIndex + 1)}
    >
      {/* On phones and tablets the slot tabs are what drags */}
      {!isMdDown && (
        <SlotMoveHandle
          teamIndex={teamIndex}
          setGripRef={setGripRef}
          listeners={listeners}
        />
      )}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <PokemonInput
          placeholder={t.team.name}
          teamIndex={teamIndex}
          pokemonProperty="name"
        />
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            minHeight: 0,
            py: 0.5,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: theme => theme.spacing(0.5, 0),
              // In front of the info and Random buttons where a large sprite
              // overlaps them, without taking their clicks
              zIndex: 1,
              pointerEvents: "none",
              minWidth: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <PokemonSprite
              teamIndex={teamIndex}
              forceFullSize
              fitContainer
              maxHeight={showTools ? undefined : 184}
            />
          </Box>
          {/* With the tools, the pokemon's types straddle the card's left edge at
              the sprite area's top, matching the team stats' icons */}
          {showTools && pokemon && (
            <Box
              sx={{
                position: "absolute",
                // A step below the name input
                top: 8,
                left: -16,
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 0.5,
                pointerEvents: "none",
              }}
            >
              {pokemonTypes(pokemon, store.currentTeam.generation).map(type =>
                !hasTypeIcons ?
                  <Box
                    key={type}
                    component="span"
                    role="img"
                    aria-label={names.type(type)}
                    sx={{
                      bgcolor: TYPE_COLORS[type],
                      color: TYPE_TEXT_COLORS[type],
                      fontSize: 10,
                      fontWeight: 500,
                      lineHeight: "16px",
                      px: 0.5,
                      borderRadius: 0.5,
                    }}
                  >
                    {t.typeAbbreviations[type]}
                  </Box>
                : <Box
                    key={type}
                    component="img"
                    src={typeIcons[type]}
                    alt={names.type(type)}
                    sx={{ width: 20, height: 20 }}
                  />,
              )}
              {member &&
                isShinyInGeneration(member, store.currentTeam.generation) && (
                  <AutoAwesomeIcon
                    titleAccess={t.advanced.shiny}
                    sx={{
                      fontSize: 20,
                      color: "warning.main",
                      alignSelf: "center",
                    }}
                  />
                )}
            </Box>
          )}
          {/* In the sprite area's top right corner, however the sprite is centred in it */}
          {pokemon && (
            <Tooltip title={t.team.about(label)}>
              <IconButton
                className={SLOT_INFO_CLASS}
                aria-label={t.team.about(label)}
                onClick={() => store.openDialog("info", { teamIndex })}
                sx={{ position: "absolute", top: 0, right: -8 }}
              >
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Box
          sx={
            showTools ?
              { ...buttonRow, pb: 0.5 }
            : { position: "absolute", bottom: 4, left: 0, display: "flex" }
          }
        >
          {showTools ?
            <Tooltip title={randomTitle}>
              {/* The span is the row's flex item, so the tooltip works while
                  the button is disabled and the button still sizes with the row */}
              <Box component="span" sx={{ display: "flex", flex: "0 0 auto" }}>
                <Button
                  size="small"
                  variant="outlined"
                  sx={[smallButton, { flex: "0 0 auto", gap: 0.5 }]}
                  disabled={!store.learnsetsLoaded}
                  aria-label={t.team.randomFor(teamIndex + 1)}
                  {...diceRoll}
                  onClick={randomize}
                >
                  <CasinoIcon sx={{ fontSize: 16 }} />
                  <Box
                    component="span"
                    sx={{
                      display: "none",
                      [`@container (min-width: ${randomAt}px) and (max-width: ${randomizeAt - 1}px)`]:
                        { display: "inline" },
                    }}
                  >
                    {t.team.random}
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      display: "none",
                      [`@container (min-width: ${randomizeAt}px)`]: {
                        display: "inline",
                      },
                    }}
                  >
                    {t.team.randomize}
                  </Box>
                </Button>
              </Box>
            </Tooltip>
          : <Tooltip title={randomTitle}>
              {/* Wrapped so the tooltip still works while the button is disabled */}
              <Box component="span" sx={{ display: "flex" }}>
                <Button
                  size="small"
                  variant="outlined"
                  sx={[smallButton, { flex: "0 0 auto", px: 0.75 }]}
                  disabled={!store.learnsetsLoaded}
                  aria-label={t.team.randomFor(teamIndex + 1)}
                  {...diceRoll}
                  onClick={randomize}
                >
                  <CasinoIcon sx={{ fontSize: 16 }} />
                </Button>
              </Box>
            </Tooltip>
          }
          {showTools && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              sx={[
                smallButton,
                {
                  flex: "1 1 auto",
                  "& .MuiButton-startIcon": {
                    display: "none",
                    [`@container (min-width: ${detailsIconAt}px)`]: {
                      display: "inline-flex",
                    },
                  },
                },
              ]}
              disabled={!pokemon}
              aria-label={t.team.advancedFor(teamIndex + 1)}
              onClick={() => store.openDialog("advanced", { teamIndex })}
            >
              {t.team.advanced}
            </Button>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          // A long item's icon stops at the column's edge instead of widening the page
          overflow: "clip",
        }}
      >
        {MOVE_KEYS.map(key => (
          <PokemonInput
            key={key}
            placeholder={t.team.move}
            teamIndex={teamIndex}
            pokemonProperty={key}
            leadingIcon={showTools}
          />
        ))}
        {store.rules.items && (
          <PokemonInput
            placeholder={t.team.item}
            teamIndex={teamIndex}
            pokemonProperty="item"
            leadingIcon={showTools}
          />
        )}
        {store.rules.abilities && (
          <PokemonInput
            placeholder={t.team.ability}
            teamIndex={teamIndex}
            pokemonProperty="ability"
          />
        )}
      </Box>
    </Box>
  );
});

export default PokemonInputs;
