import Grid from "@mui/material/Grid";
import Header from "./app/Header";
import Main from "./app/Main";
import Footer from "./app/Footer";
import MainSnackbar from "./app/MainSnackbar";
import TeamLinkSync from "./app/TeamLinkSync";
import TypeChartDialog from "./app/TypeChartDialog";
import CssBaseline from "@mui/material/CssBaseline"; // like CSS Reset
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./app/shared/theme";
import { cookieStorageManager } from "./app/color-scheme-storage";
import { WidthProvider } from "./app/shared/WidthContext";

export default function App() {
  return (
    <>
      <TeamLinkSync />

      <ThemeProvider
        theme={theme}
        defaultMode="system"
        storageManager={cookieStorageManager}
        disableTransitionOnChange
        noSsr
      >
        <CssBaseline />
        <WidthProvider>
          {/* Playwire inserts the top banner above `#root > div > div:nth-child(1)` */}
          <div>
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
          </div>
          <MainSnackbar />
          <TypeChartDialog />
        </WidthProvider>
      </ThemeProvider>
    </>
  );
}
