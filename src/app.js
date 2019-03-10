import React from 'react'
import compose from 'recompose/compose'
import withWidth from '@material-ui/core/withWidth'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import {withStyles} from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import {observer} from 'mobx-react'
import store from './store'
import {appStyles} from './styles'
import Cards from './components/cards'
import Manual from './manual'
import Credits from './credits'
import UpdateLog from './update-log'
import incineroarFace from './incineroar-face.png'
import landorusFace from './landorus-face.png'
import TypeChartDialog from './type-chart-dialog'

function faceWidth(breakpoint) {
  if (breakpoint !== 'xs') {
    return 48
  } else if (window.innerWidth >= 360) {
    return 32
  } else {
    return 28
  }
}

function titleFontSize(breakpoint) {
  if (breakpoint !== 'xs') {
    return 2.8125
  } else if (window.innerWidth >= 360) {
    return 1.6
  } else {
    return 1.4
  }
}

export default compose(withStyles(appStyles), withWidth())(props => (
    /*
     * All 9 Cards
     * apparently there's a slight horizontal scroll if I don't set the width and margin for <Grid />
     * the original width for <Grid /> was calc(100% + 24px)
     */
    <>
      <Grid container spacing={16} justify='center' alignItems='center' className={props.classes.root}>
        {/* Header */}
        <Grid item container xs={12} justify='center'>
          <Grid item>
            <img src={landorusFace} alt='Landorus Face' height={faceWidth(props.width)} />
          </Grid>
          <Grid item>     
            <Typography 
              variant='h3'
              style={{padding: '0 20px', color: '#212121', fontSize: titleFontSize(props.width) + 'rem'}}>
              My Pokemon Team
            </Typography>
          </Grid>
          <Grid item>
            <img src={incineroarFace} alt='Landorus Face' height={faceWidth(props.width)} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='subtitle1' align='center'>
              For Generation 7
            </Typography>
          </Grid>
        </Grid>
        {/* Main */}
        <Cards />
        {/* Footer */}
        <Grid item container xs={12} justify='center' alignItems='center' spacing={16}>
        <Grid item>
            <Manual />
          </Grid>
          <Grid item>
            <Button
              href='https://jefferytang.com'
              style={{fontWeight: 'initial', textTransform: 'initial'}}
            >
              Jeffery Tang
            </Button>
          </Grid>
          <Grid item>
            <Credits />
          </Grid>
          <Grid item>
            <UpdateLog />
          </Grid>
        </Grid>
      </Grid>
      <MainSnackbar />
      <TypeChartDialog width={props.width} />
    </>
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