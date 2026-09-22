import { createTheme } from "@mui/material/styles";
import { blue, grey } from "@mui/material/colors";

export const MIN_SUPPORTED_MOBILE_VIEWPORT_WIDTH = 320;
export const breakpointValues = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1200,
  xl: 1920,
};

// The team checklist's checkmarks
const success = { main: "#16a085" };

export const theme = createTheme({
  breakpoints: { values: breakpointValues },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: grey[900] },
        secondary: { main: grey[900] },
        success,
        background: { default: "#eee" },
      },
    },
    dark: {
      palette: {
        primary: { main: grey[200] },
        secondary: { main: grey[200] },
        success,
        background: { default: "#303030", paper: "#3a3a3a" },
        text: {
          primary: grey[300],
        },
      },
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        // Plain paper instead of MUI's lighter elevation overlay
        paper: ({ theme }) =>
          theme.applyStyles("dark", {
            backgroundColor: theme.palette.background.paper,
            backgroundImage: "none",
          }),
      },
    },
    MuiLink: {
      styleOverrides: { root: { color: blue[500] } },
    },
  },
});
