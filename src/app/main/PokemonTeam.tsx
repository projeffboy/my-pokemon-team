import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import SlotDragContext from "./pokemon-team/shared/SlotDragContext";
import PokemonInputs from "./pokemon-team/shared/PokemonInputs";
import TeamToolbar from "./pokemon-team/shared/TeamToolbar";
import SmTeamViewer from "./pokemon-team/SmTeamViewer";
import XsTeamViewer from "./pokemon-team/XsTeamViewer";
import { useIsMdDown, useIsSmDown } from "@/app/shared/WidthContext";

export default function PokemonTeam() {
  const isMdDown = useIsMdDown();
  const isSmDown = useIsSmDown();

  if (isMdDown) return isSmDown ? <XsTeamViewer /> : <SmTeamViewer />;

  return (
    <SlotDragContext>
      <Grid size={12}>
        <Paper>
          <TeamToolbar />
        </Paper>
      </Grid>
      {[0, 1, 2, 3, 4, 5].map(num => (
        <Grid key={num} size={6}>
          <Paper sx={{ p: 1 }}>
            {/* teamIndex is the pokemon's team slot number - 1 */}
            <PokemonInputs teamIndex={num} />
          </Paper>
        </Grid>
      ))}
    </SlotDragContext>
  );
}
