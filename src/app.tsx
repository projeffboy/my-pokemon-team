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
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./styles";
import { BrowserRouter as Router } from "react-router-dom";
import Ramp from "./components/RAMP";
import { cookieStorageManager } from "./color-scheme-storage";
import { WidthProvider } from "./width-context";

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
          <WidthProvider>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={appStyles.root}
            >
              <Header />
              <Main />
              <Footer />
            </Grid>
            <MainSnackbar />
            <TypeChartDialog />
          </WidthProvider>
        </ThemeProvider>
      </>
    </Router>
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
