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
import { useTranslation } from "@/app/shared/TranslationContext";

const SmTeamViewer = observer(function SmTeamViewer() {
  const translation = useTranslation();
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
            aria-label={translation.t.team.slots}
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
                label={`${teamIndex + 1} - ${teamIndex + 2}`}
                sx={{
                  px: 0,
                  "& > :first-of-type": { pl: 1 },
                  "& > :last-of-type": { pr: 1 },
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
        <Paper sx={{ display: "flex" }}>
          <MoreToggle />
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
                <PokemonInputs
                  teamIndex={teamIndex}
                  onMoveToSlot={slot => setTabIndex(Math.floor(slot / 2))}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
});

export default SmTeamViewer;
