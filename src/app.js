import React from 'react'
// Material UI Imports
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
// My Component Imports
import Pokemon from './components/pokemon'
import TeamStats from './components/team-stats'
import MoreInfo from './components/more-info'
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
    // All 9 Cards
    // apparently there's a slight horizontal scroll if I don't set the width and margin for <Grid />
    // the original width for <Grid /> was calc(100% + 24px)
    <Grid container spacing={16} style={{width: '100%', margin: 0}}>
      <Grid item xs={12}>
        <Typography variant='display2' align='center'>
          Poke Builder
        </Typography>
      </Grid>
      {cards}
      <Grid item xs={12}>
        <Typography variant='body1' align='center'>
          Created by Jeffery Tang
        </Typography>
      </Grid>
    </Grid>
  )
}

export default withStyles(appStyles)(App)
