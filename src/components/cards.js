import React from 'react'
import compose from 'recompose/compose'
// Material UI Imports
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import {withStyles} from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
// My Component Imports
import Pokemon from './cards/pokemon'
import TeamStats from './cards/team-stats'
import MoreInfo from './cards/more-info'
import {paperStyles} from '../styles'
import TeamViewer from './cards/team-viewer'

function Cards(props) {
  const {classes, width} = props
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
    if (width !== 'xs' && width !== 'sm') { // if viewport width >=960px
      // Display 6 pokemon cards
      return [0, 1, 2, 3, 4, 5].map(num => (
        <Grid key={num} item xs={6}>
          <Paper className={classes.applyPadding}>
            {/* teamIndex is the pokemon's team slot number - 1 */}
            <Pokemon teamIndex={num} />
          </Paper>
        </Grid>
      ))
    } else { // if viewport width less than 960px
      // Display 1 or 2 pokemon cards
      return <TeamViewer width={width} />
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
      <Grid item container lg={6} md={7} sm={6} xs={12} spacing={16}>
        {pokemonCards()}
      </Grid>
      {/* Pokemon team stats cards */}
      <Grid item container lg={6} md={5} sm={6} xs={12} spacing={16}>
        {
          ['Team Defence', 'Team Type Coverage'].map(cardTitle => (
            <Grid key={cardTitle} item xs={12}>
              <Paper className={classes.applyPadding}>
                <TeamStats title={cardTitle} width={width} />
              </Paper>
            </Grid>
          ))
        }
        {/* Pokemon more info card */}
        <Grid item xs={12}>
          <Paper>
            <MoreInfo width={width} />
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default compose(withStyles(paperStyles), withWidth())(Cards)