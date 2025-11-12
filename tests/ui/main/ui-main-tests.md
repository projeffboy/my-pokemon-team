This test md file outlines the UI tests for the main section of the website.

Unit tests that interact with certain external UI elements like snackbars are stil considered unit tests.

Each table below is ordered, where each subsequent row is a subsequent set of action(s) and expectation(s).

Integration tests for the pokemon cards component is not necessary, because pretty much all the other integration tests involve pokmeon cards in some way.

# Components in the Main Section to Be Tested

## Team Viewer

### Unit Tests

- [Small/medium viewport] Expect each team viewer slot to have a question mark sprite.
- [Small/medium viewport] Expect the first team viewer slot to be selected.
- [Large viewport] team viewer does not exist

### Integration Tests

- [Small viewport]:

  | Actions                  | Expectations                                                                                                                                                  |
  | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | Select pokemon Totodile. | Team viewer slot 1 should have that pokemon's sprite.                                                                                                         |
  | Select slot 3.           | <ul><li>Slot 1: not selected, Totodile sprite</li><li>Slot 3: selected, question mark sprite</li><li>Pokemon card: question mark sprite, empty name</li></ul> |
  | Select slot 2.           | slot 2 is selected.                                                                                                                                           |
  | Select slot 1.           | slot 1 is selected with Totodile sprite, and pokemon card has Totodile question mark sprite and name.                                                         |

- [Medium viewport]:

  | Actions                                                                    | Expectations                                                                                                                                                                                                   |
  | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | Select team viewer slot 3-4.                                               | Slot 3-4 is selected.                                                                                                                                                                                          |
  | For pokemon card 1, select pokemon Elekid and choose move "Thunder Shock". | <ul><li>Slot 1-2: not selected, question mark sprite</li><li>Slot 3-4: selected, first sprite is elekid, second sprite is question mark</li></ul>                                                              |
  | Select slot 5-6.                                                           | <ul><li>Slot 3-4: not selected, Elekid and question mark sprite</li><li>Slot 5-6: not selected, two question mark sprites</li><li>Pokemon cards: both empty name, empty moves, question mark sprites</li></ul> |
  | Select slot 3-4.                                                           | <ul><li>Slot 3-4: selected, Elekid and question mark sprite</li><li>Pokemon card 1: Elekid name and sprite, has "Thunder Shock" move</li></ul>                                                                 |
  | For pokemon card 2, select Kangaskhan.                                     | Slot 3-4 has Elekid and Kangaskhan sprites.                                                                                                                                                                    |

## Pokemon Card

### Unit Tests

- Depending on the viewport width size, expect the right number of pokemon cards:

  - small: 1
  - medium: 2
  - large: 6

- For every pokemon card, expect:

  - all the fields are empty
  - these pokemon are in the "Name" dropdown list:
    - Pikachu
    - Crobat
    - Blaziken-Mega
    - Garchomp
    - Serperior
    - Talonflame
    - Mimikyu
    - Corviknight
    - Sprigatito
  - the sprite is a question mark
  - there are no moves or abilities to select (since no pokemon selected)
  - these items are in the "Item" dropdown list:
    - Focus Sash
    - Choice Scarf
    - Life Orb
    - Leftovers
    - Assault Vest
    - Lum Berry
    - Clear Amulet
    - Sitrus Berry
    - Choice Band
    - Choice Specs
    - Heavy-Duty Boots
    - Covert Cloak
    - Iron Crown
    - Pecharunt

- Filling in the details of a normal pokemon:

  1. Select pokemon Chespin. Give it Aerial Ace for all four moves. Give it an item of "Apricot Berry". Choose ability "Bulletproof". Expect all the details that you filled in to be present, as well as Chespin's sprite.
  2. Remove the pokemon. Expect all of its details in step 1 to be gone.

- Selecting a pokemon that has a required item and only one ability:
  1. Select pokemon Pinsir-Mega. Expect it to have item "Pinsirite" and ability "Aerilate".

## Team Defence

### Unit Tests

- All 18 types are there and that they are all set to a score of 0.
- Hovering over Dark type shows a popover with "First Select a Pokemon"

### Integration Tests

- Score of a single-type pokemon:

  1. Select pokemon Porygon2. Expect that:
     - the team defence coverage is:
       - -1 for Fighting
       - +1.5 for Ghost
       - 0 for all other types
     - hovering over each type shows that:
       - Fighting does 2x
       - Ghost does 0x
       - all other types do 1x

- Score of a dual-type pokemon:

  1. Select pokemon Whiscash. Expect that:
     - the team defence coverage is:
       - +1.5 for Electric
       - -1.5 for Grass
       - +1 for Fire, Poison, Rock, Steel
       - -1 for Ice
       - 0 for all other types
     - hovering over each type shows that:
       - Electric does 0x
       - Grass does 4x
       - Fire, Poison, Rock, Steel do 0.5x
       - Ice does 2x
       - all other types do 1x

- Score of the two previous pokemon combined:

  1. Select both pokemon from the previous two tests. Expect that:
     - the team defence coverage is:
       - +1.5 for Electric, Ghost
       - -1 for Fighting
       - +1 for Fire, Poison, Rock, Steel
       - -1.5 for Grass
       - 0 for all other types
     - hovering over each type shows that:
       - Electric does 0x to Whiscash and 1x to Porygon2
       - Fighting does 2x to Porygon2 and 1x to Whiscash
       - Fire does 0.5x to Whiscash and 1x to Porygon2
       - Ghost does 0x to Porygon2 and 1x to Whiscash
       - Grass does 1x to Porygon2 and 4x to Whiscash
       - Poison, Rock, Steel do 1x to Porygon2 and 0.5x to Whiscash
       - all other types do 1x to both pokemon

- Score of a Pokemon with an ability that helps it resist a type:

  1. Select Snorlax with ability Thick Fat. Expect that:
     - the team defence coverage is:
       - -1 for Fighting
       - +1 for Fire, Ice
       - +1.5 for Ghost
       - 0 for all other types
     - hovering over each type shows that:
       - Fighting does 2x
       - Fire, Ice do 0.5x
       - Ghost does 0x
       - all other types do 1x

- Score of a Pokemon with an ability that makes it immune to a type:

  1. Select Heatran with ability Flash Fire. Expect that:
     - the team defence coverage is:
       - +1.5 for Bug, Fairy, Fire, Grass, Ice, Poison, Steel
       - +1 for Dragon, Flying, Normal, Psychic
       - -1 for Fighting, Water
       - -1.5 for Ground
       - 0 for Dark, Electric, Ghost, Rock
     - hovering over each type shows that:
       - Bug, Fairy, Grass, Ice, Poison, Steel do 0.5x
       - Fire does 0x
       - Dragon, Flying, Normal, Psychic do 1x
       - Fighting, Water do 2x
       - Ground does 4x
       - Dark, Electric, Ghost, Rock do 1x

## Team Type Coverage

### Unit Tests

- All 18 types are there and that they are all set to a score of 0.
- Hovering over Dark type shows a popover with "First Select a Pokemon"

### Integration Tests

- One normal move:
  1. Select Meowth with move Scratch. Expect that:
     - the team type coverage is 0 for all types
     - hovering of each type shows that nothing is super effective against that type
- One non-normal non-STAB move:
  1. Select Absol with move Fire Blast. Expect that:
     - the team type coverage is:
       - +1 for Bug, Grass, Ice, Steel
       - 0 for all other types
     - hovering over each type shows that:
       - Fire Blast from Absol is super effective against Bug, Grass, Ice, and Steel
- One non-normal STAB move:
  1. Select Kingler with move Crabhammer. Expect that:
     - the team type coverage is:
       - +2 for Fire, Ground, Rock
       - 0 for all other types
     - hovering over each type shows that:
       - Crabhammer from Kingler is super effective against Fire, Ground, and Rock
- Four moves (including status move):
  1. Select Psyduck with Aerial Ace, Attract, Blizzard, Bubble Beam. Expect that:
     - the team type coverage is:
       - +3 for Ground
       - +2 for Fire, Grass, Rock
       - +1 for Bug, Dragon, Fighting, Flying
       - 0 for all other types
     - hovering over each type shows that:
       - Aerial Ace from Psyduck is super effective against Bug, Fighting, and Grass
       - Blizzard from Psyduck is super effective against Dragon, Flying, Grass, and Ground
       - Bubble Beam from Psyduck is super effective against Fire, Ground, and Rock
- Two special moves
  1. Select Hawlucha with move Flying Press and Glalie with Freeze Dry. Expect that:
     - the team type coverage is:
       - +4 for Grass
       - +2 for Dark, Dragon, Fighting, Flying, Ground, Ice, Normal, Water
       - 0 for all other types
     - hovering over each type shows that:
       - Flying Press from Hawlucha is super effective against Dark, Fighting, Grass, Ice, and Normal
       - Freeze-Dry from Glalie is super effective against Dragon, Flying, Grass, Ground, and Water
- Special ability
  1. Select Gardevoir-Mega with ability Pixilate and move Hyper Voice. Expect that:
     - the team type coverage is:
       - +2 for Dark, Dragon, Fighting
       - 0 for all other types
     - hovering over each type shows that:
       - Hyper Voice from Gardevoir-Mega is super effective against Dark, Dragon, and Fighting
- Special Pokemon, Item, and Move:
  1. Select Arceus-Dark with item Dread Plate, ability Multitype, and move Judgment. Expect that:
     - the team type coverage is:
       - +2 for Ghost, Psychic
       - 0 for all other types
     - hovering over each type shows that:
       - Judgment from Arceus-Dark is super effective against Ghost and Psychic
- Two STAB moves, one weak move, one non-normal status move:
  1. Select Dedenne with moves Nuzzle, Play Rough, Dazzling Gleam, Rain Dance. Expect that:
     - the team type coverage is:
       - +2 for Dark, Dragon, Fighting
       - 0 for all other types
     - hovering over each type shows that:
       - Play Rough and Dazzling Gleam from Dedenne are super effective against Dark, Dragon, and Fighting
       - Nuzzle from Dedenne is not super effective against any type
       - Rain Dance from Dedenne is not super effective against any type

## Filters

### Integration Tests

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

  1. Select pokemon Muk-Alola:
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

## Team Checklist

### Unit Tests

Expect no checkmarks.

### Integration Tests

#### Single Checkmark

| Pokemon     | Move         | Item         | Team Checklist Item |
| ----------- | ------------ | ------------ | ------------------- |
| Garchomp    | Stealth Rock | N/A          | Entry Hazard        |
| Corviknight | Defog        | N/A          | Spinner/Defogger    |
| Toxapex     | Recover      | N/A          | Reliable Recovery   |
| Blissey     | Heal Bell    | N/A          | Cleric              |
| Garchomp    | Stealth Rock | N/A          | Status Move         |
| Corviknight | Whirlwind    | N/A          | Phazer              |
| Dragonite   | Dragon Dance | N/A          | Boosting Move       |
| Tapu Koko   | Volt Switch  | N/A          | Volt-turn Move      |
| Garchomp    | N/A          | Choice Scarf | Choice Item         |

#### All Checkmarks

Select all 6 pokemon, along with their corresponding moves and items, mentioned in the "Single Checkmark" section. Expect all the team checklist items to have a checkmark.

### Save/Load Team: Import/Export Team

#### Unit Tests

- Pressing the "Import/Export Team" button opens up a dialog box with an empty text area with the placeholder "Pokemon Showdown Team Raw Text"

#### Integration Tests

##### Import Team

Each test case begins with: 1. Go to the "Save/Load Team" tab and press the "Import/Export Team" button.

- Manually fill in a pokemon

  2. In the "Pokemon Showdown Team Raw Text", type Gigalith.
  3. Press "Update". Expect that Gigalith shows up in the first card as a selected pokemon.

- Paste in a pokemon's details

  2. In the "Pokemon Showdown Team Raw Text", paste this in:

  ```
  Weepinbell @
  Ability: Chlorophyll
  -Acid Spray
  -Bug Bite
  -
  -
  ```

  3. Press "Update". Expect that the pokemon shows up in the first card with the details mentioned in step 1.

##### Export Team

- Export two pokemon

  1. Select Hypno.
  2. Select Uxie with item Leftovers and move Psychic.
  3. Go to the "Save/Load Team" tab and press the "Import/Export Team" button.
  4. In the Pokemon Showdown Team Raw Text, this should be present:

  ```
  Hypno @
  Ability:
  -
  -
  -
  -

  Uxie @ Leftovers
  Ability: Levitate
  -Psychic
  -
  -
  -


  ```

##### Import/Export Team

Press "Import/Export Team" in the "Save/Load Team" tab.

- Paste in an entire team and make edits to it

  1. Go to the "Save/Load Team" tab and press the "Import/Export Team" button.
  2. In the "Pokemon Showdown Team Raw Text", paste this in:

  ```
  Tyranitar @ Smooth Rock
  Ability: Sand Stream
  Tera Type: Flying
  EVs: 252 HP / 16 Def / 240 SpD
  Sassy Nature
  - Knock Off
  - Ice Beam
  - Stealth Rock
  - Thunder Wave

  Excadrill @ Life Orb
  Ability: Sand Rush
  Tera Type: Ground
  EVs: 252 Atk / 4 Def / 252 Spe
  Adamant Nature
  - Earthquake
  - Rock Slide
  - Rapid Spin
  - Swords Dance

  Kingambit @ Black Glasses
  Ability: Supreme Overlord
  Tera Type: Dark
  EVs: 92 HP / 252 Atk / 164 Spe
  Adamant Nature
  - Kowtow Cleave
  - Sucker Punch
  - Iron Head
  - Swords Dance

  Garchomp @ Loaded Dice
  Ability: Rough Skin
  Tera Type: Fire
  EVs: 252 Atk / 4 SpD / 252 Spe
  Jolly Nature
  - Scale Shot
  - Earthquake
  - Fire Fang
  - Swords Dance

  Pecharunt @ Air Balloon
  Ability: Poison Puppeteer
  Tera Type: Grass
  EVs: 252 HP / 252 Def / 4 SpD
  Bold Nature
  IVs: 0 Atk
  - Malignant Chain
  - Shadow Ball
  - Parting Shot
  - Recover

  Rotom-Wash @ Leftovers
  Ability: Levitate
  Tera Type: Steel
  EVs: 252 HP / 212 Def / 44 Spe
  Bold Nature
  IVs: 0 Atk
  - Hydro Pump
  - Volt Switch
  - Pain Split
  - Will-O-Wisp
  ```

  2. Replace Hydro Pump for Rotom-W with Surf.
  3. Press "Update". Expect that all pokemon and their details mentioned in step 1 show up in the cards.

### Save/Load Team: Copy Team

#### Unit Tests

- Pressing the "Copy Team" button copies empty text to your clipboard, while a snackbar pops out and says "Empty team, nothing to copy".

#### Integration Tests

1. Select pokemon Pikachu and the move "Thunderbolt".
2. Pressing the "Copy Team" button copies this to your clipboard:

```
Pikachu @
Ability:
-Thunderbolt
-
-
-
```

While a snackbar pops out and says "Empty team, nothing to copy".
