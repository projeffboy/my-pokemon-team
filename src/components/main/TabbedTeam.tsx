import { useState } from "react";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Pokemon from "./Pokemon";
import Sprite from "./pokemon/Sprite";
import { range } from "../../helper";
import useMediaQuery from "@mui/material/useMediaQuery";
import Stack from "@mui/material/Stack";

export default function TabbedTeam() {
  const BelowMediumBreakpoint = useMediaQuery(theme =>
    theme.breakpoints.down("md")
  );

  const [onePokemonTabIndex, setOnePokemonTabIndex] = useState(0);
  const twoPokemonTabIndex = Math.floor(onePokemonTabIndex / 2);
  function setTwoPokemonTabIndex(val: number) {
    setOnePokemonTabIndex(val * 2);
  }

  function handleChange(_event: React.SyntheticEvent, val: number) {
    if (BelowMediumBreakpoint) {
      setOnePokemonTabIndex(val);
    } else {
      setTwoPokemonTabIndex(val);
    }
  }
  return (
    <TabContext
      value={BelowMediumBreakpoint ? onePokemonTabIndex : twoPokemonTabIndex}
    >
      <Grid size={12} component="section">
        <Paper component="section">
          <TabList onChange={handleChange} variant="fullWidth">
            {
              // Either display 6 or 3 tabs
              BelowMediumBreakpoint
                ? range(6).map(tabIndex => (
                    <Tab
                      key={tabIndex}
                      value={tabIndex}
                      label={tabIndex + 1}
                      sx={{ minWidth: 0 }} // a css hack to make all the tabs fit in the tab list without scrolling
                      icon={<Sprite teamIndex={tabIndex} />}
                    />
                  ))
                : range(3).map(tabIndex => (
                    <Tab
                      key={tabIndex}
                      value={tabIndex}
                      label={`${2 * tabIndex + 1} - ${2 * tabIndex + 2}`}
                      icon={
                        <Stack direction="row">
                          <Sprite teamIndex={2 * tabIndex} />
                          <Sprite teamIndex={2 * tabIndex + 1} />
                        </Stack>
                      }
                    />
                  ))
            }
          </TabList>
        </Paper>
      </Grid>
      {
        // Either display 1 or 2 pokemon inputs
        BelowMediumBreakpoint
          ? range(6).map(tabIndex => (
              <TabPanel
                key={tabIndex}
                value={tabIndex}
                sx={{ p: 0, width: "100%" }}
              >
                <Grid size={12} component="section">
                  <Pokemon teamIndex={tabIndex} />
                </Grid>
              </TabPanel>
            ))
          : range(3).map(tabIndex => (
              <TabPanel key={tabIndex} value={tabIndex} sx={{ p: 0 }}>
                <Grid container spacing={2}>
                  {range(2).map(i => (
                    <Grid key={i} size={12} component="section">
                      <Pokemon teamIndex={2 * tabIndex + i} />
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>
            ))
      }
    </TabContext>
  );
}
