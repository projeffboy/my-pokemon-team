export const appStyles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary
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
