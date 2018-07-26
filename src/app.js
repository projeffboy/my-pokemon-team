import React from 'react'
// My Component Imports
import Pokemon from './components/pokemon'
import TeamStats from './components/team-stats'
import {appStyles} from './styles'
// Material UI Imports
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import {withStyles} from '@material-ui/core/styles'

function App(props) {
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
    'Settings',
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
    } else {
      return (
        // 3 Right Cards
        <Grid key={i} item xs={6}>
          <Paper className={classes.paper}>
            <TeamStats title={cardTitle} />
          </Paper>
        </Grid>
      )
    }
  })

  return (
    // All 9 Cards
    <React.Fragment>
      <Grid container spacing={24}>
        {cards}
      </Grid>
    </React.Fragment>
  )
}

export default withStyles(appStyles)(App)
