import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import face1 from "@/images/pokemon-shuffle-faces/venusaur-shuffle-face-cropped.png";
import face2 from "@/images/pokemon-shuffle-faces/charizard-shuffle-face-cropped.png";
import { fluidClamp } from "./header/fluid-clamp";
import GenerationSelect from "./header/GenerationSelect";
import LanguageSelect from "./header/LanguageSelect";
import FeedbackDialog from "./header/FeedbackDialog";
import {
  breakpointValues,
  MIN_SUPPORTED_MOBILE_VIEWPORT_WIDTH,
} from "./shared/theme";

// Where the title reaches its full size: the page's margins widen at sm,
// so the title needs a little more width than that to fit
const fullSizeWidth = breakpointValues.sm + 40;
const fluid = (min: number, max: number, unit?: "px" | "rem") =>
  fluidClamp(
    min,
    max,
    MIN_SUPPORTED_MOBILE_VIEWPORT_WIDTH,
    fullSizeWidth,
    unit,
  );
const faceHeight = fluid(28, 48);
const faceSpacing = fluid(4, 8);

export default function Header() {
  return (
    <Grid component="header" container size={12} spacing={1.5}>
      <Stack
        direction="row"
        sx={{ width: "100%", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          component="img"
          src={face1}
          alt=""
          sx={{
            height: faceHeight,
            pr: faceSpacing,
          }}
        />
        <Typography
          variant="h3"
          component="h1"
          noWrap
          sx={theme => ({
            px: fluid(8, 20),
            fontSize: fluid(
              1.4,
              Number.parseFloat(`${theme.typography.h3.fontSize}`),
              "rem",
            ),
          })}
        >
          My Pokemon Team
        </Typography>
        <Box
          component="img"
          src={face2}
          alt=""
          sx={{
            height: faceHeight,
            pl: faceSpacing,
          }}
        />
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        sx={{ width: "100%", maxWidth: 420, mx: "auto", alignItems: "stretch" }}
      >
        <LanguageSelect />
        <GenerationSelect />
        <FeedbackDialog />
      </Stack>
    </Grid>
  );
}
