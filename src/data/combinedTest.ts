export interface CombinedTestQuestion {
  id: number;
  instruction: string; // 問題の指示
  vocabulary: string[]; // 使用する単語リスト
  grammarPattern: string; // 文法パターン（例: "第3文型", "現在完了形"）
  type: 'multiple-choice' | 'text-input';
  options?: string[]; // 選択肢（multiple-choiceの場合）
  correctAnswer: string;
  explanation: string;
  timeLimit: number; // 秒
  xpReward: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const combinedTestQuestions: CombinedTestQuestion[] = [
  {
    id: 1,
    instruction: "次の単語を使って第3文型（SVO）で文を作ってください",
    vocabulary: ["I", "read", "book"],
    grammarPattern: "第3文型（SVO）",
    type: "multiple-choice",
    options: [
      "I read a book.",
      "I am reading book.",
      "Book read I.",
      "Reading I a book."
    ],
    correctAnswer: "I read a book.",
    explanation: "第3文型は「主語 + 動詞 + 目的語」の順序で構成されます。",
    timeLimit: 30,
    xpReward: 10,
    difficulty: "beginner"
  },
  {
    id: 2,
    instruction: "「play」と「tennis」を使って現在進行形で文を作ってください",
    vocabulary: ["play", "tennis"],
    grammarPattern: "現在進行形",
    type: "text-input",
    correctAnswer: "I am playing tennis",
    explanation: "現在進行形は「be動詞 + 動詞のing形」で表します。",
    timeLimit: 45,
    xpReward: 15,
    difficulty: "beginner"
  },
  {
    id: 3,
    instruction: "次の単語を使って現在完了形で文を作ってください",
    vocabulary: ["She", "finish", "homework"],
    grammarPattern: "現在完了形",
    type: "multiple-choice",
    options: [
      "She has finished her homework.",
      "She finished her homework.",
      "She is finishing homework.",
      "She will finish homework."
    ],
    correctAnswer: "She has finished her homework.",
    explanation: "現在完了形は「have/has + 過去分詞」で表します。",
    timeLimit: 40,
    xpReward: 20,
    difficulty: "intermediate"
  },
  {
    id: 4,
    instruction: "「give」を使って第4文型（SVOO）で文を作ってください",
    vocabulary: ["I", "give", "gift", "friend"],
    grammarPattern: "第4文型（SVOO）",
    type: "text-input",
    correctAnswer: "I gave my friend a gift",
    explanation: "第4文型は「主語 + 動詞 + 間接目的語 + 直接目的語」の構造です。",
    timeLimit: 50,
    xpReward: 25,
    difficulty: "intermediate"
  },
  {
    id: 5,
    instruction: "次の単語を使って受動態で文を作ってください",
    vocabulary: ["The door", "open", "someone"],
    grammarPattern: "受動態",
    type: "multiple-choice",
    options: [
      "The door was opened by someone.",
      "Someone opened the door.",
      "The door is opening someone.",
      "Someone was opening door."
    ],
    correctAnswer: "The door was opened by someone.",
    explanation: "受動態は「be動詞 + 過去分詞」で表し、動作主は「by」で表します。",
    timeLimit: 45,
    xpReward: 20,
    difficulty: "intermediate"
  },
  {
    id: 6,
    instruction: "「study」と「hard」を使って比較級で文を作ってください",
    vocabulary: ["study", "hard", "than"],
    grammarPattern: "比較級",
    type: "text-input",
    correctAnswer: "I study harder than before",
    explanation: "比較級は「-er」をつけるか「more + 形容詞/副詞」で表します。",
    timeLimit: 40,
    xpReward: 18,
    difficulty: "intermediate"
  },
  {
    id: 7,
    instruction: "次の単語を使って関係代名詞の文を作ってください",
    vocabulary: ["book", "I", "read", "interesting"],
    grammarPattern: "関係代名詞",
    type: "multiple-choice",
    options: [
      "The book that I read was interesting.",
      "The book I read was interesting that.",
      "I read the book was interesting.",
      "That book I read interesting."
    ],
    correctAnswer: "The book that I read was interesting.",
    explanation: "関係代名詞「that」は先行詞を修飾する節を導きます。",
    timeLimit: 60,
    xpReward: 30,
    difficulty: "advanced"
  },
  {
    id: 8,
    instruction: "「If」を使って仮定法過去で文を作ってください",
    vocabulary: ["If", "I", "be", "rich", "travel"],
    grammarPattern: "仮定法過去",
    type: "text-input",
    correctAnswer: "If I were rich, I would travel around the world",
    explanation: "仮定法過去は「If + 過去形, would + 原形」の構造です。be動詞は「were」を使います。",
    timeLimit: 60,
    xpReward: 35,
    difficulty: "advanced"
  },
  {
    id: 9,
    instruction: "次の単語を使って分詞構文で文を作ってください",
    vocabulary: ["Walking", "park", "I", "meet", "friend"],
    grammarPattern: "分詞構文",
    type: "multiple-choice",
    options: [
      "Walking in the park, I met my friend.",
      "I walking in the park met friend.",
      "I met friend walking in the park.",
      "Walking I met friend in the park."
    ],
    correctAnswer: "Walking in the park, I met my friend.",
    explanation: "分詞構文は動詞のing形で始まり、主文の前に置かれることが多いです。",
    timeLimit: 55,
    xpReward: 28,
    difficulty: "advanced"
  },
  {
    id: 10,
    instruction: "「want」と「to」を使って不定詞の文を作ってください",
    vocabulary: ["I", "want", "to", "learn", "English"],
    grammarPattern: "不定詞",
    type: "text-input",
    correctAnswer: "I want to learn English",
    explanation: "不定詞「to + 動詞の原形」は目的や願望を表すときによく使われます。",
    timeLimit: 35,
    xpReward: 15,
    difficulty: "beginner"
  }
];

export function getCombinedTestQuestions(difficulty?: 'beginner' | 'intermediate' | 'advanced'): CombinedTestQuestion[] {
  if (difficulty) {
    return combinedTestQuestions.filter(q => q.difficulty === difficulty);
  }
  return combinedTestQuestions;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}