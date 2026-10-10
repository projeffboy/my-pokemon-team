import { useState } from "react";
import Box from "@mui/material/Box";
import { keyframes } from "@mui/material/styles";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { observer } from "mobx-react-lite";
import store from "@/store";
import PokemonSprite from "@/app/shared/PokemonSprite";
import { dragHandle, tabId } from "./use-slot-drag";

type Props = { teamIndex: number };

const LIFT_CLASS = "slot-lift";

// Once per page, while the drag hint shows, the first pokemon shows it can move
const wiggle = keyframes`
  0%, 100% { transform: none; }
  20% { transform: translateX(-4px) rotate(-4deg); }
  40% { transform: translateX(4px) rotate(4deg); }
  60% { transform: translateX(-3px) rotate(-3deg); }
  80% { transform: translateX(2px) rotate(2deg); }
`;

// A slot's grip, sprite, and number, in the slot tabs and while it is dragged
export const TabSlotContent = observer(function TabSlotContent({
  teamIndex,
}: Props) {
  const [hasWiggled, setHasWiggled] = useState(false);
  const hasPokemon = Boolean(store.team[teamIndex]?.name);
  const hasAnyPokemon = store.team.some(({ name }) => name);
  const wiggles =
    !hasWiggled &&
    store.showDragHint &&
    store.team.findIndex(({ name }) => name) === teamIndex;
  const classicSprites =
    store.currentTeam.generation >= 2 && store.currentTeam.generation <= 4;

  return (
    <Box
      className={LIFT_CLASS}
      onAnimationEnd={event => {
        if (event.target === event.currentTarget) setHasWiggled(true);
      }}
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transition: "scale 200ms",
        },
        wiggles && {
          animation: `${wiggle} 600ms ease-in-out ${classicSprites ? "5s" : "800ms"}`,
          '[role="tablist"]:has([data-selection-animating]) &': {
            animationName: "none",
            animationPlayState: "paused",
          },
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        },
      ]}
    >
      {hasAnyPokemon && (
        <DragIndicatorIcon
          // Reserve grip space across the row so the sprites line up
          sx={{
            fontSize: 16,
            transform: "rotate(90deg)",
            visibility: hasPokemon ? "visible" : "hidden",
          }}
        />
      )}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          // Sprites are square, so the row keeps its height while they load
          aspectRatio: "1",
          boxSizing: "content-box",
          // Phones from 400px have room to space the sprites out
          py: { xxs: 0, xs: 0.5, sm: 0 },
        }}
        aria-hidden="true"
      >
        <PokemonSprite teamIndex={teamIndex} />
      </Box>
      {teamIndex + 1}
    </Box>
  );
});

export const tabSlot = {
  flex: "1 1 0",
  minWidth: 0,
  // Six slots share a row on phones and 200px on a 600px tablet,
  // so the sprites get all the width they can
  px: 0.25,
  pb: 0.75,
} as const;

// A slot in the slot tabs. One that holds a pokemon drags along the row, and
// the others slide aside to make room for it.
const TabSlot = observer(function TabSlot({ teamIndex }: Props) {
  const hasPokemon = Boolean(store.team[teamIndex]?.name);
  const {
    setNodeRef,
    listeners,
    attributes,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: tabId(teamIndex),
    data: { teamIndex },
    disabled: { draggable: !hasPokemon, droppable: false },
    // The team reorders as the slot drops, so the slots already stand where
    // they slid to, and sliding them back would show the wrong pokemon
    animateLayoutChanges: () => false,
  });

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      aria-roledescription={attributes["aria-roledescription"]}
      // eslint-disable-next-line no-restricted-syntax -- dnd-kit moves each slot as it is dragged past
      style={{ transform: CSS.Translate.toString(transform), transition }}
      sx={[
        tabSlot,
        { position: "relative", zIndex: 1 },
        hasPokemon && dragHandle,
        // A held slot grows over the hold that starts a drag
        hasPokemon && { [`&:active .${LIFT_CLASS}`]: { scale: "1.12" } },
        // The dragged slot follows the pointer, leaving its place in the row blank
        isDragging && { visibility: "hidden" },
      ]}
    >
      <TabSlotContent teamIndex={teamIndex} />
    </Box>
  );
});

export default TabSlot;
