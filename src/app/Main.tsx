import Grid from "@mui/material/Grid";
import PokemonTeam from "./main/PokemonTeam";
import TeamStats from "./main/TeamStats";

export default function Main() {
  return (
    <Grid component="main" container size={12} spacing={2}>
      <Grid
        container
        size={{ xs: 12, sm: 6, md: 7, lg: 6 }}
        spacing={2}
        sx={{ alignContent: "flex-start" }}
      >
        <PokemonTeam />
      </Grid>
      {/* From sm up the analysis panel fills the team column's height and scrolls inside */}
      <Grid
        size={{ xs: 12, sm: 6, md: 5, lg: 6 }}
        sx={{ position: { sm: "relative" }, minHeight: { sm: 480 } }}
      >
        <TeamStats />
      </Grid>
    </Grid>
  );
}
