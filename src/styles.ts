import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

// Keep the Material UI v3 breakpoints (with lg manually set to 1200),
// since all the responsive layout logic (and the tests) depend on them.
const breakpoints = {
  values: { xs: 0, sm: 600, md: 960, lg: 1200, xl: 1920 },
};

// main.tsx (THEME)
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
        // Material UI v3's default dark background colors
        background: { default: "#303030", paper: "#424242" },
        text: {
          primary: grey[300],
        },
      },
    },
  },
});
