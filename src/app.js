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
  const cardTitles = Array(9).fill('')
  cardTitles[2] = 'Type Defence'
  cardTitles[5] = 'Type Coverage'
  cardTitles[8] = 'Settings'

  // 9 Total Cards
  const cards = cardTitles.map((v, i) => {
    if (!v) {
      return (
        // 6 Pokemon Cards
        <Grid key={i} item xs={3}>
          <Paper className={classes.paper}>
            <Pokemon />
          </Paper>
        </Grid>
      )
    } else {
      return (
        // 3 Right Cards
        <Grid key={i} item xs={6}>
          <Paper className={classes.paper}>
            <TeamStats title={v} />
          </Paper>
        </Grid>
      )
    }
  })

  return (
    <React.Fragment>
      <Grid container spacing={24}>
        {cards}
      </Grid>
    </React.Fragment>
  )
}

export default withStyles(appStyles)(App)
