// リスニング問題データ - TOEIC形式のリスニング問題

export interface ListeningQuestion {
  id: number;
  part: "part1" | "part2" | "part3" | "part4";
  difficulty: "beginner" | "intermediate" | "advanced";
  level: number;
  audioUrl?: string; // 音声ファイルのURL
  transcript: string; // 音声の書き起こし
  question: string; // 問題文
  choices: string[]; // 選択肢
  correctAnswer: string; // 正解
  explanation: string; // 解説
  vocabulary?: string[]; // 関連語彙
  grammar?: string[]; // 関連文法
  category?: string; // カテゴリー（ビジネス、日常会話など）
}

// TOEIC Part 1: 写真描写問題
export const part1Questions: ListeningQuestion[] = [
  {
    id: 1001,
    part: "part1",
    difficulty: "beginner",
    level: 1,
    audioUrl: "/correct01.mp3", // テスト用に既存の音声ファイルを使用
    transcript: "The woman is sitting at a desk, writing on a piece of paper.",
    question: "What is the woman doing?",
    choices: [
      "She is typing on a computer.",
      "She is writing on paper.",
      "She is reading a book.",
      "She is talking on the phone.",
    ],
    correctAnswer: "She is writing on paper.",
    explanation:
      '写真描写問題では、音声で聞こえる動作を正確に理解することが重要です。"writing on a piece of paper"が正解の手がかりです。',
    vocabulary: ["sitting", "desk", "writing", "paper"],
    grammar: ["現在進行形", "場所の前置詞"],
    category: "office",
  },
  {
    id: 1002,
    part: "part1",
    difficulty: "beginner",
    level: 1,
    audioUrl: "/correct01.mp3", // テスト用に既存の音声ファイルを使用
    transcript: "The man is standing near the window, looking outside.",
    question: "Where is the man standing?",
    choices: [
      "Near the door.",
      "Near the window.",
      "In the center of the room.",
      "Next to the table.",
    ],
    correctAnswer: "Near the window.",
    explanation: '場所を表す前置詞"near"を正確に聞き取ることがポイントです。',
    vocabulary: ["standing", "window", "looking", "outside"],
    grammar: ["現在進行形", "場所の前置詞"],
    category: "daily",
  },
  {
    id: 1003,
    part: "part1",
    difficulty: "intermediate",
    level: 2,
    audioUrl: "/correct01.mp3", // テスト用に既存の音声ファイルを使用
    transcript:
      "Several people are gathered around a conference table, discussing a document.",
    question: "What are the people doing?",
    choices: [
      "They are having lunch.",
      "They are discussing a document.",
      "They are watching a presentation.",
      "They are cleaning the room.",
    ],
    correctAnswer: "They are discussing a document.",
    explanation:
      'ビジネスシーンでよく使われる"discussing a document"という表現を聞き取ることが重要です。',
    vocabulary: ["gathered", "conference", "table", "discussing", "document"],
    grammar: ["現在進行形", "受動態"],
    category: "business",
  },
];

// TOEIC Part 2: 応答問題
export const part2Questions: ListeningQuestion[] = [
  {
    id: 2001,
    part: "part2",
    difficulty: "beginner",
    level: 1,
    audioUrl: "/audio/listening/part2/2001.mp3",
    transcript: "Question: What time is the meeting?",
    question: "How should you respond?",
    choices: [
      "Yes, I can attend.",
      "It starts at 2 PM.",
      "In the conference room.",
      "The meeting is important.",
    ],
    correctAnswer: "It starts at 2 PM.",
    explanation: "時刻を尋ねる質問には、具体的な時間で答えるのが適切です。",
    vocabulary: ["meeting", "time", "starts", "attend"],
    grammar: ["疑問詞", "時刻の表現"],
    category: "business",
  },
  {
    id: 2002,
    part: "part2",
    difficulty: "beginner",
    level: 1,
    audioUrl: "/audio/listening/part2/2002.mp3",
    transcript: "Question: Would you like some coffee?",
    question: "How should you respond?",
    choices: [
      "Yes, please.",
      "Coffee is expensive.",
      "I prefer tea.",
      "The coffee shop is closed.",
    ],
    correctAnswer: "Yes, please.",
    explanation:
      '丁寧な申し出に対しては、感謝の気持ちを込めて"Yes, please."と答えるのが自然です。',
    vocabulary: ["coffee", "expensive", "prefer", "closed"],
    grammar: ["丁寧な申し出", "would you like"],
    category: "daily",
  },
  {
    id: 2003,
    part: "part2",
    difficulty: "intermediate",
    level: 2,
    audioUrl: "/audio/listening/part2/2003.mp3",
    transcript: "Question: Why was the project delayed?",
    question: "How should you respond?",
    choices: [
      "Because of technical issues.",
      "The project is finished.",
      "I need more information.",
      "The deadline is tomorrow.",
    ],
    correctAnswer: "Because of technical issues.",
    explanation: '理由を尋ねる質問には"because of"を使って原因を説明します。',
    vocabulary: ["project", "delayed", "technical", "issues", "deadline"],
    grammar: ["理由の表現", "because of"],
    category: "business",
  },
  {
    id: 2004,
    part: "part2",
    difficulty: "intermediate",
    level: 2,
    audioUrl: "/audio/listening/part2/2004.mp3",
    transcript: "Question: Can you help me with this presentation?",
    question: "How should you respond?",
    choices: [
      "Of course. I'm free this afternoon.",
      "I don't like presentations.",
      "The presentation is tomorrow.",
      "I need more time.",
    ],
    correctAnswer: "Of course. I'm free this afternoon.",
    explanation: "依頼に対して協力的な返答をすることが重要です。",
    vocabulary: ["presentation", "help", "free", "afternoon"],
    grammar: ["依頼への返答", "時間の表現"],
    category: "business",
  },
  {
    id: 2005,
    part: "part2",
    difficulty: "advanced",
    level: 3,
    audioUrl: "/audio/listening/part2/2005.mp3",
    transcript: "Question: What's the status of the project?",
    question: "How should you respond?",
    choices: [
      "We're ahead of schedule and should finish by next Friday.",
      "I don't know about the project.",
      "The project is cancelled.",
      "We need more people.",
    ],
    correctAnswer: "We're ahead of schedule and should finish by next Friday.",
    explanation: "プロジェクトの進捗状況を具体的に報告することが重要です。",
    vocabulary: ["status", "project", "schedule", "finish", "ahead"],
    grammar: ["現在進行形", "未来の表現"],
    category: "business",
  },
];

// TOEIC Part 3: 会話問題
export const part3Questions: ListeningQuestion[] = [
  {
    id: 3001,
    part: "part3",
    difficulty: "intermediate",
    level: 2,
    audioUrl: "/audio/listening/part3/3001.mp3",
    transcript: `Woman: Hi, I'm calling about the job posting for a marketing assistant. Is the position still available?
Man: Yes, it is. Are you interested in applying?
Woman: I am. Could you tell me more about the responsibilities?
Man: Of course. The main duties include social media management, content creation, and supporting our marketing campaigns.`,
    question: "What is the woman calling about?",
    choices: [
      "A marketing campaign.",
      "A job posting.",
      "Social media management.",
      "Content creation.",
    ],
    correctAnswer: "A job posting.",
    explanation:
      '会話の冒頭で"job posting for a marketing assistant"について話していることが分かります。',
    vocabulary: [
      "posting",
      "position",
      "available",
      "applying",
      "responsibilities",
      "duties",
      "campaigns",
    ],
    grammar: ["現在完了形", "関係代名詞"],
    category: "business",
  },
  {
    id: 3002,
    part: "part3",
    difficulty: "intermediate",
    level: 3,
    audioUrl: "/audio/listening/part3/3002.mp3",
    transcript: `Man: The quarterly sales report shows a 15% increase compared to last year.
Woman: That's excellent news! Which product line performed best?
Man: Our new software products generated the highest revenue, followed by consulting services.
Woman: We should focus more resources on software development then.`,
    question: "What performed best in sales?",
    choices: [
      "Consulting services.",
      "New software products.",
      "Traditional products.",
      "Customer support.",
    ],
    correctAnswer: "New software products.",
    explanation:
      '"Our new software products generated the highest revenue"という部分が正解の手がかりです。',
    vocabulary: [
      "quarterly",
      "report",
      "increase",
      "performed",
      "revenue",
      "consulting",
      "resources",
      "development",
    ],
    grammar: ["比較級", "受動態"],
    category: "business",
  },
  {
    id: 3003,
    part: "part3",
    difficulty: "beginner",
    level: 2,
    audioUrl: "/audio/listening/part3/3003.mp3",
    transcript: `Woman: Hi Tom, how was your vacation?
Man: It was fantastic! I went to Hawaii with my family.
Woman: That sounds wonderful. What did you do there?
Man: We spent most of our time at the beach and went snorkeling.`,
    question: "What did Tom do in Hawaii?",
    choices: [
      "He went shopping.",
      "He visited museums.",
      "He went snorkeling.",
      "He attended meetings.",
    ],
    correctAnswer: "He went snorkeling.",
    explanation: "会話の中で具体的な活動を聞き取ることが重要です。",
    vocabulary: ["vacation", "Hawaii", "beach", "snorkeling"],
    grammar: ["過去形", "過去の経験"],
    category: "daily",
  },
  {
    id: 3004,
    part: "part3",
    difficulty: "advanced",
    level: 3,
    audioUrl: "/audio/listening/part3/3004.mp3",
    transcript: `Man: Sarah, I need your opinion on the new marketing strategy.
Woman: Sure, what specifically would you like to discuss?
Man: We're considering expanding into the Asian market. What are your thoughts?
Woman: I think it's a great opportunity, but we should conduct thorough market research first.`,
    question: "What does Sarah recommend?",
    choices: [
      "Immediate expansion",
      "Market research first",
      "Postponing the decision",
      "Focusing on domestic market",
    ],
    correctAnswer: "Market research first",
    explanation: "提案に対する具体的なアドバイスを聞き取ることがポイントです。",
    vocabulary: [
      "marketing",
      "strategy",
      "expanding",
      "opportunity",
      "research",
    ],
    grammar: ["動名詞", "条件文"],
    category: "business",
  },
];

// TOEIC Part 4: 説明文問題
export const part4Questions: ListeningQuestion[] = [
  {
    id: 4001,
    part: "part4",
    difficulty: "advanced",
    level: 3,
    audioUrl: "/audio/listening/part4/4001.mp3",
    transcript: `Good morning, everyone. This is Sarah Chen from the Human Resources department. I'm here to announce some important changes to our employee benefits package. Starting next month, we will be introducing a new flexible working arrangement that allows employees to work from home up to three days per week. Additionally, we're expanding our health insurance coverage to include dental and vision care. All employees will receive detailed information about these changes via email by the end of this week. If you have any questions, please don't hesitate to contact the HR department.`,
    question: "Who is making this announcement?",
    choices: [
      "The company president.",
      "Sarah Chen from HR.",
      "A department manager.",
      "An insurance representative.",
    ],
    correctAnswer: "Sarah Chen from HR.",
    explanation:
      '"This is Sarah Chen from the Human Resources department"という自己紹介が正解の手がかりです。',
    vocabulary: [
      "announce",
      "benefits",
      "package",
      "flexible",
      "arrangement",
      "coverage",
      "dental",
      "vision",
      "detailed",
      "hesitate",
    ],
    grammar: ["現在進行形", "受動態", "関係代名詞"],
    category: "business",
  },
  {
    id: 4002,
    part: "part4",
    difficulty: "advanced",
    level: 4,
    audioUrl: "/audio/listening/part4/4002.mp3",
    transcript: `Welcome to the Museum of Modern Art. Today's special exhibition features contemporary sculptures from emerging artists around the world. The exhibition will run through the end of next month, and guided tours are available every hour from 10 AM to 4 PM. Photography is permitted in most areas, but please be respectful of other visitors. Our gift shop offers a wide selection of art books and prints related to the current exhibition. For more information about upcoming events, please visit our website or speak with any of our staff members.`,
    question: "What is the main topic of this announcement?",
    choices: [
      "Art classes for children.",
      "A special sculpture exhibition.",
      "Museum membership benefits.",
      "Gift shop promotions.",
    ],
    correctAnswer: "A special sculpture exhibition.",
    explanation:
      '"Today\'s special exhibition features contemporary sculptures"という部分が正解の手がかりです。',
    vocabulary: [
      "exhibition",
      "contemporary",
      "sculptures",
      "emerging",
      "guided",
      "tours",
      "permitted",
      "respectful",
      "upcoming",
    ],
    grammar: ["現在完了形", "受動態", "分詞構文"],
    category: "culture",
  },
  {
    id: 4003,
    part: "part4",
    difficulty: "beginner",
    level: 2,
    audioUrl: "/audio/listening/part4/4003.mp3",
    transcript:
      "Attention all passengers on flight 1234 to New York. Due to weather conditions, our departure has been delayed by approximately 30 minutes. We apologize for any inconvenience and will keep you updated on any further changes. Please remain near the gate.",
    question: "What is the delay?",
    choices: ["15 minutes", "30 minutes", "45 minutes", "1 hour"],
    correctAnswer: "30 minutes",
    explanation: "遅延時間を正確に聞き取ることが重要です。",
    vocabulary: [
      "passengers",
      "departure",
      "delayed",
      "weather",
      "inconvenience",
    ],
    grammar: ["受動態", "現在完了形"],
    category: "transportation",
  },
  {
    id: 4004,
    part: "part4",
    difficulty: "advanced",
    level: 3,
    audioUrl: "/audio/listening/part4/4004.mp3",
    transcript:
      "Good morning, everyone. I'm pleased to announce that our company has achieved record-breaking quarterly profits, exceeding our target by 25%. This success is attributed to our innovative product line and dedicated team. We're now planning to expand into three new markets and hire 50 additional staff members.",
    question: "What is the company planning to do?",
    choices: [
      "Reduce staff",
      "Expand into three new markets",
      "Close some offices",
      "Change product line",
    ],
    correctAnswer: "Expand into three new markets",
    explanation: "将来の計画を聞き取ることがポイントです。",
    vocabulary: [
      "quarterly",
      "profits",
      "exceeding",
      "innovative",
      "expand",
      "markets",
    ],
    grammar: ["現在完了形", "未来の表現"],
    category: "business",
  },
];

// 全問題を統合
export const allListeningQuestions: ListeningQuestion[] = [
  ...part1Questions,
  ...part2Questions,
  ...part3Questions,
  ...part4Questions,
];

// 難易度別の問題取得
export function getListeningQuestionsByDifficulty(
  difficulty: "beginner" | "intermediate" | "advanced"
): ListeningQuestion[] {
  return allListeningQuestions.filter((q) => q.difficulty === difficulty);
}

// Part別の問題取得
export function getListeningQuestionsByPart(
  part: "part1" | "part2" | "part3" | "part4"
): ListeningQuestion[] {
  return allListeningQuestions.filter((q) => q.part === part);
}

// レベル別の問題取得
export function getListeningQuestionsByLevel(
  level: number
): ListeningQuestion[] {
  return allListeningQuestions.filter((q) => q.level === level);
}

// カテゴリー別の問題取得
export function getListeningQuestionsByCategory(
  category: string
): ListeningQuestion[] {
  return allListeningQuestions.filter((q) => q.category === category);
}

// ランダムな問題取得
export function getRandomListeningQuestions(
  count: number = 10
): ListeningQuestion[] {
  const shuffled = [...allListeningQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 特定のIDの問題取得
export function getListeningQuestionById(
  id: number
): ListeningQuestion | undefined {
  return allListeningQuestions.find((q) => q.id === id);
}
