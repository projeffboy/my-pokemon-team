import { makeAutoObservable, configure } from "mobx";
import { capitalizeWord } from "./helper-functions";
import {
  Pokedex,
  Moves,
  Learnsets,
  Formats,
  TypeChart,
  Items,
  OldMoves,
  Team,
  TeamPokemonProperties,
} from "./types";

// The store is mutated directly from components (e.g. store.team[i].name = ...),
// so don't require actions for state changes.
configure({ enforceActions: "never" });
// I have to import a bunch of pokemon data first
import pokedexData from "./data/pokedex";
import itemsData from "./data/items";
import learnsetsData from "./data/learnsets";
import typechartData from "./data/typechart";
import movesData from "./data/moves";
import oldMovesData from "./data/old-moves";
import formatsData from "./data/formats";

// Typed views over the JS datasets
const pokedex: Pokedex = pokedexData as unknown as Pokedex;
const items = itemsData as unknown as Items;
const learnsets = learnsetsData as unknown as Learnsets;
const typechart = typechartData as unknown as TypeChart;
const moves = movesData as unknown as Moves;
const oldMoves = oldMovesData as unknown as OldMoves;
const formats = formatsData as unknown as Formats;

class Store {
  cleanSlate: Record<string, number>;

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
    };

    makeAutoObservable(this);
  }

  /*
   * MAKING SENSE OF VARIABLE NAMES
   * There are three types of pokemon variables:
   *  1. pokemon or pokemonId (pokemon ID, not to be confused with pokedex ID):
   *    -only one word
   *    -no hyphens
   *    -lowercase
   *    -E.g. charizardmegay
   *  2. pokemonName (pokemon name):
   *    -words are separated by a hyphen, not a space
   *    -each word is capitalized
   *    -E.g. Charizard-Mega-Y
   *  3. pokemonProperties (pokemon properties):
   *    -an object containing a pokemon's properties
   *    -these properties have to be obtained from pokedex.js
   *    -E.g. const pokemonProperties = pokedex['charizard']
   *
   *
   * Same variable naming scheme for items:
   *  1. item
   *  2. itemName
   *  3. itemProperties
   * And moves:
   *  1. move
   *  2. moveName
   *  3. moveProperties
   * And a pokemon's base forme:
   *  1. baseForme
   *  2. baseFormeName
   *  3. baseFormeProperties
   *
   * `team` refer's to the user's pokemon team.
   * There's an @observable variable for it in the store.
   * Anything related to the user's pokemon team should be prefixed with `team`.
   * E.g.
   *  -Functions like:
   *    -teamFourMoveslots
   *    -teamLearnsets
   *  -Each element in @observable team is teamPokemonProperties, containing within:
   *    -teamPokemon (teamPokemonName = this.pokemonName(teamPokemon))
   *    -teamPokemonProperties
   *    -teamPokemonItem
   *    -teamPokemonMove1 (etc.)
   *    -teamPokemonAbility
   *
   * Exception: `team` prefix can be dropped during iterations
   * E.g.: `this.teamItems.map(item => ..)` instead of `this.teamItems.map(teamItem => ..)`
   * Exception to exception: You cannot drop the `team` prefix for `teamPokemonProperties` no matter what
   */

  /*
   * STORE HELPER PROPERTIES
   *
   * pokedex[pokemon]
   *  Input: pokemon ID
   *  Output: pokemon's properties from pokedex.js
   * moves[move]
   *  Input: move ID
   *  Output: move's properties from moves.js
   * learnsets[pokemon]
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

  pokemonType(pokemon: string) {
    return pokedex[pokemon]?.types || [];
  }

  /* NOT USED
   * Instead we use filteredPokemon and filteredPokemonNames
  // returns pokemon id
  allPokemon() {
    return Object.keys(pokedex)
  }

  // returns pokemon names
  allPokemonNames() {
    return this.allPokemon.map(pokemon => this.pokemonName(pokemon))
  }
  */

  /*
   * Input a pokemon ID to return its abilities
   * (ID as in "venusaurmega", name as in "Venusaur Mega")
   * (output is in object form)
   */
  abilities(pokemon: string) {
    return pokedex[pokemon]?.abilities || {};
  }

  // Input a pokemon ID to return its pokemon name
  // E.g. 'squirtle' => 'Squirtle'
  pokemonName(pokemon: string) {
    return pokedex[pokemon]?.name;
  }

  // The inverse of the pokemonName function
  // E.g. 'Squirtle' => 'squirtle'
  pokemonNameInverse(pokemonName: string) {
    for (const pokemon in pokedex) {
      if (this.pokemonName(pokemon) === pokemonName) {
        return pokemon;
      }
    }
  }

  // Input a pokemon ID to return the pokemon ID of its base forme
  // E.g. 'giratinaorigin' => 'giratina'
  // (it will return undefined for pokemon already at the base forme)
  // E.g. 'wartortle' => undefined
  baseForme(pokemon: string) {
    const baseFormeName = pokedex[pokemon]?.baseSpecies;
    const baseForme =
      baseFormeName ? this.pokemonNameInverse(baseFormeName) : undefined;

    return baseForme;
  }

  // Input a pokemon ID to return its alternate forme(s)
  // E.g. 'charizard' => ['charizardmegax', 'charizardmegay']
  forme(pokemon: string) {
    return pokedex[pokemon]?.forme;
  }

  // Get previous evolution
  previousEvolution(pokemon: string) {
    const pokemonProperties = pokedex[pokemon];
    const prevo = pokemonProperties ? pokemonProperties.prevo : undefined;
    return prevo ?
        prevo.toLowerCase().replace("-", "").replace(":", "").replace(" ", "")
      : undefined;
  }

  /* ITEMS METHODS */

  get itemsArr() {
    return Object.keys(items);
  }

  get itemNamesArr() {
    return Object.values(items).map(itemProperties => itemProperties.name);
  }

  itemName(item: string) {
    const itemInfo = items[item];

    return itemInfo ? itemInfo.name || "" : "";
  }

  itemNameInverse(itemName: string) {
    return this.itemsArr[this.itemNamesArr.indexOf(itemName)];
  }

  /* LEARNSETS METHODS */

  /*
   * Gives you a pokemon's complete learnset, which includes the learnsets of its previous evolutions.
   * If you just use learnsets[pokemon], it will not give you previous evolution learnsets.
   * It also adds all the different hidden powers.
   */
  completeLearnset(pokemon: string): string[] {
    let completeLearnset: string[] = learnsets[pokemon] || [];

    let baseForme = this.baseForme(pokemon) || pokemon; // since learnsets[pokemon] requires pokemon to be at its base forme

    let isRegional = false;

    if (
      pokemon.includes("alola") ||
      pokemon.includes("galar") ||
      pokemon.includes("hisui") ||
      pokemon.includes("paldea")
    ) {
      isRegional = true;
    } else {
      completeLearnset = [...completeLearnset, ...(learnsets[baseForme] || [])];
    }

    while (this.previousEvolution(baseForme)) {
      baseForme = this.previousEvolution(baseForme)!;
      baseForme = baseForme
        .replace("\u2019", "") // sirfetch'd
        .replace(".", "") // fixes the mr. mime family
        .replace("é", "e")
        .replace("é", "e")
        .replace("-", "");

      let region = "";
      const pokemonFormeEntry = pokedex[baseForme];
      if (isRegional && pokemonFormeEntry?.otherFormes) {
        const otherFormes = pokemonFormeEntry.otherFormes;
        if (otherFormes.some(forme => forme.includes("Alola"))) {
          region = "alola";
        } else if (otherFormes.some(forme => forme.includes("Galar"))) {
          region = "galar";
        } else if (otherFormes.some(forme => forme.includes("Hisui"))) {
          region = "hisui";
        } else if (otherFormes.some(forme => forme.includes("Paldea"))) {
          region = "paldea";
        }
      }
      // Append previous evolution learnset to current learnset
      completeLearnset = [
        ...completeLearnset,
        ...(learnsets[baseForme + region] || []),
      ];
    }

    // turning array to set removes duplicates then back to array
    completeLearnset = Array.from(new Set(completeLearnset));

    // Add in all the hidden powers
    if (completeLearnset.includes("hiddenpower")) {
      // hidden power normal is already included by default
      const pokemonTypes = [
        // no hidden power fairy btw
        "bug",
        "dark",
        "dragon",
        "electric",
        "fighting",
        "fire",
        "flying",
        "ghost",
        "grass",
        "ground",
        "ice",
        "poison",
        "psychic",
        "rock",
        "steel",
        "water",
      ];
      const hiddenpowers = pokemonTypes.map(type => "hiddenpower" + type);

      // remove hidden power normal
      completeLearnset.splice(completeLearnset.indexOf("hiddenpower"), 1);

      // add all hidden powers together
      completeLearnset.push("hiddenpower");
      completeLearnset.push(...hiddenpowers);
    }

    return completeLearnset;
  }

  // Can `pokemon` learn `move`?
  canItLearn = (move: string | undefined, pokemon: string): boolean =>
    move ? this.completeLearnset(pokemon).includes(move) : false;

  /* TYPECHART METHODS */

  // Don't think we need any

  /* MOVE METHODS */

  // Get the proper name of move
  moveName(move: string) {
    return moves[move]?.name;
  }

  // Inverse function of moveName
  moveNameInverse(moveName: string) {
    for (const move in moves) {
      if (moveName === this.moveName(move)) {
        return move;
      }
    }
  }

  /* FORMATS METHODS */

  /********************************
  DATA ABOUT THE TEAM'S SIX POKEMON 
  ********************************/

  team: Team = Array.from(
    { length: 6 },
    (): TeamPokemonProperties => ({
      name: "", // technically, this is the pokemon ID, not pokemon name
      // but name is much more clearer to those new to the source code
      item: "",
      move1: "",
      move2: "",
      move3: "",
      move4: "",
      ability: "", // chosen ability
    }),
  );

  // Get the team's six pokemon id/name (pokemon)
  get teamPokemon() {
    return this.team.map(teamPokemonProperties => teamPokemonProperties.name);
  }

  // Check if team is empty
  get isTeamEmpty() {
    return !this.teamPokemon.some(pokemon => pokemon);
  }

  // Get the team's six items (in array form)
  get teamItems() {
    return this.team.map(teamPokemonProperties => teamPokemonProperties.item);
  }

  // Get the team's moves that the user chose (in 1D array)
  get teamMoves() {
    const teamMoves: string[] = [];

    this.team.forEach(teamPokemonProperties => {
      teamMoves.push(
        teamPokemonProperties.move1,
        teamPokemonProperties.move2,
        teamPokemonProperties.move3,
        teamPokemonProperties.move4,
      );
    });

    return teamMoves;
  }

  // Basically the above but a 2D array,
  // It's an array of 6 arrays (for each pokemon),
  // Each containing 4 elements (for the 4 moves)
  get teamFourMoveslots() {
    return this.team.map(teamPokemonProperties => [
      teamPokemonProperties.move1,
      teamPokemonProperties.move2,
      teamPokemonProperties.move3,
      teamPokemonProperties.move4,
    ]);
  }

  // Get team's possible abilities (in 2D array)
  get teamAbilities() {
    return this.team.map(teamPokemonProperties => {
      if (teamPokemonProperties.name) {
        const teamPokemonAbilities =
          pokedex[teamPokemonProperties.name]?.abilities || {};

        return Object.values(teamPokemonAbilities) as string[];
      } else {
        return [];
      }
    });
  }

  // Does the team contain moves that inflict non-volatile status?
  // E.g. toxic inflicts poison, thunder wave inflicts paralysis
  get anyStatusMoves() {
    return this.teamMoves.some(
      move =>
        moves[move] &&
        (moves[move].status ||
          (moves[move].secondary &&
            moves[move].secondary.chance === 100 &&
            moves[move].secondary.status)),
    );
  }

  // Does the team contain boosting moves that increase by two or more stages?
  get anyBoostingMoves() {
    return this.teamMoves.some(
      move =>
        move === "curse" ||
        (moves[move] &&
          moves[move].boosts &&
          Object.values(moves[move].boosts).reduce(
            (sum, num) => sum + num,
            0,
          ) >= 2),
    );
  }

  // Get the team's learnsets using learnsets.min.js
  get teamLearnsets() {
    // both will contain the learnsets of six pokemon
    let teamLearnsets: {
      values: string[][];
      labels: (string | undefined)[][];
    } = {
      values: [],
      labels: [],
    };

    for (const teamPokemonProperties of this.team) {
      const pokemon = teamPokemonProperties.name;

      if (pokemon) {
        // the specific pokemon's complete learnset
        let learnsetValues = this.completeLearnset(pokemon);

        if (this.searchFilters.moves) {
          // search filter: if the user only wants to see viable moves
          // Remove non-viable moves
          learnsetValues = learnsetValues.filter(
            move => oldMoves[move] && oldMoves[move].isViable,
          );
        }

        // Say move is 'aerialace'
        // we need to display it as 'Aerial Ace', which is the purpose of learnsetLabels
        const learnsetLabels = learnsetValues.map(move => this.moveName(move));

        teamLearnsets.values.push(learnsetValues);
        teamLearnsets.labels.push(learnsetLabels);
      } else {
        teamLearnsets.values.push([]);
        teamLearnsets.labels.push([]);
      }
    }

    return teamLearnsets;
  }

  // Get the team's types
  get teamTypes() {
    let teamTypes = [];

    for (const teamPokemonProperties of this.team) {
      const pokemon = teamPokemonProperties.name;

      if (pokemon) {
        const pokemonTypes = pokedex[pokemon]?.types || []; // that pokemon's types

        teamTypes.push(pokemonTypes);
      } else {
        teamTypes.push([]);
      }
    }

    return teamTypes;
  }

  // Does the team have these items?
  doesTeamHaveItems(items: string[]) {
    // array input
    return this.teamItems.some(teamItem => items.includes(teamItem));
  }

  // Does the team have this one particular item?
  doesTeamHaveMove = (move: string) => this.teamMoves.includes(move); // String input

  // Does the team Have these moves (in an array)?
  ///* Simple version that returns a boolean
  doesTeamHaveMoves(moves: string[]) {
    return this.teamMoves.some(teamMove => moves.includes(teamMove));
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
  doesTeamPokemonHaveTheseMoves(moves: (string | string[])[]) {
    // array input
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
    return this.teamFourMoveslots.some(teamFourMoveslot =>
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
          return move.some(altMove => teamFourMoveslot.includes(altMove));
        } else {
          return teamFourMoveslot.includes(move);
        }
      }),
    );
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
  clearTeamPokemonProperties(teamIndex: number) {
    const teamPokemonProperties = this.team[teamIndex];

    for (const property in teamPokemonProperties) {
      teamPokemonProperties[property] = "";
    }
  }

  // Auto-select the item if necessary
  // E.g. Select Blastoisite when the user chooses Mega Blastoise
  autoSelectItem() {
    for (const teamPokemonProperties of this.team) {
      // make sure you brush up on your ES6 destructuring!
      let { name: pokemon, item: pokemonItem } = teamPokemonProperties;

      if (pokemon) {
        // Auto select mega stone
        if (
          pokemon.includes("mega") &&
          pokemon !== "meganium" &&
          pokemon !== "yanmega"
        ) {
          pokemonItem =
            this.itemsArr.find(
              item =>
                // fuzzy match pokemon name with mega stone name (e.g. blastoisite and blastoise)
                item.slice(0, 5) === pokemon.slice(0, 5),
            ) || "";

          // Fuzzy match will give Charizard Y a Charizardite X
          // Hence this code
          if (pokemon === "charizardmegay" || pokemon === "mewtwomegay") {
            pokemonItem = pokemonItem.replace("x", "y");
          }
          // Same with Sharpedo and Sharp Beak
          else if (pokemon === "sharpedomega") {
            pokemonItem = "sharpedonite";
          }
          // Same with Dragonite and Dragon Fang
          else if (pokemon === "dragonitemega") {
            pokemonItem = "dragoninite";
          } else if (pokemon === "steelixmega") {
            pokemonItem = "steelixite";
          }
        }

        // Auto select plate for Arceus formes
        else if (pokemon.includes("arceus")) {
          const type = pokemon.replace("arceus", "");
          const typeToPlate: Record<string, string> = {
            bug: "insectplate",
            dark: "dreadplate",
            dragon: "dracoplate",
            electric: "zapplate",
            fairy: "pixieplate",
            fighting: "fistplate",
            fire: "flameplate",
            flying: "skyplate",
            ghost: "spookyplate",
            grass: "meadowplate",
            ground: "earthplate",
            ice: "icicleplate",
            normal: "", // no plate for normal type
            poison: "toxicplate",
            psychic: "mindplate",
            rock: "stoneplate",
            steel: "ironplate",
            water: "splashplate",
          };

          pokemonItem = typeToPlate[type] || "";
        }

        // Auto select drive for Genesect
        else if (pokemon.includes("genesect") && pokemon !== "genesect") {
          const driveAdj = pokemon.replace("genesect", "");
          const item = driveAdj + "drive";

          pokemonItem = item;
        }

        // Auto select memory for Silvally
        else if (pokemon.includes("silvally") && pokemon !== "silvally") {
          const type = pokemon.replace("silvally", "");
          const item = type + "memory";

          pokemonItem = item;
        }

        // Pick Griseous Orb for Giratina
        else if (pokemon === "giratinaorigin") {
          pokemonItem = "griseousorb";
        }
      }

      teamPokemonProperties.item = pokemonItem;
    }
  }

  // Auto select the pokemon's ability if it only has one ability.
  // E.g. Select Thick Fat when the user chooses Venusaur-Mega
  autoSelectAbility() {
    this.teamAbilities.forEach((pokemonAbilities, i) => {
      if (pokemonAbilities.length === 1) {
        this.team[i].ability = pokemonAbilities[0];
      }
    });
  }

  /*******************************
  TEAM'S TYPE DEFENCE AND COVERAGE
  *******************************/

  // Tells you the effectiveness of a type against a certain pokemon
  typeAgainstPokemon(
    type: string,
    pokemon: string,
    pokemonAbility?: string,
    item?: string,
  ) {
    const pokemonTypes = pokedex[pokemon]?.types || [];
    const [type1, type2] = pokemonTypes;
    const type1Resistance = type1 ? (typechart[type1]?.[type] ?? 0) : 0;

    let effectiveness = type1Resistance;

    if (type2) {
      const type2Resistance = type2 ? (typechart[type2]?.[type] ?? 0) : 0;

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
        effectiveness = 3;
      } else {
        effectiveness += type2Resistance;
      }
    } else if (effectiveness === 2) {
      effectiveness = 3;
    }

    // Take into account ability for pokemon's resistances
    if (pokemonAbility) {
      switch (pokemonAbility) {
        // Abilities that make you immune to certain types
        case "Volt Absorb":
        case "Lightning Rod":
        case "Motor Drive":
          if (type === "Electric") {
            effectiveness = 3;
          }
          break;
        case "Flash Fire":
        case "Well-Baked Body":
          if (type === "Fire") {
            effectiveness = 3;
          }
          break;
        case "Sap Sipper":
          if (type === "Grass") {
            effectiveness = 3;
          }
          break;
        case "Levitate":
        case "Earth Eater":
          if (type === "Ground") {
            effectiveness = 3;
          }
          break;
        case "Water Absorb":
        case "Storm Drain":
          if (type === "Water") {
            effectiveness = 3;
          }
          break;
        case "Water Bubble":
          if (type === "Fire") {
            effectiveness += 1;
          }
          break;
        case "Wonder Guard":
          if (effectiveness >= 0) {
            effectiveness = 3;
          }
          break;
        // Abilities that halve damage from certain types
        case "Thick Fat":
          if (type === "Fire" || type === "Ice") {
            effectiveness += 1;
          }
          break;
        case "Heatproof":
          if (type === "Fire") {
            effectiveness += 1;
          }
          break;
        // Abilities that cushion moves
        case "Solid Rock":
        case "Filter":
        case "Prism Armor":
          if (effectiveness === -1) {
            effectiveness = -0.5;
          } else if (effectiveness === -2) {
            effectiveness = -1.5;
          }
          break;
        case "Fluffy":
          if (type === "Fire") {
            effectiveness -= 1;
          }
          break;
        case "Dry Skin":
          if (type === "Fire") {
            effectiveness -= 1;
          } else if (type === "Water") {
            effectiveness = 3;
          }
          break;
        case "Purifying Salt":
          if (type === "Ghost") {
            effectiveness += 1;
          }
          break;
        default:
      }
    }

    // If pokemon wields an air balloon
    if (
      item &&
      item === "airballoon" &&
      type === "Ground" &&
      effectiveness < 2
    ) {
      effectiveness += 1;
    }

    return effectiveness;
  }

  // Tells you the move's type based on the pokemon using it and its ability
  // E.g. Arceus-Bug using Judgment or Aerilate Mega-Pinsir using Return.
  moveType(move: string, pokemon: string, ability?: string) {
    let moveType = moves[move]?.type;

    const abilitiesThatChangeNormalMoves: Record<string, string> = {
      Aerilate: "Flying",
      Pixilate: "Fairy",
      Refrigerate: "Ice",
      Galvanize: "Electric",
    };

    if (
      ability &&
      abilitiesThatChangeNormalMoves[ability] &&
      moveType === "Normal"
    ) {
      moveType = abilitiesThatChangeNormalMoves[ability] || moveType;
    } else if (ability === "Normalize") {
      moveType = "Normal";
    } else if (move === "judgment") {
      const pokemonProperties = pokedex[pokemon];
      moveType =
        pokemonProperties?.types ? pokemonProperties.types[0] : moveType; // Arceus only has one ability
    } else if (move === "ivycudgel") {
      const pokemonProperties = pokedex[pokemon];
      moveType =
        pokemonProperties?.types ?
          pokemonProperties.types[pokemonProperties.types.length > 1 ? 1 : 0]
        : moveType;
    } else if (move === "technoblast") {
      // For Genesect
      switch (pokemon) {
        case "genesectdouse":
          moveType = "Water";
          break;
        case "genesectshock":
          moveType = "Electric";
          break;
        case "genesectburn":
          moveType = "Fire";
          break;
        case "genesectchill":
          moveType = "Ice";
          break;
        default:
      }
    } else if (move === "multiattack") {
      // For Silvally
      const type = pokemon.replace("silvally", "") || "normal";
      const capitalizedType = capitalizeWord(type);

      moveType = capitalizedType;
    } else if (
      ability === "Liquid Voice" &&
      moves[move]?.flags &&
      moves[move]!.flags!.sound === 1
    ) {
      moveType = "Water";
    }

    return moveType;
  }

  isMoveStrongEnough(move: string) {
    const moveProperties = moves[move];

    return (
      moveProperties &&
      moveProperties.category !== "Status" &&
      (Number(moveProperties.basePower || 0) >= 40 ||
        moveProperties.multihit ||
        moveProperties.basePowerCallback ||
        moveProperties.onModifyMove)
    );
  }

  // Tells you the effectiveness of a move against a type
  // For status and weak moves, this function will return undefined
  moveAgainstType(
    move: string,
    typeAgainst: string,
    pokemon: string,
    ability?: string,
  ) {
    const moveType = this.moveType(move, pokemon, ability);

    // BUG: If the user picks freeze-dry or flying press multiple times, it can be exploited
    if (move === "freezedry" && typeAgainst === "Water") {
      return -1;
    } else if (move === "flyingpress") {
      // since flying press is part flying and fighting
      return typechart[typeAgainst].Flying + typechart[typeAgainst].Fighting;
    } /*else if (move === 'thousandarrows' && typeAgainst === 'Ground') {
      return -1
    }*/ else if (this.isMoveStrongEnough(move)) {
      /*
       * Ignore status moves.
       * (status moves don't deal damage. so they don't contribute to type coverage)
       * Ignore moves less than 40 base power (unless it's a multi-hit move).
       */
      return moveType ?
          (typechart[typeAgainst]?.[moveType] ?? undefined)
        : undefined;
    }
  }

  // Assessment of the team's type defence
  // (How good your team is against the 18 different types)
  get typeDefence() {
    if (this.isTeamEmpty) {
      return this.cleanSlate;
    } else {
      // Scoresheet of how good all six pokemon resist a certain type
      let typeDefence = { ...this.cleanSlate };

      for (const type in typeDefence) {
        for (const teamPokemonProperties of this.team) {
          const { name: pokemon, ability, item } = teamPokemonProperties;
          if (pokemon) {
            let score = this.typeAgainstPokemon(type, pokemon, ability, item);
            if (score === 3) {
              score = 2;
            }

            if (score > 1.5) {
              score = 1.5;
            } else if (score < -1.5) {
              score = -1.5;
            }

            typeDefence[type] += score;
          }
        }
      }

      return typeDefence;
    }
  }

  // Assessment of the team's type coverage
  // (How many types are your team's moves supereffective against)
  get typeCoverage() {
    if (this.isTeamEmpty) {
      return this.cleanSlate;
    } else {
      // Scoresheet of how many types your moves are supereffective against
      let typeCoverage = { ...this.cleanSlate };

      for (const teamPokemonProperties of this.team) {
        // for each pokmeon
        const { name: pokemon, ability } = teamPokemonProperties;

        let typesUsed = [];
        let pokemonHasFreezeDry = false;
        let pokemonHasFlyingPress = false;

        for (const i of [1, 2, 3, 4]) {
          //  for each move
          const move = teamPokemonProperties["move" + i];

          if (move && this.isMoveStrongEnough(move)) {
            const moveType = this.moveType(move, pokemon, ability);

            Object.keys(typeCoverage).forEach(type => {
              // for each type
              if (
                // If the move is not a repeated freeze dry
                (!pokemonHasFreezeDry || move !== "freezedry") &&
                // If the move is not a repeated flying press
                (!pokemonHasFlyingPress || move !== "flyingpress") &&
                // If the move's type is not repeated or it's freeze dry or flying rpess
                (!typesUsed.includes(moveType) ||
                  move === "freezedry" ||
                  move === "flyingpress") &&
                // if it's super effective (cuz supereffective is -1)
                this.moveAgainstType(move, type, pokemon, ability) === -1
              ) {
                typeCoverage[type]++;

                if (moveType && this.pokemonType(pokemon).includes(moveType)) {
                  typeCoverage[type]++;
                }
              }
            });

            if (move === "freezedry") {
              pokemonHasFreezeDry = true;
            } else if (move === "flyingpress") {
              pokemonHasFlyingPress = true;
            } else {
              typesUsed.push(moveType);
            }
          }
        }
      }

      return typeCoverage;
    }
  }

  /*************
  SEARCH FILTERS
  *************/

  searchFilters = {
    format: "",
    region: "",
    type: "",
    moves: "",
  };

  get filteredPokemon() {
    const { format, region, type } = this.searchFilters;

    // First filter by format, then type, then region
    return Object.keys(
      filterByFormat(filterByRegion(filterByType({ ...pokedex }))),
    );

    function filterByFormat(pokedex: Pokedex) {
      /* No Filter */

      if (format === "") {
        return pokedex;
      }

      /* Official Pokemon Format Filter */

      let filteredPokedex: Pokedex = {};

      if (format === "Battle Stadium Singles") {
        let banlist = [
          "calyrex",
          "celebi",
          "cosmoem",
          "cosmog",
          "dialga",
          "diancie",
          "eternatus",
          "giratina",
          "groudon",
          "hooh",
          "jirachi",
          "keldeo",
          "kyogre",
          "kyurem",
          "lugia",
          "lunala",
          "magearna",
          "marshadow",
          "melmetal",
          "meltan",
          "mew",
          "mewtwo",
          "necrozma",
          "palkia",
          "rayquaza",
          "reshiram",
          "solgaleo",
          "victini",
          "volcanion",
          "xerneas",
          "yveltal",
          "zacian",
          "zamazenta",
          "zarude",
          "zekrom",
          "zeraora",
          "zygarde",
        ];

        filteredPokedex = { ...pokedex };

        for (const pokemon of banlist) {
          const { otherFormes } = pokedex[pokemon] ?? {};

          // Don't just delete the banned pokemon, delete its other formes
          // E.g. delete giratina, as well as giratinaorigin
          if (otherFormes) {
            otherFormes.forEach(
              otherForme => delete filteredPokedex[otherForme],
            );
          }
          delete filteredPokedex[pokemon];
        }
        return filteredPokedex;
      }

      /* Smogon Singles/Doubles Filter */

      const tierAbbr: Record<string, string> = {
        Uber: "Uber",
        "OU: Over Used": "OU",
        "UU: Under Used": "UU",
        "RU: Rarely Used": "RU",
        "NU: Never Used": "NU",
        PU: "PU",
        ZU: "ZU",
        "Little Cup (LC)": "LC",
        "Doubles Uber": "DUber",
        "Doubles OU": "DOU",
        "Doubles UU": "DUU",
      };

      filteredPokedex = {}; // clear out filteredPokedex

      /* Smogon Singles Filter */

      let smogonSinglesTiers = [
        "Uber",
        "OU",
        "UUBL",
        "UU",
        "RUBL",
        "RU",
        "NUBL",
        "NU",
        "PUBL",
        "PU",
        "ZU",
        "(PU)",
        "NFE",
        "LC Uber",
        "LC",
      ];

      if (smogonSinglesTiers.includes(tierAbbr[format])) {
        return helperFunction(smogonSinglesTiers, "tier");
      } else if (["DUber", "DOU", "DUU"].includes(tierAbbr[format])) {
        /* Smogon Doubles Filter */
        return helperFunction(["DUber", "DOU", "DUU", "(DUU)"], "doublesTier");
      }

      /* Helper Function for Smogon Singles/Doubles Filter */

      function helperFunction(arrayOfTiers: string[], tierType: string) {
        let tierMatched = false;

        for (const tier of arrayOfTiers) {
          // If the tier matches or it's a lower tier
          if (tierAbbr[format] === tier || tierMatched) {
            tierMatched = true;

            // Add all the pokemon from that tier to filteredPokedex
            for (const pokemon in pokedex) {
              if (formats[pokemon] && formats[pokemon][tierType] === tier) {
                filteredPokedex[pokemon] = pokedex[pokemon];
              }
            }
          }
        }

        return filteredPokedex;
      }

      return filteredPokedex;
    }

    function filterByRegion(pokedex: Pokedex) {
      if (region) {
        const regionNumberRange: Record<string, [number, number]> = {
          Kanto: [1, 151],
          Johto: [152, 251],
          Hoenn: [252, 386],
          Sinnoh: [387, 493],
          Unova: [494, 649],
          Kalos: [650, 721],
          Alola: [722, 809],
          Galar: [810, 898],
          Hisui: [899, 905],
          Paldea: [906, 1025],
        };
        const range = regionNumberRange[region];
        let filteredPokedex: Pokedex = {};

        // Only return pokemon from a certain region based on pokedex number
        for (const [pokemon, pokemonProperties] of Object.entries(pokedex)) {
          const num = pokemonProperties.num;
          if (
            num !== undefined &&
            num >= range[0] &&
            num <= range[1] &&
            // If Kanto region, remove alola forms
            !(region === "Kanto" && pokemon.includes("alola")) &&
            !(region !== "Galar" && pokemon.includes("galar")) &&
            !(region !== "Paldea" && pokemon.includes("paldea"))
          ) {
            filteredPokedex[pokemon] = pokemonProperties;
          }
        }

        // If Alola region, add alola forms
        if (region === "Alola") {
          for (const [pokemon, pokemonProperties] of Object.entries(pokedex)) {
            if (pokemon.includes("alola")) {
              filteredPokedex[pokemon] = pokemonProperties;
            }
          }
        }
        // If Galar region, add galar forms
        if (region === "Galar") {
          for (const [pokemon, pokemonProperties] of Object.entries(pokedex)) {
            if (pokemon.includes("galar")) {
              filteredPokedex[pokemon] = pokemonProperties;
            }
          }
        }
        // If Hisui region, add hisui forms
        if (region === "Hisui") {
          for (const [pokemon, pokemonProperties] of Object.entries(pokedex)) {
            if (
              pokemon.includes("hisui") ||
              ["dialgaorigin", "palkiaorigin"].includes(pokemon)
            ) {
              filteredPokedex[pokemon] = pokemonProperties;
            }
          }
        }
        // If Paldea region, add paldea forms
        if (region === "Paldea") {
          for (const [pokemon, pokemonProperties] of Object.entries(pokedex)) {
            if (pokemon.includes("paldea")) {
              filteredPokedex[pokemon] = pokemonProperties;
            }
          }
        }

        return filteredPokedex;
      } else {
        return pokedex;
      }
    }

    function filterByType(pokedex: Pokedex) {
      let filteredPokedex: Pokedex = {};

      if (type) {
        for (const [pokemon, pokemonProperties] of Object.entries(pokedex)) {
          // minor bug: cosmetic formes should not be ommitted
          if (
            pokemonProperties.types &&
            pokemonProperties.types.includes(type)
          ) {
            filteredPokedex[pokemon] = pokemonProperties;
          }
        }

        return filteredPokedex;
      } else {
        return pokedex;
      }
    }
  }

  get filteredPokemonNames() {
    return this.filteredPokemon.map(pokemon => this.pokemonName(pokemon));
  }

  /*******
  SNACKBAR
  *******/

  isSnackbarOpen = false;
  snackbarMsg = "";

  openSnackbar(msg: string) {
    this.isSnackbarOpen = true;
    this.snackbarMsg = msg;
  }
}

// let store = window.store = new Store() // FOR DEBUGGING

// autorun(() => console.log(store.teamTypes))

export default new Store();
