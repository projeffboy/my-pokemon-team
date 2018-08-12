import {observable, computed, action} from 'mobx'
import {capitalizeWord} from './helper-functions'
// I have to import a bunch of pokemon data first
import pokedex from './data/pokedex'
import battleItemsData from './data/battle-items'
import miniLearnsets from './data/mini-learnsets.min'
import typechart from './data/typechart'
import moves from './data/moves'
import formatsData from './data/formats-data'

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

  // Clear one of the six pokemon's properties
  @action clearPokemonProps(i) {
    for (const prop in this.pokemon[i]) {
      this.pokemon[i][prop] = ''
    }
  }

  // Get all the items of the team's six pokemon
  @computed get teamItems() {
    return this.pokemon.map(pkmn => pkmn.item)
  }

  
  // Does the team have these items (in an array)?
  doesTeamHaveItems(theseItems) {
    return this.teamItems.some(teamItem => theseItems.includes(teamItem))
  }
  
  // Get the picked moves of the team's six pokemon
  @computed get teamMoves() {
    const moves = []
    this.pokemon.forEach(pkmn => {
      moves.push(
        pkmn.move1,
        pkmn.move2,
        pkmn.move3,
        pkmn.move4,
      )
    })
    return moves
  }

  // Basically the above, but instead of a 1D array of all the moves,
  // It's an array of 6 arrays (for each pokemon), each containing 4 elements (for the 4 moves)
  @computed get listOfFourMoves() {
    return this.pokemon.map(pkmn => (
      [pkmn.move1, pkmn.move2, pkmn.move3, pkmn.move4]
    ))
  }

  // Does the team have this one particular item (in a string)?
  doesTeamHaveMove = move => this.teamMoves.includes(move)

  // Does the team Have these moves (in an array)?
  doesTeamHaveMoves(theseMoves) {
    return this.teamMoves.some(teamMove => theseMoves.includes(teamMove))
  }

  // Does at least one pokemon Have all of these moves?
  doesPokemonHaveTheseMoves(moves) {

    /*
     * Check if at least one of your pokemon contains these 2-4 moves.
     * 
     * Actually, say if you want to check if you have a pokemon,
     * That contains wish and either protect or wish.
     * What you do is pass an array,
     * Where the first element is 'wish',
     * And the second is an array, ['protect', 'detect'].
     */

    // A list of four moves (listOfFourMoves), for each array of four moves (fourMoves)...
    return this.listOfFourMoves.some(fourMoves => (
      // Moves one of your six pokemon need to have (moves), for each move (string)...
      moves.every(move => {
        if (Array.isArray(move)) { // move could be array or string
          // That particular pokemon needs to know one of these moves (move (in array form)),
          // For each one of these moves (altMove)...
          return move.some(altMove => fourMoves.includes(altMove))
        } else {
          return fourMoves.includes(move)
        }
      })
    ))
  }

  /* Does the pokemon have this particular move and item?
  pokemonHasThisMoveAndItem(move, item) {
    return this.listOfFourMoves.map((fourMoves, i) => (
      fourMoves.includes(move) && this.pokemon[i].item === item
  ))
  }
  */

  // Get all the possible abilities of the team's six pokemon
  // Using pokedexData (pokedex.js)
  @computed get abilities() {
    return this.pokemon.map((pkmn, i) => {
      if (pkmn.name) {
        const pkmnAbilities = pokedex[pkmn.name].abilities // the specific pokemon's abilities (obj)

        return Object.values(pkmnAbilities) // the specific pokemon's abilities (arr)
      } else {
        return []
      }
    })
  }

  // Does the team contain status moves?
  @computed get anyStatusMoves() {
    return this.teamMoves.some(teamMove => moves[teamMove] && moves[teamMove].status)
  }

  // Does the team contain boosting moves that increase by two stages?
  @computed get anyBoostingMoves() {
    return this.teamMoves.some(teamMove => (
      moves[teamMove]
      && moves[teamMove].boosts
      && Object.values(moves[teamMove].boosts).reduce((sum, num) => sum + num) >= 2
    ))
  }

  // Auto select the item if necessary (e.g. Mega Blastoise needs Blastoisite)
  @action autoSelectItem() {
    for (const pkmn of this.pokemon) {
      if (pkmn.name) {
        // Auto select mega stone
        if (
          pkmn.name.includes('mega')
          && pkmn.name !== 'meganium'
          && pkmn.name !== 'yanmega'
        ) {
          const megaStone = this.battleItems.find(item => (
            // fuzzy match pokemon name with mega stone name (e.g. blastoisite and blastoise)
            item.toLowerCase().slice(0, 5) === pkmn.name.slice(0, 5)
          ))
          pkmn.item = megaStone
        }
        // Auto select plate for Arceus formes
        else if (pkmn.name.includes('arceus')) {
          const type = pkmn.name.replace('arceus', '')
          const typeToPlate = {
            bug: 'Insect Plate',
            dark: 'Dread Plate',
            dragon: 'Draco Plate',
            electric: 'Zap Plate',
            fairy: 'Pixie Plate',
            fighting: 'Fist Plate',
            fire: 'Flame Plate',
            flying: 'Sky Plate',
            ghost: ' Plate',
            grass: 'Meadow Plate',
            ground: 'Earth Plate',
            ice: 'Icicle Plate',
            normal: '', // no plate for normal type
            poison: 'Toxic Plate',
            psychic: 'Mind Plate',
            rock: 'Stone Plate',
            steel: 'Iron Plate',
            water: 'Splash Plate',
          }

          pkmn.item = typeToPlate[type]
        }
        // Auto select drive for Genesect
        else if (pkmn.name.includes('genesect') && pkmn.name !== 'genesect') {
          const drive = pkmn.name.replace('genesect', '')
          const driveName = capitalizeWord(drive) + ' Drive'
          
          pkmn.item = driveName
        }
        // Auto select memory for Silvally
        else if (pkmn.name.includes('silvally') && pkmn.name !== 'silvally') {
          const type = pkmn.name.replace('silvally', '')
          const memory = capitalizeWord(type) + ' Memory'

          pkmn.item = memory
        }
        // Pick Griseous Orb for Giratina
        else if (pkmn.name === 'giratinaorigin') {
          pkmn.item = 'Griseous Orb'
        }
      }
    }
  }

  // Auto select the pokemon's ability if it only has one ability.
  @action autoSelectAbility() {
    this.abilities.forEach((pkmnAbilities, i) => {
      if (pkmnAbilities.length === 1) {
        this.pokemon[i].ability = pkmnAbilities[0]
      }
    })
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
         * we gotta tell the code that we mean the base form.
         */
        let baseFormeName = this.baseSpecies(pkmn.name) || pkmn.name
        baseFormeName = baseFormeName.toLowerCase()

        // the specific pokemon's learnset
        let learnsetValues = miniLearnsets[baseFormeName]

        /*
         * TLDR; This code allows you to choose moves for pokemon that can be learnt by their pre-evolutions.
         * 
         * So the thing is I took the learnsets data from Smogon.
         * However, it says that Bisharp cannot learn sucker punch.
         * While that is technically true,
         * since its pre-evolution Pawniard can,
         * we want to also want to display Pawniard's possible moves for Bisharp.
         * Therefore, this code will append the moves of the evolutions of a pokemon into one.
         */
        while (this.previousEvolution(baseFormeName)) {
          baseFormeName = this.previousEvolution(baseFormeName)
          learnsetValues = [...learnsetValues, ...miniLearnsets[baseFormeName]]
        }

        // remove duplicates
        learnsetValues = new Set(learnsetValues)
        // turn Set into array
        learnsetValues = [...learnsetValues]

        // Add in all the hidden powers
        if (learnsetValues.includes('hiddenpower')) {
          // hidden power normal is already included by default
          const pokemonTypes = [ // no hidden power fairy btw
            'bug',
            'dark',
            'dragon',
            'electric',
            'fighting',
            'fire',
            'flying',
            'ghost',
            'grass',
            'ground',
            'ice',
            'poison',
            'psychic',
            'rock',
            'steel',
            'water',
          ]
          const hiddenpowers = pokemonTypes.map(type => 'hiddenpower' + type)


          // re-add hidden power normal
          learnsetValues.splice(learnsetValues.indexOf('hiddenpower'), 1)
          learnsetValues.push('hiddenpower')

          learnsetValues.push(...hiddenpowers)
        }

        if (this.searchFilters.moves) { // search filter: if the user only wants to see viable moves
          // Remove non-viable moves
          learnsetValues = learnsetValues.filter(move => moves[move].isViable)
        }

        // Say move is "aerialace"
        // we need to display it as "Aerial Ace", which is the purpose of learnsetLabels
        const learnsetLabels = learnsetValues.map(move => moves[move].name)

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
  // Get the type(s) of the team's six pokemon
  @computed get types() {
    let types = []

    for (const pkmn of this.pokemon) {
      if (pkmn.name) {
        const pkmnTypes = pokedex[pkmn.name].types // the specific pokemon's type(s)
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

  @computed get allPokemon() {
    return Object.keys(pokedex)
  }

  @computed get allPokemonNames() {
    return this.allPokemon.map(pokemon => this.speciesName(pokemon)) // species is name
  }

  // Returns the species name of a pokemon
  speciesName(pokemon) {
    return pokedex[pokemon].species
  }

  // Returns the name of the pokemon's base forme
  baseSpecies(pokemon) {
    return pokedex[pokemon].baseSpecies
  }

  // Returns name of the pokemon's alternate forme
  // E.g. Charizard Mega-X's forme is Mega-X
  forme(pokemon) {
    return pokedex[pokemon].forme
  }

  // Get previous evolution
  previousEvolution(pokemon) {
    const pokedexData = pokedex[pokemon]
    return pokedexData ? pokedexData.prevo : undefined
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
    // Scoresheet of how good all six pokemon resist a certain type
    let typeDefence = { ...this.cleanSlate }

    if (this.types.some(arr => arr.length)) { // is this 2D array empty or not
      this.types.forEach((pkmnTypes, i) => { // pkmnTypes means a specific pokemon's type(s)  
        if (pkmnTypes.length) {
          /*
           * You will get a warning from MobX if the pokmeon just has one type.
           * It's ok, nothing is wrong.
           * This is because we are trying to access pkmnTypes[1],
           * which doesn't exist if the pokemon just has one type.
           * This causes type2 to be undefined, which is intended.
           * Then MobX tells us that we are accessing the array out of bounds.
           */
          const [type1, type2] = pkmnTypes // the pokemon's two types

          // Scoresheet of how good the pokemon resists a certain type
          let resistanceScores = {...this.cleanSlate}

          // Calculate the resistances of the pokemon's types
          for (const type in resistanceScores) { // type refers to a generic pokemon type
            const type1Resistance = typechart[type1][type]

            resistanceScores[type] += type1Resistance

            if (type2) { // if the pokmeon has two types
              const type2Resistance = typechart[type2][type]

              /*
               * How do explain the code below?
               * Here's an example.
               * Charizard is Fire/Flying.
               * Fire is weak to Ground but Flying is immune to Ground.
               * So Fire being weak to Ground doesn't matter.
               * But our algorithm takes Fire being weak to Ground into account.
               * We need to tell the algorithm not to do that.
               */
              if (type1Resistance === 2 || type2Resistance === 2) {
                resistanceScores[type] = 2
              } else {
                resistanceScores[type] += type2Resistance
              }
            }
          }

          // Take into account ability for pokemon's resistances
          const ability = this.pokemon[i].ability
          switch (ability) {
            // Abilities that make you immune to certain types
            case 'Volt Absorb':
            case 'Lightning Rod':
            case 'Motor Drive':
              resistanceScores.Electric = 2
              break
            case 'Flash Fire':
              resistanceScores.Fire = 2
              break
            case 'Sap Sipper':
              resistanceScores.Grass = 2
              break
            case 'Levitate':
              resistanceScores.Ground = 2
              break
            case 'Water Absorb':
            case 'Storm Drain':
              resistanceScores.Water = 2
              break
            case 'Wonder Guard':
              for (const type in resistanceScores) {
                if (resistanceScores[type] !== -1) {
                  resistanceScores[type] = 2
                }
              }
              break
            // Abilities that halve damage from certain types
            case 'Thick Fat':
              resistanceScores.Fire += 1
              resistanceScores.Ice += 1
              break
            case 'Heatproof':
              resistanceScores.Fire += 1
              break
            default:
          }

          // If pokemon wields an air balloon
          if (this.pokemon[i].item === 'Air Balloon' && resistanceScores.Ground !== 2) {
            resistanceScores.Ground += 1
          }

          // Update type defence with the resistance scores of one pokemon
          for (const type in typeDefence) {
            typeDefence[type] += resistanceScores[type]
          }
        }
      })
    }

    return typeDefence
  }

  // Assessment of the team's type coverage
  // (How many types are your team's moves supereffective against)
  @computed get typeCoverage() {
    let typeCoverage = { ...this.cleanSlate }

    for (const [i, pokemon] of this.pokemon.entries()) {
      const typesUsed = []
      for (const [key, value] of Object.entries(pokemon)) {
        // key is e.g. name, item, move1, etc.
        // value is e.g. Venusaur, Venusaurite, Giga Drain, etc.

        // if it is a non-empty move
        if (value && key.slice(0, -1) === 'move') { // the slice() removes the last letter
          const moveDetails = moves[value]
          const abilitiesThatChangeNormalMoves = {
            Aerilate: 'Flying', 
            Pixilate: 'Fairy', 
            Refrigerate: 'Ice', 
            Galvanize: 'Electric',
          }
          const ability = this.pokemon[i].ability
          let moveType = moveDetails.type
          const pokemonName = this.pokemon[i].name

          // Change the move type if the pokemon has a certain ability, like aerilate or normalize
          if (Object.keys(abilitiesThatChangeNormalMoves).includes(ability)) {
            if (moveType === 'Normal') {
              moveType = abilitiesThatChangeNormalMoves[ability]
            }
          } else if (ability === 'Normalize') {
            moveType = 'Normal'
          } else if (value === 'judgment') { // For Arceus
            const pokemonDetails = pokedex[pokemonName]
            moveType = pokemonDetails.types[0] // Arceus only has one ability
          } else if (value === 'technoblast') { // For Genesect
            switch (pokemonName) {
              case 'genesectdouse':
                moveType = 'Water'
                break
              case 'genesectshock':
                moveType = 'Electric'
                break
              case 'genesectburn':
                moveType = 'Fire'
                break
              case 'genesectchill':
                moveType = 'Ice'
                break
              default:
            }
          } else if (value === 'multiattack') { // For Silvally
            const type = pokemonName.replace('silvally', '')
            const capitalizedType = capitalizeWord(type)

            moveType = capitalizedType
          }

          // If the user picks freeze-dry or flying press multiple times, it can be exploited
          if (value === 'freezedry') {
            typeCoverage.Water++
          }

          if (value === 'flyingpress') {
            // the types flying press are super effective against
            ['Dark', 'Fighting', 'Grass', 'Ice', 'Normal'].forEach(type => typeCoverage[type]++)
          }

          /*
           * 1. Ignore status moves.
           * (status moves don't deal damage. so they don't contribute to type coverage)
           * 2. If one of the previous attacking moves was the same type, don't count this one.
           * 3. Ignore moves less than 40 base power (unless it's a multi-hit move).
           */
          else if (
            moveDetails.category !== 'Status'
            && !typesUsed.includes(moveType)
            && (moveDetails.basePower >= 40 || moveDetails.multihit)
          ) {
            typesUsed.push(moveType)

            const dmgDealt = Object.keys(typechart).map(typeAgainst => ( // the type your move is going against
              typechart[typeAgainst][moveType]
            ))

            Object.keys(typeCoverage).forEach((type, i) => {
              if (dmgDealt[i] === -1) { // if it's super effective (cuz supereffective is -1)
                typeCoverage[type]++
              }
            })
          }
        }
      }
    }

    return typeCoverage
  }

  /*************
  SEARCH FILTERS
  *************/

  @observable searchFilters = {
    format: '',
    region: '',
    type: '',
    moves: '',
  }

  @computed get filteredPokemon() {
    const {format, region, type} = this.searchFilters

    // First filter by format, then type, then region
    return Object.keys(
      filterByRegion.call(
        this,
        filterByType.call(
          this,
          filterByFormat.call(
            this, 
            {...pokedex}
          )
        )
      )
    )

    function filterByFormat(pokedexData) {
      const pokedexDataCopy = {...pokedexData}

      /* No Filter */

      if (format === '') {
        return pokedexData
      }

      /* Official Pokemon Format Filter */

      const banlist = [
        'mewtwo', 
        'lugia', 
        'hooh', 
        'kyogre', 
        'groudon', 
        'rayquaza', 
        'dialga', 
        'palkia', 
        'giratina', 
        'reshiram', 
        'zekrom', 
        'kyurem', 
        'xerneas', 
        'yveltal', 
        'zygarde', 
        'cosmog', 
        'cosmoem', 
        'solgaleo', 
        'lunala', 
        'necrozma',
        'mew', 
        'celebi', 
        'jirachi', 
        'deoxys', 
        'phione', 
        'manaphy', 
        'darkrai', 
        'shaymin', 
        'arceus', 
        'victini', 
        'keldeo', 
        'meloetta', 
        'genesect', 
        'diancie', 
        'hoopa', 
        'volcanion', 
        'greninjaash', 
        'magearna', 
        'marshadow', 
        'zeraora',
      ]

      for (const pokemon of banlist) {
        const {otherFormes} = pokedex[pokemon]
        if (otherFormes) {
          otherFormes.forEach(otherForme => delete pokedexData[otherForme])
        }
        delete pokedexData[pokemon]
      }

      if (['Battle Spot Singles', 'Battle Spot Doubles', 'VGC 2018'].includes(format)) {
        return pokedexData
      }

      /* Smogon Singles Filter */

      pokedexData = pokedexDataCopy

      delete pokedexData.rayquazamega // Rayquaza-Mega is banned in all tiers but Anything Goes (AG)
      for (const pokemon in pokedexData) {
        if (formatsData[pokemon].tier === 'Illegal') {
          // Illegal pokemon include spiky eared pichu and certain formes of pikachu
          delete pokedexData[pokemon]
        }
      }

      const tierAbbr = {
        'Uber': 'Uber',
        'OU: Over Used': 'OU', 
        'UU: Under Used': 'UU', 
        'RU: Rarely Used': 'RU', 
        'NU: Never Used': 'NU', 
        'PU': 'PU', 
        'Little Cup (LC)': 'LC',
        'Doubles Uber': 'DUber',
        'Doubles OU': 'DOU',
        'Doubles UU': 'DUU',
      }

      let smogonSinglesTiers = [
        'Uber',
        'OU', 
        'UUBL', 
        'UU', 
        'RUBL',
        'RU', 
        'NUBL',
        'NU', 
        'PUBL',
        'PU',
        'NFE',
        'LC Uber',
        'LC', 
      ]
      
      const filteredBySmogonSinglesTier = helperFunction(smogonSinglesTiers, 'tier')

      /* Smogon Doubles Filter */

      pokedexData = pokedexDataCopy

      return filteredBySmogonSinglesTier || helperFunction(['DUber', 'DOU', 'DUU'], 'doublesTier')

      /* Helper Function for Smogon Singles/Doubles Filter */

      function helperFunction(array, tierType) {
        for (const tier of array) {
          if (tierAbbr[format] === tier) {
            return pokedexData
          }
      
          for (const pokemon in pokedex) {
            if (formatsData[pokemon][tierType] === tier) {
              // Delete the pokemon outside the tier and its other formes
              const {otherFormes} = pokedex[pokemon]
              if (otherFormes) {
                otherFormes.forEach(forme => {
                  if (!formatsData[forme][tierType]) {
                    delete pokedexData[forme]
                  }
                })
              }
              delete pokedexData[pokemon]
            }
          }      
        }
      }
    }

    function filterByRegion(pokedexData) {
       if (region) {
        const regionNumberRange = {
          Kanto: [1, 151],
          Johto: [152, 251],
          Hoenn: [252, 386],
          Sinnoh: [387, 493],
          Unova: [494, 649],
          Kalos: [650, 721],
          Alola: [722, 807],
        }
        const range = regionNumberRange[region]
        let newPokedexData = {}

        // Only return pokemon from a certian region based on pokedex number
        for (const [key, value] of Object.entries(pokedexData)) {
          if (
            value.num >= range[0]
            && value.num <= range[1]
            // If Kanto region, remove alola forms
            && !(region === 'Kanto' && key.includes('alola'))
          ) {
            newPokedexData[key] = value
          }
        }
        
        // If Alola region, add alola forms
        if (region === 'Alola') {
          for (const [key, value] of Object.entries(pokedexData)) {
            if (key.includes('alola')) {
              newPokedexData[key] = value
            }
          }
        }

        return newPokedexData
      } else {
        return pokedexData
      }
    }

    function filterByType(pokedexData) {
      let newPokedexData = {}

      if (type) {
        for(const [key, value] of Object.entries(pokedexData)) {
          if (value.types.includes(this.type)) {
            newPokedexData[key] = value
          }
        }

        return newPokedexData
      } else {
        return pokedexData
      }
    }
  }

  @computed get filteredPokemonNames() {
    return this.filteredPokemon.map(pokemon => this.speciesName(pokemon)) // species is name
  }
}

// FOR DEBUGGING
let store = window.store = new Store()

export default store

// autorun(() => console.log(store.types))

/* FOR BUILD
export default new Store()
*/