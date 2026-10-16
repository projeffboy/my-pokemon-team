import { useRef } from "react";
import Grid from "@mui/material/Grid";
import PokemonTeam from "./main/PokemonTeam";
import TeamStats from "./main/TeamStats";

export default function Main() {
  // The analysis column measures the team column to end near it
  const teamColumn = useRef<HTMLDivElement>(null);

  return (
    <Grid
      component="main"
      container
      size={12}
      spacing={{ xxs: 2, sm: 3 }}
      // Side by side, the columns start level, so the toolbar and the panel's title line up
      sx={{ alignItems: "flex-start" }}
    >
      <Grid
        ref={teamColumn}
        container
        size={{ xxs: 12, sm: 6, md: 7, lg: 6 }}
        spacing={{ xxs: 2, sm: 3 }}
        sx={{ alignContent: "flex-start" }}
      >
        <PokemonTeam />
      </Grid>
      <Grid size={{ xxs: 12, sm: 6, md: 5, lg: 6 }}>
        <TeamStats teamColumn={teamColumn} />
      </Grid>
    </Grid>
  );
}
