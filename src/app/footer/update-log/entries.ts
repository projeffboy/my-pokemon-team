// A change is a sentence, or one that ends by crediting a linked person
export type Change =
  string | { text: string; credit: string; href: string; end?: string };

export type Entry = { date: string } & (
  | { changes: Change[] } // A single change is a paragraph; more are a bulleted list
  | { paragraphs: Change[] } // Entries before Sep 19, 2026 are paragraphs, however many
);

const entries: Entry[] = [
  {
    date: "Oct 8, 2026",
    changes: [
      "Team backups now save your complete collection, including names, games, filters, and Pokémon details, and restore it without replacing current teams.",
      "A failed browser save now shows a message in Teams, with backups available to keep unsaved work.",
      "Deleting a team in another tab now closes its open details editor and deletion confirmation, preserving the remaining teams.",
      "Training values can now be typed directly alongside the sliders, including EVs, SPs, and older games' Stat experience.",
      "Slot controls now give Random, More details, and Info separate touch targets on small screens.",
      "Feedback screenshots capture faster in Safari, and stalled image downloads no longer stay pending.",
      "Keyboard navigation in dropdowns now reaches off-screen options reliably, including Home and End.",
      "Pokémon stats and move power now follow the selected game, e.g. Mega Starmie in Legends: Z-A and Absorb in Let’s Go.",
      "Weaknesses now show exact Dry Skin multipliers, such as Parasect taking five times Fire damage.",
      "Iron Ball and Ring Target now change type matchups correctly, and Judgment follows the held Plate.",
      "Natural Gift now counts for coverage when a berry is held, and Techno Blast and Multi-Attack follow the held item.",
      "Distinct forms now keep their own move pools, e.g. female Indeedee no longer inherits male-only moves.",
      "The team checklist now follows historical move rules, such as Defog not removing your hazards in Gen 4–5.",
      "Historical imports now choose the correct ability, e.g. Levitate for Gen 4 Gengar.",
      "Gen 1–2 transfers now preserve linked DVs and shared Special training, including Gen 2 shiny and gender traits.",
      "Gen 2 Hidden Power now keeps its type when transferred to newer generations.",
      "Undo history now resets when another tab updates the current team.",
      "Shared team links opened while move data is loading now keep their moves.",
      "Filtering a Pokémon dropdown no longer scrolls to a stale row from its previous options.",
      "Team text and format transfers now keep edits from other tabs, and deleting an edited team no longer overwrites its replacement.",
      "Unsaved team edits no longer revert when browser storage is full, and the app stays usable when storage is blocked.",
      "Choosing between identical saved teams now remembers the selected team.",
      "Randomizing a slot now gets its own Undo step.",
      "Feedback now keeps a reopened draft when an earlier send finishes, and overlapping image uploads retain all attachments.",
      "Thick Fat now shows one-eighth Ice damage for Pokémon such as Walrein.",
      "Darmanitan-Galar-Zen now includes its regional moves, such as Icicle Crash.",
      "Coverage now uses historical move power, such as 20-power Leech Life in Gen 6.",
      "Format filters and sorting now use the selected generation's tiers.",
      "Ceaseless Edge and Belly Drum now count toward the team checklist.",
      "Switching generations no longer opens an empty confirmation for Pokémon with default stats.",
      "Switching to Gen 2 now keeps shiny Pokémon shiny and previews required gender changes.",
      "Fixed early team selections being cleared when Pokémon data finished loading afterward.",
      "Selected moves, items and abilities now stay visible when filters or the selected generation exclude them, e.g. Attract with the Viable moves filter.",
    ],
  },
  {
    date: "Oct 7, 2026",
    changes: [
      "Happiness is now kept in Showdown imports, exports and saved teams, with an editor for games that support it.",
      "Unavailable formes now convert to their base species when switching generations, e.g. Kyogre-Primal becomes Kyogre in Gen 3.",
      "Champions Pokémon now keep level 50 when switching to another game.",
      "New Team now keeps the selected game and format when reusing an empty saved team.",
    ],
  },
  {
    date: "Oct 6, 2026",
    changes: [
      "Nicknames now follow the games' character limits, with shortening previewed when switching to a game with a lower limit.",
      "Selecting or randomizing Hidden Power now sets matching IVs or DVs when the current spread produces a different type.",
      "Move selection and randomization now prevent duplicate moves, including multiple Hidden Power types; randomization counts Hidden Power as one move choice.",
      "Generation changes now convert training values, including EVs to Champions SPs, instead of clearing compatible spreads.",
      "Gen 2–4 Pokémon play their original game sprite animation on page load and when selected.",
      "Set details and randomization now follow generation rules, including Gen 1–2 DVs and separate Legends and Let’s Go editors.",
      "More details now uses SPs without IVs for Pokémon Champions, and only shows Tera Type for regular Gen 9 teams.",
      "Pokédex entries now show generation-specific stats and abilities, e.g. Pidgeot's original Speed before Gen 6.",
    ],
  },
  {
    date: "Oct 5, 2026",
    changes: [
      "Shiny Pokémon now use shiny sprites.",
      "Changing generations previews incompatible Pokémon and set details, with options to cancel, adjust the team, or create a copy.",
      "Filters are saved separately for each team.",
      "Sort moves by name or type in either direction.",
      "Format choices now follow the selected generation, including past-generation tiers on Pokemon Showdown.",
      "Fixed more type matchups, including Mind’s Eye, Thousand Arrows, Air Balloon, and forme-dependent moves such as Revelation Dance.",
      "Scrappy now lets Normal and Fighting moves hit Ghost types in the coverage matrix, such as Exploud’s Headbutt.",
      "New tabs start fresh teams. Team links open matching saved teams, or stay unsaved until you edit them.",
    ],
  },
  {
    date: "Oct 1, 2026",
    changes: [
      "Send feedback straight from the site, with a screenshot of the page or your own images attached.",
      "Reorder your team by dragging its slots.",
      "A team in an earlier generation uses that generation's types and type chart, with the sprites of its games: Clefable is a Normal type before Gen 6, and a Gen 1 team shows Red and Blue sprites.",
    ],
  },
  {
    date: "Sep 26, 2026",
    changes: [
      "The site is now in Japanese, Korean, Chinese, French, German, Spanish, and Italian too, with the pokemon, move, item, and ability names from PokeAPI. Pick a language from the button beside the generation.",
      "It is in Brazilian Portuguese as well, with the English names until the games are in Portuguese.",
    ],
  },
  {
    date: "Sep 25, 2026",
    changes: [
      "Save several teams in your browser, each with a name, generation, and format, and switch between them from the Teams button.",
      "Set nicknames, levels, genders, shiny, tera types, natures, EVs, and IVs in each pokemon's Advanced options; they are kept in share links and Showdown text.",
      "Pick a generation, from Gen 1 to Gen 9, to list only the pokemon that existed then.",
      "New Matrix Analysis shows how every type hits, or is hit by, each pokemon.",
      "Sort the Name dropdown by name, pokedex number, format, or base stats, and filter it by ability.",
      "Tap the info button on a sprite for a pokemon's types, abilities, base stats, and weaknesses.",
      "Randomize a slot or the whole team, move pokemon between slots, and undo or redo changes.",
      "Check whether a team is legal for its generation and format from its Name and Format dialog.",
      "ZUBL pokemon like Kingdra are listed in PU and above.",
    ],
  },
  {
    date: "Sep 22, 2026",
    changes: [
      "Fixed some returning visitors seeing the August version of the site.",
    ],
  },
  {
    date: "Sep 21, 2026",
    changes: [
      "Positive type scores are teal, like the checklist.",
      "Links open in a new tab.",
      "The type tiles in Team Defence and Coverage work with the keyboard.",
      "Fixed the missing sprites of 14 formes, like Vivillon-Icy Snow.",
      "Fixed the blank icons of 46 Legends: Z-A mega stones, like Dragoninite.",
      "CAP pokemon like Syclant are no longer listed, but still load from links and imports.",
      "Fixed missing abilities and types for cosmetic formes such as Vivillon-Garden.",
    ],
  },
  {
    date: "Sep 19, 2026",
    changes: [
      "New Pokemon Champions (M-C) format filter, replacing Battle Stadium Singles.",
      "The Viable moves filter includes gen 8 and 9 moves like Body Press and Flip Turn.",
      "Added moves from Pokemon Champions, Legends: Z-A, Legends: Arceus, and BDSP, e.g. Meganium learns Dazzling Gleam.",
      "Required items are auto-selected for primals, crowned formes, Ogerpon masks, Raichu-Mega-Y, and the Mega-Z formes.",
      "Hisuian formes are listed under the Hisui region only.",
      "Nine Legends: Z-A megas are now animated, like Mega Dragonite.",
    ],
  },
  { date: "Sep 17, 2026", changes: ["Added Regulation M-C pokemon."] },
  {
    date: "Sep 5, 2026",
    paragraphs: [
      "Your team is now saved in the page's link, so you can share a team by copying the address. On phones, the share button copies it for you.",
    ],
  },
  {
    date: "Aug 31, 2026",
    paragraphs: [
      "The dropdowns open faster. Venusaur and Charizard sit next to the title to commemorate Worlds 2026.",
    ],
  },
  {
    date: "Aug 28, 2026",
    paragraphs: ["Fixed sprite bugs and updated the Pokemon data."],
  },
  { date: "May 16, 2026", paragraphs: ["Pokemon Legends Z-A update."] },
  {
    date: "May 15, 2024",
    paragraphs: [
      "You can import a Pokemon Showdown team with nicknames, although the nicknames are not saved (Credits: TBD).",
    ],
  },
  {
    date: "February 17, 2024",
    paragraphs: [
      "Moves with variable base power like low kick, grass knot, and heavy slam count towards type coverage again (Credits: Timo).",
    ],
  },
  { date: "February 13, 2024", paragraphs: ["Indigo Disk DLC update."] },
  {
    date: "October 28, 2023",
    paragraphs: [
      "Moves with variable base power like low kick and grass knot now count towards type coverage (this used to work before gen 9).",
    ],
  },
  {
    date: "October 20, 2023",
    paragraphs: ["Teal Mask DLC update moves (Credits: Anonymous)."],
  },
  {
    date: "October 7, 2023",
    paragraphs: [
      "Teal Mask DLC update (Credits: Agame4free).",
      "Selecting Mega Sharpedo doesn't give it Sharp Beak now (Credits: Owen W.).",
    ],
  },
  {
    date: "April 8, 2023",
    paragraphs: ["Added Iron Leaves and Walking Wake (Credits: Meta Maxis)."],
  },
  {
    date: "Feb 14, 2023",
    paragraphs: [
      "Fixed it so that moves with variable power, like low kick, are taken into account towards type coverage once again. (Credits: Jackalupe).",
    ],
  },
  {
    date: "Jan 17, 2023",
    paragraphs: [
      "Mortal spin is treated as a spinner move (Credits: anonymous).",
    ],
  },
  {
    date: "Jan 10, 2023",
    paragraphs: [
      "The Paldea sprites now match the names in the dropdown list (Credits: anonymous).",
    ],
  },
  {
    date: "Dec 18, 2022",
    paragraphs: [
      "Items are updated for gen 9 (Credits: Abner Garcia II).",
      "Fixed a bug where selecting a pokemon whose pre-evolution has a hyphen in their name crashes, like Basculeigon (Credits: anonymous).",
    ],
  },
  {
    date: "Nov 27, 2022",
    paragraphs: [
      "Hisuain form pokemon have proper movesets (Credits: anonymous).",
    ],
  },
  {
    date: "Nov 20, 2022",
    paragraphs: [
      "Sprites weren't working for pokemon of alternate formes, e.g. mega abomasnow (Credits: Cashton Bermingham).",
      "Updated the the site for Pokemon Scarlet and Violet (generation 9). Expect bugs!",
      "Moves with a 100% of inflicting a status condition (e.g. nuzzle) are counted towards the checklist.",
      "Curse is treated as a setup move.",
    ],
  },
  {
    date: "May 1, 2022",
    paragraphs: [
      'Added floral healing and court change to team checklist. Renamed "Switch/Turn Move" to "Volt-turn Move".',
    ],
  },
  {
    date: "Jan 4, 2022",
    paragraphs: ["Liquid voice affects team type coverage."],
  },
  {
    date: "Jan 3, 2022",
    paragraphs: [
      "Fluffy and dry skin affects team defence (Anonymous x2).",
      "Dark mode (to be improved).",
    ],
  },
  {
    date: "Nov 17, 2021",
    paragraphs: [
      "Up until now, moves would not register for type coverage if you had a status or weak move of the same type on the same pokemon (Anonymous).",
    ],
  },
  {
    date: "May 4, 2021",
    paragraphs: [
      "I used the replaceAll() Javascript function which breaks on Samsung browsers (Credits: Anonymous).",
    ],
  },
  {
    date: "Apr 29, 2021",
    paragraphs: [
      "One of the offensive checklist items accepts either U-turn, Volt Switch, or Flip Turn instead of requiring both Volt Switch and U-turn.",
      "Zygarde 10% and Oricorio-Pa'u sprites load properly now.",
      "Florges and Floette don't crash anymore (Vegard Hamborg).",
    ],
  },
  {
    date: "Apr 8, 2021",
    paragraphs: ["The checklist is green for checked items."],
  },
  {
    date: "Mar 31, 2021",
    paragraphs: [
      "Choosing Sirfetch'd used to crash the site (dpplasma1).",
      "Further digging uncovered that the entire Mr. Mime family crashed the site.",
      "Galarian formes no longer take the base forme movesets instead.",
    ],
  },
  {
    date: "Jan 11, 2021",
    paragraphs: [
      "Fixed flying press bug. Updated how galar sprites are presented.",
      {
        text: "Movesets for alola formes no longer take the base forme movesets instead",
        credit: "thouartthee",
        href: "https://www.reddit.com/r/NintendoSwitch/comments/kuhc3d/pokemon_sword_and_shield_teambuilder/giv1p6v?utm_source=share&utm_medium=web2x&context=3",
      },
      {
        text: "Updated type defence so that what was once -2 or 2 is now -1.5 or 1.5",
        credit: "GoneWithLaw",
        href: "https://www.reddit.com/r/stunfisk/comments/kuix21/updated_gen_8_teambuilder_mypokemonteamcom/gitspzk?utm_source=share&utm_medium=web2x&context=3",
      },
    ],
  },
  {
    date: "Jan 10, 2021",
    paragraphs: [
      "Updated the site to accomodate generation 8 pokemon! Slight design tweaks.",
    ],
  },
  {
    date: "Mar 26, 2019",
    paragraphs: [
      {
        text: "Importing Pokemon Showdown teams with gender specified works now",
        credit: "jkelligan",
        href: "https://www.reddit.com/r/stunfisk/comments/az2f34/behold_the_ultimate_teambuilder/ejehmud?utm_source=share&utm_medium=web2x",
      },
    ],
  },
  {
    date: "Mar 10, 2019",
    paragraphs: [
      "Fixed a bug where changing search filters caused some of the selected pokemon names to disappear.",
      {
        text: "Water Bubble gives you +1 for Fire",
        credit: "beyardo",
        href: "https://www.reddit.com/r/stunfisk/comments/az2f34/behold_the_ultimate_teambuilder/ei6m1q0",
      },
      "You can now pick Primal Kyogre and Primal Groudon through the Uber search filter.",
      "Was missing Fairy and Normal in the search filters. They're included now.",
    ],
  },
  {
    date: "Mar 9, 2019",
    paragraphs: [
      "You can now click (as well as hover) over the types for more information. Good for phones.",
      "There's now a type chart button!",
      {
        text: "Fixed a bug where alolan-form pokemon had the movesets of their non-alolan forms",
        credit: "DJdeMaster",
        href: "https://www.reddit.com/r/stunfisk/comments/az2f34/behold_the_ultimate_teambuilder/ei4t5g6",
      },
      {
        text: "The search filter VGC 2018 is updated to VGC 2019",
        credit: "Elmodipus",
        href: "https://www.reddit.com/r/stunfisk/comments/az2f34/behold_the_ultimate_teambuilder/ei4xcwx",
      },
      {
        text: 'Added the "superior" type chart',
        credit: "Bardock_RD",
        href: "http://i.imgur.com/fylyCdC.png",
      },
      {
        text: "The code is now open sourced",
        credit: "Crescive_Delta",
        href: "https://www.reddit.com/r/stunfisk/comments/az2f34/behold_the_ultimate_teambuilder/ei4yxo3",
        end: "!",
      },
    ],
  },
  {
    date: "Mar 8, 2019",
    paragraphs: [
      "Updated the Smogon formats/tiers (for the search filters).",
      "Included a manual page clarifying how to use this site.",
    ],
  },
  {
    date: "Mar 6, 2019",
    paragraphs: ["Super effective STAB moves now count for +2 instead of +1."],
  },
  {
    date: "Feb 25, 2019",
    paragraphs: [
      {
        text: "Fixed a bug where alternate formes had the moveset of their base forme. For example, White Kyurem couldn't learn Fusion Flare",
        credit: "DMSivally",
        href: "https://www.reddit.com/r/pokemon/comments/aumnvh/brand_new_ultra_sun_and_moon_team_builder/eh95wr3",
      },
      {
        text: "Fixing the above bug caused selecting Megas to break the app. This is fixed too now",
        credit: "kwiszat",
        href: "https://www.reddit.com/r/pokemon/comments/aumnvh/brand_new_ultra_sun_and_moon_team_builder/eha3o9p",
      },
    ],
  },
];

export default entries;
