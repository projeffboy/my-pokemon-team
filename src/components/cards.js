import React from 'react'
// Material UI Imports
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
// My Component Imports
import Pokemon from './pokemon'
import TeamStats from './team-stats'
import MoreInfo from './more-info'
import {appStyles} from '../styles'

function Cards(props) {
  const {classes} = props

  // 3 Right Cards
  const cardTitles = [
    1,
    2,
    'Type Defence',
    3,
    4,
    'Type Coverage',
    5,
    6,
    '', // MoreInfo
  ]

  // 9 Total Cards
  const cards = cardTitles.map((cardTitle, i) => {
    if (typeof cardTitle === 'number') {
      return (
        // 6 Pokemon Cards
        <Grid key={i} item xs={3}>
          <Paper className={classes.paper}>
            <Pokemon teamSlot={cardTitle} />
          </Paper>
        </Grid>
      )
    } else if (cardTitle) {
      return (
        // 2 of the Right Cards
        <Grid key={i} item xs={6}>
          <Paper className={classes.paper}>
            <TeamStats title={cardTitle} />
          </Paper>
        </Grid>
      )
    } else {
      return (
        // The Bottom Right Card
        <Grid key={i} item xs={6}>
          <Paper>
            <MoreInfo />
          </Paper>
        </Grid>
      )
    }
  })

  

  return (
    <React.Fragment>
      {cards}
    </React.Fragment>
  )
}

export default withStyles(appStyles)(Cards)