import {createMuiTheme} from '@material-ui/core/styles'
import blueGrey from '@material-ui/core/colors/blueGrey'

// index.js (THEME)
export const theme = createMuiTheme({
  palette: {primary: blueGrey},
})

theme.breakpoints.values.lg = 1200

// app.js
export const appStyles = {
  '@global': {
    'html, body, #root': {height: '100%'}
  },
  root: {
    height: '100%',
    width: '100%',
    margin: 0,
  }
}

// When using the Paper component
export const paperStyles = {
  // Provides padding to Paper
  applyPadding: {padding: theme.spacing.unit}
}

// cards.js


// pokemon.js
export const pokemonStyles = {
  gridContainer: {
    display: 'grid',
    gridColumnGap: '10px',
    gridTemplateColumns: '1fr 1fr',
  }
}

// pokemon-input.js
// sprite.js
export const pokemonInputStyles = {
  spriteContainer: {
    gridRow: '2 / 5',
    [theme.breakpoints.down('sm')]: {gridRow: '2 / 7'}
  },
  sprite: {
    // keep the image contained in its div box
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

// team-stats.js
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

// more-info.js
export const moreInfoStyles = {
  root: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 4,
  },
  appBar: {borderRadius: '4px 4px 0 0'},
  tab: {minWidth: 'initial'},
}

// search-filters.js
export const searchFiltersStyles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  formControl: {
    minWidth: 120,
    [theme.breakpoints.down('sm')]: {minWidth: 90},
    margin: 10,
    [theme.breakpoints.down('md')]: {margin: '0 10px 10px'},
  },
})

// team-checklist.js
export const teamChecklistStyles = {
  miniHeader: {
    fontWeight: 'bold',
    paddingBottom: 10,
  },
}

// pokemon-showdown-team.js


// team-viewer.js
export const teamViewerStyles = {
  twoSprites: {
    display: 'flex',
    height: 75,
  },
  oneOfTwoPkmn: {padding: '14px 10px'},
  xsTab: {minWidth: 0},
}

