import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
//import FileCopy from '@material-ui/icons/FileCopy'
//import SaveAlt from '@material-ui/icons/SaveAlt'

const styles = theme => ({
  root: {display: 'none'},
  button: {
    margin: theme.spacing.unit,
    [theme.breakpoints.down('sm')]: {padding: '4px 8px'},
    [theme.breakpoints.only('md')]: {margin: 4},
  },
  input: {display: 'none'},
})

function PokemonShowdownTeams(props) {
  const {classes, width} = props
  //const Icons = [<ArrowUpward />, <FileCopy />, <SaveAlt />]

  let buttonLabels = ['Import Team', 'Download Team', 'Copy Team']
  if (width === 'xs' || width === 'sm') {
    buttonLabels = ['Import', 'Download', 'Copy']
  }

  return (
    buttonLabels.map((buttonLabel, i) => (
      <Grid key={buttonLabel} item container justify='center' xs={6} lg={4}>
        <input
          accept='image/*'
          className={classes.input}
          id={'outlined-button-file-' + i}
          multiple
          type='file'
        />
        <label htmlFor={'outlined-button-file-' + i}>
          <Button variant='outlined' component='span' className={classes.button}>
            {buttonLabel}
            <ArrowUpward />
          </Button>
        </label>
      </Grid>
    ))
  )
}

export default withStyles(styles)(PokemonShowdownTeams)