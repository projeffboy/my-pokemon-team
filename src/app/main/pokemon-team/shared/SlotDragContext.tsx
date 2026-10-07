import { useState, type ReactNode } from "react";
import Box from "@mui/material/Box";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  pointerWithin,
  useSensor,
  useSensors,
  type Active,
  type CollisionDetection,
  type Over,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import store from "@/store";
import PokemonCard from "./PokemonCard";
import { TabSlotContent, tabSlot } from "./TabSlot";
import { MoveSlotContext, isTab, tabId } from "./use-slot-drag";

const slotOf = (item: Active | Over | null) => {
  const teamIndex: unknown = item?.data.current?.teamIndex;
  return typeof teamIndex === "number" ? teamIndex : undefined;
};

const TAB_IDS = [0, 1, 2, 3, 4, 5].map(tabId);

// A tab lands on the slot nearest it, and a card on the card under the pointer
const collisionDetection: CollisionDetection = args =>
  isTab(args.active.id) ? closestCenter(args) : pointerWithin(args);

const silent = () => undefined;
const announcements = {
  onDragStart: silent,
  onDragOver: silent,
  onDragEnd: silent,
  onDragCancel: silent,
};

// Lets a slot tab be dragged along the row to reorder the team, and a desktop
// card onto another card to swap the two. `onMove` reports the slot
// the pokemon went to.
export default function SlotDragContext({
  onMove,
  children,
}: {
  onMove?: (teamIndex: number) => void;
  children: ReactNode;
}) {
  const [dragged, setDragged] = useState<Active>();
  // A click or a scroll is not a drag: the mouse has to travel, and a finger has to hold
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
  );

  const moveSlot = (teamIndex: number, otherIndex: number) => {
    if (teamIndex === otherIndex) return;
    store.swapSlots(teamIndex, otherIndex);
    onMove?.(otherIndex);
  };

  return (
    <MoveSlotContext.Provider value={moveSlot}>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        // The slot's menu is the keyboard and screen reader route, so the
        // library's English announcements stay out of the page
        accessibility={{
          announcements,
          screenReaderInstructions: { draggable: "" },
          container: document.body,
        }}
        onDragStart={({ active }) => {
          setDragged(active);
          if (!isTab(active.id)) return;
          store.knowsSlotDrag = true;
          // A tick as the slot lifts, where the device can vibrate
          if ("vibrate" in navigator) navigator.vibrate(10);
        }}
        onDragCancel={() => setDragged(undefined)}
        onDragEnd={({ active, over }) => {
          setDragged(undefined);
          const teamIndex = slotOf(active);
          const otherIndex = slotOf(over);
          if (teamIndex === undefined || otherIndex === undefined) return;
          if (!isTab(active.id)) return moveSlot(teamIndex, otherIndex);
          if (teamIndex === otherIndex) return;
          store.moveSlot(teamIndex, otherIndex);
          onMove?.(otherIndex);
        }}
      >
        <SortableContext
          items={TAB_IDS}
          strategy={horizontalListSortingStrategy}
        >
          {children}
        </SortableContext>
        <DragOverlay dropAnimation={null}>
          {dragged && isTab(dragged.id) && (
            <Box
              sx={[
                tabSlot,
                {
                  height: "100%",
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  boxShadow: 6,
                  cursor: "grabbing",
                },
              ]}
            >
              <TabSlotContent teamIndex={slotOf(dragged) ?? 0} />
            </Box>
          )}
          {dragged && !isTab(dragged.id) && (
            // Sized to the card's contents, so the paper extends past them by the card's padding
            <PokemonCard teamIndex={slotOf(dragged) ?? 0} isDragOverlay />
          )}
        </DragOverlay>
      </DndContext>
    </MoveSlotContext.Provider>
  );
}
