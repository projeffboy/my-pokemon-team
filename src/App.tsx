import Grid from "@mui/material/Grid";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import MainSnackbar from "./components/MainSnackbar";
import TypeChartDialog from "./TypeChartDialog";
import CssBaseline from "@mui/material/CssBaseline"; // like CSS Reset
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./styles";
import { BrowserRouter as Router } from "react-router-dom";
import Ramp from "./components/RAMP";
import { cookieStorageManager } from "./color-scheme-storage";
import { WidthProvider } from "./WidthContext";

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
              sx={{
                minHeight: "100dvh",
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
