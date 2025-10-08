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
  source?: "prestudy" | "standard"; // 問題の出典
  preStudyContentId?: string; // 関連する事前学習コンテンツID
  toeicPart?: number; // TOEIC Part番号
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
    id: 3,
    sentence: "If I ___ rich, I ___ travel around the world.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "were" },
      { id: "blank2", position: 5, correctAnswer: "would" },
    ],
    options: ["were", "was", "would", "will", "am", "could", "were", "would"],
    explanation: "仮定法過去「If I were rich, I would travel」が正解です。",
    level: "advanced",
    category: "tenses",
  },
  {
    id: 4,
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
    id: 5,
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
    id: 6,
    sentence: "I wish I ___ more time to finish this project.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "had" }],
    options: ["had", "have", "has", "will have"],
    explanation: "願望を表す「I wish」の後は仮定法過去「had」を使います。",
    level: "advanced",
    category: "tenses",
  },
  {
    id: 7,
    sentence: "She is ___ intelligent ___ her sister.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "as" },
      { id: "blank2", position: 4, correctAnswer: "as" },
    ],
    options: ["as", "as", "so", "more", "most", "than", "very", "as", "as"],
    explanation: "同等比較「as ... as」の構文が正解です。",
    level: "intermediate",
    category: "tenses",
  },
  {
    id: 8,
    sentence: "By the time you arrive, I ___ finished my homework.",
    blanks: [{ id: "blank1", position: 7, correctAnswer: "will have" }],
    options: ["will have", "will", "have", "had", "would have"],
    explanation: "未来完了形「will have finished」が正解です。",
    level: "advanced",
    category: "tenses",
  },
  {
    id: 9,
    sentence: "The movie ___ we watched last night ___ very exciting.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "that" },
      { id: "blank2", position: 7, correctAnswer: "was" },
    ],
    options: ["that", "which", "who", "was", "were", "is", "that", "was"],
    explanation: "関係代名詞「that」と過去形「was」が正解です。",
    level: "intermediate",
    category: "tenses",
  },
  {
    id: 10,
    sentence: "He ___ to be working hard, but he was actually sleeping.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "appeared" }],
    options: ["appeared", "seems", "looks", "appears"],
    explanation: "過去の状況を表すため過去形「appeared」が正解です。",
    level: "intermediate",
    category: "tenses",
  },
  // 追加の問題
  {
    id: 11,
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
    id: 12,
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
    id: 13,
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
    category: "basic-sentence-patterns",
  },
  {
    id: 14,
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
    category: "tenses",
  },
  {
    id: 15,
    sentence: "The book ___ I read yesterday ___ very interesting.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "which" },
      { id: "blank2", position: 6, correctAnswer: "was" },
    ],
    options: ["which", "that", "who", "was", "were", "is", "which", "was"],
    explanation: "関係代名詞「which」と過去形「was」が正解です。",
    level: "intermediate",
    category: "tenses",
  },
  {
    id: 16,
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
    id: 17,
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
    category: "tenses",
  },
  {
    id: 18,
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
    category: "tenses",
  },
  {
    id: 19,
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
    id: 20,
    sentence: "I ___ you ___ come to the party tomorrow.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "hope" },
      { id: "blank2", position: 4, correctAnswer: "will" },
    ],
    options: ["hope", "hoped", "will", "would", "can", "could", "hope", "will"],
    explanation: "現在形「hope」と未来形「will」が正解です。",
    level: "intermediate",
    category: "tenses",
  },
];

export function getGrammarQuizQuestions(
  level?: "beginner" | "intermediate" | "advanced"
): GrammarQuizQuestion[] {
  if (level) {
    return grammarQuizQuestions.filter((q) => q.level === level);
  }
  return grammarQuizQuestions;
}
