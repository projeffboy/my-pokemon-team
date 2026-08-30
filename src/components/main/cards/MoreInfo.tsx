import { useState, type ReactNode, type SyntheticEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TeamChecklist from "./more-info/TeamChecklist";
import SearchFilters from "./more-info/SearchFilters";
import PokemonShowdownTeam from "./more-info/PokemonShowdownTeam";
import { useIsLgDown } from "@/WidthContext";

export default function MoreInfo() {
  const isLgDown = useIsLgDown();
  const [tabIndex, setTabIndex] = useState(0);

  // Click to change tab
  const handleChange = (_event: SyntheticEvent, value: number) => {
    setTabIndex(value);
  };

  const tabs = [
    {
      title: "Search Filters",
      shortTitle: "Filters",
      content: <SearchFilters />,
    },
    {
      title: "Team Checklist",
      shortTitle: "Checklist",
      content: <TeamChecklist />,
    },
    {
      title: "Save/Load Team",
      shortTitle: "Save/Load",
      content: <PokemonShowdownTeam />,
    },
  ];

  return (
    <Box>
      <AppBar
        position="static"
        color="default"
        sx={{ borderRadius: "4px 4px 0 0" }}
        enableColorOnDark
      >
        {/* E.g.  | Search Filters | Team Checklist | Pokemon Showdown Team | */}
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          variant="fullWidth"
          aria-label="Team tools"
        >
          {tabs.map(({ title, shortTitle }, index) => (
            <Tab
              id={`team-tool-tab-${index}`}
              aria-controls={`team-tool-panel-${index}`}
              aria-label={title}
              label={isLgDown ? shortTitle : title}
              key={title}
              sx={{ minWidth: "initial" }}
            />
          ))}
        </Tabs>
      </AppBar>
      {/* The stuff below the tabs */}
      {tabs.map(({ title, content }, index) => (
        <TabContainer key={title} index={index} value={tabIndex}>
          {content}
        </TabContainer>
      ))}
    </Box>
  );
}

// The stuff below each tab
const TabContainer = ({
  children,
  index,
  value,
}: {
  children: ReactNode;
  index: number;
  value: number;
}) => (
  <Grid
    id={`team-tool-panel-${index}`}
    aria-labelledby={`team-tool-tab-${index}`}
    role="tabpanel"
    hidden={value !== index}
    container
    justifyContent="center"
    style={{ padding: 14 }}
  >
    {value === index && children}
  </Grid>
);
