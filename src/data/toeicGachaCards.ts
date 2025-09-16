import { GachaPack, WordCard } from "../types/gacha";

export const toeicWordCards: WordCard[] = [
  // Common Cards (基本ビジネス語彙)
  {
    id: 1,
    word: "meeting",
    meaning: "会議、打ち合わせ",
    partOfSpeech: "名詞",
    phonetic: "/ˈmiːtɪŋ/",
    rarity: "common",
    examples: [
      {
        sentence: "The meeting will start at 9 AM.",
        translation: "会議は午前9時に始まります。",
        situation: "TOEIC Part2 (時間・スケジュール)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "attend a meeting",
        meaning: "会議に出席する",
        example: "All employees must attend the meeting.",
        translation: "全従業員が会議に出席しなければならない。",
      },
    ],
    commonUsages: [
      {
        pattern: "have/hold a meeting",
        explanation: "会議を開く",
        example: "We will hold a meeting tomorrow.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["conference", "assembly"],
      businessContext: "オフィス環境での基本語彙",
    },
  },
  {
    id: 2,
    word: "schedule",
    meaning: "スケジュール、予定表",
    partOfSpeech: "名詞",
    phonetic: "/ˈʃedjuːl/",
    rarity: "common",
    examples: [
      {
        sentence: "Please check the schedule for next week.",
        translation: "来週のスケジュールを確認してください。",
        situation: "TOEIC Part2 (スケジュール確認)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "on schedule",
        meaning: "予定通りに",
        example: "The project is on schedule.",
        translation: "プロジェクトは予定通りに進んでいます。",
      },
    ],
    commonUsages: [
      {
        pattern: "behind/ahead of schedule",
        explanation: "予定より遅れて/早く",
        example: "We are ahead of schedule.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["timetable", "agenda"],
      businessContext: "時間管理の基本語彙",
    },
  },
  {
    id: 3,
    word: "deadline",
    meaning: "締切、期限",
    partOfSpeech: "名詞",
    phonetic: "/ˈdedlaɪn/",
    rarity: "common",
    examples: [
      {
        sentence: "The deadline for the report is Friday.",
        translation: "レポートの締切は金曜日です。",
        situation: "TOEIC Part2 (期限の確認)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "meet a deadline",
        meaning: "締切に間に合わせる",
        example: "We need to meet the deadline.",
        translation: "締切に間に合わせる必要があります。",
      },
    ],
    commonUsages: [
      {
        pattern: "extend the deadline",
        explanation: "締切を延長する",
        example: "Can we extend the deadline?",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["due date", "cutoff"],
      businessContext: "プロジェクト管理の基本語彙",
    },
  },
  // Uncommon Cards (中級ビジネス語彙)
  {
    id: 4,
    word: "negotiate",
    meaning: "交渉する、協議する",
    partOfSpeech: "動詞",
    phonetic: "/nɪˈɡoʊʃieɪt/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "We need to negotiate the contract terms.",
        translation: "契約条件を交渉する必要があります。",
        situation: "TOEIC Part3 (ビジネス交渉)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "negotiate a deal",
        meaning: "取引を交渉する",
        example: "They negotiated a better deal.",
        translation: "彼らはより良い取引を交渉しました。",
      },
    ],
    commonUsages: [
      {
        pattern: "negotiate with someone",
        explanation: "誰かと交渉する",
        example: "We negotiated with the supplier.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["bargain", "discuss"],
      businessContext: "ビジネス交渉の重要語彙",
    },
  },
  {
    id: 5,
    word: "implement",
    meaning: "実施する、実行する",
    partOfSpeech: "動詞",
    phonetic: "/ˈɪmplɪment/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "We will implement the new system next month.",
        translation: "来月新しいシステムを実施します。",
        situation: "TOEIC Part3 (システム導入)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "implement a plan",
        meaning: "計画を実行する",
        example: "The team implemented the marketing plan.",
        translation: "チームはマーケティング計画を実行しました。",
      },
    ],
    commonUsages: [
      {
        pattern: "implement changes",
        explanation: "変更を実施する",
        example: "We need to implement changes.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["execute", "carry out"],
      businessContext: "プロジェクト実行の重要語彙",
    },
  },
  // Rare Cards (上級ビジネス語彙)
  {
    id: 6,
    word: "acquisition",
    meaning: "買収、取得",
    partOfSpeech: "名詞",
    phonetic: "/ˌækwɪˈzɪʃən/",
    rarity: "rare",
    examples: [
      {
        sentence: "The acquisition will expand our market share.",
        translation: "この買収により市場シェアが拡大します。",
        situation: "TOEIC Part4 (企業買収発表)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "merger and acquisition",
        meaning: "合併・買収",
        example: "M&A activities increased this year.",
        translation: "今年はM&A活動が増加しました。",
      },
    ],
    commonUsages: [
      {
        pattern: "acquisition of something",
        explanation: "何かの取得",
        example: "The acquisition of new technology.",
      },
    ],
    toeicSpecific: {
      parts: ["Part4", "Part7"],
      frequency: "medium",
      scoreBand: "600-700",
      synonyms: ["purchase", "takeover"],
      businessContext: "企業戦略の上級語彙",
    },
  },
  {
    id: 7,
    word: "sustainable",
    meaning: "持続可能な、継続可能な",
    partOfSpeech: "形容詞",
    phonetic: "/səˈsteɪnəbəl/",
    rarity: "rare",
    examples: [
      {
        sentence: "We need sustainable business practices.",
        translation: "持続可能なビジネス慣行が必要です。",
        situation: "TOEIC Part4 (環境・CSR)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "sustainable development",
        meaning: "持続可能な開発",
        example: "Sustainable development is our priority.",
        translation: "持続可能な開発が私たちの優先事項です。",
      },
    ],
    commonUsages: [
      {
        pattern: "sustainable growth",
        explanation: "持続可能な成長",
        example: "We aim for sustainable growth.",
      },
    ],
    toeicSpecific: {
      parts: ["Part4", "Part7"],
      frequency: "medium",
      scoreBand: "600-700",
      synonyms: ["viable", "enduring"],
      businessContext: "現代ビジネスの重要概念",
    },
  },
  // Epic Cards (専門ビジネス語彙)
  {
    id: 8,
    word: "leverage",
    meaning: "活用する、レバレッジをかける",
    partOfSpeech: "動詞",
    phonetic: "/ˈlevərɪdʒ/",
    rarity: "epic",
    examples: [
      {
        sentence:
          "We can leverage our technology to gain competitive advantage.",
        translation: "競争優位を得るために技術を活用できます。",
        situation: "TOEIC Part7 (戦略的提携)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "leverage resources",
        meaning: "リソースを活用する",
        example: "We need to leverage our resources effectively.",
        translation: "リソースを効果的に活用する必要があります。",
      },
    ],
    commonUsages: [
      {
        pattern: "leverage something to do",
        explanation: "何かを活用して〜する",
        example: "We leverage data to improve services.",
      },
    ],
    toeicSpecific: {
      parts: ["Part7"],
      frequency: "low",
      scoreBand: "700-800",
      synonyms: ["utilize", "exploit"],
      businessContext: "戦略的ビジネス用語",
    },
  },
  // Legendary Cards (最高級ビジネス語彙)
  {
    id: 9,
    word: "paradigm",
    meaning: "パラダイム、思考の枠組み",
    partOfSpeech: "名詞",
    phonetic: "/ˈpærədaɪm/",
    rarity: "legendary",
    examples: [
      {
        sentence: "This represents a paradigm shift in our industry.",
        translation:
          "これは私たちの業界におけるパラダイムシフトを表しています。",
        situation: "TOEIC Part7 (業界変革)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "paradigm shift",
        meaning: "パラダイムシフト",
        example: "The digital revolution caused a paradigm shift.",
        translation: "デジタル革命はパラダイムシフトを引き起こしました。",
      },
    ],
    commonUsages: [
      {
        pattern: "new paradigm",
        explanation: "新しいパラダイム",
        example: "We need a new paradigm for success.",
      },
    ],
    toeicSpecific: {
      parts: ["Part7"],
      frequency: "low",
      scoreBand: "800+",
      synonyms: ["framework", "model"],
      businessContext: "最高級ビジネス概念",
    },
  },
];

export const gachaPacks: GachaPack[] = [
  {
    id: "toeic_beginner",
    name: "TOEIC基礎パック",
    description: "Part1-2でよく出る基本ビジネス語彙8枚",
    theme: "part1_2",
    targetScore: "400-500",
    cards: [], // ランダム生成される
    rarity: "normal",
    cost: 100,
  },
  {
    id: "toeic_intermediate",
    name: "TOEIC中級パック",
    description: "Part3-4の会話・説明文で頻出する語彙8枚",
    theme: "part3_4",
    targetScore: "500-600",
    cards: [],
    rarity: "premium",
    cost: 200,
  },
  {
    id: "toeic_advanced",
    name: "TOEIC上級パック",
    description: "Part5-6の文法・語彙問題で出る難語彙8枚",
    theme: "part5_6",
    targetScore: "600-700",
    cards: [],
    rarity: "premium",
    cost: 300,
  },
  {
    id: "toeic_reading",
    name: "TOEIC読解パック",
    description: "Part7の長文読解で重要な語彙8枚",
    theme: "part7",
    targetScore: "700-800",
    cards: [],
    rarity: "legendary",
    cost: 500,
  },
  {
    id: "toeic_mixed",
    name: "TOEIC総合パック",
    description: "全パートから厳選した語彙8枚",
    theme: "mixed",
    targetScore: "800+",
    cards: [],
    rarity: "legendary",
    cost: 800,
  },
];
