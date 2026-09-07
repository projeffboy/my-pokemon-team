import Grid from "@mui/material/Grid";
import Header from "./app/Header";
import Main from "./app/Main";
import Footer from "./app/Footer";
import MainSnackbar from "./app/MainSnackbar";
import TeamLinkSync from "./app/TeamLinkSync";
import TypeChartDialog from "./app/TypeChartDialog";
import CssBaseline from "@mui/material/CssBaseline"; // like CSS Reset
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./app/theme";
import { BrowserRouter as Router } from "react-router-dom";
import Ramp from "./app/RAMP";
import { cookieStorageManager } from "./app/color-scheme-storage";
import { WidthProvider } from "./app/shared/WidthContext";

const PUB_ID = 1025446;
const WEBSITE_ID = 75399;

export default function App() {
  return (
    <Router>
      <>
        <TeamLinkSync />

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
              sx={{
                minHeight: "100dvh",
                alignContent: "flex-start",
                maxWidth: 1920,
                mx: "auto",
                p: 2,
              }}
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
