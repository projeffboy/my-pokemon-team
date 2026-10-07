import { TypeIconProvider } from "./main/shared/TypeIconContext";
import Grid from "@mui/material/Grid";
import PokemonTeam from "./main/PokemonTeam";
import TeamStats from "./main/TeamStats";

export default function Main() {
  return (
    <TypeIconProvider>
      <Grid component="main" container size={12} spacing={{ xxs: 2, sm: 3 }}>
        <Grid
          container
          size={{ xxs: 12, sm: 6, md: 7, lg: 6 }}
          spacing={{ xxs: 2, sm: 3 }}
          sx={{ alignContent: "flex-start" }}
        >
          <PokemonTeam />
        </Grid>
        <Grid size={{ xxs: 12, sm: 6, md: 5, lg: 6 }}>
          <TeamStats />
        </Grid>
      </Grid>
    </TypeIconProvider>
  );
}
