import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import { observer } from "mobx-react";
import store from "./store";
import { appStyles } from "./styles";
import Cards from "./components/cards";
import Footer from "./components/footer";
import face1 from "./images/garchomp-shuffle-face.png";
import face2 from "./images/floette-eternal-shuffle-face.png";
import TypeChartDialog from "./type-chart-dialog";
import CssBaseline from "@mui/material/CssBaseline"; // like CSS Reset
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles"; // provide your custom theme
import { theme, darkTheme } from "./styles";
import { BrowserRouter as Router } from "react-router-dom";
import Ramp from "./components/RAMP";
import useWidth from "./use-width";

const PUB_ID = 1025446;
const WEBSITE_ID = 75399;

const face1Alt = "Garchomp Face";
const face2Alt = "Eternal Flower Floette Face";

function getSystemDarkMode() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(getSystemDarkMode);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const systemDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
    const updateDarkMode = (event: MediaQueryListEvent) =>
      setDarkMode(event.matches);

    systemDarkMode.addEventListener("change", updateDarkMode);
    return () => systemDarkMode.removeEventListener("change", updateDarkMode);
  }, []);

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
        <Grid
          component="header"
          container
          size={12}
          // Don't inherit the outer spacing: 16px gaps overflow 360px-wide phones
          spacing={0}
          justifyContent="center"
          alignItems="center"
        >
          <Grid>
            <Box
              component="img"
              src={face1}
              alt={face1Alt}
              sx={appStyles.headerFace}
            />
          </Grid>
          <Grid>
            <Typography
              variant="h3"
              sx={appStyles.headerTitle}
            >
              My Pokemon Team
            </Typography>
          </Grid>
          <Grid>
            <Box
              component="img"
              src={face2}
              alt={face2Alt}
              sx={appStyles.headerFace}
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
        <Grid component="main" container size={12} spacing={2}>
          <Cards width={width} darkMode={darkMode} />
        </Grid>
        {/* Footer */}
        <Footer darkMode={darkMode} setDarkMode={setDarkMode} />
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
      slotProps={{
        content: {
          role: "alert",
          "aria-describedby": "message-id",
        },
      }}
      message={<span id="message-id">{store.snackbarMsg}</span>}
    />
  );
});
