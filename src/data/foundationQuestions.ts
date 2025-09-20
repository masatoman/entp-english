import { QuestionData } from "../components/Question";

/**
 * 基礎カテゴリーの問題データ
 * Level 0の超基礎分野をカバー
 */

export interface FoundationQuestions {
  "parts-of-speech": Record<"easy" | "normal" | "hard", QuestionData[]>;
  "word-order": Record<"easy" | "normal" | "hard", QuestionData[]>;
  "pronouns": Record<"easy" | "normal" | "hard", QuestionData[]>;
  "articles": Record<"easy" | "normal" | "hard", QuestionData[]>;
  "plurals": Record<"easy" | "normal" | "hard", QuestionData[]>;
  "questions-negations": Record<"easy" | "normal" | "hard", QuestionData[]>;
  "prepositions": Record<"easy" | "normal" | "hard", QuestionData[]>;
  "conjunctions": Record<"easy" | "normal" | "hard", QuestionData[]>;
}

export const foundationQuestions: FoundationQuestions = {
  // 品詞の理解
  "parts-of-speech": {
    easy: [
      {
        id: 1001,
        japanese: "私は（　）です。",
        correctAnswer: "I am a student.",
        explanation: "student は「名詞」です。人や物の名前を表します。",
        choices: [
          "I am a student.", // student(名詞)
          "I am study.", // study(動詞) 
          "I am studying.", // studying(動名詞)
          "I am studied.", // studied(過去分詞)
        ],
      },
      {
        id: 1002,
        japanese: "彼は速く（　）。",
        correctAnswer: "He runs fast.",
        explanation: "runs は「動詞」です。動作や状態を表します。",
        choices: [
          "He runs fast.", // runs(動詞)
          "He run fast.", // run(動詞原形)
          "He runner fast.", // runner(名詞)
          "He running fast.", // running(動名詞)
        ],
      },
      {
        id: 1003,
        japanese: "この花は（　）です。",
        correctAnswer: "This flower is beautiful.",
        explanation: "beautiful は「形容詞」です。名詞の性質や状態を表します。",
        choices: [
          "This flower is beautiful.", // beautiful(形容詞)
          "This flower is beauty.", // beauty(名詞)
          "This flower is beautifully.", // beautifully(副詞)
          "This flower is beautify.", // beautify(動詞)
        ],
      },
      {
        id: 1004,
        japanese: "彼女は（　）歌います。",
        correctAnswer: "She sings beautifully.",
        explanation: "beautifully は「副詞」です。動詞や形容詞を修飾します。",
        choices: [
          "She sings beautifully.", // beautifully(副詞)
          "She sings beautiful.", // beautiful(形容詞)
          "She sings beauty.", // beauty(名詞)
          "She sings beautify.", // beautify(動詞)
        ],
      },
      {
        id: 1005,
        japanese: "その（　）は大きいです。",
        correctAnswer: "The house is big.",
        explanation: "house は「名詞」です。建物を表す名詞です。",
        choices: [
          "The house is big.", // house(名詞)
          "The housing is big.", // housing(動名詞)
          "The housed is big.", // housed(過去分詞)
          "The houses is big.", // houses(複数形名詞・文法エラー)
        ],
      },
    ],
    normal: [
      {
        id: 1011,
        japanese: "彼は（　）に仕事をします。",
        correctAnswer: "He works carefully.",
        explanation: "carefully は副詞で、動詞 works を修飾しています。",
        choices: [
          "He works careful.", // careful(形容詞)
          "He works carefully.", // carefully(副詞)
          "He works care.", // care(名詞・動詞)
          "He works caring.", // caring(動名詞・形容詞)
        ],
      },
      {
        id: 1012,
        japanese: "この問題は（　）です。",
        correctAnswer: "This problem is difficult.",
        explanation: "difficult は形容詞で、名詞 problem の性質を表します。",
        choices: [
          "This problem is difficulty.", // difficulty(名詞)
          "This problem is difficult.", // difficult(形容詞)
          "This problem is difficultly.", // difficultly(副詞)
          "This problem is difficulting.", // 存在しない語
        ],
      },
      {
        id: 1013,
        japanese: "私たちは（　）を議論しました。",
        correctAnswer: "We discussed the proposal.",
        explanation: "proposal は名詞で、動詞 discussed の目的語になります。",
        choices: [
          "We discussed the propose.", // propose(動詞)
          "We discussed the proposal.", // proposal(名詞)
          "We discussed the proposing.", // proposing(動名詞)
          "We discussed the proposed.", // proposed(過去分詞)
        ],
      },
      {
        id: 1014,
        japanese: "彼女は（　）に説明しました。",
        correctAnswer: "She explained clearly.",
        explanation: "clearly は副詞で、動詞 explained を修飾します。",
        choices: [
          "She explained clear.", // clear(形容詞)
          "She explained clearly.", // clearly(副詞)
          "She explained clarity.", // clarity(名詞)
          "She explained clearing.", // clearing(動名詞)
        ],
      },
      {
        id: 1015,
        japanese: "その（　）は重要です。",
        correctAnswer: "The information is important.",
        explanation: "information は名詞で、文の主語になります。",
        choices: [
          "The inform is important.", // inform(動詞)
          "The information is important.", // information(名詞)
          "The informing is important.", // informing(動名詞)
          "The informed is important.", // informed(過去分詞)
        ],
      },
    ],
    hard: [
      {
        id: 1021,
        japanese: "彼の（　）は印象的でした。",
        correctAnswer: "His presentation was impressive.",
        explanation: "presentation は名詞。動詞 present から派生した名詞形です。",
        choices: [
          "His present was impressive.", // present(動詞・名詞)
          "His presenting was impressive.", // presenting(動名詞)
          "His presentation was impressive.", // presentation(名詞)
          "His presented was impressive.", // presented(過去分詞)
        ],
      },
      {
        id: 1022,
        japanese: "この研究は（　）に行われました。",
        correctAnswer: "This research was conducted systematically.",
        explanation: "systematically は副詞。形容詞 systematic から派生した副詞形です。",
        choices: [
          "This research was conducted systematic.", // systematic(形容詞)
          "This research was conducted systematically.", // systematically(副詞)
          "This research was conducted system.", // system(名詞)
          "This research was conducted systemizing.", // systemizing(動名詞)
        ],
      },
      {
        id: 1023,
        japanese: "その（　）は革新的です。",
        correctAnswer: "The innovation is revolutionary.",
        explanation: "innovation は名詞、revolutionary は形容詞です。",
        choices: [
          "The innovate is revolutionary.", // innovate(動詞)
          "The innovation is revolutionary.", // innovation(名詞)
          "The innovating is revolutionary.", // innovating(動名詞)
          "The innovative is revolutionary.", // innovative(形容詞)
        ],
      },
      {
        id: 1024,
        japanese: "彼女は（　）に対応しました。",
        correctAnswer: "She responded appropriately.",
        explanation: "appropriately は副詞。動詞 responded を修飾します。",
        choices: [
          "She responded appropriate.", // appropriate(形容詞)
          "She responded appropriately.", // appropriately(副詞)
          "She responded appropriation.", // appropriation(名詞)
          "She responded appropriating.", // appropriating(動名詞)
        ],
      },
      {
        id: 1025,
        japanese: "この（　）は効果的です。",
        correctAnswer: "This method is effective.",
        explanation: "method は名詞、effective は形容詞です。",
        choices: [
          "This method is effective.", // method(名詞), effective(形容詞)
          "This methodical is effective.", // methodical(形容詞)
          "This methodology is effective.", // methodology(名詞)
          "This methodically is effective.", // methodically(副詞)
        ],
      },
    ],
  },

  // 語順の基本
  "word-order": {
    easy: [
      {
        id: 2001,
        japanese: "私は毎日英語を勉強します。",
        correctAnswer: "I study English every day.",
        explanation: "英語の基本語順：主語 + 動詞 + 目的語 + 時間表現",
        choices: [
          "I study English every day.",
          "I every day study English.",
          "English I study every day.",
          "Every day I study English.",
        ],
      },
      {
        id: 2002,
        japanese: "彼女は図書館で本を読みます。",
        correctAnswer: "She reads books in the library.",
        explanation: "英語の語順：主語 + 動詞 + 目的語 + 場所表現",
        choices: [
          "She in the library reads books.",
          "She reads books in the library.",
          "In the library she reads books.",
          "Books she reads in the library.",
        ],
      },
      {
        id: 2003,
        japanese: "私たちは昨日映画を見ました。",
        correctAnswer: "We watched a movie yesterday.",
        explanation: "過去形での語順：主語 + 動詞 + 目的語 + 時間表現",
        choices: [
          "We yesterday watched a movie.",
          "We watched a movie yesterday.",
          "Yesterday we watched a movie.",
          "A movie we watched yesterday.",
        ],
      },
      {
        id: 2004,
        japanese: "彼は静かに部屋を出ました。",
        correctAnswer: "He left the room quietly.",
        explanation: "副詞は通常、動詞の後に置きます",
        choices: [
          "He quietly left the room.",
          "He left the room quietly.",
          "He left quietly the room.",
          "Quietly he left the room.",
        ],
      },
      {
        id: 2005,
        japanese: "その大きな赤い車は新しいです。",
        correctAnswer: "The big red car is new.",
        explanation: "形容詞の順序：大きさ + 色 + 名詞",
        choices: [
          "The red big car is new.",
          "The big red car is new.",
          "The car big red is new.",
          "The new big red car is.",
        ],
      },
    ],
    normal: [
      {
        id: 2011,
        japanese: "私は友達に手紙を書きました。",
        correctAnswer: "I wrote a letter to my friend.",
        explanation: "間接目的語がある場合：動詞 + 直接目的語 + to + 間接目的語",
        choices: [
          "I wrote to my friend a letter.",
          "I wrote a letter to my friend.",
          "I wrote my friend a letter.",
          "I to my friend wrote a letter.",
        ],
      },
      {
        id: 2012,
        japanese: "彼女は注意深く計画を検討しました。",
        correctAnswer: "She carefully considered the plan.",
        explanation: "副詞は動詞の前に置くこともできます（強調）",
        choices: [
          "She considered the plan carefully.",
          "She carefully considered the plan.",
          "She considered carefully the plan.",
          "Carefully she considered the plan.",
        ],
      },
      {
        id: 2013,
        japanese: "私たちは会議室で重要な話し合いをしました。",
        correctAnswer: "We had an important discussion in the meeting room.",
        explanation: "形容詞 + 名詞 + 場所の副詞句の語順",
        choices: [
          "We had in the meeting room an important discussion.",
          "We had an important discussion in the meeting room.",
          "In the meeting room we had an important discussion.",
          "An important discussion we had in the meeting room.",
        ],
      },
      {
        id: 2014,
        japanese: "彼は突然大声で笑い始めました。",
        correctAnswer: "He suddenly started laughing loudly.",
        explanation: "副詞の位置：時間の副詞 + 動詞 + 方法の副詞",
        choices: [
          "He started suddenly laughing loudly.",
          "He suddenly started laughing loudly.",
          "He started laughing suddenly loudly.",
          "Suddenly loudly he started laughing.",
        ],
      },
      {
        id: 2015,
        japanese: "その美しい古い木造の家は売られました。",
        correctAnswer: "The beautiful old wooden house was sold.",
        explanation: "形容詞の順序：美観 + 年代 + 材質 + 名詞",
        choices: [
          "The old beautiful wooden house was sold.",
          "The wooden beautiful old house was sold.",
          "The beautiful old wooden house was sold.",
          "The beautiful wooden old house was sold.",
        ],
      },
    ],
    hard: [
      {
        id: 2021,
        japanese: "彼女は毎朝早く起きて、ジョギングをして、朝食を作ります。",
        correctAnswer: "She gets up early every morning, goes jogging, and makes breakfast.",
        explanation: "複数の動作の並列：動詞1, 動詞2, and 動詞3",
        choices: [
          "She every morning gets up early, goes jogging, and makes breakfast.",
          "She gets up early every morning, goes jogging, and makes breakfast.",
          "She gets up early, every morning goes jogging, and makes breakfast.",
          "Every morning she gets up early, goes jogging, and makes breakfast.",
        ],
      },
      {
        id: 2022,
        japanese: "私は彼に、その重要な書類を、明日までに、提出するよう依頼しました。",
        correctAnswer: "I asked him to submit the important documents by tomorrow.",
        explanation: "複雑な文での語順：主語 + 動詞 + 間接目的語 + to不定詞句",
        choices: [
          "I asked him by tomorrow to submit the important documents.",
          "I asked him to submit the important documents by tomorrow.",
          "I asked him to submit by tomorrow the important documents.",
          "I by tomorrow asked him to submit the important documents.",
        ],
      },
      {
        id: 2023,
        japanese: "その会社は、効率的に、新しい技術を、市場に導入しました。",
        correctAnswer: "The company efficiently introduced new technology to the market.",
        explanation: "副詞の位置：主語 + 副詞 + 動詞 + 目的語 + 前置詞句",
        choices: [
          "The company introduced efficiently new technology to the market.",
          "The company efficiently introduced new technology to the market.",
          "The company introduced new technology efficiently to the market.",
          "Efficiently the company introduced new technology to the market.",
        ],
      },
      {
        id: 2024,
        japanese: "彼らは、その複雑で困難な問題を、創造的かつ効果的に解決しました。",
        correctAnswer: "They solved the complex and difficult problem creatively and effectively.",
        explanation: "形容詞の並列 + 副詞の並列：and で接続",
        choices: [
          "They creatively and effectively solved the complex and difficult problem.",
          "They solved the complex and difficult problem creatively and effectively.",
          "They solved creatively and effectively the complex and difficult problem.",
          "Creatively and effectively they solved the complex and difficult problem.",
        ],
      },
      {
        id: 2025,
        japanese: "私は、昨日買った新しい本を、今朝、注意深く読み始めました。",
        correctAnswer: "I carefully started reading the new book I bought yesterday this morning.",
        explanation: "関係詞句 + 時間表現 + 副詞 + 動詞の複雑な語順",
        choices: [
          "I started reading carefully the new book I bought yesterday this morning.",
          "I carefully started reading the new book I bought yesterday this morning.",
          "I started reading the new book carefully I bought yesterday this morning.",
          "This morning I carefully started reading the new book I bought yesterday.",
        ],
      },
    ],
  },

  // 代名詞
  "pronouns": {
    easy: [
      {
        id: 3001,
        japanese: "（　）は学生です。（男性について）",
        correctAnswer: "He is a student.",
        explanation: "男性を指す場合は He を使います。",
        choices: [
          "She is a student.",
          "He is a student.",
          "It is a student.",
          "They is a student.",
        ],
      },
      {
        id: 3002,
        japanese: "（　）は私の本です。",
        correctAnswer: "It is my book.",
        explanation: "物を指す場合は It を使います。my は所有代名詞です。",
        choices: [
          "He is my book.",
          "She is my book.",
          "It is my book.",
          "They is my book.",
        ],
      },
      {
        id: 3003,
        japanese: "（　）の車は赤いです。（彼女の）",
        correctAnswer: "Her car is red.",
        explanation: "Her は「彼女の」を表す所有代名詞です。",
        choices: [
          "His car is red.",
          "Her car is red.",
          "Its car is red.",
          "Their car is red.",
        ],
      },
      {
        id: 3004,
        japanese: "（　）は先生たちです。",
        correctAnswer: "They are teachers.",
        explanation: "複数の人を指す場合は They を使います。",
        choices: [
          "He are teachers.",
          "She are teachers.",
          "It are teachers.",
          "They are teachers.",
        ],
      },
      {
        id: 3005,
        japanese: "これは（　）のペンです。（私の）",
        correctAnswer: "This is my pen.",
        explanation: "my は「私の」を表す所有代名詞です。",
        choices: [
          "This is I pen.",
          "This is me pen.",
          "This is my pen.",
          "This is mine pen.",
        ],
      },
    ],
    normal: [
      {
        id: 3011,
        japanese: "私は（　）に本を渡しました。（彼に）",
        correctAnswer: "I gave him the book.",
        explanation: "him は目的格の代名詞です。動詞の目的語になります。",
        choices: [
          "I gave he the book.",
          "I gave his the book.",
          "I gave him the book.",
          "I gave himself the book.",
        ],
      },
      {
        id: 3012,
        japanese: "この問題は（　）自身で解決しました。（彼女が）",
        correctAnswer: "She solved this problem herself.",
        explanation: "herself は再帰代名詞で「彼女自身」を表します。",
        choices: [
          "She solved this problem her.",
          "She solved this problem hers.",
          "She solved this problem herself.",
          "She solved this problem she.",
        ],
      },
      {
        id: 3013,
        japanese: "（　）のどちらが正しいですか？",
        correctAnswer: "Which one is correct?",
        explanation: "Which は疑問代名詞で「どちら・どれ」を表します。",
        choices: [
          "What one is correct?",
          "Which one is correct?",
          "Who one is correct?",
          "Where one is correct?",
        ],
      },
      {
        id: 3014,
        japanese: "（　）がそのプロジェクトを担当しますか？",
        correctAnswer: "Who will be in charge of the project?",
        explanation: "Who は人を尋ねる疑問代名詞です。",
        choices: [
          "What will be in charge of the project?",
          "Which will be in charge of the project?",
          "Who will be in charge of the project?",
          "Where will be in charge of the project?",
        ],
      },
      {
        id: 3015,
        japanese: "この本は（　）のものですか？",
        correctAnswer: "Whose book is this?",
        explanation: "Whose は所有を尋ねる疑問代名詞です。",
        choices: [
          "Who book is this?",
          "Whose book is this?",
          "Which book is this?",
          "What book is this?",
        ],
      },
    ],
    hard: [
      {
        id: 3021,
        japanese: "（　）でも参加できます。",
        correctAnswer: "Anyone can participate.",
        explanation: "Anyone は「誰でも」を表す不定代名詞です。",
        choices: [
          "Everyone can participate.",
          "Someone can participate.",
          "Anyone can participate.",
          "No one can participate.",
        ],
      },
      {
        id: 3022,
        japanese: "私は（　）も見つけることができませんでした。",
        correctAnswer: "I couldn't find anything.",
        explanation: "anything は否定文で「何も」を表します。",
        choices: [
          "I couldn't find something.",
          "I couldn't find anything.",
          "I couldn't find nothing.",
          "I couldn't find everything.",
        ],
      },
      {
        id: 3023,
        japanese: "（　）がその会議に出席しましたか？",
        correctAnswer: "Who attended the meeting?",
        explanation: "Who は主語として使われる疑問代名詞です。",
        choices: [
          "Whom attended the meeting?",
          "Who attended the meeting?",
          "Whose attended the meeting?",
          "Which attended the meeting?",
        ],
      },
      {
        id: 3024,
        japanese: "私は（　）を信頼すべきか分かりません。",
        correctAnswer: "I don't know whom to trust.",
        explanation: "whom は目的格の疑問代名詞です。",
        choices: [
          "I don't know who to trust.",
          "I don't know whom to trust.",
          "I don't know whose to trust.",
          "I don't know which to trust.",
        ],
      },
      {
        id: 3025,
        japanese: "（　）も完璧ではありません。",
        correctAnswer: "Nobody is perfect.",
        explanation: "Nobody は「誰も～ない」を表す否定の不定代名詞です。",
        choices: [
          "Somebody is not perfect.",
          "Anybody is not perfect.",
          "Nobody is perfect.",
          "Everybody is not perfect.",
        ],
      },
    ],
  },

  // 冠詞
  "articles": {
    easy: [
      {
        id: 4001,
        japanese: "私は（　）学生です。",
        correctAnswer: "I am a student.",
        explanation: "初めて言及する可算名詞の単数形には a を使います。",
        choices: [
          "I am student.",
          "I am a student.",
          "I am an student.",
          "I am the student.",
        ],
      },
      {
        id: 4002,
        japanese: "（　）りんごを食べました。",
        correctAnswer: "I ate an apple.",
        explanation: "母音で始まる単語には an を使います。",
        choices: [
          "I ate a apple.",
          "I ate an apple.",
          "I ate the apple.",
          "I ate apple.",
        ],
      },
      {
        id: 4003,
        japanese: "（　）太陽は明るいです。",
        correctAnswer: "The sun is bright.",
        explanation: "世界に一つしかないものには the を使います。",
        choices: [
          "A sun is bright.",
          "An sun is bright.",
          "The sun is bright.",
          "Sun is bright.",
        ],
      },
      {
        id: 4004,
        japanese: "私は（　）本を読んでいます。（特定の本）",
        correctAnswer: "I am reading the book.",
        explanation: "特定の本（既に話題に出た本）には the を使います。",
        choices: [
          "I am reading a book.",
          "I am reading an book.",
          "I am reading the book.",
          "I am reading book.",
        ],
      },
      {
        id: 4005,
        japanese: "彼女は（　）医者です。",
        correctAnswer: "She is a doctor.",
        explanation: "職業を表す場合、通常 a/an を使います。",
        choices: [
          "She is doctor.",
          "She is a doctor.",
          "She is an doctor.",
          "She is the doctor.",
        ],
      },
    ],
    normal: [
      {
        id: 4011,
        japanese: "私は（　）音楽が好きです。",
        correctAnswer: "I like music.",
        explanation: "一般的な概念としての音楽には冠詞を使いません。",
        choices: [
          "I like a music.",
          "I like an music.",
          "I like the music.",
          "I like music.",
        ],
      },
      {
        id: 4012,
        japanese: "（　）富士山は日本で最も高い山です。",
        correctAnswer: "Mount Fuji is the highest mountain in Japan.",
        explanation: "固有名詞の山には通常冠詞を使いません。",
        choices: [
          "A Mount Fuji is the highest mountain in Japan.",
          "An Mount Fuji is the highest mountain in Japan.",
          "The Mount Fuji is the highest mountain in Japan.",
          "Mount Fuji is the highest mountain in Japan.",
        ],
      },
      {
        id: 4013,
        japanese: "彼は（　）大学で英語を教えています。",
        correctAnswer: "He teaches English at university.",
        explanation: "一般的な機関としての大学には冠詞を使わないことがあります。",
        choices: [
          "He teaches English at a university.",
          "He teaches English at an university.",
          "He teaches English at the university.",
          "He teaches English at university.",
        ],
      },
      {
        id: 4014,
        japanese: "私たちは（　）夕食を一緒に食べました。",
        correctAnswer: "We had dinner together.",
        explanation: "食事名（breakfast, lunch, dinner）には通常冠詞を使いません。",
        choices: [
          "We had a dinner together.",
          "We had an dinner together.",
          "We had the dinner together.",
          "We had dinner together.",
        ],
      },
      {
        id: 4015,
        japanese: "（　）英語は世界共通語です。",
        correctAnswer: "English is a global language.",
        explanation: "言語名には冠詞を使いません。",
        choices: [
          "A English is a global language.",
          "An English is a global language.",
          "The English is a global language.",
          "English is a global language.",
        ],
      },
    ],
    hard: [
      {
        id: 4021,
        japanese: "彼は（　）ピアノと（　）ギターを演奏できます。",
        correctAnswer: "He can play the piano and the guitar.",
        explanation: "楽器名には the を使います。",
        choices: [
          "He can play piano and guitar.",
          "He can play a piano and a guitar.",
          "He can play the piano and the guitar.",
          "He can play an piano and an guitar.",
        ],
      },
      {
        id: 4022,
        japanese: "（　）貧困は世界的な問題です。",
        correctAnswer: "Poverty is a global issue.",
        explanation: "抽象名詞には通常冠詞を使いません。",
        choices: [
          "A poverty is a global issue.",
          "An poverty is a global issue.",
          "The poverty is a global issue.",
          "Poverty is a global issue.",
        ],
      },
      {
        id: 4023,
        japanese: "私は（　）朝に（　）コーヒーを飲みます。",
        correctAnswer: "I drink coffee in the morning.",
        explanation: "時間帯には the、一般的な飲み物には冠詞なし。",
        choices: [
          "I drink a coffee in a morning.",
          "I drink the coffee in morning.",
          "I drink coffee in the morning.",
          "I drink coffee in morning.",
        ],
      },
      {
        id: 4024,
        japanese: "（　）インターネットは現代社会に不可欠です。",
        correctAnswer: "The Internet is essential in modern society.",
        explanation: "インターネットは固有のシステムなので the を使います。",
        choices: [
          "A Internet is essential in modern society.",
          "An Internet is essential in modern society.",
          "The Internet is essential in modern society.",
          "Internet is essential in modern society.",
        ],
      },
      {
        id: 4025,
        japanese: "彼女は（　）最高の学生の一人です。",
        correctAnswer: "She is one of the best students.",
        explanation: "最上級には the を使います。",
        choices: [
          "She is one of a best students.",
          "She is one of an best students.",
          "She is one of the best students.",
          "She is one of best students.",
        ],
      },
    ],
  },

  // 複数形
  "plurals": {
    easy: [
      {
        id: 5001,
        japanese: "私は2冊の（　）を持っています。",
        correctAnswer: "I have two books.",
        explanation: "book の複数形は books です。",
        choices: [
          "I have two book.",
          "I have two books.",
          "I have two bookes.",
          "I have two book's.",
        ],
      },
      {
        id: 5002,
        japanese: "3匹の（　）がいます。",
        correctAnswer: "There are three cats.",
        explanation: "cat の複数形は cats です。",
        choices: [
          "There are three cat.",
          "There are three cats.",
          "There are three cates.",
          "There are three cat's.",
        ],
      },
      {
        id: 5003,
        japanese: "多くの（　）が公園にいます。",
        correctAnswer: "Many children are in the park.",
        explanation: "child の複数形は children です（不規則変化）。",
        choices: [
          "Many childs are in the park.",
          "Many children are in the park.",
          "Many childes are in the park.",
          "Many child's are in the park.",
        ],
      },
      {
        id: 5004,
        japanese: "私は（　）が好きです。",
        correctAnswer: "I like apples.",
        explanation: "一般的な好みを表す場合、複数形を使います。",
        choices: [
          "I like apple.",
          "I like an apple.",
          "I like the apple.",
          "I like apples.",
        ],
      },
      {
        id: 5005,
        japanese: "たくさんの（　）が空を飛んでいます。",
        correctAnswer: "Many birds are flying in the sky.",
        explanation: "bird の複数形は birds です。",
        choices: [
          "Many bird are flying in the sky.",
          "Many birds are flying in the sky.",
          "Many birdes are flying in the sky.",
          "Many bird's are flying in the sky.",
        ],
      },
    ],
    normal: [
      {
        id: 5011,
        japanese: "私は（　）を飲みます。",
        correctAnswer: "I drink water.",
        explanation: "water は不可算名詞なので複数形にしません。",
        choices: [
          "I drink waters.",
          "I drink water.",
          "I drink a water.",
          "I drink the waters.",
        ],
      },
      {
        id: 5012,
        japanese: "彼女は（　）を集めています。",
        correctAnswer: "She collects information.",
        explanation: "information は不可算名詞です。",
        choices: [
          "She collects informations.",
          "She collects information.",
          "She collects an information.",
          "She collects the informations.",
        ],
      },
      {
        id: 5013,
        japanese: "私は（　）を求めています。",
        correctAnswer: "I need advice.",
        explanation: "advice は不可算名詞です。",
        choices: [
          "I need advices.",
          "I need advice.",
          "I need an advice.",
          "I need the advices.",
        ],
      },
      {
        id: 5014,
        japanese: "多くの（　）が会議に参加しました。",
        correctAnswer: "Many people attended the meeting.",
        explanation: "people は person の複数形です。",
        choices: [
          "Many person attended the meeting.",
          "Many people attended the meeting.",
          "Many persons attended the meeting.",
          "Many peoples attended the meeting.",
        ],
      },
      {
        id: 5015,
        japanese: "私は（　）を学んでいます。",
        correctAnswer: "I am studying mathematics.",
        explanation: "mathematics は単数扱いの名詞です。",
        choices: [
          "I am studying mathematic.",
          "I am studying mathematics.",
          "I am studying a mathematics.",
          "I am studying the mathematics.",
        ],
      },
    ],
    hard: [
      {
        id: 5021,
        japanese: "その（　）は複雑です。",
        correctAnswer: "The phenomena are complex.",
        explanation: "phenomenon の複数形は phenomena です。",
        choices: [
          "The phenomenons are complex.",
          "The phenomena are complex.",
          "The phenomenon are complex.",
          "The phenomenas are complex.",
        ],
      },
      {
        id: 5022,
        japanese: "私たちは新しい（　）を分析しました。",
        correctAnswer: "We analyzed new data.",
        explanation: "data は複数形として扱われることが多いです。",
        choices: [
          "We analyzed new datas.",
          "We analyzed new data.",
          "We analyzed a new data.",
          "We analyzed the new datas.",
        ],
      },
      {
        id: 5023,
        japanese: "その（　）は正確です。",
        correctAnswer: "The analyses are accurate.",
        explanation: "analysis の複数形は analyses です。",
        choices: [
          "The analysis are accurate.",
          "The analyses are accurate.",
          "The analysises are accurate.",
          "The analysis's are accurate.",
        ],
      },
      {
        id: 5024,
        japanese: "多くの（　）が提出されました。",
        correctAnswer: "Many theses were submitted.",
        explanation: "thesis の複数形は theses です。",
        choices: [
          "Many thesis were submitted.",
          "Many theses were submitted.",
          "Many thesises were submitted.",
          "Many thesis's were submitted.",
        ],
      },
      {
        id: 5025,
        japanese: "その（　）は興味深いです。",
        correctAnswer: "The criteria are interesting.",
        explanation: "criterion の複数形は criteria です。",
        choices: [
          "The criterion are interesting.",
          "The criteria are interesting.",
          "The criterions are interesting.",
          "The criterion's are interesting.",
        ],
      },
    ],
  },

  // 疑問文・否定文
  "questions-negations": {
    easy: [
      {
        id: 6001,
        japanese: "あなたは学生ですか？",
        correctAnswer: "Are you a student?",
        explanation: "be動詞の疑問文：be動詞を主語の前に移動します。",
        choices: [
          "Do you a student?",
          "Are you a student?",
          "Is you a student?",
          "You are a student?",
        ],
      },
      {
        id: 6002,
        japanese: "彼は医者ではありません。",
        correctAnswer: "He is not a doctor.",
        explanation: "be動詞の否定文：be動詞の後に not を置きます。",
        choices: [
          "He not is a doctor.",
          "He is not a doctor.",
          "He don't is a doctor.",
          "He doesn't is a doctor.",
        ],
      },
      {
        id: 6003,
        japanese: "あなたは英語を話しますか？",
        correctAnswer: "Do you speak English?",
        explanation: "一般動詞の疑問文：Do/Does を文頭に置きます。",
        choices: [
          "Speak you English?",
          "Do you speak English?",
          "Are you speak English?",
          "You speak English?",
        ],
      },
      {
        id: 6004,
        japanese: "私は日本語を話しません。",
        correctAnswer: "I don't speak Japanese.",
        explanation: "一般動詞の否定文：don't/doesn't + 動詞の原形",
        choices: [
          "I not speak Japanese.",
          "I am not speak Japanese.",
          "I don't speak Japanese.",
          "I doesn't speak Japanese.",
        ],
      },
      {
        id: 6005,
        japanese: "彼女は料理をしますか？",
        correctAnswer: "Does she cook?",
        explanation: "三人称単数の疑問文：Does + 主語 + 動詞の原形",
        choices: [
          "Do she cook?",
          "Does she cook?",
          "Is she cook?",
          "Cook she?",
        ],
      },
    ],
    normal: [
      {
        id: 6011,
        japanese: "何時に起きますか？",
        correctAnswer: "What time do you get up?",
        explanation: "時間を尋ねる疑問文：What time + 疑問文",
        choices: [
          "When time do you get up?",
          "What time do you get up?",
          "Which time do you get up?",
          "How time do you get up?",
        ],
      },
      {
        id: 6012,
        japanese: "どこで働いていますか？",
        correctAnswer: "Where do you work?",
        explanation: "場所を尋ねる疑問文：Where + 疑問文",
        choices: [
          "What do you work?",
          "Where do you work?",
          "When do you work?",
          "How do you work?",
        ],
      },
      {
        id: 6013,
        japanese: "なぜ遅刻したのですか？",
        correctAnswer: "Why were you late?",
        explanation: "理由を尋ねる疑問文：Why + 疑問文",
        choices: [
          "What were you late?",
          "Where were you late?",
          "Why were you late?",
          "How were you late?",
        ],
      },
      {
        id: 6014,
        japanese: "彼は全く勉強しません。",
        correctAnswer: "He doesn't study at all.",
        explanation: "強い否定：not at all で「全く～ない」",
        choices: [
          "He studies not at all.",
          "He doesn't study at all.",
          "He not studies at all.",
          "He isn't study at all.",
        ],
      },
      {
        id: 6015,
        japanese: "誰もその答えを知りません。",
        correctAnswer: "Nobody knows the answer.",
        explanation: "nobody は否定の意味を含むので、動詞は肯定形を使います。",
        choices: [
          "Nobody don't know the answer.",
          "Nobody doesn't know the answer.",
          "Nobody knows the answer.",
          "Nobody not knows the answer.",
        ],
      },
    ],
    hard: [
      {
        id: 6021,
        japanese: "彼は何も言いませんでした。",
        correctAnswer: "He didn't say anything.",
        explanation: "否定文では something → anything に変わります。",
        choices: [
          "He didn't say something.",
          "He didn't say anything.",
          "He didn't say nothing.",
          "He said nothing.",
        ],
      },
      {
        id: 6022,
        japanese: "どちらの提案も採用されませんでした。",
        correctAnswer: "Neither proposal was adopted.",
        explanation: "neither は「どちらも～ない」を表し、単数扱いです。",
        choices: [
          "Neither proposals were adopted.",
          "Neither proposal was adopted.",
          "Both proposals weren't adopted.",
          "Either proposal wasn't adopted.",
        ],
      },
      {
        id: 6023,
        japanese: "彼らのうち誰も来ませんでした。",
        correctAnswer: "None of them came.",
        explanation: "none of は「～のうち誰も/何も～ない」を表します。",
        choices: [
          "No one of them came.",
          "None of them came.",
          "Nothing of them came.",
          "Nobody of them came.",
        ],
      },
      {
        id: 6024,
        japanese: "めったに映画を見ません。",
        correctAnswer: "I rarely watch movies.",
        explanation: "rarely は「めったに～ない」を表す副詞です。",
        choices: [
          "I don't rarely watch movies.",
          "I rarely watch movies.",
          "I rarely don't watch movies.",
          "I not rarely watch movies.",
        ],
      },
      {
        id: 6025,
        japanese: "決して諦めません。",
        correctAnswer: "I never give up.",
        explanation: "never は「決して～ない」を表し、否定の意味を含みます。",
        choices: [
          "I don't never give up.",
          "I never give up.",
          "I never don't give up.",
          "I not never give up.",
        ],
      },
    ],
  },

  // 前置詞（基本的なもののみ、詳細は後で追加）
  "prepositions": {
    easy: [
      {
        id: 7001,
        japanese: "私は学校（　）います。",
        correctAnswer: "I am at school.",
        explanation: "場所を表す at：建物や施設にいる場合",
        choices: [
          "I am in school.",
          "I am at school.",
          "I am on school.",
          "I am by school.",
        ],
      },
      {
        id: 7002,
        japanese: "本は机の（　）にあります。",
        correctAnswer: "The book is on the desk.",
        explanation: "表面に接触している場合は on を使います。",
        choices: [
          "The book is in the desk.",
          "The book is on the desk.",
          "The book is at the desk.",
          "The book is by the desk.",
        ],
      },
      {
        id: 7003,
        japanese: "私は朝（　）起きます。",
        correctAnswer: "I get up in the morning.",
        explanation: "時間帯（朝・昼・夜）には in を使います。",
        choices: [
          "I get up on the morning.",
          "I get up at the morning.",
          "I get up in the morning.",
          "I get up by the morning.",
        ],
      },
      {
        id: 7004,
        japanese: "会議は3時（　）始まります。",
        correctAnswer: "The meeting starts at 3 o'clock.",
        explanation: "具体的な時刻には at を使います。",
        choices: [
          "The meeting starts in 3 o'clock.",
          "The meeting starts on 3 o'clock.",
          "The meeting starts at 3 o'clock.",
          "The meeting starts by 3 o'clock.",
        ],
      },
      {
        id: 7005,
        japanese: "私は月曜日（　）働きます。",
        correctAnswer: "I work on Monday.",
        explanation: "曜日には on を使います。",
        choices: [
          "I work in Monday.",
          "I work at Monday.",
          "I work on Monday.",
          "I work by Monday.",
        ],
      },
    ],
    normal: [
      {
        id: 7011,
        japanese: "私は電車（　）通勤します。",
        correctAnswer: "I commute by train.",
        explanation: "交通手段には by を使います。",
        choices: [
          "I commute in train.",
          "I commute on train.",
          "I commute at train.",
          "I commute by train.",
        ],
      },
      {
        id: 7012,
        japanese: "彼は友達（　）パーティーに行きました。",
        correctAnswer: "He went to the party with his friend.",
        explanation: "同伴を表す場合は with を使います。",
        choices: [
          "He went to the party by his friend.",
          "He went to the party with his friend.",
          "He went to the party for his friend.",
          "He went to the party of his friend.",
        ],
      },
      {
        id: 7013,
        japanese: "その本は私（　）書かれました。",
        correctAnswer: "The book was written by me.",
        explanation: "受動態での行為者には by を使います。",
        choices: [
          "The book was written with me.",
          "The book was written by me.",
          "The book was written from me.",
          "The book was written of me.",
        ],
      },
      {
        id: 7014,
        japanese: "私は彼（　）手紙をもらいました。",
        correctAnswer: "I received a letter from him.",
        explanation: "起点・出所を表す場合は from を使います。",
        choices: [
          "I received a letter by him.",
          "I received a letter with him.",
          "I received a letter from him.",
          "I received a letter of him.",
        ],
      },
      {
        id: 7015,
        japanese: "私たちは成功（　）向けて努力しています。",
        correctAnswer: "We are working toward success.",
        explanation: "方向・目標を表す場合は toward を使います。",
        choices: [
          "We are working to success.",
          "We are working for success.",
          "We are working toward success.",
          "We are working at success.",
        ],
      },
    ],
    hard: [
      {
        id: 7021,
        japanese: "彼は困難（　）もかかわらず成功しました。",
        correctAnswer: "He succeeded despite the difficulties.",
        explanation: "despite は「～にもかかわらず」を表します。",
        choices: [
          "He succeeded although the difficulties.",
          "He succeeded despite the difficulties.",
          "He succeeded because of the difficulties.",
          "He succeeded due to the difficulties.",
        ],
      },
      {
        id: 7022,
        japanese: "雨（　）ため、試合は中止されました。",
        correctAnswer: "The game was canceled due to rain.",
        explanation: "due to は「～のため」を表します。",
        choices: [
          "The game was canceled because rain.",
          "The game was canceled due to rain.",
          "The game was canceled instead of rain.",
          "The game was canceled except for rain.",
        ],
      },
      {
        id: 7023,
        japanese: "彼女は健康（　）関して心配しています。",
        correctAnswer: "She is concerned about her health.",
        explanation: "about は「～について・～に関して」を表します。",
        choices: [
          "She is concerned of her health.",
          "She is concerned about her health.",
          "She is concerned for her health.",
          "She is concerned with her health.",
        ],
      },
      {
        id: 7024,
        japanese: "私は彼（　）代わりに会議に出席しました。",
        correctAnswer: "I attended the meeting instead of him.",
        explanation: "instead of は「～の代わりに」を表します。",
        choices: [
          "I attended the meeting except him.",
          "I attended the meeting besides him.",
          "I attended the meeting instead of him.",
          "I attended the meeting apart from him.",
        ],
      },
      {
        id: 7025,
        japanese: "私たちは予算（　）範囲内で計画しています。",
        correctAnswer: "We are planning within the budget.",
        explanation: "within は「～の範囲内で」を表します。",
        choices: [
          "We are planning inside the budget.",
          "We are planning within the budget.",
          "We are planning among the budget.",
          "We are planning between the budget.",
        ],
      },
    ],
  },

  // 接続詞
  "conjunctions": {
    easy: [
      {
        id: 8001,
        japanese: "私は本を読み、音楽を聞きます。",
        correctAnswer: "I read books and listen to music.",
        explanation: "and は「そして」を表し、同じ種類の文や語を結びます。",
        choices: [
          "I read books but listen to music.",
          "I read books and listen to music.",
          "I read books or listen to music.",
          "I read books so listen to music.",
        ],
      },
      {
        id: 8002,
        japanese: "私は疲れていますが、勉強します。",
        correctAnswer: "I am tired, but I will study.",
        explanation: "but は「しかし」を表し、対比や逆接を示します。",
        choices: [
          "I am tired, and I will study.",
          "I am tired, but I will study.",
          "I am tired, or I will study.",
          "I am tired, so I will study.",
        ],
      },
      {
        id: 8003,
        japanese: "雨が降っているので、家にいます。",
        correctAnswer: "It is raining, so I stay home.",
        explanation: "so は「だから」を表し、結果を示します。",
        choices: [
          "It is raining, and I stay home.",
          "It is raining, but I stay home.",
          "It is raining, or I stay home.",
          "It is raining, so I stay home.",
        ],
      },
      {
        id: 8004,
        japanese: "コーヒーまたは紅茶を飲みますか？",
        correctAnswer: "Do you drink coffee or tea?",
        explanation: "or は「または」を表し、選択を示します。",
        choices: [
          "Do you drink coffee and tea?",
          "Do you drink coffee or tea?",
          "Do you drink coffee but tea?",
          "Do you drink coffee so tea?",
        ],
      },
      {
        id: 8005,
        japanese: "忙しいので、手伝えません。",
        correctAnswer: "I am busy, so I can't help.",
        explanation: "because や so で理由と結果を表現できます。",
        choices: [
          "I am busy, and I can't help.",
          "I am busy, but I can't help.",
          "I am busy, or I can't help.",
          "I am busy, so I can't help.",
        ],
      },
    ],
    normal: [
      {
        id: 8011,
        japanese: "雨が降っているので、傘を持って行きます。",
        correctAnswer: "Because it is raining, I will take an umbrella.",
        explanation: "because は理由を表す従属接続詞です。",
        choices: [
          "Although it is raining, I will take an umbrella.",
          "Because it is raining, I will take an umbrella.",
          "Unless it is raining, I will take an umbrella.",
          "While it is raining, I will take an umbrella.",
        ],
      },
      {
        id: 8012,
        japanese: "疲れていましたが、最後まで頑張りました。",
        correctAnswer: "Although I was tired, I did my best until the end.",
        explanation: "although は「～だけれども」を表す従属接続詞です。",
        choices: [
          "Because I was tired, I did my best until the end.",
          "Although I was tired, I did my best until the end.",
          "Unless I was tired, I did my best until the end.",
          "Since I was tired, I did my best until the end.",
        ],
      },
      {
        id: 8013,
        japanese: "急がないと、遅刻します。",
        correctAnswer: "Unless you hurry, you will be late.",
        explanation: "unless は「～しなければ」を表す従属接続詞です。",
        choices: [
          "If you hurry, you will be late.",
          "Unless you hurry, you will be late.",
          "Although you hurry, you will be late.",
          "Because you hurry, you will be late.",
        ],
      },
      {
        id: 8014,
        japanese: "彼が来るまで待ちます。",
        correctAnswer: "I will wait until he comes.",
        explanation: "until は「～まで」を表す従属接続詞です。",
        choices: [
          "I will wait while he comes.",
          "I will wait until he comes.",
          "I will wait before he comes.",
          "I will wait after he comes.",
        ],
      },
      {
        id: 8015,
        japanese: "勉強している間、音楽を聞きます。",
        correctAnswer: "I listen to music while I study.",
        explanation: "while は「～している間」を表す従属接続詞です。",
        choices: [
          "I listen to music when I study.",
          "I listen to music while I study.",
          "I listen to music before I study.",
          "I listen to music after I study.",
        ],
      },
    ],
    hard: [
      {
        id: 8021,
        japanese: "努力したにもかかわらず、失敗しました。",
        correctAnswer: "Even though I tried hard, I failed.",
        explanation: "even though は強い逆接を表します。",
        choices: [
          "Even if I tried hard, I failed.",
          "Even though I tried hard, I failed.",
          "As if I tried hard, I failed.",
          "As though I tried hard, I failed.",
        ],
      },
      {
        id: 8022,
        japanese: "まるで夢のようでした。",
        correctAnswer: "It was as if it were a dream.",
        explanation: "as if は「まるで～のように」を表します。",
        choices: [
          "It was even if it were a dream.",
          "It was as if it were a dream.",
          "It was even though it were a dream.",
          "It was although it were a dream.",
        ],
      },
      {
        id: 8023,
        japanese: "雨が降る場合に備えて、傘を持参します。",
        correctAnswer: "I will bring an umbrella in case it rains.",
        explanation: "in case は「～の場合に備えて」を表します。",
        choices: [
          "I will bring an umbrella if it rains.",
          "I will bring an umbrella in case it rains.",
          "I will bring an umbrella unless it rains.",
          "I will bring an umbrella when it rains.",
        ],
      },
      {
        id: 8024,
        japanese: "彼が到着すると同時に、会議が始まりました。",
        correctAnswer: "The meeting started as soon as he arrived.",
        explanation: "as soon as は「～するとすぐに」を表します。",
        choices: [
          "The meeting started as long as he arrived.",
          "The meeting started as soon as he arrived.",
          "The meeting started as well as he arrived.",
          "The meeting started as far as he arrived.",
        ],
      },
      {
        id: 8025,
        japanese: "彼女が言ったことが正しいかどうか分かりません。",
        correctAnswer: "I don't know whether what she said is correct.",
        explanation: "whether は「～かどうか」を表す従属接続詞です。",
        choices: [
          "I don't know if what she said is correct.",
          "I don't know whether what she said is correct.",
          "I don't know that what she said is correct.",
          "I don't know when what she said is correct.",
        ],
      },
    ],
  },
};

/**
 * 基礎問題取得関数
 */
export function getFoundationQuestions(
  category: keyof FoundationQuestions,
  difficulty: "easy" | "normal" | "hard"
): QuestionData[] {
  return foundationQuestions[category]?.[difficulty] || [];
}
