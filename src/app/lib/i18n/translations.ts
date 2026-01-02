export const translations = {
  ja: {
    // Page
    pageTitle: "九星気学 方位吉凶計算",
    helpLink: "使い方・見方",

    // Form
    targetYear: "対象年",
    birthYear: "生年",
    birthMonth: "生月",
    calculate: "計算",
    add: "＋ 追加",
    delete: "削除",
    person: (n: number) => `${n}人目`,
    yearSuffix: "年",
    monthSuffix: "月",
    selectPlaceholder: "選択",

    // Table
    direction: "方位",
    yearBoard: "年盤",
    honmei: "本",
    getsumei: "月",

    // Directions
    directions: {
      south: "南",
      southwest: "南西",
      west: "西",
      northwest: "北西",
      north: "北",
      northeast: "北東",
      east: "東",
      southeast: "南東",
    },

    // Help Dialog
    helpTitle: "使い方・見方",
    helpUsage: "使い方",
    helpUsageItems: [
      "生年月日欄に該当する生年月をご入力ください。",
      "「計算」ボタンを押下すると入力した年と月を元にあなたの吉方位を算出いたします。",
    ],
    helpYearBoard: "年盤の見方",
    helpYearBoardItems: [
      "一年（本年2月3日位～翌年1月末まで）通したあなたの吉方位・凶方位を表します。",
      "年盤は方位を取った場合、その効果が大きく、永く続くのが特徴です。",
      "引っ越しや、移動距離が500kmを超える旅行など、大きな移動はこちらを参照します。",
    ],
    helpMonthBoard: "月盤の見方",
    helpMonthBoardItems: [
      "当該月（当月3日～翌月2日位まで）のあなたの吉方位・凶方位を表します。",
      "月盤は年盤に比べると効果は弱いですが、その分移動距離が少なくて済む（150～499km）のが特徴です。",
      "海外旅行や引っ越しを頻繁に行えない方で毎月方位取りをする方に向いています。",
    ],
    helpResults: "算出結果の見方",
    helpResultsDescription: "当ツールでは以下の表の様に考えております。",

    // Help Table Headers
    helpTableHonmei: "本",
    helpTableGetsumei: "月",
    helpTableFortune: "運勢",
    helpTableYearCase: "年盤の場合",
    helpTableMonthCase: "月盤の場合",

    // Fortune levels
    fortuneDaikichi: "大吉",
    fortuneChukichi: "中吉",
    fortuneShokichi: "小吉",
    fortuneKyo: "凶",
    fortuneDaikyo: "大凶",

    // Fortune descriptions
    yearDaikichiDesc: "転居または500km以上の旅行に非常におすすめ",
    yearChukichiDesc: "転居または500km以上の旅行にややおすすめ",
    yearShokichiDesc: "転居または500km以上の旅行に行ってもよい",
    yearKyoDesc: "転居または500km以上の旅行に行かない方が良い",
    yearDaikyoDesc: "転居または500km以上の旅行は行ってはいけない",
    monthDaikichiDesc: "150km～499kmまでの旅行に非常におすすめ",
    monthChukichiDesc: "150km～499kmまでの旅行にややおすすめ",
    monthShokichiDesc: "150km～499kmまでの旅行に行ってもよい",
    monthKyoDesc: "150km～499kmまでの旅行に行かない方が良い",
    monthDaikyoDesc: "150km～499kmまでの旅行は行ってはいけない",
  },
  en: {
    // Page
    pageTitle: "Nine Star Ki Direction Calculator",
    helpLink: "How to Use",

    // Form
    targetYear: "Target Year",
    birthYear: "Birth Year",
    birthMonth: "Birth Month",
    calculate: "Calculate",
    add: "+ Add",
    delete: "Delete",
    person: (n: number) => `Person ${n}`,
    yearSuffix: "",
    monthSuffix: "",
    selectPlaceholder: "Select",

    // Table
    direction: "Direction",
    yearBoard: "Year",
    honmei: "H",
    getsumei: "G",

    // Directions
    directions: {
      south: "S",
      southwest: "SW",
      west: "W",
      northwest: "NW",
      north: "N",
      northeast: "NE",
      east: "E",
      southeast: "SE",
    },

    // Help Dialog
    helpTitle: "How to Use",
    helpUsage: "Usage",
    helpUsageItems: [
      "Enter your birth year and month.",
      "Press the Calculate button to calculate your auspicious directions.",
    ],
    helpYearBoard: "Understanding the Year Chart",
    helpYearBoardItems: [
      "Shows your auspicious/inauspicious directions for the year (Feb 3rd ~ end of Jan next year).",
      "Year chart effects are strong and long-lasting.",
      "Use for major moves like relocation or trips over 500km.",
    ],
    helpMonthBoard: "Understanding the Month Chart",
    helpMonthBoardItems: [
      "Shows your auspicious/inauspicious directions for the month (3rd ~ 2nd of next month).",
      "Month chart effects are weaker but require less travel distance (150-499km).",
      "Suitable for those who cannot travel abroad or relocate frequently.",
    ],
    helpResults: "Understanding Results",
    helpResultsDescription: "This tool interprets the results as follows:",

    // Help Table Headers
    helpTableHonmei: "H",
    helpTableGetsumei: "G",
    helpTableFortune: "Fortune",
    helpTableYearCase: "Year Chart",
    helpTableMonthCase: "Month Chart",

    // Fortune levels
    fortuneDaikichi: "Great",
    fortuneChukichi: "Good",
    fortuneShokichi: "Fair",
    fortuneKyo: "Bad",
    fortuneDaikyo: "Avoid",

    // Fortune descriptions
    yearDaikichiDesc: "Highly recommended for relocation or trips over 500km",
    yearChukichiDesc: "Recommended for relocation or trips over 500km",
    yearShokichiDesc: "Acceptable for relocation or trips over 500km",
    yearKyoDesc: "Not recommended for relocation or trips over 500km",
    yearDaikyoDesc: "Must avoid for relocation or trips over 500km",
    monthDaikichiDesc: "Highly recommended for trips 150-499km",
    monthChukichiDesc: "Recommended for trips 150-499km",
    monthShokichiDesc: "Acceptable for trips 150-499km",
    monthKyoDesc: "Not recommended for trips 150-499km",
    monthDaikyoDesc: "Must avoid for trips 150-499km",
  },
} as const;

export type Locale = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)["ja"];
