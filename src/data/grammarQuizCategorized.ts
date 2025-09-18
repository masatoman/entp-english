import { getAvailablePreStudyQuestions } from "./preStudyGrammarQuestions";

export interface GrammarQuizQuestion {
  id: number;
  sentence: string;
  blanks: {
    id: string;
    position: number;
    correctAnswer: string;
  }[];
  options: string[];
  explanation: string;
  level: "beginner" | "intermediate" | "advanced";
  category:
    | "basic-sentence-patterns"
    | "tenses"
    | "auxiliaries"
    | "passive-voice"
    | "relative-clauses"
    | "subjunctive"
    | "comparison"
    | "participles-gerunds"
    | "infinitives";
  source?: "prestudy" | "standard";
  preStudyContentId?: string;
  toeicPart?: number;
}

export const grammarQuizQuestions: GrammarQuizQuestion[] = [
  // 基本文型 (basic-sentence-patterns)
  {
    id: 1,
    sentence: "I ___ to the store yesterday.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "went" }],
    options: ["go", "went", "going", "goes"],
    explanation: "過去の時点での行動を表すため、過去形「went」が正解です。",
    level: "beginner",
    category: "basic-sentence-patterns",
  },
  {
    id: 2,
    sentence: "The book ___ on the table ___ mine.",
    blanks: [
      { id: "blank1", position: 3, correctAnswer: "lying" },
      { id: "blank2", position: 7, correctAnswer: "is" },
    ],
    options: ["lying", "laying", "is", "are", "was", "were", "lying", "is"],
    explanation: "「lying」（横たわっている）と単数形の「is」が正解です。",
    level: "intermediate",
    category: "basic-sentence-patterns",
  },
  {
    id: 3,
    sentence: "They ___ playing soccer when it ___ to rain.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "were" },
      { id: "blank2", position: 7, correctAnswer: "started" },
    ],
    options: [
      "were",
      "was",
      "started",
      "start",
      "are",
      "have",
      "were",
      "started",
    ],
    explanation: "過去進行形「were playing」と過去形「started」が正解です。",
    level: "beginner",
    category: "basic-sentence-patterns",
  },
  {
    id: 4,
    sentence: "I ___ my homework before I ___ to bed.",
    blanks: [
      { id: "blank1", position: 1, correctAnswer: "finished" },
      { id: "blank2", position: 5, correctAnswer: "went" },
    ],
    options: [
      "finished",
      "finish",
      "went",
      "go",
      "will finish",
      "will go",
      "finished",
      "went",
    ],
    explanation: "過去の順序を表すため過去形「finished」と「went」が正解です。",
    level: "beginner",
    category: "basic-sentence-patterns",
  },
  {
    id: 5,
    sentence: "He ___ to the store ___ some milk.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "went" },
      { id: "blank2", position: 5, correctAnswer: "to buy" },
    ],
    options: [
      "went",
      "goes",
      "to buy",
      "buying",
      "bought",
      "will buy",
      "went",
      "to buy",
    ],
    explanation: "過去形「went」と目的を表す不定詞「to buy」が正解です。",
    level: "beginner",
    category: "basic-sentence-patterns",
  },
  {
    id: 6,
    sentence: "She ___ her keys ___ she left the house.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "forgot" },
      { id: "blank2", position: 5, correctAnswer: "when" },
    ],
    options: [
      "forgot",
      "forgets",
      "when",
      "while",
      "before",
      "after",
      "forgot",
      "when",
    ],
    explanation: "過去形「forgot」と時を表す「when」が正解です。",
    level: "beginner",
    category: "basic-sentence-patterns",
  },
  {
    id: 7,
    sentence: "The students ___ their homework ___ the teacher arrived.",
    blanks: [
      { id: "blank1", position: 3, correctAnswer: "had finished" },
      { id: "blank2", position: 6, correctAnswer: "when" },
    ],
    options: [
      "had finished",
      "finished",
      "when",
      "before",
      "after",
      "while",
      "had finished",
      "when",
    ],
    explanation: "過去完了形「had finished」と時を表す「when」が正解です。",
    level: "advanced",
    category: "basic-sentence-patterns",
  },
  {
    id: 8,
    sentence: "I ___ you ___ come to the party tomorrow.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "hope" },
      { id: "blank2", position: 4, correctAnswer: "will" },
    ],
    options: ["hope", "hoped", "will", "would", "can", "could", "hope", "will"],
    explanation: "現在形「hope」と未来形「will」が正解です。",
    level: "intermediate",
    category: "basic-sentence-patterns",
  },

  // 時制 (tenses)
  {
    id: 9,
    sentence: "She ___ been studying English ___ three years.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "has" },
      { id: "blank2", position: 6, correctAnswer: "for" },
    ],
    options: ["has", "have", "for", "since", "is", "was", "has", "for"],
    explanation:
      "現在完了形「has been studying」と期間を表す「for」が正解です。",
    level: "intermediate",
    category: "tenses",
  },
  {
    id: 10,
    sentence: "By the time you arrive, I ___ finished my homework.",
    blanks: [{ id: "blank1", position: 7, correctAnswer: "will have" }],
    options: ["will have", "will", "have", "had", "would have"],
    explanation: "未来完了形「will have finished」が正解です。",
    level: "advanced",
    category: "tenses",
  },
  {
    id: 11,
    sentence: "She ___ English for five years ___ she started working.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "had been studying" },
      { id: "blank2", position: 7, correctAnswer: "when" },
    ],
    options: [
      "had been studying",
      "has been studying",
      "when",
      "before",
      "after",
      "while",
      "had been studying",
      "when",
    ],
    explanation:
      "過去完了進行形「had been studying」と時を表す「when」が正解です。",
    level: "advanced",
    category: "tenses",
  },
  {
    id: 12,
    sentence: "The children ___ playing in the park ___ it started raining.",
    blanks: [
      { id: "blank1", position: 3, correctAnswer: "were" },
      { id: "blank2", position: 7, correctAnswer: "when" },
    ],
    options: [
      "were",
      "was",
      "when",
      "while",
      "before",
      "after",
      "were",
      "when",
    ],
    explanation: "過去進行形「were playing」と時を表す「when」が正解です。",
    level: "beginner",
    category: "tenses",
  },
  {
    id: 13,
    sentence: "I ___ this book three times already.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "have read" }],
    options: ["have read", "read", "am reading", "will read"],
    explanation: "現在完了形「have read」が正解です。",
    level: "intermediate",
    category: "tenses",
  },
  {
    id: 14,
    sentence: "He ___ to Japan next month.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "will go" }],
    options: ["will go", "goes", "is going", "went"],
    explanation: "未来形「will go」が正解です。",
    level: "beginner",
    category: "tenses",
  },
  {
    id: 15,
    sentence: "I ___ my homework when you called.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "was doing" }],
    options: ["was doing", "did", "am doing", "have done"],
    explanation: "過去進行形「was doing」が正解です。",
    level: "intermediate",
    category: "tenses",
  },
  {
    id: 16,
    sentence: "She ___ here since 2020.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "has lived" }],
    options: ["has lived", "lived", "is living", "will live"],
    explanation: "現在完了形「has lived」が正解です。",
    level: "intermediate",
    category: "tenses",
  },

  // 助動詞 (auxiliaries)
  {
    id: 17,
    sentence: "You ___ study harder if you want to pass the exam.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "should" }],
    options: ["should", "can", "must", "will"],
    explanation: "助動詞「should」が正解です。",
    level: "intermediate",
    category: "auxiliaries",
  },
  {
    id: 18,
    sentence: "I ___ speak three languages fluently.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "can" }],
    options: ["can", "should", "must", "will"],
    explanation: "助動詞「can」が正解です。",
    level: "beginner",
    category: "auxiliaries",
  },
  {
    id: 19,
    sentence: "You ___ not smoke in this building.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "must" }],
    options: ["must", "can", "should", "will"],
    explanation: "助動詞「must」が正解です。",
    level: "intermediate",
    category: "auxiliaries",
  },
  {
    id: 20,
    sentence: "I ___ you ___ call me if you need help.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "suggest" },
      { id: "blank2", position: 4, correctAnswer: "should" },
    ],
    options: [
      "suggest",
      "suggested",
      "should",
      "would",
      "could",
      "might",
      "suggest",
      "should",
    ],
    explanation: "提案を表す「suggest」と助動詞「should」が正解です。",
    level: "intermediate",
    category: "auxiliaries",
  },
  {
    id: 21,
    sentence: "You ___ have told me earlier.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "should" }],
    options: ["should", "can", "must", "will"],
    explanation: "助動詞「should」が正解です。",
    level: "intermediate",
    category: "auxiliaries",
  },
  {
    id: 22,
    sentence: "I ___ not believe what I'm seeing.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "can" }],
    options: ["can", "should", "must", "will"],
    explanation: "助動詞「can」が正解です。",
    level: "beginner",
    category: "auxiliaries",
  },
  {
    id: 23,
    sentence: "You ___ be more careful next time.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "should" }],
    options: ["should", "can", "must", "will"],
    explanation: "助動詞「should」が正解です。",
    level: "intermediate",
    category: "auxiliaries",
  },
  {
    id: 24,
    sentence: "I ___ have finished this by tomorrow.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "will" }],
    options: ["will", "can", "should", "must"],
    explanation: "助動詞「will」が正解です。",
    level: "intermediate",
    category: "auxiliaries",
  },

  // 受動態 (passive-voice)
  {
    id: 25,
    sentence: "The house ___ by a famous architect.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "was designed" }],
    options: ["was designed", "designed", "is designing", "will design"],
    explanation: "受動態「was designed」が正解です。",
    level: "intermediate",
    category: "passive-voice",
  },
  {
    id: 26,
    sentence: "The book ___ in many countries.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "is read" }],
    options: ["is read", "reads", "was reading", "will read"],
    explanation: "受動態「is read」が正解です。",
    level: "beginner",
    category: "passive-voice",
  },
  {
    id: 27,
    sentence: "The door ___ by someone.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "was opened" }],
    options: ["was opened", "opened", "is opening", "will open"],
    explanation: "受動態「was opened」が正解です。",
    level: "intermediate",
    category: "passive-voice",
  },
  {
    id: 28,
    sentence: "The project ___ by the team last month.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "was completed" }],
    options: ["was completed", "completed", "is completing", "will complete"],
    explanation: "受動態「was completed」が正解です。",
    level: "intermediate",
    category: "passive-voice",
  },
  {
    id: 29,
    sentence: "The letter ___ yesterday.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "was sent" }],
    options: ["was sent", "sent", "is sending", "will send"],
    explanation: "受動態「was sent」が正解です。",
    level: "beginner",
    category: "passive-voice",
  },
  {
    id: 30,
    sentence: "The problem ___ by the engineers.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "is being solved" }],
    options: ["is being solved", "solves", "solved", "will solve"],
    explanation: "受動態進行形「is being solved」が正解です。",
    level: "advanced",
    category: "passive-voice",
  },
  {
    id: 31,
    sentence: "The meeting ___ at 3 PM tomorrow.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "will be held" }],
    options: ["will be held", "holds", "held", "is holding"],
    explanation: "受動態未来形「will be held」が正解です。",
    level: "intermediate",
    category: "passive-voice",
  },
  {
    id: 32,
    sentence: "The car ___ by my father.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "was bought" }],
    options: ["was bought", "bought", "is buying", "will buy"],
    explanation: "受動態「was bought」が正解です。",
    level: "beginner",
    category: "passive-voice",
  },

  // 関係詞 (relative-clauses)
  {
    id: 33,
    sentence: "The movie ___ we watched last night ___ very exciting.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "that" },
      { id: "blank2", position: 7, correctAnswer: "was" },
    ],
    options: ["that", "which", "who", "was", "were", "is", "that", "was"],
    explanation: "関係代名詞「that」と過去形「was」が正解です。",
    level: "intermediate",
    category: "relative-clauses",
  },
  {
    id: 34,
    sentence: "The book ___ I read yesterday ___ very interesting.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "which" },
      { id: "blank2", position: 6, correctAnswer: "was" },
    ],
    options: ["which", "that", "who", "was", "were", "is", "which", "was"],
    explanation: "関係代名詞「which」と過去形「was」が正解です。",
    level: "intermediate",
    category: "relative-clauses",
  },
  {
    id: 35,
    sentence: "The man ___ is standing there is my teacher.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "who" }],
    options: ["who", "which", "that", "whom"],
    explanation: "関係代名詞「who」が正解です。",
    level: "beginner",
    category: "relative-clauses",
  },
  {
    id: 36,
    sentence: "This is the house ___ I was born.",
    blanks: [{ id: "blank1", position: 4, correctAnswer: "where" }],
    options: ["where", "which", "that", "who"],
    explanation: "関係副詞「where」が正解です。",
    level: "intermediate",
    category: "relative-clauses",
  },
  {
    id: 37,
    sentence: "The reason ___ he left is unknown.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "why" }],
    options: ["why", "which", "that", "who"],
    explanation: "関係副詞「why」が正解です。",
    level: "intermediate",
    category: "relative-clauses",
  },
  {
    id: 38,
    sentence: "The day ___ I met you was wonderful.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "when" }],
    options: ["when", "which", "that", "who"],
    explanation: "関係副詞「when」が正解です。",
    level: "intermediate",
    category: "relative-clauses",
  },
  {
    id: 39,
    sentence: "The woman ___ you saw is my sister.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "whom" }],
    options: ["whom", "who", "which", "that"],
    explanation: "関係代名詞「whom」が正解です。",
    level: "advanced",
    category: "relative-clauses",
  },
  {
    id: 40,
    sentence: "The car ___ color is red belongs to me.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "whose" }],
    options: ["whose", "which", "that", "who"],
    explanation: "関係代名詞「whose」が正解です。",
    level: "advanced",
    category: "relative-clauses",
  },

  // 仮定法 (subjunctive)
  {
    id: 41,
    sentence: "If I ___ rich, I ___ travel around the world.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "were" },
      { id: "blank2", position: 5, correctAnswer: "would" },
    ],
    options: ["were", "was", "would", "will", "am", "could", "were", "would"],
    explanation: "仮定法過去「If I were rich, I would travel」が正解です。",
    level: "advanced",
    category: "subjunctive",
  },
  {
    id: 42,
    sentence: "I wish I ___ more time to finish this project.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "had" }],
    options: ["had", "have", "has", "will have"],
    explanation: "願望を表す「I wish」の後は仮定法過去「had」を使います。",
    level: "advanced",
    category: "subjunctive",
  },
  {
    id: 43,
    sentence: "If I ___ you, I ___ study harder.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "were" },
      { id: "blank2", position: 5, correctAnswer: "would" },
    ],
    options: [
      "were",
      "was",
      "would",
      "will",
      "should",
      "could",
      "were",
      "would",
    ],
    explanation: "仮定法過去「If I were you, I would study」が正解です。",
    level: "advanced",
    category: "subjunctive",
  },
  {
    id: 44,
    sentence: "I wish I ___ speak French fluently.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "could" }],
    options: ["could", "can", "will", "would"],
    explanation: "願望を表す「I wish」の後は仮定法過去「could」を使います。",
    level: "intermediate",
    category: "subjunctive",
  },
  {
    id: 45,
    sentence: "If I ___ known earlier, I ___ have come.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "had" },
      { id: "blank2", position: 5, correctAnswer: "would" },
    ],
    options: [
      "had",
      "have",
      "would",
      "will",
      "could",
      "should",
      "had",
      "would",
    ],
    explanation:
      "仮定法過去完了「If I had known, I would have come」が正解です。",
    level: "advanced",
    category: "subjunctive",
  },
  {
    id: 46,
    sentence: "I wish I ___ not made that mistake.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "had" }],
    options: ["had", "have", "has", "will have"],
    explanation: "願望を表す「I wish」の後は仮定法過去完了「had」を使います。",
    level: "advanced",
    category: "subjunctive",
  },
  {
    id: 47,
    sentence: "If I ___ you, I ___ not do that.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "were" },
      { id: "blank2", position: 5, correctAnswer: "would" },
    ],
    options: [
      "were",
      "was",
      "would",
      "will",
      "should",
      "could",
      "were",
      "would",
    ],
    explanation: "仮定法過去「If I were you, I would not do」が正解です。",
    level: "advanced",
    category: "subjunctive",
  },
  {
    id: 48,
    sentence: "I wish it ___ stop raining.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "would" }],
    options: ["would", "will", "can", "could"],
    explanation: "願望を表す「I wish」の後は仮定法過去「would」を使います。",
    level: "intermediate",
    category: "subjunctive",
  },

  // 比較 (comparison)
  {
    id: 49,
    sentence: "She is ___ intelligent ___ her sister.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "as" },
      { id: "blank2", position: 4, correctAnswer: "as" },
    ],
    options: ["as", "as", "so", "more", "most", "than", "very", "as", "as"],
    explanation: "同等比較「as ... as」の構文が正解です。",
    level: "intermediate",
    category: "comparison",
  },
  {
    id: 50,
    sentence: "This book is ___ than that one.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "more interesting" }],
    options: [
      "more interesting",
      "interesting",
      "most interesting",
      "as interesting",
    ],
    explanation: "比較級「more interesting」が正解です。",
    level: "beginner",
    category: "comparison",
  },
  {
    id: 51,
    sentence: "He is the ___ student in the class.",
    blanks: [{ id: "blank1", position: 4, correctAnswer: "tallest" }],
    options: ["tallest", "taller", "tall", "as tall"],
    explanation: "最上級「tallest」が正解です。",
    level: "beginner",
    category: "comparison",
  },
  {
    id: 52,
    sentence: "This is ___ expensive ___ that.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "as" },
      { id: "blank2", position: 4, correctAnswer: "as" },
    ],
    options: ["as", "as", "so", "more", "most", "than", "very", "as", "as"],
    explanation: "同等比較「as ... as」の構文が正解です。",
    level: "intermediate",
    category: "comparison",
  },
  {
    id: 53,
    sentence: "She runs ___ than her brother.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "faster" }],
    options: ["faster", "fast", "fastest", "as fast"],
    explanation: "比較級「faster」が正解です。",
    level: "beginner",
    category: "comparison",
  },
  {
    id: 54,
    sentence: "This is the ___ beautiful place I've ever seen.",
    blanks: [{ id: "blank1", position: 4, correctAnswer: "most" }],
    options: ["most", "more", "very", "as"],
    explanation: "最上級「most」が正解です。",
    level: "intermediate",
    category: "comparison",
  },
  {
    id: 55,
    sentence: "He is ___ than I expected.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "taller" }],
    options: ["taller", "tall", "tallest", "as tall"],
    explanation: "比較級「taller」が正解です。",
    level: "beginner",
    category: "comparison",
  },
  {
    id: 56,
    sentence: "This problem is ___ difficult ___ the previous one.",
    blanks: [
      { id: "blank1", position: 3, correctAnswer: "as" },
      { id: "blank2", position: 5, correctAnswer: "as" },
    ],
    options: ["as", "as", "so", "more", "most", "than", "very", "as", "as"],
    explanation: "同等比較「as ... as」の構文が正解です。",
    level: "intermediate",
    category: "comparison",
  },

  // 分詞・動名詞 (participles-gerunds)
  {
    id: 57,
    sentence: "___ English is not easy for me.",
    blanks: [{ id: "blank1", position: 1, correctAnswer: "Learning" }],
    options: ["Learning", "Learn", "Learned", "To learn"],
    explanation: "動名詞「Learning」が正解です。",
    level: "intermediate",
    category: "participles-gerunds",
  },
  {
    id: 58,
    sentence: "I enjoy ___ books in my free time.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "reading" }],
    options: ["reading", "read", "to read", "reads"],
    explanation: "動名詞「reading」が正解です。",
    level: "beginner",
    category: "participles-gerunds",
  },
  {
    id: 59,
    sentence: "The ___ child was crying loudly.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "crying" }],
    options: ["crying", "cry", "cried", "cries"],
    explanation: "現在分詞「crying」が正解です。",
    level: "intermediate",
    category: "participles-gerunds",
  },
  {
    id: 60,
    sentence: "I saw a ___ bird in the tree.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "singing" }],
    options: ["singing", "sing", "sang", "sings"],
    explanation: "現在分詞「singing」が正解です。",
    level: "intermediate",
    category: "participles-gerunds",
  },
  {
    id: 61,
    sentence: "___ tired, I went to bed early.",
    blanks: [{ id: "blank1", position: 1, correctAnswer: "Feeling" }],
    options: ["Feeling", "Feel", "Felt", "To feel"],
    explanation: "現在分詞「Feeling」が正解です。",
    level: "advanced",
    category: "participles-gerunds",
  },
  {
    id: 62,
    sentence: "The ___ book is on the table.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "opened" }],
    options: ["opened", "opening", "open", "opens"],
    explanation: "過去分詞「opened」が正解です。",
    level: "intermediate",
    category: "participles-gerunds",
  },
  {
    id: 63,
    sentence: "I'm looking forward to ___ you again.",
    blanks: [{ id: "blank1", position: 4, correctAnswer: "seeing" }],
    options: ["seeing", "see", "saw", "sees"],
    explanation: "動名詞「seeing」が正解です。",
    level: "intermediate",
    category: "participles-gerunds",
  },
  {
    id: 64,
    sentence: "The ___ door was difficult to open.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "broken" }],
    options: ["broken", "breaking", "break", "breaks"],
    explanation: "過去分詞「broken」が正解です。",
    level: "intermediate",
    category: "participles-gerunds",
  },

  // 不定詞 (infinitives)
  {
    id: 65,
    sentence: "I want ___ a doctor when I grow up.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "to become" }],
    options: ["to become", "become", "becoming", "became"],
    explanation: "不定詞「to become」が正解です。",
    level: "beginner",
    category: "infinitives",
  },
  {
    id: 66,
    sentence: "It's important ___ English every day.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "to practice" }],
    options: ["to practice", "practice", "practicing", "practiced"],
    explanation: "不定詞「to practice」が正解です。",
    level: "intermediate",
    category: "infinitives",
  },
  {
    id: 67,
    sentence: "I need ___ some money from the bank.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "to withdraw" }],
    options: ["to withdraw", "withdraw", "withdrawing", "withdrew"],
    explanation: "不定詞「to withdraw」が正解です。",
    level: "intermediate",
    category: "infinitives",
  },
  {
    id: 68,
    sentence: "She decided ___ her job.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "to quit" }],
    options: ["to quit", "quit", "quitting", "quits"],
    explanation: "不定詞「to quit」が正解です。",
    level: "intermediate",
    category: "infinitives",
  },
  {
    id: 69,
    sentence: "It's difficult ___ this problem.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "to solve" }],
    options: ["to solve", "solve", "solving", "solved"],
    explanation: "不定詞「to solve」が正解です。",
    level: "intermediate",
    category: "infinitives",
  },
  {
    id: 70,
    sentence: "I hope ___ you soon.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "to see" }],
    options: ["to see", "see", "seeing", "saw"],
    explanation: "不定詞「to see」が正解です。",
    level: "beginner",
    category: "infinitives",
  },
  {
    id: 71,
    sentence: "She asked me ___ her with the homework.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "to help" }],
    options: ["to help", "help", "helping", "helped"],
    explanation: "不定詞「to help」が正解です。",
    level: "intermediate",
    category: "infinitives",
  },
  {
    id: 72,
    sentence: "It's nice ___ you again.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "to meet" }],
    options: ["to meet", "meet", "meeting", "met"],
    explanation: "不定詞「to meet」が正解です。",
    level: "beginner",
    category: "infinitives",
  },
];

export function getGrammarQuizQuestions(
  level?: "beginner" | "intermediate" | "advanced",
  category?: string
): GrammarQuizQuestion[] {
  // 標準問題を取得
  let filteredQuestions = grammarQuizQuestions.map((q) => ({
    ...q,
    source: "standard" as const,
  }));

  // 事前学習由来の問題を追加
  try {
    const preStudyQuestions = getAvailablePreStudyQuestions(level, category);
    filteredQuestions = [...filteredQuestions, ...preStudyQuestions];

    console.log(
      `📚 文法クイズ問題統合: 標準${grammarQuizQuestions.length}問 + 事前学習${preStudyQuestions.length}問`
    );
  } catch (error) {
    console.warn("事前学習問題の統合に失敗:", error);
  }

  if (level) {
    filteredQuestions = filteredQuestions.filter((q) => q.level === level);
  }

  if (category) {
    filteredQuestions = filteredQuestions.filter(
      (q) => q.category === category
    );
  }

  return filteredQuestions;
}

export const grammarCategories = [
  {
    id: "basic-sentence-patterns",
    name: "基本文型",
    description: "SV, SVC, SVO, SVOO, SVOCの基本文型",
  },
  { id: "tenses", name: "時制", description: "現在、過去、未来、完了形の時制" },
  {
    id: "auxiliaries",
    name: "助動詞",
    description: "can, may, must, should等の助動詞",
  },
  {
    id: "passive-voice",
    name: "受動態",
    description: "be動詞 + 過去分詞の受動態",
  },
  {
    id: "relative-clauses",
    name: "関係詞",
    description: "who, which, that等の関係詞",
  },
  { id: "subjunctive", name: "仮定法", description: "if文、wish等の仮定法" },
  { id: "comparison", name: "比較", description: "比較級、最上級の比較表現" },
  {
    id: "participles-gerunds",
    name: "分詞・動名詞",
    description: "-ing形の使い分け",
  },
  { id: "infinitives", name: "不定詞", description: "to不定詞の用法" },
];
