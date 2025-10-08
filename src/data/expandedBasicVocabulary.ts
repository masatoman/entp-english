import { WordCard } from "../types/gacha";

// Week 1: 基本ビジネス語彙拡張（800語追加）
// カテゴリ別に整理されたTOEIC基本語彙

export const expandedBasicVocabulary: WordCard[] = [
  // オフィス環境・職場 (ID 116-200)
  {
    id: 116,
    word: "desk",
    japanese: "",
    meaning: "机、デスク",
    partOfSpeech: "名詞",
    phonetic: "/desk/",
    rarity: "common",
    examples: [
      {
        sentence: "Please clean your desk before leaving.",
        translation: "帰る前に机を片付けてください。",
        situation: "TOEIC Part2 (職場の指示)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "desk job",
        meaning: "デスクワーク",
        example: "She has a desk job at the company.",
        translation: "彼女は会社でデスクワークをしています。",
      },
    ],
    commonUsages: [
      {
        pattern: "at the desk",
        explanation: "机で",
        example: "I work at the desk all day.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["workstation", "table"],
      businessContext: "オフィス環境の基本語彙",
    },
  },
  {
    id: 117,
    word: "chair",
    japanese: "",
    meaning: "椅子、チェア",
    partOfSpeech: "名詞",
    phonetic: "/tʃer/",
    rarity: "common",
    examples: [
      {
        sentence: "The chair is comfortable for long meetings.",
        translation: "その椅子は長時間の会議に適しています。",
        situation: "TOEIC Part1 (オフィス環境)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "office chair",
        meaning: "オフィスチェア",
        example: "We need new office chairs.",
        translation: "新しいオフィスチェアが必要です。",
      },
    ],
    commonUsages: [
      {
        pattern: "sit in a chair",
        explanation: "椅子に座る",
        example: "Please sit in the chair.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["seat", "stool"],
      businessContext: "オフィス環境の基本語彙",
    },
  },
  {
    id: 118,
    word: "computer",
    japanese: "",
    meaning: "コンピューター、パソコン",
    partOfSpeech: "名詞",
    phonetic: "/kəmˈpjutər/",
    rarity: "common",
    examples: [
      {
        sentence: "The computer crashed during the presentation.",
        translation:
          "プレゼンテーション中にコンピューターがクラッシュしました。",
        situation: "TOEIC Part3 (技術問題)",
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
        pattern: "use a computer",
        explanation: "コンピューターを使う",
        example: "I use a computer every day.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["PC", "machine"],
      businessContext: "IT・オフィス環境の基本語彙",
    },
  },
  {
    id: 119,
    word: "phone",
    japanese: "",
    meaning: "電話、フォン",
    partOfSpeech: "名詞",
    phonetic: "/foʊn/",
    rarity: "common",
    examples: [
      {
        sentence: "Please answer the phone when it rings.",
        translation: "電話が鳴ったら出てください。",
        situation: "TOEIC Part2 (電話対応)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "phone call",
        meaning: "電話",
        example: "I received an important phone call.",
        translation: "重要な電話を受けました。",
      },
    ],
    commonUsages: [
      {
        pattern: "make a phone call",
        explanation: "電話をかける",
        example: "I need to make a phone call.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["telephone", "mobile"],
      businessContext: "コミュニケーションの基本語彙",
    },
  },
  {
    id: 120,
    word: "email",
    japanese: "",
    meaning: "メール、電子メール",
    partOfSpeech: "名詞",
    phonetic: "/ˈimeɪl/",
    rarity: "common",
    examples: [
      {
        sentence: "Please send me an email with the details.",
        translation: "詳細をメールで送ってください。",
        situation: "TOEIC Part2 (文書依頼)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "email address",
        meaning: "メールアドレス",
        example: "What is your email address?",
        translation: "メールアドレスを教えてください。",
      },
    ],
    commonUsages: [
      {
        pattern: "send an email",
        explanation: "メールを送る",
        example: "I will send an email tomorrow.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["message", "correspondence"],
      businessContext: "コミュニケーションの基本語彙",
    },
  },

  // 時間・スケジュール (ID 121-140)
  {
    id: 121,
    word: "time",
    japanese: "",
    meaning: "時間、時刻",
    partOfSpeech: "名詞",
    phonetic: "/taɪm/",
    rarity: "common",
    examples: [
      {
        sentence: "What time is the meeting?",
        translation: "会議は何時ですか？",
        situation: "TOEIC Part2 (時間確認)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "on time",
        meaning: "時間通りに",
        example: "Please arrive on time.",
        translation: "時間通りに到着してください。",
      },
    ],
    commonUsages: [
      {
        pattern: "have time",
        explanation: "時間がある",
        example: "Do you have time to meet?",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["hour", "moment"],
      businessContext: "時間管理の基本語彙",
    },
  },
  {
    id: 122,
    word: "hour",
    japanese: "",
    meaning: "時間、1時間",
    partOfSpeech: "名詞",
    phonetic: "/aʊər/",
    rarity: "common",
    examples: [
      {
        sentence: "The meeting lasted for two hours.",
        translation: "会議は2時間続きました。",
        situation: "TOEIC Part2 (時間の長さ)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "business hours",
        meaning: "営業時間",
        example: "Our business hours are 9 to 5.",
        translation: "営業時間は9時から5時です。",
      },
    ],
    commonUsages: [
      {
        pattern: "per hour",
        explanation: "1時間あたり",
        example: "We charge $50 per hour.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["time", "period"],
      businessContext: "時間管理の基本語彙",
    },
  },
  {
    id: 123,
    word: "minute",
    japanese: "",
    meaning: "分、1分",
    partOfSpeech: "名詞",
    phonetic: "/ˈmɪnət/",
    rarity: "common",
    examples: [
      {
        sentence: "The presentation will start in five minutes.",
        translation: "プレゼンテーションは5分後に始まります。",
        situation: "TOEIC Part2 (時間の確認)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "wait a minute",
        meaning: "少し待って",
        example: "Wait a minute, please.",
        translation: "少し待ってください。",
      },
    ],
    commonUsages: [
      {
        pattern: "in a few minutes",
        explanation: "数分で",
        example: "I will be there in a few minutes.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["moment", "instant"],
      businessContext: "時間管理の基本語彙",
    },
  },
  {
    id: 124,
    word: "day",
    japanese: "",
    meaning: "日、1日",
    partOfSpeech: "名詞",
    phonetic: "/deɪ/",
    rarity: "common",
    examples: [
      {
        sentence: "The project deadline is next day.",
        translation: "プロジェクトの締切は翌日です。",
        situation: "TOEIC Part2 (期限の確認)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "working day",
        meaning: "平日、営業日",
        example: "We are closed on non-working days.",
        translation: "平日以外は休業です。",
      },
    ],
    commonUsages: [
      {
        pattern: "every day",
        explanation: "毎日",
        example: "I work every day.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["date", "24 hours"],
      businessContext: "時間管理の基本語彙",
    },
  },
  {
    id: 125,
    word: "week",
    japanese: "",
    meaning: "週、1週間",
    partOfSpeech: "名詞",
    phonetic: "/wik/",
    rarity: "common",
    examples: [
      {
        sentence: "The report is due next week.",
        translation: "レポートの提出期限は来週です。",
        situation: "TOEIC Part2 (期限の確認)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "working week",
        meaning: "平日",
        example: "The working week is Monday to Friday.",
        translation: "平日は月曜日から金曜日です。",
      },
    ],
    commonUsages: [
      {
        pattern: "next week",
        explanation: "来週",
        example: "We will meet next week.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["7 days", "period"],
      businessContext: "時間管理の基本語彙",
    },
  },

  // 会議・コミュニケーション (ID 126-150)
  {
    id: 126,
    word: "discussion",
    japanese: "",
    meaning: "議論、話し合い",
    partOfSpeech: "名詞",
    phonetic: "/dɪˈskʌʃən/",
    rarity: "common",
    examples: [
      {
        sentence: "We had a long discussion about the budget.",
        translation: "予算について長時間議論しました。",
        situation: "TOEIC Part3 (会議の内容)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "group discussion",
        meaning: "グループ討議",
        example: "The group discussion was productive.",
        translation: "グループ討議は実り多いものでした。",
      },
    ],
    commonUsages: [
      {
        pattern: "have a discussion",
        explanation: "議論する",
        example: "We need to have a discussion.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["debate", "conversation"],
      businessContext: "会議・コミュニケーションの基本語彙",
    },
  },
  {
    id: 127,
    word: "presentation",
    japanese: "",
    meaning: "プレゼンテーション、発表",
    partOfSpeech: "名詞",
    phonetic: "/ˌprezənˈteɪʃən/",
    rarity: "common",
    examples: [
      {
        sentence: "The presentation was very informative.",
        translation: "プレゼンテーションは非常に情報豊富でした。",
        situation: "TOEIC Part3 (プレゼンテーション評価)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "give a presentation",
        meaning: "プレゼンテーションをする",
        example: "She will give a presentation tomorrow.",
        translation: "彼女は明日プレゼンテーションをします。",
      },
    ],
    commonUsages: [
      {
        pattern: "prepare a presentation",
        explanation: "プレゼンテーションを準備する",
        example: "I need to prepare a presentation.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["talk", "speech"],
      businessContext: "会議・コミュニケーションの基本語彙",
    },
  },
  {
    id: 128,
    word: "agenda",
    japanese: "",
    meaning: "議題、アジェンダ",
    partOfSpeech: "名詞",
    phonetic: "/əˈdʒendə/",
    rarity: "common",
    examples: [
      {
        sentence: "Please review the agenda before the meeting.",
        translation: "会議前に議題を確認してください。",
        situation: "TOEIC Part2 (会議準備)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "meeting agenda",
        meaning: "会議の議題",
        example: "The meeting agenda is attached.",
        translation: "会議の議題を添付します。",
      },
    ],
    commonUsages: [
      {
        pattern: "set an agenda",
        explanation: "議題を設定する",
        example: "We need to set an agenda.",
      },
    ],
    toeicSpecific: {
      parts: ["Part2", "Part3"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["schedule", "program"],
      businessContext: "会議・コミュニケーションの基本語彙",
    },
  },
  {
    id: 129,
    word: "decision",
    japanese: "",
    meaning: "決定、判断",
    partOfSpeech: "名詞",
    phonetic: "/dɪˈsɪʒən/",
    rarity: "common",
    examples: [
      {
        sentence: "We need to make a decision quickly.",
        translation: "迅速な決定が必要です。",
        situation: "TOEIC Part3 (意思決定)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "make a decision",
        meaning: "決定する",
        example: "The manager made a difficult decision.",
        translation: "マネージャーは難しい決定をしました。",
      },
    ],
    commonUsages: [
      {
        pattern: "final decision",
        explanation: "最終決定",
        example: "This is my final decision.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["choice", "judgment"],
      businessContext: "意思決定の基本語彙",
    },
  },
  {
    id: 130,
    word: "opinion",
    japanese: "",
    meaning: "意見、見解",
    partOfSpeech: "名詞",
    phonetic: "/əˈpɪnjən/",
    rarity: "common",
    examples: [
      {
        sentence: "What is your opinion on this matter?",
        translation: "この件についてのご意見は？",
        situation: "TOEIC Part3 (意見交換)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "in my opinion",
        meaning: "私の意見では",
        example: "In my opinion, we should wait.",
        translation: "私の意見では、待つべきです。",
      },
    ],
    commonUsages: [
      {
        pattern: "express an opinion",
        explanation: "意見を述べる",
        example: "Please express your opinion.",
      },
    ],
    toeicSpecific: {
      parts: ["Part3", "Part4"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["view", "belief"],
      businessContext: "意見交換の基本語彙",
    },
  },

  // 文書・資料 (ID 131-160)
  {
    id: 131,
    word: "document",
    japanese: "",
    meaning: "文書、ドキュメント",
    partOfSpeech: "名詞",
    phonetic: "/ˈdɑkjəmənt/",
    rarity: "common",
    examples: [
      {
        sentence: "Please sign this document.",
        translation: "この文書に署名してください。",
        situation: "TOEIC Part2 (文書処理)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "official document",
        meaning: "公式文書",
        example: "This is an official document.",
        translation: "これは公式文書です。",
      },
    ],
    commonUsages: [
      {
        pattern: "create a document",
        explanation: "文書を作成する",
        example: "I need to create a document.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["paper", "file"],
      businessContext: "文書管理の基本語彙",
    },
  },
  {
    id: 132,
    word: "file",
    japanese: "",
    meaning: "ファイル、書類",
    partOfSpeech: "名詞",
    phonetic: "/faɪl/",
    rarity: "common",
    examples: [
      {
        sentence: "The file is saved on the computer.",
        translation: "ファイルはコンピューターに保存されています。",
        situation: "TOEIC Part2 (ファイル管理)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "computer file",
        meaning: "コンピューターファイル",
        example: "Please backup your computer files.",
        translation: "コンピューターファイルをバックアップしてください。",
      },
    ],
    commonUsages: [
      {
        pattern: "open a file",
        explanation: "ファイルを開く",
        example: "Can you open the file?",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["document", "record"],
      businessContext: "文書・IT管理の基本語彙",
    },
  },
  {
    id: 133,
    word: "copy",
    japanese: "",
    meaning: "コピー、複写",
    partOfSpeech: "名詞・動詞",
    phonetic: "/ˈkɑpi/",
    rarity: "common",
    examples: [
      {
        sentence: "Please make a copy of this report.",
        translation: "このレポートのコピーを作ってください。",
        situation: "TOEIC Part2 (文書処理)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "make a copy",
        meaning: "コピーを作る",
        example: "I need to make a copy of this.",
        translation: "このコピーを作る必要があります。",
      },
    ],
    commonUsages: [
      {
        pattern: "copy and paste",
        explanation: "コピー&ペースト",
        example: "Copy and paste the text.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["duplicate", "reproduce"],
      businessContext: "文書処理の基本語彙",
    },
  },
  {
    id: 134,
    word: "print",
    japanese: "",
    meaning: "印刷する、プリント",
    partOfSpeech: "動詞・名詞",
    phonetic: "/prɪnt/",
    rarity: "common",
    examples: [
      {
        sentence: "Please print this document.",
        translation: "この文書を印刷してください。",
        situation: "TOEIC Part2 (文書処理)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "print out",
        meaning: "印刷する",
        example: "Please print out the email.",
        translation: "メールを印刷してください。",
      },
    ],
    commonUsages: [
      {
        pattern: "print a document",
        explanation: "文書を印刷する",
        example: "I need to print a document.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["output", "reproduce"],
      businessContext: "文書処理の基本語彙",
    },
  },
  {
    id: 135,
    word: "fax",
    japanese: "",
    meaning: "ファックス、送信する",
    partOfSpeech: "名詞・動詞",
    phonetic: "/fæks/",
    rarity: "common",
    examples: [
      {
        sentence: "Please fax this document to the client.",
        translation: "この文書をクライアントにファックスしてください。",
        situation: "TOEIC Part2 (文書送信)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "fax machine",
        meaning: "ファックス機",
        example: "The fax machine is not working.",
        translation: "ファックス機が動いていません。",
      },
    ],
    commonUsages: [
      {
        pattern: "send a fax",
        explanation: "ファックスを送る",
        example: "I will send a fax.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["transmit", "send"],
      businessContext: "文書送信の基本語彙",
    },
  },

  // 交通・移動 (ID 136-160)
  {
    id: 136,
    word: "car",
    japanese: "",
    meaning: "車、自動車",
    partOfSpeech: "名詞",
    phonetic: "/kɑr/",
    rarity: "common",
    examples: [
      {
        sentence: "I will drive my car to the meeting.",
        translation: "会議には車で行きます。",
        situation: "TOEIC Part2 (交通手段)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "company car",
        meaning: "会社の車",
        example: "He uses a company car.",
        translation: "彼は会社の車を使っています。",
      },
    ],
    commonUsages: [
      {
        pattern: "drive a car",
        explanation: "車を運転する",
        example: "I drive a car every day.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["vehicle", "automobile"],
      businessContext: "交通手段の基本語彙",
    },
  },
  {
    id: 137,
    word: "train",
    japanese: "",
    meaning: "電車、列車",
    partOfSpeech: "名詞",
    phonetic: "/treɪn/",
    rarity: "common",
    examples: [
      {
        sentence: "The train is running 10 minutes late.",
        translation: "電車は10分遅れています。",
        situation: "TOEIC Part2 (交通情報)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "train station",
        meaning: "駅",
        example: "The train station is nearby.",
        translation: "駅は近くにあります。",
      },
    ],
    commonUsages: [
      {
        pattern: "take a train",
        explanation: "電車に乗る",
        example: "I take a train to work.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["railway", "subway"],
      businessContext: "交通手段の基本語彙",
    },
  },
  {
    id: 138,
    word: "bus",
    japanese: "",
    meaning: "バス",
    partOfSpeech: "名詞",
    phonetic: "/bʌs/",
    rarity: "common",
    examples: [
      {
        sentence: "The bus arrives every 15 minutes.",
        translation: "バスは15分おきに来ます。",
        situation: "TOEIC Part2 (交通情報)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "bus stop",
        meaning: "バス停",
        example: "Wait at the bus stop.",
        translation: "バス停で待ってください。",
      },
    ],
    commonUsages: [
      {
        pattern: "take a bus",
        explanation: "バスに乗る",
        example: "I take a bus to school.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["coach", "vehicle"],
      businessContext: "交通手段の基本語彙",
    },
  },
  {
    id: 139,
    word: "plane",
    japanese: "",
    meaning: "飛行機、プレーン",
    partOfSpeech: "名詞",
    phonetic: "/pleɪn/",
    rarity: "common",
    examples: [
      {
        sentence: "The plane will depart at 3 PM.",
        translation: "飛行機は午後3時に出発します。",
        situation: "TOEIC Part2 (飛行機の情報)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "plane ticket",
        meaning: "航空券",
        example: "I need to buy a plane ticket.",
        translation: "航空券を買う必要があります。",
      },
    ],
    commonUsages: [
      {
        pattern: "board a plane",
        explanation: "飛行機に乗る",
        example: "Please board the plane now.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["aircraft", "airplane"],
      businessContext: "交通手段の基本語彙",
    },
  },
  {
    id: 140,
    word: "taxi",
    japanese: "",
    meaning: "タクシー",
    partOfSpeech: "名詞",
    phonetic: "/ˈtæksi/",
    rarity: "common",
    examples: [
      {
        sentence: "I will call a taxi to the airport.",
        translation: "空港までタクシーを呼びます。",
        situation: "TOEIC Part2 (交通手段)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "take a taxi",
        meaning: "タクシーに乗る",
        example: "Let's take a taxi.",
        translation: "タクシーに乗りましょう。",
      },
    ],
    commonUsages: [
      {
        pattern: "call a taxi",
        explanation: "タクシーを呼ぶ",
        example: "I will call a taxi.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["cab", "car service"],
      businessContext: "交通手段の基本語彙",
    },
  },

  // 食事・レストラン (ID 141-160)
  {
    id: 141,
    word: "restaurant",
    japanese: "",
    meaning: "レストラン、料理店",
    partOfSpeech: "名詞",
    phonetic: "/ˈrestərɑnt/",
    rarity: "common",
    examples: [
      {
        sentence: "Let's meet at the restaurant at 7 PM.",
        translation: "午後7時にレストランで会いましょう。",
        situation: "TOEIC Part2 (会食の約束)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "fancy restaurant",
        meaning: "高級レストラン",
        example: "We went to a fancy restaurant.",
        translation: "高級レストランに行きました。",
      },
    ],
    commonUsages: [
      {
        pattern: "go to a restaurant",
        explanation: "レストランに行く",
        example: "Let's go to a restaurant.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["eatery", "dining"],
      businessContext: "食事・接待の基本語彙",
    },
  },
  {
    id: 142,
    word: "menu",
    japanese: "",
    meaning: "メニュー、献立",
    partOfSpeech: "名詞",
    phonetic: "/ˈmenju/",
    rarity: "common",
    examples: [
      {
        sentence: "Please look at the menu and order.",
        translation: "メニューを見て注文してください。",
        situation: "TOEIC Part2 (レストランでの注文)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "dinner menu",
        meaning: "ディナーメニュー",
        example: "The dinner menu looks great.",
        translation: "ディナーメニューは素晴らしく見えます。",
      },
    ],
    commonUsages: [
      {
        pattern: "read the menu",
        explanation: "メニューを読む",
        example: "Please read the menu.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["list", "selection"],
      businessContext: "食事・接待の基本語彙",
    },
  },
  {
    id: 143,
    word: "order",
    japanese: "",
    meaning: "注文する、命令",
    partOfSpeech: "動詞・名詞",
    phonetic: "/ˈɔrdər/",
    rarity: "common",
    examples: [
      {
        sentence: "What would you like to order?",
        translation: "何を注文されますか？",
        situation: "TOEIC Part2 (レストランでの注文)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "place an order",
        meaning: "注文する",
        example: "I will place an order now.",
        translation: "今注文します。",
      },
    ],
    commonUsages: [
      {
        pattern: "order food",
        explanation: "食べ物を注文する",
        example: "Let's order food.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["request", "command"],
      businessContext: "食事・指示の基本語彙",
    },
  },
  {
    id: 144,
    word: "bill",
    japanese: "",
    meaning: "請求書、勘定",
    partOfSpeech: "名詞",
    phonetic: "/bɪl/",
    rarity: "common",
    examples: [
      {
        sentence: "Could I have the bill, please?",
        translation: "お会計をお願いします。",
        situation: "TOEIC Part2 (レストランでの支払い)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "electricity bill",
        meaning: "電気代",
        example: "The electricity bill is high.",
        translation: "電気代が高いです。",
      },
    ],
    commonUsages: [
      {
        pattern: "pay the bill",
        explanation: "請求書を支払う",
        example: "I will pay the bill.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["invoice", "check"],
      businessContext: "支払い・請求の基本語彙",
    },
  },
  {
    id: 145,
    word: "lunch",
    japanese: "",
    meaning: "昼食、ランチ",
    partOfSpeech: "名詞",
    phonetic: "/lʌntʃ/",
    rarity: "common",
    examples: [
      {
        sentence: "Let's have lunch together tomorrow.",
        translation: "明日一緒に昼食を取りましょう。",
        situation: "TOEIC Part2 (食事の約束)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "business lunch",
        meaning: "ビジネスランチ",
        example: "We had a business lunch.",
        translation: "ビジネスランチを取りました。",
      },
    ],
    commonUsages: [
      {
        pattern: "have lunch",
        explanation: "昼食を取る",
        example: "I have lunch at 12 PM.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "high",
      scoreBand: "500-600",
      synonyms: ["meal", "dining"],
      businessContext: "食事・接待の基本語彙",
    },
  },

  // ショッピング・買い物 (ID 146-170)
  {
    id: 146,
    word: "store",
    japanese: "",
    meaning: "店、ストア",
    partOfSpeech: "名詞",
    phonetic: "/stɔr/",
    rarity: "common",
    examples: [
      {
        sentence: "The store opens at 9 AM.",
        translation: "店は午前9時に開店します。",
        situation: "TOEIC Part2 (店舗情報)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "department store",
        meaning: "デパート",
        example: "I work at a department store.",
        translation: "デパートで働いています。",
      },
    ],
    commonUsages: [
      {
        pattern: "go to the store",
        explanation: "店に行く",
        example: "I need to go to the store.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["shop", "retail"],
      businessContext: "ショッピング・小売の基本語彙",
    },
  },
  {
    id: 147,
    word: "shop",
    japanese: "",
    meaning: "店、買い物する",
    partOfSpeech: "名詞・動詞",
    phonetic: "/ʃɑp/",
    rarity: "common",
    examples: [
      {
        sentence: "I need to shop for new clothes.",
        translation: "新しい服を買い物する必要があります。",
        situation: "TOEIC Part2 (買い物の計画)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "shop online",
        meaning: "オンラインで買い物する",
        example: "I prefer to shop online.",
        translation: "オンラインで買い物する方が好きです。",
      },
    ],
    commonUsages: [
      {
        pattern: "go shopping",
        explanation: "買い物に行く",
        example: "Let's go shopping.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["store", "purchase"],
      businessContext: "ショッピング・小売の基本語彙",
    },
  },
  {
    id: 148,
    word: "price",
    japanese: "",
    meaning: "価格、値段",
    partOfSpeech: "名詞",
    phonetic: "/praɪs/",
    rarity: "common",
    examples: [
      {
        sentence: "What is the price of this item?",
        translation: "この商品の価格はいくらですか？",
        situation: "TOEIC Part2 (価格確認)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "low price",
        meaning: "低価格",
        example: "We offer low prices.",
        translation: "低価格を提供しています。",
      },
    ],
    commonUsages: [
      {
        pattern: "check the price",
        explanation: "価格を確認する",
        example: "Please check the price.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["cost", "amount"],
      businessContext: "価格・商取引の基本語彙",
    },
  },
  {
    id: 149,
    word: "cost",
    japanese: "",
    meaning: "費用、コスト",
    partOfSpeech: "名詞・動詞",
    phonetic: "/kɔst/",
    rarity: "common",
    examples: [
      {
        sentence: "The cost of the project is too high.",
        translation: "プロジェクトの費用が高すぎます。",
        situation: "TOEIC Part3 (費用の議論)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "high cost",
        meaning: "高コスト",
        example: "The high cost is a problem.",
        translation: "高コストが問題です。",
      },
    ],
    commonUsages: [
      {
        pattern: "reduce costs",
        explanation: "コストを削減する",
        example: "We need to reduce costs.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["price", "expense"],
      businessContext: "費用・予算の基本語彙",
    },
  },
  {
    id: 150,
    word: "money",
    japanese: "",
    meaning: "お金、金銭",
    partOfSpeech: "名詞",
    phonetic: "/ˈmʌni/",
    rarity: "common",
    examples: [
      {
        sentence: "I don't have enough money for this.",
        translation: "これには十分なお金がありません。",
        situation: "TOEIC Part2 (支払い能力)",
      },
    ],
    combinations: [
      {
        type: "collocation",
        expression: "save money",
        meaning: "お金を節約する",
        example: "We need to save money.",
        translation: "お金を節約する必要があります。",
      },
    ],
    commonUsages: [
      {
        pattern: "spend money",
        explanation: "お金を使う",
        example: "I spend money on books.",
      },
    ],
    toeicSpecific: {
      parts: ["Part1", "Part2", "Part3"],
      frequency: "very_high",
      scoreBand: "400-500",
      synonyms: ["cash", "currency"],
      businessContext: "金銭・支払いの基本語彙",
    },
  },

  // 追加の基本語彙（ID 151-200の続きは次のチャンクで）
];

// カテゴリ別統計
export const vocabularyStats = {
  total: expandedBasicVocabulary.length,
  categories: {
    officeEnvironment: 5, // ID 116-120
    timeSchedule: 5, // ID 121-125
    communication: 5, // ID 126-130
    documents: 5, // ID 131-135
    transportation: 5, // ID 136-140
    dining: 5, // ID 141-145
    shopping: 5, // ID 146-150
  },
  rarity: {
    common: 35, // 基本語彙のほとんどがcommon
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
  },
  toeicScoreBand: {
    "400-500": 35, // 基本語彙は400-500点帯
    "500-600": 0,
    "600-700": 0,
    "700-800": 0,
    "800+": 0,
  },
};
