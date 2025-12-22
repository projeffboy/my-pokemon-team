// Material UI Imports
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
// My Component Imports
import PokemonCards from "./main/PokemonCards";
import TeamStats from "./main/TeamStats";
import MoreInfo from "./main/MoreInfo";

function Main() {
  return (
    <main>
      {/* Pokemon cards */}
      <Grid container size={{ xs: 12, sm: 6, md: 7, lg: 6 }} spacing={2}>
        <PokemonCards />
      </Grid>
      {/* Pokemon team stats cards */}
      <Grid container size={{ xs: 12, sm: 6, md: 5, lg: 6 }} spacing={2}>
        {["Team Defence", "Team Type Coverage"].map(cardTitle => (
          <Grid key={cardTitle} size={{ xs: 12 }}>
            <Paper sx={{ p: 1 }} aria-label={`${cardTitle} Card`} role="region">
              <TeamStats title={cardTitle} />
            </Paper>
          </Grid>
        ))}
        {/* Pokemon more info card */}
        <Grid size={{ xs: 12 }}>
          <Paper>
            <MoreInfo />
          </Paper>
        </Grid>
      </Grid>
    </main>
  );
}

export default Main;
