import { useState, type ReactNode, type SyntheticEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TeamChecklist from "./more-info/TeamChecklist";
import SearchFilters from "./more-info/SearchFilters";
import PokemonShowdownTeam from "./more-info/PokemonShowdownTeam";
import { useBreakpoint } from "../../../WidthContext";

export default function MoreInfo() {
  const width = useBreakpoint();
  const [tabIndex, setTabIndex] = useState(0);

  // Click to change tab
  const handleChange = (_event: SyntheticEvent, value: number) => {
    setTabIndex(value);
  };

  let tabTitles = ["Search Filters", "Team Checklist", "Save/Load Team"];

  if (width !== "lg" && width !== "xl") {
    // If the screen is below 1200px
    tabTitles = ["Filters", "Checklist", "Save/Load"];
  }

  return (
    <Box>
      <AppBar
        position="static"
        color="default"
        sx={{ borderRadius: "4px 4px 0 0" }}
        enableColorOnDark
      >
        {/* E.g.  | Search Filters | Team Checklist | Pokemon Showdown Team | */}
        <Tabs value={tabIndex} onChange={handleChange} variant="fullWidth">
          {tabTitles.map(title => (
            <Tab label={title} key={title} sx={{ minWidth: "initial" }} />
          ))}
        </Tabs>
      </AppBar>
      {/* The stuff below the tabs */}
      {[<SearchFilters />, <TeamChecklist />, <PokemonShowdownTeam />].map(
        (component, i) =>
          tabIndex === i && <TabContainer key={i}>{component}</TabContainer>,
      )}
    </Box>
  );
}

// The stuff below each tab
const TabContainer = ({ children }: { children: ReactNode }) => (
  <Grid container justifyContent="center" style={{ padding: 14 }}>
    {children}
  </Grid>
);
