import { WordCard } from "../types/gacha";

// 追加のTOEICカード（ID 76-120）
export const additionalToeicCards: WordCard[] = [
  // IT・技術関連（ID 76-85）
  {
    id: 76,
    word: "software",
    meaning: "ソフトウェア、プログラム",
    partOfSpeech: "名詞",
    phonetic: "/ˈsɔftˌwɛr/",
    rarity: "common",
    examples: [
      {
        sentence: "The new software will be released next month.",
        translation: "新しいソフトウェアは来月リリースされます。",
        situation: "TOEIC Part4 (IT・システム)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "install software",
        meaning: "ソフトウェアをインストールする",
        example: "Please install the software on all computers.",
        translation: "すべてのコンピューターにソフトウェアをインストールしてください。",
      },
    ],
    commonUsages: [
      {
        pattern: "software update",
        explanation: "ソフトウェア更新",
        example: "The software update includes new features.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part3", "Part4", "Part7"],
      frequency: "very_high",
      scoreBand: "400-600",
      synonyms: ["program", "application"],
      businessContext: "IT・技術",
    },
  },
  {
    id: 77,
    word: "database",
    meaning: "データベース、データ集合",
    partOfSpeech: "名詞",
    phonetic: "/ˈdeɪtəˌbeɪs/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "The customer database contains over 10,000 records.",
        translation: "顧客データベースには10,000件以上の記録があります。",
        situation: "TOEIC Part4 (データ管理)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "update database",
        meaning: "データベースを更新する",
        example: "We need to update the database regularly.",
        translation: "データベースを定期的に更新する必要があります。",
      },
    ],
    commonUsages: [
      {
        pattern: "database management",
        explanation: "データベース管理",
        example: "Database management is crucial for our operations.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "medium",
      scoreBand: "600-800",
      synonyms: ["data storage", "information system"],
      businessContext: "IT・データ管理",
    },
  },
  {
    id: 78,
    word: "network",
    meaning: "ネットワーク、網",
    partOfSpeech: "名詞",
    phonetic: "/ˈnɛtˌwɜrk/",
    rarity: "common",
    examples: [
      {
        sentence: "The computer network crashed this morning.",
        translation: "コンピューターネットワークが今朝クラッシュしました。",
        situation: "TOEIC Part3 (IT問題)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "business network",
        meaning: "ビジネスネットワーク",
        example: "She has a strong business network.",
        translation: "彼女は強固なビジネスネットワークを持っています。",
      },
    ],
    commonUsages: [
      {
        pattern: "network security",
        explanation: "ネットワークセキュリティ",
        example: "Network security is our top priority.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "500-700",
      synonyms: ["system", "connection"],
      businessContext: "IT・ネットワーク",
    },
  },

  // 財務・会計関連（ID 79-88）
  {
    id: 79,
    word: "expenditure",
    meaning: "支出、経費",
    partOfSpeech: "名詞",
    phonetic: "/ɪkˈspɛndətʃər/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "We need to reduce our expenditure this quarter.",
        translation: "今四半期は支出を削減する必要があります。",
        situation: "TOEIC Part4 (財務管理)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "capital expenditure",
        meaning: "設備投資",
        example: "Capital expenditure will increase next year.",
        translation: "来年は設備投資が増加します。",
      },
    ],
    commonUsages: [
      {
        pattern: "control expenditure",
        explanation: "支出を管理する",
        example: "We must control expenditure carefully.",
      },
    ],
    toeicSpecific: {
      parts: ["Part4", "Part7"],
      frequency: "medium",
      scoreBand: "600-800",
      synonyms: ["expense", "cost"],
      businessContext: "財務・会計",
    },
  },
  {
    id: 80,
    word: "profit",
    meaning: "利益、収益",
    partOfSpeech: "名詞",
    phonetic: "/ˈprɑfət/",
    rarity: "common",
    examples: [
      {
        sentence: "The company reported a 15% increase in profit.",
        translation: "会社は利益の15%増加を報告しました。",
        situation: "TOEIC Part7 (業績報告)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "net profit",
        meaning: "純利益",
        example: "Net profit exceeded expectations this quarter.",
        translation: "今四半期の純利益は予想を上回りました。",
      },
    ],
    commonUsages: [
      {
        pattern: "profit margin",
        explanation: "利益率",
        example: "We need to improve our profit margin.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "very_high",
      scoreBand: "500-700",
      synonyms: ["earnings", "income"],
      businessContext: "財務・業績",
    },
  },

  // マーケティング・営業関連（ID 81-90）
  {
    id: 81,
    word: "campaign",
    meaning: "キャンペーン、活動",
    partOfSpeech: "名詞",
    phonetic: "/kæmˈpeɪn/",
    rarity: "common",
    examples: [
      {
        sentence: "The marketing campaign was very successful.",
        translation: "マーケティングキャンペーンは大成功でした。",
        situation: "TOEIC Part3 (マーケティング)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "advertising campaign",
        meaning: "広告キャンペーン",
        example: "The advertising campaign reached millions of people.",
        translation: "広告キャンペーンは数百万人に届きました。",
      },
    ],
    commonUsages: [
      {
        pattern: "launch a campaign",
        explanation: "キャンペーンを開始する",
        example: "We will launch a new campaign next week.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "500-700",
      synonyms: ["promotion", "initiative"],
      businessContext: "マーケティング・広告",
    },
  },
  {
    id: 82,
    word: "advertisement",
    meaning: "広告、宣伝",
    partOfSpeech: "名詞",
    phonetic: "/ˌædvərˈtaɪzmənt/",
    rarity: "common",
    examples: [
      {
        sentence: "The advertisement appeared in major newspapers.",
        translation: "その広告は主要新聞に掲載されました。",
        situation: "TOEIC Part1 (広告・メディア)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "place an advertisement",
        meaning: "広告を出す",
        example: "We decided to place an advertisement in the magazine.",
        translation: "雑誌に広告を出すことにしました。",
      },
    ],
    commonUsages: [
      {
        pattern: "online advertisement",
        explanation: "オンライン広告",
        example: "Online advertisement is more cost-effective.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "400-600",
      synonyms: ["commercial", "promotion"],
      businessContext: "広告・マーケティング",
    },
  },

  // 人事・管理関連（ID 83-95）
  {
    id: 83,
    word: "supervisor",
    meaning: "監督者、上司",
    partOfSpeech: "名詞",
    phonetic: "/ˈsupərˌvaɪzər/",
    rarity: "common",
    examples: [
      {
        sentence: "Please check with your supervisor before proceeding.",
        translation: "進める前に上司に確認してください。",
        situation: "TOEIC Part3 (職場コミュニケーション)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "immediate supervisor",
        meaning: "直属の上司",
        example: "Report any issues to your immediate supervisor.",
        translation: "問題があれば直属の上司に報告してください。",
      },
    ],
    commonUsages: [
      {
        pattern: "supervise work",
        explanation: "仕事を監督する",
        example: "The supervisor will supervise the project.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "500-700",
      synonyms: ["manager", "boss"],
      businessContext: "人事・管理",
    },
  },
  {
    id: 84,
    word: "colleague",
    meaning: "同僚、仕事仲間",
    partOfSpeech: "名詞",
    phonetic: "/ˈkɑliɡ/",
    rarity: "common",
    examples: [
      {
        sentence: "I discussed the project with my colleagues.",
        translation: "同僚とプロジェクトについて話し合いました。",
        situation: "TOEIC Part3 (職場会話)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "work with colleagues",
        meaning: "同僚と働く",
        example: "I enjoy working with my colleagues.",
        translation: "同僚と働くのを楽しんでいます。",
      },
    ],
    commonUsages: [
      {
        pattern: "colleague relationship",
        explanation: "同僚関係",
        example: "Good colleague relationships improve teamwork.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4"],
      frequency: "very_high",
      scoreBand: "400-600",
      synonyms: ["coworker", "teammate"],
      businessContext: "職場・チームワーク",
    },
  },

  // 国際ビジネス関連（ID 85-95）
  {
    id: 85,
    word: "international",
    meaning: "国際的な、国際の",
    partOfSpeech: "形容詞",
    phonetic: "/ˌɪntərˈnæʃənəl/",
    rarity: "common",
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
        example: "The international market offers great opportunities.",
        translation: "国際市場は大きな機会を提供しています。",
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
      scoreBand: "500-700",
      synonyms: ["global", "worldwide"],
      businessContext: "国際ビジネス・グローバル",
    },
  },
  {
    id: 86,
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
        translation: "新しい輸出市場を探求しています。",
      },
    ],
    commonUsages: [
      {
        pattern: "export goods",
        explanation: "商品を輸出する",
        example: "The company exports goods to 50 countries.",
      },
    ],
    toeicSpecific: {
      parts: ["Part4", "Part7"],
      frequency: "medium",
      scoreBand: "600-800",
      synonyms: ["ship overseas", "send abroad"],
      businessContext: "貿易・国際取引",
    },
  },
  {
    id: 87,
    word: "import",
    meaning: "輸入する、輸入",
    partOfSpeech: "動詞・名詞",
    phonetic: "/ɪmˈpɔrt/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "We import raw materials from several countries.",
        translation: "数カ国から原材料を輸入しています。",
        situation: "TOEIC Part7 (国際調達)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "import duty",
        meaning: "輸入関税",
        example: "Import duty will increase the product cost.",
        translation: "輸入関税により製品コストが上昇します。",
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
      scoreBand: "600-800",
      synonyms: ["bring in", "purchase abroad"],
      businessContext: "貿易・国際取引",
    },
  },

  // 品質・改善関連（ID 88-100）
  {
    id: 88,
    word: "quality",
    meaning: "品質、質",
    partOfSpeech: "名詞",
    phonetic: "/ˈkwɑləti/",
    rarity: "common",
    examples: [
      {
        sentence: "Quality control is essential in manufacturing.",
        translation: "製造業では品質管理が不可欠です。",
        situation: "TOEIC Part4 (品質管理)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "high quality",
        meaning: "高品質",
        example: "We are committed to providing high quality products.",
        translation: "私たちは高品質な製品の提供に取り組んでいます。",
      },
    ],
    commonUsages: [
      {
        pattern: "quality assurance",
        explanation: "品質保証",
        example: "Quality assurance is part of our process.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part3", "Part4", "Part7"],
      frequency: "very_high",
      scoreBand: "400-600",
      synonyms: ["standard", "grade"],
      businessContext: "品質管理・製造",
    },
  },
  {
    id: 89,
    word: "improvement",
    meaning: "改善、向上",
    partOfSpeech: "名詞",
    phonetic: "/ɪmˈpruvmənt/",
    rarity: "common",
    examples: [
      {
        sentence: "The improvement in sales was remarkable.",
        translation: "売上の改善は目覚ましいものでした。",
        situation: "TOEIC Part4 (業績改善)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "continuous improvement",
        meaning: "継続的改善",
        example: "We believe in continuous improvement.",
        translation: "私たちは継続的改善を信じています。",
      },
    ],
    commonUsages: [
      {
        pattern: "show improvement",
        explanation: "改善を示す",
        example: "The results show significant improvement.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "500-700",
      synonyms: ["enhancement", "betterment"],
      businessContext: "改善・品質向上",
    },
  },
  {
    id: 90,
    word: "standard",
    meaning: "基準、標準",
    partOfSpeech: "名詞",
    phonetic: "/ˈstændərd/",
    rarity: "common",
    examples: [
      {
        sentence: "Our products meet international standards.",
        translation: "私たちの製品は国際基準を満たしています。",
        situation: "TOEIC Part7 (品質基準)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "set standards",
        meaning: "基準を設定する",
        example: "The company sets high standards for quality.",
        translation: "会社は品質に高い基準を設定しています。",
      },
    ],
    commonUsages: [
      {
        pattern: "industry standard",
        explanation: "業界標準",
        example: "This is the industry standard for safety.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "500-700",
      synonyms: ["criterion", "benchmark"],
      businessContext: "品質・基準",
    },
  },

  // 最終追加カード（ID 91-100）
  {
    id: 91,
    word: "procedure",
    meaning: "手順、手続き",
    partOfSpeech: "名詞",
    phonetic: "/prəˈsidʒər/",
    rarity: "common",
    examples: [
      {
        sentence: "Please follow the safety procedure.",
        translation: "安全手順に従ってください。",
        situation: "TOEIC Part3 (安全管理)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "standard procedure",
        meaning: "標準手順",
        example: "This is our standard procedure for handling complaints.",
        translation: "これは苦情処理の標準手順です。",
      },
    ],
    commonUsages: [
      {
        pattern: "follow procedure",
        explanation: "手順に従う",
        example: "All employees must follow this procedure.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "500-700",
      synonyms: ["process", "method"],
      businessContext: "業務手順・プロセス",
    },
  },
  {
    id: 92,
    word: "requirement",
    meaning: "要件、必要条件",
    partOfSpeech: "名詞",
    phonetic: "/rɪˈkwaɪərmənt/",
    rarity: "common",
    examples: [
      {
        sentence: "The job requirement includes a college degree.",
        translation: "職務要件には大学の学位が含まれます。",
        situation: "TOEIC Part7 (求人・採用)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "meet requirements",
        meaning: "要件を満たす",
        example: "All applicants must meet the basic requirements.",
        translation: "すべての応募者は基本要件を満たす必要があります。",
      },
    ],
    commonUsages: [
      {
        pattern: "minimum requirement",
        explanation: "最低要件",
        example: "A bachelor's degree is the minimum requirement.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "500-700",
      synonyms: ["condition", "specification"],
      businessContext: "要件・条件",
    },
  },
  {
    id: 93,
    word: "technology",
    meaning: "技術、テクノロジー",
    partOfSpeech: "名詞",
    phonetic: "/tɛkˈnɑlədʒi/",
    rarity: "common",
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
        example: "We use cutting-edge technology in our products.",
        translation: "私たちの製品には最先端技術を使用しています。",
      },
    ],
    commonUsages: [
      {
        pattern: "adopt technology",
        explanation: "技術を採用する",
        example: "Companies must adopt new technology to stay competitive.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "very_high",
      scoreBand: "500-700",
      synonyms: ["innovation", "advancement"],
      businessContext: "技術・IT",
    },
  },
  {
    id: 94,
    word: "solution",
    meaning: "解決策、ソリューション",
    partOfSpeech: "名詞",
    phonetic: "/səˈluʃən/",
    rarity: "common",
    examples: [
      {
        sentence: "We found an effective solution to the problem.",
        translation: "問題に対する効果的な解決策を見つけました。",
        situation: "TOEIC Part3 (問題解決)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "provide solutions",
        meaning: "解決策を提供する",
        example: "Our company provides IT solutions for businesses.",
        translation: "私たちの会社は企業にITソリューションを提供しています。",
      },
    ],
    commonUsages: [
      {
        pattern: "find a solution",
        explanation: "解決策を見つける",
        example: "We need to find a solution quickly.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "very_high",
      scoreBand: "500-700",
      synonyms: ["answer", "resolution"],
      businessContext: "問題解決・サービス",
    },
  },
  {
    id: 95,
    word: "opportunity",
    meaning: "機会、チャンス",
    partOfSpeech: "名詞",
    phonetic: "/ˌɑpərˈtunəti/",
    rarity: "common",
    examples: [
      {
        sentence: "This is a great opportunity for career growth.",
        translation: "これはキャリア成長の素晴らしい機会です。",
        situation: "TOEIC Part3 (キャリア)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "business opportunity",
        meaning: "ビジネス機会",
        example: "We identified several business opportunities.",
        translation: "いくつかのビジネス機会を特定しました。",
      },
    ],
    commonUsages: [
      {
        pattern: "take opportunity",
        explanation: "機会を活かす",
        example: "You should take this opportunity.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "very_high",
      scoreBand: "500-700",
      synonyms: ["chance", "possibility"],
      businessContext: "機会・ビジネス戦略",
    },
  },

  // 最終レアカード（ID 96-100）
  {
    id: 96,
    word: "sustainability",
    meaning: "持続可能性、継続性",
    partOfSpeech: "名詞",
    phonetic: "/səˌsteɪnəˈbɪləti/",
    rarity: "epic",
    examples: [
      {
        sentence: "Sustainability is becoming increasingly important in business.",
        translation: "持続可能性はビジネスでますます重要になっています。",
        situation: "TOEIC Part7 (ESG・環境)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "environmental sustainability",
        meaning: "環境の持続可能性",
        example: "Environmental sustainability is our core value.",
        translation: "環境の持続可能性は私たちの中核価値です。",
      },
    ],
    commonUsages: [
      {
        pattern: "achieve sustainability",
        explanation: "持続可能性を達成する",
        example: "We aim to achieve long-term sustainability.",
      },
    ],
    toeicSpecific: {
      parts: ["Part7"],
      frequency: "low",
      scoreBand: "800+",
      synonyms: ["viability", "continuity"],
      businessContext: "ESG・環境経営",
    },
  },
  {
    id: 97,
    word: "optimization",
    meaning: "最適化、最適化プロセス",
    partOfSpeech: "名詞",
    phonetic: "/ˌɑptəməˈzeɪʃən/",
    rarity: "epic",
    examples: [
      {
        sentence: "Process optimization reduced our costs by 20%.",
        translation: "プロセス最適化により、コストを20%削減しました。",
        situation: "TOEIC Part7 (業務改善)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "cost optimization",
        meaning: "コスト最適化",
        example: "Cost optimization is a key priority this year.",
        translation: "コスト最適化は今年の重要な優先事項です。",
      },
    ],
    commonUsages: [
      {
        pattern: "optimization strategy",
        explanation: "最適化戦略",
        example: "Our optimization strategy focuses on efficiency.",
      },
    ],
    toeicSpecific: {
      parts: ["Part4", "Part7"],
      frequency: "low",
      scoreBand: "800+",
      synonyms: ["improvement", "enhancement"],
      businessContext: "業務改善・効率化",
    },
  },
  {
    id: 98,
    word: "diversification",
    meaning: "多様化、多角化",
    partOfSpeech: "名詞",
    phonetic: "/daɪˌvɜrsəfəˈkeɪʃən/",
    rarity: "legendary",
    examples: [
      {
        sentence: "Portfolio diversification reduces investment risk.",
        translation: "ポートフォリオの多様化は投資リスクを軽減します。",
        situation: "TOEIC Part7 (投資戦略)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "business diversification",
        meaning: "事業多角化",
        example: "Business diversification helped the company grow.",
        translation: "事業多角化により会社は成長しました。",
      },
    ],
    commonUsages: [
      {
        pattern: "diversification strategy",
        explanation: "多角化戦略",
        example: "The diversification strategy was successful.",
      },
    ],
    toeicSpecific: {
      parts: ["Part7"],
      frequency: "very_low",
      scoreBand: "900+",
      synonyms: ["variety", "expansion"],
      businessContext: "戦略・投資",
    },
  },
  {
    id: 99,
    word: "consolidation",
    meaning: "統合、集約",
    partOfSpeech: "名詞",
    phonetic: "/kənˌsɑləˈdeɪʃən/",
    rarity: "legendary",
    examples: [
      {
        sentence: "The consolidation of operations improved efficiency.",
        translation: "業務の統合により効率性が向上しました。",
        situation: "TOEIC Part7 (組織再編)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "debt consolidation",
        meaning: "債務統合",
        example: "Debt consolidation simplified our financial structure.",
        translation: "債務統合により財務構造が簡素化されました。",
      },
    ],
    commonUsages: [
      {
        pattern: "consolidation process",
        explanation: "統合プロセス",
        example: "The consolidation process will take six months.",
      },
    ],
    toeicSpecific: {
      parts: ["Part7"],
      frequency: "very_low",
      scoreBand: "900+",
      synonyms: ["merger", "integration"],
      businessContext: "企業統合・再編",
    },
  },
  {
    id: 100,
    word: "transformation",
    meaning: "変革、変換",
    partOfSpeech: "名詞",
    phonetic: "/ˌtrænsfərˈmeɪʃən/",
    rarity: "legendary",
    examples: [
      {
        sentence: "Digital transformation is reshaping our industry.",
        translation: "デジタル変革が私たちの業界を再構築しています。",
        situation: "TOEIC Part7 (デジタル変革)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "digital transformation",
        meaning: "デジタル変革",
        example: "Digital transformation requires significant investment.",
        translation: "デジタル変革には大きな投資が必要です。",
      },
    ],
    commonUsages: [
      {
        pattern: "undergo transformation",
        explanation: "変革を経る",
        example: "The company is undergoing major transformation.",
      },
    ],
    toeicSpecific: {
      parts: ["Part7"],
      frequency: "very_low",
      scoreBand: "900+",
      synonyms: ["change", "revolution"],
      businessContext: "変革・デジタル化",
    },
  },

  // 追加のビジネス語彙（ID 101-125）
  {
    id: 101,
    word: "strategy",
    meaning: "戦略、方針",
    partOfSpeech: "名詞",
    phonetic: "/ˈstrætədʒi/",
    rarity: "common",
    examples: [
      {
        sentence: "Our marketing strategy focuses on digital channels.",
        translation: "私たちのマーケティング戦略はデジタルチャネルに焦点を当てています。",
        situation: "TOEIC Part4 (戦略会議)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "business strategy",
        meaning: "ビジネス戦略",
        example: "The new business strategy increased profits.",
        translation: "新しいビジネス戦略により利益が増加しました。",
      },
    ],
    commonUsages: [
      {
        pattern: "develop strategy",
        explanation: "戦略を策定する",
        example: "We need to develop a clear strategy.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "600-800",
      synonyms: ["plan", "approach"],
      businessContext: "戦略・計画",
    },
  },
  {
    id: 102,
    word: "analysis",
    meaning: "分析、解析",
    partOfSpeech: "名詞",
    phonetic: "/əˈnæləsəs/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "The market analysis revealed new opportunities.",
        translation: "市場分析により新しい機会が明らかになりました。",
        situation: "TOEIC Part7 (市場調査)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "data analysis",
        meaning: "データ分析",
        example: "Data analysis helps us make better decisions.",
        translation: "データ分析により、より良い意思決定ができます。",
      },
    ],
    commonUsages: [
      {
        pattern: "conduct analysis",
        explanation: "分析を実施する",
        example: "We will conduct a thorough analysis.",
      },
    ],
    toeicSpecific: {
      parts: ["Part4", "Part7"],
      frequency: "medium",
      scoreBand: "600-800",
      synonyms: ["examination", "study"],
      businessContext: "分析・調査",
    },
  },
  {
    id: 103,
    word: "proposal",
    meaning: "提案、企画書",
    partOfSpeech: "名詞",
    phonetic: "/prəˈpoʊzəl/",
    rarity: "common",
    examples: [
      {
        sentence: "The proposal was approved by the board.",
        translation: "提案は取締役会で承認されました。",
        situation: "TOEIC Part3 (企画提案)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "submit a proposal",
        meaning: "提案を提出する",
        example: "Please submit your proposal by Friday.",
        translation: "金曜日までに提案を提出してください。",
      },
    ],
    commonUsages: [
      {
        pattern: "proposal review",
        explanation: "提案レビュー",
        example: "The proposal review will take two weeks.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "high",
      scoreBand: "500-700",
      synonyms: ["suggestion", "plan"],
      businessContext: "企画・提案",
    },
  },
  {
    id: 104,
    word: "conference",
    meaning: "会議、カンファレンス",
    partOfSpeech: "名詞",
    phonetic: "/ˈkɑnfərəns/",
    rarity: "common",
    examples: [
      {
        sentence: "The annual conference will be held in Tokyo.",
        translation: "年次カンファレンスは東京で開催されます。",
        situation: "TOEIC Part1 (イベント・会議)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "attend a conference",
        meaning: "会議に参加する",
        example: "I will attend the international conference.",
        translation: "国際会議に参加します。",
      },
    ],
    commonUsages: [
      {
        pattern: "conference room",
        explanation: "会議室",
        example: "The meeting is in conference room A.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part3", "Part4"],
      frequency: "high",
      scoreBand: "500-700",
      synonyms: ["meeting", "symposium"],
      businessContext: "会議・イベント",
    },
  },
  {
    id: 105,
    word: "development",
    meaning: "開発、発展",
    partOfSpeech: "名詞",
    phonetic: "/dɪˈveləpmənt/",
    rarity: "common",
    examples: [
      {
        sentence: "Product development takes about two years.",
        translation: "製品開発には約2年かかります。",
        situation: "TOEIC Part4 (製品開発)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "software development",
        meaning: "ソフトウェア開発",
        example: "Software development requires skilled programmers.",
        translation: "ソフトウェア開発には熟練したプログラマーが必要です。",
      },
    ],
    commonUsages: [
      {
        pattern: "development process",
        explanation: "開発プロセス",
        example: "The development process is well-documented.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "very_high",
      scoreBand: "500-700",
      synonyms: ["creation", "advancement"],
      businessContext: "開発・研究",
    },
  },

  // レアカード追加（ID 106-115）
  {
    id: 106,
    word: "intellectual",
    meaning: "知的な、知識人",
    partOfSpeech: "形容詞・名詞",
    phonetic: "/ˌɪntəˈlektʃuəl/",
    rarity: "rare",
    examples: [
      {
        sentence: "Intellectual property protection is crucial for innovation.",
        translation: "知的財産保護はイノベーションにとって重要です。",
        situation: "TOEIC Part7 (知的財産)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "intellectual property",
        meaning: "知的財産",
        example: "We must protect our intellectual property rights.",
        translation: "知的財産権を保護しなければなりません。",
      },
    ],
    commonUsages: [
      {
        pattern: "intellectual capital",
        explanation: "知的資本",
        example: "Intellectual capital is our competitive advantage.",
      },
    ],
    toeicSpecific: {
      parts: ["Part7"],
      frequency: "low",
      scoreBand: "700-900",
      synonyms: ["mental", "cognitive"],
      businessContext: "知的財産・法務",
    },
  },
  {
    id: 107,
    word: "infrastructure",
    meaning: "インフラ、基盤設備",
    partOfSpeech: "名詞",
    phonetic: "/ˈɪnfrəˌstrʌktʃər/",
    rarity: "rare",
    examples: [
      {
        sentence: "The country is investing heavily in digital infrastructure.",
        translation: "その国はデジタルインフラに多額の投資をしています。",
        situation: "TOEIC Part7 (インフラ投資)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "IT infrastructure",
        meaning: "ITインフラ",
        example: "Our IT infrastructure supports global operations.",
        translation: "私たちのITインフラは世界的な事業をサポートしています。",
      },
    ],
    commonUsages: [
      {
        pattern: "infrastructure development",
        explanation: "インフラ開発",
        example: "Infrastructure development requires long-term planning.",
      },
    ],
    toeicSpecific: {
      parts: ["Part4", "Part7"],
      frequency: "low",
      scoreBand: "700-900",
      synonyms: ["foundation", "framework"],
      businessContext: "インフラ・IT",
    },
  },

  // エピックカード追加（ID 108-115）
  {
    id: 108,
    word: "governance",
    meaning: "統治、ガバナンス",
    partOfSpeech: "名詞",
    phonetic: "/ˈɡʌvərnəns/",
    rarity: "epic",
    examples: [
      {
        sentence: "Corporate governance ensures transparency and accountability.",
        translation: "コーポレートガバナンスは透明性と説明責任を確保します。",
        situation: "TOEIC Part7 (企業統治)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "corporate governance",
        meaning: "企業統治",
        example: "Good corporate governance protects shareholders.",
        translation: "良いコーポレートガバナンスは株主を保護します。",
      },
    ],
    commonUsages: [
      {
        pattern: "governance structure",
        explanation: "統治構造",
        example: "The governance structure is clearly defined.",
      },
    ],
    toeicSpecific: {
      parts: ["Part7"],
      frequency: "very_low",
      scoreBand: "800+",
      synonyms: ["management", "administration"],
      businessContext: "企業統治・経営",
    },
  },
  {
    id: 109,
    word: "compliance",
    meaning: "コンプライアンス、法令遵守",
    partOfSpeech: "名詞",
    phonetic: "/kəmˈplaɪəns/",
    rarity: "epic",
    examples: [
      {
        sentence: "Compliance with regulations is mandatory for all employees.",
        translation: "規制の遵守はすべての従業員に義務付けられています。",
        situation: "TOEIC Part7 (コンプライアンス)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "regulatory compliance",
        meaning: "規制遵守",
        example: "Regulatory compliance is monitored continuously.",
        translation: "規制遵守は継続的に監視されています。",
      },
    ],
    commonUsages: [
      {
        pattern: "ensure compliance",
        explanation: "コンプライアンスを確保する",
        example: "We must ensure compliance with all laws.",
      },
    ],
    toeicSpecific: {
      parts: ["Part4", "Part7"],
      frequency: "very_low",
      scoreBand: "800+",
      synonyms: ["adherence", "conformity"],
      businessContext: "法務・コンプライアンス",
    },
  },

  // 最終レジェンダリーカード（ID 110-125）
  {
    id: 110,
    word: "methodology",
    meaning: "方法論、手法",
    partOfSpeech: "名詞",
    phonetic: "/ˌmeθəˈdɑlədʒi/",
    rarity: "legendary",
    examples: [
      {
        sentence: "Our research methodology ensures accurate results.",
        translation: "私たちの研究方法論は正確な結果を保証します。",
        situation: "TOEIC Part7 (研究・学術)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "research methodology",
        meaning: "研究方法論",
        example: "The research methodology was peer-reviewed.",
        translation: "研究方法論は査読されました。",
      },
    ],
    commonUsages: [
      {
        pattern: "apply methodology",
        explanation: "方法論を適用する",
        example: "We apply proven methodology to all projects.",
      },
    ],
    toeicSpecific: {
      parts: ["Part7"],
      frequency: "very_low",
      scoreBand: "900+",
      synonyms: ["approach", "system"],
      businessContext: "研究・学術",
    },
  },
  {
    id: 111,
    word: "sophistication",
    meaning: "洗練、高度化",
    partOfSpeech: "名詞",
    phonetic: "/səˌfɪstəˈkeɪʃən/",
    rarity: "legendary",
    examples: [
      {
        sentence: "The sophistication of our technology gives us a competitive edge.",
        translation: "技術の洗練度が競争優位性をもたらします。",
        situation: "TOEIC Part7 (技術優位性)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "technological sophistication",
        meaning: "技術的洗練度",
        example: "Technological sophistication drives innovation.",
        translation: "技術的洗練度がイノベーションを推進します。",
      },
    ],
    commonUsages: [
      {
        pattern: "level of sophistication",
        explanation: "洗練度のレベル",
        example: "The level of sophistication is impressive.",
      },
    ],
    toeicSpecific: {
      parts: ["Part7"],
      frequency: "very_low",
      scoreBand: "900+",
      synonyms: ["refinement", "complexity"],
      businessContext: "技術・高度化",
    },
  },
  {
    id: 112,
    word: "implementation",
    meaning: "実装、実施",
    partOfSpeech: "名詞",
    phonetic: "/ˌɪmpləmənˈteɪʃən/",
    rarity: "uncommon",
    examples: [
      {
        sentence: "The implementation of the new system will begin next month.",
        translation: "新システムの実装は来月開始されます。",
        situation: "TOEIC Part4 (システム導入)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "successful implementation",
        meaning: "成功した実装",
        example: "Successful implementation requires careful planning.",
        translation: "成功した実装には慎重な計画が必要です。",
      },
    ],
    commonUsages: [
      {
        pattern: "implementation plan",
        explanation: "実装計画",
        example: "The implementation plan is ready.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4", "Part7"],
      frequency: "medium",
      scoreBand: "600-800",
      synonyms: ["execution", "deployment"],
      businessContext: "プロジェクト・システム",
    },
  },
  {
    id: 113,
    word: "sustainability",
    meaning: "持続可能性、継続性",
    partOfSpeech: "名詞",
    phonetic: "/səˌsteɪnəˈbɪləti/",
    rarity: "epic",
    examples: [
      {
        sentence: "Environmental sustainability is a corporate priority.",
        translation: "環境の持続可能性は企業の優先事項です。",
        situation: "TOEIC Part7 (ESG経営)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "sustainability initiatives",
        meaning: "持続可能性への取り組み",
        example: "Our sustainability initiatives reduce environmental impact.",
        translation: "持続可能性への取り組みが環境負荷を軽減します。",
      },
    ],
    commonUsages: [
      {
        pattern: "achieve sustainability",
        explanation: "持続可能性を達成する",
        example: "We aim to achieve long-term sustainability.",
      },
    ],
    toeicSpecific: {
      parts: ["Part7"],
      frequency: "low",
      scoreBand: "800+",
      synonyms: ["continuity", "viability"],
      businessContext: "ESG・環境経営",
    },
  },
  {
    id: 114,
    word: "digitalization",
    meaning: "デジタル化、デジタル変革",
    partOfSpeech: "名詞",
    phonetic: "/ˌdɪdʒətəlaɪˈzeɪʃən/",
    rarity: "epic",
    examples: [
      {
        sentence: "Digitalization is transforming traditional industries.",
        translation: "デジタル化が従来の産業を変革しています。",
        situation: "TOEIC Part7 (デジタル変革)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "digital transformation",
        meaning: "デジタル変革",
        example: "Digital transformation requires cultural change.",
        translation: "デジタル変革には文化的変化が必要です。",
      },
    ],
    commonUsages: [
      {
        pattern: "digitalization strategy",
        explanation: "デジタル化戦略",
        example: "Our digitalization strategy is comprehensive.",
      },
    ],
    toeicSpecific: {
      parts: ["Part7"],
      frequency: "low",
      scoreBand: "800+",
      synonyms: ["automation", "modernization"],
      businessContext: "デジタル変革・IT",
    },
  },
  {
    id: 115,
    word: "globalization",
    meaning: "グローバル化、国際化",
    partOfSpeech: "名詞",
    phonetic: "/ˌɡloʊbələˈzeɪʃən/",
    rarity: "legendary",
    examples: [
      {
        sentence: "Globalization has created new business opportunities.",
        translation: "グローバル化により新しいビジネス機会が生まれました。",
        situation: "TOEIC Part7 (国際ビジネス)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "economic globalization",
        meaning: "経済のグローバル化",
        example: "Economic globalization affects all industries.",
        translation: "経済のグローバル化はすべての産業に影響を与えます。",
      },
    ],
    commonUsages: [
      {
        pattern: "globalization trend",
        explanation: "グローバル化の傾向",
        example: "The globalization trend continues to accelerate.",
      },
    ],
    toeicSpecific: {
      parts: ["Part7"],
      frequency: "very_low",
      scoreBand: "900+",
      synonyms: ["internationalization", "worldwide expansion"],
      businessContext: "国際ビジネス・戦略",
    },
  },
];
