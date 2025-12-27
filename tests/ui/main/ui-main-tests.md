# UI Tests for Main Section

## Guidelines

- This test md file outlines the UI tests for the main section of the website.
- Test scenarios that are implicitly covered by E2E testing are not covered here
- Tests that only interact with snackbars, which is an external UI element, are still considered unit tests.
- Each section below has its own folder with two test files: `tests/ui/<section>/(unit|integration)-tests.spec.js`

## Components in the Main Section to Be Tested

### Team Tabs

#### Unit Tests

- [Small/medium viewport] Expect each team slot tab to have a question mark sprite.
- [Small/medium viewport] Expect the first team slot tab to be selected.
- [Large viewport] team tabs do not exist

### Pokemon Card

#### Unit Tests

- For every pokemon card, expect:

  - the fields are empty
  - the sprite is a question mark
  - there are no moves or abilities to select (since no pokemon selected)

### Team Defence

#### Unit Tests

- All 18 types are there and that they are all set to a score of 0.
- Hovering over Dark type shows a popover with "First Select a Pokemon"

### Integration Tests

- Score of a Pokemon with an ability that helps it resist a type:

  1. Select Snorlax with ability Thick Fat. Expect that:
     - the Fire, Ice score is +1
     - hovering over Fire, Ice show that they do 0.5x

- Score of a Pokemon with an ability that makes it immune to a type:

  1. Select Rotom-Wash with ability Levitate. Expect that:
     - the Ground score is +1.5
     - hovering over Ground shows that it does 0x

### Team Type Coverage

#### Unit Tests

- All 18 types are there and that they are all set to a score of 0.
- Hovering over Dark type shows a popover with "First Select a Pokemon"

### Integration Tests

- Special Move:
  1. Select Glalie with Freeze Dry. Expect that:
     - the Water score is +2
     - hovering over Water shows that Freeze-Dry from Glalie is super effective
- Special ability
  1. Select Gardevoir-Mega with ability Pixilate and move Hyper Voice. Expect that:
     - the Dark, Dragon, Fighting score is +2
     - hovering over Dark, Dragon, Fighting shows that Hyper Voice from Gardevoir-Mega is super effective
- Special Pokemon, Item, and Move:
  1. Select Arceus-Dark with item Dread Plate, ability Multitype, and move Judgment. Expect that:
     - the Ghost, Psychic score is +2
     - hovering over Ghost, Psychic shows that Judgment from Arceus-Dark is super effective
- One weak move, one non-normal status move:
  1. Select Dedenne with moves Nuzzle and Rain Dance. Expect that:
     - the score is 0 for Flying, Water
     - hovering over Flying, Water shows that nothing is super effective

### Filters

#### Integration Tests

- Format

  1. Select format OU
     - Pokemon that can be selected:
       - Meowth
       - Landorus-Therian
       - Regigigas
     - Pokemon that can't be selected:
       - Landorus
       - Arceus
       - Dracovish

- Type

  1. Select type electric
     - Pokemon that can be selected:
       - Pichu
       - Pikachu
       - Raichu
       - Electabuzz
       - Vikavolt
       - Tapu Koko
     - Pokemon that can't be selected:
       - Larvitar
       - Corphish
       - Reshiram

- Region

  1. Select region Kalos
     - Pokemon that can be selected:
       - Chespin
       - Greninja
       - Litleo
       - Volcanion
     - Pokemon that can't be selected:
       - Bulbasaur
       - Pikachu
       - Rowlet

- Moves

  1. Select only viable moves.
  2. Select pokemon Muk-Alola:
     - Moves that can be selected:
       - Crunch
       - Toxic
       - Stone Edge
       - Flamethrower
     - Moves that can't be selected:
       - Dig
       - Attract
       - Hyper Beam
       - Poison Fang

- All filters

  1. Select format UU, type Grass, region Sinnoh, moves "Viable".
     - Pokemon that can be selected:
       - Torterra
     - Pokemon that can't be selected:
       - Chespin
       - Pikachu
       - Clefable
  2. Select pokemon Torterra:
     - Moves that can be selected:
       - Earthquake
       - Wood Hammer
       - Stealth Rock
       - Synthesis
     - Moves that can't be selected:
       - Attract
       - Splash
       - Celebrate
       - Confide

### Team Checklist

#### Unit Tests

Expect no checkmarks.

#### Integration Tests

Each (non-header) row is its own test:

| Pokemon     | Move         | Item         | Team Checklist Item |
| ----------- | ------------ | ------------ | ------------------- |
| Garchomp    | Stealth Rock | N/A          | Entry Hazard        |
| Corviknight | Defog        | N/A          | Spinner/Defogger    |
| Toxapex     | Recover      | N/A          | Reliable Recovery   |
| Blissey     | Heal Bell    | N/A          | Cleric              |
| Toxapex     | Toxic        | N/A          | Status Move         |
| Skarmory    | Whirlwind    | N/A          | Phazer              |
| Dragonite   | Dragon Dance | N/A          | Boosting Move       |
| Tapu Koko   | Volt Switch  | N/A          | Volt-turn Move      |
| Garchomp    | N/A          | Choice Scarf | Choice Item         |

#### Save/Load Team: Import/Export Team

##### Integration Tests

Each test case begins with: 1. Go to the "Save/Load Team" tab and press the "Import/Export Team" button.

- Manually fill in a pokemon

  2. In the "Pokemon Showdown Team Raw Text", type Gigalith.
  3. Press "Update". Expect that Gigalith shows up in the first card as a selected pokemon.

- Paste in a pokemon's details

  2. In the "Pokemon Showdown Team Raw Text", paste this in:

  ```
  Weepingbell @
  Ability: Chlorophyll
  -Acid Spray
  -Bug Bite
  -
  -
  ```

  3. Press "Update". Expect that the pokemon shows up in the first card with the details mentioned in step 1.

#### Save/Load Team: Copy Team

##### Unit Tests

- Pressing the "Copy Team" button copies empty text to your clipboard, while a snackbar pops out and says "Empty team, nothing to copy".

##### Integration Tests

1. Select pokemon Pikachu and the move "Thunderbolt".
2. Pressing the "Copy Team" button copies this to your clipboard:

```
Pikachu @
Ability:
- Thunderbolt
-
-
-
```

While a snackbar pops out and says "Empty team, nothing to copy".
