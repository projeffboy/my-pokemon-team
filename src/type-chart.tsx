import React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import TypeChartPng from "./images/type-chart.png";
import { Breakpoint } from "./types";

function TabContainer(props: { children?: React.ReactNode }) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

interface Props {
  width: Breakpoint;
}

interface State {
  value: number;
}

class TypeChart extends React.Component<Props, State> {
  state: State = {
    value: this.props.width === "xs" ? 1 : 0,
  };

  handleChange = (_event: React.SyntheticEvent, value: number) => {
    this.setState({ value });
  };

  typoVariant() {
    if (this.props.width === "xs") {
      return "caption";
    } else {
      return "h5";
    }
  }

  render() {
    const { value } = this.state;

    return (
      <Box sx={{ flexGrow: 1, backgroundColor: "background.paper" }}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange} centered>
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
              variant={this.typoVariant()}
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
              variant={this.typoVariant()}
              style={{ paddingBottom: 20, textAlign: "center" }}
            >
              Also applies for Gen 7-9
            </Typography>
            <img
              alt="Infographic Type Chart"
              src="http://i.imgur.com/fylyCdC.png"
              style={{ maxWidth: "100%" }}
            />
          </TabContainer>
        )}
      </Box>
    );
  }
}

export default TypeChart;
