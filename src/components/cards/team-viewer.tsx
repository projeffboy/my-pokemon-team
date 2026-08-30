import React, { useState } from "react";
// Material UI Imports
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
// My Component Imports
import Pokemon from "./pokemon";
import Sprite from "./pokemon/sprite";
import { useBreakpoint } from "../../width-context";

/*
 * NOTE!!!
 * This component can only be viewed below a viewport width of 960px
 */
export default function TeamViewer() {
  const width = useBreakpoint();
  // Store separate selections for the 3-tab and 6-tab layouts.
  const [smTabIndex, setSmTabIndex] = useState(0);
  const [xsTabIndex, setXsTabIndex] = useState(0);

  // Changge smTabIndex betwen 600px and 959px
  // Change xsTabIndex below 600px
  const handleChange = (_e: React.SyntheticEvent, val: number) => {
    if (width === "sm") {
      setSmTabIndex(val);
    } else {
      setXsTabIndex(val);
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
        <Sprite teamIndex={teamIndex} />
        <Sprite teamIndex={teamIndex + 1} />
      </div>
    );
  };

  return (
    <>
      <Grid size={12}>
        <Paper>
          <Tabs
            value={width === "sm" ? smTabIndex : xsTabIndex}
            onChange={handleChange}
            variant="fullWidth"
            textColor="secondary"
          >
            {
              // Either displays 3 or 6 tabs
              width === "sm" ?
                [0, 2, 4].map(teamIndex => (
                  <Tab
                    key={teamIndex}
                    label={`${teamIndex + 1} - ${teamIndex + 2}`}
                    icon={getTwoPokemonSprites(teamIndex)}
                  />
                ))
              : [0, 1, 2, 3, 4, 5].map(teamIndex => (
                  <Tab
                    key={teamIndex}
                    label={teamIndex + 1}
                    sx={{ minWidth: 0 }}
                    icon={<Sprite teamIndex={teamIndex} />}
                  />
                ))

            }
          </Tabs>
        </Paper>
      </Grid>
      {
        // Either displays 2 or 1 pokemon at a time
        width === "sm" ?
          [0, 1].map(num => (
            <Grid key={num} size={12}>
              <Paper sx={{ padding: "8px" }}>
                <Pokemon teamIndex={2 * smTabIndex + num} />
              </Paper>
            </Grid>
          ))
        : <Grid size={12}>
            <Paper sx={{ padding: "8px" }}>
              <Pokemon teamIndex={xsTabIndex} />
            </Paper>
          </Grid>

      }
    </>
  );
}
