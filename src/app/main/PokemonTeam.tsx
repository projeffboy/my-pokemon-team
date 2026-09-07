import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import PokemonInputs from "./pokemon-team/PokemonInputs";
import SmTeamViewer from "./pokemon-team/SmTeamViewer";
import XsTeamViewer from "./pokemon-team/XsTeamViewer";
import { useBreakpoint, useIsMdDown } from "@/app/shared/WidthContext";

export default function PokemonTeam() {
  const isMdDown = useIsMdDown();
  const width = useBreakpoint();

  return (
    isMdDown ?
      width === "xs" ?
        <XsTeamViewer />
      : <SmTeamViewer />
    : [0, 1, 2, 3, 4, 5].map(num => (
        <Grid key={num} size={6}>
          <Paper sx={{ p: 1 }}>
            {/* teamIndex is the pokemon's team slot number - 1 */}
            <PokemonInputs teamIndex={num} />
          </Paper>
        </Grid>
      ))
  );
}
