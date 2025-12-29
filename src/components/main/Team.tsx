import Grid from "@mui/material/Grid";
import Pokemon from "./Pokemon";
import TabbedTeam from "./TabbedTeam";
import useMediaQuery from "@mui/material/useMediaQuery";
import { range } from "../../helper";

const Team = () =>
  useMediaQuery(theme => theme.breakpoints.down("lg")) ? (
    <TabbedTeam />
  ) : (
    <>
      {range(6).map(i => (
        <Grid key={i} size={6} component="section">
          <Pokemon teamIndex={i} />
        </Grid>
      ))}
    </>
  );

export default Team;
