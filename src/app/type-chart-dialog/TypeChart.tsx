import { useState, type ReactNode, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import TypeChartPng from "@/images/type-chart.png";
import TypeChartListPng from "@/images/type-chart-list.png";
import TypeChartInfographicPng from "@/images/type-chart-infographic.png";
import { useBreakpoint } from "../shared/WidthContext";

function TabContainer({ children }: { children?: ReactNode }) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

function TypeChart() {
  const width = useBreakpoint();
  const [value, setValue] = useState(() => (width === "xs" ? 1 : 0));

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
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
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          textColor="inherit"
        >
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
            src={TypeChartListPng}
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
            src={TypeChartInfographicPng}
            style={{ maxWidth: "100%" }}
          />
        </TabContainer>
      )}
    </Box>
  );
}

export default TypeChart;
