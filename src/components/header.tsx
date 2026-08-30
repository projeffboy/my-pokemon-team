import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { appStyles } from "../styles";
import face1 from "../images/garchomp-shuffle-face.png";
import face2 from "../images/floette-eternal-shuffle-face.png";

const face1Alt = "Garchomp Face";
const face2Alt = "Eternal Flower Floette Face";

export default function Header() {
  return (
    <Grid
      component="header"
      container
      size={12}
      // Don't inherit the outer spacing: 16px gaps overflow 360px-wide phones
      spacing={0}
      justifyContent="center"
      alignItems="center"
    >
      <Grid>
        <Box
          component="img"
          src={face1}
          alt={face1Alt}
          sx={appStyles.headerFace}
        />
      </Grid>
      <Grid>
        <Typography variant="h3" sx={appStyles.headerTitle}>
          My Pokemon Team
        </Typography>
      </Grid>
      <Grid>
        <Box
          component="img"
          src={face2}
          alt={face2Alt}
          sx={appStyles.headerFace}
        />
      </Grid>
      <Grid size={12}>
        <Typography variant="subtitle1" align="center">
          For Generation 6 to 9 (with Legends Z-A pokemon!)
        </Typography>
      </Grid>
      <Grid size={12}>
        <Typography variant="caption" align="center" component="div">
          <sub>Report Bugs to jeffery124@gmail.com</sub>
        </Typography>
      </Grid>
    </Grid>
  );
}