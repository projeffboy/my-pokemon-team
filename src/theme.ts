import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

// support 320px minimum width for mobile devices
const breakpoints = {
  values: { xs: 0, sm: 600, md: 960, lg: 1200, xl: 1920 },
};

export const theme = createTheme({
  breakpoints,
  colorSchemes: {
    light: {
      palette: {
        primary: { main: grey[900] },
        secondary: { main: grey[900] },
        background: { default: "#eee" },
      },
    },
    dark: {
      palette: {
        primary: { main: grey[200] },
        secondary: { main: grey[200] },
        background: { default: "#303030", paper: "#424242" },
        text: {
          primary: grey[300],
        },
      },
    },
  },
});
