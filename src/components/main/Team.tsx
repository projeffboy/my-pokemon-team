import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Pokemon from "./Pokemon";
import TabbedTeam from "./TabbedTeam";
import useMediaQuery from "@mui/material/useMediaQuery";

const Team = () =>
  useMediaQuery(theme => theme.breakpoints.down("lg")) ? (
    <TabbedTeam />
  ) : (
    <>
      {[0, 1, 2, 3, 4, 5].map(num => (
        <Grid key={num} size={6}>
          <Paper sx={{ p: 1 }}>
            {/* teamIndex is the pokemon's team slot number - 1 */}
            <Pokemon teamIndex={num} />
          </Paper>
        </Grid>
      ))}
    </>
  );

export default Team;
