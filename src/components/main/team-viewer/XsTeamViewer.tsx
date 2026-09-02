import { useState, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { observer } from "mobx-react";
import PokemonInputs from "../PokemonInputs";
import PokemonSprite from "../pokemon-inputs/PokemonSprite";
import getPokemonLabel from "./getPokemonLabel";

const XsTeamViewer = observer(function XsTeamViewer() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <Grid size={12}>
        <Paper>
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
                sx={{ minWidth: 0 }}
                icon={
                  <Box aria-hidden="true">
                    <PokemonSprite teamIndex={teamIndex} />
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Paper>
      </Grid>
      <Grid
        size={12}
        id={`team-slot-panel-${tabIndex}`}
        role="tabpanel"
        aria-labelledby={`team-slot-tab-${tabIndex}`}
      >
        <Paper sx={{ p: 1 }}>
          <PokemonInputs teamIndex={tabIndex} />
        </Paper>
      </Grid>
    </>
  );
});

export default XsTeamViewer;
