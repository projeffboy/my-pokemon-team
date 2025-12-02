# E2E Tests

## Guidelines

- This test md file outlines the E2E tests for this site.
- Get the viewport sizes from tests/helper.js
- each test gets its own file under tests/e2e

## Tests

1. Creating a casual team

   0. Viewport: small
   1. Create team manually from sample-teams/casual-team.txt

2. Importing an OU team

   0. Viewport: medium/large
   1. import team from sample-teams/ou-team.txt
   2. do the basic check
   3. delete garchomp
   4. do the basic check
   5. Set the filter to OU
   6. in Garchomp's place, add this manually:

```
Ogerpon-Wellspring (F) @ Wellspring Mask
Ability: Water Absorb
EVs: 252 Atk / 4 SpD / 252 Spe
Tera Type: Water
Jolly Nature
- Ivy Cudgel
- U-turn
- Knock Off
- Spikes
```

    7. Do the basic check
    8. Press the "Copy Team" button and check that these are there:
       - Iron Moth with Discharge
       - Glimmora with Focus Sash
       - Dragonite with Multiscale
    9. Press "Save/Load Team" tab, then press "Import/Export Team", then make these modifications:
       - replace Umbreon's ability with Inner Focus
       - replace Umbreon's move Thunder Wave with Toxic
       - replace Gholdengo's move Psyshock with Focus Blast
    10. Do the basic check

## Checks

- Basic check:
  - the team defence and type coverage scores are correct
  - for team defence and team type coverage, pick the same 3 random types, and ensure that the stats in the popper/popover are correct
  - the team checklist is correct
