import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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
      spacing={0}
      justifyContent="center"
    >
      <Grid>
        <Box
          component="img"
          src={face1}
          alt={face1Alt}
          sx={{
            display: "block",
            height: 28,
            px: 1,
            "@media (min-width: 360px)": { height: 32 },
            "@media (min-width: 600px)": { height: 48 },
          }}
        />
      </Grid>
      <Grid>
        <Typography
          variant="h3"
          sx={{
            px: 2.5,
            fontSize: "1.4rem",
            "@media (min-width: 360px)": { fontSize: "1.6rem" },
            "@media (min-width: 600px)": { fontSize: "2.8125rem" },
          }}
        >
          My Pokemon Team
        </Typography>
      </Grid>
      <Grid>
        <Box
          component="img"
          src={face2}
          alt={face2Alt}
          sx={{
            display: "block",
            height: 28,
            px: 1,
            "@media (min-width: 360px)": { height: 32 },
            "@media (min-width: 600px)": { height: 48 },
          }}
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
