import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import {observer} from 'mobx-react'
import store from '../../../store'
import {pokemonInputStyles as spriteStyles} from '../../../styles'

@observer
class Sprite extends React.Component {
  render() {
    const {classes, teamIndex, width} = this.props
    const pokemon = store.pokemon[teamIndex].name // unhyphenated name
    
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

    /* Mini Sprite (for smaller screen sizes) */
    let typeOfSprite = 'xyani'
    let imgFormat = 'gif'
    if (width === 'sm' || width === 'xs') { // below 960px
      typeOfSprite = 'xydex'
      imgFormat = 'png'
    }

    /* Either Return Sprite or Mini Sprite */
    return (
      <div className={`${classes.gridItem} ${classes.spriteContainer}`}>
        { 
          <img 
            alt={spriteFilename || 'questionmark'}
            /* URL from Pokemon Showdown */
            src={spriteFilename
              ? `https://play.pokemonshowdown.com/sprites/${typeOfSprite}/${spriteFilename}.${imgFormat}`
              // The placeholder (question mark) sprite
              : 'https://play.pokemonshowdown.com/sprites/bw/0.png'
            }
            /* Apply miniSprite class if it's a mini sprite */
            className={`${classes.sprite} ${width === 'sm' ? classes.miniSprite : ''}`}
          />
        }
      </div>
    )
  }
}

export default withStyles(spriteStyles)(Sprite)
