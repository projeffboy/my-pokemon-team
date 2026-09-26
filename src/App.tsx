import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Header from "./app/Header";
import Main from "./app/Main";
import Footer from "./app/Footer";
import MainSnackbar from "./app/MainSnackbar";
import TeamLinkSync from "./app/TeamLinkSync";
import HistoryFab from "./app/HistoryFab";
import Dialogs from "./app/Dialogs";
import CssBaseline from "@mui/material/CssBaseline"; // like CSS Reset
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./app/shared/theme";
import { cookieStorageManager } from "./app/color-scheme-storage";
import { WidthProvider } from "./app/shared/WidthContext";
import { TranslationProvider } from "./app/shared/TranslationContext";

export default function App() {
  // Playwire looks for the element it inserts the banner above only once, when it handles
  // this call, so make it after the first render has put the Grid below into the DOM.
  useEffect(() => {
    window.ramp?.que.push(() => window.ramp?.spaNewPage?.(location.pathname));
  }, []);

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
        <TranslationProvider>
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
            <HistoryFab />
            <Dialogs />
          </WidthProvider>
        </TranslationProvider>
      </ThemeProvider>
    </>
  );
}
