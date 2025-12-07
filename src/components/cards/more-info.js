import React, { useState } from "react";
import SwipeableViews from "react-swipeable-views";
// Material UI Imports
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
// My Component Imports
import TeamChecklist from "./more-info/team-checklist";
import SearchFilters from "./more-info/search-filters";
import PokemonShowdownTeam from "./more-info/pokemon-showdown-team";

// The stuff below each tab
const TabContainer = ({ children }) => (
  <Grid container justifyContent="center" style={{ padding: 14 }}>
    {children}
  </Grid>
);

const MoreInfo = ({ width }) => {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(0);

  // Click to change tab
  const handleChange = (event, value) => {
    setTabIndex(value);
  };

  // Swipe to change tab
  const handleChangeIndex = index => {
    setTabIndex(index);
  };

  let tabTitles = ["Search Filters", "Team Checklist", "Save/Load Team"];

  if (width !== "lg" && width !== "xl") {
    // If the screen is below 1200px
    tabTitles = ["Filters", "Checklist", "Save/Load"];
  }

  return (
    <Box sx={{ borderRadius: 1 }}>
      <AppBar
        position="static"
        color="default"
        sx={{ borderRadius: "4px 4px 0 0" }}
      >
        {/* E.g.  | Search Filters | Team Checklist | Pokemon Showdown Team | */}
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          {tabTitles.map(title => (
            <Tab label={title} key={title} sx={{ minWidth: "initial" }} />
          ))}
        </Tabs>
      </AppBar>
      {/* The stuff below the tabs */}
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={tabIndex}
        onChangeIndex={handleChangeIndex}
      >
        {[
          <SearchFilters />,
          <TeamChecklist width={width} />,
          <PokemonShowdownTeam width={width} />,
        ].map((component, i) => (
          <TabContainer key={i}>{component}</TabContainer>
        ))}
      </SwipeableViews>
    </Box>
  );
};

export default MoreInfo;
