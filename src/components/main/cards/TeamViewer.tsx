import { useState, type SyntheticEvent } from "react";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import PokemonInputs from "./PokemonInputs";
import PokemonSprite from "./pokemon-inputs/PokemonSprite";
import { useBreakpoint } from "../../../WidthContext";

// This component can only be viewed below md breakpoint
export default function TeamViewer() {
  const width = useBreakpoint();
  // Store separate selections for the 3-tab and 6-tab layouts.
  const [smTabIndex, setSmTabIndex] = useState(0);
  const [xsTabIndex, setXsTabIndex] = useState(0);

  // Changge smTabIndex betwen 600px and 959px
  // Change xsTabIndex below 600px
  const handleChange = (_e: SyntheticEvent, val: number) => {
    if (width === "xs") {
      setXsTabIndex(val);
    } else {
      setSmTabIndex(val);
    }
  };

  /*
   * Returns two mini sprites
   * Of either the pokemon in team slot 1 and 2,
   * 3 and 4,
   * or 5 and 6.
   */
  const getTwoPokemonSprites = (teamIndex: number) => {
    return (
      <div style={{ display: "flex", height: 75 }}>
        <PokemonSprite teamIndex={teamIndex} />
        <PokemonSprite teamIndex={teamIndex + 1} />
      </div>
    );
  };

  return (
    <>
      <Grid size={12}>
        <Paper>
          <Tabs
            value={width === "xs" ? xsTabIndex : smTabIndex}
            onChange={handleChange}
            variant="fullWidth"
            textColor="secondary"
          >
            {
              // Either displays 6 or 3 tabs
              width === "xs" ?
                [0, 1, 2, 3, 4, 5].map(teamIndex => (
                  <Tab
                    key={teamIndex}
                    label={teamIndex + 1}
                    sx={{ minWidth: 0 }}
                    icon={<PokemonSprite teamIndex={teamIndex} />}
                  />
                ))
              : [0, 2, 4].map(teamIndex => (
                  <Tab
                    key={teamIndex}
                    label={`${teamIndex + 1} - ${teamIndex + 2}`}
                    icon={getTwoPokemonSprites(teamIndex)}
                  />
                ))

            }
          </Tabs>
        </Paper>
      </Grid>
      {
        // Either displays 1 or 2 pokemon at a time
        width === "xs" ?
          <Grid size={12}>
            <Paper sx={{ p: 1 }}>
              <PokemonInputs teamIndex={xsTabIndex} />
            </Paper>
          </Grid>
        : [0, 1].map(num => (
            <Grid key={num} size={12}>
              <Paper sx={{ p: 1 }}>
                <PokemonInputs teamIndex={2 * smTabIndex + num} />
              </Paper>
            </Grid>
          ))

      }
    </>
  );
}
