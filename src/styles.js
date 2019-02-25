import {createMuiTheme} from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'

// index.js (THEME)
export const theme = createMuiTheme({
  palette: {
    primary: {main: grey[900]},
    secondary: {main: grey[900]},
  },
})

theme.breakpoints.values.lg = 1200

// app.js
export const appStyles = {
  '@global': {
    'html, body, #root': {height: '100%', backgroundColor: '#eee', color: '#212121'},
  },
})

export const pokemonStyles = () => ({
  gridContainer: {
    display: 'grid',
    gridColumnGap: '10px',
    gridTemplateColumns: '1fr 1fr',
  },
})

export const pokemonGridItemStyles = () => ({
  sprite: {gridRow: '2 / 5'},
  gridItem: {minWidth: 0}, // otherwise the grid items will overflow
})
