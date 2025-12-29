// Material UI Imports
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
// My Component Imports
import Team from "./main/Team";
import TeamStats from "./main/TeamStats";
import MoreInfo from "./main/MoreInfo";

const Main = () => (
  <Grid container component="main" spacing={2}>
    <Grid container size={{ xs: 12, md: 6, lg: 7, xl: 6 }} component="section">
      <Team />
    </Grid>
    {/* Pokemon team stats cards */}
    <Grid
      container
      size={{ xs: 12, md: 6, lg: 5, xl: 6 }}
      spacing={2}
      component="section"
    >
      {["Team Defence", "Team Type Coverage"].map(cardTitle => (
        <Grid key={cardTitle} size={{ xs: 12 }}>
          <Paper sx={{ p: 1 }} aria-label={`${cardTitle} Card`} role="region">
            <TeamStats title={cardTitle} />
          </Paper>
        </Grid>
      ))}
      {/* Pokemon more info card */}
      <Grid size={{ xs: 12 }} component="section">
        <Paper>
          <MoreInfo />
        </Paper>
      </Grid>
    </Grid>
  </Grid>
);

export default Main;
