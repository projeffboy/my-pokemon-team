import React from 'react'
import PokemonInput from './pokemon/pokemon-input'
import Sprite from './pokemon/sprite'
import {pokemonStyles} from '../styles'
import {withStyles} from '@material-ui/core/styles'
// import Grid from '@material-ui/core/Grid'

function Pokemon(props) {
  const {classes} = props

  const placeholders = [
    'Name',
    'Move',
    '',
    'Move',
    'Move',
    'Move',
    'Item',
    'Ability',
  ]

  let counter = 1

  // 8 Grid Items About Each Pokemon
  const pokemonInputs = placeholders.map((placeholder, i) => {
    if (placeholder) {
      let pokemonProp = placeholder.toLowerCase()
      if (placeholder === 'Move') {
        pokemonProp += counter
        counter++
      }
      return (
      <PokemonInput 
        key={i} 
        placeholder={placeholder} 
        teamSlot={props.teamSlot} 
        pokemonProp={pokemonProp}
      />
    )
    } else {
      return (
        <Sprite key={i} teamSlot={props.teamSlot} />
      )
    }
  })

  return (
    <div className={classes.gridContainer}>
      {pokemonInputs}
    </div>
    /* The way to do it with MUI's built-in flex stuff
    <Grid container spacing={0}>
      <Grid item xs={6}><Name /></Grid>
      <Grid item xs={6}><Move /></Grid>
      <Grid item xs={6}><Sprite className={classes.sprite} /></Grid>
      <Grid item xs={6}><Move /></Grid>
      <Grid item xs={6}><Move /></Grid>
      <Grid item xs={6}><Move /></Grid>
      <Grid item xs={6}><Item /></Grid>
      <Grid item xs={6}><Ability /></Grid>
    </Grid>
    */
  )
}

export default withStyles(pokemonStyles)(Pokemon)
