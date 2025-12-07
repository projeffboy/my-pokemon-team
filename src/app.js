import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import { Observer } from "mobx-react";
import store from "./store";
import Cards from "./components/cards";
import Manual from "./manual";
import Credits from "./credits";
import PrivacyPolicy from "./privacy-policy";
import UpdateLog from "./update-log";
import face1 from "./landorus-face.png";
import face2 from "./ogerpon-teal-mask-by-jormxdos.png";
import TypeChartDialog from "./type-chart-dialog";
import CssBaseline from "@mui/material/CssBaseline"; // like CSS Reset
import { ThemeProvider } from "@mui/material/styles"; // provide your custom theme
import { theme, darkTheme } from "./styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { BrowserRouter as Router } from "react-router-dom";
import Ramp from "./components/RAMP";
import useMediaQuery from "@mui/material/useMediaQuery";
import GlobalStyles from "@mui/material/GlobalStyles";

const PUB_ID = 1025446;
const WEBSITE_ID = 75399;

const face1Alt = "Landorus Face";
const face2Alt = "Virizion Face";

function useWidth() {
  const isXl = useMediaQuery(theme.breakpoints.up("xl"));
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));
  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  const isSm = useMediaQuery(theme.breakpoints.up("sm"));

  if (isXl) return "xl";
  if (isLg) return "lg";
  if (isMd) return "md";
  if (isSm) return "sm";
  return "xs";
}

function faceWidth(breakpoint) {
  if (breakpoint !== "xs") {
    return 48;
  } else if (window.innerWidth >= 360) {
    return 32;
  } else {
    return 28;
  }
}

function titleFontSize(breakpoint) {
  if (breakpoint !== "xs") {
    return 2.8125;
  } else if (window.innerWidth >= 360) {
    return 1.6;
  } else {
    return 1.4;
  }
}

const MainSnackbar = () => (
  <Observer>
    {() => (
      <Snackbar
        open={store.isSnackbarOpen}
        autoHideDuration={2500}
        onClose={() => (store.isSnackbarOpen = false)}
        ContentProps={{ "aria-describedby": "message-id" }}
        message={<span id="message-id">{store.snackbarMsg}</span>}
      />
    )}
  </Observer>
);

const App = props => {
  console.error("App rendering");
  const isSystemDark =
    window && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [darkMode, setDarkMode] = useState(isSystemDark);
  const width = useWidth();

  return (
    /*
     * All 9 Cards
     * apparently there's a slight horizontal scroll if I don't set the width and margin for <Grid />
     * the original width for <Grid /> was calc(100% + 24px)
     */
    <Router>
      <>
        {process.env.NODE_ENV === "production" && (
          <Ramp PUB_ID={PUB_ID} WEBSITE_ID={WEBSITE_ID} />
        )}
        <ThemeProvider theme={darkMode ? darkTheme : theme}>
          <CssBaseline />
          <GlobalStyles
            styles={{
              "html, body, #root": { height: "100%" },
            }}
          />
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{
              height: "100%",
              width: "100%",
              maxWidth: 1920,
              margin: "0 auto",
            }}
          >
            {/* Header */}
            <Grid container size={{ xs: 12 }} justifyContent="center">
              <Grid size="auto">
                <img
                  src={face1}
                  alt={face1Alt}
                  height={faceWidth(width)}
                  style={{ padding: "0 6px" }}
                />
              </Grid>
              <Grid size="auto">
                <Typography
                  variant="h3"
                  style={{
                    padding: "0 20px",
                    fontSize: titleFontSize(width) + "rem",
                  }}
                >
                  My Pokemon Team
                </Typography>
              </Grid>
              <Grid size="auto">
                <img
                  src={face2}
                  alt={face2Alt}
                  height={faceWidth(width)}
                  style={{ padding: "0 6px" }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" align="center">
                  For Generation 6 to 9 (Scarlet/Violet)
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" align="center">
                  <sub>Report Bugs to jeffery124@gmail.com</sub>
                </Typography>
              </Grid>
            </Grid>
            {/* Main */}
            <Cards darkMode={darkMode} />
            {/* Footer */}
            <Grid
              container
              size={{ xs: 12 }}
              justifyContent="center"
              alignItems="center"
              spacing={2}
              style={{ paddingBottom: 230 }}
            >
              <Grid size="auto">
                <Manual darkMode={darkMode} />
              </Grid>
              <Grid size="auto">
                <Button
                  href="https://jefferytang.com"
                  role="button"
                  style={{ fontWeight: "initial", textTransform: "initial" }}
                >
                  Jeffery Tang
                </Button>
              </Grid>
              <Grid size="auto">
                <Credits />
              </Grid>
              <Grid size="auto">
                <UpdateLog />
              </Grid>
              <Grid size="auto">
                <PrivacyPolicy />
              </Grid>
              <Grid size="auto">
                <FormControlLabel
                  control={
                    <Switch
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                      value="darkMode"
                    />
                  }
                  label="Dark Mode"
                />
              </Grid>
            </Grid>
          </Grid>
          <MainSnackbar />
          <TypeChartDialog width={width} />
        </ThemeProvider>
      </>
    </Router>
  );
};

export default App;
