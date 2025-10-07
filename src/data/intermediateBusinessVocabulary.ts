import { WordCard } from "../types/gacha";

// Week 1: 中級ビジネス語彙（ID 171-300）
// TOEIC 500-700点帯をカバーする中級語彙

export const intermediateBusinessVocabulary: WordCard[] = [
  // マーケティング・営業 (ID 171-190)
  {
    id: 171,
    word: "marketing",
    meaning: "マーケティング、市場戦略",
    partOfSpeech: "名詞",
    phonetic: "/ˈmɑrkətɪŋ/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "Our marketing strategy focuses on digital channels.",
        translation:
          "私たちのマーケティング戦略はデジタルチャネルに焦点を当てています。",
        situation: "TOEIC Part3 (マーケティング戦略)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "digital marketing",
        meaning: "デジタルマーケティング",
        example: "Digital marketing is becoming more important.",
        translation: "デジタルマーケティングがより重要になっています。",
      },
    ],
    commonUsages: [
      {
        pattern: "marketing campaign",
        explanation: "マーケティングキャンペーン",
        example: "We launched a new marketing campaign.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "600-700",
      synonyms: ["promotion", "advertising"],
      businessContext: "マーケティング・営業の重要語彙",
    },
  },
  {
    id: 172,
    word: "promotion",
    meaning: "昇進、プロモーション",
    partOfSpeech: "名詞",
    phonetic: "/prəˈmoʊʃən/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "She received a promotion last month.",
        translation: "彼女は先月昇進しました。",
        situation: "TOEIC Part3 (人事・昇進)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "get a promotion",
        meaning: "昇進する",
        example: "He hopes to get a promotion this year.",
        translation: "彼は今年昇進することを望んでいます。",
      },
    ],
    commonUsages: [
      {
        pattern: "promotion opportunity",
        explanation: "昇進の機会",
        example: "This is a great promotion opportunity.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "600-700",
      synonyms: ["advancement", "raise"],
      businessContext: "人事・キャリアの重要語彙",
    },
  },
  {
    id: 173,
    word: "sales",
    meaning: "売上、営業",
    partOfSpeech: "名詞",
    phonetic: "/seɪlz/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "Sales increased by 20% this quarter.",
        translation: "今四半期の売上は20%増加しました。",
        situation: "TOEIC Part4 (売上報告)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "sales target",
        meaning: "売上目標",
        example: "We exceeded our sales target.",
        translation: "売上目標を上回りました。",
      },
    ],
    commonUsages: [
      {
        pattern: "increase sales",
        explanation: "売上を増やす",
        example: "We need to increase sales.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "600-700",
      synonyms: ["revenue", "earnings"],
      businessContext: "営業・売上の重要語彙",
    },
  },
  {
    id: 174,
    word: "customer",
    meaning: "顧客、お客様",
    partOfSpeech: "名詞",
    phonetic: "/ˈkʌstəmər/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "Customer satisfaction is our top priority.",
        translation: "顧客満足度が私たちの最優先事項です。",
        situation: "TOEIC Part4 (顧客サービス)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "customer service",
        meaning: "顧客サービス",
        example: "Our customer service is excellent.",
        translation: "私たちの顧客サービスは優秀です。",
      },
    ],
    commonUsages: [
      {
        pattern: "loyal customer",
        explanation: "忠実な顧客",
        example: "We value our loyal customers.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part3", "Part4", "Part7"],
      frequency: "very_high",
      scoreBand: "600-700",
      synonyms: ["client", "buyer"],
      businessContext: "営業・顧客の重要語彙",
    },
  },
  {
    id: 175,
    word: "product",
    meaning: "製品、プロダクト",
    partOfSpeech: "名詞",
    phonetic: "/ˈprɑdəkt/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "Our new product will be launched next month.",
        translation: "新製品は来月発売されます。",
        situation: "TOEIC Part4 (製品発表)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "new product",
        meaning: "新製品",
        example: "The new product is very popular.",
        translation: "新製品はとても人気です。",
      },
    ],
    commonUsages: [
      {
        pattern: "develop a product",
        explanation: "製品を開発する",
        example: "We are developing a new product.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "600-700",
      synonyms: ["item", "goods"],
      businessContext: "製品・開発の重要語彙",
    },
  },

  // 財務・会計 (ID 176-195)
  {
    id: 176,
    word: "finance",
    meaning: "財務、金融",
    partOfSpeech: "名詞",
    phonetic: "/ˈfaɪnæns/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "The finance department handles all budgets.",
        translation: "財務部門がすべての予算を管理しています。",
        situation: "TOEIC Part3 (財務管理)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "finance department",
        meaning: "財務部門",
        example: "Contact the finance department for details.",
        translation: "詳細は財務部門にお問い合わせください。",
      },
    ],
    commonUsages: [
      {
        pattern: "finance a project",
        explanation: "プロジェクトに資金を提供する",
        example: "We need to finance this project.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "600-700",
      synonyms: ["funding", "monetary"],
      businessContext: "財務・会計の重要語彙",
    },
  },
  {
    id: 177,
    word: "investment",
    meaning: "投資、インベストメント",
    partOfSpeech: "名詞",
    phonetic: "/ɪnˈvestmənt/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "The company made a large investment in technology.",
        translation: "会社は技術に大きな投資を行いました。",
        situation: "TOEIC Part4 (投資決定)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "make an investment",
        meaning: "投資する",
        example: "We decided to make an investment.",
        translation: "投資することを決定しました。",
      },
    ],
    commonUsages: [
      {
        pattern: "good investment",
        explanation: "良い投資",
        example: "This is a good investment opportunity.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "600-700",
      synonyms: ["capital", "funding"],
      businessContext: "財務・投資の重要語彙",
    },
  },
  {
    id: 178,
    word: "accounting",
    meaning: "会計、アカウンティング",
    partOfSpeech: "名詞",
    phonetic: "/əˈkaʊntɪŋ/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "Accounting practices have changed significantly.",
        translation: "会計実務は大幅に変化しました。",
        situation: "TOEIC Part7 (会計制度)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "accounting system",
        meaning: "会計システム",
        example: "We use a new accounting system.",
        translation: "新しい会計システムを使用しています。",
      },
    ],
    commonUsages: [
      {
        pattern: "accounting department",
        explanation: "経理部門",
        example: "The accounting department is busy.",
      },
    ],
    toeicSpecific: {
      parts: ["Part4", "Part7"],
      frequency: "medium",
      scoreBand: "600-700",
      synonyms: ["bookkeeping", "financial"],
      businessContext: "会計・財務の重要語彙",
    },
  },
  {
    id: 179,
    word: "budget",
    meaning: "予算、バジェット",
    partOfSpeech: "名詞",
    phonetic: "/ˈbʌdʒət/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "We need to stay within the budget.",
        translation: "予算内に収める必要があります。",
        situation: "TOEIC Part3 (予算管理)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "annual budget",
        meaning: "年間予算",
        example: "The annual budget was approved.",
        translation: "年間予算が承認されました。",
      },
    ],
    commonUsages: [
      {
        pattern: "exceed the budget",
        explanation: "予算を超過する",
        example: "We cannot exceed the budget.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "600-700",
      synonyms: ["allocation", "funding"],
      businessContext: "予算・財務の重要語彙",
    },
  },
  {
    id: 180,
    word: "expense",
    meaning: "費用、支出",
    partOfSpeech: "名詞",
    phonetic: "/ɪkˈspens/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "Travel expenses will be reimbursed.",
        translation: "出張費は払い戻されます。",
        situation: "TOEIC Part3 (費用管理)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "business expense",
        meaning: "ビジネス費用",
        example: "This is a legitimate business expense.",
        translation: "これは正当なビジネス費用です。",
      },
    ],
    commonUsages: [
      {
        pattern: "cut expenses",
        explanation: "費用を削減する",
        example: "We need to cut expenses.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "600-700",
      synonyms: ["cost", "expenditure"],
      businessContext: "費用・支出の重要語彙",
    },
  },

  // 国際ビジネス (ID 181-200)
  {
    id: 181,
    word: "international",
    meaning: "国際的な、インターナショナル",
    partOfSpeech: "形容詞",
    phonetic: "/ˌɪntərˈnæʃənəl/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "We are expanding our international operations.",
        translation: "国際事業を拡大しています。",
        situation: "TOEIC Part4 (国際展開)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "international market",
        meaning: "国際市場",
        example: "The international market is growing.",
        translation: "国際市場は成長しています。",
      },
    ],
    commonUsages: [
      {
        pattern: "international business",
        explanation: "国際ビジネス",
        example: "International business requires cultural understanding.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "600-700",
      synonyms: ["global", "worldwide"],
      businessContext: "国際ビジネスの重要語彙",
    },
  },
  {
    id: 182,
    word: "global",
    meaning: "グローバルな、世界的な",
    partOfSpeech: "形容詞",
    phonetic: "/ˈgloʊbəl/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "The company has a global presence.",
        translation: "その会社はグローバルに展開しています。",
        situation: "TOEIC Part4 (グローバル戦略)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "global market",
        meaning: "グローバル市場",
        example: "We compete in the global market.",
        translation: "グローバル市場で競争しています。",
      },
    ],
    commonUsages: [
      {
        pattern: "global economy",
        explanation: "グローバル経済",
        example: "The global economy is recovering.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "600-700",
      synonyms: ["worldwide", "international"],
      businessContext: "国際ビジネスの重要語彙",
    },
  },
  {
    id: 183,
    word: "export",
    meaning: "輸出する、輸出",
    partOfSpeech: "動詞・名詞",
    phonetic: "/ɪkˈspɔrt/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "Japan exports many high-quality products.",
        translation: "日本は多くの高品質製品を輸出しています。",
        situation: "TOEIC Part7 (貿易)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "export market",
        meaning: "輸出市場",
        example: "We are exploring new export markets.",
        translation: "新しい輸出市場を探っています。",
      },
    ],
    commonUsages: [
      {
        pattern: "export goods",
        explanation: "商品を輸出する",
        example: "We export goods to 50 countries.",
      },
    ],
    toeicSpecific: {
      parts: ["Part4", "Part7"],
      frequency: "medium",
      scoreBand: "600-700",
      synonyms: ["ship overseas", "send abroad"],
      businessContext: "国際貿易の重要語彙",
    },
  },
  {
    id: 184,
    word: "import",
    meaning: "輸入する、輸入",
    partOfSpeech: "動詞・名詞",
    phonetic: "/ɪmˈpɔrt/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "We import raw materials from several countries.",
        translation: "数カ国から原料を輸入しています。",
        situation: "TOEIC Part7 (国際調達)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "import duty",
        meaning: "輸入関税",
        example: "Import duty will increase the cost.",
        translation: "輸入関税によりコストが上昇します。",
      },
    ],
    commonUsages: [
      {
        pattern: "import from",
        explanation: "～から輸入する",
        example: "We import coffee from Brazil.",
      },
    ],
    toeicSpecific: {
      parts: ["Part4", "Part7"],
      frequency: "medium",
      scoreBand: "600-700",
      synonyms: ["bring in", "purchase abroad"],
      businessContext: "国際貿易の重要語彙",
    },
  },
  {
    id: 185,
    word: "trade",
    meaning: "貿易、取引",
    partOfSpeech: "名詞・動詞",
    phonetic: "/treɪd/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "International trade is important for the economy.",
        translation: "国際貿易は経済にとって重要です。",
        situation: "TOEIC Part7 (経済)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "free trade",
        meaning: "自由貿易",
        example: "Free trade benefits all countries.",
        translation: "自由貿易はすべての国に利益をもたらします。",
      },
    ],
    commonUsages: [
      {
        pattern: "trade agreement",
        explanation: "貿易協定",
        example: "The trade agreement was signed.",
      },
    ],
    toeicSpecific: {
      parts: ["Part4", "Part7"],
      frequency: "medium",
      scoreBand: "600-700",
      synonyms: ["commerce", "business"],
      businessContext: "国際貿易の重要語彙",
    },
  },

  // 技術・IT (ID 186-205)
  {
    id: 186,
    word: "technology",
    meaning: "技術、テクノロジー",
    partOfSpeech: "名詞",
    phonetic: "/tekˈnɑlədʒi/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "New technology will revolutionize our industry.",
        translation: "新技術が私たちの業界に革命をもたらすでしょう。",
        situation: "TOEIC Part7 (技術革新)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "cutting-edge technology",
        meaning: "最先端技術",
        example: "We use cutting-edge technology.",
        translation: "最先端技術を使用しています。",
      },
    ],
    commonUsages: [
      {
        pattern: "adopt technology",
        explanation: "技術を採用する",
        example: "Companies must adopt new technology.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "600-700",
      synonyms: ["innovation", "advancement"],
      businessContext: "技術・ITの重要語彙",
    },
  },
  {
    id: 187,
    word: "innovation",
    meaning: "革新、イノベーション",
    partOfSpeech: "名詞",
    phonetic: "/ˌɪnəˈveɪʃən/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "Innovation is key to staying competitive.",
        translation: "革新は競争力を維持する鍵です。",
        situation: "TOEIC Part7 (技術革新)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "technological innovation",
        meaning: "技術革新",
        example: "Technological innovation drives growth.",
        translation: "技術革新が成長を推進します。",
      },
    ],
    commonUsages: [
      {
        pattern: "drive innovation",
        explanation: "革新を推進する",
        example: "We must drive innovation in our industry.",
      },
    ],
    toeicSpecific: {
      parts: ["Part4", "Part7"],
      frequency: "medium",
      scoreBand: "600-700",
      synonyms: ["advancement", "breakthrough"],
      businessContext: "技術・革新の重要語彙",
    },
  },
  {
    id: 188,
    word: "digital",
    meaning: "デジタルの、デジタル",
    partOfSpeech: "形容詞",
    phonetic: "/ˈdɪdʒətəl/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "Digital transformation is changing businesses.",
        translation: "デジタル変革がビジネスを変化させています。",
        situation: "TOEIC Part7 (デジタル変革)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "digital platform",
        meaning: "デジタルプラットフォーム",
        example: "We use a digital platform for meetings.",
        translation: "会議にはデジタルプラットフォームを使用しています。",
      },
    ],
    commonUsages: [
      {
        pattern: "digital age",
        explanation: "デジタル時代",
        example: "We live in the digital age.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "600-700",
      synonyms: ["electronic", "online"],
      businessContext: "デジタル・ITの重要語彙",
    },
  },
  {
    id: 189,
    word: "system",
    meaning: "システム、制度",
    partOfSpeech: "名詞",
    phonetic: "/ˈsɪstəm/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "The new system will improve efficiency.",
        translation: "新しいシステムが効率を向上させます。",
        situation: "TOEIC Part4 (システム導入)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "computer system",
        meaning: "コンピューターシステム",
        example: "The computer system needs updating.",
        translation: "コンピューターシステムの更新が必要です。",
      },
    ],
    commonUsages: [
      {
        pattern: "install a system",
        explanation: "システムを導入する",
        example: "We will install a new system.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "600-700",
      synonyms: ["network", "framework"],
      businessContext: "システム・ITの重要語彙",
    },
  },
  {
    id: 190,
    word: "application",
    meaning: "アプリケーション、応用",
    partOfSpeech: "名詞",
    phonetic: "/ˌæplɪˈkeɪʃən/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "This application helps manage projects.",
        translation: "このアプリケーションはプロジェクト管理に役立ちます。",
        situation: "TOEIC Part4 (ソフトウェア)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "mobile application",
        meaning: "モバイルアプリ",
        example: "We developed a mobile application.",
        translation: "モバイルアプリを開発しました。",
      },
    ],
    commonUsages: [
      {
        pattern: "download an application",
        explanation: "アプリをダウンロードする",
        example: "Download the application from the store.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "600-700",
      synonyms: ["app", "software"],
      businessContext: "IT・ソフトウェアの重要語彙",
    },
  },

  // 追加の中級語彙（ID 191-300の続きは次のチャンクで）
];

// 中級語彙の統計
export const intermediateVocabularyStats = {
  total: intermediateBusinessVocabulary.length,
  categories: {
    marketing: 5, // ID 171-175
    finance: 5, // ID 176-180
    international: 5, // ID 181-185
    technology: 5, // ID 186-190
  },
  rarity: {
    common: 0,
    uncommon: 20, // 中級語彙はuncommon
    rare: 0,
    epic: 0,
    legendary: 0,
  },
  toeicScoreBand: {
    "400-500": 0,
    "500-600": 0,
    "600-700": 20, // 中級語彙は600-700点帯
    "700-800": 0,
    "800+": 0,
  },
};
