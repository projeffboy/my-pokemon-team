import React, { useState } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import TypeChartPng from "./images/type-chart.png";
import { useBreakpoint } from "./width-context";

function TabContainer(props: { children?: React.ReactNode }) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

function TypeChart() {
  const width = useBreakpoint();
  const [value, setValue] = useState(() => (width === "xs" ? 1 : 0));

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const typoVariant = () => {
    if (width === "xs") {
      return "caption";
    } else {
      return "h5";
    }
  };

  return (
      <Box sx={{ flexGrow: 1, backgroundColor: "background.paper" }}>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Table" />
            <Tab label="List" />
            <Tab label="Infographic" />
          </Tabs>
        </AppBar>
        {value === 0 && (
          <TabContainer>
            <img
              alt="Bulbapedia Pokemon Type Chart"
              src={TypeChartPng}
              style={{ maxWidth: "100%" }}
            />
          </TabContainer>
        )}
        {value === 1 && (
          <TabContainer>
            <Typography
              variant={typoVariant()}
              style={{ paddingBottom: 20, textAlign: "center" }}
            >
              Strong against → Type → Strong against
            </Typography>
            <img
              alt="List Pokemon Type Chart"
              src="https://i.pinimg.com/originals/7b/c6/58/7bc65872baa79ac690e9e4ae1aa8cb64.png"
              style={{ maxWidth: "100%" }}
            />
          </TabContainer>
        )}
        {value === 2 && (
          <TabContainer>
            <Typography
              variant={typoVariant()}
              style={{ paddingBottom: 20, textAlign: "center" }}
            >
              Also applies for Gen 7-9
            </Typography>
            <img
              alt="Infographic Type Chart"
              src="https://i.imgur.com/fylyCdC.png"
              style={{ maxWidth: "100%" }}
            />
          </TabContainer>
        )}
      </Box>
  );
}

export default TypeChart;
