import type { Messages } from "./en";

const generation = (generation: number) => `第${generation}世代`;

// A slot's inputs, for their accessible names
const inputNames: Record<string, string> = {
  name: "名前",
  move1: "技1",
  move2: "技2",
  move3: "技3",
  move4: "技4",
  item: "持ち物",
  ability: "特性",
};

const ja: Messages = {
  // The header
  generation,
  generationGames: {
    9: "スカーレット バイオレット",
    8: "ソード シールド / ブリリアントダイヤモンド シャイニングパール",
    7: "サン ムーン / ウルトラサン ウルトラムーン",
    6: "X Y / オメガルビー アルファサファイア",
    5: "ブラック ホワイト / ブラック2 ホワイト2",
    4: "ダイヤモンド パール プラチナ / ハートゴールド ソウルシルバー",
    3: "ルビー サファイア エメラルド / ファイアレッド リーフグリーン",
    2: "金 銀 クリスタル",
    1: "赤 青 ピカチュウ",
  },
  generationSelect: "世代",
  comingSoon: "近日公開",
  championsGeneration: "第9世代 · Champions",
  championsGenerationShort: "第9世代（Champions）",
  language: "言語",
  languageFailed: "言語を読み込めませんでした。もう一度お試しください。",
  feedback: {
    button: "フィードバックを送る",
    title: "フィードバックを送る",
    description:
      "バグを見つけた、またはアイデアがありますか？お知らせください。",
    label: "フィードバック",
    placeholder: "例: メガニウムがマジカルシャインを覚えられない",
    attachLink: "チームのリンクを添付する",
    attachScreenshot: "ページのスクリーンショットを添付する",
    addImage: "画像を追加",
    imageUnreadable:
      "この画像は読み込めませんでした。PNG または JPEG をお試しください。",
    imagesTooLarge: "画像の合計サイズが大きすぎます。先に1枚削除してください。",
    email: "メールアドレス（任意）",
    emailHelper: "返信が必要な場合のみ",
    caption: "意見",
    send: "送信",
    sent: "ありがとうございます！フィードバックを送信しました。",
    failed:
      "送信できませんでした。もう一度お試しいただくか、{email} までメールしてください。",
  },

  // Buttons shared by several dialogs
  cancel: "キャンセル",
  close: "閉じる",
  done: "完了",
  goBack: "戻る",
  save: "保存",
  reset: "リセット",
  clear: "クリア",
  all: "すべて",
  any: "指定なし",
  none: "なし",
  nothing: "なし",

  // The team column
  team: {
    teams: "チーム一覧",
    randomizedTeam: "ランダム編成しました",
    randomizedPokemon: "ポケモンをランダムに選びました",
    randomizedPokemonDetails: (details: string) =>
      `ポケモンの${details}をランダムに選びました`,
    shareTeam: "共有",
    shareTeamLink: "ポケモンチームのリンクを共有",
    teamActions: "チームの操作",
    manageTeam: "管理",
    manageTeamMenu: "チームの管理",
    duplicate: "複製",
    copyText: "テキストをコピー",
    editPokepaste: "Pokepasteを編集",
    delete: "削除",
    importTeam: "チームをインポート",
    share: "共有",
    teamEmpty: "ポケモンチームは空です",
    linkCopied: "ポケモンチームのリンクをコピーしました",
    linkNotCopied: "リンクをコピーできませんでした。",
    nothingToCopy: "チームが空なので、コピーするものがありません。",
    teamCopied: "チームをコピーしました。",
    teamNotCopied: "チームをコピーできませんでした。",
    cannotDuplicateEmptyTeam: "空のチームは複製できません",
    teamDuplicated: "チームを複製しました",
    teamDeleted: "チームを削除しました",
    slots: "ポケモンチームのスロット",
    slot: (slot: number) => `ポケモン${slot}`,
    slotWith: (slot: number, pokemon: string | undefined) =>
      `ポケモン${slot}（${pokemon ?? "空"}）`,
    slotPair: (first: string, second: string) => `${first}と${second}`,
    moreTools: "その他のチームツールを表示",
    fewerTools: "その他のチームツールを隠す",
    advancedMode: "詳細",
    more: "その他",
    less: "隠す",
    filters: "絞り込み",
    sort: "並べ替え",
    random: "ランダム",
    randomize: "ランダム化",
    randomizePokemon: "ポケモンをランダムに選ぶ",
    randomizeDetails: (details: string) => `${details}をランダムに選ぶ`,
    randomFor: (slot: number) => `スロット${slot}にランダムなポケモン`,
    advanced: "その他の詳細",
    advancedFor: (slot: number) => `スロット${slot}のその他の詳細`,
    about: (pokemon: string) => `${pokemon}について`,
    dragHint: "長押しドラッグで並べ替え",
    moveToSlot: (pokemon: string) => `${pokemon}を別のスロットへ移動`,
    name: "名前",
    move: "技",
    item: "持ち物",
    ability: "特性",
    hidden: "隠れ特性",
    input: (slot: number, property: string) =>
      `ポケモン${slot}の${inputNames[property] ?? property}`,
    itemIcon: (item: string) => `${item}のアイコン`,
    nothingFound: "見つかりません",
    noOtherMoves: "ほかに選べる技はありません。",
    selectPokemonFirst: "（ポケモンが選択されていません）",
    list: "リスト",
    grid: "グリッド",
    bigGrid: "大きなグリッド",
    pokemonInSlot: (pokemon: string, slot: number) =>
      `${pokemon}をスロット${slot}に配置`,
    removedPokemon: (pokemon: string, slot: number) =>
      `スロット${slot}から${pokemon}を削除`,
    addedValue: (value: string, pokemon: string) =>
      `${pokemon}に${value}を追加`,
    removedValue: (value: string, pokemon: string) =>
      `${pokemon}から${value}を削除`,
    replacedValue: (previous: string, value: string, pokemon: string) =>
      `${pokemon}の${previous}を${value}に変更`,
    setValue: (label: string, value: string, pokemon: string) =>
      `${pokemon}の${label}を${value}に設定`,
    swappedSlots: (first: string, second: string) =>
      `${first}と${second}を入れ替え`,
    moreChanges: (count: number) => `ほか${count}件の変更`,
    undoAction: (action: string) => `元に戻す：${action}`,
    redoAction: (action: string) => `やり直す：${action}`,
    randomizeTeamAction: "チームをランダム生成",
    nameListView: "名前リスト表示",
    listView: "リスト表示",
    gridView: "グリッド表示",
    bigGridView: "大きなグリッド表示",
    // The default names of new teams
    teamNumber: (number: number) => `チーム${number}`,
    unnamedTeam: "チーム",
    copyOf: (name: string) => `${name}のコピー`,
    learnsetsFailed:
      "技のリストを読み込めませんでした。ページを再読み込みしてもう一度お試しください。",
  },

  // The undo and redo buttons
  undo: "元に戻す",
  redo: "やり直す",

  // The analysis panel
  stats: {
    teamStats: "チーム分析",
    teamAnalysis: "チームの分析",
    teamDefence: "チームの耐性",
    teamTypeCoverage: "チームの攻撃範囲",
    teamChecklist: "チームチェックリスト",
    matrixAnalysis: "マトリックス分析",
    defence: "耐性",
    coverage: "攻撃範囲",
    checklist: "チェック",
    matrix: "マトリックス",
    score: (type: string, score: string) => `${type}のスコア: ${score}`,
    selectPokemonFirst: "まずポケモンを選んでください。",
    typeDoes: "{type}タイプの技は…",
    multiplier: (multiplier: number) => `${multiplier}倍`,
    toPokemon: (pokemon: string) => `対 ${pokemon}`,
    superEffectiveAgainst: "{type}タイプに効果抜群:",
    checked: "チェック済み",
    unchecked: "未チェック",
  },
  checklist: {
    groups: {
      general: "全般",
      defensive: "防御",
      offensive: "攻撃",
    },
    // Shorter labels for screens at lg and below, then shorter still at md and below
    items: {
      entryHazard: { label: "設置技", short: "設置" },
      spinner: { label: "設置技の除去", short: "設置除去", shorter: "除去" },
      recovery: {
        label: "安定した回復技",
        short: "回復技",
        shorter: "回復",
      },
      cleric: { label: "状態異常回復" },
      status: { label: "状態異常技", short: "状態異常" },
      phazer: { label: "強制交代技" },
      boosting: { label: "積み技", short: "積み" },
      voltTurn: {
        label: "ボルトチェンジ系",
        short: "ボルチェン",
        shorter: "交代技",
      },
      choice: { label: "こだわりアイテム", short: "こだわり" },
    },
  },
  matrix: {
    matrix: "マトリックス",
    defenceDescription: "各攻撃タイプが各ポケモンにどれだけ効くか。",
    coverageDescription:
      "各ポケモンの最も効果的な技が各タイプにどれだけ効くか。",
    tapForReason: "セルをタップすると理由が表示されます。",
    // The column that sums each row, as the Team Defence and Team Type Coverage scores do
    teamScore: "チームのスコア",
    slot: (slot: number, pokemon: string | undefined) =>
      `スロット${slot}${pokemon ? `: ${pokemon}` : ""}`,
    weak: "弱点",
    resists: "耐性",
    immune: "無効",
    // The same legend for the coverage matrix, where a strong hit is the good outcome
    superEffective: "効果抜群",
    resisted: "いまひとつ",
    noEffect: "効果なし",
    defenceReason: (
      type: string,
      multiplier: number,
      pokemon: string,
      types: string,
      cause: string | undefined,
    ) =>
      `${type}タイプの技は${pokemon}（${types}）に${multiplier}倍${cause ? `（${cause}の影響）` : ""}`,
    coverageReason: (
      pokemon: string,
      move: string,
      type: string,
      multiplier: number,
      target: string,
    ) => `${pokemon}の${move}（${type}）は${target}タイプに${multiplier}倍`,
    noDamagingMove: (pokemon: string) => `${pokemon}は攻撃技を持っていません`,
  },
  // Where a full type name does not fit
  // One kanji per type, as Japanese fan sites abbreviate them, since the kana names wrap
  typeAbbreviations: {
    Bug: "虫",
    Dark: "悪",
    Dragon: "竜",
    Electric: "電",
    Fairy: "妖",
    Fighting: "闘",
    Fire: "炎",
    Flying: "飛",
    Ghost: "霊",
    Grass: "草",
    Ground: "地",
    Ice: "氷",
    Normal: "無",
    Poison: "毒",
    Psychic: "超",
    Rock: "岩",
    Steel: "鋼",
    Water: "水",
  } as Record<string, string>,

  // Set details, in the Advanced and info dialogs
  statNames: {
    hp: "HP",
    atk: "攻撃",
    def: "防御",
    spa: "特攻",
    spd: "特防",
    spe: "素早",
  },
  statFullNames: {
    hp: "HP",
    atk: "こうげき",
    def: "ぼうぎょ",
    spa: "とくこう",
    spd: "とくぼう",
    spe: "すばやさ",
  },
  genders: { M: "オス", F: "メス", N: "性別不明" },
  natureLabel: (
    nature: string,
    plus: string | undefined,
    minus: string | undefined,
  ) =>
    plus && minus ?
      `${nature}（+${plus}、-${minus}）`
    : `${nature}（補正なし）`,
  gameVariantsCompact: {
    "Legends: Arceus": "LEGENDS アルセウス",
    "Legends: Z-A": "LEGENDS Z-A",
  },
  gameVariants: {
    "Let’s Go": "Let’s Go! ピカチュウ / イーブイ",
    "Legends: Arceus": "LEGENDS アルセウス",
    "Legends: Z-A": "LEGENDS Z-A",
  },
  advanced: {
    subtitle: (pokemon: string, slot: number) => `${pokemon}、スロット${slot}`,
    dvs: "個体値（DV）",
    statExperience: "能力値の経験値",
    effortLevels: "がんばレベル",
    avs: "覚醒値",
    statAlignment: "能力補正",
    nickname: "ニックネーム",
    nicknameLimit: (max: number) => `最大${max}文字です。`,
    level: "レベル",
    happiness: "なつき度",
    gender: "性別",
    teraType: "テラスタイプ",
    nature: "性格",
    shiny: "色違い",
    sps: "SP",
    spTotal: (total: number, max: number) => `SP合計: ${total} / ${max}`,
    statSps: (stat: string) => `${stat}のSP`,
    evs: "努力値",
    ivs: "個体値",
    evTotal: (total: number, max: number) => `努力値合計: ${total} / ${max}`,
    statEvs: (stat: string) => `${stat}の努力値`,
    statIvs: (stat: string) => `${stat}の個体値`,
  },
  info: {
    special: "とくしゅ",
    abilities: "特性",
    baseStats: "種族値",
    total: (total: number) => `合計 ${total}`,
    statValue: (stat: string, value: number) => `${stat}: ${value}`,
    weakTo: "弱点",
    smogonDex: "Smogon図鑑",
    bulbapedia: "Bulbapedia",
    serebii: "Serebii",
    showdownDex: "Showdown図鑑",
  },

  // The Filters and Sort dialogs
  filters: {
    format: "フォーマット",
    type: "タイプ",
    region: "地方",
    moves: "技",
    viable: "実戦向き",
    ability: "特性",
  },
  sort: {
    pokemon: "ポケモン",
    sortBy: "並べ替え基準",
    order: "順序",
    ascending: "昇順",
    descending: "降順",
    name: "名前",
    num: "図鑑番号",
    format: "フォーマット",
    bst: "種族値合計",
  },

  // The Teams, Team name, Import, and Delete dialogs
  teams: {
    newTeam: "新しいチーム",
    randomTeam: "ランダムチーム",
    randomTeamLabels: ["チームをランダムにする", "ランダムチーム", "ランダム"],
    savedTeams: "保存済みのチーム",
    optionsFor: (team: string) => `${team}のオプション`,
    load: (team: string) => `${team}を開く`,
    importTeam: "チームをインポート",
    exportAll: "すべてエクスポート",
    copyAll: "すべてコピー",
    savedInBrowser: "チームはこのブラウザに保存されます。",
    saveFailed:
      "ブラウザにチームを保存できませんでした。バックアップを保存してチームを残しましょう。",
    // The chip on the team being edited, and the one on each team that a tap opens
    current: "表示中",
    open: "開く",
    newTeamCreated: "空のチームを作成しました",
    emptyTeamOpened: "空のチームを開きました",
    randomTeamCreated: "ランダムなチームを作成しました",
    exported: "すべてのチームをエクスポートしました",
    copiedAll: "すべてのチームをコピーしました",
    notCopiedAll: "チームをコピーできませんでした。",
    exportFilename: "my-pokemon-teams.txt",
  },
  teamBackup: {
    title: "チームのバックアップ",
    description:
      "チームの名前、ゲーム、フィルター、ポケモンの詳細を含め、すべてのチームを保存します。",
    save: "バックアップを保存",
    restoreDescription:
      "バックアップファイルからチームを追加します。今あるチームはそのまま残ります。",
    chooseFile: "バックアップファイルを選ぶ",
    restore: "チームを追加",
    ready: (count: number) => `このバックアップのチーム数: ${count}`,
    error:
      "このファイルを読み込めませんでした。このサイトで保存したチームのバックアップを選んでください。",
    tooLarge:
      "このバックアップはチーム数が多すぎるため追加できません。チーム数の少ないバックアップファイルをお試しください。",
    saveFailed: "バックアップを保存できませんでした。もう一度お試しください。",
    saved: "チームのバックアップを保存しました",
    alreadySaved: "これらのチームはすでにコレクションにあります。",
    filename: "my-pokemon-teams-backup.json",
  },
  generationTransfer: {
    title: "ゲームまたは世代を変更しますか？",
    compactTitle: "ゲームを変更しますか？",
    from: (where: string) => `変更元：${where}`,
    fromLabel: "変更元",
    toLabel: "変更先",
    unavailableHeading: "これらのポケモンは引き継がれません",
    allUnavailableHeading: "すべてのポケモンは引き継がれません",
    pokemonAdjusted: (pokemon: string) => `${pokemon}の調整が必要です。`,
    adjustedHeading: "あなたのポケモンは変更を加えて引き継がれます",
    remainingAdjustedHeading: "残りのポケモンは変更を加えて引き継がれます",
    universalChanges: "引き継がれるすべてのポケモンに適用",
    levelSet: (level: number) => `レベルは${level}になります。`,
    featuresUnused: (features: string, where: string) =>
      `${where}では使用されません：${features}。`,
    dvsConvertedToIvs: "DVはIVに変換されます。",
    trainingSystemChanges: (from: string, to: string) =>
      `育成方式が${from}から${to}に変わります。`,
    removed: {
      item: "削除される持ち物",
      ability: "削除される特性",
      moves: "削除される技：",
      details: "削除される詳細",
    },
    ivsUnused: (where: string) => `${where}では個体値は適用されません。`,
    ivsConvertedToDvs: "IVはDVに変換されます。",
    trainingLimited: "このゲームの上限に合わせて調整されます。",
    trainingApproximate: "近似変換のため、能力値が異なる場合があります。",
    counts: {
      pokemon: (count: number) => `ポケモン${count}匹`,
      move: (count: number) => `技${count}個`,
      item: (count: number) => `持ち物${count}個`,
      ability: (count: number) => `特性${count}個`,
    },
    modify: "現在のチームを更新",
    copy: "新しいチームにコピー",
    createEmpty: "空のチームを作成",
    clearExisting: "現在のチームを空にする",
    emptyTeamHint: "空のチームを作成しても、元のチームは変更されません。",
    carriedOver: "コピーしても、元のチームは変更されません。",
    pokemonUnavailable: (where: string) => `${where}では使用できません。`,
    loses: "失われる内容：",
    entryLabel: (label: string, value: string) => `${label}：${value}`,
    entryRemoved: (value: string) => `${value}が失われます。`,
    loadFailed:
      "世代データを読み込めませんでした。ページを再読み込みしてください。",
  },
  settings: {
    editTeamName: "チーム名を編集",
    teamName: "チーム名",
  },
  validation: {
    empty: "チームが空です。",
    notAllowed: (pokemon: string, where: string) =>
      `${pokemon}は${where}では使用できません。`,
    wrongAbility: (pokemon: string, ability: string) =>
      `${pokemon}は${ability}を持てません。`,
    missingItem: (pokemon: string, items: string[]) =>
      `${pokemon}には${items.join("または")}を持たせる必要があります。`,
    repeatedMove: (pokemon: string, move: string) =>
      `${pokemon}が${move}を2回覚えています。`,
    tooManyEvs: (pokemon: string, total: number, max: number) =>
      `${pokemon}の努力値の合計が${total}です（最大${max}）。`,
    tooManyStatEvs: (pokemon: string, max: number) =>
      `${pokemon}の1つのステータスの努力値が${max}を超えています。`,
    nicknameTooLong: (pokemon: string, max: number) =>
      `${pokemon}のニックネームは${max}文字以内にしてください。`,
    badLevel: (pokemon: string, max: number) =>
      `${pokemon}のレベルは1から${max}までにしてください。`,
    teraType: (pokemon: string) =>
      `${pokemon}にテラスタイプが設定されていますが、テラスタイプは${generation(9)}にしか存在しません。`,
    speciesClause: (species: string) =>
      `${species}が2体います（Species Clause）。`,
    itemClause: (item: string) => `2体が${item}を持っています（Item Clause）。`,
  },
  importDialog: {
    importTitle: "チームをインポート",
    editTitle: "Pokepasteを編集",
    importDescription:
      "{showdown}の形式で、チーム、または複数のチームを含むバックアップ全体を貼り付けてください。",
    editDescription:
      "これはチームの生テキストです。ここで編集するか、{showdown}に貼り付けてください。",
    showdown: "Pokemon Showdown",
    importPlaceholder: "ここにチームを貼り付け",
    editPlaceholder: "チームは空です",
    label: "Pokemon Showdownチームの生テキスト",
    kept: "ニックネーム、レベル、性別、色違い、テラスタイプ、性格、努力値、個体値は保持されます。選択したゲームで対応している場合、なつき度も保持されます。",
    import: "インポート",
    update: "更新",
    imported: "チームをインポートしました",
    importedMany: (count: number) => `${count}個のチームをインポートしました`,
    noChanges: "変更はありません。",
    nothingFound: "そのテキストにポケモンが見つかりませんでした。",
  },
  deleteDialog: {
    title: (team: string) => `${team}を削除しますか？`,
    thisTeam: "このチーム",
    description:
      "チームとそのポケモンがこのブラウザから削除されます。この操作は元に戻せません。",
  },

  // The footer and its dialogs
  footer: {
    typeChart: "タイプ相性表",
    manual: "マニュアル",
    manualTitle: "マニュアル・ヘルプガイド",
    credits: "クレジット",
    updates: (date: string) => `更新情報（${date}）`,
    updateLog: "更新履歴",
    privacyPolicy: "プライバシーポリシー",
    colorScheme: "配色",
    systemTheme: "システムのテーマを使用",
    lightTheme: "ライトテーマを使用",
    darkTheme: "ダークテーマを使用",
    auto: "自動",
    light: "ライト",
    dark: "ダーク",
    githubRepo: "GitHubリポジトリ",
  },
  typeChart: {
    table: "表",
    list: "リスト",
    infographic: "インフォグラフィック",
    tableAlt: "Bulbapediaのポケモンタイプ相性表",
    listAlt: "リスト形式のポケモンタイプ相性表",
    infographicAlt: "インフォグラフィック形式のタイプ相性表",
    listCaption: "効果抜群 → タイプ → 効果抜群",
    infographicCaption: "第7〜9世代にも当てはまります",
  },
  credits: {
    showdown:
      "Pokemon Showdownの皆さんは、スプライト、アイコン、ポケモンデータのすべてを快く使わせてくれています。本当に欠かせない存在です！",
    alsoThanks: "また、次の方々にも感謝します",
    companies: "Nintendo、株式会社ポケモン、Game Freak",
    companiesFor:
      "ポケモンそのもの、タイトル横のポケとるのアート、LEGENDS Z-Aのメガシンカのスプライト",
    typeChartTable: "タイプ相性表（表）",
    fromBulbapedia: "Bulbapediaより",
    typeChartList: "タイプ相性表（リスト）",
    typeChartInfographic: "タイプ相性表（インフォグラフィック）",
    fromRPokemon: "r/pokemonより",
    typeColours: "タイプの色",
    typeColoursFor: "チーム分析で使っている各タイプの色",
    stunfiskFor: "良いコミュニティです",
  },
  privacy: {
    playwire:
      "本ウェブサイトまたはアプリの広告は、その全部または一部をPlaywire LLCが管理しています。Playwireのパブリッシャー向け広告サービスが利用される場合、Playwire LLCは広告目的で、集計および匿名化された特定のデータを収集・使用することがあります。収集されるデータの種類、データの使用方法、ユーザーとしての選択肢について詳しくは、{link}をご覧ください。",
    advertise: "このサイトに広告を掲載する。",
  },
  manual: {
    teams: "チーム",
    teamsQuestion: "チームはどこに保存されますか？",
    teamsAnswer:
      "チームはこのブラウザに保存されるので、次に来たときもここにありますが、別の端末には引き継がれません。「チーム一覧」ボタンで一覧が表示され、各チームのメニューから名前の変更、世代とフォーマットの設定、複製、共有、削除ができます。「すべてエクスポート」はすべてのチームをShowdownのテキストとしてダウンロードし、「チームをインポート」でそれを読み戻せます。アドレスバーには常に現在のチームが入っているので、アドレスをコピーする（または「共有」を押す）とチームを共有できます。",
    teamsAnswer2:
      "「その他」ボタンでチームツール、「絞り込み」と「並べ替え」のボタン、「その他の詳細」ボタンが表示されます。「元に戻す」と「やり直す」で現在のチームの変更を行き来できます。スマートフォンやタブレットでは「管理」メニューにあります。",
    generations: "世代",
    generationsQuestion: "世代を変えると何が変わりますか？",
    generationsAnswer:
      "上部で選んだ世代に存在したポケモンとフォルムだけが一覧に表示されます。メガシンカは第6・7・9世代、キョダイマックスのすがたは第8世代、といった具合です。それ以外はすべて最新のままです。技、特性、タイプ相性表、フォーマットは最新の作品に基づくので、古い世代のチームが当時は覚えられなかった技を覚えていることがあります。",
    advanced: "その他の詳細",
    advancedQuestion: "ニックネーム、レベル、性格、努力値、個体値",
    advancedAnswer:
      "各ポケモンの「その他の詳細」ボタンで、Pokemon Showdownと同じように、ニックネーム、レベル、性別、色違い、テラスタイプ、性格、努力値、個体値を設定できます。これらは共有リンクや「テキストをコピー」「Pokepasteを編集」のテキストにチームと一緒に含まれます。",
    matrix: "マトリックス分析",
    matrixQuestion: "タイプのスコアはどこから来ていますか？",
    matrixAnswer:
      "分析パネルにあるマトリックスは、すべてのタイプとすべてのポケモンの相性を表示します。「耐性」は各攻撃タイプが各ポケモンにどれだけ効くかで、特性と持ち物も考慮されます。「攻撃範囲」は各ポケモンの最も効果的な攻撃技が各タイプにどれだけ効くかです。セルをタップすると理由が表示されます。",
    defence: "チームの耐性",
    defenceQuestion: "チームのタイプ耐性はどう計算されますか？",
    defenceAnswer:
      "チームの各ポケモンには、弱点のタイプと耐性のあるタイプがあります。あるタイプがポケモンの1体に対して「いまひとつ」なら得点が加算され、「効果抜群」なら減点されます:",
    effectivenessHeading: "あなたへのタイプ相性",
    pointsHeading: "ポイント",
    effectiveness: {
      immune: "効果なし",
      quarter: "0.25倍",
      half: "0.5倍",
      neutral: "1倍",
      double: "2倍（効果抜群）",
      quadruple: "4倍（効果抜群）",
    },
    note: "注:",
    defenceNote:
      "ふゆう、あついしぼう、フィルター、そうしょくなどの特性も考慮されます。例えば、ドータクンの特性がふゆうなら、じめんタイプに対して+1.5になります。たいねつなら、ほのおタイプに対して代わりに0になります。",
    coverage: "チームの攻撃範囲",
    coverageQuestion: "チームのタイプ攻撃範囲はどう計算されますか？",
    coverageAnswer:
      "まず、攻撃範囲とは何でしょうか？それは、あなたの技がいくつのタイプに対して効果抜群かということです。技の1つがあるタイプに効果抜群なら+1、さらにその技が使うポケモンと同じタイプ（STAB、タイプ一致）なら、もう+1です。",
    coverageNote:
      "スカイスキンやフェアリースキンなどの特性も考慮されます。フリーズドライやフライングプレスのような技も同様です。例えば、フリーズドライならみずタイプに対しても+1になります。",
    formats: "フォーマット（ティア）",
    formatsQuestion: "Ubers、OU、VGCなどとは何ですか？",
    formatsAnswer:
      "Ubers、OU、{vgc}は、一部のポケモンを禁止し、特定のルールを課すフォーマット（ティア）です。バトルスタジアムのシングル／ダブルとVGCだけが株式会社ポケモンの公式ルールで、それ以外は{smogon}が管理しています。{faq}や{guide}も参考にしてください。",
    vgc: "VGC",
    smogon: "Smogon",
    faq: "SmogonのティアについてのFAQ",
    guide: "各ティアを簡単に説明したこのガイド",
    champions:
      "Pokemon Champions（M-C）フォーマットには、Regulation M-CのPokemon Championsで使えるポケモンだけが、メガシンカを含めて表示されます。",
    terms: "チームチェックリストの用語",
    termsQuestion:
      "設置技、強制交代技、ボルトチェンジ系などはそもそもどういう意味ですか？",
    termsAnswer:
      "Smogonには{dictionary}がありますが、少し古いです。そこに載っていない用語をいくつか挙げます:",
    dictionary: "ポケモン用語の辞書",
    termHeading: "用語",
    definitionHeading: "定義",
    definitions: [
      [
        "設置技の除去",
        "こうそくスピンやきりばらいなど、設置技を取り除く技を覚えたポケモン。",
      ],
      [
        "安定した回復技",
        "使うたびにHPの50%以上を確実に回復する技（通常の天候のとき）。例: じこさいせい、タマゴうみ、ミルクのみ、なまける、こうごうせい。",
      ],
      [
        "状態異常技",
        "ここでは、命中率の高いまひ、やけど、どくにする技と、眠らせる技を指します。例: どくどく、おにび、でんじは、うたう。",
      ],
      [
        "積み技",
        "つるぎのまいやめいそうのように、自分の能力を（できれば2段階以上）上げる技。",
      ],
      [
        "こだわりアイテム",
        "能力を50%上げる代わりに、1つの技しか出せなくなる持ち物。こだわりハチマキ、こだわりメガネ、こだわりスカーフの3つがあります。",
      ],
    ] as [string, string][],
  },
};

export default ja;
