import { createContext, useContext } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import store from "@/store";
import { useIsMdDown } from "@/app/shared/WidthContext";

// Shared by everything that can be dragged, so the sprite drags instead of the image
export const dragHandle = {
  cursor: "grab",
  touchAction: "manipulation",
  userSelect: "none",
  WebkitTouchCallout: "none",
  "& img": { pointerEvents: "none" },
} as const;

export const dropTarget = {
  outline: "2px solid",
  outlineColor: "secondary.main",
  borderRadius: 1,
} as const;

type MoveSlot = (teamIndex: number, otherIndex: number) => void;

export const MoveSlotContext = createContext<MoveSlot>(
  (teamIndex, otherIndex) => store.swapSlots(teamIndex, otherIndex),
);

// Swaps two slots, and tells a tabbed viewer where the pokemon went
export const useMoveSlot = () => useContext(MoveSlotContext);

// The slot tabs' ids, which reorder as a list
export const tabId = (teamIndex: number) => `tab-${teamIndex}`;
export const isTab = (id: unknown) =>
  typeof id === "string" && id.startsWith("tab-");

// A desktop card can be dragged by its grip onto another card. On phones and
// tablets the slot tabs do that instead. Call it from an observer, so an
// emptied slot stops being draggable. The copy of the card that follows the
// pointer is inert: it is neither draggable nor a drop target.
export default function useSlotDrag(teamIndex: number, isOverlay = false) {
  const id = `${isOverlay ? "overlay-" : ""}card-${teamIndex}`;
  const data = { teamIndex };
  const isMdDown = useIsMdDown();
  const hasPokemon = Boolean(store.team[teamIndex]?.name);
  const draggable = useDraggable({
    id,
    data,
    disabled: isOverlay || !hasPokemon,
  });
  const droppable = useDroppable({ id, data, disabled: isOverlay || isMdDown });
  const draggedSlot: unknown = droppable.active?.data.current?.teamIndex;

  return {
    setCardRef: (node: HTMLElement | null) => {
      draggable.setNodeRef(node);
      droppable.setNodeRef(node);
    },
    setGripRef: draggable.setActivatorNodeRef,
    listeners: draggable.listeners,
    isDragged:
      !isOverlay && draggedSlot === teamIndex && !isTab(droppable.active?.id),
    isTarget: droppable.isOver && draggedSlot !== teamIndex,
  };
}
