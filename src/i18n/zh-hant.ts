import type { Messages } from "./en";

const generation = (generation: number) => `第${generation}世代`;

const zhHant: Messages = {
  // The header
  siteName: "My Pokemon Team",
  generation,
  generationSelect: "世代",
  championsGeneration: "第9世代 · Champions",
  championsGenerationShort: "第9世代（Champions）",
  championsGame: "Pokemon Champions",
  generationGames: {
    9: "朱／紫 · 傳說 Z-A",
    8: "劍／盾 · 晶燦鑽石／明亮珍珠 · 傳說 阿爾宙斯",
    7: "太陽／月亮 · 究極之日／究極之月 · Let's Go",
    6: "X／Y · 終極紅寶石／始源藍寶石",
    5: "黑／白 · 黑2／白2",
    4: "鑽石／珍珠／白金 · 心金／魂銀",
    3: "紅寶石／藍寶石／綠寶石 · 火紅／葉綠",
    2: "金／銀／水晶",
    1: "紅／藍／黃",
  } as Record<number, string>,
  language: "語言",
  feedback: {
    button: "意見回饋",
    title: "意見回饋",
    description:
      "發現錯誤或有建議嗎？按下傳送會開啟你的電子郵件程式，收件人為 {email}。請附上你的隊伍連結，以便重現問題。",
    label: "你的意見",
    placeholder: "例如：大竺葵沒有魔法閃耀",
    attachLink: "附上我的隊伍連結",
    subject: "My Pokemon Team feedback",
    myTeam: "我的隊伍：",
    send: "傳送",
  },

  // Buttons shared by several dialogs
  cancel: "取消",
  close: "關閉",
  done: "完成",
  goBack: "返回",
  save: "儲存",
  reset: "重設",
  clear: "清除",
  all: "全部",
  any: "不限",
  none: "無",
  nothing: "無",

  // The team column
  team: {
    teams: "隊伍列表",
    randomize: "隨機組隊",
    randomized: "已隨機組隊",
    shareTeam: "分享隊伍",
    shareTeamLink: "分享寶可夢隊伍連結",
    teamActions: "隊伍操作",
    manageTeam: "管理隊伍",
    manageTeamMenu: "管理隊伍",
    nameAndFormat: "名稱與格式",
    duplicate: "建立副本",
    copyText: "複製文字",
    editPokepaste: "編輯 Pokepaste",
    delete: "刪除",
    importTeam: "匯入隊伍",
    share: "分享",
    teamEmpty: "寶可夢隊伍是空的",
    linkCopied: "已複製寶可夢隊伍連結",
    linkNotCopied: "無法複製連結。",
    nothingToCopy: "隊伍是空的，沒有可複製的內容。",
    teamCopied: "已複製隊伍。",
    teamNotCopied: "無法複製隊伍。",
    teamDuplicated: "已建立隊伍副本",
    teamDeleted: "已刪除隊伍",
    slots: "寶可夢隊伍欄位",
    slot: (slot: number) => `寶可夢 ${slot}`,
    slotWith: (slot: number, pokemon: string | undefined) =>
      `寶可夢 ${slot}（${pokemon ?? "空"}）`,
    slotPair: (first: string, second: string) => `${first} 與 ${second}`,
    moreTools: "更多隊伍工具",
    fewerTools: "收起隊伍工具",
    more: "更多",
    less: "收起",
    filters: "篩選",
    sort: "排序",
    random: "隨機",
    randomFor: (slot: number) => `為第 ${slot} 格隨機選擇寶可夢`,
    advanced: "進階",
    advancedFor: (slot: number) => `第 ${slot} 格的進階選項`,
    about: (pokemon: string) => `關於${pokemon}`,
    previousSlot: "移到上一格",
    nextSlot: "移到下一格",
    name: "名稱",
    move: "招式",
    item: "道具",
    ability: "特性",
    // The accessible name of each input, e.g. "寶可夢 1 的 move2"
    input: (slot: number, property: string) => `寶可夢 ${slot} 的 ${property}`,
    itemIcon: (item: string) => `${item}圖示`,
    nothingFound: "找不到結果",
    selectPokemonFirst: "（尚未選擇寶可夢）",
    nameListView: "名稱清單檢視",
    listView: "清單檢視",
    gridView: "格狀檢視",
    // The default names of new teams
    teamNumber: (number: number) => `隊伍 ${number}`,
    unnamedTeam: "隊伍",
    copyOf: (name: string) => `${name} 副本`,
    learnsetsFailed: "無法載入招式列表。請重新載入頁面再試一次。",
  },

  // The undo and redo buttons
  history: "歷史紀錄",
  undo: "復原",
  redo: "重做",

  // The analysis panel
  stats: {
    teamStats: "隊伍數據",
    teamStatsAndChecklist: "隊伍數據與檢查清單",
    teamAnalysis: "隊伍分析",
    teamDefence: "隊伍防禦",
    teamTypeCoverage: "隊伍屬性覆蓋",
    teamChecklist: "隊伍檢查清單",
    matrixAnalysis: "矩陣分析",
    defence: "防禦",
    coverage: "覆蓋",
    teamStat: "隊伍數據",
    backToTeamStats: "返回隊伍數據",
    moreAnalyses: "更多分析",
    score: (type: string, score: string) => `${type}屬性分數：${score}`,
    selectPokemonFirst: "請先選擇寶可夢。",
    typeDoes: "{type}屬性招式造成的傷害…",
    multiplier: (multiplier: number) => `${multiplier}倍`,
    toPokemon: (pokemon: string) => `對${pokemon}`,
    superEffectiveAgainst: "對{type}屬性效果絕佳的招式：",
    checked: "已勾選",
    unchecked: "未勾選",
  },
  checklist: {
    groups: {
      general: "一般",
      defensive: "防禦",
      offensive: "攻擊",
    },
    // Shorter labels for screens at lg and below, then shorter still at md and below
    items: {
      entryHazard: { label: "場地陷阱", short: "陷阱" },
      spinner: {
        label: "高速旋轉／清除濃霧",
        short: "清釘手",
        shorter: "清釘",
      },
      recovery: {
        label: "可靠回復",
        short: "回復招式",
        shorter: "回復",
      },
      cleric: { label: "治癒手" },
      status: { label: "異常狀態招式", short: "狀態" },
      phazer: { label: "強制換人" },
      boosting: { label: "強化招式", short: "強化" },
      voltTurn: {
        label: "急速折返／伏特替換",
        short: "折返招式",
        shorter: "折返",
      },
      choice: { label: "講究道具", short: "講究" },
    },
  },
  matrix: {
    matrix: "矩陣",
    defenceDescription: "每種攻擊屬性對每隻寶可夢的傷害倍率。",
    coverageDescription: "每隻寶可夢最強招式對每種屬性的傷害倍率。",
    tapForReason: "點一下格子查看原因。",
    slot: (slot: number, pokemon: string | undefined) =>
      `第 ${slot} 格${pokemon ? `：${pokemon}` : ""}`,
    weak: "×2 弱點",
    quadruple: "×4",
    resists: "½ 抵抗",
    quarter: "¼",
    immune: "0 無效",
    defenceReason: (
      type: string,
      multiplier: number,
      pokemon: string,
      types: string,
      cause: string | undefined,
    ) =>
      `${type}屬性對${pokemon}（${types}）造成 ${multiplier} 倍傷害${cause ? `（受${cause}影響）` : ""}`,
    coverageReason: (
      pokemon: string,
      move: string,
      type: string,
      multiplier: number,
      target: string,
    ) =>
      `${pokemon}的${move}（${type}）對${target}屬性造成 ${multiplier} 倍傷害`,
    noDamagingMove: (pokemon: string) => `${pokemon}沒有攻擊招式`,
  },
  // Where a full type name does not fit
  typeAbbreviations: {
    Bug: "蟲",
    Dark: "惡",
    Dragon: "龍",
    Electric: "電",
    Fairy: "妖精",
    Fighting: "格鬥",
    Fire: "火",
    Flying: "飛行",
    Ghost: "幽靈",
    Grass: "草",
    Ground: "地面",
    Ice: "冰",
    Normal: "一般",
    Poison: "毒",
    Psychic: "超能力",
    Rock: "岩石",
    Steel: "鋼",
    Water: "水",
  } as Record<string, string>,

  // Set details, in the Advanced and info dialogs
  statNames: {
    hp: "HP",
    atk: "攻擊",
    def: "防禦",
    spa: "特攻",
    spd: "特防",
    spe: "速度",
  },
  statFullNames: {
    hp: "HP",
    atk: "攻擊",
    def: "防禦",
    spa: "特攻",
    spd: "特防",
    spe: "速度",
  },
  genders: { M: "雄性", F: "雌性", N: "無性別" },
  natureLabel: (
    nature: string,
    plus: string | undefined,
    minus: string | undefined,
  ) =>
    plus && minus ? `${nature}（+${plus}，-${minus}）` : `${nature}（無修正）`,
  advanced: {
    subtitle: (pokemon: string, slot: number) => `${pokemon}，第 ${slot} 格`,
    nickname: "暱稱",
    level: "等級",
    gender: "性別",
    teraType: "太晶屬性",
    nature: "性格",
    shiny: "異色",
    evs: "努力值",
    ivs: "個體值",
    evTotal: (total: number, max: number) => `努力值總和：${total}／${max}`,
    statEvs: (stat: string) => `${stat}努力值`,
    statIvs: (stat: string) => `${stat}個體值`,
  },
  info: {
    abilities: "特性",
    baseStats: "種族值",
    total: (total: number) => `合計 ${total}`,
    statValue: (stat: string, value: number) => `${stat}：${value}`,
    weakTo: "弱點",
    smogonDex: "Smogon 圖鑑",
  },

  // The Filters and Sort dialogs
  filters: {
    description: "縮小每個欄位的名稱下拉選單範圍。",
    format: "格式",
    type: "屬性",
    region: "地區",
    moves: "招式",
    viable: "實用",
    ability: "特性",
  },
  sort: {
    sortBy: "排序依據",
    order: "順序",
    ascending: "升冪",
    descending: "降冪",
    name: "名稱",
    num: "圖鑑編號",
    format: "格式",
    bst: "種族值總和",
  },

  // The Teams, Name and Format, Import, and Delete dialogs
  teams: {
    description: "點一下隊伍即可開啟。⋮ 按鈕裡有它的設定與操作。",
    newTeam: "新隊伍",
    randomTeam: "隨機隊伍",
    savedTeams: "已儲存的隊伍",
    optionsFor: (team: string) => `${team} 的選項`,
    load: (team: string) => `載入 ${team}`,
    importTeam: "匯入隊伍",
    exportAll: "全部匯出",
    savedInBrowser: "隊伍儲存在這個瀏覽器中。",
    exportFilename: "my-pokemon-teams.txt",
  },
  settings: {
    teamName: "隊伍名稱",
    checkTeamFor: (where: string) => `檢查隊伍是否符合 ${where}`,
    validFor: (where: string) => `這支隊伍符合 ${where} 的規則。`,
  },
  validation: {
    empty: "隊伍是空的。",
    notAllowed: (pokemon: string, where: string) =>
      `${where} 不允許使用${pokemon}。`,
    wrongAbility: (pokemon: string, ability: string) =>
      `${pokemon}不能擁有${ability}。`,
    missingItem: (pokemon: string, items: string[]) =>
      `${pokemon}必須攜帶${items.join("或")}。`,
    repeatedMove: (pokemon: string, move: string) =>
      `${pokemon}的${move}重複了。`,
    tooManyEvs: (pokemon: string, total: number, max: number) =>
      `${pokemon}的努力值共 ${total}（最多 ${max}）。`,
    tooManyStatEvs: (pokemon: string, max: number) =>
      `${pokemon}有一項能力的努力值超過 ${max}。`,
    badLevel: (pokemon: string, max: number) =>
      `${pokemon}的等級必須在 1 到 ${max} 之間。`,
    teraType: (pokemon: string) =>
      `${pokemon}有太晶屬性，但太晶屬性只存在於${generation(9)}。`,
    speciesClause: (species: string) =>
      `有兩隻寶可夢都是${species}（同種條款）。`,
    itemClause: (item: string) => `有兩隻寶可夢都攜帶${item}（道具條款）。`,
  },
  importDialog: {
    importTitle: "匯入隊伍",
    editTitle: "編輯 Pokepaste",
    importDescription:
      "以 {showdown} 的格式貼上一支隊伍，或含多支隊伍的完整備份。",
    editDescription: "這是你隊伍的原始文字。可在此修改，或貼到 {showdown}。",
    showdown: "Pokemon Showdown",
    importPlaceholder: "在此貼上隊伍",
    editPlaceholder: "你的隊伍是空的",
    label: "Pokemon Showdown 隊伍原始文字",
    kept: "暱稱、等級、性別、異色、太晶屬性、性格、努力值與個體值都會保留。親密度會被忽略。",
    import: "匯入",
    update: "更新",
    imported: "已匯入隊伍",
    importedMany: (count: number) => `已匯入 ${count} 支隊伍`,
    noChanges: "沒有任何變更。",
  },
  deleteDialog: {
    title: (team: string) => `要刪除${team}嗎？`,
    thisTeam: "這支隊伍",
    description: "這支隊伍及其寶可夢會從這個瀏覽器移除，且無法復原。",
  },

  // The footer and its dialogs
  footer: {
    typeChart: "屬性相剋表",
    manual: "使用說明",
    manualTitle: "使用說明",
    credits: "鳴謝",
    updates: (date: string) => `更新紀錄（${date}）`,
    updateLog: "更新紀錄",
    privacyPolicy: "隱私權政策",
    colorScheme: "配色",
    systemTheme: "跟隨系統主題",
    lightTheme: "使用淺色主題",
    darkTheme: "使用深色主題",
    githubRepo: "GitHub 儲存庫",
  },
  typeChart: {
    table: "表格",
    list: "清單",
    infographic: "圖解",
    tableAlt: "Bulbapedia 寶可夢屬性相剋表",
    listAlt: "清單式寶可夢屬性相剋表",
    infographicAlt: "圖解屬性相剋表",
    listCaption: "克制 → 屬性 → 克制",
    infographicCaption: "同樣適用於第7至9世代",
  },
  credits: {
    showdown:
      "感謝 Pokemon Showdown 的各位慷慨提供所有精靈圖、圖示與寶可夢資料。不可或缺！",
    alsoThanks: "同時感謝",
    companies: "Nintendo、The Pokemon Company、Game Freak",
    companiesFor:
      "寶可夢本身、標題旁的《寶可夢消消樂》插圖，以及傳說 Z-A 的超級進化精靈圖",
    typeChartTable: "屬性相剋表（表格）",
    fromBulbapedia: "來自 Bulbapedia",
    typeChartList: "屬性相剋表（清單）",
    typeChartInfographic: "屬性相剋表（圖解）",
    fromRPokemon: "來自 r/pokemon",
    typeColours: "屬性顏色",
    typeColoursFor: "隊伍數據中各屬性的顏色",
    stunfiskFor: "很棒的社群",
  },
  privacy: {
    playwire:
      "本網站或應用程式的全部或部分廣告由 Playwire LLC 管理。若使用 Playwire 的發布商廣告服務，Playwire LLC 可能會蒐集並使用某些彙總且匿名化的資料作廣告用途。想了解所蒐集的資料類型、資料的使用方式，以及你作為使用者的選擇，請造訪 {link}。",
    advertise: "在本網站刊登廣告。",
  },
  manual: {
    teams: "隊伍",
    teamsQuestion: "我的隊伍儲存在哪裡？",
    teamsAnswer:
      "你的隊伍儲存在這個瀏覽器中，所以下次回來還在，但在其他裝置上看不到。「隊伍列表」按鈕會列出所有隊伍，每支隊伍的選單可以重新命名、設定世代與格式、建立副本、分享或刪除。「全部匯出」會把每支隊伍以 Showdown 文字下載，「匯入隊伍」則能把它們讀回來。網址列永遠包含目前的隊伍，所以複製網址（或按「分享隊伍」）就能分享。",
    teamsAnswer2:
      "在手機和平板上，「更多」按鈕會顯示隊伍工具、「篩選」與「排序」按鈕，以及「進階」按鈕。底部的復原與重做按鈕可以逐步回溯目前隊伍的變更。",
    generations: "世代",
    generationsQuestion: "世代會改變什麼？",
    generationsAnswer:
      "在頂端選擇的世代只會列出該世代存在的寶可夢與形態：第6、7、9世代的超級進化、第8世代的超極巨化形態等等。其他一切維持最新：招式、特性、屬性相剋表與格式都來自最新的遊戲，所以舊世代的隊伍可能會學到當時學不了的招式。",
    advanced: "進階選項",
    advancedQuestion: "暱稱、等級、性格、努力值與個體值",
    advancedAnswer:
      "每隻寶可夢的「進階」按鈕可以設定暱稱、等級、性別、異色、太晶屬性、性格、努力值與個體值，方式與 Pokemon Showdown 相同。這些設定會隨隊伍一起放進分享連結、「複製文字」和「編輯 Pokepaste」的文字中；「名稱與格式」對話框的檢查會回報超過 510 的努力值、重複的招式、被禁止的寶可夢與各項條款。",
    matrix: "矩陣分析",
    matrixQuestion: "屬性分數從哪裡來？",
    matrixAnswer:
      "分析面板選單裡的矩陣會顯示每種屬性對每隻寶可夢的關係。「防禦」是每種攻擊屬性對每隻寶可夢的傷害倍率，並計入其特性與道具；「覆蓋」是每隻寶可夢最強攻擊招式對每種屬性的傷害倍率。點一下格子查看原因。",
    defence: "隊伍防禦",
    defenceQuestion: "隊伍的屬性防禦是怎麼計算的？",
    defenceAnswer:
      "隊伍裡的每隻寶可夢都有弱點屬性和抵抗屬性。若某個屬性對你的某隻寶可夢效果不好，就會得分；但若效果絕佳，就會扣分：",
    effectivenessHeading: "對你的屬性效果",
    pointsHeading: "分數",
    effectiveness: {
      immune: "沒有效果",
      quarter: "0.25 倍效果",
      half: "0.5 倍效果",
      neutral: "1 倍效果",
      double: "2 倍效果絕佳",
      quadruple: "4 倍效果絕佳",
    },
    note: "注意：",
    defenceNote:
      "飄浮、厚脂肪、過濾、食草等特性都會列入計算。例如，如果你的青銅鐘擁有飄浮，地面屬性會得到 +1.5；如果它擁有耐熱，火屬性則會得到 0。",
    coverage: "隊伍屬性覆蓋",
    coverageQuestion: "隊伍的屬性覆蓋是怎麼計算的？",
    coverageAnswer:
      "首先，什麼是屬性覆蓋？它指的是你的招式對多少種屬性效果絕佳。如果你的某個招式對某個屬性效果絕佳，就會得到 +1；如果該招式的屬性又與使用它的寶可夢相同（STAB），就會再得到 +1。",
    coverageNote:
      "飛行皮膚、妖精皮膚等特性都會列入計算，冷凍乾燥、飛身重壓等招式也是。例如，冷凍乾燥也會讓你對水屬性得到 +1。",
    formats: "格式（也就是分級）",
    formatsQuestion: "Ubers、OU、VGC 等是什麼？",
    formatsAnswer:
      "Ubers、OU 和 {vgc} 都是格式（或稱分級），會禁止某些寶可夢並套用特定規則。Battle Stadium 單打／雙打和 VGC 是唯一由 The Pokemon Company 認可的格式，其餘則由 {smogon} 維護。你可以參考 {faq} 或 {guide}。",
    vgc: "VGC",
    smogon: "Smogon",
    faq: "Smogon 的分級常見問答",
    guide: "這篇簡介各分級的指南",
    champions:
      "Pokemon Champions（M-C）格式只列出 Regulation M-C 規定下可在 Pokemon Champions 使用的寶可夢，包括牠們的超級進化。",
    terms: "隊伍檢查清單用語",
    termsQuestion: "場地陷阱、強制換人、折返招式這些到底是什麼意思？",
    termsAnswer:
      "Smogon 有一份{dictionary}，但內容有點過時。以下是它沒有涵蓋的一些用語：",
    dictionary: "寶可夢用語辭典",
    termHeading: "用語",
    definitionHeading: "定義",
    definitions: [
      ["除霧手", "會使用清除濃霧（可吹走場地陷阱）的寶可夢。"],
      [
        "可靠回復",
        "每次使用都保證回復 50% 以上 HP 的招式（在一般天氣下）。例如：自我再生、生蛋、喝牛奶、偷懶、光合作用。",
      ],
      [
        "異常狀態招式",
        "這裡指的是命中率高、能造成麻痺、灼傷或中毒的招式，以及能催眠的招式。例如：劇毒、磷火、電磁波、唱歌。",
      ],
      ["強化招式", "能提升自身能力的招式（最好是 2 階以上），例如劍舞和冥想。"],
      [
        "講究道具",
        "能提升一項能力 50%，但會鎖定只能使用一個招式的道具。共有三種：講究頭帶、講究眼鏡、講究圍巾。",
      ],
    ] as [string, string][],
  },
};

export default zhHant;
