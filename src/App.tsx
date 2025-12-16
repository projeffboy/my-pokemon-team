import TypeChartDialog from "./TypeChartDialog";
import CssBaseline from "@mui/material/CssBaseline"; // like CSS Reset
import { ThemeProvider } from "@mui/material/styles"; // provide your custom theme
import { theme } from "./styles";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import MainSnackbar from "./components/MainSnackbar";
import { BrowserRouter as Router } from "react-router-dom";
import Ramp from "./components/RAMP";
import { Container, Stack } from "@mui/material";

const PUB_ID = 1025446;
const WEBSITE_ID = 75399;

const App = () => (
  <Router>
    {import.meta.env.MODE === "production" && (
      <Ramp PUB_ID={PUB_ID} WEBSITE_ID={WEBSITE_ID} />
    )}
    <ThemeProvider theme={theme} noSsr>
      <CssBaseline enableColorScheme />
      <Container maxWidth="xl">
        <Stack>
          <Header />
          <Main />
          <Footer />
        </Stack>
      </Container>
      <TypeChartDialog /> {/* Floating Action Button (FAB) */}
      <MainSnackbar />
    </ThemeProvider>
  </Router>
);

export default App;
