import React from 'react'
// Material UI Imports
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import {withStyles} from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import compose from 'recompose/compose'
// My Component Imports
import Pokemon from './pokemon'
import TeamStats from './team-stats'
import MoreInfo from './more-info'
import {appStyles} from '../styles'
import TeamViewer from './team-viewer.js'

function Cards(props) {
  const {classes, width} = props

  function pokemonCards() {
    if (width !== 'xs' && width !== 'sm') {
      return [1, 2, 3, 4, 5, 6].map(num => (
        <Grid key={num} item xs={6}>
          <Paper className={classes.paper}>
            <Pokemon teamSlot={num} />
          </Paper>
        </Grid>
      ))
    } else {
     return <TeamViewer />
    }
  }

  return (
    <React.Fragment>
      <Grid item container lg={6} md={7} sm={6} xs={12} spacing={16}>
        {pokemonCards()}
      </Grid>
      <Grid item container lg={6} md={5} sm={6} xs={12} spacing={16}>
        {
          ['Type Defence', 'Type Coverage'].map(cardTitle => (
            <Grid key={cardTitle} item xs={12}>
              <Paper className={classes.paper}>
                <TeamStats title={cardTitle} />
              </Paper>
            </Grid>
          ))
        }
        <Grid item xs={12}>
          <Paper>
            <MoreInfo />
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default compose(withStyles(appStyles), withWidth())(Cards)