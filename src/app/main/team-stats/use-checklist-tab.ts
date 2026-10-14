import { useLayoutEffect, useRef, useState, type RefObject } from "react";

// The room the checklist needs under the stats to stay with them. It is about 200px tall with
// its gap, so the analysis may end up to 120px below the team: showing the checklist is
// worth a column that runs a little long, but not one that runs far past the team.
const ROOM_FOR_CHECKLIST = 80;

// Whether the checklist gets a view of its own, so the analysis column does not run far
// past the team column. It does when the stats alone come close to the team column's
// height, or pass it.
export default function useChecklistTab(
  teamColumn: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const panel = useRef<HTMLElement>(null);
  const [ownTab, setOwnTab] = useState(false);
  const [measured, setMeasured] = useState<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const team = teamColumn.current;
    if (!enabled || !team || !panel.current || !measured) return;
    const section = panel.current;
    const update = () =>
      setOwnTab(
        measured.getBoundingClientRect().bottom -
          section.getBoundingClientRect().top >
          team.getBoundingClientRect().height - ROOM_FOR_CHECKLIST,
      );
    update();
    const observer = new ResizeObserver(update);
    observer.observe(team);
    observer.observe(measured);
    return () => observer.disconnect();
  }, [teamColumn, enabled, measured]);

  return {
    panel,
    // A callback ref, so the measuring starts once the stats are there
    stats: setMeasured,
    ownTab: enabled && ownTab,
  };
}
