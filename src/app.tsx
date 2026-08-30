import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import { observer } from "mobx-react";
import store from "./store";
import { appStyles } from "./styles";
import Header from "./components/header";
import Main from "./components/main";
import Footer from "./components/footer";
import TypeChartDialog from "./type-chart-dialog";
import CssBaseline from "@mui/material/CssBaseline"; // like CSS Reset
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./styles";
import { BrowserRouter as Router } from "react-router-dom";
import Ramp from "./components/RAMP";
import useWidth from "./use-width";
import { cookieStorageManager } from "./color-scheme-storage";

const PUB_ID = 1025446;
const WEBSITE_ID = 75399;

export default function App() {
  return (
    <Router>
      <>
        {process.env.NODE_ENV === "production" && (
          <Ramp PUB_ID={PUB_ID} WEBSITE_ID={WEBSITE_ID} />
        )}
        <ThemeProvider
          theme={theme}
          defaultMode="system"
          storageManager={cookieStorageManager}
          disableTransitionOnChange
          noSsr
        >
          <CssBaseline />
          <GlobalStyles styles={{ "html, body, #root": { height: "100%" } }} />
          <AppContent />
        </ThemeProvider>
      </>
    </Router>
  );
}

// Needs to be inside <ThemeProvider /> so the hooks see the custom theme
function AppContent() {
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
        <Header />
        <Main width={width} />
        <Footer />
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
