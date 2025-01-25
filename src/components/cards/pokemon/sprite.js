import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import {observer} from 'mobx-react'
import store from '../../../store'
import pokedex from '../../../data/pokedex'
import {pokemonInputStyles as spriteStyles} from '../../../styles'
import questionMark from '../../../question-mark.png'

@observer
class Sprite extends React.Component {
  render() {
    const {classes, teamIndex, width} = this.props
    const pokemon = store.team[teamIndex].name // unhyphenated name
    const pokedexNumber = pokemon && pokedex[pokemon].num
    
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
        const spriteFilenamePart1 = store.baseForme(pokemon)
        const spriteFilenamePart2 = store.forme(pokemon)
          .toLowerCase()
          .replace('-', '')
        spriteFilename = `${spriteFilenamePart1}-${spriteFilenamePart2}`

        spriteFilename = spriteFilename.replace('%', '').replace("'", '')
      }
    }

    /* Mini Sprite (for smaller screen sizes) */
    let typeOfSprite = 'ani'
    let imgFormat = 'gif'
    if (width === 'sm' || width === 'xs') { // below 960px
      typeOfSprite = 'dex'
      if (
        (pokedexNumber && 810 <= pokedexNumber && pokedexNumber <= 898)
        || (pokemon && pokemon.includes('galar'))
      ) {
        typeOfSprite = 'bw'
      }

      imgFormat = 'png'
    }

    if (
      pokedexNumber >= 899 || pokedexNumber == 0
      || (pokemon && pokemon.includes('paldea'))
      || ['dialgaorigin', 'palkiaorigin', 'basculinwhitestriped'].includes(pokemon)
    ) {
      typeOfSprite = 'gen5'
      imgFormat = 'png'
    }


    /* Either Return Sprite or Mini Sprite */
    return (
      <div className={`${classes.gridItem} ${classes.spriteContainer}`}>
        { 
          <img 
            alt={spriteFilename || 'question-mark'}
            /* URL from Pokemon Showdown */
            src={spriteFilename
              ? `https://play.pokemonshowdown.com/sprites/${typeOfSprite}/${spriteFilename}.${imgFormat}`
              // The placeholder (question mark) sprite
              : questionMark
            }
            /* Apply miniSprite class if it's a mini sprite */
            className={`${classes.sprite} ${width === 'sm' ? classes.miniSprite : ''} ${(width === 'lg' || width === 'xl') ? classes.smallerSprite : ''}`}
          />
        }
      </div>
    )
  }
}

export default withStyles(spriteStyles)(Sprite)
