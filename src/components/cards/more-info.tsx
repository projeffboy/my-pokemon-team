import React, { useState } from "react";
// Material UI Imports
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
// My Component Imports
import TeamChecklist from "./more-info/team-checklist";
import SearchFilters from "./more-info/search-filters";
import PokemonShowdownTeam from "./more-info/pokemon-showdown-team";
import { moreInfoStyles } from "../../styles";
import { Breakpoint } from "../../types";

interface MoreInfoProps {
  width: Breakpoint;
}

export default function MoreInfo({ width }: MoreInfoProps) {
  const [tabIndex, setTabIndex] = useState(0);

  // Click to change tab
  const handleChange = (_event: React.SyntheticEvent, value: number) => {
    setTabIndex(value);
  };

  let tabTitles = ["Search Filters", "Team Checklist", "Save/Load Team"];

  if (width !== "lg" && width !== "xl") {
    // If the screen is below 1200px
    tabTitles = ["Filters", "Checklist", "Save/Load"];
  }

  return (
    <Box sx={moreInfoStyles.root}>
      <AppBar
        position="static"
        color="default"
        sx={moreInfoStyles.appBar}
        enableColorOnDark
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
            <Tab label={title} key={title} sx={moreInfoStyles.tab} />
          ))}
        </Tabs>
      </AppBar>
      {/* The stuff below the tabs */}
      {[
        <SearchFilters />,
        <TeamChecklist width={width} />,
        <PokemonShowdownTeam width={width} />,
      ].map(
        (component, i) =>
          tabIndex === i && <TabContainer key={i}>{component}</TabContainer>
      )}
    </Box>
  );
}

// The stuff below each tab
const TabContainer = ({ children }: { children: React.ReactNode }) => (
  <Grid container justifyContent="center" style={{ padding: 14 }}>
    {children}
  </Grid>
);
