import {observable, computed} from 'mobx'
import pokedexData from './data/pokedex'
import battleItemsData from './data/battle-items'
import miniLearnsets from './data/mini-learnsets.min'
import typechart from './data/typechart'
import moves from './data/moves'

const cleanSlate = { // clean slate refers to a team that has no weakneses/resistances (see below)
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

class Store {
  /* Data About the Team's Six Pokemon */
  @observable pokemon = Array(6).fill({
    name: '', // unhyphenated
    item: '',
    move1: '',
    move2: '',
    move3: '',
    move4: '',
    ability: '',
  })

  /* Pokedex Info on All Pokemon */
  @observable pokedex = {...pokedexData} // copy, not reference, imported pokedex data

  @computed get allPokemon() {
    return Object.keys(this.pokedex)
  }

  @computed get allPokemonNames() {
    return this.allPokemon.map(pokemon => this.pokedex[pokemon].species) // species is name
  }

  @computed get abilities() { // the possible abilities of the six pokemon
    let abilities = [] // will contain the abilities of six pokemon
    
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

  speciesName(pokemon) {
    return store.pokedex[pokemon].species
  }

  /* All Battle Items */
  @observable battleItems = Object.values(battleItemsData).map(item => item.name)

  /* Get the Learnsets of the Team's Six Pokemon */
  @computed get learnsets() {
    let learnsets = [] // will contain the learnsets of six pokemon

    for (const pkmn of this.pokemon) {
      if (pkmn.name) {
        const learnset = miniLearnsets[pkmn.name] // the specific pokemon's learnset
        learnsets.push(learnset)
      } else {
        learnsets.push([])
      }
    }
    
    return learnsets
  }

  /* Pokemon Type-Related Stuff */
  // Get the type of the team's six pokemon
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

  @computed get typeDefence() {
    let typeDefence = {...cleanSlate}

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

  @computed get typeCoverage() {
    let typeCoverage = {...cleanSlate}

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

  @observable settings = {...this.typeDefence} // dummy for now
}

// FOR DEBUGGING
let store = window.store = new Store()

export default store

// autorun(() => console.log(store.types))

/* FOR BUILD
export default new Store()
*/