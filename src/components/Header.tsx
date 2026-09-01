import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import face1 from "@/images/charizard-shuffle-face-cropped.png";
import face2 from "@/images/venusaur-shuffle-face-cropped.png";
import { fluidClamp } from "@/helper";
import { breakpointValues, MIN_SUPPORTED_MOBILE_VIEWPORT_WIDTH } from "@/theme";

const { sm } = breakpointValues;
const faceHeight = fluidClamp(28, 48, MIN_SUPPORTED_MOBILE_VIEWPORT_WIDTH, sm);
const faceSpacing = fluidClamp(4, 8, MIN_SUPPORTED_MOBILE_VIEWPORT_WIDTH, sm);

export default function Header() {
  return (
    <Grid
      component="header"
      container
      size={12}
      spacing={0}
      justifyContent="center"
    >
      <Grid
        container
        size={12}
        spacing={0}
        wrap="nowrap"
        alignItems="center"
        justifyContent="center"
      >
        <Grid>
          <Box
            component="img"
            src={face1}
            alt=""
            sx={{
              display: "block",
              height: faceHeight,
              width: "auto",
              pr: faceSpacing,
            }}
          />
        </Grid>
        <Grid>
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
        </Grid>
        <Grid>
          <Box
            component="img"
            src={face2}
            alt=""
            sx={{
              display: "block",
              height: faceHeight,
              width: "auto",
              pl: faceSpacing,
            }}
          />
        </Grid>
      </Grid>
      <Grid size={12}>
        <Typography
          variant="subtitle1"
          component="p"
          align="center"
          sx={theme => ({
            fontSize: fluidClamp(
              0.75,
              Number.parseFloat(`${theme.typography.subtitle1.fontSize}`),
              MIN_SUPPORTED_MOBILE_VIEWPORT_WIDTH,
              sm,
              "rem",
            ),
          })}
        >
          For Generations 6-9 (ZA/Champions)
        </Typography>
      </Grid>
      <Grid size={12} sx={{ textAlign: "center" }}>
        <Typography
          variant="caption"
          component="a"
          href="mailto:jeffery124@gmail.com"
          sx={{ color: "inherit", fontSize: "0.625rem" }}
        >
          Report Bugs to jeffery124@gmail.com
        </Typography>
      </Grid>
    </Grid>
  );
}
