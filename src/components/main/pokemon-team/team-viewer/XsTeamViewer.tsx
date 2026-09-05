import { useState, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LinkIcon from "@mui/icons-material/Link";
import { observer } from "mobx-react";
import store from "@/store";
import PokemonInputs from "../PokemonInputs";
import PokemonSprite from "../pokemon-input/PokemonSprite";
import getPokemonLabel from "./getPokemonLabel";

const XsTeamViewer = observer(function XsTeamViewer() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleShare = async () => {
    if (store.isTeamEmpty) {
      store.openSnackbar("Pokemon team is empty");
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      store.openSnackbar("Pokemon team link copied");
    } catch {
      store.openSnackbar("Couldn't copy the link.");
    }
  };

  return (
    <>
      <Grid size={12}>
        <Paper sx={{ display: "flex", alignItems: "stretch" }}>
          <Tabs
            value={tabIndex}
            onChange={(_event: SyntheticEvent, value: number) =>
              setTabIndex(value)
            }
            variant="fullWidth"
            textColor="secondary"
            aria-label="Pokemon team slots"
            sx={{ flexGrow: 1, minWidth: 0 }}
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
                  "& > :first-child": { pl: 1 },
                  "& > :last-child": { pr: 1 },
                }}
                icon={
                  <Box aria-hidden="true">
                    <PokemonSprite teamIndex={teamIndex} />
                  </Box>
                }
              />
            ))}
          </Tabs>
          <Button
            onClick={handleShare}
            aria-label="Share pokemon team link"
            sx={{ minWidth: 0, px: 1.5, flexDirection: "column" }}
          >
            <LinkIcon fontSize="small" />
            <Typography variant="caption" component="span">
              Share
            </Typography>
          </Button>
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
