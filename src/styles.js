import {createMuiTheme} from '@material-ui/core/styles'
import blueGrey from '@material-ui/core/colors/blueGrey'

// index.js (THEME)
export const theme = createMuiTheme({
  palette: {primary: blueGrey},
})

theme.breakpoints.values.lg = 1200

// app.js
export const appStyles = {
  paper: {
    padding: 10,
    textAlign: 'center',
  }
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
export const moreInfoStyles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 4,
  },
  appBar: {borderRadius: '4px 4px 0 0'},
  tab: {minWidth: 'initial'},
})

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
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
})

// team-checklist.js
export const teamChecklistStyles = {
  root: {color: 'rgba(0, 0, 0, 0.54)'},
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

