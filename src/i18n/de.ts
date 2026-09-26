import type { Messages } from "./en";

const generation = (generation: number) => `Gen. ${generation}`;

// Multipliers with a decimal comma, e.g. 0,25x
const times = (multiplier: number) =>
  `${String(multiplier).replace(".", ",")}x`;

const de: Messages = {
  // The header
  siteName: "My Pokemon Team",
  generation,
  generationSelect: "Generation",
  championsGeneration: "Gen. 9 · Champions",
  championsGenerationShort: "Gen. 9 (Champions)",
  championsGame: "Pokémon Champions",
  generationGames: {
    9: "Karmesin / Purpur · Legenden: Z-A",
    8: "Schwert / Schild · Strahlender Diamant / Leuchtende Perle · Legenden: Arceus",
    7: "Sonne / Mond · Ultrasonne / Ultramond · Let's Go",
    6: "X / Y · Omega Rubin / Alpha Saphir",
    5: "Schwarz / Weiß · Schwarz 2 / Weiß 2",
    4: "Diamant / Perl / Platin · HeartGold / SoulSilver",
    3: "Rubin / Saphir / Smaragd · Feuerrot / Blattgrün",
    2: "Gold / Silber / Kristall",
    1: "Rot / Blau / Gelb",
  } as Record<number, string>,
  language: "Sprache",
  feedback: {
    button: "Feedback senden",
    title: "Feedback senden",
    description:
      "Einen Fehler gefunden oder einen Vorschlag? Beim Senden öffnet sich dein E-Mail-Programm mit der Nachricht an {email}. Häng deinen Team-Link an, damit Probleme nachvollzogen werden können.",
    label: "Dein Feedback",
    placeholder: "z. B. Meganie fehlt Zauberschein",
    attachLink: "Meinen Team-Link anhängen",
    subject: "Feedback zu My Pokemon Team",
    myTeam: "Mein Team:",
    send: "Senden",
  },

  // Buttons shared by several dialogs
  cancel: "Abbrechen",
  close: "Schließen",
  done: "Fertig",
  goBack: "Zurück",
  save: "Speichern",
  reset: "Zurücksetzen",
  clear: "Leeren",
  all: "Alle",
  any: "Beliebig",
  none: "Keine Angabe",
  nothing: "Nichts",

  // The team column
  team: {
    teams: "Teams",
    randomize: "Zufällig füllen",
    randomized: "Team zufällig gefüllt",
    shareTeam: "Team teilen",
    shareTeamLink: "Link zum Pokémon-Team teilen",
    teamActions: "Team-Aktionen",
    manageTeam: "Team verwalten",
    manageTeamMenu: "Team verwalten",
    nameAndFormat: "Name und Format",
    duplicate: "Duplizieren",
    copyText: "Text kopieren",
    editPokepaste: "Pokepaste bearbeiten",
    delete: "Löschen",
    importTeam: "Team importieren",
    share: "Teilen",
    teamEmpty: "Das Pokémon-Team ist leer",
    linkCopied: "Link zum Pokémon-Team kopiert",
    linkNotCopied: "Der Link konnte nicht kopiert werden.",
    nothingToCopy: "Leeres Team, nichts zu kopieren.",
    teamCopied: "Team kopiert.",
    teamNotCopied: "Das Team konnte nicht kopiert werden.",
    teamDuplicated: "Team dupliziert",
    teamDeleted: "Team gelöscht",
    slots: "Plätze im Pokémon-Team",
    slot: (slot: number) => `Pokémon ${slot}`,
    slotWith: (slot: number, pokemon: string | undefined) =>
      `Pokémon ${slot} (${pokemon ?? "leer"})`,
    slotPair: (first: string, second: string) => `${first} und ${second}`,
    moreTools: "Mehr Team-Werkzeuge",
    fewerTools: "Weniger Team-Werkzeuge",
    more: "Mehr",
    less: "Weniger",
    filters: "Filter",
    sort: "Sortieren",
    random: "Zufall",
    randomFor: (slot: number) => `Zufälliges Pokémon für Platz ${slot}`,
    advanced: "Erweitert",
    advancedFor: (slot: number) => `Erweiterte Optionen für Platz ${slot}`,
    about: (pokemon: string) => `Über ${pokemon}`,
    previousSlot: "Zum vorherigen Platz",
    nextSlot: "Zum nächsten Platz",
    name: "Name",
    move: "Attacke",
    item: "Item",
    ability: "Fähigkeit",
    // The accessible name of each input, e.g. "move2 von Pokémon 1"
    input: (slot: number, property: string) =>
      `${property} von Pokémon ${slot}`,
    itemIcon: (item: string) => `Symbol für ${item}`,
    nothingFound: "Nichts gefunden",
    selectPokemonFirst: "(du hast noch kein Pokémon ausgewählt)",
    nameListView: "Ansicht der Namensliste",
    listView: "Listenansicht",
    gridView: "Rasteransicht",
    // The default names of new teams
    teamNumber: (number: number) => `Team ${number}`,
    unnamedTeam: "Team",
    copyOf: (name: string) => `Kopie von ${name}`,
    learnsetsFailed:
      "Die Attackenlisten konnten nicht geladen werden. Lade die Seite neu, um es noch einmal zu versuchen.",
  },

  // The undo and redo buttons
  history: "Verlauf",
  undo: "Rückgängig",
  redo: "Wiederholen",

  // The analysis panel
  stats: {
    teamStats: "Team-Statistiken",
    teamStatsAndChecklist: "Team-Statistiken und Checkliste",
    teamAnalysis: "Teamanalyse",
    teamDefence: "Team-Defensive",
    teamTypeCoverage: "Team-Typenabdeckung",
    teamChecklist: "Team-Checkliste",
    matrixAnalysis: "Matrix-Analyse",
    defence: "Defensive",
    coverage: "Abdeckung",
    teamStat: "Team-Statistik",
    backToTeamStats: "Zurück zu den Team-Statistiken",
    moreAnalyses: "Weitere Analysen",
    score: (type: string, score: string) => `Wertung für ${type}: ${score}`,
    selectPokemonFirst: "Wähle zuerst ein Pokémon aus.",
    typeDoes: "{type} wirkt ...",
    multiplier: times,
    toPokemon: (pokemon: string) => `auf ${pokemon}`,
    superEffectiveAgainst: "Sehr effektiv gegen {type}:",
    checked: "Erfüllt",
    unchecked: "Nicht erfüllt",
  },
  checklist: {
    groups: {
      general: "Allgemein",
      defensive: "Defensiv",
      offensive: "Offensiv",
    },
    // Shorter labels for screens at lg and below, then shorter still at md and below
    items: {
      entryHazard: { label: "Entry Hazard", short: "Hazard" },
      spinner: { label: "Spinner/Defogger", short: "Spinner", shorter: "Spin" },
      recovery: {
        label: "Zuverlässige Heilung",
        short: "Heilung",
        shorter: "Heilung",
      },
      cleric: { label: "Cleric" },
      status: { label: "Status-Attacke", short: "Status" },
      phazer: { label: "Phazer" },
      boosting: { label: "Boost-Attacke", short: "Setup" },
      voltTurn: {
        label: "Volt-Turn-Attacke",
        short: "Volt-Turn",
        shorter: "Volturn",
      },
      choice: { label: "Wahl-Item", short: "Wahl" },
    },
  },
  matrix: {
    matrix: "Matrix",
    defenceDescription: "Wie stark jeder Angriffstyp jedes Pokémon trifft.",
    coverageDescription:
      "Wie stark die beste Attacke jedes Pokémon jeden Typ trifft.",
    tapForReason: "Tippe auf eine Zelle für die Begründung.",
    slot: (slot: number, pokemon: string | undefined) =>
      `Platz ${slot}${pokemon ? `: ${pokemon}` : ""}`,
    weak: "×2 schwach",
    quadruple: "×4",
    resists: "½ resistent",
    quarter: "¼",
    immune: "0 immun",
    defenceReason: (
      type: string,
      multiplier: number,
      pokemon: string,
      types: string,
      cause: string | undefined,
    ) =>
      `${type} wirkt ${times(multiplier)} auf ${pokemon} (${types})${cause ? ` mit ${cause}` : ""}`,
    coverageReason: (
      pokemon: string,
      move: string,
      type: string,
      multiplier: number,
      target: string,
    ) =>
      `${move} (${type}) von ${pokemon} wirkt ${times(multiplier)} auf ${target}`,
    noDamagingMove: (pokemon: string) =>
      `${pokemon} hat keine Attacke, die Schaden verursacht`,
  },
  // Where a full type name does not fit
  typeAbbreviations: {
    Bug: "KÄF",
    Dark: "UNL",
    Dragon: "DRA",
    Electric: "ELE",
    Fairy: "FEE",
    Fighting: "KAM",
    Fire: "FEU",
    Flying: "FLU",
    Ghost: "GEI",
    Grass: "PFL",
    Ground: "BOD",
    Ice: "EIS",
    Normal: "NOR",
    Poison: "GIF",
    Psychic: "PSY",
    Rock: "GST",
    Steel: "STA",
    Water: "WAS",
  } as Record<string, string>,

  // Set details, in the Advanced and info dialogs
  statNames: {
    hp: "KP",
    atk: "Ang",
    def: "Ver",
    spa: "SpA",
    spd: "SpV",
    spe: "Init",
  },
  statFullNames: {
    hp: "KP",
    atk: "Angriff",
    def: "Verteidigung",
    spa: "Sp.-Ang.",
    spd: "Sp.-Vert.",
    spe: "Initiative",
  },
  genders: { M: "Männlich", F: "Weiblich", N: "Geschlechtslos" },
  natureLabel: (
    nature: string,
    plus: string | undefined,
    minus: string | undefined,
  ) =>
    plus && minus ? `${nature} (+${plus}, -${minus})` : `${nature} (neutral)`,
  advanced: {
    subtitle: (pokemon: string, slot: number) => `${pokemon}, Platz ${slot}`,
    nickname: "Spitzname",
    level: "Level",
    gender: "Geschlecht",
    teraType: "Tera-Typ",
    nature: "Wesen",
    shiny: "Schillernd",
    evs: "EV",
    ivs: "DV",
    evTotal: (total: number, max: number) => `EV gesamt: ${total} von ${max}`,
    statEvs: (stat: string) => `${stat}-EV`,
    statIvs: (stat: string) => `${stat}-DV`,
  },
  info: {
    abilities: "Fähigkeiten",
    baseStats: "Basiswerte",
    total: (total: number) => `Gesamt ${total}`,
    statValue: (stat: string, value: number) => `${stat}: ${value}`,
    weakTo: "Schwach gegen",
    smogonDex: "Smogon-Dex",
  },

  // The Filters and Sort dialogs
  filters: {
    description: "Grenzt die Namensauswahl für jeden Platz ein.",
    format: "Format",
    type: "Typ",
    region: "Region",
    moves: "Attacken",
    viable: "Brauchbar",
    ability: "Fähigkeit",
  },
  sort: {
    sortBy: "Sortieren nach",
    order: "Reihenfolge",
    ascending: "Aufsteigend",
    descending: "Absteigend",
    name: "Name",
    num: "Pokédex-Nummer",
    format: "Format",
    bst: "Basiswertsumme",
  },

  // The Teams, Name and Format, Import, and Delete dialogs
  teams: {
    description:
      "Tippe auf ein Team, um es zu öffnen. Über die Schaltfläche ⋮ erreichst du seine Einstellungen und Aktionen.",
    newTeam: "Neues Team",
    randomTeam: "Zufallsteam",
    savedTeams: "Gespeicherte Teams",
    optionsFor: (team: string) => `Optionen für ${team}`,
    load: (team: string) => `${team} laden`,
    importTeam: "Team importieren",
    exportAll: "Alle exportieren",
    savedInBrowser: "Teams werden in diesem Browser gespeichert.",
    exportFilename: "my-pokemon-teams.txt",
  },
  settings: {
    teamName: "Teamname",
    checkTeamFor: (where: string) => `Team für ${where} prüfen`,
    validFor: (where: string) => `Das Team ist für ${where} gültig.`,
  },
  validation: {
    empty: "Das Team ist leer.",
    notAllowed: (pokemon: string, where: string) =>
      `${pokemon} ist in ${where} nicht erlaubt.`,
    wrongAbility: (pokemon: string, ability: string) =>
      `${pokemon} kann ${ability} nicht haben.`,
    missingItem: (pokemon: string, items: string[]) =>
      `${pokemon} muss ${items.join(" oder ")} tragen.`,
    repeatedMove: (pokemon: string, move: string) =>
      `${pokemon} hat ${move} zweimal.`,
    tooManyEvs: (pokemon: string, total: number, max: number) =>
      `${pokemon} hat ${total} EV (höchstens ${max}).`,
    tooManyStatEvs: (pokemon: string, max: number) =>
      `${pokemon} hat mehr als ${max} EV in einem Statuswert.`,
    badLevel: (pokemon: string, max: number) =>
      `Das Level von ${pokemon} muss zwischen 1 und ${max} liegen.`,
    teraType: (pokemon: string) =>
      `${pokemon} hat einen Tera-Typ, den es nur in ${generation(9)} gibt.`,
    speciesClause: (species: string) =>
      `Zwei Pokémon sind ${species} (Species Clause).`,
    itemClause: (item: string) => `Zwei Pokémon tragen ${item} (Item Clause).`,
  },
  importDialog: {
    importTitle: "Team importieren",
    editTitle: "Pokepaste bearbeiten",
    importDescription:
      "Füge ein Team oder ein ganzes Backup mit mehreren Teams im Format von {showdown} ein.",
    editDescription:
      "Das ist der Rohtext deines Teams. Ändere ihn hier oder füge ihn in {showdown} ein.",
    showdown: "Pokemon Showdown",
    importPlaceholder: "Team hier einfügen",
    editPlaceholder: "Dein Team ist leer",
    label: "Rohtext des Pokemon-Showdown-Teams",
    kept: "Spitznamen, Level, Geschlechter, Schillernd, Tera-Typen, Wesen, EV und DV bleiben erhalten. Freundschaft wird ignoriert.",
    import: "Importieren",
    update: "Aktualisieren",
    imported: "Team importiert",
    importedMany: (count: number) => `${count} Teams importiert`,
    noChanges: "Keine Änderungen vorgenommen.",
  },
  deleteDialog: {
    title: (team: string) => `${team} löschen?`,
    thisTeam: "dieses Team",
    description:
      "Das Team und seine Pokémon werden aus diesem Browser entfernt. Das lässt sich nicht rückgängig machen.",
  },

  // The footer and its dialogs
  footer: {
    typeChart: "Typentabelle",
    manual: "Anleitung",
    manualTitle: "Anleitung und Hilfe",
    credits: "Danksagungen",
    updates: (date: string) => `Updates (${date})`,
    updateLog: "Update-Log",
    privacyPolicy: "Datenschutzerklärung",
    colorScheme: "Farbschema",
    systemTheme: "Systemdesign verwenden",
    lightTheme: "Helles Design verwenden",
    darkTheme: "Dunkles Design verwenden",
    githubRepo: "GitHub-Repo",
  },
  typeChart: {
    table: "Tabelle",
    list: "Liste",
    infographic: "Infografik",
    tableAlt: "Pokémon-Typentabelle von Bulbapedia",
    listAlt: "Pokémon-Typentabelle als Liste",
    infographicAlt: "Typentabelle als Infografik",
    listCaption: "Stark gegen → Typ → Stark gegen",
    infographicCaption: "Gilt auch für Gen. 7–9",
  },
  credits: {
    showdown:
      "Die Leute von Pokemon Showdown sind so großzügig, mich all ihre Sprites, Symbole und Pokémon-Daten verwenden zu lassen. Absolut unverzichtbar!",
    alsoThanks: "Außerdem danke an",
    companies: "Nintendo, The Pokémon Company, Game Freak",
    companiesFor:
      "Pokémon selbst, die Pokémon-Shuffle-Grafik neben dem Titel und die Mega-Sprites aus Legenden: Z-A",
    typeChartTable: "Typentabelle (Tabelle)",
    fromBulbapedia: "Von Bulbapedia",
    typeChartList: "Typentabelle (Liste)",
    typeChartInfographic: "Typentabelle (Infografik)",
    fromRPokemon: "Von r/pokemon",
    typeColours: "Typenfarben",
    typeColoursFor: "Die Farbe jedes Typs in den Team-Statistiken",
    stunfiskFor: "Eine gute Community",
  },
  privacy: {
    playwire:
      "Die Werbung auf dieser Website oder App wird ganz oder teilweise von Playwire LLC verwaltet. Wenn die Publisher-Werbedienste von Playwire genutzt werden, kann Playwire LLC bestimmte aggregierte und anonymisierte Daten zu Werbezwecken erheben und verwenden. Mehr über die Arten der erhobenen Daten, ihre Verwendung und deine Wahlmöglichkeiten als Nutzer erfährst du unter {link}.",
    advertise: "Auf dieser Seite werben.",
  },
  manual: {
    teams: "Teams",
    teamsQuestion: "Wo werden meine Teams gespeichert?",
    teamsAnswer:
      "Deine Teams werden in diesem Browser gespeichert. Sie sind also da, wenn du wiederkommst, aber nicht auf einem anderen Gerät. Die Schaltfläche „Teams“ listet sie auf, und über das Menü eines Teams kannst du es umbenennen, seine Generation und sein Format festlegen, es duplizieren, teilen oder löschen. „Alle exportieren“ lädt alle Teams als Showdown-Text herunter, den „Team importieren“ wieder einliest. Die Adressleiste enthält immer das aktuelle Team; du teilst es also, indem du die Adresse kopierst (oder auf „Team teilen“ drückst).",
    teamsAnswer2:
      "Auf Smartphones und Tablets zeigt die Schaltfläche „Mehr“ die Team-Werkzeuge, die Schaltflächen „Filter“ und „Sortieren“ sowie die Schaltfläche „Erweitert“. Mit den Schaltflächen „Rückgängig“ und „Wiederholen“ unten gehst du die Änderungen am aktuellen Team durch.",
    generations: "Generationen",
    generationsQuestion: "Was ändert die Generation?",
    generationsAnswer:
      "Die oben gewählte Generation listet nur die Pokémon und Formen auf, die es in ihr gab: Megas in Gen. 6, 7 und 9, Gigadynamax-Formen in Gen. 8 und so weiter. Alles andere bleibt aktuell: Attacken, Fähigkeiten, Typentabelle und Formate stammen aus den neuesten Spielen, sodass ein Team einer alten Generation Attacken kennen kann, die es damals nicht lernen konnte.",
    advanced: "Erweiterte Optionen",
    advancedQuestion: "Spitznamen, Level, Wesen, EV und DV",
    advancedAnswer:
      "Über die Schaltfläche „Erweitert“ jedes Pokémon legst du Spitzname, Level, Geschlecht, Schillernd, Tera-Typ, Wesen, EV und DV fest, genau wie bei Pokemon Showdown. Sie wandern mit dem Team in Share-Links sowie im Text von „Text kopieren“ und „Pokepaste bearbeiten“ mit, und die Prüfung im Dialog „Name und Format“ meldet mehr als 510 EV, doppelte Attacken, gebannte Pokémon und Clauses.",
    matrix: "Matrix-Analyse",
    matrixQuestion: "Woher kommen die Typenwertungen?",
    matrixAnswer:
      "Die Matrix im Menü des Analysebereichs zeigt jeden Typ gegen jedes Pokémon. „Defensive“ zeigt, wie stark jeder Angriffstyp jedes Pokémon trifft, mit Fähigkeit und Item eingerechnet, und „Abdeckung“, wie stark die beste Schadensattacke jedes Pokémon jeden Typ trifft. Tippe auf eine Zelle für die Begründung.",
    defence: "Team-Defensive",
    defenceQuestion: "Wie wird die Typen-Defensive deines Teams berechnet?",
    defenceAnswer:
      "Jedes Pokémon in deinem Team ist gegen bestimmte Typen schwach und gegen andere resistent. Ist ein Typ gegen eines deiner Pokémon nicht sehr effektiv, bekommst du Punkte. Ist er dagegen sehr effektiv, verlierst du Punkte:",
    effectivenessHeading: "Typeneffektivität gegen dich",
    pointsHeading: "Punkte",
    effectiveness: {
      immune: "Kein Effekt",
      quarter: "0,25x effektiv",
      half: "0,5x effektiv",
      neutral: "1x effektiv",
      double: "2x sehr effektiv",
      quadruple: "4x sehr effektiv",
    },
    note: "Hinweis:",
    defenceNote:
      "Fähigkeiten wie Schwebe, Speckschicht, Filter und Vegetarier werden berücksichtigt. Hat dein Bronzong zum Beispiel Schwebe, bekommst du +1,5 für Boden. Und hat es Hitzeschutz, bekommst du stattdessen 0 für Feuer.",
    coverage: "Team-Typenabdeckung",
    coverageQuestion: "Wie wird die Typenabdeckung deines Teams berechnet?",
    coverageAnswer:
      "Zuerst: Was ist Typenabdeckung? Es geht darum, gegen wie viele Typen deine Attacken sehr effektiv sind. Ist eine deiner Attacken gegen einen Typ sehr effektiv, bekommst du +1. Hat diese Attacke außerdem denselben Typ wie das Pokémon, das sie einsetzt (STAB), bekommst du noch einmal +1.",
    coverageNote:
      "Fähigkeiten wie Zenithaut und Feenschicht werden berücksichtigt, ebenso Attacken wie Gefriertrockner und Flying Press. Gefriertrockner gibt dir zum Beispiel auch +1 gegen Wasser.",
    formats: "Formate (auch Tiers genannt)",
    formatsQuestion: "Was sind Ubers, OU, VGC usw.?",
    formatsAnswer:
      "Ubers, OU und {vgc} sind Formate (oder Tiers), die manche Pokémon verbieten und bestimmte Regeln vorschreiben. Battle Stadium Singles/Doubles und VGC sind die einzigen, die von The Pokémon Company unterstützt werden; die anderen werden von {smogon} gepflegt. Schau dir {faq} oder {guide} an.",
    vgc: "VGC",
    smogon: "Smogon",
    faq: "Smogons FAQ zu den Tiers",
    guide: "diesen Leitfaden mit einer kurzen Beschreibung jedes Tiers",
    champions:
      "Das Format „Pokémon Champions (M-C)“ listet nur die Pokémon auf, die du in Pokémon Champions unter Regulation M-C verwenden kannst, einschließlich ihrer Mega-Entwicklungen.",
    terms: "Begriffe der Team-Checkliste",
    termsQuestion:
      "Was bedeuten Begriffe wie Entry Hazard, Phazer und Volt-Turn überhaupt?",
    termsAnswer:
      "Smogon hat ein {dictionary}, das aber etwas veraltet ist. Hier sind einige Begriffe, die es nicht abdeckt:",
    dictionary: "Wörterbuch für Pokémon-Begriffe",
    termHeading: "Begriff",
    definitionHeading: "Definition",
    definitions: [
      [
        "Defogger",
        "Ein Pokémon, das Auflockern beherrscht (was Entry Hazards wegbläst).",
      ],
      [
        "Zuverlässige Heilung",
        "Attacken, die bei jedem Einsatz garantiert 50 % oder mehr deiner KP heilen (bei normalem Wetter). Z. B. Genesung, Weichei, Milchgetränk, Tagedieb, Synthese.",
      ],
      [
        "Status-Attacken",
        "Hier sind damit treffsichere Attacken gemeint, die paralysieren, verbrennen oder vergiften, sowie Attacken, die Schlaf verursachen. Z. B. Toxin, Irrlicht, Donnerwelle, Gesang.",
      ],
      [
        "Boost-Attacke",
        "Attacken, die deine Statuswerte erhöhen (am besten um 2 oder mehr Stufen), wie Schwerttanz und Gedankengut.",
      ],
      [
        "Wahl-Item",
        "Ein Item, das einen Statuswert um 50 % erhöht, dich aber auf eine Attacke festlegt. Es gibt drei davon: Wahlband, Wahlbrille und Wahlschal.",
      ],
    ] as [string, string][],
  },
};

export default de;
