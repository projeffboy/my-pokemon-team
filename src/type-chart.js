import React, { useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import TypeChartPng from "./type-chart.png";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

const TypeChart = ({ classes, width }) => {
  const [value, setValue] = useState(width === "xs" ? 1 : 0);

  const handleChange = (event, newValue) => {
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
    <div className={classes.root}>
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
            src="http://i.imgur.com/fylyCdC.png"
            style={{ maxWidth: "100%" }}
          />
        </TabContainer>
      )}
    </div>
  );
};

TypeChart.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
};

export default withStyles(styles)(TypeChart);
