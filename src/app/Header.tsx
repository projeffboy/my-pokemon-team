import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import face1 from "@/images/pokemon-shuffle-faces/landorus-face.png";
import face2 from "@/images/pokemon-shuffle-faces/ogerpon-teal-mask-by-jormxdos.png";
import { fluidClamp } from "./header/fluid-clamp";
import SiteVersionSwitch from "./header/SiteVersionSwitch";
import {
  breakpointValues,
  MIN_SUPPORTED_MOBILE_VIEWPORT_WIDTH,
} from "./shared/theme";

const { sm } = breakpointValues;
const faceHeight = fluidClamp(28, 48, MIN_SUPPORTED_MOBILE_VIEWPORT_WIDTH, sm);
const faceSpacing = fluidClamp(4, 8, MIN_SUPPORTED_MOBILE_VIEWPORT_WIDTH, sm);

export default function Header() {
  return (
    <Grid component="header" container size={12}>
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
      {/* The switch sits beside the two lines where there is room, and below them otherwise */}
      <Grid
        size={12}
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "center",
          columnGap: 1.5,
          mt: { xs: 0, sm: 1.5 },
          mb: 1,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="subtitle1"
            component="p"
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
          <Typography
            variant="caption"
            component="a"
            href="mailto:jeffery124@gmail.com"
            sx={{ color: "inherit", fontSize: "0.625rem" }}
          >
            Report Bugs to jeffery124@gmail.com
          </Typography>
        </Box>
        <Box sx={{ mt: { xs: 1.5, sm: 0 }, width: { xs: "100%", sm: "auto" } }}>
          <SiteVersionSwitch />
        </Box>
      </Grid>
    </Grid>
  );
}
