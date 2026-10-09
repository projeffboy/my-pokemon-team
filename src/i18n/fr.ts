import type { Messages } from "./en";

const generation = (generation: number) => `Gén. ${generation}`;

// A slot's inputs, for their accessible names
const inputNames: Record<string, string> = {
  name: "Nom",
  move1: "Capacité 1",
  move2: "Capacité 2",
  move3: "Capacité 3",
  move4: "Capacité 4",
  item: "Objet",
  ability: "Talent",
};

const fr: Messages = {
  // The header
  beta: "Bêta",
  generation,
  generationGames: {
    9: "Écarlate Violet",
    8: "Épée Bouclier / Diamant Étincelant Perle Scintillante",
    7: "Soleil Lune / Ultra-Soleil Ultra-Lune",
    6: "X Y / Rubis Oméga Saphir Alpha",
    5: "Noir Blanc / Noir 2 Blanc 2",
    4: "Diamant Perle Platine / Or HeartGold Argent SoulSilver",
    3: "Rubis Saphir Émeraude / Rouge Feu Vert Feuille",
    2: "Or Argent Cristal",
    1: "Rouge Bleu Jaune",
  },
  generationSelect: "Génération",
  comingSoon: "Bientôt disponible",
  championsGeneration: "Gén. 9 · Champions",
  championsGenerationShort: "Gén. 9 (Champions)",
  language: "Langue",
  languageFailed: "La langue n'a pas pu être chargée. Réessayez.",
  feedback: {
    button: "Envoyer un commentaire",
    title: "Envoyer un commentaire",
    description: "Un bug ou une idée ? Dites-le-moi.",
    label: "Votre commentaire",
    placeholder: "ex. : Méganium n'a pas Éclat Magique",
    attachLink: "Joindre le lien de mon équipe",
    attachScreenshot: "Joindre une capture d'écran de la page",
    addImage: "Ajouter une image",
    imageUnreadable:
      "Impossible de lire cette image. Essayez un PNG ou un JPEG.",
    imagesTooLarge:
      "Les images sont trop lourdes pour être envoyées ensemble. Retirez-en une d'abord.",
    email: "Votre e-mail (facultatif)",
    emailHelper: "Pour vous répondre",
    caption: "Avis",
    send: "Envoyer",
    sent: "Merci ! Votre commentaire a été envoyé.",
    failed: "L'envoi a échoué. Réessayez, ou écrivez à {email}.",
  },

  // Buttons shared by several dialogs
  cancel: "Annuler",
  close: "Fermer",
  done: "Terminé",
  goBack: "Retour",
  save: "Enregistrer",
  reset: "Réinitialiser",
  clear: "Effacer",
  all: "Tous",
  any: "Indifférent",
  none: "Aucun",
  nothing: "Rien",

  // The team column
  team: {
    teams: "Équipes",
    randomizedTeam: "Équipe générée au hasard",
    randomizedPokemon: "Pokémon généré au hasard",
    randomizedPokemonDetails: (details: string) =>
      `Choix aléatoire pour le Pokémon : ${details.toLowerCase()}`,
    shareTeam: "Partager",
    shareTeamLink: "Partager le lien de l'équipe Pokémon",
    teamActions: "Actions de l'équipe",
    manageTeam: "Gérer",
    manageTeamMenu: "Gérer l'équipe",
    duplicate: "Dupliquer",
    copyText: "Copier le texte",
    editPokepaste: "Modifier le Pokepaste",
    delete: "Supprimer",
    importTeam: "Importer une équipe",
    share: "Partager",
    teamEmpty: "L'équipe Pokémon est vide",
    linkCopied: "Lien de l'équipe Pokémon copié",
    linkNotCopied: "Impossible de copier le lien.",
    nothingToCopy: "Équipe vide, rien à copier.",
    teamCopied: "Équipe copiée.",
    teamNotCopied: "Impossible de copier l'équipe.",
    cannotDuplicateEmptyTeam: "Impossible de dupliquer une équipe vide",
    teamDuplicated: "Équipe dupliquée",
    teamDeleted: "Équipe supprimée",
    slots: "Emplacements de l'équipe Pokémon",
    slot: (slot: number) => `Pokémon ${slot}`,
    slotWith: (slot: number, pokemon: string | undefined) =>
      `Pokémon ${slot} (${pokemon ?? "vide"})`,
    slotPair: (first: string, second: string) => `${first} et ${second}`,
    moreTools: "Plus d'outils d'équipe",
    fewerTools: "Moins d'outils d'équipe",
    advancedMode: "Avancé",
    more: "Plus",
    less: "Moins",
    filters: "Filtres",
    sort: "Trier",
    random: "Aléatoire",
    randomize: "Randomiser",
    randomizePokemon: "Randomiser le Pokémon",
    randomizeDetails: (details: string) =>
      `Randomiser ${details.toLowerCase()}`,
    randomFor: (slot: number) => `Pokémon aléatoire pour l'emplacement ${slot}`,
    advanced: "Plus de détails",
    advancedFor: (slot: number) => `Plus de détails pour l'emplacement ${slot}`,
    about: (pokemon: string) => `À propos de ${pokemon}`,
    dragHint: "Maintenez et glissez pour réordonner",
    moveToSlot: (pokemon: string) =>
      `Déplacer ${pokemon} vers un autre emplacement`,
    name: "Nom",
    move: "Capacité",
    item: "Objet",
    ability: "Talent",
    hidden: "Caché",
    input: (slot: number, property: string) =>
      `${inputNames[property] ?? property} du Pokémon ${slot}`,
    itemIcon: (item: string) => `Icône de ${item}`,
    nothingFound: "Aucun résultat",
    noOtherMoves: "Aucune autre capacité disponible.",
    selectPokemonFirst: "(vous n'avez pas sélectionné de Pokémon)",
    list: "Liste",
    grid: "Grille",
    bigGrid: "Grande grille",
    pokemonInSlot: (pokemon: string, slot: number) =>
      `placer ${pokemon} à la place ${slot}`,
    removedPokemon: (pokemon: string, slot: number) =>
      `retirer ${pokemon} de la place ${slot}`,
    addedValue: (value: string, pokemon: string) =>
      `ajouter ${value} à ${pokemon}`,
    removedValue: (value: string, pokemon: string) =>
      `retirer ${value} de ${pokemon}`,
    replacedValue: (previous: string, value: string, pokemon: string) =>
      `remplacer ${previous} par ${value} pour ${pokemon}`,
    setValue: (label: string, value: string, pokemon: string) =>
      `définir ${label} sur ${value} pour ${pokemon}`,
    swappedSlots: (first: string, second: string) =>
      `échanger les places de ${first} et ${second}`,
    moreChanges: (count: number) => `${count} autres modifications`,
    undoAction: (action: string) => `Annuler ${action}`,
    redoAction: (action: string) => `Rétablir ${action}`,
    randomizeTeamAction: "créer une équipe aléatoire",
    nameListView: "Vue en liste de noms",
    listView: "Vue en liste",
    gridView: "Vue en grille",
    bigGridView: "Vue en grande grille",
    // The default names of new teams
    teamNumber: (number: number) => `Équipe ${number}`,
    unnamedTeam: "Équipe",
    copyOf: (name: string) => `Copie de ${name}`,
    learnsetsFailed:
      "Les listes de capacités n'ont pas pu être chargées. Rechargez la page pour réessayer.",
  },

  // The undo and redo buttons
  undo: "Annuler",
  redo: "Rétablir",

  // The analysis panel
  stats: {
    teamStats: "Stats de l'équipe",
    teamAnalysis: "Analyse de l'équipe",
    teamDefence: "Défense de l'équipe",
    teamTypeCoverage: "Couverture de types de l'équipe",
    teamChecklist: "Checklist de l'équipe",
    matrixAnalysis: "Analyse matricielle",
    defence: "Défense",
    coverage: "Couverture",
    checklist: "Checklist",
    matrix: "Matrice",
    score: (type: string, score: string) => `Score ${type} : ${score}`,
    selectPokemonFirst: "Sélectionnez d'abord un Pokémon.",
    typeDoes: "{type} inflige...",
    multiplier: (multiplier: number) => `${multiplier}x`,
    toPokemon: (pokemon: string) => `à ${pokemon}`,
    superEffectiveAgainst: "Super efficace contre {type} :",
    checked: "Coché",
    unchecked: "Non coché",
  },
  checklist: {
    groups: {
      general: "Général",
      defensive: "Défensif",
      offensive: "Offensif",
    },
    // Shorter labels for screens at lg and below, then shorter still at md and below
    items: {
      entryHazard: { label: "Piège d'entrée", short: "Piège" },
      spinner: { label: "Spinner/Defogger", short: "Spinner", shorter: "Spin" },
      recovery: {
        label: "Récupération fiable",
        short: "Récupération",
        shorter: "Soin",
      },
      cleric: { label: "Cleric" },
      status: { label: "Capacité de statut", short: "Statut" },
      phazer: { label: "Phazer" },
      boosting: { label: "Capacité de boost", short: "Boost" },
      voltTurn: {
        label: "Capacité Volt-turn",
        short: "Volt-turn",
        shorter: "Volturn",
      },
      choice: { label: "Objet Choix", short: "Choix" },
    },
  },
  matrix: {
    matrix: "Matrice",
    defenceDescription:
      "L'efficacité de chaque type attaquant contre chaque Pokémon.",
    coverageDescription:
      "L'efficacité de la meilleure capacité de chaque Pokémon contre chaque type.",
    tapForReason: "Touchez une case pour voir la raison.",
    // The column that sums each row, as the Team Defence and Team Type Coverage scores do
    teamScore: "Score de l'équipe",
    slot: (slot: number, pokemon: string | undefined) =>
      `Emplacement ${slot}${pokemon ? ` : ${pokemon}` : ""}`,
    weak: "Faiblesse",
    resists: "Résistance",
    immune: "Immunité",
    // The same legend for the coverage matrix, where a strong hit is the good outcome
    superEffective: "Super efficace",
    resisted: "Peu efficace",
    noEffect: "Aucun effet",
    defenceReason: (
      type: string,
      multiplier: number,
      pokemon: string,
      types: string,
      cause: string | undefined,
    ) =>
      `${type} inflige ${multiplier}x à ${pokemon} (${types})${cause ? ` avec ${cause}` : ""}`,
    coverageReason: (
      pokemon: string,
      move: string,
      type: string,
      multiplier: number,
      target: string,
    ) => `${move} (${type}) de ${pokemon} inflige ${multiplier}x à ${target}`,
    noDamagingMove: (pokemon: string) =>
      `${pokemon} n'a aucune capacité offensive`,
  },
  // Where a full type name does not fit
  typeAbbreviations: {
    Bug: "INS",
    Dark: "TÉN",
    Dragon: "DRA",
    Electric: "ÉLE",
    Fairy: "FÉE",
    Fighting: "COM",
    Fire: "FEU",
    Flying: "VOL",
    Ghost: "SPE",
    Grass: "PLA",
    Ground: "SOL",
    Ice: "GLA",
    Normal: "NOR",
    Poison: "POI",
    Psychic: "PSY",
    Rock: "ROC",
    Steel: "ACI",
    Water: "EAU",
  } as Record<string, string>,

  // Set details, in the Advanced and info dialogs
  statNames: {
    hp: "PV",
    atk: "Att",
    def: "Déf",
    spa: "AtS",
    spd: "DéS",
    spe: "Vit",
  },
  statFullNames: {
    hp: "PV",
    atk: "Attaque",
    def: "Défense",
    spa: "Att. Spé.",
    spd: "Déf. Spé.",
    spe: "Vitesse",
  },
  genders: { M: "Mâle", F: "Femelle", N: "Asexué" },
  natureLabel: (
    nature: string,
    plus: string | undefined,
    minus: string | undefined,
  ) =>
    plus && minus ? `${nature} (+${plus}, -${minus})` : `${nature} (neutre)`,
  gameVariantsCompact: {
    "Legends: Arceus": "Légendes Arceus",
    "Legends: Z-A": "Légendes Z-A",
  },
  gameVariants: {
    "Let’s Go": "Let’s Go, Pikachu! / Évoli!",
    "Legends: Arceus": "Légendes: Arceus",
    "Legends: Z-A": "Légendes: Z-A",
  },
  advanced: {
    subtitle: (pokemon: string, slot: number) =>
      `${pokemon}, emplacement ${slot}`,
    dvs: "DVs",
    statExperience: "Expérience des stats",
    effortLevels: "Niveaux d’effort",
    avs: "AVs",
    statAlignment: "Alignement des stats",
    nickname: "Surnom",
    nicknameLimit: (max: number) => `${max} caractères maximum.`,
    level: "Niveau",
    happiness: "Bonheur",
    gender: "Sexe",
    teraType: "Type Téracristal",
    nature: "Nature",
    shiny: "Chromatique",
    sps: "SP",
    spTotal: (total: number, max: number) =>
      `Total des SP : ${total} sur ${max}`,
    statSps: (stat: string) => `SP ${stat}`,
    evs: "EV",
    ivs: "IV",
    evTotal: (total: number, max: number) =>
      `Total des EV : ${total} sur ${max}`,
    statEvs: (stat: string) => `EV ${stat}`,
    statIvs: (stat: string) => `IV ${stat}`,
  },
  info: {
    special: "Spécial",
    abilities: "Talents",
    baseStats: "Stats de base",
    total: (total: number) => `Total ${total}`,
    statValue: (stat: string, value: number) => `${stat} : ${value}`,
    weakTo: "Faible contre",
    smogonDex: "Dex Smogon",
    bulbapedia: "Bulbapedia",
    serebii: "Serebii",
    showdownDex: "Dex Showdown",
  },

  // The Filters and Sort dialogs
  filters: {
    format: "Format",
    type: "Type",
    region: "Région",
    moves: "Capacités",
    viable: "Viable",
    ability: "Talent",
  },
  sort: {
    pokemon: "Pokémon",
    sortBy: "Trier par",
    order: "Ordre",
    ascending: "Croissant",
    descending: "Décroissant",
    name: "Nom",
    num: "Numéro du Pokédex",
    format: "Format",
    bst: "Total des stats de base",
  },

  // The Teams, Team name, Import, and Delete dialogs
  teams: {
    newTeam: "Nouvelle équipe",
    randomTeam: "Équipe aléatoire",
    randomTeamLabels: [
      "Randomiser l'équipe",
      "Équipe aléatoire",
      "Randomiser",
      "Aléatoire",
    ],
    savedTeams: "Équipes enregistrées",
    optionsFor: (team: string) => `Options de ${team}`,
    load: (team: string) => `Charger ${team}`,
    importTeam: "Importer une équipe",
    exportAll: "Tout exporter",
    copyAll: "Tout copier",
    savedInBrowser: "Les équipes sont enregistrées dans ce navigateur.",
    saveFailed:
      "Ton navigateur n’a pas pu enregistrer tes équipes. Fais une sauvegarde pour les conserver.",
    // The chip on the team being edited, and the one on each team that a tap opens
    current: "Ouverte",
    open: "Ouvrir",
    newTeamCreated: "Nouvelle équipe vide créée",
    emptyTeamOpened: "Équipe vide ouverte",
    randomTeamCreated: "Équipe aléatoire créée",
    exported: "Toutes les équipes exportées",
    copiedAll: "Toutes les équipes copiées",
    notCopiedAll: "Impossible de copier les équipes.",
    exportFilename: "my-pokemon-teams.txt",
  },
  teamBackup: {
    title: "Sauvegardes des équipes",
    description:
      "Enregistre toutes tes équipes avec leurs noms, jeux, filtres et détails des Pokémon.",
    save: "Enregistrer la sauvegarde",
    restoreDescription:
      "Ajoute des équipes depuis un fichier de sauvegarde. Tes équipes actuelles seront conservées.",
    chooseFile: "Choisir une sauvegarde",
    restore: "Ajouter les équipes",
    ready: (count: number) => `Équipes dans cette sauvegarde : ${count}`,
    error:
      "Impossible de lire ce fichier. Choisis une sauvegarde d'équipes enregistrée depuis ce site.",
    tooLarge:
      "Cette sauvegarde contient trop d’équipes à ajouter. Essaie un fichier de sauvegarde plus petit.",
    saveFailed: "Impossible d'enregistrer la sauvegarde. Réessaie.",
    saved: "Sauvegarde des équipes enregistrée",
    alreadySaved: "Ces équipes sont déjà dans ta collection.",
    filename: "my-pokemon-teams-backup.json",
  },
  generationTransfer: {
    title: "Changer de jeu ou de génération ?",
    compactTitle: "Changer de jeu ?",
    from: (where: string) => `Depuis ${where}`,
    fromLabel: "Depuis",
    toLabel: "Vers",
    unavailableHeading: "Ces Pokémon ne seront pas conservés",
    allUnavailableHeading: "Aucun Pokémon ne sera conservé",
    pokemonAdjusted: (pokemon: string) =>
      `${pokemon} nécessite des ajustements.`,
    adjustedHeading: "Tes Pokémon seront conservés avec des modifications",
    remainingAdjustedHeading:
      "Le reste de tes Pokémon sera conservé avec des modifications",
    universalChanges: "Pour tous les Pokémon conservés",
    levelSet: (level: number) => `Le niveau est fixé à ${level}.`,
    featuresUnused: (features: string, where: string) =>
      `Non utilisés dans ${where} : ${features}.`,
    dvsConvertedToIvs: "Les DV sont convertis en IV.",
    trainingSystemChanges: (from: string, to: string) =>
      `L’entraînement passe de ${from} à ${to}.`,
    removed: {
      item: "Objet supprimé",
      ability: "Talent supprimé",
      moves: "Capacités supprimées :",
      details: "Détails supprimés",
    },
    ivsUnused: (where: string) => `Les IV ne s’appliquent pas dans ${where}.`,
    ivsConvertedToDvs: "Les IV sont convertis en DV.",
    trainingLimited: "Ajustées aux limites de ce jeu.",
    trainingApproximate:
      "Conversion approximative ; les statistiques peuvent différer.",
    counts: {
      pokemon: (count: number) => `${count} Pokémon`,
      move: (count: number) =>
        `${count} ${count === 1 ? "capacité" : "capacités"}`,
      item: (count: number) => `${count} ${count === 1 ? "objet" : "objets"}`,
      ability: (count: number) =>
        `${count} ${count === 1 ? "talent" : "talents"}`,
    },
    modify: "Mettre à jour l’équipe actuelle",
    copy: "Copier dans une nouvelle équipe",
    createEmpty: "Créer une équipe vide",
    clearExisting: "Vider l’équipe existante",
    emptyTeamHint:
      "Créer une équipe vide laisse ton équipe d’origine inchangée.",
    carriedOver: "La copie laisse votre équipe originale inchangée.",
    pokemonUnavailable: (where: string) => `Indisponible dans ${where}.`,
    loses: "Perdra :",
    entryLabel: (label: string, value: string) => `${label} : ${value}`,
    entryRemoved: (value: string) => `Perdra ${value}.`,
    loadFailed:
      "Les données des générations n’ont pas pu être chargées. Rechargez la page.",
  },
  settings: {
    editTeamName: "Modifier le nom de l'équipe",
    teamName: "Nom de l'équipe",
  },
  validation: {
    empty: "L'équipe est vide.",
    notAllowed: (pokemon: string, where: string) =>
      `${pokemon} n'est pas autorisé en ${where}.`,
    wrongAbility: (pokemon: string, ability: string) =>
      `${pokemon} ne peut pas avoir le talent ${ability}.`,
    missingItem: (pokemon: string, items: string[]) =>
      `${pokemon} doit tenir ${items.join(" ou ")}.`,
    repeatedMove: (pokemon: string, move: string) =>
      `${pokemon} a ${move} en double.`,
    tooMuchTraining: (
      pokemon: string,
      total: number,
      max: number,
      unit: string,
    ) => `${pokemon} a ${total} ${unit} (${max} au maximum).`,
    tooMuchStatTraining: (pokemon: string, max: number, unit: string) =>
      `${pokemon} a plus de ${max} ${unit} dans une même stat.`,
    nicknameTooLong: (pokemon: string, max: number) =>
      `Le surnom de ${pokemon} doit comporter au maximum ${max} caractères.`,
    badLevel: (pokemon: string, max: number) =>
      `Le niveau de ${pokemon} doit être compris entre 1 et ${max}.`,
    teraType: (pokemon: string) =>
      `${pokemon} a un type Téracristal, qui n'existe qu'en ${generation(9)}.`,
    speciesClause: (species: string) =>
      `Deux Pokémon sont des ${species} (Species Clause).`,
    itemClause: (item: string) =>
      `Deux Pokémon tiennent ${item} (Item Clause).`,
  },
  importDialog: {
    importTitle: "Importer une équipe",
    editTitle: "Modifier le Pokepaste",
    importDescription:
      "Collez une équipe, ou une sauvegarde complète de plusieurs équipes, au format de {showdown}.",
    editDescription:
      "Voici le texte brut de votre équipe. Modifiez-le ici, ou collez-le dans {showdown}.",
    showdown: "Pokemon Showdown",
    importPlaceholder: "Collez une équipe ici",
    editPlaceholder: "Votre équipe est vide",
    label: "Texte brut de l'équipe Pokemon Showdown",
    kept: "Les surnoms, niveaux, sexes, chromatiques, types Téracristal, natures, EV et IV sont conservés. Le bonheur est aussi conservé si le jeu sélectionné le prend en charge.",
    import: "Importer",
    update: "Mettre à jour",
    imported: "Équipe importée",
    importedMany: (count: number) => `${count} équipes importées`,
    noChanges: "Aucune modification.",
    nothingFound: "Aucun Pokémon trouvé dans ce texte.",
  },
  deleteDialog: {
    title: (team: string) => `Supprimer ${team} ?`,
    thisTeam: "cette équipe",
    description:
      "L'équipe et ses Pokémon sont retirés de ce navigateur. Cette action est irréversible.",
  },

  // The footer and its dialogs
  footer: {
    typeChart: "Table des types",
    manual: "Manuel",
    manualTitle: "Manuel d'aide",
    credits: "Crédits",
    updates: (date: string) => `Mises à jour (${date})`,
    updateLog: "Journal des mises à jour",
    privacyPolicy: "Politique de confidentialité",
    colorScheme: "Thème de couleurs",
    systemTheme: "Utiliser le thème du système",
    lightTheme: "Utiliser le thème clair",
    darkTheme: "Utiliser le thème sombre",
    auto: "Auto",
    light: "Clair",
    dark: "Sombre",
    githubRepo: "Dépôt GitHub",
  },
  typeChart: {
    table: "Tableau",
    list: "Liste",
    infographic: "Infographie",
    tableAlt: "Table des types Pokémon de Bulbapedia",
    listAlt: "Table des types Pokémon en liste",
    infographicAlt: "Infographie de la table des types",
    listCaption: "Fort contre → Type → Fort contre",
    infographicCaption: "Valable aussi pour les Gén. 7 à 9",
  },
  credits: {
    showdown:
      "L'équipe de Pokemon Showdown a la générosité de me laisser utiliser tous ses sprites, icônes et données Pokémon. Absolument indispensable !",
    alsoThanks: "Merci aussi à",
    companies: "Nintendo, The Pokémon Company, Game Freak",
    companiesFor:
      "Pokémon lui-même, l'illustration Pokémon Shuffle à côté du titre et les sprites des Méga-Évolutions de Légendes : Z-A",
    typeChartTable: "Tableau de la table des types",
    fromBulbapedia: "De Bulbapedia",
    typeChartList: "Liste de la table des types",
    typeChartInfographic: "Infographie de la table des types",
    fromRPokemon: "De r/pokemon",
    typeColours: "Couleurs des types",
    typeColoursFor: "La couleur de chaque type dans les stats de l'équipe",
    stunfiskFor: "C'est une bonne communauté",
  },
  privacy: {
    playwire:
      "Tout ou partie de la publicité sur ce site Web ou cette application est gérée par Playwire LLC. Si les services publicitaires pour éditeurs de Playwire sont utilisés, Playwire LLC peut collecter et utiliser certaines données agrégées et anonymisées à des fins publicitaires. Pour en savoir plus sur les types de données collectées, l'utilisation qui en est faite et vos choix en tant qu'utilisateur, veuillez consulter {link}.",
    advertise: "Faire de la publicité sur ce site.",
  },
  manual: {
    teams: "Équipes",
    teamsQuestion: "Où mes équipes sont-elles enregistrées ?",
    teamsAnswer:
      "Vos équipes sont enregistrées dans ce navigateur : elles sont donc là à votre retour, mais pas sur un autre appareil. Le bouton Équipes les liste, et le menu de chaque équipe permet de la renommer, de choisir sa génération et son format, de la dupliquer, de la partager ou de la supprimer. Tout exporter télécharge toutes les équipes en texte Showdown, qu'Importer une équipe relit ensuite. La barre d'adresse contient toujours l'équipe actuelle : copier l'adresse (ou appuyer sur Partager) la partage.",
    teamsAnswer2:
      "Le bouton Plus affiche les outils d'équipe, les boutons Filtres et Trier, et le bouton Plus de détails. Annuler et Rétablir parcourent les modifications de l'équipe actuelle ; sur téléphone et tablette, ils se trouvent dans le menu Gérer.",
    generations: "Générations",
    generationsQuestion: "Que change la génération ?",
    generationsAnswer:
      "La génération, choisie en haut, ne liste que les Pokémon et les formes qui existaient à l'époque : les Méga-Évolutions dans les Gén. 6, 7 et 9, les formes Gigamax dans la Gén. 8, etc. Tout le reste reste à jour : les capacités, les talents, la table des types et les formats viennent des jeux les plus récents, donc une équipe d'une ancienne génération peut connaître des capacités qu'elle ne pouvait pas apprendre à l'époque.",
    advanced: "Plus de détails",
    advancedQuestion: "Surnoms, niveaux, natures, EV et IV",
    advancedAnswer:
      "Le bouton Plus de détails de chaque Pokémon définit son surnom, son niveau, son sexe, s'il est chromatique, son type Téracristal, sa nature, ses EV et ses IV, comme sur Pokemon Showdown. Ils accompagnent l'équipe dans les liens de partage et dans le texte de Copier le texte et de Modifier le Pokepaste.",
    matrix: "Analyse matricielle",
    matrixQuestion: "D'où viennent les scores par type ?",
    matrixAnswer:
      "La matrice, dans le panneau d'analyse, montre chaque type contre chaque Pokémon. Défense indique l'efficacité de chaque type attaquant contre chaque Pokémon, talent et objet compris, et Couverture indique l'efficacité de la meilleure capacité offensive de chaque Pokémon contre chaque type. Touchez une case pour voir la raison.",
    defence: "Défense de l'équipe",
    defenceQuestion:
      "Comment la défense de type de votre équipe est-elle calculée ?",
    defenceAnswer:
      "Chaque Pokémon de votre équipe est faible contre certains types et résistant à d'autres. Si un type est peu efficace contre l'un de vos Pokémon, vous gagnez des points. Mais s'il est super efficace, vous en perdez :",
    effectivenessHeading: "Efficacité du type contre vous",
    pointsHeading: "Points",
    effectiveness: {
      immune: "Aucun effet",
      quarter: "Efficacité 0,25x",
      half: "Efficacité 0,5x",
      neutral: "Efficacité 1x",
      double: "Super efficace (2x)",
      quadruple: "Super efficace (4x)",
    },
    note: "Remarque :",
    defenceNote:
      "Les talents comme Lévitation, Isograisse, Filtre et Herbivore sont pris en compte. Par exemple, si votre Archéodong a Lévitation, vous gagnez +1,5 pour le type Sol. Et s'il a Ignifugé, vous obtenez 0 pour le type Feu à la place.",
    coverage: "Couverture de types de l'équipe",
    coverageQuestion:
      "Comment la couverture de types de votre équipe est-elle calculée ?",
    coverageAnswer:
      "D'abord, qu'est-ce que la couverture de types ? Il s'agit du nombre de types contre lesquels vos capacités sont super efficaces. Si l'une de vos capacités est super efficace contre un type, vous gagnez +1. Si cette capacité est en plus du même type que le Pokémon qui l'utilise (STAB), vous gagnez encore +1.",
    coverageNote:
      "Les talents comme Peau Céleste et Peau Féérique sont pris en compte. Les capacités comme Lyophilisation et Flying Press aussi. Par exemple, Lyophilisation vous donne aussi +1 contre le type Eau.",
    formats: "Formats (ou tiers)",
    formatsQuestion: "Qu'est-ce que Ubers, OU, VGC, etc. ?",
    formatsAnswer:
      "Ubers, OU et {vgc} sont des formats (ou tiers) qui bannissent certains Pokémon et imposent certaines règles. Les Battle Stadium Singles/Doubles et le VGC sont les seuls approuvés par The Pokémon Company, tandis que les autres sont maintenus par {smogon}. Vous pouvez consulter {faq} ou {guide}.",
    vgc: "VGC",
    smogon: "Smogon",
    faq: "la FAQ de Smogon sur les tiers",
    guide: "ce guide qui décrit brièvement chaque tier",
    champions:
      "Le format Pokémon Champions (M-C) ne liste que les Pokémon utilisables dans Pokémon Champions sous la Regulation M-C, y compris leurs Méga-Évolutions.",
    terms: "Termes de la checklist de l'équipe",
    termsQuestion:
      "Que veulent dire piège d'entrée, phazer, volt-turn et compagnie ?",
    termsAnswer:
      "Smogon a un {dictionary}, mais il est un peu daté. Voici quelques termes qu'il ne couvre pas :",
    dictionary: "dictionnaire des termes Pokémon",
    termHeading: "Terme",
    definitionHeading: "Définition",
    definitions: [
      [
        "Defogger",
        "Un Pokémon qui connaît Anti-Brume (qui balaie les pièges d'entrée).",
      ],
      [
        "Récupération fiable",
        "Des capacités qui rendent à coup sûr 50 % ou plus de vos PV à chaque utilisation (par météo normale). Ex. : Soin, E-Coque, Lait à Boire, Paresse, Synthèse.",
      ],
      [
        "Capacités de statut",
        "Ici, il s'agit des capacités précises qui paralysent, brûlent ou empoisonnent, ainsi que de celles qui endorment. Ex. : Toxik, Feu Follet, Cage Éclair, Berceuse.",
      ],
      [
        "Capacité de boost",
        "Des capacités qui augmentent vos stats (de préférence de 2 niveaux ou plus), comme Danse Lames et Plénitude.",
      ],
      [
        "Objet Choix",
        "Un objet qui augmente une stat de 50 % mais vous bloque sur une seule capacité. Il en existe trois : Bandeau Choix, Lunettes Choix et Mouchoir Choix.",
      ],
    ] as [string, string][],
  },
};

export default fr;
