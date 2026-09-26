import type { Messages } from "./en";

const generation = (generation: number) => `${generation}세대`;

// Appends the particle that fits the word's last syllable: josa("피카츄", "은", "는") gives
// 피카츄는. A word ending outside Hangul and digits gets both, like Porygon은(는).
const josa = (word: string, withBatchim: string, without: string) => {
  const last = word.replace(/[)\s]+$/, "").slice(-1);
  const code = last.charCodeAt(0) - 0xac00;
  const hasBatchim =
    code >= 0 && code < 11172 ? code % 28 > 0
    : /[0-9]/.test(last) ? "013678".includes(last)
    : undefined;
  const particle =
    hasBatchim === undefined ? `${withBatchim}(${without})`
    : hasBatchim ? withBatchim
    : without;
  return word + particle;
};

const ko: Messages = {
  siteName: "My Pokemon Team",
  generation,
  generationSelect: "세대",
  championsGeneration: "9세대 · Champions",
  championsGenerationShort: "9세대 (Champions)",
  championsGame: "Pokemon Champions",
  generationGames: {
    9: "스칼렛·바이올렛, Pokémon LEGENDS Z-A",
    8: "소드·실드, 브릴리언트 다이아몬드·샤이닝 펄, LEGENDS 아르세우스",
    7: "썬·문, 울트라썬·울트라문, 레츠고",
    6: "X·Y, 오메가루비·알파사파이어",
    5: "블랙·화이트, 블랙 2·화이트 2",
    4: "디아루가·펄기아·기라티나, 하트골드·소울실버",
    3: "루비·사파이어·에메랄드, 파이어레드·리프그린",
    2: "금·은·크리스탈",
    1: "레드·그린·블루·피카츄",
  } as Record<number, string>,
  language: "언어",
  feedback: {
    button: "피드백 보내기",
    title: "피드백 보내기",
    description:
      "버그를 발견했거나 제안이 있나요? 보내기를 누르면 {email} 앞으로 쓴 메시지가 이메일 앱에서 열립니다. 문제를 재현할 수 있도록 팀 링크를 첨부해 주세요.",
    label: "피드백 내용",
    placeholder: "예: 메가니움이 매지컬샤인을 배우지 못해요",
    attachLink: "내 팀 링크 첨부",
    subject: "My Pokemon Team 피드백",
    myTeam: "내 팀:",
    send: "보내기",
  },

  cancel: "취소",
  close: "닫기",
  done: "완료",
  goBack: "돌아가기",
  save: "저장",
  reset: "초기화",
  clear: "지우기",
  all: "전체",
  any: "상관없음",
  none: "없음",
  nothing: "없음",

  team: {
    teams: "팀 목록",
    randomize: "랜덤 생성",
    randomized: "팀을 랜덤으로 채웠습니다",
    shareTeam: "팀 공유",
    shareTeamLink: "포켓몬 팀 링크 공유",
    teamActions: "팀 작업",
    manageTeam: "팀 관리",
    manageTeamMenu: "팀 관리",
    nameAndFormat: "이름과 포맷",
    duplicate: "복제",
    copyText: "텍스트 복사",
    editPokepaste: "Pokepaste 편집",
    delete: "삭제",
    importTeam: "팀 가져오기",
    share: "공유",
    teamEmpty: "포켓몬 팀이 비어 있습니다",
    linkCopied: "포켓몬 팀 링크를 복사했습니다",
    linkNotCopied: "링크를 복사하지 못했습니다.",
    nothingToCopy: "팀이 비어 있어 복사할 내용이 없습니다.",
    teamCopied: "팀을 복사했습니다.",
    teamNotCopied: "팀을 복사하지 못했습니다.",
    teamDuplicated: "팀을 복제했습니다",
    teamDeleted: "팀을 삭제했습니다",
    slots: "포켓몬 팀 슬롯",
    slot: (slot: number) => `포켓몬 ${slot}`,
    slotWith: (slot: number, pokemon: string | undefined) =>
      `포켓몬 ${slot} (${pokemon ?? "비어 있음"})`,
    slotPair: (first: string, second: string) =>
      `${josa(first, "과", "와")} ${second}`,
    moreTools: "팀 도구 더 보기",
    fewerTools: "팀 도구 접기",
    more: "더 보기",
    less: "접기",
    filters: "필터",
    sort: "정렬",
    random: "랜덤",
    randomFor: (slot: number) => `슬롯 ${slot}에 랜덤 포켓몬 넣기`,
    advanced: "고급",
    advancedFor: (slot: number) => `슬롯 ${slot}의 고급 설정`,
    about: (pokemon: string) => `${pokemon} 정보`,
    previousSlot: "이전 슬롯으로 이동",
    nextSlot: "다음 슬롯으로 이동",
    name: "이름",
    move: "기술",
    item: "지닌 물건",
    ability: "특성",
    input: (slot: number, property: string) => `포켓몬 ${slot}의 ${property}`,
    itemIcon: (item: string) => `${item} 아이콘`,
    nothingFound: "검색 결과 없음",
    selectPokemonFirst: "(포켓몬을 먼저 선택하세요)",
    nameListView: "이름 목록 보기",
    listView: "목록 보기",
    gridView: "격자 보기",
    teamNumber: (number: number) => `팀 ${number}`,
    unnamedTeam: "팀",
    copyOf: (name: string) => `${name} 사본`,
    learnsetsFailed:
      "기술 목록을 불러오지 못했습니다. 페이지를 새로고침해 다시 시도하세요.",
  },

  history: "기록",
  undo: "실행 취소",
  redo: "다시 실행",

  stats: {
    teamStats: "팀 통계",
    teamStatsAndChecklist: "팀 통계와 체크리스트",
    teamAnalysis: "팀 분석",
    teamDefence: "팀 방어",
    teamTypeCoverage: "팀 타입 견제폭",
    teamChecklist: "팀 체크리스트",
    matrixAnalysis: "매트릭스 분석",
    defence: "방어",
    coverage: "견제폭",
    teamStat: "팀 통계 항목",
    backToTeamStats: "팀 통계로 돌아가기",
    moreAnalyses: "다른 분석",
    score: (type: string, score: string) => `${type} 점수: ${score}`,
    selectPokemonFirst: "먼저 포켓몬을 선택하세요.",
    typeDoes: "{type} 타입 기술의 효과...",
    multiplier: (multiplier: number) => `${multiplier}배`,
    toPokemon: (pokemon: string) => `${pokemon}에게`,
    superEffectiveAgainst: "{type} 타입에 효과가 굉장한 기술:",
    checked: "충족",
    unchecked: "미충족",
  },
  checklist: {
    groups: {
      general: "일반",
      defensive: "방어",
      offensive: "공격",
    },
    items: {
      entryHazard: { label: "설치 기술", short: "설치기" },
      spinner: {
        label: "고속스핀/안개제거",
        short: "설치 제거",
        shorter: "제거",
      },
      recovery: {
        label: "안정적인 회복 기술",
        short: "회복 기술",
        shorter: "회복",
      },
      cleric: { label: "클레릭" },
      status: { label: "상태이상 기술", short: "상태이상" },
      phazer: { label: "강제 교체" },
      boosting: { label: "랭크업 기술", short: "랭크업" },
      voltTurn: {
        label: "볼트체인지/유턴",
        short: "볼트턴",
        shorter: "볼트턴",
      },
      choice: { label: "구애 아이템", short: "구애" },
    },
  },
  matrix: {
    matrix: "매트릭스",
    defenceDescription:
      "각 공격 타입이 각 포켓몬에게 얼마나 효과적인지 보여 줍니다.",
    coverageDescription:
      "각 포켓몬의 가장 강력한 기술이 각 타입에게 얼마나 효과적인지 보여 줍니다.",
    tapForReason: "칸을 누르면 이유가 표시됩니다.",
    slot: (slot: number, pokemon: string | undefined) =>
      `슬롯 ${slot}${pokemon ? `: ${pokemon}` : ""}`,
    weak: "×2 약점",
    quadruple: "×4",
    resists: "½ 반감",
    quarter: "¼",
    immune: "0 무효",
    defenceReason: (
      type: string,
      multiplier: number,
      pokemon: string,
      types: string,
      cause: string | undefined,
    ) =>
      `${type} 타입은 ${pokemon}(${types})에게 ${multiplier}배${cause ? ` (${cause} 적용)` : ""}`,
    coverageReason: (
      pokemon: string,
      move: string,
      type: string,
      multiplier: number,
      target: string,
    ) =>
      `${pokemon}의 ${move}(${type} 타입): ${target} 타입에게 ${multiplier}배`,
    noDamagingMove: (pokemon: string) =>
      `${pokemon}에게는 공격 기술이 없습니다`,
  },
  typeAbbreviations: {
    Bug: "벌레",
    Dark: "악",
    Dragon: "드래곤",
    Electric: "전기",
    Fairy: "페어리",
    Fighting: "격투",
    Fire: "불꽃",
    Flying: "비행",
    Ghost: "고스트",
    Grass: "풀",
    Ground: "땅",
    Ice: "얼음",
    Normal: "노말",
    Poison: "독",
    Psychic: "에스퍼",
    Rock: "바위",
    Steel: "강철",
    Water: "물",
  } as Record<string, string>,

  statNames: {
    hp: "HP",
    atk: "공격",
    def: "방어",
    spa: "특공",
    spd: "특방",
    spe: "스핏",
  },
  statFullNames: {
    hp: "HP",
    atk: "공격",
    def: "방어",
    spa: "특수공격",
    spd: "특수방어",
    spe: "스피드",
  },
  genders: { M: "수컷", F: "암컷", N: "성별 불명" },
  natureLabel: (
    nature: string,
    plus: string | undefined,
    minus: string | undefined,
  ) =>
    plus && minus ? `${nature} (+${plus}, -${minus})` : `${nature} (무보정)`,
  advanced: {
    subtitle: (pokemon: string, slot: number) => `${pokemon}, 슬롯 ${slot}`,
    nickname: "닉네임",
    level: "레벨",
    gender: "성별",
    teraType: "테라스탈 타입",
    nature: "성격",
    shiny: "색이 다름",
    evs: "노력치",
    ivs: "개체값",
    evTotal: (total: number, max: number) => `노력치 합계: ${total} / ${max}`,
    statEvs: (stat: string) => `${stat} 노력치`,
    statIvs: (stat: string) => `${stat} 개체값`,
  },
  info: {
    abilities: "특성",
    baseStats: "종족값",
    total: (total: number) => `합계 ${total}`,
    statValue: (stat: string, value: number) => `${stat}: ${value}`,
    weakTo: "약점 타입",
    smogonDex: "Smogon 도감",
  },

  filters: {
    description: "모든 슬롯의 이름 목록에서 선택지를 좁힙니다.",
    format: "포맷",
    type: "타입",
    region: "지방",
    moves: "기술",
    viable: "실전용만",
    ability: "특성",
  },
  sort: {
    sortBy: "정렬 기준",
    order: "순서",
    ascending: "오름차순",
    descending: "내림차순",
    name: "이름",
    num: "도감 번호",
    format: "포맷",
    bst: "종족값 합계",
  },

  teams: {
    description: "팀을 누르면 열립니다. ⋮ 버튼에 설정과 작업이 있습니다.",
    newTeam: "새 팀",
    randomTeam: "랜덤 팀",
    savedTeams: "저장된 팀",
    optionsFor: (team: string) => `${team} 옵션`,
    load: (team: string) => `${team} 불러오기`,
    importTeam: "팀 가져오기",
    exportAll: "전체 내보내기",
    savedInBrowser: "팀은 이 브라우저에 저장됩니다.",
    exportFilename: "my-pokemon-teams.txt",
  },
  settings: {
    teamName: "팀 이름",
    checkTeamFor: (where: string) => `${where} 기준으로 팀 검사`,
    validFor: (where: string) => `이 팀은 ${where}에서 사용할 수 있습니다.`,
  },
  validation: {
    empty: "팀이 비어 있습니다.",
    notAllowed: (pokemon: string, where: string) =>
      `${josa(pokemon, "은", "는")} ${where}에서 사용할 수 없습니다.`,
    wrongAbility: (pokemon: string, ability: string) =>
      `${josa(pokemon, "은", "는")} ${ability} 특성을 가질 수 없습니다.`,
    missingItem: (pokemon: string, items: string[]) =>
      `${josa(pokemon, "은", "는")} ${josa(items.join(" 또는 "), "을", "를")} 지녀야 합니다.`,
    repeatedMove: (pokemon: string, move: string) =>
      `${josa(pokemon, "은", "는")} ${josa(move, "을", "를")} 두 번 배우고 있습니다.`,
    tooManyEvs: (pokemon: string, total: number, max: number) =>
      `${pokemon}의 노력치 합계가 ${total}입니다 (최대 ${max}).`,
    tooManyStatEvs: (pokemon: string, max: number) =>
      `${pokemon}의 한 능력치에 노력치가 ${max}보다 많이 들어 있습니다.`,
    badLevel: (pokemon: string, max: number) =>
      `${pokemon}의 레벨은 1부터 ${max} 사이여야 합니다.`,
    teraType: (pokemon: string) =>
      `${pokemon}에게 테라스탈 타입이 설정되어 있지만, 테라스탈 타입은 ${generation(9)}에만 있습니다.`,
    speciesClause: (species: string) =>
      `${josa(species, "이", "가")} 두 마리 있습니다 (Species Clause).`,
    itemClause: (item: string) =>
      `${josa(item, "을", "를")} 지닌 포켓몬이 두 마리 있습니다 (Item Clause).`,
  },
  importDialog: {
    importTitle: "팀 가져오기",
    editTitle: "Pokepaste 편집",
    importDescription:
      "{showdown} 형식의 팀 하나, 또는 여러 팀이 든 백업 전체를 붙여넣으세요.",
    editDescription:
      "팀의 원본 텍스트입니다. 여기서 수정하거나 {showdown}에 붙여넣으세요.",
    showdown: "Pokemon Showdown",
    importPlaceholder: "여기에 팀을 붙여넣으세요",
    editPlaceholder: "팀이 비어 있습니다",
    label: "Pokemon Showdown 팀 원본 텍스트",
    kept: "닉네임, 레벨, 성별, 색이 다름, 테라스탈 타입, 성격, 노력치, 개체값은 유지됩니다. 친밀도는 무시됩니다.",
    import: "가져오기",
    update: "업데이트",
    imported: "팀을 가져왔습니다",
    importedMany: (count: number) => `팀 ${count}개를 가져왔습니다`,
    noChanges: "변경된 내용이 없습니다.",
  },
  deleteDialog: {
    title: (team: string) => `${josa(team, "을", "를")} 삭제할까요?`,
    thisTeam: "이 팀",
    description:
      "팀과 그 포켓몬이 이 브라우저에서 삭제됩니다. 되돌릴 수 없습니다.",
  },

  footer: {
    typeChart: "타입 상성표",
    manual: "설명서",
    manualTitle: "사용 설명서",
    credits: "크레딧",
    updates: (date: string) => `업데이트 (${date})`,
    updateLog: "업데이트 기록",
    privacyPolicy: "개인정보 처리방침",
    colorScheme: "색상 테마",
    systemTheme: "시스템 테마 사용",
    lightTheme: "라이트 테마 사용",
    darkTheme: "다크 테마 사용",
    githubRepo: "GitHub 저장소",
  },
  typeChart: {
    table: "표",
    list: "목록",
    infographic: "인포그래픽",
    tableAlt: "Bulbapedia 포켓몬 타입 상성표",
    listAlt: "목록형 포켓몬 타입 상성표",
    infographicAlt: "인포그래픽 타입 상성표",
    listCaption: "강한 상대 → 타입 → 강한 상대",
    infographicCaption: "7~9세대에도 적용됩니다",
  },
  credits: {
    showdown:
      "Pokemon Showdown 여러분이 스프라이트, 아이콘, 포켓몬 데이터를 모두 사용하도록 너그럽게 허락해 주셨습니다. 정말 없어서는 안 될 존재입니다!",
    alsoThanks: "다음 분들께도 감사드립니다",
    companies: "Nintendo, The Pokemon Company, Game Freak",
    companiesFor:
      "포켓몬 그 자체, 제목 옆의 포켓몬 셔플 아트, Pokémon LEGENDS Z-A의 메가진화 스프라이트",
    typeChartTable: "타입 상성표 (표)",
    fromBulbapedia: "Bulbapedia 제공",
    typeChartList: "타입 상성표 (목록)",
    typeChartInfographic: "타입 상성표 (인포그래픽)",
    fromRPokemon: "r/pokemon 제공",
    typeColours: "타입 색상",
    typeColoursFor: "팀 통계에 쓰인 각 타입의 색상",
    stunfiskFor: "좋은 커뮤니티입니다",
  },
  privacy: {
    playwire:
      "이 웹사이트 또는 앱의 광고 전부 또는 일부는 Playwire LLC가 관리합니다. Playwire의 퍼블리셔 광고 서비스가 사용되는 경우, Playwire LLC는 광고 목적으로 특정 집계·익명화 데이터를 수집하고 사용할 수 있습니다. 수집되는 데이터의 종류, 데이터 사용 방식, 사용자로서의 선택권에 관한 자세한 내용은 {link}에서 확인하세요.",
    advertise: "이 사이트에 광고하기.",
  },
  manual: {
    teams: "팀",
    teamsQuestion: "내 팀은 어디에 저장되나요?",
    teamsAnswer:
      "팀은 이 브라우저에 저장되므로 다시 방문해도 그대로 있지만, 다른 기기에서는 볼 수 없습니다. 팀 목록 버튼이 팀을 나열하며, 각 팀의 메뉴에서 이름 변경, 세대와 포맷 설정, 복제, 공유, 삭제를 할 수 있습니다. 전체 내보내기는 모든 팀을 Showdown 텍스트로 내려받고, 팀 가져오기가 그 파일을 다시 읽어 들입니다. 주소창에는 항상 현재 팀이 들어 있으므로, 주소를 복사하거나 팀 공유 버튼을 누르면 팀을 공유할 수 있습니다.",
    teamsAnswer2:
      "휴대폰과 태블릿에서는 더 보기 버튼을 누르면 팀 도구, 필터와 정렬 버튼, 고급 버튼이 나타납니다. 하단의 실행 취소와 다시 실행 버튼으로 현재 팀의 변경 내역을 오갈 수 있습니다.",
    generations: "세대",
    generationsQuestion: "세대를 바꾸면 무엇이 달라지나요?",
    generationsAnswer:
      "상단에서 고른 세대에 존재했던 포켓몬과 폼만 목록에 나타납니다. 메가진화는 6, 7, 9세대에, 거다이맥스 폼은 8세대에 나오는 식입니다. 그 밖의 모든 것은 최신 기준입니다. 기술, 특성, 타입 상성표, 포맷은 최신 게임을 따르므로, 옛 세대의 팀이 당시에는 배울 수 없던 기술을 알고 있을 수도 있습니다.",
    advanced: "고급 설정",
    advancedQuestion: "닉네임, 레벨, 성격, 노력치, 개체값",
    advancedAnswer:
      "각 포켓몬의 고급 버튼에서 Pokemon Showdown과 같은 방식으로 닉네임, 레벨, 성별, 색이 다름, 테라스탈 타입, 성격, 노력치, 개체값을 설정합니다. 이 정보는 공유 링크, 텍스트 복사, Pokepaste 편집 텍스트에 팀과 함께 담기며, 이름과 포맷 대화상자의 검사는 510을 넘는 노력치, 중복된 기술, 금지된 포켓몬, 클로즈 규정 위반을 알려 줍니다.",
    matrix: "매트릭스 분석",
    matrixQuestion: "타입 점수는 어디서 나오나요?",
    matrixAnswer:
      "분석 패널 메뉴의 매트릭스는 모든 타입을 모든 포켓몬과 대조해 보여 줍니다. 방어는 각 공격 타입이 특성과 지닌 물건까지 감안해 각 포켓몬에게 얼마나 효과적인지이고, 견제폭은 각 포켓몬의 가장 강력한 공격 기술이 각 타입에게 얼마나 효과적인지입니다. 칸을 누르면 이유가 표시됩니다.",
    defence: "팀 방어",
    defenceQuestion: "팀의 타입 방어는 어떻게 계산되나요?",
    defenceAnswer:
      "팀의 모든 포켓몬에게는 약한 타입과 저항하는 타입이 있습니다. 어떤 타입이 내 포켓몬에게 효과가 별로라면 점수를 얻고, 효과가 굉장하다면 점수를 잃습니다:",
    effectivenessHeading: "나에게 오는 타입 효과",
    pointsHeading: "점수",
    effectiveness: {
      immune: "효과 없음",
      quarter: "0.25배",
      half: "0.5배",
      neutral: "1배",
      double: "2배 (효과가 굉장함)",
      quadruple: "4배 (효과가 굉장함)",
    },
    note: "참고:",
    defenceNote:
      "부유, 두꺼운지방, 필터, 초식 같은 특성도 반영됩니다. 예를 들어 동탁군의 특성이 부유라면 땅 타입에 +1.5점을 얻고, 내열이라면 불꽃 타입에 0점이 됩니다.",
    coverage: "팀 타입 견제폭",
    coverageQuestion: "팀의 타입 견제폭은 어떻게 계산되나요?",
    coverageAnswer:
      "먼저, 타입 견제폭이란 무엇일까요? 내 기술이 얼마나 많은 타입에 효과가 굉장한지를 뜻합니다. 기술 하나가 어떤 타입에 효과가 굉장하면 +1을 얻습니다. 그 기술의 타입이 사용하는 포켓몬의 타입과 같다면(자속 보정, STAB) +1을 더 얻습니다.",
    coverageNote:
      "스카이스킨, 페어리스킨 같은 특성도 반영됩니다. 프리즈드라이, 플라잉프레스 같은 기술도 마찬가지입니다. 예를 들어 프리즈드라이는 물 타입에도 +1을 줍니다.",
    formats: "포맷 (티어)",
    formatsQuestion: "Ubers, OU, VGC 등은 무엇인가요?",
    formatsAnswer:
      "Ubers, OU, {vgc}는 일부 포켓몬을 금지하고 특정 규칙을 적용하는 포맷(티어)입니다. 배틀 스타디움 싱글/더블과 VGC만 The Pokemon Company가 공인한 것이고, 나머지는 {smogon}이 관리합니다. {faq} 또는 {guide}를 참고하세요.",
    vgc: "VGC",
    smogon: "Smogon",
    faq: "티어에 관한 Smogon의 FAQ",
    guide: "각 티어를 간단히 설명한 이 가이드",
    champions:
      "Pokemon Champions (M-C) 포맷은 Regulation M-C에서 Pokemon Champions에 사용할 수 있는 포켓몬만 나열하며, 메가진화도 포함합니다.",
    terms: "팀 체크리스트 용어",
    termsQuestion: "설치 기술, 강제 교체, 볼트턴 같은 말은 무슨 뜻인가요?",
    termsAnswer:
      "Smogon에 {dictionary}이 있지만 조금 오래되었습니다. 거기에 없는 용어 몇 가지를 정리했습니다:",
    dictionary: "포켓몬 용어 사전",
    termHeading: "용어",
    definitionHeading: "설명",
    definitions: [
      [
        "안개제거 요원",
        "안개제거(설치 기술을 날려 버리는 기술)를 아는 포켓몬입니다.",
      ],
      [
        "안정적인 회복 기술",
        "사용할 때마다 (일반적인 날씨에서) HP의 50% 이상을 확실히 회복하는 기술입니다. 예: HP회복, 알낳기, 밀크마시기, 무릎쉬기, 광합성.",
      ],
      [
        "상태이상 기술",
        "여기서는 명중률이 높은 마비, 화상, 독 기술과 잠들게 하는 기술을 뜻합니다. 예: 맹독, 도깨비불, 전기자석파, 노래하기.",
      ],
      [
        "랭크업 기술",
        "칼춤, 명상처럼 자신의 능력을 (되도록 2랭크 이상) 올리는 기술입니다.",
      ],
      [
        "구애 아이템",
        "능력치 하나를 50% 올리지만 기술 하나만 쓸 수 있게 묶어 두는 도구입니다. 구애머리띠, 구애안경, 구애스카프 세 가지가 있습니다.",
      ],
    ] as [string, string][],
  },
};

export default ko;
