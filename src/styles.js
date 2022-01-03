import {createMuiTheme} from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'



// index.js (THEME)
export const theme = createMuiTheme({
  palette: {
    primary: {main: grey[900]},
    secondary: {main: grey[900]},
    background: {default: "#eee"},
  },
  typography: {
    useNextVariants: true,
  },
})

export const darkTheme = createMuiTheme({
  palette: {
    primary: {main: grey[200]},
    secondary: {main: grey[200]},
    type: 'dark',
    text: {
      primary: grey[300]
    }
  },
  typography: {
    useNextVariants: true,
  },
})

theme.breakpoints.values.lg = 1200

// app.js
export const appStyles = {
  '@global': {
    'html, body, #root': {height: '100%'},
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
  smallerSprite: {
    maxHeight: '96px',
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

// pokemon-input-select
const ITEM_HEIGHT = 48
export const pokemonInputSelectStyles = theme => ({
  // We had to use a lot of global selectors in order to style react-select.
  // We are waiting on https://github.com/JedWatson/react-select/issues/1679
  // to provide a much better implementation.
  // Also, we had to reset the default style injected by the library.
  '@global': {
    '.Select-control': {
      display: 'flex',
      alignItems: 'center',
      border: 0,
      height: 'auto',
      background: 'transparent',
      '&:hover': {
        boxShadow: 'none',
      },
    },
    '.Select-multi-value-wrapper': {
      flexGrow: 1,
      display: 'flex',
      flexWrap: 'wrap',
    },
    '.Select--multi .Select-input': {
      margin: 0,
    },
    '.Select.has-value.is-clearable.Select--single > .Select-control .Select-value': {
      padding: 0,
    },
    '.Select.has-value.Select--single > .Select-control .Select-value .Select-value-label, .Select.has-value.is-pseudo-focused.Select--single > .Select-control .Select-value .Select-value-label': {
      color: theme.palette.text.primary
    },
    '.Select-noresults': {
      padding: theme.spacing.unit * 2,
      textAlign: 'center',
    },
    '.Select-input': {
      display: 'inline-flex !important',
      padding: 0,
      height: 'auto',
    },
    '.Select-input input': {
      padding: 0,
      background: 'transparent',
      border: 0,
      cursor: 'default',
      display: 'inline-block',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      margin: 0,
      outline: 0,
    },
    '.Select-placeholder, .Select--single .Select-value': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(16),
      display: 'flex',
      alignItems: 'center',
      padding: 0,
    },
    '.Select-placeholder': {
      opacity: 0.6,
      color: theme.palette.text.primary,
    },
    '.Select-menu-outer': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      position: 'absolute',
      left: 0,
      top: `calc(100% + ${theme.spacing.unit}px)`,
      width: '100%',
      zIndex: 2,
      maxHeight: ITEM_HEIGHT * 4.5,
      border: 0,
    },
    '.Select.is-focused:not(.is-open) > .Select-control': {
      boxShadow: 'none',
    },
    '.Select-menu': {
      maxHeight: ITEM_HEIGHT * 4.5,
      overflowY: 'auto',
    },
    '.Select-menu div': {
      boxSizing: 'content-box',
    },
    '.Select-arrow-zone, .Select-clear-zone': {
      height: 21,
      color: theme.palette.action.active,
      cursor: 'pointer',
      width: 21,
      zIndex: 1,
    },
    // Only for screen readers. We can't use display none.
    '.Select-aria-only': {
      position: 'absolute',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      height: 1,
      width: 1,
      margin: -1,
    },
    '.VirtualizedSelectOption': {
      padding: 0,
    },
  },
})


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
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing.unit,
  },
  list: {
    listStyle: 'none', 
    padding: 0,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
  },
  multiplier: {
    width: 40,
    textAlign: 'right', 
    paddingRight: 4,
  }
}

// more-info.js
export const moreInfoStyles = {
  root: {
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
export const pokemonShowdownTeamStyles = {
  button: {margin: theme.spacing.unit},
  textField: {margin: '20px 0'},
}

// team-viewer.js
export const teamViewerStyles = {
  twoSprites: {
    display: 'flex',
    height: 75,
  },
  oneOfTwoPkmn: {padding: '8px'},
  xsTab: {minWidth: 0},
}

