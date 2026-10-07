// Every string the site shows, in English. The other languages in this folder follow the
// same shape (`Messages`), so a missing or extra key fails the typecheck. Text with links or
// values in the middle holds {placeholders}, which `fill` in src/app/shared/fill.tsx replaces.
// Pokemon, move, item, ability, nature, type, and region names come from
// src/data/translations instead.

const generation = (generation: number) => `Gen ${generation}`;

const en = {
  // The header
  generation,
  generationGames: {
    9: "Scarlet Violet",
    8: "Sword Shield / Brilliant Diamond Shining Pearl",
    7: "Sun Moon / Ultra Sun Ultra Moon",
    6: "X Y / Omega Ruby Alpha Sapphire",
    5: "Black White / Black 2 White 2",
    4: "Diamond Pearl Platinum / HeartGold SoulSilver",
    3: "Ruby Sapphire Emerald / FireRed LeafGreen",
    2: "Gold Silver Crystal",
    1: "Red Blue Yellow",
  },
  generationSelect: "Generation",
  comingSoon: "Coming soon",
  championsGeneration: "Gen 9 · Champions",
  championsGenerationShort: "Gen 9 (Champions)",
  language: "Language",
  languageFailed: "That language could not be loaded. Try again.",
  feedback: {
    button: "Send feedback",
    title: "Send Feedback",
    description: "Found a bug or have an idea? Let me know.",
    label: "Your feedback",
    placeholder: "e.g. Meganium is missing Dazzling Gleam",
    attachLink: "Attach my team link",
    attachScreenshot: "Attach a screenshot of the page",
    addImage: "Add image",
    imageUnreadable: "That image couldn't be read. Try a PNG or JPEG.",
    imagesTooLarge:
      "The images are too large to send together. Remove one first.",
    email: "Your email (optional)",
    emailHelper: "Only if you want a reply",
    caption: "Feedback",
    send: "Send",
    sent: "Thanks! Your feedback was sent.",
    failed: "It couldn't be sent. Try again, or email {email}.",
  },

  // Buttons shared by several dialogs
  cancel: "Cancel",
  close: "Close",
  done: "Done",
  goBack: "Go Back",
  save: "Save",
  reset: "Reset",
  clear: "Clear",
  all: "All",
  any: "Any",
  none: "None",
  nothing: "Nothing",

  // The team column
  team: {
    teams: "Teams",
    randomizedTeam: "Randomized team",
    randomizedPokemon: "Randomized pokemon",
    randomizedPokemonDetails: (details: string) =>
      `Randomized pokemon's ${details.toLowerCase()}`,
    shareTeam: "Share",
    shareTeamLink: "Share pokemon team link",
    teamActions: "Team actions",
    manageTeam: "Manage",
    manageTeamMenu: "Manage team",
    duplicate: "Duplicate",
    copyText: "Copy text",
    editPokepaste: "Edit Pokepaste",
    delete: "Delete",
    importTeam: "Import team",
    share: "Share",
    teamEmpty: "Pokemon team is empty",
    linkCopied: "Pokemon team link copied",
    linkNotCopied: "Could not copy the link.",
    nothingToCopy: "Empty team, nothing to copy.",
    teamCopied: "Team copied.",
    teamNotCopied: "Could not copy the team.",
    cannotDuplicateEmptyTeam: "Cannot duplicate empty team",
    teamDuplicated: "Team duplicated",
    teamDeleted: "Team deleted",
    slots: "Pokemon team slots",
    slot: (slot: number) => `Pokemon ${slot}`,
    slotWith: (slot: number, pokemon: string | undefined) =>
      `Pokemon ${slot} (${pokemon ?? "empty"})`,
    slotPair: (first: string, second: string) => `${first} and ${second}`,
    moreTools: "More team tools",
    fewerTools: "Fewer team tools",
    advancedMode: "Advanced",
    more: "More",
    less: "Less",
    filters: "Filters",
    sort: "Sort",
    random: "Random",
    randomize: "Randomize",
    randomizePokemon: "Randomize pokemon",
    randomizeDetails: (details: string) => `Randomize ${details.toLowerCase()}`,
    randomFor: (slot: number) => `Random pokemon for slot ${slot}`,
    advanced: "More details",
    advancedFor: (slot: number) => `More details for slot ${slot}`,
    about: (pokemon: string) => `About ${pokemon}`,
    dragHint: "Hold and drag to reorder",
    moveToSlot: (pokemon: string) => `Move ${pokemon} to another slot`,
    name: "Name",
    move: "Move",
    item: "Item",
    ability: "Ability",
    // The accessible name of each input, e.g. "Pokemon 1's move2"
    input: (slot: number, property: string) => `Pokemon ${slot}'s ${property}`,
    itemIcon: (item: string) => `${item} icon`,
    nothingFound: "Nothing found",
    selectPokemonFirst: "(you haven't selected a pokemon)",
    list: "List",
    grid: "Grid",
    pokemonInSlot: (pokemon: string, slot: number) =>
      `place ${pokemon} in slot ${slot}`,
    removedPokemon: (pokemon: string, slot: number) =>
      `remove ${pokemon} from slot ${slot}`,
    addedValue: (value: string, pokemon: string) =>
      `add ${value} to ${pokemon}`,
    removedValue: (value: string, pokemon: string) =>
      `remove ${value} from ${pokemon}`,
    replacedValue: (previous: string, value: string, pokemon: string) =>
      `replace ${previous} with ${value} for ${pokemon}`,
    setValue: (label: string, value: string, pokemon: string) =>
      `change ${label} to ${value} for ${pokemon}`,
    swappedSlots: (first: string, second: string) =>
      `swap ${first} and ${second}`,
    moreChanges: (count: number) =>
      count === 1 ? "1 more change" : `${count} more changes`,
    undoAction: (action: string) => `Undo ${action}`,
    redoAction: (action: string) => `Redo ${action}`,
    randomizeTeamAction: "randomize team",
    nameListView: "Name list view",
    listView: "List view",
    gridView: "Grid view",
    // The default names of new teams
    teamNumber: (number: number) => `Team ${number}`,
    unnamedTeam: "Team",
    copyOf: (name: string) => `${name} copy`,
    learnsetsFailed:
      "The move lists could not be loaded. Reload the page to try again.",
  },

  // The undo and redo buttons
  undo: "Undo",
  redo: "Redo",

  // The analysis panel
  stats: {
    teamStats: "Team Stats",
    teamAnalysis: "Team analysis",
    teamDefence: "Team Defence",
    teamTypeCoverage: "Team Type Coverage",
    teamChecklist: "Team Checklist",
    matrixAnalysis: "Matrix Analysis",
    defence: "Defence",
    coverage: "Coverage",
    checklist: "Checklist",
    matrix: "Matrix",
    score: (type: string, score: string) => `${type} score: ${score}`,
    selectPokemonFirst: "First select a pokemon.",
    typeDoes: "{type} does...",
    multiplier: (multiplier: number) => `${multiplier}x`,
    toPokemon: (pokemon: string) => `to ${pokemon}`,
    superEffectiveAgainst: "Super effective against {type}:",
    checked: "Checked",
    unchecked: "Unchecked",
  },
  checklist: {
    groups: {
      general: "General",
      defensive: "Defensive",
      offensive: "Offensive",
    },
    // Shorter labels for screens at lg and below, then shorter still at md and below
    items: {
      entryHazard: { label: "Entry Hazard", short: "Hazard" },
      spinner: { label: "Spinner/Defogger", short: "Spinner", shorter: "Spin" },
      recovery: {
        label: "Reliable Recovery",
        short: "Recovery",
        shorter: "Heal",
      },
      cleric: { label: "Cleric" },
      status: { label: "Status Move", short: "Status" },
      phazer: { label: "Phazer" },
      boosting: { label: "Boosting Move", short: "Setup" },
      voltTurn: {
        label: "Volt-turn Move",
        short: "Volt-turn",
        shorter: "Volturn",
      },
      choice: { label: "Choice Item", short: "Choice" },
    },
  },
  matrix: {
    matrix: "Matrix",
    defenceDescription: "How hard each attacking type hits each pokemon.",
    coverageDescription: "How hard each pokemon's best move hits each type.",
    tapForReason: "Tap a cell for the reason.",
    // The column that sums each row, as the Team Defence and Team Type Coverage scores do
    teamScore: "Team score",
    slot: (slot: number, pokemon: string | undefined) =>
      `Slot ${slot}${pokemon ? `: ${pokemon}` : ""}`,
    weak: "Weak",
    resists: "Resists",
    immune: "Immune",
    // The same legend for the coverage matrix, where a strong hit is the good outcome
    superEffective: "Super effective",
    resisted: "Resisted",
    noEffect: "No effect",
    defenceReason: (
      type: string,
      multiplier: number,
      pokemon: string,
      types: string,
      cause: string | undefined,
    ) =>
      `${type} does ${multiplier}x to ${pokemon} (${types})${cause ? ` with ${cause}` : ""}`,
    coverageReason: (
      pokemon: string,
      move: string,
      type: string,
      multiplier: number,
      target: string,
    ) => `${pokemon}'s ${move} (${type}) does ${multiplier}x to ${target}`,
    noDamagingMove: (pokemon: string) => `${pokemon} has no damaging move`,
  },
  // Where a full type name does not fit
  typeAbbreviations: {
    Bug: "BUG",
    Dark: "DRK",
    Dragon: "DRG",
    Electric: "ELC",
    Fairy: "FRY",
    Fighting: "FGT",
    Fire: "FIR",
    Flying: "FLY",
    Ghost: "GHT",
    Grass: "GRS",
    Ground: "GRD",
    Ice: "ICE",
    Normal: "NRM",
    Poison: "PSN",
    Psychic: "PSY",
    Rock: "RCK",
    Steel: "STL",
    Water: "WTR",
  } as Record<string, string>,

  // Set details, in the More details and info dialogs
  statNames: {
    hp: "HP",
    atk: "Atk",
    def: "Def",
    spa: "SpA",
    spd: "SpD",
    spe: "Spe",
  },
  statFullNames: {
    hp: "HP",
    atk: "Attack",
    def: "Defense",
    spa: "Sp. Atk",
    spd: "Sp. Def",
    spe: "Speed",
  },
  genders: { M: "Male", F: "Female", N: "Genderless" },
  natureLabel: (
    nature: string,
    plus: string | undefined,
    minus: string | undefined,
  ) =>
    plus && minus ? `${nature} (+${plus}, -${minus})` : `${nature} (neutral)`,
  gameVariantsCompact: {
    "Legends: Arceus": "Legends Arceus",
    "Legends: Z-A": "Legends Z-A",
  },
  gameVariants: {
    "Let’s Go": "Let’s Go, Pikachu! / Eevee!",
    "Legends: Arceus": "Legends: Arceus",
    "Legends: Z-A": "Legends: Z-A",
  },
  advanced: {
    subtitle: (pokemon: string, slot: number) => `${pokemon}, slot ${slot}`,
    dvs: "DVs",
    statExperience: "Stat experience",
    effortLevels: "Effort Levels",
    avs: "AVs",
    statAlignment: "Stat alignment",
    nickname: "Nickname",
    nicknameLimit: (max: number) => `Maximum ${max} characters.`,
    level: "Level",
    gender: "Gender",
    teraType: "Tera Type",
    nature: "Nature",
    shiny: "Shiny",
    sps: "SPs",
    spTotal: (total: number, max: number) => `SP total: ${total} of ${max}`,
    statSps: (stat: string) => `${stat} SPs`,
    evs: "EVs",
    ivs: "IVs",
    evTotal: (total: number, max: number) => `EV total: ${total} of ${max}`,
    statEvs: (stat: string) => `${stat} EVs`,
    statIvs: (stat: string) => `${stat} IVs`,
  },
  info: {
    special: "Special",
    abilities: "Abilities",
    baseStats: "Base stats",
    total: (total: number) => `Total ${total}`,
    statValue: (stat: string, value: number) => `${stat}: ${value}`,
    weakTo: "Weak to",
    smogonDex: "Smogon dex",
    bulbapedia: "Bulbapedia",
    serebii: "Serebii",
    showdownDex: "Showdown dex",
  },

  // The Filters and Sort dialogs
  filters: {
    format: "Format",
    type: "Type",
    region: "Region",
    moves: "Moves",
    viable: "Viable",
    ability: "Ability",
  },
  sort: {
    pokemon: "Pokemon",
    sortBy: "Sort by",
    order: "Order",
    ascending: "Ascending",
    descending: "Descending",
    name: "Name",
    num: "Pokedex number",
    format: "Format",
    bst: "Base stat total",
  },

  // The Teams, Team name, Import, and Delete dialogs
  teams: {
    newTeam: "New Team",
    randomTeam: "Random team",
    // The toolbar shows the first one that fits on one line
    randomTeamLabels: ["Randomize team", "Random team", "Randomize", "Random"],
    savedTeams: "Saved teams",
    optionsFor: (team: string) => `Options for ${team}`,
    load: (team: string) => `Load ${team}`,
    importTeam: "Import Team",
    exportAll: "Export All",
    copyAll: "Copy All",
    savedInBrowser: "Teams are saved in this browser.",
    // The chip on the team being edited, and the one on each team that a tap opens
    current: "Current",
    open: "Open",
    newTeamCreated: "New empty team created",
    emptyTeamOpened: "Opened your empty team",
    randomTeamCreated: "Random team created",
    exported: "Exported all teams",
    copiedAll: "Copied all teams",
    notCopiedAll: "Could not copy the teams.",
    exportFilename: "my-pokemon-teams.txt",
  },
  generationTransfer: {
    title: "Switch game or generation?",
    compactTitle: "Switch game?",
    from: (where: string) => `From ${where}`,
    fromLabel: "From",
    toLabel: "To",
    unavailableHeading: "These Pokémon won’t carry over",
    allUnavailableHeading: "All Pokémon won’t carry over",
    pokemonAdjusted: (pokemon: string) => `${pokemon} needs adjustments.`,
    adjustedHeading: "Your Pokémon will carry over with changes",
    remainingAdjustedHeading:
      "The rest of your Pokémon will carry over with changes",
    universalChanges: "For every Pokémon carrying over",
    levelSet: (level: number) => `Level is set to ${level}.`,
    featuresUnused: (features: string, where: string) =>
      `Not used in ${where}: ${features}.`,
    dvsConvertedToIvs: "DVs are converted into IVs.",
    trainingSystemChanges: (from: string, to: string) =>
      `Training changes from ${from} to ${to}.`,
    removed: {
      item: "Item removed",
      ability: "Ability removed",
      moves: "Moves removed:",
      details: "Details removed",
    },
    ivsUnused: (where: string) => `IVs don’t apply in ${where}.`,
    ivsConvertedToDvs: "IVs are converted into DVs.",
    trainingLimited: "Adjusted to fit this game's limits.",
    trainingApproximate: "Approximate conversion; stats may differ.",
    counts: {
      pokemon: (count: number) => `${count} Pokémon`,
      move: (count: number) => `${count} ${count === 1 ? "move" : "moves"}`,
      item: (count: number) => `${count} ${count === 1 ? "item" : "items"}`,
      ability: (count: number) =>
        `${count} ${count === 1 ? "ability" : "abilities"}`,
    },
    modify: "Update existing team",
    copy: "Copy to new team",
    createEmpty: "Create empty team",
    clearExisting: "Clear existing team",
    emptyTeamHint: "Creating an empty team keeps your original team unchanged.",
    carriedOver: "Copying keeps your original team unchanged.",
    pokemonUnavailable: (where: string) => `Unavailable in ${where}.`,
    loses: "Will lose:",
    entryLabel: (label: string, value: string) => `${label}: ${value}`,
    entryRemoved: (value: string) => `Will lose ${value}.`,
    loadFailed:
      "The generation data could not be loaded. Reload the page to try again.",
  },
  settings: {
    editTeamName: "Edit team name",
    teamName: "Team name",
  },
  validation: {
    empty: "The team is empty.",
    notAllowed: (pokemon: string, where: string) =>
      `${pokemon} is not allowed in ${where}.`,
    wrongAbility: (pokemon: string, ability: string) =>
      `${pokemon} cannot have ${ability}.`,
    missingItem: (pokemon: string, items: string[]) =>
      `${pokemon} must hold ${items.join(" or ")}.`,
    repeatedMove: (pokemon: string, move: string) =>
      `${pokemon} has ${move} twice.`,
    tooManyEvs: (pokemon: string, total: number, max: number) =>
      `${pokemon} has ${total} EVs (at most ${max}).`,
    tooManyStatEvs: (pokemon: string, max: number) =>
      `${pokemon} has more than ${max} EVs in one stat.`,
    nicknameTooLong: (pokemon: string, max: number) =>
      `${pokemon}'s nickname must be ${max} characters or fewer.`,
    badLevel: (pokemon: string, max: number) =>
      `${pokemon}'s level must be 1 to ${max}.`,
    teraType: (pokemon: string) =>
      `${pokemon} has a Tera Type, which only exists in ${generation(9)}.`,
    speciesClause: (species: string) =>
      `Two pokemon are ${species} (Species Clause).`,
    itemClause: (item: string) => `Two pokemon hold ${item} (Item Clause).`,
  },
  importDialog: {
    importTitle: "Import Team",
    editTitle: "Edit Pokepaste",
    importDescription:
      "Paste a team, or a whole backup with several teams, in {showdown}'s format.",
    editDescription:
      "This is your team's raw text. Change it here, or paste it into {showdown}.",
    showdown: "Pokemon Showdown",
    importPlaceholder: "Paste a team here",
    editPlaceholder: "Your team is empty",
    label: "Pokemon Showdown Team Raw Text",
    kept: "Nicknames, levels, genders, shiny, tera types, natures, EVs, and IVs are kept. Happiness is ignored.",
    import: "Import",
    update: "Update",
    imported: "Team imported",
    importedMany: (count: number) => `${count} teams imported`,
    noChanges: "No changes made.",
    nothingFound: "No pokemon found in that text.",
  },
  deleteDialog: {
    title: (team: string) => `Delete ${team}?`,
    thisTeam: "this team",
    description:
      "The team and its pokemon are removed from this browser. This cannot be undone.",
  },

  // The footer and its dialogs
  footer: {
    typeChart: "Type Chart",
    manual: "Manual",
    manualTitle: "Manual Help Guide",
    credits: "Credits",
    updates: (date: string) => `Updates (${date})`,
    updateLog: "Update Log",
    privacyPolicy: "Privacy Policy",
    colorScheme: "Color scheme",
    systemTheme: "Use system theme",
    lightTheme: "Use light theme",
    darkTheme: "Use dark theme",
    auto: "Auto",
    light: "Light",
    dark: "Dark",
    githubRepo: "GitHub Repo",
  },
  typeChart: {
    table: "Table",
    list: "List",
    infographic: "Infographic",
    tableAlt: "Bulbapedia Pokemon Type Chart",
    listAlt: "List Pokemon Type Chart",
    infographicAlt: "Infographic Type Chart",
    listCaption: "Strong against → Type → Strong against",
    infographicCaption: "Also applies for Gen 7-9",
  },
  credits: {
    showdown:
      "The folks at Pokemon Showdown are very generous to let me use all of their sprites, icons, and pokemon data. Absolutely indispensable!",
    alsoThanks: "Also thanks to",
    companies: "Nintendo, The Pokemon Company, Game Freak",
    companiesFor:
      "Pokemon itself, the Pokemon Shuffle art beside the title, and the Legends: Z-A mega sprites",
    typeChartTable: "Type chart table",
    fromBulbapedia: "From Bulbapedia",
    typeChartList: "Type chart list",
    typeChartInfographic: "Type chart infographic",
    fromRPokemon: "From r/pokemon",
    typeColours: "Type colours",
    typeColoursFor: "The colour of each type in the team stats",
    stunfiskFor: "It's a good community",
  },
  privacy: {
    playwire:
      "All or partial advertising on this Website or App is managed by Playwire LLC. If Playwire publisher advertising services are used, Playwire LLC may collect and use certain aggregated and anonymized data for advertising purposes. To learn more about the types of data collected, how data is used and your choices as a user, please visit {link}.",
    advertise: "Advertise on this site.",
  },
  manual: {
    teams: "Teams",
    teamsQuestion: "Where are my teams saved?",
    teamsAnswer:
      "Your teams are saved in this browser, so they are here when you come back, but not on another device. The Teams button lists them, and each team's menu renames it, sets its generation and format, duplicates it, shares it, or deletes it. Export All downloads every team as Showdown text, which Import Team reads back. The address bar always holds the current team, so copying the address (or pressing Share) shares it.",
    teamsAnswer2:
      "The More button shows the team tools, the Filters and Sort buttons, and the More details button. Undo and Redo step through the current team's changes; on phones and tablets they are in the Manage menu.",
    generations: "Generations",
    generationsQuestion: "What does the generation change?",
    generationsAnswer:
      "The generation, chosen at the top, lists only the pokemon and formes that existed in it: megas in Gens 6, 7, and 9, Gigantamax formes in Gen 8, and so on. Everything else stays current: the moves, abilities, type chart, and formats come from the newest games, so an old generation's team may know moves it could not learn back then.",
    advanced: "More details",
    advancedQuestion: "Nicknames, levels, natures, EVs, and IVs",
    advancedAnswer:
      "Each pokemon's More details button sets its nickname, level, gender, shiny, tera type, nature, EVs, and IVs, in the same way as Pokemon Showdown. They travel with the team in share links and in the Copy text and Edit Pokepaste text.",
    matrix: "Matrix Analysis",
    matrixQuestion: "Where do the type scores come from?",
    matrixAnswer:
      "The matrix, in the analysis panel, shows every type against every pokemon. Defence is how hard each attacking type hits each pokemon, with its ability and item counted, and Coverage is how hard each pokemon's best damaging move hits each type. Tap a cell for the reason.",
    defence: "Team Defence",
    defenceQuestion: "How is your team's type defence calculated?",
    defenceAnswer:
      "Every pokemon in your team is weak to certain types and resistant to other types. If a type is not very effective against one of your pokemon, you gain points. But if it's super effective, you lose points:",
    effectivenessHeading: "Type Effectiveness Against You",
    pointsHeading: "Points",
    effectiveness: {
      immune: "No effect",
      quarter: "0.25x effective",
      half: "0.5x effective",
      neutral: "1x effective",
      double: "2x super effective",
      quadruple: "4x super effective",
    },
    note: "Note:",
    defenceNote:
      "Abilities like Levitate, Thick Fat, Filter, and Sap Sipper are taken into account. For example, if your Bronzong has Levitate, you get +1.5 for Ground. And if it has Heatproof, you get 0 for Fire instead.",
    coverage: "Team Type Coverage",
    coverageQuestion: "How is your team's type coverage calculated?",
    coverageAnswer:
      "First, what is type coverage? It's about how many types your moves are super effective against. If one of your moves is super effective against a type, you gain +1. If that move also has the same type as the pokemon using it (STAB), then you gain another +1.",
    coverageNote:
      "Abilities like Aerilate and Pixilate are taken into account. So are moves like Freeze Dry and Flying Press. For example, Freeze Dry also gives you +1 against Water.",
    formats: "Formats (aka Tiers)",
    formatsQuestion: "What is Ubers, OU, VGC, etc.?",
    formatsAnswer:
      "Ubers, OU, and {vgc} are formats (or tiers) that ban some pokemon and enforce certain rules. Battle Stadium Singles/Doubles and VGC are the only ones endorsed by The Pokemon Company, while the other ones are maintained by {smogon}. You can check out {faq} or {guide}.",
    vgc: "VGC",
    smogon: "Smogon",
    faq: "Smogon's FAQ about tiers",
    guide: "this guide that gives a brief description about each tier",
    champions:
      "The Pokemon Champions (M-C) format only lists the pokemon you can use in Pokemon Champions under Regulation M-C, including their mega evolutions.",
    terms: "Team Checklist Terms",
    termsQuestion:
      "What do things like entry hazard, phazer, and volt-turn even mean?",
    termsAnswer:
      "Smogon has a {dictionary}, but it's a bit outdated. Here are some of the terms it doesn't cover:",
    dictionary: "dictionary for pokemon terms",
    termHeading: "Term",
    definitionHeading: "Definition",
    definitions: [
      [
        "Defogger",
        "A pokemon that knows Defog (which blows away entry hazards).",
      ],
      [
        "Reliable Recovery",
        "Moves that are guaranteed to recover 50% or more of your HP every time you use it (under normal weather conditions). E.g. Recover, Softboiled, Milk Drink, Slack Off, Synthesis.",
      ],
      [
        "Status Moves",
        "Here, they refer to accurate moves that paralyze, burn, or poison, as well as moves that cause sleep. E.g. Toxic, Will-O-Wisp, Thunder Wave, Sing.",
      ],
      [
        "Boosting Move",
        "Moves that increase your stats (preferrably by 2+), like Swords Dance and Calm Mind.",
      ],
      [
        "Choice Item",
        "An item that increases a stat by 50% but locks you into one move. There are three of these items: Choice Band, Choice Specs, and Choice Scarf.",
      ],
    ] as [string, string][],
  },
};

export default en;

export type Messages = typeof en;
