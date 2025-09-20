import { QuestionData } from "../components/Question";
import { Category } from "../types";

export const questionsByCategory: Record<Category, Record<'easy' | 'normal' | 'hard', QuestionData[]>> = {
  'basic-grammar': {
    easy: [
      {
        id: 1,
        japanese: "私は学生です。",
        correctAnswer: "I am a student.",
        explanation: "「私は～です」は \"I am ~\" で表現します。",
        choices: ["I am a student.", "I am student.", "I'm the student.", "I was a student."]
      },
      {
        id: 2,
        japanese: "彼は医者です。",
        correctAnswer: "He is a doctor.",
        explanation: "三人称単数の主語には \"is\" を使います。",
        choices: ["He is a doctor.", "He are a doctor.", "He am a doctor.", "He was a doctor."]
      },
      {
        id: 3,
        japanese: "私たちは友達です。",
        correctAnswer: "We are friends.",
        explanation: "複数の主語には \"are\" を使います。",
        choices: ["We are friends.", "We is friends.", "We am friends.", "We were friends."]
      },
      {
        id: 4,
        japanese: "彼女は忙しいです。",
        correctAnswer: "She is busy.",
        explanation: "形容詞を使った文では be動詞が必要です。",
        choices: ["She is busy.", "She busy.", "She are busy.", "She has busy."]
      },
      {
        id: 5,
        japanese: "私は本を読みます。",
        correctAnswer: "I read a book.",
        explanation: "一般動詞の現在形では、一人称は動詞の原形を使います。",
        choices: ["I read a book.", "I reads a book.", "I am read a book.", "I reading a book."]
      }
    ],
    normal: [
      {
        id: 11,
        japanese: "私は毎日学校に歩いて行きます。",
        correctAnswer: "I walk to school every day.",
        explanation: "習慣を表す現在形では、副詞句で時間を表現します。",
        hint: "walk, school, every day"
      },
      {
        id: 12,
        japanese: "彼女は先生になりたがっています。",
        correctAnswer: "She wants to be a teacher.",
        explanation: "\"want to + 動詞\" で「～したい」を表現します。",
        hint: "wants, to be, teacher"
      },
      {
        id: 13,
        japanese: "私たちの学校にはたくさんの生徒がいます。",
        correctAnswer: "There are many students in our school.",
        explanation: "存在を表す \"There are\" を使い、複数形に注意します。",
        hint: "There are, many students, our school"
      },
      {
        id: 14,
        japanese: "その問題はとても難しくありません。",
        correctAnswer: "The problem is not very difficult.",
        explanation: "be動詞の否定形は \"is not\" または \"isn't\" を使います。",
        hint: "problem, is not, very difficult"
      },
      {
        id: 15,
        japanese: "彼は英語と数学を勉強しています。",
        correctAnswer: "He studies English and math.",
        explanation: "三人称単数の現在形では \"studies\" (y→ies) となります。",
        hint: "studies, English, math"
      }
    ],
    hard: [
      {
        id: 21,
        japanese: "彼が成功する理由は、常に努力を怠らないことです。",
        correctAnswer: "The reason why he succeeds is that he never stops making efforts.",
        explanation: "\"The reason why ~ is that...\" で理由を強調する構文です。"
      },
      {
        id: 22,
        japanese: "私たちの町には古い伝統を大切にする人々がたくさんいます。",
        correctAnswer: "There are many people in our town who cherish old traditions.",
        explanation: "\"There are + 名詞 + 関係代名詞\" の構文で存在と修飾を同時に表現します。"
      },
      {
        id: 23,
        japanese: "彼女の笑顔は見る人すべてを幸せな気持ちにします。",
        correctAnswer: "Her smile makes everyone who sees it feel happy.",
        explanation: "\"make + 人 + 動詞\" で「人に～させる」を表現します。"
      },
      {
        id: 24,
        japanese: "この店で働くスタッフは皆親切で、お客様に丁寧に対応します。",
        correctAnswer: "All the staff who work at this store are kind and treat customers politely.",
        explanation: "関係代名詞と副詞を使って複雑な文を構成しています。"
      },
      {
        id: 25,
        japanese: "私が毎朝することは、新聞を読んで世界のニュースを知ることです。",
        correctAnswer: "What I do every morning is read the newspaper and learn about world news.",
        explanation: "\"What I do is ~\" という構文で行動の内容を強調します。"
      }
    ]
  },
  'tenses': {
    easy: [
      {
        id: 31,
        japanese: "私は昨日映画を見ました。",
        correctAnswer: "I watched a movie yesterday.",
        explanation: "過去のことは過去形を使います。\"watch\" の過去形は \"watched\" です。",
        choices: ["I watched a movie yesterday.", "I watch a movie yesterday.", "I am watching a movie yesterday.", "I have watched a movie yesterday."]
      },
      {
        id: 32,
        japanese: "彼女は明日東京に行きます。",
        correctAnswer: "She will go to Tokyo tomorrow.",
        explanation: "未来のことは \"will + 動詞の原形\" で表現します。",
        choices: ["She will go to Tokyo tomorrow.", "She goes to Tokyo tomorrow.", "She went to Tokyo tomorrow.", "She is going to Tokyo tomorrow."]
      },
      {
        id: 33,
        japanese: "私たちは今テレビを見ています。",
        correctAnswer: "We are watching TV now.",
        explanation: "現在進行形は \"be動詞 + 動詞のing形\" で表現します。",
        choices: ["We are watching TV now.", "We watch TV now.", "We watched TV now.", "We will watch TV now."]
      },
      {
        id: 34,
        japanese: "彼は今朝早く起きました。",
        correctAnswer: "He got up early this morning.",
        explanation: "\"get up\" の過去形は \"got up\" です。",
        choices: ["He got up early this morning.", "He gets up early this morning.", "He is getting up early this morning.", "He will get up early this morning."]
      },
      {
        id: 35,
        japanese: "私は来週友達に会う予定です。",
        correctAnswer: "I will meet my friend next week.",
        explanation: "未来の予定は \"will\" で表現できます。",
        choices: ["I will meet my friend next week.", "I meet my friend next week.", "I met my friend next week.", "I am meeting my friend next week."]
      }
    ],
    normal: [
      {
        id: 41,
        japanese: "私は3年間英語を勉強しています。",
        correctAnswer: "I have been studying English for three years.",
        explanation: "継続を表す現在完了進行形を使います。期間は \"for\" で表現します。",
        hint: "have been studying, English, three years"
      },
      {
        id: 42,
        japanese: "彼は先週からずっと忙しくしています。",
        correctAnswer: "He has been busy since last week.",
        explanation: "開始点からの継続は \"since\" を使います。",
        hint: "has been busy, since, last week"
      },
      {
        id: 43,
        japanese: "私たちがそこに着いたとき、雨が降り始めました。",
        correctAnswer: "When we arrived there, it started to rain.",
        explanation: "時を表す副詞節では過去形を使います。",
        hint: "when, arrived, started, rain"
      },
      {
        id: 44,
        japanese: "彼女は今までに多くの国を訪れたことがあります。",
        correctAnswer: "She has visited many countries so far.",
        explanation: "経験を表す現在完了形を使います。",
        hint: "has visited, many countries, so far"
      },
      {
        id: 45,
        japanese: "私は明日の今頃、飛行機の中にいるでしょう。",
        correctAnswer: "I will be on a plane at this time tomorrow.",
        explanation: "未来のある時点での状態は未来進行形を使います。",
        hint: "will be, plane, this time tomorrow"
      }
    ],
    hard: [
      {
        id: 51,
        japanese: "彼が到着するまでに、私たちはすべての準備を終えているでしょう。",
        correctAnswer: "By the time he arrives, we will have finished all the preparations.",
        explanation: "\"By the time\" は時を表す副詞節で、未来完了と組み合わせます。"
      },
      {
        id: 52,
        japanese: "もし昨日雨が降らなかったら、私たちはピクニックに行ったでしょう。",
        correctAnswer: "If it had not rained yesterday, we would have gone on a picnic.",
        explanation: "仮定法過去完了で、過去の事実と反対の仮定を表現します。"
      },
      {
        id: 53,
        japanese: "彼女は会議が始まる前に、すでに資料を準備していました。",
        correctAnswer: "She had already prepared the materials before the meeting started.",
        explanation: "過去完了形で、過去のある時点より前の完了を表現します。"
      },
      {
        id: 54,
        japanese: "私が子供の頃は、毎年夏に祖父母の家を訪れていました。",
        correctAnswer: "When I was a child, I used to visit my grandparents' house every summer.",
        explanation: "\"used to\" で過去の習慣を表現します。"
      },
      {
        id: 55,
        japanese: "来週の今頃、私たちは新しいオフィスで働いているでしょう。",
        correctAnswer: "This time next week, we will be working in our new office.",
        explanation: "未来進行形で、未来のある時点での進行中の動作を表現します。"
      }
    ]
  },
  'modals': {
    easy: [
      {
        id: 61,
        japanese: "私は泳ぐことができます。",
        correctAnswer: "I can swim.",
        explanation: "能力を表すときは \"can\" を使います。",
        choices: ["I can swim.", "I can to swim.", "I can swimming.", "I am can swim."]
      },
      {
        id: 62,
        japanese: "あなたは日本語を話すことができますか？",
        correctAnswer: "Can you speak Japanese?",
        explanation: "能力について質問するときは \"Can you...?\" を使います。",
        choices: ["Can you speak Japanese?", "Do you can speak Japanese?", "Are you can speak Japanese?", "You can speak Japanese?"]
      },
      {
        id: 63,
        japanese: "私は車を運転することができません。",
        correctAnswer: "I cannot drive a car.",
        explanation: "否定形は \"cannot\" または \"can't\" を使います。",
        choices: ["I cannot drive a car.", "I can not drive a car.", "I don't can drive a car.", "I am not can drive a car."]
      },
      {
        id: 64,
        japanese: "彼女は歌うことができます。",
        correctAnswer: "She can sing.",
        explanation: "三人称単数でも \"can\" の形は変わりません。",
        choices: ["She can sing.", "She cans sing.", "She can to sing.", "She can singing."]
      },
      {
        id: 65,
        japanese: "私たちは英語を話すことができます。",
        correctAnswer: "We can speak English.",
        explanation: "複数の主語でも \"can\" の形は変わりません。",
        choices: ["We can speak English.", "We cans speak English.", "We can to speak English.", "We are can speak English."]
      }
    ],
    normal: [
      {
        id: 71,
        japanese: "私は明日までにレポートを提出しなければなりません。",
        correctAnswer: "I have to submit my report by tomorrow.",
        explanation: "外部からの義務は \"have to\" を使うことが多いです。",
        hint: "have to submit, report, by tomorrow"
      },
      {
        id: 72,
        japanese: "あなたは医者に診てもらうべきです。",
        correctAnswer: "You should see a doctor.",
        explanation: "アドバイスや推奨には \"should\" を使います。",
        hint: "should see, doctor"
      },
      {
        id: 73,
        japanese: "私は昨日早く寝るべきでした。",
        correctAnswer: "I should have gone to bed early yesterday.",
        explanation: "過去にすべきだったことは \"should have + 過去分詞\" で表現します。",
        hint: "should have gone, bed early, yesterday"
      },
      {
        id: 74,
        japanese: "彼は今頃家に着いているはずです。",
        correctAnswer: "He must have arrived home by now.",
        explanation: "過去の推測は \"must have + 過去分詞\" を使います。",
        hint: "must have arrived, home, by now"
      },
      {
        id: 75,
        japanese: "私は宿題をしなくてもよいですか？",
        correctAnswer: "Do I have to do my homework?",
        explanation: "義務について質問するときは \"Do I have to...?\" を使います。",
        hint: "Do I have to, homework"
      }
    ],
    hard: [
      {
        id: 81,
        japanese: "彼は約束を守ったはずなのに、来ませんでした。",
        correctAnswer: "He should have kept his promise, but he didn't come.",
        explanation: "\"should have + 過去分詞\" で過去にすべきだったことを表現します。"
      },
      {
        id: 82,
        japanese: "もし彼が真実を話していたなら、問題は起こらなかったでしょう。",
        correctAnswer: "If he had told the truth, the problem would not have occurred.",
        explanation: "仮定法過去完了では、条件節に \"had + 過去分詞\"、結果節に \"would have + 過去分詞\" を使います。"
      },
      {
        id: 83,
        japanese: "あなたは昨日そんなに遅くまで働く必要はありませんでした。",
        correctAnswer: "You didn't need to work so late yesterday.",
        explanation: "過去の不必要性は \"didn't need to\" で表現します。"
      },
      {
        id: 84,
        japanese: "彼女は今頃パリに着いているかもしれません。",
        correctAnswer: "She may have arrived in Paris by now.",
        explanation: "過去の可能性は \"may have + 過去分詞\" で表現します。"
      },
      {
        id: 85,
        japanese: "私たちはもっと早く出発するべきでした。",
        correctAnswer: "We should have left earlier.",
        explanation: "過去の後悔や批判は \"should have + 過去分詞\" で表現します。"
      }
    ]
  },
  'passive': {
    easy: [
      {
        id: 91,
        japanese: "この本は多くの人に読まれています。",
        correctAnswer: "This book is read by many people.",
        explanation: "受動態は \"be動詞 + 過去分詞\" で作ります。",
        choices: ["This book is read by many people.", "This book reads by many people.", "This book is reading by many people.", "This book was read by many people."]
      },
      {
        id: 92,
        japanese: "英語は世界中で話されています。",
        correctAnswer: "English is spoken all over the world.",
        explanation: "現在の受動態では \"is/are + 過去分詞\" を使います。",
        choices: ["English is spoken all over the world.", "English speaks all over the world.", "English is speaking all over the world.", "English was spoken all over the world."]
      },
      {
        id: 93,
        japanese: "この車は日本で作られました。",
        correctAnswer: "This car was made in Japan.",
        explanation: "過去の受動態では \"was/were + 過去分詞\" を使います。",
        choices: ["This car was made in Japan.", "This car made in Japan.", "This car is made in Japan.", "This car makes in Japan."]
      },
      {
        id: 94,
        japanese: "その手紙は彼によって書かれました。",
        correctAnswer: "The letter was written by him.",
        explanation: "動作の主体を表すときは \"by\" を使います。",
        choices: ["The letter was written by him.", "The letter wrote by him.", "The letter is written by him.", "The letter was writing by him."]
      },
      {
        id: 95,
        japanese: "この問題は簡単に解けます。",
        correctAnswer: "This problem can be solved easily.",
        explanation: "助動詞がある受動態では \"助動詞 + be + 過去分詞\" を使います。",
        choices: ["This problem can be solved easily.", "This problem can solve easily.", "This problem can solved easily.", "This problem is can solved easily."]
      }
    ],
    normal: [
      {
        id: 101,
        japanese: "この建物は1950年に建てられました。",
        correctAnswer: "This building was built in 1950.",
        explanation: "過去の受動態で年を表すときは \"in\" を使います。",
        hint: "building, was built, 1950"
      },
      {
        id: 102,
        japanese: "その映画は来年公開される予定です。",
        correctAnswer: "The movie will be released next year.",
        explanation: "未来の受動態では \"will be + 過去分詞\" を使います。",
        hint: "movie, will be released, next year"
      },
      {
        id: 103,
        japanese: "この報告書は昨日完成させられました。",
        correctAnswer: "This report was completed yesterday.",
        explanation: "過去の受動態で時を表すときの構造です。",
        hint: "report, was completed, yesterday"
      },
      {
        id: 104,
        japanese: "新しい橋が来月建設される予定です。",
        correctAnswer: "A new bridge is going to be built next month.",
        explanation: "\"be going to\" を使った未来の受動態です。",
        hint: "new bridge, is going to be built, next month"
      },
      {
        id: 105,
        japanese: "この曲は多くのアーティストによってカバーされています。",
        correctAnswer: "This song has been covered by many artists.",
        explanation: "現在完了の受動態では \"has/have been + 過去分詞\" を使います。",
        hint: "song, has been covered, many artists"
      }
    ],
    hard: [
      {
        id: 111,
        japanese: "その決定が下される前に、すべての選択肢が検討されていました。",
        correctAnswer: "All options had been considered before the decision was made.",
        explanation: "過去完了の受動態で、時系列を明確にします。"
      },
      {
        id: 112,
        japanese: "その秘密は長い間隠され続けてきました。",
        correctAnswer: "The secret has been kept hidden for a long time.",
        explanation: "現在完了進行形の受動態的表現です。"
      },
      {
        id: 113,
        japanese: "この技術は将来さらに発展させられるでしょう。",
        correctAnswer: "This technology will be further developed in the future.",
        explanation: "未来の受動態で副詞を含む複雑な構造です。"
      },
      {
        id: 114,
        japanese: "その計画は実行される前に中止されました。",
        correctAnswer: "The plan was canceled before it could be executed.",
        explanation: "助動詞を含む受動態の複雑な構造です。"
      },
      {
        id: 115,
        japanese: "彼の提案は委員会によって検討されているところです。",
        correctAnswer: "His proposal is being considered by the committee.",
        explanation: "現在進行形の受動態では \"is/are being + 過去分詞\" を使います。"
      }
    ]
  },
  'relative': {
    easy: [
      {
        id: 121,
        japanese: "私には英語を話す友達がいます。",
        correctAnswer: "I have a friend who speaks English.",
        explanation: "人を修飾するときは関係代名詞 \"who\" を使います。",
        choices: ["I have a friend who speaks English.", "I have a friend which speaks English.", "I have a friend that speak English.", "I have a friend who speak English."]
      },
      {
        id: 122,
        japanese: "これは私が買った本です。",
        correctAnswer: "This is the book which I bought.",
        explanation: "物を修飾するときは関係代名詞 \"which\" を使います。",
        choices: ["This is the book which I bought.", "This is the book who I bought.", "This is the book what I bought.", "This is the book that I buy."]
      },
      {
        id: 123,
        japanese: "彼女は親切な人です。",
        correctAnswer: "She is a person who is kind.",
        explanation: "人の性質を説明するときも \"who\" を使います。",
        choices: ["She is a person who is kind.", "She is a person which is kind.", "She is a person what is kind.", "She is a person that are kind."]
      },
      {
        id: 124,
        japanese: "私は赤い車を持っています。",
        correctAnswer: "I have a car that is red.",
        explanation: "\"that\" は人にも物にも使える関係代名詞です。",
        choices: ["I have a car that is red.", "I have a car who is red.", "I have a car what is red.", "I have a car which are red."]
      },
      {
        id: 125,
        japanese: "あそこに立っている男の人を知っていますか？",
        correctAnswer: "Do you know the man who is standing over there?",
        explanation: "現在進行形も関係代名詞で修飾できます。",
        choices: ["Do you know the man who is standing over there?", "Do you know the man which is standing over there?", "Do you know the man what is standing over there?", "Do you know the man that are standing over there?"]
      }
    ],
    normal: [
      {
        id: 131,
        japanese: "私が昨日会った人は有名な作家でした。",
        correctAnswer: "The person whom I met yesterday was a famous writer.",
        explanation: "目的格の関係代名詞は \"whom\" を使います（\"who\" でも可）。",
        hint: "person, whom, met yesterday, famous writer"
      },
      {
        id: 132,
        japanese: "これは私が生まれた町です。",
        correctAnswer: "This is the town where I was born.",
        explanation: "場所を表す関係副詞は \"where\" を使います。",
        hint: "town, where, was born"
      },
      {
        id: 133,
        japanese: "彼が来た理由がわかりません。",
        correctAnswer: "I don't know the reason why he came.",
        explanation: "理由を表す関係副詞は \"why\" を使います。",
        hint: "reason, why, came"
      },
      {
        id: 134,
        japanese: "私が彼に会った時、彼は忙しそうでした。",
        correctAnswer: "When I met him, he looked busy.",
        explanation: "時を表す関係副詞は \"when\" を使います。",
        hint: "when, met him, looked busy"
      },
      {
        id: 135,
        japanese: "私が昨日読んだ本はとても面白かったです。",
        correctAnswer: "The book that I read yesterday was very interesting.",
        explanation: "関係代名詞 \"that\" は制限用法で使われます。",
        hint: "book, that I read, very interesting"
      }
    ],
    hard: [
      {
        id: 141,
        japanese: "彼が言ったことは、私たちが予想していたことと全く異なっていました。",
        correctAnswer: "What he said was completely different from what we had expected.",
        explanation: "関係代名詞 \"what\" は「～すること」を表し、先行詞を含みます。"
      },
      {
        id: 142,
        japanese: "彼女は、その会社で働いている間に多くのことを学びました。",
        correctAnswer: "She learned a lot while she was working at the company.",
        explanation: "時間的な継続を表す複雑な関係節の構造です。"
      },
      {
        id: 143,
        japanese: "私たちが住んでいる家は、100年前に建てられました。",
        correctAnswer: "The house in which we live was built 100 years ago.",
        explanation: "前置詞を含む関係代名詞の構造です。"
      },
      {
        id: 144,
        japanese: "彼の話し方は、聞く人の心を動かします。",
        correctAnswer: "The way he speaks moves people's hearts.",
        explanation: "方法を表す \"the way\" を使った関係節です。"
      },
      {
        id: 145,
        japanese: "私が最も尊敬する人は、常に他人を助ける人です。",
        correctAnswer: "The person I respect most is someone who always helps others.",
        explanation: "複雑な関係代名詞の省略と組み合わせです。"
      }
    ]
  },
  'subjunctive': {
    easy: [
      {
        id: 151,
        japanese: "もし明日雨が降ったら、家にいます。",
        correctAnswer: "If it rains tomorrow, I will stay at home.",
        explanation: "現在の仮定では、if節は現在形、主節は未来形を使います。",
        choices: ["If it rains tomorrow, I will stay at home.", "If it will rain tomorrow, I stay at home.", "If it rained tomorrow, I will stay at home.", "If it rains tomorrow, I stayed at home."]
      },
      {
        id: 152,
        japanese: "もし時間があれば、映画を見に行きます。",
        correctAnswer: "If I have time, I will go to see a movie.",
        explanation: "条件を表すif節では現在形を使います。",
        choices: ["If I have time, I will go to see a movie.", "If I will have time, I go to see a movie.", "If I had time, I will go to see a movie.", "If I have time, I went to see a movie."]
      },
      {
        id: 153,
        japanese: "もし彼が来なかったら、私たちは困るでしょう。",
        correctAnswer: "If he doesn't come, we will be in trouble.",
        explanation: "否定の条件でも現在形を使います。",
        choices: ["If he doesn't come, we will be in trouble.", "If he won't come, we are in trouble.", "If he didn't come, we will be in trouble.", "If he doesn't come, we were in trouble."]
      },
      {
        id: 154,
        japanese: "もし私がお金持ちだったら、世界旅行をするでしょう。",
        correctAnswer: "If I were rich, I would travel around the world.",
        explanation: "現在の事実と反対の仮定では仮定法過去を使います。",
        choices: ["If I were rich, I would travel around the world.", "If I am rich, I will travel around the world.", "If I was rich, I would travel around the world.", "If I were rich, I will travel around the world."]
      },
      {
        id: 155,
        japanese: "もし私が鳥だったら、空を飛べるのに。",
        correctAnswer: "If I were a bird, I could fly in the sky.",
        explanation: "仮定法過去では \"were\" を使い、主節に助動詞の過去形を使います。",
        choices: ["If I were a bird, I could fly in the sky.", "If I was a bird, I can fly in the sky.", "If I am a bird, I could fly in the sky.", "If I were a bird, I can fly in the sky."]
      }
    ],
    normal: [
      {
        id: 161,
        japanese: "もし昨日雨が降らなかったら、ピクニックに行ったでしょう。",
        correctAnswer: "If it had not rained yesterday, we would have gone on a picnic.",
        explanation: "仮定法過去完了では、if節は過去完了、主節は \"would have + 過去分詞\" を使います。",
        hint: "had not rained, would have gone, picnic"
      },
      {
        id: 162,
        japanese: "もし彼がもっと勉強していたら、試験に合格していたでしょう。",
        correctAnswer: "If he had studied harder, he would have passed the exam.",
        explanation: "過去の事実と反対の仮定を表す仮定法過去完了です。",
        hint: "had studied harder, would have passed, exam"
      },
      {
        id: 163,
        japanese: "もし私があの時違う道を選んでいたら、今は違う仕事をしていたでしょう。",
        correctAnswer: "If I had chosen a different path at that time, I would be doing a different job now.",
        explanation: "混合仮定法：過去の条件と現在の結果を組み合わせます。",
        hint: "had chosen, different path, would be doing, different job"
      },
      {
        id: 164,
        japanese: "もし彼女がもっと早く来ていたら、会議に間に合ったのに。",
        correctAnswer: "If she had come earlier, she would have been in time for the meeting.",
        explanation: "過去の仮定的状況を表現します。",
        hint: "had come earlier, would have been, in time, meeting"
      },
      {
        id: 165,
        japanese: "もし私があなたの立場だったら、同じことをしたでしょう。",
        correctAnswer: "If I were in your position, I would have done the same thing.",
        explanation: "仮定法を使った丁寧な表現です。",
        hint: "were in your position, would have done, same thing"
      }
    ],
    hard: [
      {
        id: 171,
        japanese: "もし彼があの時違う決断をしていたら、今頃は全く違う人生を送っていたでしょう。",
        correctAnswer: "If he had made a different decision at that time, he would be living a completely different life now.",
        explanation: "混合仮定法：過去の仮定の条件と現在の仮定の結果を組み合わせます。"
      },
      {
        id: 172,
        japanese: "もし私が彼の立場にいたとしても、同じ決断をしたかもしれません。",
        correctAnswer: "Even if I had been in his position, I might have made the same decision.",
        explanation: "\"Even if\" を使った強調的な仮定法表現です。"
      },
      {
        id: 173,
        japanese: "もし技術がもっと発達していたら、この問題はとっくに解決されていたでしょう。",
        correctAnswer: "If technology had been more advanced, this problem would have been solved long ago.",
        explanation: "仮定法過去完了と受動態の組み合わせです。"
      },
      {
        id: 174,
        japanese: "もし私があの時真実を知っていたら、違う行動を取っていたでしょう。",
        correctAnswer: "If I had known the truth at that time, I would have acted differently.",
        explanation: "知識の仮定を表す複雑な仮定法構造です。"
      },
      {
        id: 175,
        japanese: "もし彼が今ここにいたら、この状況をどう解決するか教えてくれるでしょう。",
        correctAnswer: "If he were here now, he would tell us how to solve this situation.",
        explanation: "現在の非現実的状況を表す仮定法過去です。"
      }
    ]
  },
  'comparison': {
    easy: [
      {
        id: 181,
        japanese: "彼は私より背が高いです。",
        correctAnswer: "He is taller than me.",
        explanation: "比較級は \"形容詞 + er + than\" で表現します。",
        choices: ["He is taller than me.", "He is more tall than me.", "He is tall than me.", "He is taller then me."]
      },
      {
        id: 182,
        japanese: "この本はあの本より面白いです。",
        correctAnswer: "This book is more interesting than that book.",
        explanation: "長い形容詞は \"more + 形容詞 + than\" で比較級を作ります。",
        choices: ["This book is more interesting than that book.", "This book is interestinger than that book.", "This book is most interesting than that book.", "This book is interesting than that book."]
      },
      {
        id: 183,
        japanese: "彼女は3人の中で一番若いです。",
        correctAnswer: "She is the youngest of the three.",
        explanation: "最上級は \"the + 形容詞 + est\" で表現します。",
        choices: ["She is the youngest of the three.", "She is the most young of the three.", "She is younger of the three.", "She is the young of the three."]
      },
      {
        id: 184,
        japanese: "今日は昨日ほど暑くありません。",
        correctAnswer: "Today is not as hot as yesterday.",
        explanation: "同程度の比較は \"as + 形容詞 + as\" を使います。",
        choices: ["Today is not as hot as yesterday.", "Today is not so hot than yesterday.", "Today is not more hot as yesterday.", "Today is not hot than yesterday."]
      },
      {
        id: 185,
        japanese: "これは私が今まで読んだ中で最も面白い本です。",
        correctAnswer: "This is the most interesting book I have ever read.",
        explanation: "長い形容詞の最上級は \"the most + 形容詞\" を使います。",
        choices: ["This is the most interesting book I have ever read.", "This is the interestingest book I have ever read.", "This is the more interesting book I have ever read.", "This is most interesting book I have ever read."]
      }
    ],
    normal: [
      {
        id: 191,
        japanese: "この課題は私が思っていたよりもずっと難しいです。",
        correctAnswer: "This assignment is much more difficult than I thought.",
        explanation: "比較級を強調するときは \"much\" を使います。",
        hint: "much more difficult, than I thought"
      },
      {
        id: 192,
        japanese: "彼は兄と同じくらい頭がいいです。",
        correctAnswer: "He is as smart as his brother.",
        explanation: "同程度の比較を表現する構文です。",
        hint: "as smart as, his brother"
      },
      {
        id: 193,
        japanese: "この問題は前回のものより少し簡単です。",
        correctAnswer: "This problem is a little easier than the previous one.",
        explanation: "比較級を修飾する副詞 \"a little\" の使い方です。",
        hint: "a little easier, than, previous one"
      },
      {
        id: 194,
        japanese: "彼女は私が知っている人の中で最も親切です。",
        correctAnswer: "She is the kindest person I know.",
        explanation: "関係代名詞を含む最上級の表現です。",
        hint: "kindest person, I know"
      },
      {
        id: 195,
        japanese: "この映画はあの映画ほど面白くありません。",
        correctAnswer: "This movie is not as interesting as that movie.",
        explanation: "否定形での同程度比較の表現です。",
        hint: "not as interesting as, that movie"
      }
    ],
    hard: [
      {
        id: 201,
        japanese: "彼の成功は、才能よりもむしろ努力の結果です。",
        correctAnswer: "His success is more a result of effort than of talent.",
        explanation: "\"more A than B\" で「BというよりむしろA」を表現します。"
      },
      {
        id: 202,
        japanese: "年を取れば取るほど、時間の経過が早く感じられます。",
        correctAnswer: "The older you get, the faster time seems to pass.",
        explanation: "\"The + 比較級..., the + 比較級...\" で比例関係を表現します。"
      },
      {
        id: 203,
        japanese: "この問題は見た目ほど複雑ではありません。",
        correctAnswer: "This problem is not as complex as it looks.",
        explanation: "外見と実際の差を表現する比較構文です。"
      },
      {
        id: 204,
        japanese: "彼女の英語は日本人としては非常に上手です。",
        correctAnswer: "Her English is very good for a Japanese person.",
        explanation: "基準を示す \"for\" を使った比較表現です。"
      },
      {
        id: 205,
        japanese: "この技術は従来のものに比べて格段に優れています。",
        correctAnswer: "This technology is far superior to conventional ones.",
        explanation: "\"far\" を使った強調的な比較表現です。"
      }
    ]
  },
  'participle': {
    easy: [
      {
        id: 211,
        japanese: "私は走っている男の子を見ました。",
        correctAnswer: "I saw a boy running.",
        explanation: "現在分詞 (-ing) で進行中の動作を修飾します。",
        choices: ["I saw a boy running.", "I saw a boy run.", "I saw a boy ran.", "I saw a boy to run."]
      },
      {
        id: 212,
        japanese: "壊れた窓を修理してもらいました。",
        correctAnswer: "I had the broken window repaired.",
        explanation: "過去分詞で完了した状態を修飾します。",
        choices: ["I had the broken window repaired.", "I had the breaking window repaired.", "I had the break window repaired.", "I had the broke window repaired."]
      },
      {
        id: 213,
        japanese: "笑っている赤ちゃんはとてもかわいいです。",
        correctAnswer: "The smiling baby is very cute.",
        explanation: "現在分詞が形容詞として名詞を修飾します。",
        choices: ["The smiling baby is very cute.", "The smiled baby is very cute.", "The smile baby is very cute.", "The to smile baby is very cute."]
      },
      {
        id: 214,
        japanese: "彼は疲れた様子でした。",
        correctAnswer: "He looked tired.",
        explanation: "過去分詞が形容詞として使われます。",
        choices: ["He looked tired.", "He looked tiring.", "He looked tire.", "He looked to tire."]
      },
      {
        id: 215,
        japanese: "興奮した子供たちが公園で遊んでいました。",
        correctAnswer: "Excited children were playing in the park.",
        explanation: "過去分詞が形容詞として複数名詞を修飾します。",
        choices: ["Excited children were playing in the park.", "Exciting children were playing in the park.", "Excite children were playing in the park.", "To excite children were playing in the park."]
      }
    ],
    normal: [
      {
        id: 221,
        japanese: "駅に向かって走りながら、彼は時計を見ました。",
        correctAnswer: "Running towards the station, he looked at his watch.",
        explanation: "分詞構文で同時動作を表現します。",
        hint: "Running towards, station, looked at watch"
      },
      {
        id: 222,
        japanese: "宿題を終えてから、テレビを見ました。",
        correctAnswer: "Having finished my homework, I watched TV.",
        explanation: "完了の分詞構文で時系列を表現します。",
        hint: "Having finished, homework, watched TV"
      },
      {
        id: 223,
        japanese: "雨に濡れて、私たちは家に急いで帰りました。",
        correctAnswer: "Getting wet in the rain, we hurried home.",
        explanation: "原因や状況を表す分詞構文です。",
        hint: "Getting wet, rain, hurried home"
      },
      {
        id: 224,
        japanese: "一生懸命勉強して、彼は試験に合格しました。",
        correctAnswer: "Studying hard, he passed the exam.",
        explanation: "方法や手段を表す分詞構文です。",
        hint: "Studying hard, passed, exam"
      },
      {
        id: 225,
        japanese: "驚いた表情で、彼女は私を見ました。",
        correctAnswer: "With a surprised expression, she looked at me.",
        explanation: "過去分詞を使った状態の表現です。",
        hint: "surprised expression, looked at me"
      }
    ],
    hard: [
      {
        id: 231,
        japanese: "長年の経験を積んだ結果、彼は専門家として認められるようになりました。",
        correctAnswer: "Having accumulated years of experience, he came to be recognized as an expert.",
        explanation: "完了分詞構文と受動態の組み合わせです。"
      },
      {
        id: 232,
        japanese: "多くの困難に直面しながらも、彼らはプロジェクトを完成させました。",
        correctAnswer: "Despite facing many difficulties, they completed the project.",
        explanation: "逆接を表す分詞構文の複雑な表現です。"
      },
      {
        id: 233,
        japanese: "その知らせを聞いて、彼女は涙を流しました。",
        correctAnswer: "Hearing the news, she burst into tears.",
        explanation: "感情の変化を表す分詞構文です。"
      },
      {
        id: 234,
        japanese: "正しく使われれば、この技術は非常に有効です。",
        correctAnswer: "Used correctly, this technology is very effective.",
        explanation: "条件を表す過去分詞構文です。"
      },
      {
        id: 235,
        japanese: "多くの人に愛され続けて、その歌は今でも人気があります。",
        correctAnswer: "Having been loved by many people, the song is still popular today.",
        explanation: "完了受動の分詞構文です。"
      }
    ]
  },
  'infinitive': {
    easy: [
      {
        id: 241,
        japanese: "私は英語を勉強したいです。",
        correctAnswer: "I want to study English.",
        explanation: "\"want\" の後は不定詞 \"to + 動詞の原形\" を使います。",
        choices: ["I want to study English.", "I want study English.", "I want studying English.", "I want studied English."]
      },
      {
        id: 242,
        japanese: "彼は泳ぐことを学んでいます。",
        correctAnswer: "He is learning to swim.",
        explanation: "\"learn\" の後も不定詞を使います。",
        choices: ["He is learning to swim.", "He is learning swim.", "He is learning swimming.", "He is learning swam."]
      },
      {
        id: 243,
        japanese: "私たちは映画を見に行くことにしました。",
        correctAnswer: "We decided to go to see a movie.",
        explanation: "\"decide\" の後は不定詞を使います。",
        choices: ["We decided to go to see a movie.", "We decided go to see a movie.", "We decided going to see a movie.", "We decided went to see a movie."]
      },
      {
        id: 244,
        japanese: "彼女は歌手になりたがっています。",
        correctAnswer: "She wants to become a singer.",
        explanation: "\"want to become\" で「～になりたい」を表現します。",
        choices: ["She wants to become a singer.", "She wants become a singer.", "She wants becoming a singer.", "She wants became a singer."]
      },
      {
        id: 245,
        japanese: "私は早く家に帰る必要があります。",
        correctAnswer: "I need to go home early.",
        explanation: "\"need\" の後は不定詞を使います。",
        choices: ["I need to go home early.", "I need go home early.", "I need going home early.", "I need went home early."]
      }
    ],
    normal: [
      {
        id: 251,
        japanese: "私は彼に英語を教えてもらいました。",
        correctAnswer: "I had him teach me English.",
        explanation: "使役動詞 \"have\" の後は原形不定詞（to なし）を使います。",
        hint: "had him teach, English"
      },
      {
        id: 252,
        japanese: "彼女は私に真実を話すように頼みました。",
        correctAnswer: "She asked me to tell the truth.",
        explanation: "\"ask + 人 + to + 動詞\" の構文です。",
        hint: "asked me, to tell, truth"
      },
      {
        id: 253,
        japanese: "私は彼が来るのを見ました。",
        correctAnswer: "I saw him come.",
        explanation: "知覚動詞の後は原形不定詞を使います。",
        hint: "saw him come"
      },
      {
        id: 254,
        japanese: "母は私に部屋を掃除させました。",
        correctAnswer: "My mother made me clean my room.",
        explanation: "使役動詞 \"make\" の後は原形不定詞を使います。",
        hint: "made me clean, room"
      },
      {
        id: 255,
        japanese: "彼は私に手伝ってくれるように頼みました。",
        correctAnswer: "He asked me to help him.",
        explanation: "依頼を表す \"ask + 人 + to + 動詞\" の構文です。",
        hint: "asked me, to help him"
      }
    ],
    hard: [
      {
        id: 261,
        japanese: "彼は問題を解決したと言われています。",
        correctAnswer: "He is said to have solved the problem.",
        explanation: "\"be said to have + 過去分詞\" で完了の不定詞を使った伝聞表現です。"
      },
      {
        id: 262,
        japanese: "その計画は実行するには複雑すぎます。",
        correctAnswer: "The plan is too complex to execute.",
        explanation: "\"too + 形容詞 + to + 動詞\" で「～するには～すぎる」を表現します。"
      },
      {
        id: 263,
        japanese: "彼女は昨日そこにいたはずです。",
        correctAnswer: "She is supposed to have been there yesterday.",
        explanation: "\"be supposed to have + 過去分詞\" で過去の推測を表現します。"
      },
      {
        id: 264,
        japanese: "この問題は解決するのが難しいです。",
        correctAnswer: "This problem is difficult to solve.",
        explanation: "\"形容詞 + to + 動詞\" で性質を表現します。"
      },
      {
        id: 265,
        japanese: "彼は明日までにレポートを完成させることになっています。",
        correctAnswer: "He is to complete the report by tomorrow.",
        explanation: "\"be to + 動詞\" で予定や義務を表現します。"
      }
    ]
  }
};

// Helper function to get questions by category and difficulty
export function getQuestions(category: Category, difficulty: 'easy' | 'normal' | 'hard'): QuestionData[] {
  console.log('=== getQuestions called ===');
  console.log('category:', category);
  console.log('difficulty:', difficulty);
  console.log('questionsByCategory keys:', Object.keys(questionsByCategory));
  console.log('category exists in data:', category in questionsByCategory);
  
  if (!(category in questionsByCategory)) {
    console.error('Category not found:', category);
    return [];
  }
  
  const categoryData = questionsByCategory[category];
  console.log('difficulty exists in category:', difficulty in categoryData);
  
  if (!(difficulty in categoryData)) {
    console.error('Difficulty not found for category:', category, difficulty);
    return [];
  }
  
  const questions = categoryData[difficulty];
  console.log('Found questions:', questions.length);
  return questions || [];
}

// Helper function to get all categories
export function getAllCategories(): Category[] {
  return Object.keys(questionsByCategory) as Category[];
}