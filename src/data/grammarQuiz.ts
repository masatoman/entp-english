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
  level: 'beginner' | 'intermediate' | 'advanced';
}

export const grammarQuizQuestions: GrammarQuizQuestion[] = [
  {
    id: 1,
    sentence: "I ___ to the store yesterday.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "went" }
    ],
    options: ["go", "went", "going", "goes"],
    explanation: "過去の時点での行動を表すため、過去形「went」が正解です。",
    level: "beginner"
  },
  {
    id: 2,
    sentence: "She ___ been studying English ___ three years.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "has" },
      { id: "blank2", position: 6, correctAnswer: "for" }
    ],
    options: ["has", "have", "for", "since", "is", "was"],
    explanation: "現在完了形「has been studying」と期間を表す「for」が正解です。",
    level: "intermediate"
  },
  {
    id: 3,
    sentence: "If I ___ rich, I ___ travel around the world.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "were" },
      { id: "blank2", position: 5, correctAnswer: "would" }
    ],
    options: ["were", "was", "would", "will", "am", "could"],
    explanation: "仮定法過去「If I were rich, I would travel」が正解です。",
    level: "advanced"
  },
  {
    id: 4,
    sentence: "The book ___ on the table ___ mine.",
    blanks: [
      { id: "blank1", position: 3, correctAnswer: "lying" },
      { id: "blank2", position: 7, correctAnswer: "is" }
    ],
    options: ["lying", "laying", "is", "are", "was", "were"],
    explanation: "「lying」（横たわっている）と単数形の「is」が正解です。",
    level: "intermediate"
  },
  {
    id: 5,
    sentence: "They ___ playing soccer when it ___ to rain.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "were" },
      { id: "blank2", position: 7, correctAnswer: "started" }
    ],
    options: ["were", "was", "started", "start", "are", "have"],
    explanation: "過去進行形「were playing」と過去形「started」が正解です。",
    level: "beginner"
  },
  {
    id: 6,
    sentence: "I wish I ___ more time to finish this project.",
    blanks: [
      { id: "blank1", position: 3, correctAnswer: "had" }
    ],
    options: ["had", "have", "has", "will have"],
    explanation: "願望を表す「I wish」の後は仮定法過去「had」を使います。",
    level: "advanced"
  },
  {
    id: 7,
    sentence: "She is ___ intelligent ___ her sister.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "as" },
      { id: "blank2", position: 4, correctAnswer: "as" }
    ],
    options: ["as", "so", "more", "most", "than", "very"],
    explanation: "同等比較「as ... as」の構文が正解です。",
    level: "intermediate"
  },
  {
    id: 8,
    sentence: "By the time you arrive, I ___ finished my homework.",
    blanks: [
      { id: "blank1", position: 7, correctAnswer: "will have" }
    ],
    options: ["will have", "will", "have", "had", "would have"],
    explanation: "未来完了形「will have finished」が正解です。",
    level: "advanced"
  },
  {
    id: 9,
    sentence: "The movie ___ we watched last night ___ very exciting.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "that" },
      { id: "blank2", position: 7, correctAnswer: "was" }
    ],
    options: ["that", "which", "who", "was", "were", "is"],
    explanation: "関係代名詞「that」と過去形「was」が正解です。",
    level: "intermediate"
  },
  {
    id: 10,
    sentence: "He ___ to be working hard, but he was actually sleeping.",
    blanks: [
      { id: "blank1", position: 2, correctAnswer: "appeared" }
    ],
    options: ["appeared", "seems", "looks", "appears"],
    explanation: "過去の状況を表すため過去形「appeared」が正解です。",
    level: "intermediate"
  }
];

export function getGrammarQuizQuestions(level?: 'beginner' | 'intermediate' | 'advanced'): GrammarQuizQuestion[] {
  if (level) {
    return grammarQuizQuestions.filter(q => q.level === level);
  }
  return grammarQuizQuestions;
}