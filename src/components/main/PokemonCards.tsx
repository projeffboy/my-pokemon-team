import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Pokemon from "./Pokemon";
import TeamViewer from "./TeamViewer";
import useWidth from "../../useWidth";

function PokemonCards() {
  const width = useWidth();

  if (width !== "xs" && width !== "sm" && width !== "md") {
    // if viewport width >=960px
    // Display 6 pokemon cards
    return (
      <>
        {[0, 1, 2, 3, 4, 5].map(num => (
          <Grid key={num} size={{ xs: 6 }}>
            <Paper sx={{ p: 1 }}>
              {/* teamIndex is the pokemon's team slot number - 1 */}
              <Pokemon teamIndex={num} />
            </Paper>
          </Grid>
        ))}
      </>
    );
  } else {
    // if viewport width less than 960px
    // Display 1 or 2 pokemon cards
    return <TeamViewer />;
  }
}

export default PokemonCards;
