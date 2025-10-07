import { TOEICQuestion } from "../types/mockTest";

// TOEIC Part 1 - 写真描写問題
export const toeicPart1Questions: TOEICQuestion[] = [
  {
    id: "p1_001",
    part: 1,
    section: "Listening Part 1",
    questionNumber: 1,
    question:
      "Look at the picture and choose the statement that best describes what you see.",
    options: [
      "A) The man is reading a newspaper.",
      "B) The man is talking on the phone.",
      "C) The man is writing in a notebook.",
      "D) The man is looking at a computer screen.",
    ],
    correctAnswer: 3,
    explanation:
      "The man is clearly looking at a computer screen, which matches option D.",
    difficulty: "easy",
    category: "office",
    timeLimit: 30,
  },
  {
    id: "p1_002",
    part: 1,
    section: "Listening Part 1",
    questionNumber: 2,
    question:
      "Look at the picture and choose the statement that best describes what you see.",
    options: [
      "A) People are walking on the sidewalk.",
      "B) Cars are parked in a row.",
      "C) A bus is arriving at the station.",
      "D) Traffic lights are changing colors.",
    ],
    correctAnswer: 2,
    explanation:
      "The picture shows a bus arriving at a station, which corresponds to option C.",
    difficulty: "medium",
    category: "transportation",
    timeLimit: 30,
  },
];

// TOEIC Part 2 - 応答問題
export const toeicPart2Questions: TOEICQuestion[] = [
  {
    id: "p2_001",
    part: 2,
    section: "Listening Part 2",
    questionNumber: 1,
    question: "Where is the meeting room?",
    options: [
      "A) It's on the second floor.",
      "B) Yes, I'll attend the meeting.",
      "C) The meeting starts at 3 PM.",
    ],
    correctAnswer: 0,
    explanation:
      'This is a "where" question asking for location. Option A correctly provides the location.',
    audioUrl: "/audio/toeic/p2_001.mp3",
    difficulty: "easy",
    category: "office",
    timeLimit: 15,
  },
  {
    id: "p2_002",
    part: 2,
    section: "Listening Part 2",
    questionNumber: 2,
    question: "Have you finished the report?",
    options: [
      "A) I started it yesterday.",
      "B) Yes, I completed it this morning.",
      "C) The report is on your desk.",
    ],
    correctAnswer: 1,
    explanation:
      'This is a yes/no question. Option B directly answers "yes" and provides additional information.',
    audioUrl: "/audio/toeic/p2_002.mp3",
    difficulty: "medium",
    category: "work",
    timeLimit: 15,
  },
];

// TOEIC Part 3 - 会話問題
export const toeicPart3Questions: TOEICQuestion[] = [
  {
    id: "p3_001",
    part: 3,
    section: "Listening Part 3",
    questionNumber: 1,
    question: "What are the speakers discussing?",
    options: [
      "A) A business presentation",
      "B) A vacation plan",
      "C) A new restaurant",
      "D) A job interview",
    ],
    correctAnswer: 0,
    explanation:
      "The conversation is about preparing for a business presentation.",
    audioUrl: "/audio/toeic/p3_001.mp3",
    difficulty: "medium",
    category: "business",
    timeLimit: 45,
  },
];

// TOEIC Part 4 - 説明文問題
export const toeicPart4Questions: TOEICQuestion[] = [
  {
    id: "p4_001",
    part: 4,
    section: "Listening Part 4",
    questionNumber: 1,
    question: "What is the main topic of this announcement?",
    options: [
      "A) Flight delays",
      "B) Weather conditions",
      "C) Gate changes",
      "D) Security procedures",
    ],
    correctAnswer: 2,
    explanation: "The announcement is informing passengers about gate changes.",
    audioUrl: "/audio/toeic/p4_001.mp3",
    difficulty: "hard",
    category: "travel",
    timeLimit: 60,
  },
];

// TOEIC Part 5 - 短文穴埋め問題
export const toeicPart5Questions: TOEICQuestion[] = [
  {
    id: "p5_001",
    part: 5,
    section: "Reading Part 5",
    questionNumber: 1,
    question: "The company _____ its sales target by 15% last quarter.",
    options: ["A) exceed", "B) exceeded", "C) exceeding", "D) to exceed"],
    correctAnswer: 1,
    explanation:
      'The sentence requires a past tense verb to complete the action that happened "last quarter".',
    difficulty: "medium",
    category: "grammar",
    timeLimit: 20,
  },
  {
    id: "p5_002",
    part: 5,
    section: "Reading Part 5",
    questionNumber: 2,
    question: "All employees must attend the _____ meeting on Friday.",
    options: ["A) monthly", "B) month", "C) month's", "D) monthly's"],
    correctAnswer: 0,
    explanation:
      'An adjective is needed to describe the noun "meeting". "Monthly" is the correct adjective form.',
    difficulty: "easy",
    category: "grammar",
    timeLimit: 20,
  },
];

// TOEIC Part 6 - 長文穴埋め問題
export const toeicPart6Questions: TOEICQuestion[] = [
  {
    id: "p6_001",
    part: 6,
    section: "Reading Part 6",
    questionNumber: 1,
    question: "Choose the best word to fill in the blank.",
    options: ["A) Therefore", "B) However", "C) Furthermore", "D) Meanwhile"],
    correctAnswer: 1,
    explanation: '"However" indicates a contrast with the previous statement.',
    readingPassage:
      "Our company has seen significant growth this year. _____ we need to be cautious about future investments.",
    difficulty: "medium",
    category: "grammar",
    timeLimit: 30,
  },
];

// TOEIC Part 7 - 読解問題
export const toeicPart7Questions: TOEICQuestion[] = [
  {
    id: "p7_001",
    part: 7,
    section: "Reading Part 7",
    questionNumber: 1,
    question: "What is the main purpose of this email?",
    options: [
      "A) To request a meeting",
      "B) To confirm an appointment",
      "C) To cancel a reservation",
      "D) To provide directions",
    ],
    correctAnswer: 1,
    explanation:
      "The email is confirming an appointment that was previously scheduled.",
    readingPassage: `Dear Mr. Johnson,

I am writing to confirm our appointment scheduled for tomorrow, March 15th, at 2:00 PM. The meeting will take place in Conference Room A on the 3rd floor.

Please arrive 10 minutes early to allow time for security check-in. If you need to reschedule, please contact me at your earliest convenience.

Best regards,
Sarah Wilson
Administrative Assistant`,
    difficulty: "easy",
    category: "business",
    timeLimit: 45,
  },
  {
    id: "p7_002",
    part: 7,
    section: "Reading Part 7",
    questionNumber: 2,
    question: "What time should Mr. Johnson arrive for the meeting?",
    options: ["A) 1:50 PM", "B) 2:00 PM", "C) 2:10 PM", "D) 3:00 PM"],
    correctAnswer: 0,
    explanation:
      "The email states to arrive 10 minutes early for a 2:00 PM meeting, which would be 1:50 PM.",
    readingPassage: `Dear Mr. Johnson,

I am writing to confirm our appointment scheduled for tomorrow, March 15th, at 2:00 PM. The meeting will take place in Conference Room A on the 3rd floor.

Please arrive 10 minutes early to allow time for security check-in. If you need to reschedule, please contact me at your earliest convenience.

Best regards,
Sarah Wilson
Administrative Assistant`,
    difficulty: "easy",
    category: "business",
    timeLimit: 45,
  },
];

// 全問題を統合
export const allTOEICQuestions: TOEICQuestion[] = [
  ...toeicPart1Questions,
  ...toeicPart2Questions,
  ...toeicPart3Questions,
  ...toeicPart4Questions,
  ...toeicPart5Questions,
  ...toeicPart6Questions,
  ...toeicPart7Questions,
];

// パート別問題取得関数
export const getQuestionsByPart = (part: number): TOEICQuestion[] => {
  return allTOEICQuestions.filter((q) => q.part === part);
};

// 難易度別問題取得関数
export const getQuestionsByDifficulty = (
  difficulty: "easy" | "medium" | "hard"
): TOEICQuestion[] => {
  return allTOEICQuestions.filter((q) => q.difficulty === difficulty);
};

// ランダム問題選択関数
export const getRandomQuestions = (
  count: number,
  part?: number,
  difficulty?: "easy" | "medium" | "hard"
): TOEICQuestion[] => {
  let questions = allTOEICQuestions;

  if (part) {
    questions = questions.filter((q) => q.part === part);
  }

  if (difficulty) {
    questions = questions.filter((q) => q.difficulty === difficulty);
  }

  // ランダムに選択
  const shuffled = questions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
