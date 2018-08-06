import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import {observer} from 'mobx-react'
import store from '../../../store'
import {pokemonInputStyles as spriteStyles} from '../../../styles'

@observer
class Sprite extends React.Component {
  render() {
    const {classes, teamSlot, width} = this.props
    const pokemon = store.pokemon[teamSlot - 1].name // unhyphenated name
    
    let spriteFilename = pokemon // the filename of the pokemon sprite (usually just the pokemon name)

    // If user has chosen a pokemon
    if (pokemon) {
      // Raticate Alola Totem's URL is the exception
      if (pokemon === 'raticatealolatotem') {
        spriteFilename = 'raticate-totem-a'
      } else if (pokemon === 'mimikyubustedtotem') {
        spriteFilename = 'mimikyu-totem-busted'
      }
      // We only need to modify spriteFilename if the pokemon has an alternate forme
      else if (store.forme(pokemon)) {
        /*
         * the sprite filename consists of two parts:
         * base species name and forme name
         * separated by a hyphen
         * all lowercase
         */
        const spriteFilenamePart1 = store.baseSpecies(pokemon).toLowerCase()
        const spriteFilenamePart2 = store.forme(pokemon)
          .toLowerCase()
          .replace('-', '')
        spriteFilename = `${spriteFilenamePart1}-${spriteFilenamePart2}`
      }
    }

    let typeOfSprite = 'xyani'
    let imgFormat = 'gif'
    if (width === 'sm' || width === 'xs') {
      typeOfSprite = 'xydex'
      imgFormat = 'png'
    }

    return (
      <div className={`${classes.gridItem} ${classes.spriteContainer}`}>
        { 
          <img 
            alt={spriteFilename || 'questionmark'}
            /* URL from Pokemon Showdown */
            src={spriteFilename ?
              `https://play.pokemonshowdown.com/sprites/${typeOfSprite}/${spriteFilename}.${imgFormat}`:
              'https://play.pokemonshowdown.com/sprites/bw/0.png'
            }
            className={`${classes.sprite} ${width === 'sm' ? classes.miniSprite : ''}`}
          />
        }
      </div>
    )
  }
}

export default withStyles(spriteStyles)(Sprite)
