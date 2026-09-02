import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import PokemonInputs from "./PokemonInputs";
import TeamViewer from "./team-viewer/TeamViewer";
import { useIsMdDown } from "@/WidthContext";

export default function PokemonTeam() {
  const isMdDown = useIsMdDown();

  return isMdDown ?
      <TeamViewer />
    : [0, 1, 2, 3, 4, 5].map(num => (
        <Grid key={num} size={6}>
          <Paper sx={{ p: 1 }}>
            {/* teamIndex is the pokemon's team slot number - 1 */}
            <PokemonInputs teamIndex={num} />
          </Paper>
        </Grid>
      ));
}
