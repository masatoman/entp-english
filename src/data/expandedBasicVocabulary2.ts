import { WordCard } from "../types/gacha";

// Week 1: 基本ビジネス語彙拡張の続き（ID 151-200）

export const expandedBasicVocabulary2: WordCard[] = [
  // 健康・医療 (ID 151-160)
  {
    id: 151,
    word: "doctor",
    meaning: "医者、ドクター",
    partOfSpeech: "名詞",
    phonetic: "/ˈdɑktər/",
    rarity: "common",
    examples: [
      {
        sentence: "I need to see a doctor for my back pain.",
        translation: "腰痛で医者に診てもらう必要があります。",
        situation: "TOEIC Part2 (健康相談)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "family doctor",
        meaning: "かかりつけ医",
        example: "I have a family doctor.",
        translation: "かかりつけ医がいます。",
      },
    ],
    commonUsages: [
      {
        pattern: "see a doctor",
        explanation: "医者に診てもらう",
        example: "You should see a doctor.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["physician", "medical"],
      businessContext: "健康・医療の基本語彙",
    },
  },
  {
    id: 152,
    word: "hospital",
    meaning: "病院、ホスピタル",
    partOfSpeech: "名詞",
    phonetic: "/ˈhɑspɪtəl/",
    rarity: "common",
    examples: [
      {
        sentence: "The hospital is located downtown.",
        translation: "病院はダウンタウンにあります。",
        situation: "TOEIC Part2 (場所の説明)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "emergency hospital",
        meaning: "救急病院",
        example: "Go to the emergency hospital.",
        translation: "救急病院に行ってください。",
      },
    ],
    commonUsages: [
      {
        pattern: "go to hospital",
        explanation: "病院に行く",
        example: "I need to go to hospital.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["medical center", "clinic"],
      businessContext: "健康・医療の基本語彙",
    },
  },
  {
    id: 153,
    word: "medicine",
    meaning: "薬、医学",
    partOfSpeech: "名詞",
    phonetic: "/ˈmedəsən/",
    rarity: "common",
    examples: [
      {
        sentence: "Take this medicine three times a day.",
        translation: "この薬を1日3回服用してください。",
        situation: "TOEIC Part2 (薬の指示)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "take medicine",
        meaning: "薬を飲む",
        example: "I take medicine every morning.",
        translation: "毎朝薬を飲みます。",
      },
    ],
    commonUsages: [
      {
        pattern: "prescribe medicine",
        explanation: "薬を処方する",
        example: "The doctor prescribed medicine.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["drug", "medication"],
      businessContext: "健康・医療の基本語彙",
    },
  },
  {
    id: 154,
    word: "health",
    meaning: "健康、ヘルス",
    partOfSpeech: "名詞",
    phonetic: "/helθ/",
    rarity: "common",
    examples: [
      {
        sentence: "Good health is important for work.",
        translation: "良い健康状態は仕事にとって重要です。",
        situation: "TOEIC Part3 (健康の重要性)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "good health",
        meaning: "良い健康状態",
        example: "I wish you good health.",
        translation: "健康でありますように。",
      },
    ],
    commonUsages: [
      {
        pattern: "health insurance",
        explanation: "健康保険",
        example: "Do you have health insurance?",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["wellness", "fitness"],
      businessContext: "健康・医療の基本語彙",
    },
  },
  {
    id: 155,
    word: "exercise",
    meaning: "運動、エクササイズ",
    partOfSpeech: "名詞・動詞",
    phonetic: "/ˈeksərsaɪz/",
    rarity: "common",
    examples: [
      {
        sentence: "Regular exercise is good for your health.",
        translation: "定期的な運動は健康に良いです。",
        situation: "TOEIC Part3 (健康アドバイス)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "do exercise",
        meaning: "運動をする",
        example: "I do exercise every day.",
        translation: "毎日運動をします。",
      },
    ],
    commonUsages: [
      {
        pattern: "get exercise",
        explanation: "運動する",
        example: "You need to get exercise.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["workout", "training"],
      businessContext: "健康・ライフスタイルの基本語彙",
    },
  },

  // 天気・気候 (ID 156-165)
  {
    id: 156,
    word: "weather",
    meaning: "天気、ウェザー",
    partOfSpeech: "名詞",
    phonetic: "/ˈweθər/",
    rarity: "common",
    examples: [
      {
        sentence: "The weather is nice today.",
        translation: "今日は天気が良いです。",
        situation: "TOEIC Part1 (天気の描写)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "bad weather",
        meaning: "悪天候",
        example: "We have bad weather today.",
        translation: "今日は悪天候です。",
      },
    ],
    commonUsages: [
      {
        pattern: "check the weather",
        explanation: "天気を確認する",
        example: "Check the weather forecast.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["climate", "conditions"],
      businessContext: "天気・環境の基本語彙",
    },
  },
  {
    id: 157,
    word: "rain",
    meaning: "雨、雨が降る",
    partOfSpeech: "名詞・動詞",
    phonetic: "/reɪn/",
    rarity: "common",
    examples: [
      {
        sentence: "It's going to rain tomorrow.",
        translation: "明日は雨が降るでしょう。",
        situation: "TOEIC Part2 (天気予報)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "heavy rain",
        meaning: "大雨",
        example: "We have heavy rain today.",
        translation: "今日は大雨です。",
      },
    ],
    commonUsages: [
      {
        pattern: "rain hard",
        explanation: "激しく雨が降る",
        example: "It's raining hard.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["precipitation", "shower"],
      businessContext: "天気・環境の基本語彙",
    },
  },
  {
    id: 158,
    word: "sun",
    meaning: "太陽、サン",
    partOfSpeech: "名詞",
    phonetic: "/sʌn/",
    rarity: "common",
    examples: [
      {
        sentence: "The sun is shining brightly.",
        translation: "太陽が明るく輝いています。",
        situation: "TOEIC Part1 (天気の描写)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "sunny day",
        meaning: "晴れた日",
        example: "It's a sunny day today.",
        translation: "今日は晴れた日です。",
      },
    ],
    commonUsages: [
      {
        pattern: "in the sun",
        explanation: "日光の下で",
        example: "Sit in the sun.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["sunlight", "daylight"],
      businessContext: "天気・環境の基本語彙",
    },
  },
  {
    id: 159,
    word: "wind",
    meaning: "風、ウィンド",
    partOfSpeech: "名詞",
    phonetic: "/wɪnd/",
    rarity: "common",
    examples: [
      {
        sentence: "The wind is very strong today.",
        translation: "今日は風がとても強いです。",
        situation: "TOEIC Part1 (天気の描写)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "strong wind",
        meaning: "強い風",
        example: "We have strong wind today.",
        translation: "今日は強い風が吹いています。",
      },
    ],
    commonUsages: [
      {
        pattern: "blow in the wind",
        explanation: "風に吹かれる",
        example: "The flag blows in the wind.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["breeze", "air"],
      businessContext: "天気・環境の基本語彙",
    },
  },
  {
    id: 160,
    word: "temperature",
    meaning: "温度、気温",
    partOfSpeech: "名詞",
    phonetic: "/ˈtemprətʃər/",
    rarity: "common",
    examples: [
      {
        sentence: "The temperature is 25 degrees Celsius.",
        translation: "気温は25度です。",
        situation: "TOEIC Part2 (温度の報告)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "room temperature",
        meaning: "室温",
        example: "Keep it at room temperature.",
        translation: "室温で保管してください。",
      },
    ],
    commonUsages: [
      {
        pattern: "check the temperature",
        explanation: "温度を確認する",
        example: "Please check the temperature.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["heat", "degree"],
      businessContext: "天気・環境の基本語彙",
    },
  },

  // 家族・人間関係 (ID 161-170)
  {
    id: 161,
    word: "family",
    meaning: "家族、ファミリー",
    partOfSpeech: "名詞",
    phonetic: "/ˈfæməli/",
    rarity: "common",
    examples: [
      {
        sentence: "My family is very important to me.",
        translation: "家族は私にとってとても重要です。",
        situation: "TOEIC Part2 (家族について)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "family member",
        meaning: "家族の一員",
        example: "Every family member is welcome.",
        translation: "家族の全員を歓迎します。",
      },
    ],
    commonUsages: [
      {
        pattern: "spend time with family",
        explanation: "家族と時間を過ごす",
        example: "I like to spend time with family.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["relatives", "household"],
      businessContext: "人間関係・プライベートの基本語彙",
    },
  },
  {
    id: 162,
    word: "friend",
    meaning: "友達、フレンド",
    partOfSpeech: "名詞",
    phonetic: "/frend/",
    rarity: "common",
    examples: [
      {
        sentence: "I met my friend at the restaurant.",
        translation: "レストランで友達に会いました。",
        situation: "TOEIC Part2 (友達との約束)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "good friend",
        meaning: "親友",
        example: "He is a good friend of mine.",
        translation: "彼は私の親友です。",
      },
    ],
    commonUsages: [
      {
        pattern: "make friends",
        explanation: "友達を作る",
        example: "It's easy to make friends here.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["companion", "buddy"],
      businessContext: "人間関係・プライベートの基本語彙",
    },
  },
  {
    id: 163,
    word: "person",
    meaning: "人、パーソン",
    partOfSpeech: "名詞",
    phonetic: "/ˈpɜrsən/",
    rarity: "common",
    examples: [
      {
        sentence: "This person is waiting for you.",
        translation: "この人があなたを待っています。",
        situation: "TOEIC Part2 (人の説明)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "important person",
        meaning: "重要な人",
        example: "He is an important person.",
        translation: "彼は重要な人です。",
      },
    ],
    commonUsages: [
      {
        pattern: "in person",
        explanation: "直接、本人が",
        example: "I want to meet you in person.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["individual", "human"],
      businessContext: "人間関係・基本的な語彙",
    },
  },
  {
    id: 164,
    word: "people",
    meaning: "人々、ピープル",
    partOfSpeech: "名詞",
    phonetic: "/ˈpipəl/",
    rarity: "common",
    examples: [
      {
        sentence: "Many people work in this building.",
        translation: "多くの人がこの建物で働いています。",
        situation: "TOEIC Part2 (建物の説明)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "young people",
        meaning: "若い人々",
        example: "Young people like this app.",
        translation: "若い人々はこのアプリが好きです。",
      },
    ],
    commonUsages: [
      {
        pattern: "most people",
        explanation: "ほとんどの人",
        example: "Most people agree with this.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["individuals", "persons"],
      businessContext: "人間関係・基本的な語彙",
    },
  },
  {
    id: 165,
    word: "child",
    meaning: "子供、チャイルド",
    partOfSpeech: "名詞",
    phonetic: "/tʃaɪld/",
    rarity: "common",
    examples: [
      {
        sentence: "The child is playing in the park.",
        translation: "子供が公園で遊んでいます。",
        situation: "TOEIC Part1 (人の描写)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "young child",
        meaning: "幼い子供",
        example: "This is for young children.",
        translation: "これは幼い子供向けです。",
      },
    ],
    commonUsages: [
      {
        pattern: "have a child",
        explanation: "子供がいる",
        example: "Do you have a child?",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["kid", "youngster"],
      businessContext: "人間関係・家族の基本語彙",
    },
  },

  // 建物・場所 (ID 166-180)
  {
    id: 166,
    word: "building",
    meaning: "建物、ビルディング",
    partOfSpeech: "名詞",
    phonetic: "/ˈbɪldɪŋ/",
    rarity: "common",
    examples: [
      {
        sentence: "This building has 20 floors.",
        translation: "この建物は20階建てです。",
        situation: "TOEIC Part2 (建物の説明)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "office building",
        meaning: "オフィスビル",
        example: "I work in an office building.",
        translation: "オフィスビルで働いています。",
      },
    ],
    commonUsages: [
      {
        pattern: "enter the building",
        explanation: "建物に入る",
        example: "Please enter the building.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["structure", "construction"],
      businessContext: "建物・場所の基本語彙",
    },
  },
  {
    id: 167,
    word: "room",
    meaning: "部屋、ルーム",
    partOfSpeech: "名詞",
    phonetic: "/rum/",
    rarity: "common",
    examples: [
      {
        sentence: "The meeting room is on the third floor.",
        translation: "会議室は3階にあります。",
        situation: "TOEIC Part2 (部屋の場所)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "conference room",
        meaning: "会議室",
        example: "The conference room is available.",
        translation: "会議室は利用可能です。",
      },
    ],
    commonUsages: [
      {
        pattern: "book a room",
        explanation: "部屋を予約する",
        example: "I need to book a room.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["space", "chamber"],
      businessContext: "建物・場所の基本語彙",
    },
  },
  {
    id: 168,
    word: "floor",
    meaning: "床、階",
    partOfSpeech: "名詞",
    phonetic: "/flɔr/",
    rarity: "common",
    examples: [
      {
        sentence: "The office is on the fifth floor.",
        translation: "オフィスは5階にあります。",
        situation: "TOEIC Part2 (階数の説明)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "ground floor",
        meaning: "1階",
        example: "The reception is on the ground floor.",
        translation: "受付は1階にあります。",
      },
    ],
    commonUsages: [
      {
        pattern: "on the floor",
        explanation: "床に",
        example: "The book is on the floor.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["level", "story"],
      businessContext: "建物・場所の基本語彙",
    },
  },
  {
    id: 169,
    word: "door",
    meaning: "ドア、扉",
    partOfSpeech: "名詞",
    phonetic: "/dɔr/",
    rarity: "common",
    examples: [
      {
        sentence: "Please close the door behind you.",
        translation: "後ろのドアを閉めてください。",
        situation: "TOEIC Part2 (指示)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "open the door",
        meaning: "ドアを開ける",
        example: "Please open the door.",
        translation: "ドアを開けてください。",
      },
    ],
    commonUsages: [
      {
        pattern: "knock on the door",
        explanation: "ドアをノックする",
        example: "Someone knocked on the door.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["entrance", "exit"],
      businessContext: "建物・場所の基本語彙",
    },
  },
  {
    id: 170,
    word: "window",
    meaning: "窓、ウィンドウ",
    partOfSpeech: "名詞",
    phonetic: "/ˈwɪndoʊ/",
    rarity: "common",
    examples: [
      {
        sentence: "The window is open.",
        translation: "窓が開いています。",
        situation: "TOEIC Part1 (建物の描写)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "open the window",
        meaning: "窓を開ける",
        example: "Please open the window.",
        translation: "窓を開けてください。",
      },
    ],
    commonUsages: [
      {
        pattern: "look out the window",
        explanation: "窓から外を見る",
        example: "Look out the window.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["opening", "glass"],
      businessContext: "建物・場所の基本語彙",
    },
  },

  // 追加の基本語彙（ID 171-200の続きは次のチャンクで）
];

// カテゴリ別統計（追加分）
export const vocabularyStats2 = {
  total: expandedBasicVocabulary2.length,
  categories: {
    health: 5, // ID 151-155
    weather: 5, // ID 156-160
    relationships: 5, // ID 161-165
    buildings: 5, // ID 166-170
  },
  rarity: {
    common: 20, // 追加分も基本語彙なのでcommon
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
  },
  toeicScoreBand: {
    "400-500": 20, // 追加分も400-500点帯
    "500-600": 0,
    "600-700": 0,
    "700-800": 0,
    "800+": 0,
  },
};
