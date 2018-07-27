import React from 'react'
import {pokemonGridItemStyles} from '../../styles'
import {observer} from 'mobx-react'
import store from '../../store'
import {withStyles} from '@material-ui/core/styles'

@observer
class Sprite extends React.Component {
  returnSprite(pokemon) {
    if (pokemon) {
      let pokemonName = store.speciesName(pokemon).toLowerCase() // hyphenated lowercase name

      switch(pokemonName) {
        case 'charizard-mega-x':
          pokemonName = 'charizard-megax'
          break
        case 'charizard-mega-y':
          pokemonName = 'charizard-megay'
          break
        default:
      }

      return (
        <img 
          alt={pokemonName}
          src={`https://play.pokemonshowdown.com/sprites/xyani/${pokemonName}.gif`}
          style={{maxHeight: '100%', maxWidth: '100%'}}
        />
      )
    }
  }

  render() {
    const {classes, teamSlot} = this.props
    const pokemon = store.pokemon[teamSlot - 1].name // unhyphenated name

    return (
      <div className={`${classes.gridItem} ${classes.sprite}`}>
        {this.returnSprite(pokemon)}
      </div>
    )
  }
}

export default withStyles(pokemonGridItemStyles)(Sprite)
