import { useState, type SyntheticEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { grey } from "@mui/material/colors";
import TeamChecklist from "./more-info/TeamChecklist";
import SearchFilters from "./more-info/SearchFilters";
import PokemonShowdownTeam from "./more-info/SaveLoadTeam";
import { useIsLgDown } from "@/app/shared/WidthContext";

const TABS = [
  { title: "Search Filters", shortTitle: "Filters", Content: SearchFilters },
  { title: "Team Checklist", shortTitle: "Checklist", Content: TeamChecklist },
  {
    title: "Save/Load Team",
    shortTitle: "Save/Load",
    Content: PokemonShowdownTeam,
  },
];

export default function MoreInfo() {
  const isLgDown = useIsLgDown();
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (_event: SyntheticEvent, value: number) => {
    setTabIndex(value);
  };

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
              theme.applyStyles("dark", { backgroundColor: grey[900] })
            }
          >
            {TABS.map(({ title, shortTitle }, index) => (
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
        {TABS.map(({ title, Content }, index) => (
          <Grid
            key={title}
            id={`team-tool-panel-${index}`}
            aria-labelledby={`team-tool-tab-${index}`}
            role="tabpanel"
            hidden={tabIndex !== index}
            container
            justifyContent="center"
          >
            {tabIndex === index && <Content />}
          </Grid>
        ))}
      </Paper>
    </Grid>
  );
}
