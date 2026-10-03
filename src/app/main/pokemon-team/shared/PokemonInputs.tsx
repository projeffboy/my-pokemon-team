import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import CasinoIcon from "@mui/icons-material/Casino";
import TuneIcon from "@mui/icons-material/Tune";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { useBreakpoint, useIsMdDown } from "@/app/shared/WidthContext";
import { useTranslation } from "@/app/shared/TranslationContext";
import { TYPE_COLORS, TYPE_TEXT_COLORS } from "@/app/shared/type-colors";
import { pokemonTypes } from "@/shared/pokedex";
import typeIcons from "@/images/type-icons";
import PokemonInput from "./pokemon-inputs/PokemonInput";
import PokemonSprite from "@/app/shared/PokemonSprite";
import SlotMoveHandle from "./pokemon-inputs/SlotMoveHandle";
import useSlotDrag, { dropTarget } from "./use-slot-drag";
import { MOVE_KEYS } from "@/types";

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

// The buttons of a row get equal widths when the row has room for that, else the
// longer label takes more of it, and they show their icons only where those fit too
const rowButton = (labels: string[]) => {
  const gap = 4;
  const bare = labels.map(label => Math.ceil(textWidth(label)) + 8);
  const withIcon = bare.map(width => width + 20);
  const equal = (widths: number[]) =>
    widths.length * Math.max(...widths) + (widths.length - 1) * gap;
  const total = (widths: number[]) =>
    widths.reduce((sum, width) => sum + width, (widths.length - 1) * gap);
  return [
    smallButton,
    {
      [`@container (max-width: ${equal(bare) - 1}px)`]: { flex: "1 1 auto" },
      [`@container (min-width: ${total(withIcon)}px) and (max-width: ${equal(withIcon) - 1}px)`]:
        { flex: "1 1 auto" },
      [`@container (max-width: ${total(withIcon) - 1}px)`]: {
        "& .MuiButton-startIcon": { display: "none" },
      },
    },
  ];
};

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
  const { t, names } = useTranslation();
  const isMdDown = useIsMdDown();
  // The smallest phones have no room for the type icons beside the sprite
  const isXxs = useBreakpoint() === "xxs";
  const showTools = store.isMoreOpen;
  const pokemon = store.team[teamIndex]?.name ?? "";
  const label = names.pokemon(pokemon);
  const { setCardRef, setGripRef, listeners, isDragged, isTarget } =
    useSlotDrag(teamIndex, isDragOverlay);
  const toolsRow = rowButton([t.team.filters, t.team.sort]);
  const slotRow = rowButton([t.team.random, t.team.advanced]);
  const randomize = () => {
    store.randomizeSlot(teamIndex);
    store.openSnackbar(t.team.randomizedPokemon, true);
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
          // With a mouse on a desktop, the info button appears when the card is
          // hovered or focused
          "@media (hover: hover)": {
            [theme.breakpoints.up("md")]: {
              [`& .${SLOT_INFO_CLASS}`]: {
                opacity: 0,
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
        {showTools && (
          <Box sx={{ ...buttonRow, pt: 0.5 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<FilterListIcon />}
              sx={toolsRow}
              onClick={() => store.openDialog("filters", { teamIndex })}
            >
              {t.team.filters}
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<SortIcon />}
              sx={toolsRow}
              onClick={() => store.openDialog("sort", { teamIndex })}
            >
              {t.team.sort}
            </Button>
          </Box>
        )}
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
              position: "relative",
              // In front of the info and Random buttons where a large sprite
              // overlaps them, without taking their clicks
              zIndex: 1,
              pointerEvents: "none",
              flexGrow: 1,
              minWidth: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* Without the tools, the sprite area reaches the card's bottom, so a
                large sprite can show at full size, over the Random button */}
            <PokemonSprite
              teamIndex={teamIndex}
              forceFullSize
              maxHeight={showTools ? undefined : 184}
            />
          </Box>
          {/* With the tools, the pokemon's types straddle the card's left edge at
              the sprite area's top: their icons, or their abbreviations on the
              smallest phones */}
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
                isXxs ?
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
            <Tooltip title={t.team.randomFor(teamIndex + 1)}>
              {/* The span is the row's flex item, so the tooltip works while
                  the button is disabled and the button still sizes with the row */}
              <Box component="span" sx={[...slotRow, { display: "flex" }]}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<CasinoIcon />}
                  sx={[smallButton, { flex: "1 1 auto" }]}
                  disabled={!store.learnsetsLoaded}
                  aria-label={t.team.randomFor(teamIndex + 1)}
                  onClick={randomize}
                >
                  {t.team.random}
                </Button>
              </Box>
            </Tooltip>
          : <Tooltip title={t.team.random}>
              {/* Wrapped so the tooltip still works while the button is disabled */}
              <Box component="span" sx={{ display: "flex" }}>
                <Button
                  size="small"
                  variant="outlined"
                  sx={[smallButton, { flex: "0 0 auto", px: 0.75 }]}
                  disabled={!store.learnsetsLoaded}
                  aria-label={t.team.randomFor(teamIndex + 1)}
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
              startIcon={<TuneIcon />}
              sx={slotRow}
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
        <PokemonInput
          placeholder={t.team.item}
          teamIndex={teamIndex}
          pokemonProperty="item"
          leadingIcon={showTools}
        />
        <PokemonInput
          placeholder={t.team.ability}
          teamIndex={teamIndex}
          pokemonProperty="ability"
        />
      </Box>
    </Box>
  );
});

export default PokemonInputs;
