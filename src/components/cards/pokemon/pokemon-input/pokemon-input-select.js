// Source code initially take from here: https://material-ui.com/demos/autocomplete/

import React from 'react'
// Material UI Imports
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'
import {withStyles} from '@material-ui/core/styles'
import ClearIcon from '@material-ui/icons/Clear'
// React Select
// import Select from 'react-select' (We are using react-virtualized-select instead)
import 'react-select/dist/react-select.css'
// React Virtualized
import 'react-virtualized-select/styles.css'
import VirtualizedSelect from 'react-virtualized-select'
// Custom Imports
import pokedex from '../../../../data/pokedex'
import items from '../../../../data/items'
import altSpriteNum from '../../../../data/altSpriteNum'
import {pokemonInputSelectStyles} from '../../../../styles'

// Returns an Input containing the <select>
// In charge of communicating with the store (store.js)
function PokemonInputSelect(props) {
  const {classes, optionValues, optionLabels} = props
  const optionsWithLabels = optionValues.map((optionValue, i) => ({
    value: optionValue,
    label: optionLabels[i],
  }))

  return (
    <Input
      fullWidth
      inputComponent={CustomSelect}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
      id='react-select-single'
      inputProps={{
        classes,
        name: 'react-select-single',
        instanceId: 'react-select-single',
        simpleValue: true,
        options: optionsWithLabels,
      }}
    />
  )
}

// Returns the actual <select>
function CustomSelect(props) {
  const {classes, ...otherProps} = props

  return (
    <VirtualizedSelect
      optionRenderer={virtualizedSelectProps => Option(virtualizedSelectProps, otherProps)}
      clearRenderer={() => <ClearIcon />}
      noResultsText={<Typography>Nothing found</Typography>}
      {...otherProps}
    />
  )
}

// Returns an <option> in <select>
// Containing both icon and option value
function Option(props, parentProps) {
  const {style, option, onSelect} = props
  const {placeholder} = parentProps

  // Set the styles for certain options
  let horizontalPadding = 0
  let width = 0
  if (placeholder === 'Name') {
    width = 40
  } else if (placeholder === 'Item') {
    width = 24
  } else {
    horizontalPadding = 10
    width = 0
  }

  function handleClick(event) {
    onSelect(option, event)
  }

  return (
    <div
      key={option.value}
      style={{...style, padding: `0 ${horizontalPadding}px`}}
      className='VirtualizedSelectOption'
      onClick={handleClick}
    >
      <PkmnIcon placeholder={placeholder} optionValue={option.value} width={width} />
      <span style={{width: `calc(100% - ${width}px)`}}>
        {option.label}
      </span>
    </div>
  )
}

/*
 * Returns the icon next to the option value
 * "smicons" is short for sun and moon icons for all the pokemon
 * You can find them here: https://play.pokemonshowdown.com/sprites/smicons-sheet.png
 * You can find the "itemicons" here: https://play.pokemonshowdown.com/sprites/itemicons-sheet.png
 */
function PkmnIcon(props) {
  const {placeholder, optionValue, width} = props

  if (placeholder === 'Name' || placeholder === 'Item') {
    let type
    let left
    let top
    let height

    if (placeholder === 'Name') {
      type = 'sm'

      const pokedexNumber = altSpriteNum[optionValue] || pokedex[optionValue].num

      // Copied from Pokemon Showdown code
      left = (pokedexNumber % 12) * 40
      top = Math.floor(pokedexNumber / 12) * 30

      height = 30
    } else if (placeholder === 'Item') {
      type = 'item'

      const itemNumber = items[optionValue].spritenum

      // Copied from Pokemon Showdown code
      left = (itemNumber % 16) * 24
      top = Math.floor(itemNumber / 16) * 24

      height = 24
    }

    return (
      <span style={{
        background: `
          transparent 
          url(https://play.pokemonshowdown.com/sprites/${type}icons-sheet.png) 
          no-repeat 
          scroll 
          -${left}px -${top}px
        `,
        overflow: 'visible',
        width,
        height,
      }} />
    )
  } else {
    return null
  }
}

export default withStyles(pokemonInputSelectStyles)(PokemonInputSelect)
