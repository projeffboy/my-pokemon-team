import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import {observer} from 'mobx-react'
import store from '../../store'
import {pokemonInputStyles} from '../../styles'
import IntegrationReactSelect from './pokemon-input/integration-react-select'

@observer
class PokemonInput extends React.Component {
  constructor(props) {
    super(props)
    this.i = this.props.teamSlot - 1
  }

  /*
   * 1. If you change the pokemon name, <IntegrationReactSelect /> triggers this function.
   * 2. It updates the change to the store.
   * 3. Since the store is reactive, the prop value passed to <IntegrationReactSelect /> will be updated too.
   */
  handleChange = inputVal => {
    const {pokemonProp} = this.props

    if (pokemonProp === 'name') {
      store.clearPokemonProps(this.i)
    }

    store.pokemon[this.i][pokemonProp] = inputVal

    /*
     * If the input is where you put your pokemon name,
     * and the pokemon has only one type,
     * then auto select its ability.
     */
    if (pokemonProp === 'name') {
      store.autoSelectItem()
      store.autoSelectAbility()
    }
  }

  render() {
    const {pokemonProp} = this.props

    let optionValues = []
    let optionLabels = []

    switch(pokemonProp) {
      case 'name':
        optionValues = store.allPokemon
        optionLabels = store.allPokemonNames
        break
      case 'item':
        optionValues = store.battleItems
        break
      case 'ability':
        optionValues = store.abilities[this.i]
        break
      default: // for the moves
        optionValues = store.learnsets.values[this.i]
        optionLabels = store.learnsets.labels[this.i]
    }

    // Apparently if you remove this it breaks, dunno why
    // Somewhere above, it's changing optionValues from [] to undefined
    if (optionValues === undefined) {
      optionValues = []
    }

    if (!optionLabels.length) { // if empty
      optionLabels = optionValues
    }

    return (
      <IntegrationReactSelect
        placeholder={this.props.placeholder}
        className={this.props.classes.gridItem}
        optionValues={optionValues}
        optionLabels={optionLabels}
        onChange={this.handleChange}
        value={store.pokemon[this.i][pokemonProp]}
      />
    )
  }
}

export default withStyles(pokemonInputStyles)(PokemonInput)