import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import face1 from "../assets/landorus-face.png";
import face2 from "../assets/ogerpon-teal-mask-by-jormxdos.png";
import type { Breakpoint } from "@mui/material/styles";
import useWidth from "../useWidth";
import { Stack } from "@mui/material";

const face1Alt = "Landorus Face";
const face2Alt = "Virizion Face";

function faceWidth(breakpoint: Breakpoint) {
  if (breakpoint !== "xs") {
    return 48;
  } else if (window.innerWidth >= 360) {
    return 32;
  } else {
    return 28;
  }
}

function titleFontSize(breakpoint: Breakpoint) {
  if (breakpoint !== "xs") {
    return 2.8125;
  } else if (window.innerWidth >= 360) {
    return 1.6;
  } else {
    return 1.4;
  }
}

const Header = () => {
  const width = useWidth() as Breakpoint;
  return (
    <Stack>
      <Stack direction="row">
        <img src={face1} alt={face1Alt} height={faceWidth(width)} />
        <Typography
          variant="h1"
          style={{
            fontSize: titleFontSize(width) + "rem",
          }}
        >
          My Pokemon Team
        </Typography>
        <img src={face2} alt={face2Alt} height={faceWidth(width)} />
      </Stack>
      <Grid size={{ xs: 12 }}>
        <Typography variant="subtitle1" align="center">
          For Generation 6 to 9 (Scarlet/Violet)
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant="caption" align="center">
          <sub>Report Bugs to jeffery124@gmail.com</sub>
        </Typography>
      </Grid>
    </Stack>
  );
};

export default Header;
