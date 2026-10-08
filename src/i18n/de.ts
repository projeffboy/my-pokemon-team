import type { Messages } from "./en";

const generation = (generation: number) => `Gen. ${generation}`;

// Multipliers with a decimal comma, e.g. 0,25x
const times = (multiplier: number) =>
  `${String(multiplier).replace(".", ",")}x`;

// A slot's inputs, for their accessible names
const inputNames: Record<string, string> = {
  name: "Name",
  move1: "Attacke 1",
  move2: "Attacke 2",
  move3: "Attacke 3",
  move4: "Attacke 4",
  item: "Item",
  ability: "Fähigkeit",
};

const de: Messages = {
  // The header
  generation,
  generationGames: {
    9: "Karmesin Purpur",
    8: "Schwert Schild / Strahlender Diamant Leuchtende Perle",
    7: "Sonne Mond / Ultrasonne Ultramond",
    6: "X Y / Omega Rubin Alpha Saphir",
    5: "Schwarz Weiß / Schwarz 2 Weiß 2",
    4: "Diamant Perl Platin / HeartGold SoulSilver",
    3: "Rubin Saphir Smaragd / Feuerrot Blattgrün",
    2: "Gold Silber Kristall",
    1: "Rot Blau Gelb",
  },
  generationSelect: "Generation",
  comingSoon: "Demnächst",
  championsGeneration: "Gen. 9 · Champions",
  championsGenerationShort: "Gen. 9 (Champions)",
  language: "Sprache",
  languageFailed:
    "Die Sprache konnte nicht geladen werden. Versuche es erneut.",
  feedback: {
    button: "Feedback senden",
    title: "Feedback senden",
    description: "Einen Fehler gefunden oder eine Idee? Sag es mir.",
    label: "Dein Feedback",
    placeholder: "z. B. Meganie fehlt Zauberschein",
    attachLink: "Link zu meinem Team anhängen",
    attachScreenshot: "Screenshot der Seite anhängen",
    addImage: "Bild hinzufügen",
    imageUnreadable:
      "Das Bild konnte nicht gelesen werden. Versuch es mit PNG oder JPEG.",
    imagesTooLarge: "Die Bilder sind zusammen zu groß. Entferne zuerst eines.",
    email: "Deine E-Mail (optional)",
    emailHelper: "Nur für eine Antwort",
    caption: "Feedback",
    send: "Senden",
    sent: "Danke! Dein Feedback wurde gesendet.",
    failed: "Senden fehlgeschlagen. Versuch es erneut oder schreib an {email}.",
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
    randomizedTeam: "Team zufällig gefüllt",
    randomizedPokemon: "Pokémon zufällig gewählt",
    randomizedPokemonDetails: (details: string) =>
      `Für das Pokémon zufällig gewählt: ${details}`,
    shareTeam: "Teilen",
    shareTeamLink: "Link zum Pokémon-Team teilen",
    teamActions: "Team-Aktionen",
    manageTeam: "Verwalten",
    manageTeamMenu: "Team verwalten",
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
    cannotDuplicateEmptyTeam: "Ein leeres Team kann nicht dupliziert werden",
    teamDuplicated: "Team dupliziert",
    teamDeleted: "Team gelöscht",
    slots: "Plätze im Pokémon-Team",
    slot: (slot: number) => `Pokémon ${slot}`,
    slotWith: (slot: number, pokemon: string | undefined) =>
      `Pokémon ${slot} (${pokemon ?? "leer"})`,
    slotPair: (first: string, second: string) => `${first} und ${second}`,
    moreTools: "Mehr Team-Werkzeuge",
    fewerTools: "Weniger Team-Werkzeuge",
    advancedMode: "Erweitert",
    more: "Mehr",
    less: "Weniger",
    filters: "Filter",
    sort: "Sortieren",
    random: "Zufall",
    randomize: "Zufällig wählen",
    randomizePokemon: "Pokémon zufällig wählen",
    randomizeDetails: (details: string) => `${details} zufällig wählen`,
    randomFor: (slot: number) => `Zufälliges Pokémon für Platz ${slot}`,
    advanced: "Weitere Details",
    advancedFor: (slot: number) => `Weitere Details für Platz ${slot}`,
    about: (pokemon: string) => `Über ${pokemon}`,
    dragHint: "Halten und ziehen zum Umordnen",
    moveToSlot: (pokemon: string) =>
      `${pokemon} auf einen anderen Platz verschieben`,
    name: "Name",
    move: "Attacke",
    item: "Item",
    ability: "Fähigkeit",
    hidden: "Versteckt",
    input: (slot: number, property: string) =>
      `${inputNames[property] ?? property} von Pokémon ${slot}`,
    itemIcon: (item: string) => `Symbol für ${item}`,
    nothingFound: "Nichts gefunden",
    noOtherMoves: "Keine weiteren Attacken verfügbar.",
    selectPokemonFirst: "(du hast noch kein Pokémon ausgewählt)",
    list: "Liste",
    grid: "Raster",
    bigGrid: "Großes Raster",
    pokemonInSlot: (pokemon: string, slot: number) =>
      `${pokemon} auf Platz ${slot} setzen`,
    removedPokemon: (pokemon: string, slot: number) =>
      `${pokemon} von Platz ${slot} entfernen`,
    addedValue: (value: string, pokemon: string) =>
      `${value} zu ${pokemon} hinzufügen`,
    removedValue: (value: string, pokemon: string) =>
      `${value} von ${pokemon} entfernen`,
    replacedValue: (previous: string, value: string, pokemon: string) =>
      `${previous} durch ${value} für ${pokemon} ersetzen`,
    setValue: (label: string, value: string, pokemon: string) =>
      `${label} für ${pokemon} auf ${value} setzen`,
    swappedSlots: (first: string, second: string) =>
      `${first} und ${second} tauschen`,
    moreChanges: (count: number) => `${count} weitere Änderungen`,
    undoAction: (action: string) => `Rückgängig: ${action}`,
    redoAction: (action: string) => `Wiederholen: ${action}`,
    randomizeTeamAction: "Team zufällig zusammenstellen",
    nameListView: "Ansicht der Namensliste",
    listView: "Listenansicht",
    gridView: "Rasteransicht",
    bigGridView: "Große Rasteransicht",
    // The default names of new teams
    teamNumber: (number: number) => `Team ${number}`,
    unnamedTeam: "Team",
    copyOf: (name: string) => `Kopie von ${name}`,
    learnsetsFailed:
      "Die Attackenlisten konnten nicht geladen werden. Lade die Seite neu, um es noch einmal zu versuchen.",
  },

  // The undo and redo buttons
  undo: "Rückgängig",
  redo: "Wiederholen",

  // The analysis panel
  stats: {
    teamStats: "Team-Statistiken",
    teamAnalysis: "Teamanalyse",
    teamDefence: "Team-Defensive",
    teamTypeCoverage: "Team-Typenabdeckung",
    teamChecklist: "Team-Checkliste",
    matrixAnalysis: "Matrix-Analyse",
    defence: "Defensive",
    coverage: "Abdeckung",
    checklist: "Checkliste",
    matrix: "Matrix",
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
    // The column that sums each row, as the Team Defence and Team Type Coverage scores do
    teamScore: "Team-Wert",
    slot: (slot: number, pokemon: string | undefined) =>
      `Platz ${slot}${pokemon ? `: ${pokemon}` : ""}`,
    weak: "Schwach",
    resists: "Resistent",
    immune: "Immun",
    // The same legend for the coverage matrix, where a strong hit is the good outcome
    superEffective: "Sehr effektiv",
    resisted: "Wenig effektiv",
    noEffect: "Kein Effekt",
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
  gameVariantsCompact: {
    "Legends: Arceus": "Legenden Arceus",
    "Legends: Z-A": "Legenden Z-A",
  },
  gameVariants: {
    "Let’s Go": "Let’s Go, Pikachu! / Evoli!",
    "Legends: Arceus": "Legenden: Arceus",
    "Legends: Z-A": "Legenden: Z-A",
  },
  advanced: {
    subtitle: (pokemon: string, slot: number) => `${pokemon}, Platz ${slot}`,
    dvs: "DVs",
    statExperience: "Stat-Erfahrung",
    effortLevels: "Leistungslevel",
    avs: "AVs",
    statAlignment: "Werteausrichtung",
    nickname: "Spitzname",
    nicknameLimit: (max: number) => `Maximal ${max} Zeichen.`,
    level: "Level",
    happiness: "Freundschaft",
    gender: "Geschlecht",
    teraType: "Tera-Typ",
    nature: "Wesen",
    shiny: "Schillernd",
    sps: "SP",
    spTotal: (total: number, max: number) => `SP gesamt: ${total} von ${max}`,
    statSps: (stat: string) => `${stat} SP`,
    evs: "EV",
    ivs: "DV",
    evTotal: (total: number, max: number) => `EV gesamt: ${total} von ${max}`,
    statEvs: (stat: string) => `${stat}-EV`,
    statIvs: (stat: string) => `${stat}-DV`,
  },
  info: {
    special: "Spezial",
    abilities: "Fähigkeiten",
    baseStats: "Basiswerte",
    total: (total: number) => `Gesamt ${total}`,
    statValue: (stat: string, value: number) => `${stat}: ${value}`,
    weakTo: "Schwach gegen",
    smogonDex: "Smogon-Dex",
    bulbapedia: "Bulbapedia",
    serebii: "Serebii",
    showdownDex: "Showdown-Dex",
  },

  // The Filters and Sort dialogs
  filters: {
    format: "Format",
    type: "Typ",
    region: "Region",
    moves: "Attacken",
    viable: "Brauchbar",
    ability: "Fähigkeit",
  },
  sort: {
    pokemon: "Pokémon",
    sortBy: "Sortieren nach",
    order: "Reihenfolge",
    ascending: "Aufsteigend",
    descending: "Absteigend",
    name: "Name",
    num: "Pokédex-Nummer",
    format: "Format",
    bst: "Basiswertsumme",
  },

  // The Teams, Team name, Import, and Delete dialogs
  teams: {
    newTeam: "Neues Team",
    randomTeam: "Zufallsteam",
    randomTeamLabels: [
      "Team auswürfeln",
      "Zufallsteam",
      "Auswürfeln",
      "Zufall",
    ],
    savedTeams: "Gespeicherte Teams",
    optionsFor: (team: string) => `Optionen für ${team}`,
    load: (team: string) => `${team} laden`,
    importTeam: "Team importieren",
    exportAll: "Alle exportieren",
    copyAll: "Alle kopieren",
    savedInBrowser: "Teams werden in diesem Browser gespeichert.",
    saveFailed:
      "Dein Browser konnte deine Teams nicht speichern. Erstelle eine Sicherung, um sie zu behalten.",
    // The chip on the team being edited, and the one on each team that a tap opens
    current: "Offen",
    open: "Öffnen",
    newTeamCreated: "Neues leeres Team erstellt",
    emptyTeamOpened: "Leeres Team geöffnet",
    randomTeamCreated: "Zufallsteam erstellt",
    exported: "Alle Teams exportiert",
    copiedAll: "Alle Teams kopiert",
    notCopiedAll: "Die Teams konnten nicht kopiert werden.",
    exportFilename: "my-pokemon-teams.txt",
  },
  teamBackup: {
    title: "Team-Sicherungen",
    description:
      "Speichere alle deine Teams mit ihren Namen, Spielen, Filtern und Pokémon-Details.",
    save: "Sicherung speichern",
    restoreDescription:
      "Füge Teams aus einer Sicherungsdatei hinzu. Deine vorhandenen Teams bleiben erhalten.",
    chooseFile: "Sicherungsdatei auswählen",
    restore: "Teams hinzufügen",
    ready: (count: number) => `Teams in dieser Sicherung: ${count}`,
    error:
      "Diese Datei konnte nicht gelesen werden. Wähle eine Team-Sicherung, die auf dieser Seite gespeichert wurde.",
    saveFailed:
      "Die Sicherung konnte nicht gespeichert werden. Bitte versuche es erneut.",
    saved: "Team-Sicherung gespeichert",
    alreadySaved: "Diese Teams sind bereits in deiner Sammlung.",
    filename: "my-pokemon-teams-backup.json",
  },
  generationTransfer: {
    title: "Spiel oder Generation wechseln?",
    compactTitle: "Spiel wechseln?",
    from: (where: string) => `Von ${where}`,
    fromLabel: "Von",
    toLabel: "Zu",
    unavailableHeading: "Diese Pokémon werden nicht übernommen",
    allUnavailableHeading: "Alle Pokémon werden nicht übernommen",
    pokemonAdjusted: (pokemon: string) => `${pokemon} muss angepasst werden.`,
    adjustedHeading: "Deine Pokémon werden mit Änderungen übernommen",
    remainingAdjustedHeading:
      "Deine übrigen Pokémon werden mit Änderungen übernommen",
    universalChanges: "Für jedes übertragene Pokémon",
    levelSet: (level: number) => `Das Level wird auf ${level} gesetzt.`,
    featuresUnused: (features: string, where: string) =>
      `In ${where} nicht verwendet: ${features}.`,
    dvsConvertedToIvs: "DVs werden in IVs umgewandelt.",
    trainingSystemChanges: (from: string, to: string) =>
      `Das Training wechselt von ${from} zu ${to}.`,
    removed: {
      item: "Item entfernt",
      ability: "Fähigkeit entfernt",
      moves: "Attacken entfernt:",
      details: "Details entfernt",
    },
    ivsUnused: (where: string) => `DVs werden in ${where} nicht verwendet.`,
    ivsConvertedToDvs: "IVs werden in DVs umgerechnet.",
    trainingLimited: "An die Grenzen dieses Spiels angepasst.",
    trainingApproximate: "Ungefähre Umrechnung; Statuswerte können abweichen.",
    counts: {
      pokemon: (count: number) => `${count} Pokémon`,
      move: (count: number) =>
        `${count} ${count === 1 ? "Attacke" : "Attacken"}`,
      item: (count: number) => `${count} ${count === 1 ? "Item" : "Items"}`,
      ability: (count: number) =>
        `${count} ${count === 1 ? "Fähigkeit" : "Fähigkeiten"}`,
    },
    modify: "Vorhandenes Team aktualisieren",
    copy: "In neues Team kopieren",
    createEmpty: "Leeres Team erstellen",
    clearExisting: "Bestehendes Team leeren",
    emptyTeamHint:
      "Wenn du ein leeres Team erstellst, bleibt dein ursprüngliches Team unverändert.",
    carriedOver: "Beim Kopieren bleibt dein ursprüngliches Team unverändert.",
    pokemonUnavailable: (where: string) => `In ${where} nicht verfügbar.`,
    loses: "Verliert:",
    entryLabel: (label: string, value: string) => `${label}: ${value}`,
    entryRemoved: (value: string) => `Verliert ${value}.`,
    loadFailed:
      "Die Generationsdaten konnten nicht geladen werden. Lade die Seite neu.",
  },
  settings: {
    editTeamName: "Teamnamen bearbeiten",
    teamName: "Teamname",
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
    nicknameTooLong: (pokemon: string, max: number) =>
      `${pokemon}s Spitzname darf höchstens ${max} Zeichen haben.`,
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
    kept: "Spitznamen, Level, Geschlechter, Schillernd, Tera-Typen, Wesen, EV und DV bleiben erhalten. Freundschaft bleibt ebenfalls erhalten, wenn das gewählte Spiel sie unterstützt.",
    import: "Importieren",
    update: "Aktualisieren",
    imported: "Team importiert",
    importedMany: (count: number) => `${count} Teams importiert`,
    noChanges: "Keine Änderungen vorgenommen.",
    nothingFound: "In diesem Text wurde kein Pokémon gefunden.",
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
    auto: "Auto",
    light: "Hell",
    dark: "Dunkel",
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
      "Deine Teams werden in diesem Browser gespeichert. Sie sind also da, wenn du wiederkommst, aber nicht auf einem anderen Gerät. Die Schaltfläche „Teams“ listet sie auf, und über das Menü eines Teams kannst du es umbenennen, seine Generation und sein Format festlegen, es duplizieren, teilen oder löschen. „Alle exportieren“ lädt alle Teams als Showdown-Text herunter, den „Team importieren“ wieder einliest. Die Adressleiste enthält immer das aktuelle Team; du teilst es also, indem du die Adresse kopierst (oder auf „Teilen“ drückst).",
    teamsAnswer2:
      "Die Schaltfläche „Mehr“ zeigt die Team-Werkzeuge, die Schaltflächen „Filter“ und „Sortieren“ sowie die Schaltfläche „Weitere Details“. Mit „Rückgängig“ und „Wiederholen“ gehst du die Änderungen am aktuellen Team durch; auf Smartphones und Tablets findest du beide im Menü „Verwalten“.",
    generations: "Generationen",
    generationsQuestion: "Was ändert die Generation?",
    generationsAnswer:
      "Die oben gewählte Generation listet nur die Pokémon und Formen auf, die es in ihr gab: Megas in Gen. 6, 7 und 9, Gigadynamax-Formen in Gen. 8 und so weiter. Alles andere bleibt aktuell: Attacken, Fähigkeiten, Typentabelle und Formate stammen aus den neuesten Spielen, sodass ein Team einer alten Generation Attacken kennen kann, die es damals nicht lernen konnte.",
    advanced: "Weitere Details",
    advancedQuestion: "Spitznamen, Level, Wesen, EV und DV",
    advancedAnswer:
      "Über die Schaltfläche „Weitere Details“ jedes Pokémon legst du Spitzname, Level, Geschlecht, Schillernd, Tera-Typ, Wesen, EV und DV fest, genau wie bei Pokemon Showdown. Sie wandern mit dem Team in Share-Links sowie im Text von „Text kopieren“ und „Pokepaste bearbeiten“ mit.",
    matrix: "Matrix-Analyse",
    matrixQuestion: "Woher kommen die Typenwertungen?",
    matrixAnswer:
      "Die Matrix im Analysebereich zeigt jeden Typ gegen jedes Pokémon. „Defensive“ zeigt, wie stark jeder Angriffstyp jedes Pokémon trifft, mit Fähigkeit und Item eingerechnet, und „Abdeckung“, wie stark die beste Schadensattacke jedes Pokémon jeden Typ trifft. Tippe auf eine Zelle für die Begründung.",
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
