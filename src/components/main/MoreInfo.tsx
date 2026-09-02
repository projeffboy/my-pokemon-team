import { useState, type ReactNode, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
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
    <Grid size={12}>
      <Paper>
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
            sx={theme =>
              theme.palette.mode === "dark" ? { backgroundColor: "#222" } : {}
            }
          >
            {tabs.map(({ title, shortTitle }, index) => (
              <Tab
                id={`team-tool-tab-${index}`}
                aria-controls={`team-tool-panel-${index}`}
                aria-label={title}
                label={isLgDown ? shortTitle : title}
                key={title}
              />
            ))}
          </Tabs>
        </AppBar>
        {/* The stuff below the tabs */}
        {tabs.map(({ title, content }, index) => (
          // tab container
          <Grid
            id={`team-tool-panel-${index}`}
            aria-labelledby={`team-tool-tab-${index}`}
            role="tabpanel"
            hidden={tabIndex !== index}
            container
            justifyContent="center"
          >
            {tabIndex === index && content}
          </Grid>
        ))}
      </Paper>
    </Grid>
  );
}
