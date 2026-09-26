import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import CasinoIcon from "@mui/icons-material/Casino";
import TuneIcon from "@mui/icons-material/Tune";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { useIsMdDown } from "@/app/shared/WidthContext";
import { useTranslation } from "@/app/shared/TranslationContext";
import PokemonInput from "./pokemon-inputs/PokemonInput";
import PokemonSprite from "./PokemonSprite";
import { MOVE_KEYS } from "@/types";

const SLOT_NAV_CLASS = "slot-nav";

// Two of these share a card's left column, so they are as compact as a labelled button gets
const smallButton = {
  flex: "1 1 0",
  minWidth: 0,
  px: 0.5,
  fontSize: 11,
  letterSpacing: 0,
  whiteSpace: "nowrap",
  "& .MuiButton-startIcon": { mr: 0.5, ml: 0, "& > svg": { fontSize: 16 } },
} as const;

// One team slot: the name, sprite, and slot tools on the left, and the moves,
// item, and ability on the right. Moving a pokemon to another slot reports the
// slot it went to, so a tabbed viewer can follow it.
const PokemonInputs = observer(function PokemonInputs({
  teamIndex,
  onMoveToSlot,
}: {
  teamIndex: number;
  onMoveToSlot?: (teamIndex: number) => void;
}) {
  const { t, names } = useTranslation();
  const isMdDown = useIsMdDown();
  const showTools = !isMdDown || store.isMoreOpen;
  const pokemon = store.team[teamIndex]?.name ?? "";
  const label = names.pokemon(pokemon);

  const moveToSlot = (otherIndex: number) => {
    store.swapSlots(teamIndex, otherIndex);
    onMoveToSlot?.(otherIndex);
  };

  const slotNav = (direction: -1 | 1) => {
    const otherIndex = teamIndex + direction;
    const disabled = otherIndex < 0 || otherIndex >= store.team.length;
    const title = direction < 0 ? t.team.previousSlot : t.team.nextSlot;
    return (
      <Tooltip title={title}>
        <span>
          <IconButton
            className={SLOT_NAV_CLASS}
            size="small"
            aria-label={title}
            disabled={disabled}
            onClick={() => moveToSlot(otherIndex)}
          >
            {direction < 0 ?
              <ChevronLeftIcon />
            : <ChevronRightIcon />}
          </IconButton>
        </span>
      </Tooltip>
    );
  };

  return (
    <Box
      sx={{
        display: "grid",
        columnGap: 1,
        gridTemplateColumns: "1fr 1fr",
        // A long item's icon stops at the card's padding instead of widening the page
        overflow: "clip",
        // With a mouse, the slot arrows and info button appear when the card is hovered or focused
        "@media (hover: hover)": {
          [`& .${SLOT_NAV_CLASS}`]: {
            opacity: 0.3,
            transition: "opacity .15s",
          },
          [`&:hover .${SLOT_NAV_CLASS}, &:focus-within .${SLOT_NAV_CLASS}`]: {
            opacity: 1,
          },
        },
      }}
      role="region"
      aria-label={t.team.slot(teamIndex + 1)}
    >
      <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        {showTools && (
          <Box sx={{ display: "flex", gap: 0.75, pt: 0.5 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<FilterListIcon />}
              sx={smallButton}
              onClick={() => store.openDialog("filters", { teamIndex })}
            >
              {t.team.filters}
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<SortIcon />}
              sx={smallButton}
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
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            minHeight: 0,
            py: 0.5,
          }}
        >
          {slotNav(-1)}
          <Box
            sx={{
              position: "relative",
              flexGrow: 1,
              minWidth: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <PokemonSprite teamIndex={teamIndex} forceFullSize />
            {pokemon && (
              <Tooltip title={t.team.about(label)}>
                <IconButton
                  className={SLOT_NAV_CLASS}
                  size="small"
                  aria-label={t.team.about(label)}
                  onClick={() => store.openDialog("info", { teamIndex })}
                  sx={{ position: "absolute", top: -4, right: -4 }}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          {slotNav(1)}
        </Box>
        <Box sx={{ display: "flex", gap: 0.75, pb: 0.5 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<CasinoIcon />}
            sx={smallButton}
            disabled={!store.learnsetsLoaded}
            aria-label={t.team.randomFor(teamIndex + 1)}
            onClick={() => store.randomizeSlot(teamIndex)}
          >
            {t.team.random}
          </Button>
          {showTools && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<TuneIcon />}
              sx={smallButton}
              disabled={!pokemon}
              aria-label={t.team.advancedFor(teamIndex + 1)}
              onClick={() => store.openDialog("advanced", { teamIndex })}
            >
              {t.team.advanced}
            </Button>
          )}
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        {MOVE_KEYS.map(key => (
          <PokemonInput
            key={key}
            placeholder={t.team.move}
            teamIndex={teamIndex}
            pokemonProperty={key}
          />
        ))}
        <PokemonInput
          placeholder={t.team.item}
          teamIndex={teamIndex}
          pokemonProperty="item"
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
