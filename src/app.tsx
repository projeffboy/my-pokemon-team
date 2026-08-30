import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import { observer } from "mobx-react";
import store from "./store";
import { appStyles } from "./styles";
import Cards from "./components/cards";
import Manual from "./manual";
import Credits from "./credits";
import PrivacyPolicy from "./privacy-policy";
import UpdateLog from "./update-log";
import face1 from "./landorus-face.png";
import face2 from "./ogerpon-teal-mask-by-jormxdos.png";
import TypeChartDialog from "./type-chart-dialog";
import CssBaseline from "@mui/material/CssBaseline"; // like CSS Reset
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles"; // provide your custom theme
import { theme, darkTheme } from "./styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { BrowserRouter as Router } from "react-router-dom";
import Ramp from "./components/RAMP";
import useWidth from "./use-width";
import { Breakpoint } from "./types";

const PUB_ID = 1025446;
const WEBSITE_ID = 75399;

const face1Alt = "Landorus Face";
const face2Alt = "Virizion Face";

function faceWidth(breakpoint: Breakpoint) {
  if (breakpoint !== "xs") {
    return 48;
  } else if (window.innerWidth >= 360) {
    return 32;
  } else {
    return 28;
  }
}

function titleFontSize(breakpoint: Breakpoint) {
  if (breakpoint !== "xs") {
    return 2.8125;
  } else if (window.innerWidth >= 360) {
    return 1.6;
  } else {
    return 1.4;
  }
}

export default function App() {
  const isSystemDark =
    window && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [darkMode, setDarkMode] = useState(isSystemDark);

  return (
    <Router>
      <>
        {process.env.NODE_ENV === "production" && (
          <Ramp PUB_ID={PUB_ID} WEBSITE_ID={WEBSITE_ID} />
        )}
        <ThemeProvider theme={darkMode ? darkTheme : theme}>
          <CssBaseline />
          <GlobalStyles styles={{ "html, body, #root": { height: "100%" } }} />
          <AppContent darkMode={darkMode} setDarkMode={setDarkMode} />
        </ThemeProvider>
      </>
    </Router>
  );
}

// Needs to be inside <ThemeProvider /> so useWidth() sees the custom breakpoints
interface AppContentProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

function AppContent({ darkMode, setDarkMode }: AppContentProps) {
  const width = useWidth();

  return (
    /*
     * All 9 Cards
     * apparently there's a slight horizontal scroll if I don't set the width and margin for <Grid />
     * the original width for <Grid /> was calc(100% + 24px)
     */
    <>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={appStyles.root}
      >
        {/* Header */}
        <Grid container size={12} justifyContent="center">
          <Grid>
            <img
              src={face1}
              alt={face1Alt}
              height={faceWidth(width)}
              style={{ padding: "0 6px" }}
            />
          </Grid>
          <Grid>
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
          <Grid>
            <img
              src={face2}
              alt={face2Alt}
              height={faceWidth(width)}
              style={{ padding: "0 6px" }}
            />
          </Grid>
          <Grid size={12}>
            <Typography variant="subtitle1" align="center">
              For Generation 6 to 9 (with Legends Z-A pokemon!)
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="caption" align="center" component="div">
              <sub>Report Bugs to jeffery124@gmail.com</sub>
            </Typography>
          </Grid>
        </Grid>
        {/* Main */}
        <Cards width={width} darkMode={darkMode} />
        {/* Footer */}
        <Grid
          container
          size={12}
          justifyContent="center"
          alignItems="center"
          spacing={2}
          style={{ paddingBottom: 230 }}
        >
          <Grid>
            <Manual darkMode={darkMode} />
          </Grid>
          <Grid>
            <Button
              href="https://jefferytang.com"
              style={{ fontWeight: "initial", textTransform: "initial" }}
            >
              Jeffery Tang
            </Button>
          </Grid>
          <Grid>
            <Credits />
          </Grid>
          <Grid>
            <UpdateLog />
          </Grid>
          <Grid>
            <PrivacyPolicy />
          </Grid>
          <Grid>
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
    </>
  );
}

// Snackbar is managed by MobX
// Can be opened by importing store.js then running store.openSnackbar(msg)
const MainSnackbar = observer(function MainSnackbar() {
  return (
    <Snackbar
      open={store.isSnackbarOpen}
      autoHideDuration={2500}
      onClose={() => (store.isSnackbarOpen = false)}
      ContentProps={{
        // role "alertdialog" matches Material UI v3's behavior (tests rely on it)
        role: "alertdialog",
        "aria-describedby": "message-id",
      }}
      message={<span id="message-id">{store.snackbarMsg}</span>}
    />
  );
});
