import React from 'react'
// Material UI Imports
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import {withStyles} from '@material-ui/core/styles'
// My Component Imports
import Pokemon from './components/pokemon'
import TeamStats from './components/team-stats'
import {appStyles} from './styles'

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
    // apparently there's a slight horizontal scroll if I don't set this width for <Grid />
    // the original width for <Grid /> was calc(100% + 24px)
    <Grid container spacing={24} style={{width: 'calc(100% + 20px)'}}>
      {cards}
    </Grid>
  )
}

export default withStyles(appStyles)(App)
