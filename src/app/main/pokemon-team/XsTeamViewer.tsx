import { useState, type SyntheticEvent } from "react";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { observer } from "mobx-react-lite";
import PokemonCard from "./shared/PokemonCard";
import SlotDragContext from "./shared/SlotDragContext";
import TabSlot from "./shared/TabSlot";
import DragHint from "./shared/DragHint";
import TeamBar from "./shared/TeamBar";
import getPokemonLabel from "./shared/get-pokemon-label";
import { useTranslation } from "@/app/shared/TranslationContext";

const XsTeamViewer = observer(function XsTeamViewer() {
  const translation = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <SlotDragContext onMove={setTabIndex}>
      <TeamBar
        tabs={
          <>
            <Tabs
              value={tabIndex}
              onChange={(_event: SyntheticEvent, value: number) =>
                setTabIndex(value)
              }
              variant="fullWidth"
              textColor="secondary"
              aria-label={translation.t.team.slots}
              // A dragged slot's neighbours slide over into the next tab
              sx={{
                "& .MuiTabs-scroller, & .MuiTab-root": { overflow: "visible" },
              }}
            >
              {[0, 1, 2, 3, 4, 5].map(teamIndex => (
                <Tab
                  key={teamIndex}
                  id={`team-slot-tab-${teamIndex}`}
                  aria-controls={`team-slot-panel-${teamIndex}`}
                  aria-label={getPokemonLabel(teamIndex, translation)}
                  sx={{ minWidth: 0, p: 0 }}
                  icon={<TabSlot teamIndex={teamIndex} />}
                />
              ))}
            </Tabs>
            <DragHint />
          </>
        }
      />
      <Grid
        size={12}
        id={`team-slot-panel-${tabIndex}`}
        role="tabpanel"
        aria-labelledby={`team-slot-tab-${tabIndex}`}
      >
        <PokemonCard teamIndex={tabIndex} />
      </Grid>
    </SlotDragContext>
  );
});

export default XsTeamViewer;
