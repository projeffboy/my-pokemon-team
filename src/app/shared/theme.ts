import { createTheme } from "@mui/material/styles";
import { blue, grey } from "@mui/material/colors";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    footer: true;
  }
}

export const MIN_SUPPORTED_MOBILE_VIEWPORT_WIDTH = 320;
export const breakpointValues = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1200,
  xl: 1920,
};

// The team checklist's checkmarks and the positive type scores
const success = { main: "#16a085" };

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: "data" },
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
    MuiCssBaseline: {
      styleOverrides: {
        // The ad iframes inherit the dark scheme from <html>, but their documents are light,
        // and Chrome paints a mismatched iframe as an opaque white box instead of transparent
        iframe: { colorScheme: "light" },
      },
    },
    MuiButton: {
      variants: [
        {
          // A footer link in the body font rather than MUI's bold uppercase button text
          props: { variant: "footer" },
          style: ({ theme }) => ({
            padding: "6px 8px",
            fontWeight: "inherit",
            textTransform: "none",
            color: (theme.vars || theme).palette.primary.main,
            "@media (hover: hover)": {
              "&:hover": {
                backgroundColor: theme.alpha(
                  (theme.vars || theme).palette.primary.main,
                  (theme.vars || theme).palette.action.hoverOpacity,
                ),
              },
            },
          }),
        },
      ],
    },
    MuiDialog: {
      styleOverrides: {
        // Plain paper instead of MUI's lighter elevation overlay
        paper: ({ theme }) =>
          theme.applyStyles("dark", { backgroundImage: "none" }),
      },
    },
    MuiLink: {
      // Every link is external, and a new tab keeps the current team open;
      // an in-app link would have to override target
      defaultProps: { target: "_blank", rel: "noopener" },
      styleOverrides: { root: { color: blue[500] } },
    },
    MuiTypography: {
      // Dialog titles are h2, so the h6-styled section headings are h3
      defaultProps: { variantMapping: { h6: "h3", subtitle2: "p" } },
    },
  },
});
