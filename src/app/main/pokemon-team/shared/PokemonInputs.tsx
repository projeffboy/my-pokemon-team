import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CasinoIcon from "@mui/icons-material/Casino";
import TuneIcon from "@mui/icons-material/Tune";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { useIsMdDown } from "@/app/shared/WidthContext";
import { useTranslation } from "@/app/shared/TranslationContext";
import { effectivePokemonTypes } from "@/store/shared/effectiveness";
import { isShinyInGeneration } from "@/shared/generation-rules";
import typeIcons from "@/images/type-icons";
import type { SyntheticEvent } from "react";
import useDiceRoll from "@/app/shared/use-dice-roll";
import useFittingLabel from "@/app/shared/use-fitting-label";
import PokemonInput from "./pokemon-inputs/PokemonInput";
import PokemonSprite from "@/app/shared/PokemonSprite";
import SlotMoveHandle from "./pokemon-inputs/SlotMoveHandle";
import useSlotDrag, { dropTarget } from "./use-slot-drag";
import { MOVE_KEYS } from "@/types";
import { randomizeSlotLabel } from "@/store/random";

const SLOT_INFO_CLASS = "slot-info";

// The Random and Details buttons in the sprite area's bottom corners
const cornerButton = {
  minWidth: 0,
  // As tall as one of the inputs beside it
  height: 28,
  px: 0.75,
  fontSize: 12,
  letterSpacing: 0,
  textTransform: "none",
  whiteSpace: "nowrap",
  "& .MuiButton-startIcon": { mr: 0.5, ml: 0, "& > svg": { fontSize: 16 } },
} as const;

// One team slot: the name, sprite, and slot buttons on the left, and the moves,
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
  const member = store.team[teamIndex];
  const analysisMember = store.analysisTeam[teamIndex];
  const pokemon = member?.name ?? "";
  const randomTitle =
    member ?
      randomizeSlotLabel(
        member,
        translation,
        store.currentTeam.generation,
        store.dataFormat,
      )
    : t.team.randomizePokemon;
  const label = names.pokemon(pokemon);
  const { setCardRef, setGripRef, listeners, isDragged, isTarget } =
    useSlotDrag(teamIndex, isDragOverlay);
  // The Details button's longest label that fits beside Random, or none where neither does
  const { ref: detailsRoom, label: detailsLabel } =
    useFittingLabel<HTMLSpanElement>([t.team.advanced, t.team.details, ""]);
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
      {/* On phones and tablets the slot tabs are what drags, so the grip only opens its menu */}
      <SlotMoveHandle
        teamIndex={teamIndex}
        setGripRef={setGripRef}
        listeners={isMdDown ? undefined : listeners}
      />
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
              maxHeight={184}
            />
          </Box>
          {/* The pokemon's types straddle the card's left edge at the sprite area's top,
              matching the team stats' icons */}
          {pokemon && (
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
              {effectivePokemonTypes(
                pokemon,
                analysisMember?.ability,
                analysisMember?.item,
                store.currentTeam.generation,
              ).map(type => (
                <Box
                  key={type}
                  component="img"
                  src={typeIcons[type]}
                  alt={names.type(type)}
                  sx={{ width: 20, height: 20 }}
                />
              ))}
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
                sx={{
                  position: "absolute",
                  top: 0,
                  right: -8,
                  width: { xxs: 44, sm: 36 },
                  height: { xxs: 44, sm: 36 },
                }}
              >
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Box sx={{ position: "absolute", bottom: 4, left: 0, display: "flex" }}>
          <Tooltip title={randomTitle}>
            {/* Wrapped so the tooltip still works while the button is disabled */}
            <Box component="span" sx={{ display: "flex" }}>
              <Button
                size="small"
                variant="outlined"
                sx={cornerButton}
                disabled={!store.learnsetsLoaded}
                aria-label={t.team.randomFor(teamIndex + 1)}
                {...diceRoll}
                onClick={randomize}
              >
                <CasinoIcon sx={{ fontSize: 16 }} />
              </Button>
            </Box>
          </Tooltip>
        </Box>
        {/* As wide as the column, less Random, the gap after it, and the Details button's
            own icon and padding: the room its label has */}
        <Box
          component="span"
          ref={detailsRoom}
          sx={{
            position: "absolute",
            insetInline: 0,
            pl: "38px",
            pr: "34px",
            typography: "button",
            fontSize: 12,
            letterSpacing: 0,
            textTransform: "none",
          }}
        />
        {pokemon && (
          <Button
            size="small"
            variant="outlined"
            startIcon={detailsLabel ? <TuneIcon /> : undefined}
            sx={[cornerButton, { position: "absolute", bottom: 4, right: 0 }]}
            aria-label={t.team.advancedFor(teamIndex + 1)}
            title={detailsLabel ? undefined : t.team.advanced}
            onClick={() => store.openDialog("advanced", { teamIndex })}
          >
            {detailsLabel || <TuneIcon sx={{ fontSize: 16 }} />}
          </Button>
        )}
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
            leadingIcon={store.showMoveTypes}
          />
        ))}
        {store.rules.items && (
          <PokemonInput
            placeholder={t.team.item}
            teamIndex={teamIndex}
            pokemonProperty="item"
            leadingIcon={store.showMoveTypes}
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
