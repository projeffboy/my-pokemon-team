import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import PokemonTeam from "./main/PokemonTeam";
import TeamStats from "./main/TeamStats";
import MoreInfo from "./main/MoreInfo";

export default function Main() {
  return (
    <Grid component="main" container size={12} spacing={2}>
      {/* Pokemon cards */}
      <Grid container size={{ xs: 12, sm: 6, md: 7, lg: 6 }} spacing={2}>
        <PokemonTeam />
      </Grid>
      <Grid container size={{ xs: 12, sm: 6, md: 5, lg: 6 }} spacing={2}>
        <TeamStats />
        {/* Pokemon more info card */}
        <Grid size={12}>
          <Paper>
            <MoreInfo />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}
