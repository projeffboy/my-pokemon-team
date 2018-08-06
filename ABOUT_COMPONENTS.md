-------------------------------------------------------------------------
integration-react-select.js (<IntegrationReactSelect />)
Code copied from  UI.
Basically, it is a text field with dropdown option.

  |
  V

pokemon-input.js (<PokemonInput />)
Returns a text field with a dropdown (from integration-react-select.js).

sprite.js (<Sprite />)
Returns the Pokemon's sprite.
-------------------------------------------------------------------------

  |
  V

------------------------------------------------
pokemon.js (<Pokemon />)
Contains 8 parts (7 of which are user inputs):
-pokemon name
-pokemon sprite
-item
-4 moves
-ability
Inputs come from pokemon-input.js.
Sprite comes from sprite.js

team-stats.js (<TeamStats />)
Basically a card listing all 18 types
------------------------------------------------

  |
  V

App.js (<App />)
Creates a grid containing 9 cards:
-6 pokemon cards (from pokemon.js)
-3 stats cards (from team-stats.js)

  |
  V

index.js
Just passes code.

  |
  V

index.html
Final product.

integration-react-select is the only component withstyles not in styles.js