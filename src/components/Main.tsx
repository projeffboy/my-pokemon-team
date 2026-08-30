import Grid from "@mui/material/Grid";
import Cards from "./Cards";

export default function Main() {
  return (
    <Grid component="main" container size={12} spacing={2}>
      <Cards />
    </Grid>
  );
}
