import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TeamAspectStats from "./team-stats/TeamAspectStats";

export type TeamStatTitle = "Team Defence" | "Team Type Coverage";

export default function TeamStats() {
  return (["Team Defence", "Team Type Coverage"] as const).map(title => {
    const titleId = `${title.replaceAll(" ", "-").toLowerCase()}-heading`;

    return (
      <Grid key={title} size={12}>
        <Paper sx={{ p: 1 }} aria-labelledby={titleId} role="region">
          <TeamAspectStats title={title} titleId={titleId} />
        </Paper>
      </Grid>
    );
  });
}
