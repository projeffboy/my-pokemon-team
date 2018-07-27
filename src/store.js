import {observable, computed} from 'mobx'
import pokedexData from './data/pokedex'
import battleItemsData from './data/battle-items'
import miniLearnsets from './data/mini-learnsets.min'
import typechart from './data/typechart'
import moves from './data/moves'

class Store {
  constructor() {
    /*
     * This property contains all the pokemon types, initially set to 0 (that's why it's called clean slate).
     * A positive number can either mean:
     *  the team is strong against thie type (type defence)
     *  the team has moves supereffective against this type (type coverage)
     * A negative number means the team is weak against this type (type defence)
     * Type coverages cannot be negative
     */
    this.cleanSlate = {
      Bug: 0,
      Dark: 0,
      Dragon: 0,
      Electric: 0,
      Fairy: 0,
      Fighting: 0,
      Fire: 0,
      Flying: 0,
      Ghost: 0,
      Grass: 0,
      Ground: 0,
      Ice: 0,
      Normal: 0,
      Poison: 0,
      Psychic: 0,
      Rock: 0,
      Steel: 0,
      Water: 0,
    }
  }

  /********************************
  DATA ABOUT THE TEAM'S SIX POKEMON 
  ********************************/
  
  @observable pokemon = Array(6).fill({
    name: '', // unhyphenated
    item: '',
    move1: '',
    move2: '',
    move3: '',
    move4: '',
    ability: '', // chosen ability
  })

  // Get the abilities of the team's six pokemon
  // Using pokedexData (pokedex.js)
  @computed get abilities() {
    let abilities = [] // will contain the possible abilities of six pokemon
    
    for (const pkmn of this.pokemon) {
      if (pkmn.name) {
        const pkmnAbilities = this.pokedex[pkmn.name].abilities // the specific pokemon's ability (obj)
        const pkmnAbilitiesArr = Object.values(pkmnAbilities) // the specific pokemon's ability (arr)
        abilities.push(pkmnAbilitiesArr)
      } else {
        abilities.push([])
      }
    }

    return abilities
  }

  // Get the learnsets of the team's six pokemon
  // Using miniLearnsets (mini-learnsets.min.js)
  @computed get learnsets() {
    // both will contain the learnsets of six pokemon
    let learnsets = {
      values: [],
      labels: [],
    }

    for (const pkmn of this.pokemon) {
      if (pkmn.name) {
        /*
         * As it turns out, mini-learnsets.min.js doesn't include pokemons' alternate formes.
         * So if the user chooses an alternate forme pokemon,
         * we gotta tell the code that we mean the base form,
         * and that's what the next two lines are about.
         */
        let baseFormeName = this.baseSpecies(pkmn.name) || pkmn.name
        baseFormeName = baseFormeName.toLowerCase()

        const learnsetValues = miniLearnsets[baseFormeName] // the specific pokemon's learnset
        const learnsetLabels = miniLearnsets[baseFormeName].map(move => moves[move].name)

        learnsets.values.push(learnsetValues)
        learnsets.labels.push(learnsetLabels)
      } else {
        learnsets.values.push([])
        learnsets.labels.push([])
      }
    }

    return learnsets
  }

    // Get the type(s) of the team's six pokemon
    @computed get types() {
      let types = []
  
      for (const pkmn of this.pokemon) {
        if (pkmn.name) {
          const pkmnTypes = this.pokedex[pkmn.name].types // the specific pokemon's type(s)
          types.push(pkmnTypes)
        } else {
          types.push([])
        }
      }
  
      return types
    }

  /**************************
  POKEDEX INFO ON ALL POKEMON
  **************************/

  @observable pokedex = pokedexData

  @computed get allPokemon() {
    return Object.keys(this.pokedex)
  }

  @computed get allPokemonNames() {
    return this.allPokemon.map(pokemon => this.pokedex[pokemon].species) // species is name
  }

  /* NOT USED: Returns the species name of a pokemon
  speciesName(pokemon) {
    return store.pokedex[pokemon].species
  }
  */

  // Returns the name of the pokemon's base forme
  baseSpecies(pokemon) {
    return store.pokedex[pokemon].baseSpecies
  }

  // Returns name of the pokemon's alternate forme
  // E.g. Charizard Mega-X's forme is Mega-X
  forme(pokemon) {
    return store.pokedex[pokemon].forme
  }

  /***************
  ALL BATTLE ITEMS
  ***************/

  @observable battleItems = Object.values(battleItemsData).map(item => item.name)

  /************************
  STUFF ABOUT POKEMON TYPES
  ************************/

  // Assessment of the team's type defence
  // (How good your team is against the 18 different types)
  @computed get typeDefence() {
    let typeDefence = {...this.cleanSlate}

    if (this.types.some(arr => arr.length)) { // is 2D array empty or not
      for (const pkmnTypes of this.types) { // pkmnTypes means a specific pokemon's type(s)
        for(const pkmnType of pkmnTypes) { // get one of the one/two types (yknow, if the pokemonis multi-typed)
          const dmgTaken = typechart[pkmnType] // pkmnType refers to one of a specific pokemon's type
          
          let updatedTypeDefence = {}
          
          Object.keys(typeDefence).map(type => ( // type refers to a generic pokemon type
            updatedTypeDefence[type] = typeDefence[type] + dmgTaken[type]
          ))
          typeDefence = updatedTypeDefence
        }
      }
    }

    return typeDefence
  }

  // Assessment of the team's type coverage
  // (How many types are your team's moves supereffective against)
  @computed get typeCoverage() {
    let typeCoverage = {...this.cleanSlate}

    for (const pokemon of this.pokemon) {
      for(const prop in pokemon) {
        // if it is a non-empty move
        if (pokemon[prop] && prop.slice(0, -1) === 'move') { // the slice() removes the last letter
          const move = moves[pokemon[prop]]
          const dmgDealt = typechart[move.type]

          let updatedTypeCoverage = {}

          Object.keys(typeCoverage).map(type => (
            updatedTypeCoverage[type] = typeCoverage[type] - dmgDealt[type]
          ))

          typeCoverage = updatedTypeCoverage
        }
      }
    }

    return typeCoverage
  }

  /***************
  WORK IN PROGRESS
  ***************/

  @observable settings = {...this.typeDefence} // dummy for now
}

// FOR DEBUGGING
let store = window.store = new Store()

export default store

// autorun(() => console.log(store.types))

/* FOR BUILD
export default new Store()
*/