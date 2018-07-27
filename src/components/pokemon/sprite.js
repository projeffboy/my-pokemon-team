import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import {observer} from 'mobx-react'
import store from '../../store'
import {pokemonGridItemStyles} from '../../styles'

@observer
class Sprite extends React.Component {
  render() {
    const {classes, teamSlot} = this.props
    const pokemon = store.pokemon[teamSlot - 1].name // unhyphenated name
    
    let spriteFilename = pokemon // the filename of the pokemon sprite (usually just the pokemon name)

    // If user has chosen a pokemon
    if (pokemon) {
      // We only need to modify spriteFilename if the pokemon has an alternate forme
      if (store.forme(pokemon)) {
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

    return (
      <div className={`${classes.gridItem} ${classes.sprite}`}>
        {spriteFilename ? 
          <img 
            alt={spriteFilename}
            src={`https://play.pokemonshowdown.com/sprites/xyani/${spriteFilename}.gif`} /* URL from Pokemon Showdown */
            style={{maxHeight: '100%', maxWidth: '100%'}} /* keep the image contained in its div box */
          /> : []}
      </div>
    )
  }
}

export default withStyles(pokemonGridItemStyles)(Sprite)
