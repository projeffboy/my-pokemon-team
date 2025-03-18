import React, {useState} from 'react'
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
import PrivacyPolicy from './privacy-policy'
import UpdateLog from './update-log'
import face1 from './landorus-face.png'
import face2 from './ogerpon-teal-mask-by-jormxdos.png'
import TypeChartDialog from './type-chart-dialog'
import CssBaseline from '@material-ui/core/CssBaseline' // like CSS Reset
import {MuiThemeProvider} from '@material-ui/core/styles' // provide your custom theme
import {theme, darkTheme} from './styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import { BrowserRouter as Router } from 'react-router-dom'
import Ramp from './components/RAMP'

const PUB_ID = 1025446
const WEBSITE_ID = 75399

const face1Alt = 'Landorus Face'
const face2Alt = 'Virizion Face'

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

export default compose(withStyles(appStyles), withWidth())(props => {
  const isSystemDark = window && window.matchMedia('(prefers-color-scheme: dark)').matches
  const [darkMode, setDarkMode] = useState(isSystemDark)

  return (
    /*
     * All 9 Cards
     * apparently there's a slight horizontal scroll if I don't set the width and margin for <Grid />
     * the original width for <Grid /> was calc(100% + 24px)
     */
    <Router>
      <>
        <Ramp PUB_ID={PUB_ID} WEBSITE_ID={WEBSITE_ID} />
        <MuiThemeProvider theme={darkMode ? darkTheme : theme}>
          <CssBaseline />
          <Grid container spacing={16} justify='center' alignItems='center' className={props.classes.root}>
            {/* Header */}
            <Grid item container xs={12} justify='center'>
              <Grid item>
                <img
                  src={face1}
                  alt={face1Alt}
                  height={faceWidth(props.width)}
                  style={{padding: '0 6px'}}
                />
              </Grid>
              <Grid item>
                <Typography
                  variant='h3'
                  style={{padding: '0 20px', fontSize: titleFontSize(props.width) + 'rem'}}>
                  My Pokemon Team
                </Typography>
              </Grid>
              <Grid item>
                <img
                  src={face2}
                  alt={face1Alt}
                  height={faceWidth(props.width)}
                  style={{padding: '0 6px'}}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1' align='center'>
                  For Generation 6 to 9 (Scarlet/Violet)
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='caption' align='center'>
                  <sub>Report Bugs to jeffery124@gmail.com</sub>
                </Typography>
              </Grid>
            </Grid>
            {/* Main */}
            <Cards darkMode={darkMode} />
            {/* Footer */}
            <Grid item container xs={12} justify='center' alignItems='center' spacing={16} style={{paddingBottom: 230}}>
              <Grid item>
                <Manual darkMode={darkMode} />
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
              <Grid item>
                <PrivacyPolicy />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                      value="darkMode"
                    />
                  }
                  label="Dark Mode"
                />
              </Grid>
            </Grid>
          </Grid>
          <MainSnackbar />
          <TypeChartDialog width={props.width} />
        </MuiThemeProvider>
      </>
    </Router>
  )
})

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