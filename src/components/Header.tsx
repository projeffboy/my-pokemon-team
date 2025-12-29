import Typography from "@mui/material/Typography";
import face1 from "assets/landorus-face.png";
import face2 from "assets/ogerpon-teal-mask-by-jormxdos.png";
import { Stack, styled, type Theme } from "@mui/material";

const face1Alt = "Landorus Face";
const face2Alt = "Virizion Face";

const getResponsiveSize = (theme: Theme, property: string) => ({
  [property]: "1.8rem",
  [theme.breakpoints.between(250, 275)]: {
    [property]: "1.95rem",
  },
  [theme.breakpoints.between(275, 320)]: {
    [property]: "2.2rem",
  },
  [theme.breakpoints.between(320, 400)]: {
    [property]: "2.45rem",
  },
  [theme.breakpoints.between(400, 500)]: {
    [property]: "3.25rem",
  },
  [theme.breakpoints.between(500, "md")]: {
    [property]: "3.6rem",
  },
  [theme.breakpoints.only("md")]: {
    [property]: "4rem",
  },
  [theme.breakpoints.up("lg")]: {
    [property]: "5.4rem",
  },
});

const StyledImage = styled("img")(({ theme }) =>
  getResponsiveSize(theme, "height")
);

const Header = () => (
  <Stack component="header">
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={{ xs: 1, md: 2, lg: 3 }}
    >
      <StyledImage src={face1} alt={face1Alt} />
      <Typography
        variant="h1"
        align="center"
        sx={theme => getResponsiveSize(theme, "fontSize")}
      >
        My Pokemon Team
      </Typography>
      <StyledImage src={face2} alt={face2Alt} />
    </Stack>
    <Typography
      variant="subtitle1"
      align="center"
      sx={theme => ({
        fontSize: "1rem",
        [theme.breakpoints.between(320, 400)]: {
          fontSize: "1.2rem",
        },
        [theme.breakpoints.up(400)]: {
          fontSize: theme.typography.subtitle1.fontSize,
        },
      })}
    >
      For Generation 6 to 9 (Scarlet/Violet)
    </Typography>
    <Typography
      variant="subtitle2"
      align="center"
      sx={theme => ({
        fontSize: "0.8rem",
        [theme.breakpoints.between(320, 400)]: {
          fontSize: "0.9rem",
        },
        [theme.breakpoints.between(400, 500)]: {
          fontSize: "1rem",
        },
        [theme.breakpoints.between(500, "md")]: {
          fontSize: "1.2rem",
        },
        [theme.breakpoints.up("md")]: {
          fontSize: theme.typography.subtitle2.fontSize,
        },
      })}
    >
      Report Bugs to jeffery124@gmail.com
    </Typography>
  </Stack>
);

export default Header;
