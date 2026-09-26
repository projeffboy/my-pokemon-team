import type { Messages } from "./en";

const generation = (generation: number) => `第${generation}世代`;

const zhHans: Messages = {
  // 页眉
  siteName: "My Pokemon Team",
  generation,
  generationSelect: "世代",
  championsGeneration: "第9世代 · Champions",
  championsGenerationShort: "第9世代（Champions）",
  championsGame: "Pokemon Champions",
  generationGames: {
    9: "朱／紫 · 传说 Z-A",
    8: "剑／盾 · 晶灿钻石／明亮珍珠 · 传说 阿尔宙斯",
    7: "太阳／月亮 · 究极之日／究极之月 · Let's Go",
    6: "X／Y · 终极红宝石／始源蓝宝石",
    5: "黑／白 · 黑2／白2",
    4: "钻石／珍珠／白金 · 心金／魂银",
    3: "红宝石／蓝宝石／绿宝石 · 火红／叶绿",
    2: "金／银／水晶",
    1: "红／蓝／黄",
  } as Record<number, string>,
  language: "语言",
  feedback: {
    button: "发送反馈",
    title: "发送反馈",
    description:
      "发现了错误或有建议？点击发送后会打开你的邮件应用，收件人为 {email}。请附上你的队伍链接，以便重现问题。",
    label: "你的反馈",
    placeholder: "例如：大竺葵缺少魔法闪耀",
    attachLink: "附上我的队伍链接",
    subject: "My Pokemon Team feedback",
    myTeam: "我的队伍：",
    send: "发送",
  },

  // 多个对话框共用的按钮
  cancel: "取消",
  close: "关闭",
  done: "完成",
  goBack: "返回",
  save: "保存",
  reset: "重置",
  clear: "清除",
  all: "全部",
  any: "任意",
  none: "无",
  nothing: "无",

  // 队伍栏
  team: {
    teams: "队伍",
    randomize: "随机生成",
    randomized: "已随机生成",
    shareTeam: "分享队伍",
    shareTeamLink: "分享宝可梦队伍链接",
    teamActions: "队伍操作",
    manageTeam: "管理队伍",
    manageTeamMenu: "管理队伍",
    nameAndFormat: "名称与格式",
    duplicate: "创建副本",
    copyText: "复制文本",
    editPokepaste: "编辑 Pokepaste",
    delete: "删除",
    importTeam: "导入队伍",
    share: "分享",
    teamEmpty: "宝可梦队伍为空",
    linkCopied: "已复制宝可梦队伍链接",
    linkNotCopied: "无法复制链接。",
    nothingToCopy: "队伍为空，没有可复制的内容。",
    teamCopied: "已复制队伍。",
    teamNotCopied: "无法复制队伍。",
    teamDuplicated: "已创建队伍副本",
    teamDeleted: "已删除队伍",
    slots: "宝可梦队伍栏位",
    slot: (slot: number) => `宝可梦 ${slot}`,
    slotWith: (slot: number, pokemon: string | undefined) =>
      `宝可梦 ${slot}（${pokemon ?? "空"}）`,
    slotPair: (first: string, second: string) => `${first}和${second}`,
    moreTools: "更多队伍工具",
    fewerTools: "收起队伍工具",
    more: "更多",
    less: "收起",
    filters: "筛选",
    sort: "排序",
    random: "随机",
    randomFor: (slot: number) => `为栏位 ${slot} 随机选择宝可梦`,
    advanced: "高级",
    advancedFor: (slot: number) => `栏位 ${slot} 的高级选项`,
    about: (pokemon: string) => `关于${pokemon}`,
    previousSlot: "移到上一个栏位",
    nextSlot: "移到下一个栏位",
    name: "名称",
    move: "招式",
    item: "道具",
    ability: "特性",
    // 每个输入框的无障碍名称，例如“宝可梦 1 的 move2”
    input: (slot: number, property: string) => `宝可梦 ${slot} 的 ${property}`,
    itemIcon: (item: string) => `${item}图标`,
    nothingFound: "未找到结果",
    selectPokemonFirst: "（你还没有选择宝可梦）",
    nameListView: "名称列表视图",
    listView: "列表视图",
    gridView: "网格视图",
    // 新队伍的默认名称
    teamNumber: (number: number) => `队伍 ${number}`,
    unnamedTeam: "队伍",
    copyOf: (name: string) => `${name} 副本`,
    learnsetsFailed: "无法加载招式列表。请重新加载页面重试。",
  },

  // 撤销与重做按钮
  history: "历史记录",
  undo: "撤销",
  redo: "重做",

  // 分析面板
  stats: {
    teamStats: "队伍统计",
    teamStatsAndChecklist: "队伍统计与检查清单",
    teamAnalysis: "队伍分析",
    teamDefence: "队伍防御",
    teamTypeCoverage: "队伍属性打击面",
    teamChecklist: "队伍检查清单",
    matrixAnalysis: "矩阵分析",
    defence: "防御",
    coverage: "打击面",
    teamStat: "队伍统计项",
    backToTeamStats: "返回队伍统计",
    moreAnalyses: "更多分析",
    score: (type: string, score: string) => `${type}得分：${score}`,
    selectPokemonFirst: "请先选择一只宝可梦。",
    typeDoes: "{type}属性攻击的效果：",
    multiplier: (multiplier: number) => `${multiplier}倍`,
    toPokemon: (pokemon: string) => `对${pokemon}`,
    superEffectiveAgainst: "对{type}效果绝佳的招式：",
    checked: "已勾选",
    unchecked: "未勾选",
  },
  checklist: {
    groups: {
      general: "综合",
      defensive: "防守",
      offensive: "进攻",
    },
    // lg 及以下屏幕用较短的标签，md 及以下再更短
    items: {
      entryHazard: { label: "撒钉招式", short: "撒钉" },
      spinner: { label: "扫钉／清雾", short: "扫钉", shorter: "扫钉" },
      recovery: {
        label: "稳定回复",
        short: "回复",
        shorter: "回复",
      },
      cleric: { label: "治愈手" },
      status: { label: "异常状态招式", short: "异常状态" },
      phazer: { label: "吹飞手" },
      boosting: { label: "强化招式", short: "强化" },
      voltTurn: {
        label: "急折／伏特替换",
        short: "急折伏特",
        shorter: "急折",
      },
      choice: { label: "讲究道具", short: "讲究" },
    },
  },
  matrix: {
    matrix: "矩阵",
    defenceDescription: "每种攻击属性对每只宝可梦的伤害倍率。",
    coverageDescription: "每只宝可梦的最佳招式对每种属性的伤害倍率。",
    tapForReason: "点击格子查看原因。",
    slot: (slot: number, pokemon: string | undefined) =>
      `栏位 ${slot}${pokemon ? `：${pokemon}` : ""}`,
    weak: "×2 弱点",
    quadruple: "×4",
    resists: "½ 抵抗",
    quarter: "¼",
    immune: "0 免疫",
    defenceReason: (
      type: string,
      multiplier: number,
      pokemon: string,
      types: string,
      cause: string | undefined,
    ) =>
      `${type}对${pokemon}（${types}）造成 ${multiplier} 倍伤害${cause ? `（受${cause}影响）` : ""}`,
    coverageReason: (
      pokemon: string,
      move: string,
      type: string,
      multiplier: number,
      target: string,
    ) => `${pokemon}的${move}（${type}）对${target}造成 ${multiplier} 倍伤害`,
    noDamagingMove: (pokemon: string) => `${pokemon}没有攻击招式`,
  },
  // 放不下完整属性名时使用
  typeAbbreviations: {
    Bug: "虫",
    Dark: "恶",
    Dragon: "龙",
    Electric: "电",
    Fairy: "妖精",
    Fighting: "格斗",
    Fire: "火",
    Flying: "飞行",
    Ghost: "幽灵",
    Grass: "草",
    Ground: "地面",
    Ice: "冰",
    Normal: "一般",
    Poison: "毒",
    Psychic: "超能力",
    Rock: "岩石",
    Steel: "钢",
    Water: "水",
  } as Record<string, string>,

  // 高级选项与信息对话框中的配置详情
  statNames: {
    hp: "HP",
    atk: "攻击",
    def: "防御",
    spa: "特攻",
    spd: "特防",
    spe: "速度",
  },
  statFullNames: {
    hp: "HP",
    atk: "攻击",
    def: "防御",
    spa: "特攻",
    spd: "特防",
    spe: "速度",
  },
  genders: { M: "雄性", F: "雌性", N: "无性别" },
  natureLabel: (
    nature: string,
    plus: string | undefined,
    minus: string | undefined,
  ) =>
    plus && minus ? `${nature}（+${plus}，-${minus}）` : `${nature}（无修正）`,
  advanced: {
    subtitle: (pokemon: string, slot: number) => `${pokemon}，栏位 ${slot}`,
    nickname: "昵称",
    level: "等级",
    gender: "性别",
    teraType: "太晶属性",
    nature: "性格",
    shiny: "异色",
    evs: "努力值",
    ivs: "个体值",
    evTotal: (total: number, max: number) => `努力值总计：${total}／${max}`,
    statEvs: (stat: string) => `${stat}努力值`,
    statIvs: (stat: string) => `${stat}个体值`,
  },
  info: {
    abilities: "特性",
    baseStats: "种族值",
    total: (total: number) => `总计 ${total}`,
    statValue: (stat: string, value: number) => `${stat}：${value}`,
    weakTo: "弱点",
    smogonDex: "Smogon 图鉴",
  },

  // 筛选与排序对话框
  filters: {
    description: "缩小每个栏位的名称下拉列表的范围。",
    format: "格式",
    type: "属性",
    region: "地区",
    moves: "招式",
    viable: "实用招式",
    ability: "特性",
  },
  sort: {
    sortBy: "排序方式",
    order: "顺序",
    ascending: "升序",
    descending: "降序",
    name: "名称",
    num: "图鉴编号",
    format: "格式",
    bst: "种族值总和",
  },

  // 队伍、名称与格式、导入、删除对话框
  teams: {
    description: "点击队伍即可打开。⋮ 按钮包含其设置与操作。",
    newTeam: "新建队伍",
    randomTeam: "随机队伍",
    savedTeams: "已保存的队伍",
    optionsFor: (team: string) => `${team}的选项`,
    load: (team: string) => `加载${team}`,
    importTeam: "导入队伍",
    exportAll: "全部导出",
    savedInBrowser: "队伍保存在此浏览器中。",
    exportFilename: "my-pokemon-teams.txt",
  },
  settings: {
    teamName: "队伍名称",
    checkTeamFor: (where: string) => `检查队伍是否符合 ${where} 规则`,
    validFor: (where: string) => `队伍符合 ${where} 规则。`,
  },
  validation: {
    empty: "队伍为空。",
    notAllowed: (pokemon: string, where: string) =>
      `${where} 不允许使用${pokemon}。`,
    wrongAbility: (pokemon: string, ability: string) =>
      `${pokemon}不能拥有${ability}。`,
    missingItem: (pokemon: string, items: string[]) =>
      `${pokemon}必须携带${items.join("或")}。`,
    repeatedMove: (pokemon: string, move: string) =>
      `${pokemon}有两个${move}。`,
    tooManyEvs: (pokemon: string, total: number, max: number) =>
      `${pokemon}的努力值总计 ${total}（最多 ${max}）。`,
    tooManyStatEvs: (pokemon: string, max: number) =>
      `${pokemon}的单项努力值超过了 ${max}。`,
    badLevel: (pokemon: string, max: number) =>
      `${pokemon}的等级必须在 1 到 ${max} 之间。`,
    teraType: (pokemon: string) =>
      `${pokemon}设置了太晶属性，但太晶属性只存在于${generation(9)}。`,
    speciesClause: (species: string) =>
      `队伍中有两只${species}（Species Clause）。`,
    itemClause: (item: string) => `有两只宝可梦携带${item}（Item Clause）。`,
  },
  importDialog: {
    importTitle: "导入队伍",
    editTitle: "编辑 Pokepaste",
    importDescription:
      "以 {showdown} 的格式粘贴一支队伍，或包含多支队伍的完整备份。",
    editDescription:
      "这是你队伍的原始文本。可以在此修改，或粘贴到 {showdown} 中。",
    showdown: "Pokemon Showdown",
    importPlaceholder: "在此粘贴队伍",
    editPlaceholder: "你的队伍为空",
    label: "Pokemon Showdown 队伍原始文本",
    kept: "昵称、等级、性别、异色、太晶属性、性格、努力值和个体值都会保留。亲密度会被忽略。",
    import: "导入",
    update: "更新",
    imported: "已导入队伍",
    importedMany: (count: number) => `已导入 ${count} 支队伍`,
    noChanges: "没有改动。",
  },
  deleteDialog: {
    title: (team: string) => `删除${team}？`,
    thisTeam: "这支队伍",
    description: "该队伍及其宝可梦将从此浏览器中移除。此操作无法撤销。",
  },

  // 页脚及其对话框
  footer: {
    typeChart: "属性相克表",
    manual: "使用说明",
    manualTitle: "使用说明与帮助",
    credits: "鸣谢",
    updates: (date: string) => `更新（${date}）`,
    updateLog: "更新日志",
    privacyPolicy: "隐私政策",
    colorScheme: "配色方案",
    systemTheme: "跟随系统主题",
    lightTheme: "使用浅色主题",
    darkTheme: "使用深色主题",
    githubRepo: "GitHub 仓库",
  },
  typeChart: {
    table: "表格",
    list: "列表",
    infographic: "信息图",
    tableAlt: "Bulbapedia 宝可梦属性相克表",
    listAlt: "宝可梦属性相克列表",
    infographicAlt: "属性相克信息图",
    listCaption: "克制 → 属性 → 克制",
    infographicCaption: "同样适用于第7至9世代",
  },
  credits: {
    showdown:
      "感谢 Pokemon Showdown 的各位慷慨地允许我使用他们全部的宝可梦图像、图标和数据。绝对不可或缺！",
    alsoThanks: "同时感谢",
    companies: "Nintendo、The Pokemon Company、Game Freak",
    companiesFor:
      "宝可梦本身、标题旁的 Pokemon Shuffle 图片，以及传说 Z-A 的超级进化形态图像",
    typeChartTable: "属性相克表（表格）",
    fromBulbapedia: "来自 Bulbapedia",
    typeChartList: "属性相克表（列表）",
    typeChartInfographic: "属性相克信息图",
    fromRPokemon: "来自 r/pokemon",
    typeColours: "属性颜色",
    typeColoursFor: "队伍统计中每种属性的颜色",
    stunfiskFor: "一个很棒的社区",
  },
  privacy: {
    playwire:
      "本网站或应用中的全部或部分广告由 Playwire LLC 管理。如果使用了 Playwire 的发布商广告服务，Playwire LLC 可能会出于广告目的收集并使用某些汇总且匿名化的数据。要了解所收集数据的类型、数据的使用方式以及你作为用户的选择，请访问 {link}。",
    advertise: "在本网站投放广告。",
  },
  manual: {
    teams: "队伍",
    teamsQuestion: "我的队伍保存在哪里？",
    teamsAnswer:
      "你的队伍保存在此浏览器中，下次回来时仍然在这里，但不会同步到其他设备。“队伍”按钮会列出所有队伍，每支队伍的菜单可以重命名、设置世代和格式、创建副本、分享或删除它。“全部导出”会把所有队伍下载为 Showdown 文本，“导入队伍”可以再把它读回来。地址栏始终包含当前队伍，所以复制网址（或点击“分享队伍”）即可分享。",
    teamsAnswer2:
      "在手机和平板上，“更多”按钮会显示队伍工具、“筛选”和“排序”按钮以及“高级”按钮。底部的撤销和重做按钮可以逐步回溯当前队伍的改动。",
    generations: "世代",
    generationsQuestion: "世代会改变什么？",
    generationsAnswer:
      "顶部选择的世代只会列出该世代中存在的宝可梦和形态：超级进化只在第6、7、9世代，超极巨化形态只在第8世代，以此类推。其他一切保持最新：招式、特性、属性相克表和格式都来自最新的游戏，所以旧世代的队伍可能会学会当时学不了的招式。",
    advanced: "高级选项",
    advancedQuestion: "昵称、等级、性格、努力值和个体值",
    advancedAnswer:
      "每只宝可梦的“高级”按钮可以设置它的昵称、等级、性别、异色、太晶属性、性格、努力值和个体值，方式与 Pokemon Showdown 相同。这些设置会随队伍一起保存在分享链接、“复制文本”和“编辑 Pokepaste”的文本中；“名称与格式”对话框中的检查会报告超过 510 的努力值、重复的招式、被禁止的宝可梦以及各项限制条款。",
    matrix: "矩阵分析",
    matrixQuestion: "属性得分从何而来？",
    matrixAnswer:
      "分析面板菜单中的矩阵会显示每种属性对每只宝可梦的效果。“防御”是每种攻击属性对每只宝可梦的伤害倍率，并计入其特性和道具；“打击面”是每只宝可梦最强的攻击招式对每种属性的伤害倍率。点击格子可查看原因。",
    defence: "队伍防御",
    defenceQuestion: "队伍的属性防御是如何计算的？",
    defenceAnswer:
      "队伍中的每只宝可梦都有弱点属性和抵抗属性。如果某种属性对你的一只宝可梦效果不好，你会得分；但如果效果绝佳，你会失分：",
    effectivenessHeading: "对你的属性效果",
    pointsHeading: "得分",
    effectiveness: {
      immune: "无效",
      quarter: "0.25倍效果",
      half: "0.5倍效果",
      neutral: "1倍效果",
      double: "2倍效果绝佳",
      quadruple: "4倍效果绝佳",
    },
    note: "注意：",
    defenceNote:
      "飘浮、厚脂肪、过滤和食草等特性会被计入。例如，如果你的青铜钟拥有飘浮，地面属性会为你带来 +1.5 分；如果它拥有耐热，火属性则计为 0 分。",
    coverage: "队伍属性打击面",
    coverageQuestion: "队伍的属性打击面是如何计算的？",
    coverageAnswer:
      "首先，什么是属性打击面？它指的是你的招式能对多少种属性效果绝佳。如果你的某个招式对某种属性效果绝佳，你得 +1 分；如果该招式与使用它的宝可梦属性相同（STAB，本系加成），再得 +1 分。",
    coverageNote:
      "飞行皮肤和妖精皮肤等特性会被计入，冷冻干燥和飞身重压等招式也是。例如，冷冻干燥还会让你对水属性得 +1 分。",
    formats: "格式（即分级）",
    formatsQuestion: "Ubers、OU、VGC 等是什么？",
    formatsAnswer:
      "Ubers、OU 和 {vgc} 都是对战格式（或分级），它们会禁止部分宝可梦并执行特定规则。Battle Stadium 单打／双打和 VGC 是唯一由 The Pokemon Company 官方认可的格式，其他格式则由 {smogon} 维护。你可以查看 {faq} 或 {guide}。",
    vgc: "VGC",
    smogon: "Smogon",
    faq: "Smogon 关于分级的常见问题",
    guide: "这篇简要介绍各分级的指南",
    champions:
      "Pokemon Champions（M-C）格式只列出在 Regulation M-C 下可以在 Pokemon Champions 中使用的宝可梦，包括它们的超级进化。",
    terms: "队伍检查清单术语",
    termsQuestion: "撒钉、吹飞、急折伏特这些到底是什么意思？",
    termsAnswer:
      "Smogon 有一份{dictionary}，但内容有些过时。以下是它没有涵盖的一些术语：",
    dictionary: "宝可梦术语词典",
    termHeading: "术语",
    definitionHeading: "定义",
    definitions: [
      ["清雾手", "会使用清除浓雾（可吹走场上钉子）的宝可梦。"],
      [
        "稳定回复",
        "每次使用都能保证回复 50% 或以上 HP 的招式（在正常天气下）。例如：自我再生、生蛋、喝牛奶、偷懒、光合作用。",
      ],
      [
        "异常状态招式",
        "这里指命中率高、能造成麻痹、灼伤或中毒的招式，以及能催眠的招式。例如：剧毒、磷火、电磁波、唱歌。",
      ],
      ["强化招式", "提升自身能力的招式（最好是 +2 以上），例如剑舞和冥想。"],
      [
        "讲究道具",
        "使某项能力提升 50% 但会锁定一个招式的道具。共有三种：讲究头带、讲究眼镜和讲究围巾。",
      ],
    ] as [string, string][],
  },
};

export default zhHans;
