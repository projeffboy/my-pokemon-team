import React from 'react'
import pokedex from '../../../../../data/pokedex'
import items from '../../../../../data/items'
import altSpriteNum from '../../../../../data/altSpriteNum'

/*
 * Returns an icon of a pokemon (pkmnProp === 'pkmn') or an item (pkmnProp === 'item)
 * "smicons" is short for sun and moon icons for all the pokemon
 * You can find them here: https://play.pokemonshowdown.com/sprites/smicons-sheet.png
 * You can find the "itemicons" here: https://play.pokemonshowdown.com/sprites/itemicons-sheet.png
 */
export default function PokemonIcon(props) {
  const {pkmnProp, value} = props

  if (pkmnProp === 'pkmn' || pkmnProp === 'item') {
    let type
    let left
    let top
    let width
    let height

    if (pkmnProp === 'pkmn') {
      type = 'sm'

      const pokedexNumber = altSpriteNum[value] || pokedex[value].num

      // Copied from Pokemon Showdown code
      left = (pokedexNumber % 12) * 40
      top = Math.floor(pokedexNumber / 12) * 30

      width = 40
      height = 30
    } else if (pkmnProp === 'item') {
      type = 'item'

      const itemNumber = items[value].spritenum

      // Copied from Pokemon Showdown code
      left = (itemNumber % 16) * 24
      top = Math.floor(itemNumber / 16) * 24

      width = 24
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