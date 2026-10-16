// A change is a sentence, or one that ends by crediting a linked person
export type Change =
  string | { text: string; credit: string; href: string; end?: string };

export type Entry = { date: string } & (
  | { changes: Change[] } // A single change is a paragraph; more are a bulleted list
  | { paragraphs: Change[] } // Entries before Sep 19, 2026 are paragraphs, however many
);

const entries: Entry[] = [
  {
    date: "Oct 16, 2026",
    changes: [
      "Sort moves by name or type from the move dropdown itself.",
      "Shiny and Hidden Power no longer reset IVs or DVs needlessly, e.g. unticking Shiny in Gen 2.",
    ],
  },
  {
    date: "Oct 15, 2026",
    changes: [
      "Added Legends: Z-A, with its own Pokémon, moves and items, e.g. Mega Dragonite.",
      "New CAP format in Gen 9, e.g. Syclant.",
      "New Viable items filter hides rarely useful items, e.g. Oran Berry.",
      "The team checklist has a Trapper role, e.g. Shadow Tag, and a singles or doubles setting.",
      "Team analysis, random sets and checklist hints respect format bans, e.g. Spore in OU.",
      "Primal weather and Delta Stream now apply to both sides, e.g. Primal Groudon is immune to Water.",
      "Fixed more type scores, e.g. Ice Beam and Freeze-Dry no longer count Dragon twice.",
      "The checklist counts more moves correctly, e.g. Tidy Up as a boosting move.",
      "Format lists and sorting are more accurate, e.g. Doubles OU includes Clefairy.",
      "Moves and abilities match each game more closely, e.g. Bloodmoon Ursaluna no longer learns Play Rough.",
      "Switching games keeps more of a team, e.g. Silvally-Fairy’s Fairy Memory in Gen 9.",
      "Showdown imports handle more teams, e.g. a box of more than six splits into teams.",
      "Hidden Power changes fewer custom IVs, e.g. keeping 0 Speed for Trick Room.",
      "Sprites load on networks that block Pokémon Showdown, such as schools’.",
      "Sprites can stop animating, from More’s Accessibility section.",
      "Links and saved teams name anything a data update removed from them.",
      "Japanese and Chinese dropdowns find full-width and hiragana input, e.g. ぴかちゅう.",
      "Fixed bugs that lost teams or details, e.g. reloading a Let’s Go team.",
      "Better keyboard and screen reader support, e.g. moving slots on phones.",
    ],
  },
  {
    date: "Oct 14, 2026",
    changes: [
      "Team analysis lists the rules a team breaks, e.g. Levitate on Gen 9 Gengar.",
      "Checklist roles show which Pokémon fill them, e.g. Gigalith: Stealth Rock.",
      "New Priority Move role in the team checklist, e.g. Sucker Punch.",
      "Twenty-one more Pokémon are animated, e.g. Great Tusk.",
      "Matrix Analysis notes the type Conversion gives, e.g. Ghost for Porygon-Z.",
      "Edit Pokepaste lists the parts of the text it can’t use.",
      "The Old website button takes your team along.",
    ],
  },
  {
    date: "Oct 13, 2026",
    changes: [
      "Showdown text keeps each team’s generation.",
      "Generations 6–9 combines all its games’ options, e.g. Levitate and Cursed Body for Gengar.",
      "Links and imports keep moves like Fancy Vivillon’s Weather Ball.",
    ],
  },
  {
    date: "Oct 12, 2026",
    changes: [
      "Generations 6–9, the new default, combines the old website’s Pokémon and moves.",
      "Older Hidden Power links keep their original IVs.",
    ],
  },
  {
    date: "Oct 11, 2026",
    changes: [
      "Added an Old website button to the header.",
      "Links and team text keep more set details, e.g. cleared abilities.",
      "Gen 1–2 DVs and training carry over when changing generations.",
      "Hidden Power’s power follows its IVs before Gen 6.",
    ],
  },
  {
    date: "Oct 10, 2026",
    changes: [
      "Team analysis counts more moves, items and abilities, e.g. Thick Fat no longer makes Dewgong immune to Ice.",
      "The checklist counts more moves correctly, e.g. Yawn as a status move.",
      "The Viable moves filter follows each generation, e.g. Hidden Power Bug for Gen 3 Scizor.",
      "Move pools are more accurate, e.g. Smeargle can pick any move it can Sketch.",
      "Past generations no longer list Pokémon their games lack, e.g. Greninja in Gen 8.",
      "Random teams keep the filters and no longer repeat a species or item.",
      "Changing generations keeps shiny, gender and Hidden Power consistent.",
      "Showdown imports keep Gigantamax sets and older backups.",
      "Fixed bugs that lost edits, e.g. reloading right after a change.",
      "Better keyboard support in dropdowns, e.g. Home and End.",
    ],
  },
  {
    date: "Oct 9, 2026",
    changes: [
      "Team validation follows each game’s abilities and training limits, e.g. 66 total SPs in Champions.",
    ],
  },
  {
    date: "Oct 8, 2026",
    changes: [
      "Team backups save and restore your whole collection.",
      "Training values can be typed beside the sliders.",
      "Stats and move power follow the selected game, e.g. Mega Starmie in Legends: Z-A.",
      "Formes keep their own move pools, e.g. female Indeedee.",
      "Format filters and sorting use the selected generation’s tiers.",
      "Selected moves and items stay visible when filters exclude them.",
      "Switching to Gen 2 keeps shiny Pokémon shiny.",
      "Fixed bugs that lost edits, e.g. when browser storage is full.",
    ],
  },
  {
    date: "Oct 7, 2026",
    changes: [
      "Happiness is kept in Showdown text and saved teams, and can be edited.",
      "Switching generations turns unavailable formes into their base species, e.g. Kyogre-Primal in Gen 3.",
      "Champions Pokémon keep level 50 when switching games.",
      "New Team keeps the selected game and format.",
    ],
  },
  {
    date: "Oct 6, 2026",
    changes: [
      "Nicknames follow each game’s character limit.",
      "Hidden Power sets matching IVs or DVs.",
      "A move can’t be picked twice, including two Hidden Powers.",
      "Changing generations converts training values, e.g. EVs to Champions SPs.",
      "Gen 2–4 Pokémon play their game’s sprite animation.",
      "Set details follow each generation’s rules, e.g. DVs in Gen 1–2.",
      "Pokédex entries show each generation’s stats, e.g. Pidgeot’s old Speed.",
    ],
  },
  {
    date: "Oct 5, 2026",
    changes: [
      "Shiny Pokémon use shiny sprites.",
      "Changing generations previews what changes, with options to cancel, adjust or copy.",
      "Filters are saved for each team.",
      "Sort moves by name or type.",
      "Formats follow the selected generation, including past tiers.",
      "Fixed more type matchups, e.g. Scrappy lets Normal moves hit Ghost.",
      "New tabs start a fresh team, and links open the matching saved team.",
    ],
  },
  {
    date: "Oct 1, 2026",
    changes: [
      "Send feedback from the site, with a screenshot or your own images.",
      "Drag slots to reorder your team.",
      "Earlier generations use their own types, type chart and sprites, e.g. Clefable is Normal before Gen 6.",
    ],
  },
  {
    date: "Sep 26, 2026",
    changes: [
      "The site is now in nine more languages, such as Japanese and French; pick one beside the generation.",
    ],
  },
  {
    date: "Sep 25, 2026",
    changes: [
      "Save several teams and switch between them from Teams.",
      "Set each Pokémon’s nickname, level, nature, EVs, IVs and more.",
      "Pick a generation, from Gen 1 to Gen 9.",
      "New Matrix Analysis shows how every type hits each Pokémon.",
      "Sort the Name dropdown, e.g. by base stats, and filter it by ability.",
      "A sprite’s info button shows a Pokémon’s types, abilities, stats and weaknesses.",
      "Randomize slots or the team, move Pokémon between slots, and undo or redo.",
      "Check whether a team is legal for its format.",
      "ZUBL Pokémon like Kingdra are listed in PU and above.",
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
      "Fixed missing sprites and icons, e.g. Vivillon-Icy Snow.",
      "Fixed missing abilities and types for cosmetic formes, e.g. Vivillon-Garden.",
      "CAP Pokémon like Syclant are no longer listed, but still load from links.",
    ],
  },
  {
    date: "Sep 19, 2026",
    changes: [
      "New Pokemon Champions (M-C) format, replacing Battle Stadium Singles.",
      "The Viable moves filter includes Gen 8–9 moves, e.g. Body Press.",
      "Added moves from Champions, Legends: Z-A, Legends: Arceus and BDSP, e.g. Meganium’s Dazzling Gleam.",
      "Required items are auto-selected, e.g. Ogerpon’s masks.",
      "Hisuian formes are listed under Hisui only.",
      "Nine Legends: Z-A megas are animated, e.g. Mega Dragonite.",
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
