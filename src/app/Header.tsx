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
import { breakpointValues } from "./shared/theme";

// Where the title reaches its full size: the page's margins widen at sm,
// so the title needs a little more width than that to fit
const fullSizeWidth = breakpointValues.sm + 40;
const minimumTitleWidth = 300;
const fluid = (min: number, max: number, unit?: "px" | "rem") =>
  fluidClamp(min, max, minimumTitleWidth, fullSizeWidth, unit);
const faceHeight = fluid(31, 48);
const faceSpacing = fluid(3.75, 8);

export default function Header() {
  return (
    <Grid component="header" container size={12} spacing={1.5}>
      <Stack
        spacing={1.5}
        sx={{ width: "max-content", maxWidth: "100%", mx: "auto" }}
      >
        <Stack
          direction="row"
          sx={{
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            gap: faceSpacing,
          }}
        >
          <Box
            component="img"
            src={face1}
            alt=""
            sx={{
              height: faceHeight,
              flexShrink: 0,
            }}
          />
          <Typography
            variant="h3"
            component="h1"
            sx={theme => ({
              whiteSpace: "nowrap",
              flexShrink: 0,
              px: fluid(1.125, 16),
              fontSize: fluid(
                1.3,
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
              flexShrink: 0,
            }}
          />
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: "max-content",
            maxWidth: "100%",
            alignItems: "stretch",
          }}
        >
          <LanguageSelect />
          <GenerationSelect />
          <FeedbackDialog />
        </Stack>
      </Stack>
    </Grid>
  );
}
