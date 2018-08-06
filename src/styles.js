import {createMuiTheme} from '@material-ui/core/styles'
import blueGrey from '@material-ui/core/colors/blueGrey'
import green from '@material-ui/core/colors/green'

export const theme = createMuiTheme({ // for index.js
  palette: {primary: blueGrey},
})

theme.breakpoints.values.lg = 1200

export const appStyles = {
  paper: {
    padding: 10,
    textAlign: 'center',
  }
}

export const pokemonStyles = {
  gridContainer: {
    display: 'grid',
    gridColumnGap: '10px',
    gridTemplateColumns: '1fr 1fr',
  }
}

export const pokemonInputStyles = { // for sprite.js too
  spriteContainer: {
    gridRow: '2 / 5',
    [theme.breakpoints.down('sm')]: {gridRow: '2 / 7'}
  },
  sprite: {
    /* keep the image contained in its div box */
    maxHeight: '100%',
    maxWidth: '100%',
  },
  miniSprite: {
    width: '100%',
  },
  gridItem: {
    minWidth: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }, // otherwise the grid items will overflow
}

export const teamStatsStyles = {
  typeContainer: {
    padding: 3,
    [theme.breakpoints.down('sm')]: {padding: '3px 1px'},
  },
  pokemonType: {
    color: 'white',
    borderRadius: 5,
    display: 'block',
    width: '75%',
    [theme.breakpoints.down('sm')]: {width: '100%'},
    margin: 'auto',
    padding: '1px 0',
  },
}

export const teamChecklistStyles = {
  root: {color: 'rgba(0, 0, 0, 0.54)'},
  miniHeader: {
    fontWeight: 'bold',
    paddingBottom: 10,
  },
}

export const teamViewerStyles = {
  twoSprites: {
    display: 'flex',
    height: 75,
  },
  oneOfTwoPkmn: {padding: '14px 10px'},
  xsTab: {minWidth: 0},
}
