import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import {withStyles} from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import {observer} from 'mobx-react'
import store from './store'
import {appStyles} from './styles'
import Cards from './components/cards'

export default withStyles(appStyles)(props => (
    /*
     * All 9 Cards
     * apparently there's a slight horizontal scroll if I don't set the width and margin for <Grid />
     * the original width for <Grid /> was calc(100% + 24px)
     */
    <React.Fragment>
      <Grid container spacing={16} justify='center' alignItems='center' className={props.classes.root}>
        {/* Header */}
        <Grid item xs={12}>
          <Typography variant='display2' align='center'>
            Poke Builder
          </Typography>
        </Grid>
        {/* Main */}
        <Cards />
        {/* Footer */}
        <Grid item xs={12}>
          <Typography variant='body1' align='center'>
            Created by <a href='http://jefferytang.co.nf'>Jeffery Tang</a>
          </Typography>
        </Grid>
      </Grid>
      <MainSnackbar />
    </React.Fragment>
))

// Snackbar is managed by MobX
// Can be opened by importing store.js then running store.openSnackbar(msg)
@observer
class MainSnackbar extends React.Component {
  render() {
    return (
      <Snackbar
        open={store.isSnackbarOpen}
        autoHideDuration = {2500}
        onClose={() => store.isSnackbarOpen = false}
        ContentProps={{'aria-describedby': 'message-id'}}
        message={<span id='message-id'>{store.snackbarMsg}</span>}
      />
    )
  }
}