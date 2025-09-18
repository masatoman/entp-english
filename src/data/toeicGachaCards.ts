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
  // 追加のCommon Cards
  {
    id: 10,
    word: "project",
    meaning: "プロジェクト、計画",
    partOfSpeech: "名詞",
    phonetic: "/ˈprɑːdʒekt/",
    rarity: "common",
    examples: [
      {
        sentence: "The project deadline is next month.",
        translation: "プロジェクトの締切は来月です。",
        situation: "TOEIC Part2 (プロジェクト管理)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "work on a project",
        meaning: "プロジェクトに取り組む",
        example: "We are working on a new project.",
        translation: "新しいプロジェクトに取り組んでいます。",
      },
    ],
    commonUsages: [
      {
        pattern: "project management",
        explanation: "プロジェクト管理",
        example: "Project management skills are important.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["plan", "task"],
      businessContext: "ビジネス基本語彙",
    },
  },
  {
    id: 11,
    word: "budget",
    meaning: "予算、経費",
    partOfSpeech: "名詞",
    phonetic: "/ˈbʌdʒɪt/",
    rarity: "common",
    examples: [
      {
        sentence: "We need to stay within budget.",
        translation: "予算内に収める必要があります。",
        situation: "TOEIC Part2 (予算管理)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "over budget",
        meaning: "予算オーバー",
        example: "The project went over budget.",
        translation: "プロジェクトは予算オーバーしました。",
      },
    ],
    commonUsages: [
      {
        pattern: "budget for something",
        explanation: "何かの予算を組む",
        example: "We need to budget for training.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["allocation", "funds"],
      businessContext: "財務管理の基本語彙",
    },
  },
  {
    id: 12,
    word: "client",
    meaning: "顧客、クライアント",
    partOfSpeech: "名詞",
    phonetic: "/ˈklaɪənt/",
    rarity: "common",
    examples: [
      {
        sentence: "The client is satisfied with our service.",
        translation: "顧客は私たちのサービスに満足しています。",
        situation: "TOEIC Part2 (顧客対応)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "client satisfaction",
        meaning: "顧客満足度",
        example: "Client satisfaction is our priority.",
        translation: "顧客満足度が私たちの優先事項です。",
      },
    ],
    commonUsages: [
      {
        pattern: "meet with a client",
        explanation: "顧客と会う",
        example: "I need to meet with a client today.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["customer", "buyer"],
      businessContext: "営業・サービス基本語彙",
    },
  },
  {
    id: 13,
    word: "report",
    meaning: "報告書、レポート",
    partOfSpeech: "名詞",
    phonetic: "/rɪˈpɔːrt/",
    rarity: "common",
    examples: [
      {
        sentence: "Please submit the report by Friday.",
        translation: "金曜日までにレポートを提出してください。",
        situation: "TOEIC Part2 (文書提出)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "write a report",
        meaning: "レポートを書く",
        example: "I need to write a monthly report.",
        translation: "月次レポートを書く必要があります。",
      },
    ],
    commonUsages: [
      {
        pattern: "annual report",
        explanation: "年次報告書",
        example: "The annual report will be published soon.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["document", "summary"],
      businessContext: "文書管理の基本語彙",
    },
  },
  {
    id: 14,
    word: "office",
    meaning: "オフィス、事務所",
    partOfSpeech: "名詞",
    phonetic: "/ˈɔːfɪs/",
    rarity: "common",
    examples: [
      {
        sentence: "The office is located downtown.",
        translation: "オフィスはダウンタウンにあります。",
        situation: "TOEIC Part1 (場所の説明)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "office building",
        meaning: "オフィスビル",
        example: "The new office building is modern.",
        translation: "新しいオフィスビルは現代的です。",
      },
    ],
    commonUsages: [
      {
        pattern: "at the office",
        explanation: "オフィスで",
        example: "I work at the office every day.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["workplace", "building"],
      businessContext: "職場環境の基本語彙",
    },
  },
  // 追加のUncommon Cards
  {
    id: 15,
    word: "strategy",
    meaning: "戦略、方針",
    partOfSpeech: "名詞",
    phonetic: "/ˈstrætədʒi/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "We need a new marketing strategy.",
        translation: "新しいマーケティング戦略が必要です。",
        situation: "TOEIC Part3 (戦略会議)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "develop a strategy",
        meaning: "戦略を立てる",
        example: "The team developed a winning strategy.",
        translation: "チームは勝利の戦略を立てました。",
      },
    ],
    commonUsages: [
      {
        pattern: "business strategy",
        explanation: "ビジネス戦略",
        example: "Our business strategy focuses on innovation.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["plan", "approach"],
      businessContext: "経営戦略の重要語彙",
    },
  },
  {
    id: 16,
    word: "evaluate",
    meaning: "評価する、査定する",
    partOfSpeech: "動詞",
    phonetic: "/ɪˈvæljueɪt/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "We need to evaluate the results.",
        translation: "結果を評価する必要があります。",
        situation: "TOEIC Part3 (結果分析)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "evaluate performance",
        meaning: "業績を評価する",
        example: "The manager evaluated employee performance.",
        translation: "マネージャーは従業員の業績を評価しました。",
      },
    ],
    commonUsages: [
      {
        pattern: "evaluate the situation",
        explanation: "状況を評価する",
        example: "Let's evaluate the current situation.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["assess", "analyze"],
      businessContext: "分析・評価の重要語彙",
    },
  },
  {
    id: 17,
    word: "efficient",
    meaning: "効率的な、能率的な",
    partOfSpeech: "形容詞",
    phonetic: "/ɪˈfɪʃənt/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "We need a more efficient system.",
        translation: "より効率的なシステムが必要です。",
        situation: "TOEIC Part3 (システム改善)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "efficient operation",
        meaning: "効率的な運営",
        example: "The company focuses on efficient operation.",
        translation: "会社は効率的な運営に焦点を当てています。",
      },
    ],
    commonUsages: [
      {
        pattern: "cost-efficient",
        explanation: "コスト効率の良い",
        example: "We need cost-efficient solutions.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["productive", "effective"],
      businessContext: "効率性の重要語彙",
    },
  },
  {
    id: 18,
    word: "analyze",
    meaning: "分析する、検討する",
    partOfSpeech: "動詞",
    phonetic: "/ˈænəlaɪz/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "We need to analyze the market data.",
        translation: "市場データを分析する必要があります。",
        situation: "TOEIC Part3 (データ分析)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "analyze trends",
        meaning: "トレンドを分析する",
        example: "The team analyzed market trends.",
        translation: "チームは市場トレンドを分析しました。",
      },
    ],
    commonUsages: [
      {
        pattern: "analyze the situation",
        explanation: "状況を分析する",
        example: "Let's analyze the current situation.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["examine", "study"],
      businessContext: "分析業務の重要語彙",
    },
  },
  {
    id: 19,
    word: "collaborate",
    meaning: "協力する、共同作業する",
    partOfSpeech: "動詞",
    phonetic: "/kəˈlæbəreɪt/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "We need to collaborate with other departments.",
        translation: "他の部署と協力する必要があります。",
        situation: "TOEIC Part3 (部門間協力)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "collaborate on a project",
        meaning: "プロジェクトで協力する",
        example: "The teams collaborated on the project.",
        translation: "チームはプロジェクトで協力しました。",
      },
    ],
    commonUsages: [
      {
        pattern: "collaborate with someone",
        explanation: "誰かと協力する",
        example: "We collaborate with external partners.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["cooperate", "work together"],
      businessContext: "チームワークの重要語彙",
    },
  },
  // 追加のRare Cards
  {
    id: 20,
    word: "innovative",
    meaning: "革新的な、独創的な",
    partOfSpeech: "形容詞",
    phonetic: "/ˈɪnəveɪtɪv/",
    rarity: "rare",
    examples: [
      {
        sentence: "We need innovative solutions for this problem.",
        translation: "この問題に対して革新的な解決策が必要です。",
        situation: "TOEIC Part4 (技術革新)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "innovative approach",
        meaning: "革新的なアプローチ",
        example: "The company took an innovative approach.",
        translation: "会社は革新的なアプローチを取りました。",
      },
    ],
    commonUsages: [
      {
        pattern: "innovative technology",
        explanation: "革新的な技術",
        example: "We develop innovative technology.",
      },
    ],
    toeicSpecific: {
      parts: ["Part4", "Part7"],
      frequency: "medium",
      scoreBand: "600-700",
      synonyms: ["creative", "original"],
      businessContext: "技術革新の上級語彙",
    },
  },
  {
    id: 21,
    word: "comprehensive",
    meaning: "包括的な、総合的な",
    partOfSpeech: "形容詞",
    phonetic: "/ˌkɑːmprɪˈhensɪv/",
    rarity: "rare",
    examples: [
      {
        sentence: "We need a comprehensive analysis of the market.",
        translation: "市場の包括的な分析が必要です。",
        situation: "TOEIC Part7 (市場調査)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "comprehensive report",
        meaning: "包括的な報告書",
        example: "The comprehensive report was published.",
        translation: "包括的な報告書が発表されました。",
      },
    ],
    commonUsages: [
      {
        pattern: "comprehensive study",
        explanation: "包括的な研究",
        example: "We conducted a comprehensive study.",
      },
    ],
    toeicSpecific: {
      parts: ["Part4", "Part7"],
      frequency: "medium",
      scoreBand: "600-700",
      synonyms: ["complete", "thorough"],
      businessContext: "分析・調査の上級語彙",
    },
  },
  {
    id: 22,
    word: "sophisticated",
    meaning: "洗練された、高度な",
    partOfSpeech: "形容詞",
    phonetic: "/səˈfɪstɪkeɪtɪd/",
    rarity: "rare",
    examples: [
      {
        sentence: "We use sophisticated technology in our products.",
        translation: "製品に洗練された技術を使用しています。",
        situation: "TOEIC Part4 (技術説明)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "sophisticated system",
        meaning: "高度なシステム",
        example: "The sophisticated system improved efficiency.",
        translation: "高度なシステムが効率を向上させました。",
      },
    ],
    commonUsages: [
      {
        pattern: "sophisticated analysis",
        explanation: "高度な分析",
        example: "We need sophisticated analysis tools.",
      },
    ],
    toeicSpecific: {
      parts: ["Part4", "Part7"],
      frequency: "medium",
      scoreBand: "600-700",
      synonyms: ["advanced", "complex"],
      businessContext: "技術・システムの上級語彙",
    },
  },
  {
    id: 23,
    word: "substantial",
    meaning: "相当な、重要な",
    partOfSpeech: "形容詞",
    phonetic: "/səbˈstænʃəl/",
    rarity: "rare",
    examples: [
      {
        sentence: "We made substantial progress this quarter.",
        translation: "今四半期で相当な進歩を遂げました。",
        situation: "TOEIC Part4 (業績報告)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "substantial increase",
        meaning: "大幅な増加",
        example: "We saw a substantial increase in sales.",
        translation: "売上で大幅な増加が見られました。",
      },
    ],
    commonUsages: [
      {
        pattern: "substantial amount",
        explanation: "相当な量",
        example: "We invested a substantial amount.",
      },
    ],
    toeicSpecific: {
      parts: ["Part4", "Part7"],
      frequency: "medium",
      scoreBand: "600-700",
      synonyms: ["significant", "considerable"],
      businessContext: "数量・程度の上級語彙",
    },
  },
  {
    id: 24,
    word: "optimize",
    meaning: "最適化する、効率化する",
    partOfSpeech: "動詞",
    phonetic: "/ˈɑːptɪmaɪz/",
    rarity: "rare",
    examples: [
      {
        sentence: "We need to optimize our production process.",
        translation: "生産プロセスを最適化する必要があります。",
        situation: "TOEIC Part4 (生産効率)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "optimize performance",
        meaning: "性能を最適化する",
        example: "The team optimized system performance.",
        translation: "チームはシステムの性能を最適化しました。",
      },
    ],
    commonUsages: [
      {
        pattern: "optimize efficiency",
        explanation: "効率を最適化する",
        example: "We need to optimize efficiency.",
      },
    ],
    toeicSpecific: {
      parts: ["Part4", "Part7"],
      frequency: "medium",
      scoreBand: "600-700",
      synonyms: ["improve", "enhance"],
      businessContext: "効率化の上級語彙",
    },
  },
  // 追加のEpic Cards
  {
    id: 25,
    word: "infrastructure",
    meaning: "インフラ、基盤",
    partOfSpeech: "名詞",
    phonetic: "/ˈɪnfrəstrʌktʃər/",
    rarity: "epic",
    examples: [
      {
        sentence: "We need to upgrade our IT infrastructure.",
        translation: "ITインフラをアップグレードする必要があります。",
        situation: "TOEIC Part7 (技術基盤)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "digital infrastructure",
        meaning: "デジタルインフラ",
        example: "The company invested in digital infrastructure.",
        translation: "会社はデジタルインフラに投資しました。",
      },
    ],
    commonUsages: [
      {
        pattern: "infrastructure development",
        explanation: "インフラ開発",
        example: "Infrastructure development is crucial.",
      },
    ],
    toeicSpecific: {
      parts: ["Part7"],
      frequency: "low",
      scoreBand: "700-800",
      synonyms: ["foundation", "framework"],
      businessContext: "技術基盤の専門語彙",
    },
  },
  {
    id: 26,
    word: "methodology",
    meaning: "方法論、手法",
    partOfSpeech: "名詞",
    phonetic: "/ˌmeθəˈdɑːlədʒi/",
    rarity: "epic",
    examples: [
      {
        sentence: "We use a proven methodology for project management.",
        translation: "プロジェクト管理に実証済みの方法論を使用しています。",
        situation: "TOEIC Part7 (管理手法)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "research methodology",
        meaning: "研究方法論",
        example: "The research methodology was sound.",
        translation: "研究方法論は適切でした。",
      },
    ],
    commonUsages: [
      {
        pattern: "agile methodology",
        explanation: "アジャイル手法",
        example: "We adopted agile methodology.",
      },
    ],
    toeicSpecific: {
      parts: ["Part7"],
      frequency: "low",
      scoreBand: "700-800",
      synonyms: ["approach", "technique"],
      businessContext: "管理手法の専門語彙",
    },
  },
  // 追加のLegendary Cards
  {
    id: 27,
    word: "entrepreneurship",
    meaning: "起業家精神、アントレプレナーシップ",
    partOfSpeech: "名詞",
    phonetic: "/ˌɑːntrəprəˈnɜːrʃɪp/",
    rarity: "legendary",
    examples: [
      {
        sentence: "Entrepreneurship drives innovation in our economy.",
        translation: "起業家精神が経済の革新を推進しています。",
        situation: "TOEIC Part7 (経済論)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "social entrepreneurship",
        meaning: "ソーシャルアントレプレナーシップ",
        example: "Social entrepreneurship is growing rapidly.",
        translation: "ソーシャルアントレプレナーシップが急速に成長しています。",
      },
    ],
    commonUsages: [
      {
        pattern: "entrepreneurship education",
        explanation: "起業家教育",
        example: "Entrepreneurship education is important.",
      },
    ],
    toeicSpecific: {
      parts: ["Part7"],
      frequency: "low",
      scoreBand: "800+",
      synonyms: ["innovation", "initiative"],
      businessContext: "最高級ビジネス概念",
    },
  },
  {
    id: 28,
    word: "sustainability",
    meaning: "持続可能性、サステナビリティ",
    partOfSpeech: "名詞",
    phonetic: "/səˌsteɪnəˈbɪləti/",
    rarity: "legendary",
    examples: [
      {
        sentence: "Sustainability is a key focus for modern businesses.",
        translation: "持続可能性は現代企業の重要な焦点です。",
        situation: "TOEIC Part7 (企業責任)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "environmental sustainability",
        meaning: "環境持続可能性",
        example: "Environmental sustainability is our priority.",
        translation: "環境持続可能性が私たちの優先事項です。",
      },
    ],
    commonUsages: [
      {
        pattern: "sustainability goals",
        explanation: "持続可能性目標",
        example: "We set ambitious sustainability goals.",
      },
    ],
    toeicSpecific: {
      parts: ["Part7"],
      frequency: "low",
      scoreBand: "800+",
      synonyms: ["viability", "endurance"],
      businessContext: "最高級ビジネス概念",
    },
  },

  // 追加カード（50枚追加）
  {
    id: 51,
    word: "deadline",
    meaning: "締切、期限",
    partOfSpeech: "名詞",
    phonetic: "/ˈdedlaɪn/",
    rarity: "common",
    examples: [
      {
        sentence: "The deadline for the project is next Friday.",
        translation: "プロジェクトの締切は来週の金曜日です。",
        situation: "TOEIC Part3 (プロジェクト管理)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "meet the deadline",
        meaning: "締切に間に合う",
        example: "We need to work overtime to meet the deadline.",
        translation: "締切に間に合うため残業する必要があります。",
      },
    ],
    commonUsages: [
      {
        pattern: "set a deadline",
        explanation: "締切を設定する",
        example: "The manager set a deadline for the report.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "very_high",
      scoreBand: "400-600",
      synonyms: ["due date", "time limit"],
      businessContext: "プロジェクト管理・スケジュール",
    },
  },
  {
    id: 52,
    word: "budget",
    meaning: "予算、予算案",
    partOfSpeech: "名詞",
    phonetic: "/ˈbʌdʒɪt/",
    rarity: "common",
    examples: [
      {
        sentence: "We need to stay within the budget.",
        translation: "予算内に収める必要があります。",
        situation: "TOEIC Part4 (財務会議)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "exceed the budget",
        meaning: "予算を超過する",
        example: "The project exceeded the budget by 20%.",
        translation: "プロジェクトは予算を20%超過しました。",
      },
    ],
    commonUsages: [
      {
        pattern: "prepare a budget",
        explanation: "予算を準備する",
        example: "The team prepared a detailed budget.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "500-700",
      synonyms: ["allocation", "funding"],
      businessContext: "財務・会計",
    },
  },
  {
    id: 53,
    word: "revenue",
    meaning: "収益、売上",
    partOfSpeech: "名詞",
    phonetic: "/ˈrevənjuː/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "The company's revenue increased by 15% this quarter.",
        translation: "会社の収益は今四半期15%増加しました。",
        situation: "TOEIC Part7 (決算報告)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "generate revenue",
        meaning: "収益を生み出す",
        example: "This new product will generate significant revenue.",
        translation: "この新製品は大きな収益を生み出すでしょう。",
      },
    ],
    commonUsages: [
      {
        pattern: "annual revenue",
        explanation: "年間収益",
        example: "The annual revenue reached $2 million.",
      },
    ],
    toeicSpecific: {
      parts: ["Part4", "Part7"],
      frequency: "high",
      scoreBand: "600-800",
      synonyms: ["income", "earnings"],
      businessContext: "財務・業績",
    },
  },
  {
    id: 54,
    word: "efficient",
    meaning: "効率的な、能率的な",
    partOfSpeech: "形容詞",
    phonetic: "/ɪˈfɪʃənt/",
    rarity: "common",
    examples: [
      {
        sentence: "We need a more efficient way to handle customer complaints.",
        translation: "顧客の苦情をより効率的に処理する方法が必要です。",
        situation: "TOEIC Part3 (業務改善)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "energy efficient",
        meaning: "エネルギー効率の良い",
        example: "This building is energy efficient.",
        translation: "この建物はエネルギー効率が良いです。",
      },
    ],
    commonUsages: [
      {
        pattern: "be efficient at/in",
        explanation: "～が効率的である",
        example: "She is efficient at managing projects.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "500-700",
      synonyms: ["effective", "productive"],
      businessContext: "業務効率・生産性",
    },
  },
  {
    id: 55,
    word: "collaborate",
    meaning: "協力する、共同作業する",
    partOfSpeech: "動詞",
    phonetic: "/kəˈlæbəreɪt/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "Our team will collaborate with the design department.",
        translation: "私たちのチームはデザイン部門と協力します。",
        situation: "TOEIC Part3 (チームワーク)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "collaborate closely",
        meaning: "密接に協力する",
        example: "The two companies collaborate closely on research.",
        translation: "両社は研究で密接に協力しています。",
      },
    ],
    commonUsages: [
      {
        pattern: "collaborate with",
        explanation: "～と協力する",
        example: "We collaborate with international partners.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "medium",
      scoreBand: "600-800",
      synonyms: ["cooperate", "work together"],
      businessContext: "チームワーク・パートナーシップ",
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
