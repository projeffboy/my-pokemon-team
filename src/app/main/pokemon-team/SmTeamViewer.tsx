import { useState, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
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

const SmTeamViewer = observer(function SmTeamViewer() {
  const translation = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <SlotDragContext onMove={slot => setTabIndex(Math.floor(slot / 2))}>
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
              {[0, 2, 4].map(teamIndex => (
                <Tab
                  key={teamIndex}
                  id={`team-slot-tab-${teamIndex}`}
                  aria-controls={`team-slot-panel-${teamIndex}`}
                  aria-label={translation.t.team.slotPair(
                    getPokemonLabel(teamIndex, translation),
                    getPokemonLabel(teamIndex + 1, translation),
                  )}
                  // Three tabs at MUI's 90px minimum overflow the 200px at 600px wide
                  sx={{ p: 0, minWidth: 0 }}
                  icon={
                    <Box sx={{ display: "flex", width: "100%" }}>
                      <TabSlot teamIndex={teamIndex} />
                      <TabSlot teamIndex={teamIndex + 1} />
                    </Box>
                  }
                />
              ))}
            </Tabs>
            <DragHint />
          </>
        }
      />
      <Grid
        container
        size={12}
        spacing={3}
        id={`team-slot-panel-${2 * tabIndex}`}
        role="tabpanel"
        aria-labelledby={`team-slot-tab-${2 * tabIndex}`}
      >
        {[0, 1].map(offset => {
          const teamIndex = 2 * tabIndex + offset;

          return (
            <Grid key={offset} size={12}>
              <PokemonCard teamIndex={teamIndex} />
            </Grid>
          );
        })}
      </Grid>
    </SlotDragContext>
  );
});

export default SmTeamViewer;
