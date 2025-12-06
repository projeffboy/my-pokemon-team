import React, { useState } from "react";
// Material UI Imports
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
// My Component Imports
import { paperStyles, teamViewerStyles } from "../../styles";
import Pokemon from "./pokemon";
import Sprite from "./pokemon/sprite";

/*
 * NOTE!!!
 * This component can only be viewed below a viewport width of 960px
 */
const TeamViewer = ({ classes, width }) => {
  const [smTabIndex, setSmTabIndex] = useState(0);
  const [xsTabIndex, setXsTabIndex] = useState(0);

  // Changge smTabIndex betwen 600px and 959px
  // Change xsTabIndex below 600px
  const handleChange = (e, val) => {
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
  const getTwoPokemonSprites = (teamIndex) => {
    return (
      <div className={classes.twoSprites}>
        <Sprite teamIndex={teamIndex} width={width} />
        <Sprite teamIndex={teamIndex + 1} width={width} />
      </div>
    );
  };

  return (
    <>
      <Grid item xs={12}>
        <Paper>
          <Tabs
            value={width === "sm" ? smTabIndex : xsTabIndex}
            onChange={handleChange}
            variant="fullWidth"
            textColor="secondary"
          >
            {
              // Either displays 3 or 6 tabs
              width === "sm"
                ? [0, 2, 4].map((teamIndex) => (
                    <Tab
                      key={teamIndex}
                      label={`${teamIndex + 1} - ${teamIndex + 2}`}
                      icon={getTwoPokemonSprites(teamIndex)}
                    />
                  ))
                : [0, 1, 2, 3, 4, 5].map((teamIndex) => (
                    <Tab
                      key={teamIndex}
                      label={teamIndex + 1}
                      className={classes.xsTab}
                      icon={<Sprite teamIndex={teamIndex} width={width} />}
                    />
                  ))
            }
          </Tabs>
        </Paper>
      </Grid>
      {
        // Either displays 2 or 1 pokemon at a time
        width === "sm" ? (
          [0, 1].map((num) => (
            <Grid key={num} item xs={12}>
              <Paper
                className={`${classes.applyPadding} ${classes.oneOfTwoPkmn}`}
              >
                <Pokemon teamIndex={2 * smTabIndex + num} width={width} />
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper
              className={`${classes.applyPadding} ${classes.oneOfTwoPkmn}`}
            >
              <Pokemon teamIndex={xsTabIndex} width={width} />
            </Paper>
          </Grid>
        )
      }
    </>
  );
};

export default withStyles({ ...paperStyles, ...teamViewerStyles })(TeamViewer);
