import {observable, computed, action} from 'mobx'
import {capitalizeWord} from './helper-functions'
// I have to import a bunch of pokemon data first
import pokedexData from './data/pokedex'
import itemsData from './data/items'
import learnsetsData from './data/learnsets.min'
import typechartData from './data/typechart'
import movesData from './data/moves'
import formatsData from './data/formats'

// Remove tehse during production and modify the varible names above
const pokedex = window.pokedex = pokedexData
const items = window.items = itemsData
const learnsets = window.learnsetsData = learnsetsData
const typechart = window.typechartData = typechartData
const moves = window.movesData = movesData
const formats = window.formatsData = formatsData

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

  /*
   * MAKING SENSE OF VARIABLE NAMES
   * There are three types of pokemon variables:
   *  1. pkmn or pokemon (pokemon ID, not to be confused with pokedex ID):
   *    -only one word
   *    -no hyphens
   *    -lowercase
   *    -E.g. charizardmegay
   *  2. pkmnName (pokemon name):
   *    -words are separated by a hyphen, not a space
   *    -each word is capitalized
   *    -E.g. Charizard-Mega-Y
   * 3. pkmnProps or pokemonProps (pokemon properties):
   *    -an object containing a pokemon's properties
   *    -these properties have to be obtained from pokedex.js
   *    -E.g. const pkmnProps = pokedex['charizard']
   * 
   * 
   * Same variable naming scheme for items:
   *  1. item
   *  2. itemName
   *  3. itemProps
   * And moves:
   *  1. move
   *  2. moveName
   *  3. moveProps
   * And a pokemon's base forme:
   *  1. baseForme
   *  2. baseFormeName
   *  3. baseFormeProps
   * 
   * `team` refer's to the user's pokemon team.
   * There's an @observable variable for it in the store.
   * Anything related to the user's pokemon team should be prefixed with `team`.
   * E.g.
   *  -Functions like:
   *    -teamFourMoveslots
   *    -teamLearnsets
   *  -Each element in @observable team is teamPkmnProps, containing within:
   *    -teamPkmn (teamPkmnName = this.pkmnName(teamPkmn))
   *    -teamPkmnProps
   *    -teamPkmnItem
   *    -teamPkmnMove1 (etc.)
   *    -teamPkmnAbility
   * 
   * Exception: `team` prefix can be dropped during iterations
   * E.g.: `this.teamItems.map(item => ..)` instead of `this.teamItems.map(teamItem => ..)`
   * Exception to exception: You cannot drop the `team` prefix for `teamPkmnProps` no matter what
   */

  /*
   * STORE HELPER PROPERTIES
   * 
   * pokedex[pkmn]
   *  Input: pokemon ID
   *  Output: pokemon's properties from pokedex.js
   * moves[move]
   *  Input: move ID
   *  Output: move's properties from moves.js
   * learnsets[pkmn]
   *  Input: pokemon ID
   *  Output: pokemon's learnset (in array form) from learnsets.min.js
   *  Drawback: If the pokemon has previous evolution(s), it doesn't include their learnsets
   * typechart[type1][type2]
   *  Inputs: two pokemon types
   *  Output: How effective a type2 move is against a type1 pokemon
   *    +2 is no effect
   *    +1 is not very effective
   *    0 is neutral damage
   *    -1 is super effective
   */

  /*******************
  STORE HELPER METHODS
  *******************/

  /* POKEDEX METHODS */
  
  /* NOT USED
   * Instead we use filteredPokemon and filteredPokemonNames
  // returns pokemon id
  allPokemon() {
    return Object.keys(pokedex)
  }

  // returns pokemon names
  allPokemonNames() {
    return this.allPokemon.map(pkmn => this.pkmnName(pkmn))
  }
  */

  /*
   * Input a pokemon ID to return its abilities
   * (ID as in "venusaurmega", name as in "Venusaur Mega")
   * (output is in object form)
   */
  abilities(pkmn) {
    return pokedex[pkmn].abilities
  }

  // Input a pokemon ID to return its pokemon name
  // E.g. 'squirtle' => 'Squirtle'
  pkmnName(pkmn) {
    return pokedex[pkmn].species
  }
  
  // The inverse of the pkmnName function
  // E.g. 'Squirtle' => 'squirtle'
  pkmnNameInverse(pkmnName) {
    for(const pkmn in pokedex) {
      if (this.pkmnName(pkmn) === pkmnName) {
        return pkmn
      }
    }
  }
  
  // Input a pokemon ID to return the pokemon ID of its base forme
  // E.g. 'giratinaorigin' => 'giratina'
  // (it will return undefined for pokemon already at the base forme)
  // E.g. 'wartortle' => undefined
  baseForme(pkmn) {
    const baseFormeName = pokedex[pkmn].baseSpecies
    const baseForme = this.pkmnNameInverse(baseFormeName)

    return baseForme
  }

  // Input a pokemon ID to return its alternate forme(s)
  // E.g. 'charizard' => ['charizardmegax', 'charizardmegay']
  forme(pkmn) {
    return pokedex[pkmn].forme
  }

  // Get previous evolution
  previousEvolution(pkmn) {
    const pkmnProps = pokedex[pkmn]
    return pkmnProps ? pkmnProps.prevo : undefined
  }
  
  /* ITEMS METHODS */

  get itemsArr() {
    return Object.keys(items)
  }

  get itemNamesArr() {
    return Object.values(items).map(itemProps => itemProps.name)
  }

  itemName(item) {
    const itemInfo = items[item]

    return itemInfo ? itemInfo.name : ''
  }

  itemNameInverse(itemName) {
    return this.itemsArr[this.itemNamesArr.indexOf(itemName)]
  }
  
  /* LEARNSETS METHODS */

  /*
   * Gives you a pokemon's complete learnset, which includes the learnsets of its previous evolutions.
   * If you just use learnsets[pkmn], it will not give you previous evolution learnsets.
   * It also adds all the different hidden powers.
   */
  completeLearnset(pkmn) {
    let completeLearnset = learnsets[pkmn] || []
    let baseForme = this.baseForme(pkmn) || pkmn // since learnsets[pkmn] requires pkmn to be at its base forme

    completeLearnset = [...completeLearnset, ...learnsets[baseForme]]

    while (this.previousEvolution(baseForme)) {
      baseForme = this.previousEvolution(baseForme)
      // Append previous evolution learnset to current learnset
      completeLearnset = [...completeLearnset, ...learnsets[baseForme]]
    }

    // turning array to set removes duplicates
    completeLearnset = new Set(completeLearnset)
    // turn set back into array
    completeLearnset = [...completeLearnset]

    // Add in all the hidden powers
    if (completeLearnset.includes('hiddenpower')) {
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


      // remove hidden power normal
      completeLearnset.splice(completeLearnset.indexOf('hiddenpower'), 1)

      // add all hidden powers together
      completeLearnset.push('hiddenpower')
      completeLearnset.push(...hiddenpowers)
    }

    return completeLearnset
  }

  // Can `pkmn` learn `move`?
  canItLearn = (move, pkmn) => move ? this.completeLearnset(pkmn).includes(move) : false
  
  /* TYPECHART METHODS */

  // Don't think we need any
  
  /* MOVE METHODS */

  // Get the proper name of move
  moveName(move) {
    return moves[move] ? moves[move].name : undefined
  }
 
  // Inverse function of moveName
  moveNameInverse(moveName) {
    for (const move in moves) {
      if (moveName === this.moveName(move)) {
        return move
      }
    }
  }
  
  /* FORMATS METHODS */

  /********************************
  DATA ABOUT THE TEAM'S SIX POKEMON 
  ********************************/

  @observable team = Array(6).fill({
    name: '', // technically, this is the pokemon ID, not pokemon name
    // but name is much more clearer to those new to the source code
    item: '',
    move1: '',
    move2: '',
    move3: '',
    move4: '',
    ability: '', // chosen ability
  })

  // Get the team's six pokemon id/name (pkmn)
  @computed get teamPkmn() {
    return this.team.map(teamPkmnProps => teamPkmnProps.name)
  }

  // Check if team is empty
  @computed get isTeamEmpty() {
    return !this.teamPkmn.some(pkmn => pkmn)
  }

  // Get the team's six items (in array form)
  @computed get teamItems() {
    return this.team.map(teamPkmnProps => teamPkmnProps.item)
  }
  
  // Get the team's moves that the user chose (in 1D array)
  @computed get teamMoves() {
    const teamMoves = []

    this.team.forEach(teamPkmnProps => {
      teamMoves.push(
        teamPkmnProps.move1,
        teamPkmnProps.move2,
        teamPkmnProps.move3,
        teamPkmnProps.move4,
      )
    })

    return teamMoves
  }

  // Basically the above but a 2D array,
  // It's an array of 6 arrays (for each pokemon),
  // Each containing 4 elements (for the 4 moves)
  @computed get teamFourMoveslots() {
    return this.team.map(teamPkmnProps => (
      [
        teamPkmnProps.move1, 
        teamPkmnProps.move2, 
        teamPkmnProps.move3, 
        teamPkmnProps.move4,
      ]
    ))
  }

  
  // Get team's possible abilities (in 2D array)
  @computed get teamAbilities() {
    return this.team.map(teamPkmnProps => {
      if (teamPkmnProps.name) {
        const teamPkmnAbilities = pokedex[teamPkmnProps.name].abilities // the specific pokemon's abilities (obj)

        return Object.values(teamPkmnAbilities) // the specific pokemon's abilities (arr)
      } else {
        return []
      }
    })
  }

  // Does the team contain moves that inflict non-volatile status?
  // E.g. toxic inflicts poison, thunder wave inflicts paralysis
  @computed get anyStatusMoves() {
    return this.teamMoves.some(move => moves[move] && moves[move].status)
  }

  // Does the team contain boosting moves that increase by two or more stages?
  @computed get anyBoostingMoves() {
    return this.teamMoves.some(move => (
      moves[move]
      && moves[move].boosts
      && Object.values(moves[move].boosts).reduce((sum, num) => sum + num) >= 2
    ))
  }

  // Get the team's learnsets using learnsets.min.js
  @computed get teamLearnsets() {
    // both will contain the learnsets of six pokemon
    let teamLearnsets = {
      values: [],
      labels: [],
    }

    for (const teamPkmnProps of this.team) {
      const pkmn = teamPkmnProps.name

      if (pkmn) {
        // the specific pokemon's complete learnset
        let learnsetValues = this.completeLearnset(pkmn)

        if (this.searchFilters.moves) { // search filter: if the user only wants to see viable moves
          // Remove non-viable moves
          learnsetValues = learnsetValues.filter(move => moves[move].isViable)
        }

        // Say move is 'aerialace'
        // we need to display it as 'Aerial Ace', which is the purpose of learnsetLabels
        const learnsetLabels = learnsetValues.map(move => this.moveName(move))

        teamLearnsets.values.push(learnsetValues)
        teamLearnsets.labels.push(learnsetLabels)
      } else {
        teamLearnsets.values.push([])
        teamLearnsets.labels.push([])
      }
    }

    return teamLearnsets
  }

  // Get the team's types
  @computed get teamTypes() {
    let teamTypes = []

    for (const teamPkmnProps of this.team) {
      const pkmn = teamPkmnProps.name

      if (pkmn) {
        const pkmnTypes = pokedex[pkmn].types // that pokemon's types
        
        teamTypes.push(pkmnTypes)
      } else {
        teamTypes.push([])
      }
    }

    return teamTypes
  }


  // Does the team have these items?
  doesTeamHaveItems(items) { // array input
    return this.teamItems.some(teamItem => items.includes(teamItem))
  }

  // Does the team have this one particular item?
  doesTeamHaveMove = move => this.teamMoves.includes(move) // String input

  // Does the team Have these moves (in an array)?
  ///* Simple version that returns a boolean
  doesTeamHaveMoves(moves) {
    return this.teamMoves.some(teamMove => moves.includes(teamMove))
  }
  //*/
  /*
  doesTeamHaveMoves(moves) {
    return this.teamMoves.some(teamMove => (
      {answer: moves.includes(teamMove)}
    ))
  }
  */

  // Does any team pokemon have all of these moves?
  doesTeamPokemonHaveTheseMoves(moves) { // array input
    /*
     * Check if at least one of your pokemon contains these 2-4 moves.
     * 
     * Actually, say if you want to check if you have a pokemon,
     * That contains wish and either protect or wish.
     * What you do is pass an array,
     * Where the first element is 'wish',
     * And the second is an array, ['protect', 'detect'].
     */

    /*
     * Example
     * 
     * this.teamFourMoveslots
     * [
     *  ['Agility', 'Fire Blast', 'Focus Blast', 'Substitute'],
     *  [..],
     *  [..],
     *  [..],
     *  [..],
     *  [..],
     * ]
     * 
     * teamFourMoveslot (1st iteration)
     * ['Agility', 'Fire Blast', 'Focus Blast', 'Substitute']
     */
    return this.teamFourMoveslots.some(teamFourMoveslot => (
      /*
       * Example
       * 
       * moves
       * ['wish', ['protect', 'detect']]
       * 
       * move (1st iteration)
       * 'wish'
       * 
       * move (2nd iteration)
       * ['protect', 'detect']
       */
      moves.every(move => {
        if (Array.isArray(move)) {
          /* 
           * Example
           * 
           * move
           * ['protect', 'detect']
           * 
           * altMove (1st iteration)
           * 'protect'
           */
          return move.some(altMove => teamFourMoveslot.includes(altMove))
        } else {
          return teamFourMoveslot.includes(move)
        }
      })
    ))
  }

  /* NOT USED
  Does any team pokemon have this particular move and item?
  teamPokemonHasThisMoveAndItem(move, item) {
    return this.teamFourMoveslots.map((teamFourMoveslot, i) => (
      teamFourMoveslot.includes(move) && this.team[i].item === item
  ))
  }
  */

  // Clear a team pokemon's properties
  @action clearTeamPkmnProps(teamIndex) {
    const teamPkmnProps = this.team[teamIndex]

    for (const prop in teamPkmnProps) {
      teamPkmnProps[prop] = ''
    }
  }

  // Auto-select the item if necessary
  // E.g. Select Blastoisite when the user chooses Mega Blastoise
  @action autoSelectItem() {
    for (const teamPkmnProps of this.team) {
      // make sure you brush up on your ES6 destructuring!
      let {name: pkmn, item: pkmnItem} = teamPkmnProps

      if (pkmn) {
        // Auto select mega stone
        if (
          pkmn.includes('mega')
          && pkmn !== 'meganium'
          && pkmn !== 'yanmega'
        ) {
          pkmnItem = this.itemsArr.find(item => (
            // fuzzy match pokemon name with mega stone name (e.g. blastoisite and blastoise)
            item.slice(0, 5) === pkmn.slice(0, 5)
          ))

          // Fuzzy match will give Charizard Y a Charizardite X
          // Hence this code
          if (pkmn === 'charizardmegay' || pkmn === 'mewtwomegay') {
            pkmnItem = pkmnItem.replace('x', 'y')
          }
        }

        // Auto select plate for Arceus formes
        else if (pkmn.includes('arceus')) {
          const type = pkmn.replace('arceus', '')
          const typeToPlate = {
            bug: 'insectplate',
            dark: 'dreadplate',
            dragon: 'dracoplate',
            electric: 'zapplate',
            fairy: 'pixieplate',
            fighting: 'fistplate',
            fire: 'flameplate',
            flying: 'skyplate',
            ghost: 'spookyplate',
            grass: 'meadowplate',
            ground: 'earthplate',
            ice: 'icicleplate',
            normal: '', // no plate for normal type
            poison: 'toxicplate',
            psychic: 'mindplate',
            rock: 'stoneplate',
            steel: 'ironplate',
            water: 'splashplate',
          }

          pkmnItem = typeToPlate[type]
        }

        // Auto select drive for Genesect
        else if (pkmn.includes('genesect') && pkmn !== 'genesect') {
          const driveAdj = pkmn.replace('genesect', '')
          const item = driveAdj + 'drive'
          
          pkmnItem = item
        }

        // Auto select memory for Silvally
        else if (pkmn.includes('silvally') && pkmn !== 'silvally') {
          const type = pkmn.replace('silvally', '')
          const item = type + 'memory'

          pkmnItem = item
        }
        
        // Pick Griseous Orb for Giratina
        else if (pkmn === 'giratinaorigin') {
          pkmnItem = 'griseousorb'
        }
      }

      teamPkmnProps.item = pkmnItem
    }
  }

  // Auto select the pokemon's ability if it only has one ability.
  // E.g. Select Thick Fat when the user chooses Venusaur-Mega
  @action autoSelectAbility() {
    this.teamAbilities.forEach((pkmnAbilities, i) => {
      if (pkmnAbilities.length === 1) {
        this.team[i].ability = pkmnAbilities[0]
      }
    })
  }

  /*******************************
  TEAM'S TYPE DEFENCE AND COVERAGE
  *******************************/

  // Tells you the effectiveness of a type against a certain pokemon
  typeAgainstPkmn(type, pkmn, pkmnAbility, item) {
    const pkmnTypes = pokedex[pkmn].types
    const [type1, type2] = pkmnTypes
    const type1Resistance = typechart[type1][type]
    
    let effectiveness = type1Resistance

    if (type2) {
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
        effectiveness = 3
      } else {
        effectiveness += type2Resistance
      }
    } else if (effectiveness === 2) {
      effectiveness = 3
    }

    // Take into account ability for pokemon's resistances
    if (pkmnAbility) {
      switch (pkmnAbility) {
        // Abilities that make you immune to certain types
        case 'Volt Absorb':
        case 'Lightning Rod':
        case 'Motor Drive':
          if (type === 'Electric') {
            effectiveness = 3
          }
          break
        case 'Flash Fire':
          if (type === 'Fire') {
            effectiveness = 3
          }
          break
        case 'Sap Sipper':
          if (type === 'Grass') {
            effectiveness = 3
          }
          break
        case 'Levitate':
          if (type === 'Ground') {
            effectiveness = 3
          }
          break
        case 'Water Absorb':
        case 'Storm Drain':
          if (type === 'Water') {
            effectiveness = 3
          }
          break
        case 'Wonder Guard':
          if (effectiveness >= 0) {
            effectiveness = 3
          }
          break
        // Abilities that halve damage from certain types
        case 'Thick Fat':
          if (type === 'Fire' || type === 'Ice') {
            effectiveness += 1
          }
          break
        case 'Heatproof':
          if (type === 'Fire') {
            effectiveness += 1
          }
          break
        // Abilities that cushion supereffective moves
        case 'Solid Rock':
        case 'Filter':
        case 'Prism Armor':
          if (effectiveness === -1) {
            effectiveness = -0.5
          } else if (effectiveness === -2) {
            effectiveness = -1.5
          }
          break
        default:
      }
    }

    // If pokemon wields an air balloon
    if (
      item
      && item === 'airballoon'
      && type === 'Ground'
      && effectiveness < 2
    ) {
      effectiveness += 1
    }

    return effectiveness
  }

  // Tells you the move's type based on the pokemon using it and its ability
  // E.g. Arceus-Bug using Judgment or Aerilate Mega-Pinsir using Return.
  moveType(move, pkmn, ability) {
    let moveType = moves[move].type // If it didn't matter which pokemon used the move, this function would only be this one line lol

    const abilitiesThatChangeNormalMoves = {
      Aerilate: 'Flying', 
      Pixilate: 'Fairy', 
      Refrigerate: 'Ice', 
      Galvanize: 'Electric',
    }
    
    if (Object.keys(abilitiesThatChangeNormalMoves).includes(ability) && moveType === 'Normal') {
      moveType = abilitiesThatChangeNormalMoves[ability]
    } else if (ability === 'Normalize') {
      moveType = 'Normal'
    } else if (move === 'judgment') { // For Arceus
      const pkmnProps = pokedex[pkmn]
      moveType = pkmnProps.types[0] // Arceus only has one ability
    } else if (move === 'technoblast') { // For Genesect
      switch (pkmn) {
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
    } else if (move === 'multiattack') { // For Silvally
      const type = pkmn.replace('silvally', '') || 'normal'
      const capitalizedType = capitalizeWord(type)

      moveType = capitalizedType
    }

    return moveType
  }

  // Tells you the effectiveness of a move against a type
  // For status and weak moves, this function will return undefined
  moveAgainstType(move, typeAgainst, pkmn, ability) {
    const moveProps = moves[move]
    const moveType = this.moveType(move, pkmn, ability)

    // BUG: If the user picks freeze-dry or flying press multiple times, it can be exploited
    if (move === 'freezedry' && typeAgainst === 'Water') {
      return -1
    } else if (move === 'flyingpress') {
      // since flying press is part flying and fighting
      return typechart.Flying[moveType] + typechart.Fighting[moveType]
    } /*else if (move === 'thousandarrows' && typeAgainst === 'Ground') {
      return -1
    }*/
    /*
     * Ignore status moves.
     * (status moves don't deal damage. so they don't contribute to type coverage)
     * Ignore moves less than 40 base power (unless it's a multi-hit move).
     */
    else if (
      moveProps.category !== 'Status'
      && (
        moveProps.basePower >= 40 
        || moveProps.multihit
        || moveProps.basePowerCallback
        || moveProps.onModifyMove
      )
    ) {
      return typechart[typeAgainst][moveType]
    }
  }

  // Assessment of the team's type defence
  // (How good your team is against the 18 different types)
  @computed get typeDefence() {
    if (this.isTeamEmpty) {
      return this.cleanSlate
    } else {
      // Scoresheet of how good all six pokemon resist a certain type
      let typeDefence = {...this.cleanSlate}

      for (const type in typeDefence) {
        for (const teamPkmnProps of this.team) {
          const {name: pkmn, ability, item} = teamPkmnProps
          if (pkmn) {
            let score = this.typeAgainstPkmn(type, pkmn, ability, item)
            if (score === 3) {
              score = 2
            }

            typeDefence[type] += score
          }
        }
      }

      return typeDefence
    }
  }

  // Assessment of the team's type coverage
  // (How many types are your team's moves supereffective against)
  @computed get typeCoverage() {
    if (this.isTeamEmpty) {
      return this.cleanSlate
    } else {
      // Scoresheet of how many types your moves are supereffective against
      let typeCoverage = {...this.cleanSlate}

      for (const teamPkmnProps of this.team) { // for each pokmeon
        const {name: pkmn, ability} = teamPkmnProps

        let typesUsed = []
        let pkmnHasFreezeDry = false
        let pkmnHasFlyingPress = false
        
        for (const i of [1, 2, 3, 4]) { //  for each move
          const move = teamPkmnProps['move' + i]

          if (move) {
            const moveType = this.moveType(move, pkmn, ability)
            
            Object.keys(typeCoverage).forEach(type => { // for each type
              if (
                // If the move is not a repeated freeze dry
                (!pkmnHasFreezeDry || move !== 'freezedry')
                // If the move is not a repeated flying press
                && (!pkmnHasFlyingPress || move !== 'flyingpress')
                // If the move's type is not repeated or it's freeze dry or flying rpess
                && (
                  !typesUsed.includes(moveType)
                  || move === 'freezedry'
                  || move === 'flyingpress'
                )
                // if it's super effective (cuz supereffective is -1)
                && this.moveAgainstType(move, type, pkmn, ability) === -1
              ) {
                typeCoverage[type]++
              }
            })

            if (move === 'freezedry') {
              pkmnHasFreezeDry = true
            } else if (move === 'flyingpress') {
              pkmnHasFlyingPress = true
            } else {
              typesUsed.push(moveType)
            }
          }
        }
      }

      return typeCoverage
    }
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
      filterByFormat(
        filterByRegion(
          filterByType({...pokedex})
        )
      )
    )

    function filterByFormat(pokedex) {
      /* No Filter */

      if (format === '') {
        return pokedex
      }

      /* Official Pokemon Format Filter */

      let filteredPokedex
      
      if (['Battle Spot Singles', 'Battle Spot Doubles', 'VGC 2018'].includes(format)) {
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

        filteredPokedex = {...pokedex}

        for (const pkmn of banlist) {
          const {otherFormes} = pokedex[pkmn]

          // Don't just delete the banned pokemon, delete its other formes
          // E.g. delete giratina, as well as giratinaorigin
          if (otherFormes) {
            otherFormes.forEach(otherForme => delete filteredPokedex[otherForme])
          }
          delete filteredPokedex[pkmn]
        }
        return filteredPokedex
      }

      /* Smogon Singles/Doubles Filter */
      
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

      filteredPokedex = {} // clear out filteredPokedex

      /* Smogon Singles Filter */
      
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


      if (smogonSinglesTiers.includes(tierAbbr[format])) {
        return helperFunction(smogonSinglesTiers, 'tier')
      }

      /* Smogon Doubles Filter */

      else if (['DUber', 'DOU', 'DUU'].includes(tierAbbr[format])) {
        return helperFunction(['DUber', 'DOU', 'DUU'], 'doublesTier')
      }

      /* Helper Function for Smogon Singles/Doubles Filter */

      function helperFunction(arrayOfTiers, tierType) {
        let tierMatched = false
        
        for (const tier of arrayOfTiers) {
          // If the tier matches or it's a lower tier
          if (tierAbbr[format] === tier || tierMatched) {
            tierMatched = true

            // Add all the pokemon from that tier to filteredPokedex
            for (const pkmn in pokedex) {
              if (formats[pkmn][tierType] === tier) {
                filteredPokedex[pkmn] = pokedex[pkmn]
              }
            }
          }
        }
        
        return filteredPokedex
      }
    }

    function filterByRegion(pokedex) {
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
        let filteredPokedex = {}

        // Only return pokemon from a certian region based on pokedex number
        for (const [pkmn, pkmnProps] of Object.entries(pokedex)) {
          if (
            pkmnProps.num >= range[0]
            && pkmnProps.num <= range[1]
            // If Kanto region, remove alola forms
            && !(region === 'Kanto' && pkmn.includes('alola'))
          ) {
            filteredPokedex[pkmn] = pkmnProps
          }
        }
        
        // If Alola region, add alola forms
        if (region === 'Alola') {
          for (const [pkmn, pkmnProps] of Object.entries(pokedex)) {
            if (pkmn.includes('alola')) {
              filteredPokedex[pkmn] = pkmnProps
            }
          }
        }

        return filteredPokedex
      } else {
        return pokedex
      }
    }

    function filterByType(pokedex) {
      let filteredPokedex = {}

      if (type) {
        for(const [pkmn, pkmnProps] of Object.entries(pokedex)) {
          if (pkmnProps.types.includes(type)) {
            filteredPokedex[pkmn] = pkmnProps
          }
        }

        return filteredPokedex
      } else {
        return pokedex
      }
    }
  }

  @computed get filteredPokemonNames() {
    return this.filteredPokemon.map(pokemon => this.pkmnName(pokemon))
  }

  /*******
  SNACKBAR
  *******/

  @observable isSnackbarOpen = false
  @observable snackbarMsg = ''

  @action openSnackbar(msg) {
    this.isSnackbarOpen = true
    this.snackbarMsg = msg
  }
}

// FOR DEBUGGING
// let store = window.store = new Store()

export default new Store()

// autorun(() => console.log(store.teamTypes))

/* FOR BUILD
export default new Store()
*/