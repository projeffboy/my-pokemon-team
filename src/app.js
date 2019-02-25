import React from 'react'
import compose from 'recompose/compose'
import withWidth from '@material-ui/core/withWidth'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import {withStyles} from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import {observer} from 'mobx-react'
import store from './store'
import {appStyles} from './styles'
import Cards from './components/cards'
import Credits from './credits'
import incineroarFace from './incineroar-face.png'
import landorusFace from './landorus-face.png'

let faceWidth = breakpoint => breakpoint !== 'xs' ? 48 : 32
let titleFontSize = breakpoint => breakpoint !== 'xs' ? 2.8125 : 1.6

export default compose(withStyles(appStyles), withWidth())(props => (
    /*
     * All 9 Cards
     * apparently there's a slight horizontal scroll if I don't set the width and margin for <Grid />
     * the original width for <Grid /> was calc(100% + 24px)
     */
    <React.Fragment>
      <Grid container spacing={16} justify='center' alignItems='center' className={props.classes.root}>
        {/* Header */}
        <Grid item container xs={12} justify='center'>
          <Grid item>
            <img src={landorusFace} alt='Landorus Face' height={faceWidth(props.width)} />
          </Grid>
          <Grid item>     
            <Typography 
              variant='display2'
              style={{padding: '0 20px', color: '#212121', fontSize: titleFontSize(props.width) + 'rem'}}>
              My Pokemon Team
            </Typography>
          </Grid>
          <Grid item>
            <img src={incineroarFace} alt='Landorus Face' height={faceWidth(props.width)} />
          </Grid>
          <Grid item xs={12} justify='center'>
            <Typography align='center'>
              For Generation 7
            </Typography>
          </Grid>
        </Grid>
        {/* Main */}
        <Cards />
        {/* Footer */}
        <Grid item container xs={12} justify='center' alignItems='center' spacing={16}>
          <Grid item>
            <Typography variant='body1' align='center'>
              <Credits />
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant='body1' align='center'>
              <Button
                href='http://jefferytang.co.nf'
                style={{fontWeight: 'initial', textTransform: 'initial'}}
              >Jeffery Tang</Button>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant='body1' align='center'>
              Updated Feb 24, 2019
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default withStyles(appStyles)(App)
