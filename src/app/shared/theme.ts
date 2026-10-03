import { createTheme } from "@mui/material/styles";
import { blue, grey, red } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xxs: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    footer: true;
  }
}

export const MIN_SUPPORTED_MOBILE_VIEWPORT_WIDTH = 320;
// Small phones below 400px, larger phones from 400px, portrait tablets from
// 600px, landscape tablets from 960px, and laptops from 1200px. The smallest key,
// `xxs`, starts at 0 so its styles apply at every width, even a window a pixel
// narrower than the narrowest supported.
export const breakpointValues = {
  xxs: 0,
  xs: 400,
  sm: 600,
  md: 960,
  lg: 1200,
  xl: 1920,
};

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: "data" },
  breakpoints: { values: breakpointValues },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: grey[900] },
        secondary: { main: grey[900] },
        // Dark enough for the type scores to read as small text on white
        success: { main: "#0e7a65" },
        warning: { main: "#b45309" },
        background: { default: "#eee" },
      },
    },
    dark: {
      palette: {
        primary: { main: grey[200] },
        secondary: { main: grey[200] },
        // Light enough for the type scores to read on a dialog, the lightest dark surface
        success: { main: "#4dd0b1" },
        error: { main: red[200] },
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
            minHeight: 48,
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
    MuiLink: {
      // Every link is external, and a new tab keeps the current team open;
      // an in-app link would have to override target
      defaultProps: { target: "_blank", rel: "noopener" },
      styleOverrides: {
        root: ({ theme }) => ({
          color: blue[700],
          ...theme.applyStyles("dark", { color: blue[300] }),
        }),
      },
    },
    MuiTypography: {
      // Dialog titles are h2, so the h6-styled section headings are h3
      defaultProps: { variantMapping: { h6: "h3", subtitle2: "p" } },
    },
  },
});
