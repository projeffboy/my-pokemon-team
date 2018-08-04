import { createMuiTheme } from '@material-ui/core/styles'
import blueGrey from '@material-ui/core/colors/blueGrey'
import green from '@material-ui/core/colors/green'

export const theme = createMuiTheme({ // for index.js
  palette: {primary: blueGrey},
})

theme.breakpoints.values.md = 1024

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
  sprite: {gridRow: '2 / 5'},
  gridItem: {
    minWidth: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } // otherwise the grid items will overflow
}

export const teamStatsStyles = () => ({
  pokemonType: {
    color: 'white',
    borderRadius: 5,
    display: 'block',
    width: '75%',
    margin: 'auto',
    padding: '1px 0',
  }
})

export const teamChecklistStyles = {
  root: {color: 'rgba(0, 0, 0, 0.54)'},
  miniHeader: {
    fontWeight: 'bold',
    paddingBottom: 10,
  },
}
