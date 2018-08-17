import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import {observer} from 'mobx-react'
import store from '../../../store'
import {pokemonInputStyles} from '../../../styles'
import IntegrationReactSelect from './pokemon-input/integration-react-select'

@observer
class PokemonInput extends React.Component {
  /*
   * 1. If you change the pokemon name, <IntegrationReactSelect /> triggers this function.
   * 2. It updates the change to the store.
   * 3. Since the store is reactive, the prop value passed to <IntegrationReactSelect /> will be updated too.
   */
  handleChange = inputVal => {
    const {pokemonProp, teamIndex} = this.props

    if (pokemonProp === 'name') {
      store.clearPokemonProps(teamIndex)
    }

    store.pokemon[teamIndex][pokemonProp] = inputVal

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
    const {pokemonProp, teamIndex} = this.props

    let optionValues = []
    let optionLabels = []

    switch(pokemonProp) {
      case 'name':
        optionValues = store.filteredPokemon // store.allPokemonNames
        optionLabels = store.filteredPokemonNames // store.allPokemonSpeciesNames
        break
      case 'item':
        optionValues = store.itemsArr
        optionLabels = store.itemNamesArr
        break
      case 'ability':
        optionValues = store.teamAbilities[teamIndex]
        optionLabels = optionValues
        break
      default: // for the moves
        optionValues = store.teamLearnsets.values[teamIndex]
        optionLabels = store.teamLearnsets.labels[teamIndex]
    }

    return (
      <IntegrationReactSelect
        placeholder={this.props.placeholder}
        className={this.props.classes.gridItem}
        optionValues={optionValues}
        optionLabels={optionLabels}
        onChange={this.handleChange}
        value={store.pokemon[teamIndex][pokemonProp]}
      />
    )
  }
}

export default withStyles(pokemonInputStyles)(PokemonInput)