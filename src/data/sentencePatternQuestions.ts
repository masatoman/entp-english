import { QuestionData } from "../components/Question";

/**
 * 文型別問題データ
 * 各文型に特化した問題を提供
 */

export interface SentencePatternQuestions {
  svo: Record<"easy" | "normal" | "hard", QuestionData[]>;
  sv: Record<"easy" | "normal" | "hard", QuestionData[]>;
  svc: Record<"easy" | "normal" | "hard", QuestionData[]>;
  svoo: Record<"easy" | "normal" | "hard", QuestionData[]>;
  svoc: Record<"easy" | "normal" | "hard", QuestionData[]>;
}

export const sentencePatternQuestions: SentencePatternQuestions = {
  // SVO文型 (主語 + 動詞 + 目的語)
  svo: {
    easy: [
      {
        id: 101,
        japanese: "私は本を読みます。",
        correctAnswer: "I read a book.",
        explanation: "SVO文型：主語(I) + 動詞(read) + 目的語(a book)",
        choices: [
          "I am reading a book.",
          "I read a book.",
          "I reads a book.",
          "I reading a book.",
        ],
      },
      {
        id: 102,
        japanese: "彼は英語を勉強します。",
        correctAnswer: "He studies English.",
        explanation: "三人称単数では動詞にsをつけます：studies",
        choices: [
          "He study English.",
          "He is study English.",
          "He studies English.",
          "He studying English.",
        ],
      },
      {
        id: 103,
        japanese: "私たちは音楽を聞きます。",
        correctAnswer: "We listen to music.",
        explanation: "listen to で「～を聞く」という意味になります",
        choices: [
          "We listen music.",
          "We listen to music.",
          "We are listen music.",
          "We listening music.",
        ],
      },
      {
        id: 104,
        japanese: "彼女は手紙を書きます。",
        correctAnswer: "She writes a letter.",
        explanation: "SVO文型：She(主語) + writes(動詞) + a letter(目的語)",
        choices: [
          "She write a letter.",
          "She is write a letter.",
          "She writing a letter.",
          "She writes a letter.",
        ],
      },
      {
        id: 105,
        japanese: "私は映画を見ます。",
        correctAnswer: "I watch a movie.",
        explanation: "watch は「見る」という意味の動詞です",
        choices: [
          "I see a movie.",
          "I look a movie.",
          "I watch a movie.",
          "I watching a movie.",
        ],
      },
    ],
    normal: [
      {
        id: 111,
        japanese: "彼は毎朝コーヒーを飲みます。",
        correctAnswer: "He drinks coffee every morning.",
        explanation: "習慣を表す現在形、三人称単数なのでdrinksにsが付きます",
        choices: [
          "He drink coffee every morning.",
          "He drinks coffee every morning.",
          "He is drinking coffee every morning.",
          "He drank coffee every morning.",
        ],
      },
      {
        id: 112,
        japanese: "私たちは新しい車を買いました。",
        correctAnswer: "We bought a new car.",
        explanation: "過去形：buy → bought（不規則動詞）",
        choices: [
          "We buy a new car.",
          "We buyed a new car.",
          "We bought a new car.",
          "We are buying a new car.",
        ],
      },
      {
        id: 113,
        japanese: "彼女は重要な決定を下しました。",
        correctAnswer: "She made an important decision.",
        explanation: "make a decision で「決定を下す」という熟語",
        choices: [
          "She took an important decision.",
          "She did an important decision.",
          "She made an important decision.",
          "She had an important decision.",
        ],
      },
      {
        id: 114,
        japanese: "私は昨日その本を読み終えました。",
        correctAnswer: "I finished reading the book yesterday.",
        explanation: "finish + 動名詞で「～し終える」",
        choices: [
          "I finished to read the book yesterday.",
          "I finished reading the book yesterday.",
          "I finished read the book yesterday.",
          "I was finished reading the book yesterday.",
        ],
      },
      {
        id: 115,
        japanese: "彼らは新しいプロジェクトを開始しました。",
        correctAnswer: "They started a new project.",
        explanation: "start は「始める」という意味の動詞",
        choices: [
          "They began a new project.",
          "They started a new project.",
          "They commenced a new project.",
          "They initiated a new project.",
        ],
      },
    ],
    hard: [
      {
        id: 121,
        japanese: "その会社は革新的な技術を開発しています。",
        correctAnswer: "The company is developing innovative technology.",
        explanation: "進行形で継続的な動作を表現",
        choices: [
          "The company develops innovative technology.",
          "The company is developing innovative technology.",
          "The company has developed innovative technology.",
          "The company will develop innovative technology.",
        ],
      },
      {
        id: 122,
        japanese: "私たちは困難な問題を解決しなければなりません。",
        correctAnswer: "We must solve difficult problems.",
        explanation: "助動詞must + 動詞の原形",
        choices: [
          "We must to solve difficult problems.",
          "We must solving difficult problems.",
          "We must solve difficult problems.",
          "We must solved difficult problems.",
        ],
      },
      {
        id: 123,
        japanese: "彼は複雑な理論を理解しました。",
        correctAnswer: "He understood the complex theory.",
        explanation: "understand の過去形は understood（不規則動詞）",
        choices: [
          "He understanded the complex theory.",
          "He understood the complex theory.",
          "He was understanding the complex theory.",
          "He has understand the complex theory.",
        ],
      },
      {
        id: 124,
        japanese: "研究者たちは新しい発見を発表しました。",
        correctAnswer: "The researchers announced a new discovery.",
        explanation: "announce は「発表する」という意味",
        choices: [
          "The researchers published a new discovery.",
          "The researchers announced a new discovery.",
          "The researchers declared a new discovery.",
          "The researchers revealed a new discovery.",
        ],
      },
      {
        id: 125,
        japanese: "政府は新しい政策を実施しています。",
        correctAnswer: "The government is implementing new policies.",
        explanation: "implement は「実施する」という意味",
        choices: [
          "The government is executing new policies.",
          "The government is implementing new policies.",
          "The government is applying new policies.",
          "The government is enforcing new policies.",
        ],
      },
    ],
  },

  // SV文型 (主語 + 動詞)
  sv: {
    easy: [
      {
        id: 201,
        japanese: "私は眠ります。",
        correctAnswer: "I sleep.",
        explanation: "SV文型：主語(I) + 動詞(sleep)。目的語は不要です。",
        choices: ["I am sleep.", "I sleep.", "I sleeping.", "I sleeps."],
      },
      {
        id: 202,
        japanese: "鳥が飛びます。",
        correctAnswer: "Birds fly.",
        explanation: "複数形なのでflyにsは付きません",
        choices: [
          "Birds flies.",
          "Birds are fly.",
          "Birds fly.",
          "Birds flying.",
        ],
      },
      {
        id: 203,
        japanese: "太陽が輝いています。",
        correctAnswer: "The sun shines.",
        explanation: "三人称単数なのでshinesにsが付きます",
        choices: [
          "The sun shine.",
          "The sun is shine.",
          "The sun shines.",
          "The sun shining.",
        ],
      },
      {
        id: 204,
        japanese: "子供たちが笑います。",
        correctAnswer: "Children laugh.",
        explanation: "複数形なので動詞は原形のまま",
        choices: [
          "Children laughs.",
          "Children are laugh.",
          "Children laugh.",
          "Children laughing.",
        ],
      },
      {
        id: 205,
        japanese: "雨が降ります。",
        correctAnswer: "It rains.",
        explanation: "天候のitは三人称単数扱い",
        choices: ["It rain.", "It is rain.", "It rains.", "It raining."],
      },
    ],
    normal: [
      {
        id: 211,
        japanese: "彼は毎朝走ります。",
        correctAnswer: "He runs every morning.",
        explanation: "習慣を表す現在形、三人称単数でrunsにsが付く",
        choices: [
          "He run every morning.",
          "He runs every morning.",
          "He is running every morning.",
          "He ran every morning.",
        ],
      },
      {
        id: 212,
        japanese: "会議は明日始まります。",
        correctAnswer: "The meeting starts tomorrow.",
        explanation: "未来を表す現在形、三人称単数でstartsにsが付く",
        choices: [
          "The meeting start tomorrow.",
          "The meeting starts tomorrow.",
          "The meeting will starting tomorrow.",
          "The meeting is start tomorrow.",
        ],
      },
      {
        id: 213,
        japanese: "私たちは昨日到着しました。",
        correctAnswer: "We arrived yesterday.",
        explanation: "過去形：arrive → arrived",
        choices: [
          "We arrive yesterday.",
          "We arrived yesterday.",
          "We are arriving yesterday.",
          "We have arrived yesterday.",
        ],
      },
      {
        id: 214,
        japanese: "彼女は美しく微笑みました。",
        correctAnswer: "She smiled beautifully.",
        explanation: "副詞beautifullyで動詞を修飾",
        choices: [
          "She smiled beautiful.",
          "She smiled beautifully.",
          "She beautiful smiled.",
          "She was smiled beautifully.",
        ],
      },
      {
        id: 215,
        japanese: "時間が経過しています。",
        correctAnswer: "Time is passing.",
        explanation: "進行形で継続的な動作を表現",
        choices: [
          "Time passes.",
          "Time is passing.",
          "Time has passed.",
          "Time will pass.",
        ],
      },
    ],
    hard: [
      {
        id: 221,
        japanese: "経済が急速に成長しています。",
        correctAnswer: "The economy is growing rapidly.",
        explanation: "進行形で継続的な変化を表現、副詞rapidlyで修飾",
        choices: [
          "The economy grows rapidly.",
          "The economy is growing rapidly.",
          "The economy has grown rapidly.",
          "The economy grew rapidly.",
        ],
      },
      {
        id: 222,
        japanese: "技術は絶えず進歩しています。",
        correctAnswer: "Technology is constantly evolving.",
        explanation: "進行形 + 副詞constantlyで継続性を強調",
        choices: [
          "Technology constantly evolves.",
          "Technology is constantly evolving.",
          "Technology has constantly evolved.",
          "Technology will constantly evolve.",
        ],
      },
      {
        id: 223,
        japanese: "人口は着実に増加しています。",
        correctAnswer: "The population is steadily increasing.",
        explanation: "進行形で継続的な増加を表現",
        choices: [
          "The population steadily increases.",
          "The population is steadily increasing.",
          "The population has steadily increased.",
          "The population will steadily increase.",
        ],
      },
      {
        id: 224,
        japanese: "市場は予想通りに反応しました。",
        correctAnswer: "The market reacted as expected.",
        explanation: "as expected で「予想通りに」",
        choices: [
          "The market reacted as expecting.",
          "The market reacted as expected.",
          "The market was reacted as expected.",
          "The market has reacted as expected.",
        ],
      },
      {
        id: 225,
        japanese: "議論は激しく続いています。",
        correctAnswer: "The debate continues intensely.",
        explanation: "副詞intenselyで動詞を修飾",
        choices: [
          "The debate continues intense.",
          "The debate continues intensely.",
          "The debate is continues intensely.",
          "The debate continuing intensely.",
        ],
      },
    ],
  },

  // SVC文型 (主語 + 動詞 + 補語)
  svc: {
    easy: [
      {
        id: 301,
        japanese: "私は学生です。",
        correctAnswer: "I am a student.",
        explanation: "SVC文型：主語(I) + be動詞(am) + 補語(a student)",
        choices: [
          "I am student.",
          "I am a student.",
          "I was a student.",
          "I'm the student.",
        ],
      },
      {
        id: 302,
        japanese: "彼は医者です。",
        correctAnswer: "He is a doctor.",
        explanation: "三人称単数の主語にはisを使います",
        choices: [
          "He are a doctor.",
          "He was a doctor.",
          "He is a doctor.",
          "He am a doctor.",
        ],
      },
      {
        id: 303,
        japanese: "私たちは友達です。",
        correctAnswer: "We are friends.",
        explanation: "複数の主語にはareを使います",
        choices: [
          "We is friends.",
          "We were friends.",
          "We am friends.",
          "We are friends.",
        ],
      },
      {
        id: 304,
        japanese: "彼女は忙しいです。",
        correctAnswer: "She is busy.",
        explanation: "形容詞busyが補語になります",
        choices: [
          "She busy.",
          "She has busy.",
          "She is busy.",
          "She are busy.",
        ],
      },
      {
        id: 305,
        japanese: "この本は面白いです。",
        correctAnswer: "This book is interesting.",
        explanation: "形容詞interestingが補語",
        choices: [
          "This book interesting.",
          "This book is interested.",
          "This book is interesting.",
          "This book are interesting.",
        ],
      },
    ],
    normal: [
      {
        id: 311,
        japanese: "彼は有名な作家になりました。",
        correctAnswer: "He became a famous writer.",
        explanation: "becameは「なる」を表すSVC文型の動詞",
        choices: [
          "He turned a famous writer.",
          "He became a famous writer.",
          "He got a famous writer.",
          "He made a famous writer.",
        ],
      },
      {
        id: 312,
        japanese: "この料理は美味しそうに見えます。",
        correctAnswer: "This dish looks delicious.",
        explanation: "looksは「～に見える」を表すSVC文型の動詞",
        choices: [
          "This dish seems delicious.",
          "This dish appears delicious.",
          "This dish looks delicious.",
          "This dish sounds delicious.",
        ],
      },
      {
        id: 313,
        japanese: "天気は暖かくなってきました。",
        correctAnswer: "The weather is getting warm.",
        explanation: "get + 形容詞で「～になる」",
        choices: [
          "The weather is becoming warm.",
          "The weather is getting warm.",
          "The weather is turning warm.",
          "The weather is growing warm.",
        ],
      },
      {
        id: 314,
        japanese: "彼女は幸せそうに見えます。",
        correctAnswer: "She looks happy.",
        explanation: "look + 形容詞で「～に見える」",
        choices: [
          "She looks happily.",
          "She looks happy.",
          "She is looking happy.",
          "She looked happy.",
        ],
      },
      {
        id: 315,
        japanese: "このアイデアは素晴らしく思えます。",
        correctAnswer: "This idea seems wonderful.",
        explanation: "seem + 形容詞で「～に思える」",
        choices: [
          "This idea seems wonderfully.",
          "This idea seems wonderful.",
          "This idea is seeming wonderful.",
          "This idea seemed wonderful.",
        ],
      },
    ],
    hard: [
      {
        id: 321,
        japanese: "彼の提案は非常に革新的に思われます。",
        correctAnswer: "His proposal seems very innovative.",
        explanation: "seem + 形容詞、副詞veryで強調",
        choices: [
          "His proposal appears very innovative.",
          "His proposal seems very innovative.",
          "His proposal looks very innovative.",
          "His proposal sounds very innovative.",
        ],
      },
      {
        id: 322,
        japanese: "この問題は複雑になってきています。",
        correctAnswer: "This problem is becoming complicated.",
        explanation: "become + 形容詞で変化を表現",
        choices: [
          "This problem is getting complicated.",
          "This problem is becoming complicated.",
          "This problem is turning complicated.",
          "This problem is growing complicated.",
        ],
      },
      {
        id: 323,
        japanese: "その理論は説得力があるように聞こえます。",
        correctAnswer: "The theory sounds convincing.",
        explanation: "sound + 形容詞で「～に聞こえる」",
        choices: [
          "The theory sounds convincingly.",
          "The theory sounds convincing.",
          "The theory is sounding convincing.",
          "The theory sounded convincing.",
        ],
      },
      {
        id: 324,
        japanese: "市場の状況は不安定なままです。",
        correctAnswer: "Market conditions remain unstable.",
        explanation: "remain + 形容詞で「～のままである」",
        choices: [
          "Market conditions stay unstable.",
          "Market conditions remain unstable.",
          "Market conditions keep unstable.",
          "Market conditions continue unstable.",
        ],
      },
      {
        id: 325,
        japanese: "その決定は適切であることが判明しました。",
        correctAnswer: "The decision proved appropriate.",
        explanation: "prove + 形容詞で「～であることが分かる」",
        choices: [
          "The decision turned out appropriate.",
          "The decision proved appropriate.",
          "The decision became appropriate.",
          "The decision appeared appropriate.",
        ],
      },
    ],
  },

  // SVOO文型 (主語 + 動詞 + 間接目的語 + 直接目的語)
  svoo: {
    easy: [
      {
        id: 401,
        japanese: "私は彼に本を渡しました。",
        correctAnswer: "I gave him a book.",
        explanation:
          "SVOO文型：I(主語) + gave(動詞) + him(間接目的語) + a book(直接目的語)",
        choices: [
          "I gave a book him.",
          "I gave him a book.",
          "I gave to him a book.",
          "I give him a book.",
        ],
      },
      {
        id: 402,
        japanese: "彼女は私に手紙を送りました。",
        correctAnswer: "She sent me a letter.",
        explanation: "send + 人 + 物の語順",
        choices: [
          "She sent a letter me.",
          "She sent to me a letter.",
          "She sent me a letter.",
          "She send me a letter.",
        ],
      },
      {
        id: 403,
        japanese: "先生は私たちに宿題を出しました。",
        correctAnswer: "The teacher gave us homework.",
        explanation: "give + 人 + 物の語順",
        choices: [
          "The teacher gave homework us.",
          "The teacher gave us homework.",
          "The teacher gave to us homework.",
          "The teacher give us homework.",
        ],
      },
      {
        id: 404,
        japanese: "私は友達にプレゼントを買いました。",
        correctAnswer: "I bought my friend a present.",
        explanation: "buy + 人 + 物の語順",
        choices: [
          "I bought a present my friend.",
          "I bought my friend a present.",
          "I bought to my friend a present.",
          "I buy my friend a present.",
        ],
      },
      {
        id: 405,
        japanese: "母は私にお金をくれました。",
        correctAnswer: "My mother gave me money.",
        explanation: "give + 人 + 物の基本パターン",
        choices: [
          "My mother gave money me.",
          "My mother gave me money.",
          "My mother gave to me money.",
          "My mother give me money.",
        ],
      },
    ],
    normal: [
      {
        id: 411,
        japanese: "彼は私に重要な情報を教えてくれました。",
        correctAnswer: "He told me important information.",
        explanation: "tell + 人 + 物の語順",
        choices: [
          "He told important information me.",
          "He told me important information.",
          "He told to me important information.",
          "He tells me important information.",
        ],
      },
      {
        id: 412,
        japanese: "会社は従業員にボーナスを支払いました。",
        correctAnswer: "The company paid employees bonuses.",
        explanation: "pay + 人 + 物の語順",
        choices: [
          "The company paid bonuses employees.",
          "The company paid employees bonuses.",
          "The company paid to employees bonuses.",
          "The company pays employees bonuses.",
        ],
      },
      {
        id: 413,
        japanese: "彼女は子供たちに物語を読んでくれました。",
        correctAnswer: "She read the children a story.",
        explanation: "read + 人 + 物の語順",
        choices: [
          "She read a story the children.",
          "She read the children a story.",
          "She read to the children a story.",
          "She reads the children a story.",
        ],
      },
      {
        id: 414,
        japanese: "私は彼にアドバイスを提供しました。",
        correctAnswer: "I offered him advice.",
        explanation: "offer + 人 + 物の語順",
        choices: [
          "I offered advice him.",
          "I offered him advice.",
          "I offered to him advice.",
          "I offer him advice.",
        ],
      },
      {
        id: 415,
        japanese: "彼らは私たちに機会を与えてくれました。",
        correctAnswer: "They gave us an opportunity.",
        explanation: "give + 人 + 物、機会はopportunity",
        choices: [
          "They gave an opportunity us.",
          "They gave us an opportunity.",
          "They gave to us an opportunity.",
          "They give us an opportunity.",
        ],
      },
    ],
    hard: [
      {
        id: 421,
        japanese: "政府は市民に新しい政策を説明しました。",
        correctAnswer: "The government explained the new policy to citizens.",
        explanation: "explainは通常explain + 物 + to + 人の語順を使います",
        choices: [
          "The government explained citizens the new policy.",
          "The government explained the new policy to citizens.",
          "The government explained to citizens the new policy.",
          "The government explains the new policy to citizens.",
        ],
      },
      {
        id: 422,
        japanese: "専門家は私たちに貴重な洞察を提供しました。",
        correctAnswer: "The expert provided us with valuable insights.",
        explanation: "provide + 人 + with + 物の語順",
        choices: [
          "The expert provided valuable insights us.",
          "The expert provided us valuable insights.",
          "The expert provided us with valuable insights.",
          "The expert provides us with valuable insights.",
        ],
      },
      {
        id: 423,
        japanese: "大学は学生に奨学金を授与しました。",
        correctAnswer: "The university awarded students scholarships.",
        explanation: "award + 人 + 物の語順",
        choices: [
          "The university awarded scholarships students.",
          "The university awarded students scholarships.",
          "The university awarded to students scholarships.",
          "The university awards students scholarships.",
        ],
      },
      {
        id: 424,
        japanese: "研究者は同僚に発見を報告しました。",
        correctAnswer: "The researcher reported the discovery to colleagues.",
        explanation: "reportは通常report + 物 + to + 人の語順",
        choices: [
          "The researcher reported colleagues the discovery.",
          "The researcher reported the discovery to colleagues.",
          "The researcher reported to colleagues the discovery.",
          "The researcher reports the discovery to colleagues.",
        ],
      },
      {
        id: 425,
        japanese: "組織は参加者に証明書を発行しました。",
        correctAnswer: "The organization issued participants certificates.",
        explanation: "issue + 人 + 物の語順",
        choices: [
          "The organization issued certificates participants.",
          "The organization issued participants certificates.",
          "The organization issued to participants certificates.",
          "The organization issues participants certificates.",
        ],
      },
    ],
  },

  // SVOC文型 (主語 + 動詞 + 目的語 + 補語)
  svoc: {
    easy: [
      {
        id: 501,
        japanese: "私たちは彼をトムと呼びます。",
        correctAnswer: "We call him Tom.",
        explanation:
          "SVOC文型：We(主語) + call(動詞) + him(目的語) + Tom(補語)",
        choices: [
          "We call him as Tom.",
          "We call him Tom.",
          "We call to him Tom.",
          "We calls him Tom.",
        ],
      },
      {
        id: 502,
        japanese: "彼女は部屋をきれいにしました。",
        correctAnswer: "She made the room clean.",
        explanation: "make + 目的語 + 形容詞（補語）",
        choices: [
          "She made the room to clean.",
          "She made the room clean.",
          "She made clean the room.",
          "She make the room clean.",
        ],
      },
      {
        id: 503,
        japanese: "私は窓を開けたままにしました。",
        correctAnswer: "I left the window open.",
        explanation: "leave + 目的語 + 形容詞（補語）",
        choices: [
          "I left the window to open.",
          "I left open the window.",
          "I left the window open.",
          "I leave the window open.",
        ],
      },
      {
        id: 504,
        japanese: "彼らは私を幸せにしてくれました。",
        correctAnswer: "They made me happy.",
        explanation: "make + 目的語 + 形容詞（補語）",
        choices: [
          "They made me to happy.",
          "They made me happily.",
          "They made me happy.",
          "They make me happy.",
        ],
      },
      {
        id: 505,
        japanese: "私は犬をペットと考えています。",
        correctAnswer: "I consider the dog a pet.",
        explanation: "consider + 目的語 + 名詞（補語）",
        choices: [
          "I consider the dog as a pet.",
          "I consider the dog a pet.",
          "I consider to the dog a pet.",
          "I considers the dog a pet.",
        ],
      },
    ],
    normal: [
      {
        id: 511,
        japanese: "彼女は髪を短く切りました。",
        correctAnswer: "She had her hair cut short.",
        explanation: "have + 目的語 + 過去分詞（補語）",
        choices: [
          "She cut her hair short.",
          "She had her hair cut short.",
          "She had her hair to cut short.",
          "She has her hair cut short.",
        ],
      },
      {
        id: 512,
        japanese: "私は彼を信頼できる人だと思います。",
        correctAnswer: "I consider him trustworthy.",
        explanation: "consider + 目的語 + 形容詞（補語）",
        choices: [
          "I consider him as trustworthy.",
          "I consider him trustworthy.",
          "I consider him to trustworthy.",
          "I considers him trustworthy.",
        ],
      },
      {
        id: 513,
        japanese: "その知らせは私たちを驚かせました。",
        correctAnswer: "The news made us surprised.",
        explanation: "make + 目的語 + 過去分詞（補語）",
        choices: [
          "The news made us surprise.",
          "The news made us surprising.",
          "The news made us surprised.",
          "The news make us surprised.",
        ],
      },
      {
        id: 514,
        japanese: "私は彼女を最高の候補者だと見なしています。",
        correctAnswer: "I regard her as the best candidate.",
        explanation: "regard + 目的語 + as + 名詞（補語）",
        choices: [
          "I regard her the best candidate.",
          "I regard her as the best candidate.",
          "I regard her to the best candidate.",
          "I regards her as the best candidate.",
        ],
      },
      {
        id: 515,
        japanese: "彼らは私を責任者に任命しました。",
        correctAnswer: "They appointed me manager.",
        explanation: "appoint + 目的語 + 名詞（補語）",
        choices: [
          "They appointed me as manager.",
          "They appointed me manager.",
          "They appointed me to manager.",
          "They appoint me manager.",
        ],
      },
    ],
    hard: [
      {
        id: 521,
        japanese: "委員会は彼を新しいリーダーに選出しました。",
        correctAnswer: "The committee elected him the new leader.",
        explanation: "elect + 目的語 + 名詞（補語）",
        choices: [
          "The committee elected him as the new leader.",
          "The committee elected him the new leader.",
          "The committee elected him to the new leader.",
          "The committee elects him the new leader.",
        ],
      },
      {
        id: 522,
        japanese: "その経験は彼をより強い人にしました。",
        correctAnswer: "The experience made him a stronger person.",
        explanation: "make + 目的語 + 名詞（補語）",
        choices: [
          "The experience made him stronger person.",
          "The experience made him a stronger person.",
          "The experience made him to a stronger person.",
          "The experience makes him a stronger person.",
        ],
      },
      {
        id: 523,
        japanese: "私たちは彼の提案を実行可能だと判断しました。",
        correctAnswer: "We judged his proposal feasible.",
        explanation: "judge + 目的語 + 形容詞（補語）",
        choices: [
          "We judged his proposal as feasible.",
          "We judged his proposal feasible.",
          "We judged his proposal to feasible.",
          "We judge his proposal feasible.",
        ],
      },
      {
        id: 524,
        japanese: "取締役会は彼をCEOに昇進させました。",
        correctAnswer: "The board promoted him to CEO.",
        explanation: "promote + 目的語 + to + 名詞",
        choices: [
          "The board promoted him CEO.",
          "The board promoted him as CEO.",
          "The board promoted him to CEO.",
          "The board promotes him to CEO.",
        ],
      },
      {
        id: 525,
        japanese: "研究結果は私たちの理論を正しいと証明しました。",
        correctAnswer: "The research proved our theory correct.",
        explanation: "prove + 目的語 + 形容詞（補語）",
        choices: [
          "The research proved our theory as correct.",
          "The research proved our theory correct.",
          "The research proved our theory to correct.",
          "The research proves our theory correct.",
        ],
      },
    ],
  },
};
