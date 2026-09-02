import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import PokemonInputs from "./main/PokemonInputs";
import TeamStats from "./main/TeamStats";
import MoreInfo from "./main/MoreInfo";
import TeamViewer from "./main/TeamViewer";
import { useIsMdDown } from "@/WidthContext";

export default function Main() {
  const isMdDown = useIsMdDown();

  return (
    <Grid component="main" container size={12} spacing={2}>
      {/* Pokemon cards */}
      <Grid container size={{ xs: 12, sm: 6, md: 7, lg: 6 }} spacing={2}>
        {
          isMdDown ?
            // Display 1 or 2 pokemon cards
            <TeamViewer />
            // Display 6 pokemon cards
          : [0, 1, 2, 3, 4, 5].map(num => (
              <Grid key={num} size={6}>
                <Paper sx={{ p: 1 }}>
                  {/* teamIndex is the pokemon's team slot number - 1 */}
                  <PokemonInputs teamIndex={num} />
                </Paper>
              </Grid>
            ))

        }
      </Grid>
      {/* Pokemon team stats cards */}
      <Grid container size={{ xs: 12, sm: 6, md: 5, lg: 6 }} spacing={2}>
        {(["Team Defence", "Team Type Coverage"] as const).map(cardTitle => (
          <Grid key={cardTitle} size={12}>
            <Paper
              sx={{ p: 1 }}
              aria-labelledby={`${cardTitle.replaceAll(" ", "-").toLowerCase()}-heading`}
              role="region"
            >
              <TeamStats
                title={cardTitle}
                titleId={`${cardTitle.replaceAll(" ", "-").toLowerCase()}-heading`}
              />
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
    </Grid>
  );
}
