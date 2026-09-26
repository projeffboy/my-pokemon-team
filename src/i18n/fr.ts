import type { Messages } from "./en";

const generation = (generation: number) => `Gén. ${generation}`;

const fr: Messages = {
  // The header
  siteName: "My Pokemon Team",
  generation,
  generationSelect: "Génération",
  championsGeneration: "Gén. 9 · Champions",
  championsGenerationShort: "Gén. 9 (Champions)",
  championsGame: "Pokémon Champions",
  generationGames: {
    9: "Écarlate / Violet · Légendes : Z-A",
    8: "Épée / Bouclier · Diamant Étincelant / Perle Scintillante · Légendes : Arceus",
    7: "Soleil / Lune · Ultra-Soleil / Ultra-Lune · Let's Go",
    6: "X / Y · Rubis Oméga / Saphir Alpha",
    5: "Noir / Blanc · Noir 2 / Blanc 2",
    4: "Diamant / Perle / Platine · Or HeartGold / Argent SoulSilver",
    3: "Rubis / Saphir / Émeraude · Rouge Feu / Vert Feuille",
    2: "Or / Argent / Cristal",
    1: "Rouge / Bleu / Jaune",
  } as Record<number, string>,
  language: "Langue",
  feedback: {
    button: "Envoyer un commentaire",
    title: "Envoyer un commentaire",
    description:
      "Vous avez trouvé un bug ou vous avez une suggestion ? L'envoi ouvre votre application de messagerie avec un message adressé à {email}. Joignez le lien de votre équipe pour que le problème puisse être reproduit.",
    label: "Votre commentaire",
    placeholder: "ex. : Méganium n'a pas Éclat Magique",
    attachLink: "Joindre le lien de mon équipe",
    subject: "My Pokemon Team feedback",
    myTeam: "Mon équipe :",
    send: "Envoyer",
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
    randomize: "Aléatoire",
    randomized: "Équipe générée au hasard",
    shareTeam: "Partager l'équipe",
    shareTeamLink: "Partager le lien de l'équipe Pokémon",
    teamActions: "Actions de l'équipe",
    manageTeam: "Gérer l'équipe",
    manageTeamMenu: "Gérer l'équipe",
    nameAndFormat: "Nom et format",
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
    teamDuplicated: "Équipe dupliquée",
    teamDeleted: "Équipe supprimée",
    slots: "Emplacements de l'équipe Pokémon",
    slot: (slot: number) => `Pokémon ${slot}`,
    slotWith: (slot: number, pokemon: string | undefined) =>
      `Pokémon ${slot} (${pokemon ?? "vide"})`,
    slotPair: (first: string, second: string) => `${first} et ${second}`,
    moreTools: "Plus d'outils d'équipe",
    fewerTools: "Moins d'outils d'équipe",
    more: "Plus",
    less: "Moins",
    filters: "Filtres",
    sort: "Trier",
    random: "Aléatoire",
    randomFor: (slot: number) => `Pokémon aléatoire pour l'emplacement ${slot}`,
    advanced: "Avancé",
    advancedFor: (slot: number) =>
      `Options avancées pour l'emplacement ${slot}`,
    about: (pokemon: string) => `À propos de ${pokemon}`,
    previousSlot: "Déplacer vers l'emplacement précédent",
    nextSlot: "Déplacer vers l'emplacement suivant",
    name: "Nom",
    move: "Capacité",
    item: "Objet",
    ability: "Talent",
    // The accessible name of each input, e.g. "move2 du Pokémon 1"
    input: (slot: number, property: string) => `${property} du Pokémon ${slot}`,
    itemIcon: (item: string) => `Icône de ${item}`,
    nothingFound: "Aucun résultat",
    selectPokemonFirst: "(vous n'avez pas sélectionné de Pokémon)",
    nameListView: "Vue en liste de noms",
    listView: "Vue en liste",
    gridView: "Vue en grille",
    // The default names of new teams
    teamNumber: (number: number) => `Équipe ${number}`,
    unnamedTeam: "Équipe",
    copyOf: (name: string) => `Copie de ${name}`,
    learnsetsFailed:
      "Les listes de capacités n'ont pas pu être chargées. Rechargez la page pour réessayer.",
  },

  // The undo and redo buttons
  history: "Historique",
  undo: "Annuler",
  redo: "Rétablir",

  // The analysis panel
  stats: {
    teamStats: "Stats de l'équipe",
    teamStatsAndChecklist: "Stats et checklist de l'équipe",
    teamAnalysis: "Analyse de l'équipe",
    teamDefence: "Défense de l'équipe",
    teamTypeCoverage: "Couverture de types de l'équipe",
    teamChecklist: "Checklist de l'équipe",
    matrixAnalysis: "Analyse matricielle",
    defence: "Défense",
    coverage: "Couverture",
    teamStat: "Stat de l'équipe",
    backToTeamStats: "Retour aux stats de l'équipe",
    moreAnalyses: "Plus d'analyses",
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
    slot: (slot: number, pokemon: string | undefined) =>
      `Emplacement ${slot}${pokemon ? ` : ${pokemon}` : ""}`,
    weak: "×2 faiblesse",
    quadruple: "×4",
    resists: "½ résistance",
    quarter: "¼",
    immune: "0 immunité",
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
  advanced: {
    subtitle: (pokemon: string, slot: number) =>
      `${pokemon}, emplacement ${slot}`,
    nickname: "Surnom",
    level: "Niveau",
    gender: "Sexe",
    teraType: "Type Téracristal",
    nature: "Nature",
    shiny: "Chromatique",
    evs: "EV",
    ivs: "IV",
    evTotal: (total: number, max: number) =>
      `Total des EV : ${total} sur ${max}`,
    statEvs: (stat: string) => `EV ${stat}`,
    statIvs: (stat: string) => `IV ${stat}`,
  },
  info: {
    abilities: "Talents",
    baseStats: "Stats de base",
    total: (total: number) => `Total ${total}`,
    statValue: (stat: string, value: number) => `${stat} : ${value}`,
    weakTo: "Faible contre",
    smogonDex: "Dex Smogon",
  },

  // The Filters and Sort dialogs
  filters: {
    description: "Restreint la liste déroulante Nom de chaque emplacement.",
    format: "Format",
    type: "Type",
    region: "Région",
    moves: "Capacités",
    viable: "Viable",
    ability: "Talent",
  },
  sort: {
    sortBy: "Trier par",
    order: "Ordre",
    ascending: "Croissant",
    descending: "Décroissant",
    name: "Nom",
    num: "Numéro du Pokédex",
    format: "Format",
    bst: "Total des stats de base",
  },

  // The Teams, Name and Format, Import, and Delete dialogs
  teams: {
    description:
      "Touchez une équipe pour l'ouvrir. Le bouton ⋮ contient ses paramètres et ses actions.",
    newTeam: "Nouvelle équipe",
    randomTeam: "Équipe aléatoire",
    savedTeams: "Équipes enregistrées",
    optionsFor: (team: string) => `Options de ${team}`,
    load: (team: string) => `Charger ${team}`,
    importTeam: "Importer une équipe",
    exportAll: "Tout exporter",
    savedInBrowser: "Les équipes sont enregistrées dans ce navigateur.",
    exportFilename: "my-pokemon-teams.txt",
  },
  settings: {
    teamName: "Nom de l'équipe",
    checkTeamFor: (where: string) => `Vérifier l'équipe pour ${where}`,
    validFor: (where: string) => `L'équipe est valide pour ${where}.`,
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
    tooManyEvs: (pokemon: string, total: number, max: number) =>
      `${pokemon} a ${total} EV (${max} au maximum).`,
    tooManyStatEvs: (pokemon: string, max: number) =>
      `${pokemon} a plus de ${max} EV dans une même stat.`,
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
    kept: "Les surnoms, niveaux, sexes, chromatiques, types Téracristal, natures, EV et IV sont conservés. Le bonheur est ignoré.",
    import: "Importer",
    update: "Mettre à jour",
    imported: "Équipe importée",
    importedMany: (count: number) => `${count} équipes importées`,
    noChanges: "Aucune modification.",
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
      "Vos équipes sont enregistrées dans ce navigateur : elles sont donc là à votre retour, mais pas sur un autre appareil. Le bouton Équipes les liste, et le menu de chaque équipe permet de la renommer, de choisir sa génération et son format, de la dupliquer, de la partager ou de la supprimer. Tout exporter télécharge toutes les équipes en texte Showdown, qu'Importer une équipe relit ensuite. La barre d'adresse contient toujours l'équipe actuelle : copier l'adresse (ou appuyer sur Partager l'équipe) la partage.",
    teamsAnswer2:
      "Sur téléphone et tablette, le bouton Plus affiche les outils d'équipe, les boutons Filtres et Trier, et le bouton Avancé. Les boutons Annuler et Rétablir en bas parcourent les modifications de l'équipe actuelle.",
    generations: "Générations",
    generationsQuestion: "Que change la génération ?",
    generationsAnswer:
      "La génération, choisie en haut, ne liste que les Pokémon et les formes qui existaient à l'époque : les Méga-Évolutions dans les Gén. 6, 7 et 9, les formes Gigamax dans la Gén. 8, etc. Tout le reste reste à jour : les capacités, les talents, la table des types et les formats viennent des jeux les plus récents, donc une équipe d'une ancienne génération peut connaître des capacités qu'elle ne pouvait pas apprendre à l'époque.",
    advanced: "Options avancées",
    advancedQuestion: "Surnoms, niveaux, natures, EV et IV",
    advancedAnswer:
      "Le bouton Avancé de chaque Pokémon définit son surnom, son niveau, son sexe, s'il est chromatique, son type Téracristal, sa nature, ses EV et ses IV, comme sur Pokemon Showdown. Ils accompagnent l'équipe dans les liens de partage et dans le texte de Copier le texte et de Modifier le Pokepaste, et la vérification de la fenêtre Nom et format signale les EV au-delà de 510, les capacités en double, les Pokémon bannis et les clauses.",
    matrix: "Analyse matricielle",
    matrixQuestion: "D'où viennent les scores par type ?",
    matrixAnswer:
      "La matrice, dans le menu du panneau d'analyse, montre chaque type contre chaque Pokémon. Défense indique l'efficacité de chaque type attaquant contre chaque Pokémon, talent et objet compris, et Couverture indique l'efficacité de la meilleure capacité offensive de chaque Pokémon contre chaque type. Touchez une case pour voir la raison.",
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
