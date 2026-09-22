// A change is a sentence, or one that ends by crediting a linked person
export type Change =
  string | { text: string; credit: string; href: string; end?: string };

export type Entry = { date: string } & (
  | { changes: Change[] } // A single change is a paragraph; more are a bulleted list
  | { paragraphs: Change[] } // Entries before Sep 19, 2026 are paragraphs, however many
);

const entries: Entry[] = [
  {
    date: "Sep 21, 2026",
    changes: [
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
