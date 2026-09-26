import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import face1 from "@/images/pokemon-shuffle-faces/venusaur-shuffle-face-cropped.png";
import face2 from "@/images/pokemon-shuffle-faces/charizard-shuffle-face-cropped.png";
import { fluidClamp } from "./header/fluid-clamp";
import GenerationSelect from "./header/GenerationSelect";
import FeedbackDialog from "./header/FeedbackDialog";
import {
  breakpointValues,
  MIN_SUPPORTED_MOBILE_VIEWPORT_WIDTH,
} from "./shared/theme";

const { sm } = breakpointValues;
const faceHeight = fluidClamp(28, 48, MIN_SUPPORTED_MOBILE_VIEWPORT_WIDTH, sm);
const faceSpacing = fluidClamp(4, 8, MIN_SUPPORTED_MOBILE_VIEWPORT_WIDTH, sm);

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
            px: fluidClamp(8, 20, MIN_SUPPORTED_MOBILE_VIEWPORT_WIDTH, sm),
            fontSize: fluidClamp(
              1.4,
              Number.parseFloat(`${theme.typography.h3.fontSize}`),
              MIN_SUPPORTED_MOBILE_VIEWPORT_WIDTH,
              sm,
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
        <GenerationSelect />
        <FeedbackDialog />
      </Stack>
    </Grid>
  );
}
