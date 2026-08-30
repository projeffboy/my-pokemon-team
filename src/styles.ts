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

/*
 * The styles below are plain objects meant for the `sx` prop (or `style` when
 * no responsive values are needed).
 * Responsive values use breakpoint keys, e.g. { xs: ..., md: ... }.
 */

// app.jsx
export const appStyles = {
  root: {
    minHeight: "100dvh",
    width: "100%",
    maxWidth: 1920,
    margin: "0 auto",
  },
  headerFace: {
    display: "block",
    height: 28,
    padding: "0 6px",
    "@media (min-width: 360px)": { height: 32 },
    "@media (min-width: 600px)": { height: 48 },
  },
  headerTitle: {
    padding: "0 20px",
    fontSize: "1.4rem",
    "@media (min-width: 360px)": { fontSize: "1.6rem" },
    "@media (min-width: 600px)": { fontSize: "2.8125rem" },
  },
};

// When using the Paper component
export const paperStyles = {
  // Provides padding to Paper
  applyPadding: { padding: 1 }, // theme.spacing(1) = 8px
};

// pokemon.jsx
export const pokemonStyles = {
  gridContainer: {
    display: "grid",
    gridColumnGap: "10px",
    gridTemplateColumns: "1fr 1fr",
  },
};

// pokemon-input.jsx
// sprite.jsx
export const pokemonInputStyles = {
  spriteContainer: {
    gridRow: { xs: "2 / 7", md: "2 / 5" },
  },
  sprite: {
    // keep the image contained in its div box
    maxHeight: "100%",
    maxWidth: "100%",
  },
  smallerSprite: {
    maxHeight: "96px",
  },
  miniSprite: {
    width: "100%",
  },
  gridItem: {
    minWidth: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }, // otherwise the grid items will overflow
};

// team-stats.jsx
export const teamStatsStyles = {
  typeContainer: {
    padding: { xs: "3px 1px", md: "3px" },
  },
  pokemonType: {
    color: "white",
    borderRadius: "5px",
    display: "block",
    width: { xs: "100%", md: "75%" },
    margin: "auto",
    padding: "1px 0",
  },
  popover: {
    pointerEvents: "none",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    alignItems: "center",
  },
  multiplier: {
    width: 40,
    textAlign: "right",
    paddingRight: 4,
  },
};

// more-info.jsx
export const moreInfoStyles = {
  root: {
    borderRadius: 4,
  },
  appBar: { borderRadius: "4px 4px 0 0" },
  tab: { minWidth: "initial" },
};

// search-filters.jsx
export const searchFiltersStyles = {
  formControl: {
    minWidth: { xs: 90, md: 120 },
    margin: { xs: "0 10px 10px", lg: "10px" },
  },
};

// team-checklist.jsx
export const teamChecklistStyles = {
  miniHeader: {
    fontWeight: "bold",
    paddingBottom: 10,
  },
};

// pokemon-showdown-team.jsx
export const pokemonShowdownTeamStyles = {
  button: { margin: 1 }, // theme.spacing(1)
  textField: { margin: "20px 0" },
};

// team-viewer.jsx
export const teamViewerStyles = {
  twoSprites: {
    display: "flex",
    height: 75,
  },
  oneOfTwoPkmn: { padding: "8px" },
  xsTab: { minWidth: 0 },
};
