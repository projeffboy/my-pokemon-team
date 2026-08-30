import type { ReactNode } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import PokemonInputs from "./cards/PokemonInputs";
import TeamStats from "./cards/TeamStats";
import MoreInfo from "./cards/MoreInfo";
import TeamViewer from "./cards/TeamViewer";
import { useBreakpoint } from "../../WidthContext";

export default function Cards() {
  const width = useBreakpoint();

  function pokemonCards(): ReactNode {
    if (width !== "xs" && width !== "sm") {
      // if viewport width >=960px
      // Display 6 pokemon cards
      return [0, 1, 2, 3, 4, 5].map(num => (
        <Grid key={num} size={6}>
          <Paper sx={{ p: 1 }}>
            {/* teamIndex is the pokemon's team slot number - 1 */}
            <PokemonInputs teamIndex={num} />
          </Paper>
        </Grid>
      ));
    } else {
      // if viewport width less than 960px
      // Display 1 or 2 pokemon cards
      return <TeamViewer />;
    }
  }

  return (
    <>
      {/* Pokemon cards */}
      <Grid container size={{ xs: 12, sm: 6, md: 7, lg: 6 }} spacing={2}>
        {pokemonCards()}
      </Grid>
      {/* Pokemon team stats cards */}
      <Grid container size={{ xs: 12, sm: 6, md: 5, lg: 6 }} spacing={2}>
        {(["Team Defence", "Team Type Coverage"] as const).map(cardTitle => (
          <Grid key={cardTitle} size={12}>
            <Paper sx={{ p: 1 }} aria-label={`${cardTitle} Card`} role="region">
              <TeamStats title={cardTitle} />
            </Paper>
          </Grid>
        ))}
        {/* Pokemon more info card */}
        <Grid size={12}>
          <Paper>
            <MoreInfo />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
