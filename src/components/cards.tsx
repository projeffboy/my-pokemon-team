// Material UI Imports
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
// My Component Imports
import Pokemon from "./cards/Pokemon";
import TeamStats from "./cards/TeamStats";
import MoreInfo from "./cards/MoreInfo";
import TeamViewer from "./cards/TeamViewer";
import useWidth from "../useWidth";

interface CardsProps {
  darkMode: boolean;
}

function Cards({ darkMode }: CardsProps) {
  const width = useWidth();
  console.log("Cards rendering, width:", width);
  /*
   * What is width?
   * If the viewport width is...
   * >=1920, it will only return xl
   * >=1200, it will only return lg (I manually changed it from 1280 to 1200)
   * >=960, it will only return md
   * >=600, it will only return sm
   * <600, it will only return xs
   */

  function pokemonCards() {
    if (width !== "xs" && width !== "sm") {
      // if viewport width >=960px
      // Display 6 pokemon cards
      return [0, 1, 2, 3, 4, 5].map(num => (
        <Grid key={num} size={{ xs: 6 }}>
          <Paper sx={{ p: 1 }}>
            {/* teamIndex is the pokemon's team slot number - 1 */}
            <Pokemon teamIndex={num} width={width} />
          </Paper>
        </Grid>
      ));
    } else {
      // if viewport width less than 960px
      // Display 1 or 2 pokemon cards
      return <TeamViewer width={width} />;
    }
  }

  return (
    /*
     * What do the lg, md, sm, and xs attributes mean?
     *
     * They all accept a number from 1 to 12,
     * describing the width of a grid in a 12-grid system.
     *
     * When the viewport width is...
     *  1200px or above, it will only use the lg attribute (I manually changed it from 1280px to 1200px)
     *  960px or above, it will only use the md attribute
     *  600 or above, it will only use the sm attribute
     *  Below that, it will only use the xs attribute
     */
    <>
      {/* Pokemon cards */}
      <Grid container size={{ xs: 12, sm: 6, md: 7, lg: 6 }} spacing={2}>
        {pokemonCards()}
      </Grid>
      {/* Pokemon team stats cards */}
      <Grid container size={{ xs: 12, sm: 6, md: 5, lg: 6 }} spacing={2}>
        {["Team Defence", "Team Type Coverage"].map(cardTitle => (
          <Grid key={cardTitle} size={{ xs: 12 }}>
            <Paper sx={{ p: 1 }} aria-label={`${cardTitle} Card`} role="region">
              <TeamStats
                title={cardTitle}
                width={width}
                darkMode={darkMode}
              />
            </Paper>
          </Grid>
        ))}
        {/* Pokemon more info card */}
        <Grid size={{ xs: 12 }}>
          <Paper>
            <MoreInfo width={width} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default Cards;
