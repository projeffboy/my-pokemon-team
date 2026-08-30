import React from "react";
// Material UI Imports
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
// My Component Imports
import { paperStyles, teamViewerStyles } from "../../styles";
import Pokemon from "./pokemon";
import Sprite from "./pokemon/sprite";
import { Breakpoint } from "../../types";

interface TeamViewerProps {
  width: Breakpoint;
}

interface TeamViewerState {
  smTabIndex: number;
  xsTabIndex: number;
}

/*
 * NOTE!!!
 * This component can only be viewed below a viewport width of 960px
 */
export default class TeamViewer extends React.Component<
  TeamViewerProps,
  TeamViewerState
> {
  constructor(props: TeamViewerProps) {
    super(props);

    /*
     * Depending on your viewport, either 3 or 6 tabs are shown.
     * smTabIndex stores which of the 3 tabs are clicked/focused on.
     * xsTabIndex stores which of the 6 tabs are clicked/focused on.
     */
    this.state = {
      smTabIndex: 0,
      xsTabIndex: 0,
    };
  }

  // Changge smTabIndex betwen 600px and 959px
  // Change xsTabIndex below 600px
  handleChange = (_e: React.SyntheticEvent, val: number) => {
    if (this.props.width === "sm") {
      this.setState({ smTabIndex: val });
    } else {
      this.setState({ xsTabIndex: val });
    }
  };

  /*
   * Returns two mini sprites
   * Of either the pokemon in team slot 1 and 2,
   * 3 and 4,
   * or 5 and 6.
   */
  getTwoPokemonSprites(teamIndex: number) {
    const { width } = this.props;

    return (
      <div style={teamViewerStyles.twoSprites}>
        <Sprite teamIndex={teamIndex} width={width} />
        <Sprite teamIndex={teamIndex + 1} width={width} />
      </div>
    );
  }

  render() {
    const { width } = this.props;
    const { smTabIndex, xsTabIndex } = this.state;

    const pokemonPaperSx = {
      ...paperStyles.applyPadding,
      ...teamViewerStyles.oneOfTwoPkmn,
    };

    return (
      <>
        <Grid size={12}>
          <Paper>
            <Tabs
              value={width === "sm" ? smTabIndex : xsTabIndex}
              onChange={this.handleChange}
              variant="fullWidth"
              textColor="secondary"
            >
              {
                // Either displays 3 or 6 tabs
                width === "sm"
                  ? [0, 2, 4].map(teamIndex => (
                      <Tab
                        key={teamIndex}
                        label={`${teamIndex + 1} - ${teamIndex + 2}`}
                        icon={this.getTwoPokemonSprites(teamIndex)}
                      />
                    ))
                  : [0, 1, 2, 3, 4, 5].map(teamIndex => (
                      <Tab
                        key={teamIndex}
                        label={teamIndex + 1}
                        sx={teamViewerStyles.xsTab}
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
            [0, 1].map(num => (
              <Grid key={num} size={12}>
                <Paper sx={pokemonPaperSx}>
                  <Pokemon teamIndex={2 * smTabIndex + num} width={width} />
                </Paper>
              </Grid>
            ))
          ) : (
            <Grid size={12}>
              <Paper sx={pokemonPaperSx}>
                <Pokemon teamIndex={xsTabIndex} width={width} />
              </Paper>
            </Grid>
          )
        }
      </>
    );
  }
}
