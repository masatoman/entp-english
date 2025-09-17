import { EssayPrompt } from "../types/essay";

/**
 * 英作文プロンプトデータ
 * 文法クイズ・ガチャ語彙・事前学習との相乗効果を重視
 */
export const essayPrompts: EssayPrompt[] = [
  // 基本文型連携
  {
    id: "basic-grammar-intro",
    title: "自己紹介文を書こう",
    category: "grammar",
    subcategory: "basic-grammar",
    difficulty: "beginner",
    level: 1,
    promptType: "guided",
    instruction: "英語で簡単な自己紹介を3-4文で書いてください。",
    context: "初めて会う人に自分のことを紹介する場面です。",
    keyWords: ["student", "work", "like", "live"],
    grammarFocus: ["be動詞", "一般動詞", "SVO構造"],
    evaluationCriteria: {
      grammar: 40,
      vocabulary: 20,
      fluency: 30,
      creativity: 10,
    },
    sampleAnswers: [
      {
        level: "basic",
        text: "I am Taro. I am a student. I like music. I live in Tokyo.",
        explanation: "基本的なbe動詞と一般動詞を使った簡潔な自己紹介",
        grammarPoints: ["be動詞の基本形", "一般動詞の現在形"],
        vocabularyHighlights: ["student", "like", "live"],
      },
      {
        level: "good",
        text: "My name is Taro Yamada. I am a university student studying English. I enjoy listening to music and reading books. I live in Tokyo with my family.",
        explanation: "より詳細で自然な表現を使った自己紹介",
        grammarPoints: ["現在進行形", "動名詞", "前置詞句"],
        vocabularyHighlights: ["university", "studying", "enjoy", "listening"],
      },
    ],
    relatedGrammarCategories: ["basic-grammar"],
    relatedPreStudyContent: ["basic-grammar-theory"],
  },

  // 時制連携
  {
    id: "tenses-weekend-plan",
    title: "週末の予定を説明しよう",
    category: "grammar",
    subcategory: "tenses",
    difficulty: "beginner",
    level: 2,
    promptType: "guided",
    instruction:
      "今度の週末の予定について、過去・現在・未来の時制を使って4-5文で書いてください。",
    context: "友人に週末の予定を説明する場面です。",
    keyWords: ["weekend", "plan", "yesterday", "today", "tomorrow"],
    grammarFocus: ["現在形", "過去形", "未来形"],
    evaluationCriteria: {
      grammar: 50,
      vocabulary: 20,
      fluency: 25,
      creativity: 5,
    },
    sampleAnswers: [
      {
        level: "basic",
        text: "Yesterday I studied English. Today I am working. Tomorrow I will go shopping. I will meet my friends on Sunday.",
        explanation: "基本的な時制を正しく使い分けた表現",
        grammarPoints: ["過去形", "現在進行形", "未来形will"],
        vocabularyHighlights: ["studied", "working", "shopping", "meet"],
      },
      {
        level: "excellent",
        text: "Last weekend I visited my grandparents in the countryside. Today I'm preparing for next week's presentation at work. Tomorrow I'm planning to go to the new art museum that opened recently. On Sunday, I will have lunch with my college friends and we'll catch up on each other's lives.",
        explanation: "複雑な時制と自然な表現を組み合わせた高度な文章",
        grammarPoints: ["過去形", "現在進行形", "be going to", "未来完了"],
        vocabularyHighlights: [
          "visited",
          "countryside",
          "preparing",
          "presentation",
          "museum",
          "catch up",
        ],
      },
    ],
    relatedGrammarCategories: ["tenses"],
    relatedPreStudyContent: ["tenses-theory"],
  },

  // 助動詞連携
  {
    id: "modals-business-request",
    title: "丁寧なビジネス依頼文を書こう",
    category: "grammar",
    subcategory: "modals",
    difficulty: "intermediate",
    level: 3,
    promptType: "guided",
    instruction:
      "同僚に仕事の依頼をする丁寧なメールを3-4文で書いてください。助動詞を必ず使用してください。",
    context: "忙しい同僚に追加の作業をお願いする場面です。",
    keyWords: ["could", "would", "please", "help", "appreciate"],
    grammarFocus: ["助動詞", "丁寧表現", "依頼文"],
    evaluationCriteria: {
      grammar: 35,
      vocabulary: 25,
      fluency: 30,
      creativity: 10,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "Could you please help me with the report? I would appreciate it if you could review the data. Would you mind checking the calculations? Thank you for your time.",
        explanation: "基本的な助動詞を使った丁寧な依頼表現",
        grammarPoints: ["Could you", "would appreciate", "Would you mind"],
        vocabularyHighlights: ["appreciate", "review", "calculations"],
      },
      {
        level: "excellent",
        text: "I hope this email finds you well. I was wondering if you might be able to assist me with the quarterly report that's due next week. Would it be possible for you to review the financial data and provide your insights? I would greatly appreciate any feedback you could offer, and I understand if you're too busy at the moment.",
        explanation: "非常に丁寧で自然なビジネス英語表現",
        grammarPoints: [
          "I was wondering if",
          "might be able to",
          "Would it be possible",
          "would greatly appreciate",
        ],
        vocabularyHighlights: [
          "quarterly",
          "assist",
          "financial",
          "insights",
          "feedback",
        ],
      },
    ],
    relatedGrammarCategories: ["modals"],
    relatedPreStudyContent: ["modals-theory"],
  },

  // ガチャ語彙活用
  {
    id: "vocabulary-toeic-business",
    title: "TOEIC語彙を使ったビジネス場面描写",
    category: "vocabulary",
    difficulty: "intermediate",
    level: 3,
    promptType: "guided",
    instruction:
      "あなたが獲得したTOEIC語彙カードから5個以上の単語を使って、ビジネス会議の様子を4-5文で描写してください。",
    context: "重要なプロジェクトの会議が行われている場面です。",
    grammarFocus: ["現在進行形", "受動態", "関係詞"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 40,
      fluency: 25,
      creativity: 5,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "The meeting is being conducted in the conference room. The manager is presenting the quarterly report to the team. Several important issues are being discussed by the participants. The deadline for the project has been extended until next month.",
        explanation: "TOEIC頻出語彙と基本的な文法を組み合わせた表現",
        grammarPoints: ["現在進行受動態", "現在完了受動態"],
        vocabularyHighlights: [
          "conducted",
          "conference",
          "quarterly",
          "participants",
          "deadline",
          "extended",
        ],
      },
    ],
    relatedGrammarCategories: ["passive", "tenses"],
    relatedPreStudyContent: ["toeic-vocabulary-strategy"],
  },

  // 複合文法（関係詞）
  {
    id: "relative-clauses-description",
    title: "関係詞を使った人物・場所の説明",
    category: "grammar",
    subcategory: "relative",
    difficulty: "intermediate",
    level: 5,
    promptType: "guided",
    instruction:
      "あなたの尊敬する人について、関係詞（who, which, that）を使って4-5文で説明してください。",
    context: "友人にあなたが尊敬する人について紹介する場面です。",
    grammarFocus: ["関係代名詞", "関係副詞"],
    evaluationCriteria: {
      grammar: 45,
      vocabulary: 25,
      fluency: 25,
      creativity: 5,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "The person whom I respect most is my English teacher who taught me in high school. She is someone who always encouraged students to challenge themselves. The teaching method which she used was very effective. I still remember the advice that she gave me about studying abroad.",
        explanation: "様々な関係詞を適切に使用した説明文",
        grammarPoints: [
          "関係代名詞whom",
          "関係代名詞who",
          "関係代名詞which",
          "関係代名詞that",
        ],
        vocabularyHighlights: [
          "respect",
          "encouraged",
          "challenge",
          "effective",
          "advice",
        ],
      },
    ],
    relatedGrammarCategories: ["relative"],
    relatedPreStudyContent: ["relative-theory"],
  },

  // 仮定法応用
  {
    id: "subjunctive-career-dreams",
    title: "仮定法を使った理想のキャリア描写",
    category: "grammar",
    subcategory: "subjunctive",
    difficulty: "advanced",
    level: 6,
    promptType: "free-writing",
    instruction:
      "もし理想的な条件が整ったら、どのようなキャリアを築きたいか仮定法を使って5-6文で書いてください。",
    context: "キャリアカウンセラーとの面談で将来の夢を語る場面です。",
    grammarFocus: ["仮定法過去", "仮定法過去完了", "wishの用法"],
    evaluationCriteria: {
      grammar: 40,
      vocabulary: 30,
      fluency: 20,
      creativity: 10,
    },
    sampleAnswers: [
      {
        level: "excellent",
        text: "If I had unlimited resources, I would establish my own international consulting firm. I wish I could travel to different countries and help businesses expand globally. If I had studied business administration earlier, I would have been better prepared for this career path. I would hire talented people who share my vision, and we would make a positive impact on the world economy.",
        explanation: "複雑な仮定法表現を使った創造的な文章",
        grammarPoints: [
          "仮定法過去",
          "I wish + 仮定法",
          "仮定法過去完了",
          "関係詞との組み合わせ",
        ],
        vocabularyHighlights: [
          "unlimited",
          "establish",
          "consulting",
          "expand",
          "administration",
          "impact",
          "economy",
        ],
      },
    ],
    relatedGrammarCategories: ["subjunctive"],
    relatedPreStudyContent: ["subjunctive-theory"],
  },

  // 混合応用（事前学習統合）
  {
    id: "mixed-presentation-prep",
    title: "プレゼンテーション準備の説明",
    category: "mixed",
    difficulty: "advanced",
    level: 7,
    promptType: "free-writing",
    instruction:
      "重要なプレゼンテーションの準備過程について、様々な文法項目と語彙を使って6-8文で説明してください。",
    context: "上司にプレゼンテーションの準備状況を報告する場面です。",
    grammarFocus: ["複合時制", "受動態", "分詞構文", "関係詞"],
    evaluationCriteria: {
      grammar: 35,
      vocabulary: 35,
      fluency: 20,
      creativity: 10,
    },
    sampleAnswers: [
      {
        level: "excellent",
        text: "Having analyzed the market data thoroughly, I have been preparing a comprehensive presentation for next week's board meeting. The slides that I created yesterday incorporate the latest research findings which were published by our analytics team. While reviewing the content, I realized that some additional charts would be needed to support our recommendations. The presentation, which will be delivered to senior executives, focuses on strategic initiatives that could significantly improve our market position. I am confident that the proposal will be well-received by the audience.",
        explanation: "高度な文法構造と豊富な語彙を組み合わせた専門的な文章",
        grammarPoints: [
          "分詞構文",
          "現在完了進行形",
          "関係詞",
          "受動態",
          "複合文",
        ],
        vocabularyHighlights: [
          "analyzed",
          "comprehensive",
          "incorporate",
          "findings",
          "analytics",
          "executives",
          "initiatives",
          "significantly",
          "proposal",
        ],
      },
    ],
    relatedGrammarCategories: ["participle", "relative", "passive", "tenses"],
    relatedPreStudyContent: ["writing-strategy", "toeic-vocabulary-strategy"],
  },
];

/**
 * レベル別プロンプト取得
 */
export function getEssayPromptsForLevel(userLevel: number): EssayPrompt[] {
  return essayPrompts.filter((prompt) => prompt.level <= userLevel);
}

/**
 * カテゴリー別プロンプト取得
 */
export function getEssayPromptsByCategory(category: string): EssayPrompt[] {
  if (category === "all") return essayPrompts;
  return essayPrompts.filter((prompt) => prompt.category === category);
}

/**
 * 文法カテゴリーに対応するプロンプト取得
 */
export function getEssayPromptsForGrammarCategory(
  grammarCategory: string
): EssayPrompt[] {
  return essayPrompts.filter(
    (prompt) => prompt.subcategory === grammarCategory
  );
}

/**
 * ユーザーのガチャ語彙に基づくプロンプト推奨
 */
export function getRecommendedPromptsForVocabulary(
  userVocabulary: string[]
): EssayPrompt[] {
  return essayPrompts.filter((prompt) => {
    if (!prompt.keyWords) return false;
    return prompt.keyWords.some((word) => userVocabulary.includes(word));
  });
}

/**
 * 文法学習進捗に基づくプロンプト推奨
 */
export function getRecommendedPromptsForGrammar(
  completedGrammarCategories: string[]
): EssayPrompt[] {
  return essayPrompts.filter((prompt) => {
    if (!prompt.relatedGrammarCategories) return false;
    return prompt.relatedGrammarCategories.some((category) =>
      completedGrammarCategories.includes(category)
    );
  });
}
