import { useState, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { observer } from "mobx-react";
import PokemonInputs from "../PokemonInputs";
import PokemonSprite from "../pokemon-input/PokemonSprite";
import getPokemonLabel from "./getPokemonLabel";

const SmTeamViewer = observer(function SmTeamViewer() {
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
            {[0, 2, 4].map(teamIndex => (
              <Tab
                key={teamIndex}
                id={`team-slot-tab-${teamIndex}`}
                aria-controls={`team-slot-panel-${teamIndex}`}
                aria-label={`${getPokemonLabel(teamIndex)} and ${getPokemonLabel(teamIndex + 1)}`}
                label={`${teamIndex + 1} - ${teamIndex + 2}`}
                sx={{
                  px: 0,
                  "& > :first-child": { pl: 1 },
                  "& > :last-child": { pr: 1 },
                }}
                icon={
                  <Box sx={{ display: "flex", height: 75 }} aria-hidden="true">
                    <PokemonSprite teamIndex={teamIndex} />
                    <PokemonSprite teamIndex={teamIndex + 1} />
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Paper>
      </Grid>
      <Grid
        container
        size={12}
        spacing={2}
        id={`team-slot-panel-${2 * tabIndex}`}
        role="tabpanel"
        aria-labelledby={`team-slot-tab-${2 * tabIndex}`}
      >
        {[0, 1].map(offset => {
          const teamIndex = 2 * tabIndex + offset;

          return (
            <Grid key={offset} size={12}>
              <Paper sx={{ p: 1 }}>
                <PokemonInputs teamIndex={teamIndex} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
});

export default SmTeamViewer;
