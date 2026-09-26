import { useState, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { observer } from "mobx-react-lite";
import store from "@/store";
import PokemonInputs from "./shared/PokemonInputs";
import PokemonSprite from "./shared/PokemonSprite";
import MoreToggle from "./shared/MoreToggle";
import getPokemonLabel from "./shared/get-pokemon-label";
import TeamToolbar from "./TeamToolbar";

const XsTeamViewer = observer(function XsTeamViewer() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      {store.isMoreOpen && (
        <Grid size={12}>
          <Paper sx={{ px: 1, py: 0.5 }}>
            <TeamToolbar />
          </Paper>
        </Grid>
      )}
      <Grid size={12} sx={{ display: "flex", gap: 1 }}>
        <Paper sx={{ flexGrow: 1, minWidth: 0 }}>
          <Tabs
            value={tabIndex}
            onChange={(_event: SyntheticEvent, value: number) =>
              setTabIndex(value)
            }
            variant="fullWidth"
            textColor="secondary"
            aria-label="Pokemon team slots"
          >
            {[0, 1, 2, 3, 4, 5].map(teamIndex => (
              <Tab
                key={teamIndex}
                id={`team-slot-tab-${teamIndex}`}
                aria-controls={`team-slot-panel-${teamIndex}`}
                aria-label={getPokemonLabel(teamIndex)}
                label={teamIndex + 1}
                sx={{
                  minWidth: 0,
                  px: 0,
                  "& > :first-of-type": { pl: 1 },
                  "& > :last-of-type": { pr: 1 },
                }}
                icon={
                  <Box aria-hidden="true">
                    <PokemonSprite teamIndex={teamIndex} />
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Paper>
        <Paper sx={{ display: "flex" }}>
          <MoreToggle />
        </Paper>
      </Grid>
      <Grid
        size={12}
        id={`team-slot-panel-${tabIndex}`}
        role="tabpanel"
        aria-labelledby={`team-slot-tab-${tabIndex}`}
      >
        <Paper sx={{ p: 1 }}>
          <PokemonInputs teamIndex={tabIndex} onMoveToSlot={setTabIndex} />
        </Paper>
      </Grid>
    </>
  );
});

export default XsTeamViewer;
