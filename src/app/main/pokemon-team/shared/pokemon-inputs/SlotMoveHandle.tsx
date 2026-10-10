import { useState } from "react";
import ButtonBase from "@mui/material/ButtonBase";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { useTranslation } from "@/app/shared/TranslationContext";
import getPokemonLabel from "../get-pokemon-label";
import { dragHandle, useMoveSlot } from "../use-slot-drag";

// A grip jutting out of the card's top left corner: dragging it moves the card
// to the slot it is dropped on, and clicking it lists the slots instead
const chip = {
  position: "absolute",
  top: -8,
  left: -26,
  zIndex: 1,
  p: 0.25,
  width: 22,
  height: 28,
  borderRadius: "4px 0 0 4px",
  color: "text.secondary",
  "&:hover": { bgcolor: "action.hover" },
  "&:focus-visible": { bgcolor: "action.focus" },
} as const;

const SlotMoveHandle = observer(function SlotMoveHandle({
  teamIndex,
  setGripRef,
  listeners,
}: {
  teamIndex: number;
  setGripRef: (node: HTMLElement | null) => void;
  listeners: Record<string, unknown> | undefined;
}) {
  const translation = useTranslation();
  const moveSlot = useMoveSlot();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const pokemon = store.team[teamIndex]?.name ?? "";

  // There is nothing to move out of an empty slot
  if (!pokemon) return null;

  const title = translation.t.team.moveToSlot(
    translation.names.pokemon(pokemon),
  );

  return (
    <>
      <Tooltip title={title}>
        <ButtonBase
          ref={setGripRef}
          {...listeners}
          aria-label={title}
          aria-haspopup="menu"
          onClick={event => setAnchor(event.currentTarget)}
          sx={[chip, dragHandle]}
        >
          <DragIndicatorIcon sx={{ fontSize: 18 }} />
        </ButtonBase>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
      >
        {store.team.map(
          (_member, otherIndex) =>
            otherIndex !== teamIndex && (
              <MenuItem
                key={otherIndex}
                onClick={() => {
                  setAnchor(null);
                  moveSlot(teamIndex, otherIndex);
                }}
              >
                {getPokemonLabel(otherIndex, translation)}
              </MenuItem>
            ),
        )}
      </Menu>
    </>
  );
});

export default SlotMoveHandle;
