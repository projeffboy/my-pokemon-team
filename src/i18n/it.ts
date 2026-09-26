import type { Messages } from "./en";

const generation = (generation: number) => `Gen. ${generation}`;

const it: Messages = {
  // The header
  siteName: "My Pokemon Team",
  generation,
  generationSelect: "Generazione",
  championsGeneration: "Gen. 9 · Champions",
  championsGenerationShort: "Gen. 9 (Champions)",
  championsGame: "Pokémon Champions",
  generationGames: {
    9: "Scarlatto / Violetto · Leggende: Z-A",
    8: "Spada / Scudo · Diamante Lucente / Perla Splendente · Leggende: Arceus",
    7: "Sole / Luna · Ultrasole / Ultraluna · Let's Go",
    6: "X / Y · Rubino Omega / Zaffiro Alpha",
    5: "Nero / Bianco · Nero 2 / Bianco 2",
    4: "Diamante / Perla / Platino · Oro HeartGold / Argento SoulSilver",
    3: "Rubino / Zaffiro / Smeraldo · Rosso Fuoco / Verde Foglia",
    2: "Oro / Argento / Cristallo",
    1: "Rosso / Blu / Giallo",
  } as Record<number, string>,
  language: "Lingua",
  feedback: {
    button: "Invia feedback",
    title: "Invia feedback",
    description:
      "Hai trovato un bug o hai un suggerimento? L'invio apre la tua app di posta con il messaggio indirizzato a {email}. Allega il link della tua squadra, così i problemi si possono riprodurre.",
    label: "Il tuo feedback",
    placeholder: "es. a Meganium manca Magibrillio",
    attachLink: "Allega il link della mia squadra",
    subject: "My Pokemon Team feedback",
    myTeam: "La mia squadra:",
    send: "Invia",
  },

  // Buttons shared by several dialogs
  cancel: "Annulla",
  close: "Chiudi",
  done: "Fatto",
  goBack: "Indietro",
  save: "Salva",
  reset: "Ripristina",
  clear: "Azzera",
  all: "Tutti",
  any: "Qualsiasi",
  none: "Nessuno",
  nothing: "Niente",

  // The team column
  team: {
    teams: "Squadre",
    randomize: "Randomizza",
    randomized: "Squadra randomizzata",
    shareTeam: "Condividi squadra",
    shareTeamLink: "Condividi il link della squadra Pokémon",
    teamActions: "Azioni sulla squadra",
    manageTeam: "Gestisci squadra",
    manageTeamMenu: "Gestisci squadra",
    nameAndFormat: "Nome e formato",
    duplicate: "Duplica",
    copyText: "Copia testo",
    editPokepaste: "Modifica Pokepaste",
    delete: "Elimina",
    importTeam: "Importa squadra",
    share: "Condividi",
    teamEmpty: "La squadra Pokémon è vuota",
    linkCopied: "Link della squadra Pokémon copiato",
    linkNotCopied: "Impossibile copiare il link.",
    nothingToCopy: "Squadra vuota, niente da copiare.",
    teamCopied: "Squadra copiata.",
    teamNotCopied: "Impossibile copiare la squadra.",
    teamDuplicated: "Squadra duplicata",
    teamDeleted: "Squadra eliminata",
    slots: "Slot della squadra Pokémon",
    slot: (slot: number) => `Pokémon ${slot}`,
    slotWith: (slot: number, pokemon: string | undefined) =>
      `Pokémon ${slot} (${pokemon ?? "vuoto"})`,
    slotPair: (first: string, second: string) => `${first} e ${second}`,
    moreTools: "Altre funzioni della squadra",
    fewerTools: "Meno funzioni della squadra",
    more: "Altro",
    less: "Meno",
    filters: "Filtri",
    sort: "Ordina",
    random: "Casuale",
    randomFor: (slot: number) => `Pokémon casuale per lo slot ${slot}`,
    advanced: "Avanzate",
    advancedFor: (slot: number) => `Opzioni avanzate per lo slot ${slot}`,
    about: (pokemon: string) => `Info su ${pokemon}`,
    previousSlot: "Sposta allo slot precedente",
    nextSlot: "Sposta allo slot successivo",
    name: "Nome",
    move: "Mossa",
    item: "Strumento",
    ability: "Abilità",
    // The accessible name of each input, e.g. "move2 del Pokémon 1"
    input: (slot: number, property: string) =>
      `${property} del Pokémon ${slot}`,
    itemIcon: (item: string) => `Icona di ${item}`,
    nothingFound: "Nessun risultato",
    selectPokemonFirst: "(non hai selezionato un Pokémon)",
    nameListView: "Vista dell'elenco dei nomi",
    listView: "Vista a elenco",
    gridView: "Vista a griglia",
    // The default names of new teams
    teamNumber: (number: number) => `Squadra ${number}`,
    unnamedTeam: "Squadra",
    copyOf: (name: string) => `Copia di ${name}`,
    learnsetsFailed:
      "Impossibile caricare gli elenchi delle mosse. Ricarica la pagina per riprovare.",
  },

  // The undo and redo buttons
  history: "Cronologia",
  undo: "Annulla",
  redo: "Ripeti",

  // The analysis panel
  stats: {
    teamStats: "Statistiche squadra",
    teamStatsAndChecklist: "Statistiche squadra e checklist",
    teamAnalysis: "Analisi della squadra",
    teamDefence: "Difesa della squadra",
    teamTypeCoverage: "Copertura di tipo della squadra",
    teamChecklist: "Checklist della squadra",
    matrixAnalysis: "Analisi a matrice",
    defence: "Difesa",
    coverage: "Copertura",
    teamStat: "Statistica della squadra",
    backToTeamStats: "Torna alle statistiche squadra",
    moreAnalyses: "Altre analisi",
    score: (type: string, score: string) => `Punteggio ${type}: ${score}`,
    selectPokemonFirst: "Prima seleziona un Pokémon.",
    typeDoes: "{type} fa...",
    multiplier: (multiplier: number) => `${multiplier}x`,
    toPokemon: (pokemon: string) => `a ${pokemon}`,
    superEffectiveAgainst: "Superefficace contro {type}:",
    checked: "Spuntato",
    unchecked: "Non spuntato",
  },
  checklist: {
    groups: {
      general: "Generale",
      defensive: "Difensivo",
      offensive: "Offensivo",
    },
    // Shorter labels for screens at lg and below, then shorter still at md and below
    items: {
      entryHazard: { label: "Entry Hazard", short: "Hazard" },
      spinner: { label: "Spinner/Defogger", short: "Spinner", shorter: "Spin" },
      recovery: {
        label: "Recupero affidabile",
        short: "Recupero",
        shorter: "Cura",
      },
      cleric: { label: "Cleric" },
      status: { label: "Mossa di stato", short: "Stato" },
      phazer: { label: "Phazer" },
      boosting: { label: "Mossa potenziante", short: "Setup" },
      voltTurn: {
        label: "Mossa Volt-turn",
        short: "Volt-turn",
        shorter: "Volturn",
      },
      choice: { label: "Strumento Choice", short: "Choice" },
    },
  },
  matrix: {
    matrix: "Matrice",
    defenceDescription:
      "Quanto forte ogni tipo d'attacco colpisce ogni Pokémon.",
    coverageDescription:
      "Quanto forte la mossa migliore di ogni Pokémon colpisce ogni tipo.",
    tapForReason: "Tocca una cella per il motivo.",
    slot: (slot: number, pokemon: string | undefined) =>
      `Slot ${slot}${pokemon ? `: ${pokemon}` : ""}`,
    weak: "×2 debole",
    quadruple: "×4",
    resists: "½ resiste",
    quarter: "¼",
    immune: "0 immune",
    defenceReason: (
      type: string,
      multiplier: number,
      pokemon: string,
      types: string,
      cause: string | undefined,
    ) =>
      `${type} fa ${multiplier}x a ${pokemon} (${types})${cause ? ` con ${cause}` : ""}`,
    coverageReason: (
      pokemon: string,
      move: string,
      type: string,
      multiplier: number,
      target: string,
    ) => `${move} (${type}) di ${pokemon} fa ${multiplier}x a ${target}`,
    noDamagingMove: (pokemon: string) =>
      `${pokemon} non ha mosse che infliggono danni`,
  },
  // Where a full type name does not fit
  typeAbbreviations: {
    Bug: "COL",
    Dark: "BUI",
    Dragon: "DRA",
    Electric: "ELE",
    Fairy: "FOL",
    Fighting: "LOT",
    Fire: "FUO",
    Flying: "VOL",
    Ghost: "SPE",
    Grass: "ERB",
    Ground: "TER",
    Ice: "GHI",
    Normal: "NOR",
    Poison: "VEL",
    Psychic: "PSI",
    Rock: "ROC",
    Steel: "ACC",
    Water: "ACQ",
  } as Record<string, string>,

  // Set details, in the Advanced and info dialogs
  statNames: {
    hp: "PS",
    atk: "Att",
    def: "Dif",
    spa: "AtS",
    spd: "DiS",
    spe: "Vel",
  },
  statFullNames: {
    hp: "PS",
    atk: "Attacco",
    def: "Difesa",
    spa: "Att. Sp.",
    spd: "Dif. Sp.",
    spe: "Velocità",
  },
  genders: { M: "Maschio", F: "Femmina", N: "Asessuato" },
  natureLabel: (
    nature: string,
    plus: string | undefined,
    minus: string | undefined,
  ) =>
    plus && minus ? `${nature} (+${plus}, -${minus})` : `${nature} (neutra)`,
  advanced: {
    subtitle: (pokemon: string, slot: number) => `${pokemon}, slot ${slot}`,
    nickname: "Soprannome",
    level: "Livello",
    gender: "Sesso",
    teraType: "Teratipo",
    nature: "Natura",
    shiny: "Cromatico",
    evs: "EV",
    ivs: "IV",
    evTotal: (total: number, max: number) => `Totale EV: ${total} di ${max}`,
    statEvs: (stat: string) => `EV ${stat}`,
    statIvs: (stat: string) => `IV ${stat}`,
  },
  info: {
    abilities: "Abilità",
    baseStats: "Statistiche di base",
    total: (total: number) => `Totale ${total}`,
    statValue: (stat: string, value: number) => `${stat}: ${value}`,
    weakTo: "Debole a",
    smogonDex: "Dex di Smogon",
  },

  // The Filters and Sort dialogs
  filters: {
    description: "Restringe il menu Nome di ogni slot.",
    format: "Formato",
    type: "Tipo",
    region: "Regione",
    moves: "Mosse",
    viable: "Competitive",
    ability: "Abilità",
  },
  sort: {
    sortBy: "Ordina per",
    order: "Ordine",
    ascending: "Crescente",
    descending: "Decrescente",
    name: "Nome",
    num: "Numero del Pokédex",
    format: "Formato",
    bst: "Totale statistiche di base",
  },

  // The Teams, Name and Format, Import, and Delete dialogs
  teams: {
    description:
      "Tocca una squadra per aprirla. Il pulsante ⋮ contiene le sue impostazioni e azioni.",
    newTeam: "Nuova squadra",
    randomTeam: "Squadra casuale",
    savedTeams: "Squadre salvate",
    optionsFor: (team: string) => `Opzioni per ${team}`,
    load: (team: string) => `Carica ${team}`,
    importTeam: "Importa squadra",
    exportAll: "Esporta tutte",
    savedInBrowser: "Le squadre sono salvate in questo browser.",
    exportFilename: "my-pokemon-teams.txt",
  },
  settings: {
    teamName: "Nome della squadra",
    checkTeamFor: (where: string) => `Controlla la squadra per ${where}`,
    validFor: (where: string) => `La squadra è valida per ${where}.`,
  },
  validation: {
    empty: "La squadra è vuota.",
    notAllowed: (pokemon: string, where: string) =>
      `${pokemon} non è ammesso in ${where}.`,
    wrongAbility: (pokemon: string, ability: string) =>
      `${pokemon} non può avere ${ability}.`,
    missingItem: (pokemon: string, items: string[]) =>
      `${pokemon} deve tenere ${items.join(" o ")}.`,
    repeatedMove: (pokemon: string, move: string) =>
      `${pokemon} ha ${move} due volte.`,
    tooManyEvs: (pokemon: string, total: number, max: number) =>
      `${pokemon} ha ${total} EV (massimo ${max}).`,
    tooManyStatEvs: (pokemon: string, max: number) =>
      `${pokemon} ha più di ${max} EV in una statistica.`,
    badLevel: (pokemon: string, max: number) =>
      `Il livello di ${pokemon} deve essere da 1 a ${max}.`,
    teraType: (pokemon: string) =>
      `${pokemon} ha un teratipo, che esiste solo nella ${generation(9)}.`,
    speciesClause: (species: string) =>
      `Due Pokémon sono ${species} (Species Clause).`,
    itemClause: (item: string) => `Due Pokémon tengono ${item} (Item Clause).`,
  },
  importDialog: {
    importTitle: "Importa squadra",
    editTitle: "Modifica Pokepaste",
    importDescription:
      "Incolla una squadra, o un intero backup con più squadre, nel formato di {showdown}.",
    editDescription:
      "Questo è il testo grezzo della tua squadra. Modificalo qui, oppure incollalo in {showdown}.",
    showdown: "Pokemon Showdown",
    importPlaceholder: "Incolla qui una squadra",
    editPlaceholder: "La tua squadra è vuota",
    label: "Testo grezzo della squadra di Pokemon Showdown",
    kept: "Soprannomi, livelli, sessi, cromatico, teratipi, nature, EV e IV vengono mantenuti. La felicità viene ignorata.",
    import: "Importa",
    update: "Aggiorna",
    imported: "Squadra importata",
    importedMany: (count: number) => `${count} squadre importate`,
    noChanges: "Nessuna modifica.",
  },
  deleteDialog: {
    title: (team: string) => `Eliminare ${team}?`,
    thisTeam: "questa squadra",
    description:
      "La squadra e i suoi Pokémon vengono rimossi da questo browser. L'operazione non può essere annullata.",
  },

  // The footer and its dialogs
  footer: {
    typeChart: "Tabella dei tipi",
    manual: "Manuale",
    manualTitle: "Manuale di aiuto",
    credits: "Crediti",
    updates: (date: string) => `Aggiornamenti (${date})`,
    updateLog: "Registro aggiornamenti",
    privacyPolicy: "Informativa sulla privacy",
    colorScheme: "Schema colori",
    systemTheme: "Usa il tema di sistema",
    lightTheme: "Usa il tema chiaro",
    darkTheme: "Usa il tema scuro",
    githubRepo: "Repository GitHub",
  },
  typeChart: {
    table: "Tabella",
    list: "Elenco",
    infographic: "Infografica",
    tableAlt: "Tabella dei tipi Pokémon di Bulbapedia",
    listAlt: "Tabella dei tipi Pokémon a elenco",
    infographicAlt: "Infografica della tabella dei tipi",
    listCaption: "Forte contro → Tipo → Forte contro",
    infographicCaption: "Vale anche per le Gen. 7-9",
  },
  credits: {
    showdown:
      "Le persone di Pokemon Showdown sono molto generose a lasciarmi usare tutti i loro sprite, le icone e i dati sui Pokémon. Assolutamente indispensabili!",
    alsoThanks: "Grazie anche a",
    companies: "Nintendo, The Pokémon Company, Game Freak",
    companiesFor:
      "I Pokémon stessi, l'illustrazione di Pokémon Shuffle accanto al titolo e gli sprite delle megaevoluzioni di Leggende: Z-A",
    typeChartTable: "Tabella dei tipi",
    fromBulbapedia: "Da Bulbapedia",
    typeChartList: "Elenco dei tipi",
    typeChartInfographic: "Infografica dei tipi",
    fromRPokemon: "Da r/pokemon",
    typeColours: "Colori dei tipi",
    typeColoursFor: "Il colore di ogni tipo nelle statistiche della squadra",
    stunfiskFor: "È una bella community",
  },
  privacy: {
    playwire:
      "La pubblicità su questo sito web o app è gestita, in tutto o in parte, da Playwire LLC. Se vengono usati i servizi pubblicitari per editori di Playwire, Playwire LLC può raccogliere e usare certi dati aggregati e anonimizzati a fini pubblicitari. Per saperne di più sui tipi di dati raccolti, su come vengono usati e sulle tue scelte come utente, visita {link}.",
    advertise: "Fai pubblicità su questo sito.",
  },
  manual: {
    teams: "Squadre",
    teamsQuestion: "Dove sono salvate le mie squadre?",
    teamsAnswer:
      "Le tue squadre sono salvate in questo browser, quindi le ritrovi quando torni, ma non su un altro dispositivo. Il pulsante Squadre le elenca, e il menu di ogni squadra la rinomina, ne imposta generazione e formato, la duplica, la condivide o la elimina. Esporta tutte scarica ogni squadra come testo di Showdown, che Importa squadra rilegge. La barra degli indirizzi contiene sempre la squadra corrente, quindi copiare l'indirizzo (o premere Condividi squadra) la condivide.",
    teamsAnswer2:
      "Su telefoni e tablet, il pulsante Altro mostra le funzioni della squadra, i pulsanti Filtri e Ordina e il pulsante Avanzate. I pulsanti Annulla e Ripeti in basso scorrono le modifiche della squadra corrente.",
    generations: "Generazioni",
    generationsQuestion: "Cosa cambia la generazione?",
    generationsAnswer:
      "La generazione, scelta in alto, elenca solo i Pokémon e le forme che esistevano in essa: le megaevoluzioni nelle Gen. 6, 7 e 9, le forme Gigamax nella Gen. 8, e così via. Tutto il resto resta attuale: mosse, abilità, tabella dei tipi e formati vengono dai giochi più recenti, quindi una squadra di una vecchia generazione può conoscere mosse che allora non poteva imparare.",
    advanced: "Opzioni avanzate",
    advancedQuestion: "Soprannomi, livelli, nature, EV e IV",
    advancedAnswer:
      "Il pulsante Avanzate di ogni Pokémon ne imposta soprannome, livello, sesso, cromatico, teratipo, natura, EV e IV, come su Pokemon Showdown. Viaggiano con la squadra nei link di condivisione e nel testo di Copia testo e Modifica Pokepaste, e il controllo della finestra Nome e formato segnala EV oltre 510, mosse ripetute, Pokémon vietati e clausole.",
    matrix: "Analisi a matrice",
    matrixQuestion: "Da dove vengono i punteggi dei tipi?",
    matrixAnswer:
      "La matrice, nel menu del pannello di analisi, mostra ogni tipo contro ogni Pokémon. Difesa è quanto forte ogni tipo d'attacco colpisce ogni Pokémon, contando abilità e strumento, e Copertura è quanto forte la migliore mossa offensiva di ogni Pokémon colpisce ogni tipo. Tocca una cella per il motivo.",
    defence: "Difesa della squadra",
    defenceQuestion:
      "Come viene calcolata la difesa di tipo della tua squadra?",
    defenceAnswer:
      "Ogni Pokémon della tua squadra è debole a certi tipi e resistente ad altri. Se un tipo è poco efficace contro uno dei tuoi Pokémon, guadagni punti. Ma se è superefficace, perdi punti:",
    effectivenessHeading: "Efficacia del tipo contro di te",
    pointsHeading: "Punti",
    effectiveness: {
      immune: "Nessun effetto",
      quarter: "Efficacia 0.25x",
      half: "Efficacia 0.5x",
      neutral: "Efficacia 1x",
      double: "Superefficace 2x",
      quadruple: "Superefficace 4x",
    },
    note: "Nota:",
    defenceNote:
      "Abilità come Levitazione, Grassospesso, Filtro e Mangiaerba vengono considerate. Per esempio, se il tuo Bronzong ha Levitazione, ottieni +1.5 per Terra. E se ha Antifuoco, ottieni invece 0 per Fuoco.",
    coverage: "Copertura di tipo della squadra",
    coverageQuestion:
      "Come viene calcolata la copertura di tipo della tua squadra?",
    coverageAnswer:
      "Prima di tutto, cos'è la copertura di tipo? Riguarda contro quanti tipi le tue mosse sono superefficaci. Se una delle tue mosse è superefficace contro un tipo, guadagni +1. Se quella mossa ha anche lo stesso tipo del Pokémon che la usa (STAB), guadagni un altro +1.",
    coverageNote:
      "Abilità come Pellecielo e Pellefolletto vengono considerate. Anche mosse come Liofilizzazione e Schiacciatuffo. Per esempio, Liofilizzazione ti dà +1 anche contro Acqua.",
    formats: "Formati (o tier)",
    formatsQuestion: "Cosa sono Ubers, OU, VGC, ecc.?",
    formatsAnswer:
      "Ubers, OU e {vgc} sono formati (o tier) che vietano alcuni Pokémon e impongono certe regole. Battle Stadium Singles/Doubles e VGC sono gli unici approvati da The Pokémon Company, mentre gli altri sono gestiti da {smogon}. Puoi consultare {faq} o {guide}.",
    vgc: "VGC",
    smogon: "Smogon",
    faq: "le FAQ di Smogon sui tier",
    guide: "questa guida che descrive brevemente ogni tier",
    champions:
      "Il formato Pokémon Champions (M-C) elenca solo i Pokémon utilizzabili in Pokémon Champions con la Regulation M-C, incluse le loro megaevoluzioni.",
    terms: "Termini della checklist",
    termsQuestion:
      "Cosa vogliono dire termini come entry hazard, phazer e volt-turn?",
    termsAnswer:
      "Smogon ha un {dictionary}, ma è un po' datato. Ecco alcuni termini che non copre:",
    dictionary: "dizionario dei termini Pokémon",
    termHeading: "Termine",
    definitionHeading: "Definizione",
    definitions: [
      [
        "Defogger",
        "Un Pokémon che conosce Scacciabruma (che spazza via le entry hazard).",
      ],
      [
        "Recupero affidabile",
        "Mosse che recuperano con certezza il 50% o più dei tuoi PS ogni volta che le usi (in condizioni meteo normali). Es. Ripresa, Covauova, Buonlatte, Pigro, Sintesi.",
      ],
      [
        "Mosse di stato",
        "Qui indicano mosse precise che paralizzano, scottano o avvelenano, oltre alle mosse che addormentano. Es. Tossina, Fuocofatuo, Tuononda, Canto.",
      ],
      [
        "Mossa potenziante",
        "Mosse che aumentano le tue statistiche (preferibilmente di 2 o più livelli), come Danzaspada e Calmamente.",
      ],
      [
        "Strumento Choice",
        "Uno strumento che aumenta una statistica del 50% ma ti blocca su una sola mossa. Ce ne sono tre: Bendascelta, Lentiscelta e Stolascelta.",
      ],
    ] as [string, string][],
  },
};

export default it;
