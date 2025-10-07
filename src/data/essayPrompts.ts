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

  // === 日常英語カテゴリー ===
  
  // 日常会話・初級
  {
    id: "daily-morning-routine",
    title: "朝のルーティンを説明しよう",
    category: "daily",
    subcategory: "routine",
    difficulty: "beginner",
    level: 1,
    promptType: "guided",
    instruction: "あなたの平日の朝のルーティンを3-4文で英語で書いてください。",
    context: "新しい友人にあなたの日常について話している場面です。",
    keyWords: ["wake up", "breakfast", "shower", "work", "school"],
    grammarFocus: ["現在形", "時刻表現", "頻度副詞"],
    evaluationCriteria: {
      grammar: 35,
      vocabulary: 25,
      fluency: 30,
      creativity: 10,
    },
    sampleAnswers: [
      {
        level: "basic",
        text: "I wake up at 7 AM every day. I take a shower and eat breakfast. Then I go to work by train.",
        explanation: "基本的な現在形と時間表現を使った簡潔な説明",
        grammarPoints: ["現在形", "時刻表現", "前置詞"],
        vocabularyHighlights: ["wake up", "shower", "breakfast"],
      },
      {
        level: "good",
        text: "I usually wake up at 6:30 AM on weekdays. After taking a quick shower, I prepare a simple breakfast with coffee and toast. I always check the news on my phone while eating, and then I leave for the office around 8 AM.",
        explanation: "頻度副詞と詳細な表現を使った自然な説明",
        grammarPoints: ["頻度副詞", "動名詞", "時間表現"],
        vocabularyHighlights: ["usually", "prepare", "simple", "check", "office"],
      },
    ],
    relatedGrammarCategories: ["basic-grammar", "tenses"],
    relatedPreStudyContent: ["basic-grammar-theory"],
  },

  {
    id: "daily-hobby-description",
    title: "趣味について詳しく説明しよう",
    category: "daily",
    subcategory: "hobbies",
    difficulty: "beginner",
    level: 2,
    promptType: "guided",
    instruction: "あなたの趣味について、なぜそれが好きなのかも含めて4-5文で書いてください。",
    context: "趣味のサークルで自己紹介をする場面です。",
    keyWords: ["hobby", "enjoy", "because", "interesting", "fun"],
    grammarFocus: ["現在形", "理由表現", "形容詞"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 30,
      fluency: 30,
      creativity: 10,
    },
    sampleAnswers: [
      {
        level: "basic",
        text: "My hobby is reading books. I enjoy reading because it is interesting. I like mystery novels. Reading helps me relax after work.",
        explanation: "基本的な理由表現と現在形を使った趣味の説明",
        grammarPoints: ["現在形", "because文", "動名詞"],
        vocabularyHighlights: ["hobby", "enjoy", "interesting", "mystery", "relax"],
      },
      {
        level: "excellent",
        text: "Photography has been my passion for over five years now. I'm particularly drawn to landscape photography because it allows me to explore nature and capture its beauty. What I love most about this hobby is that it encourages me to travel to new places and see the world from different perspectives. Through photography, I've learned to appreciate the small details in everyday life that most people overlook.",
        explanation: "現在完了と複雑な理由表現を使った詳細な趣味の説明",
        grammarPoints: ["現在完了", "受動態", "関係詞", "分詞構文"],
        vocabularyHighlights: ["passion", "particularly", "landscape", "capture", "perspectives", "appreciate", "overlook"],
      },
    ],
    relatedGrammarCategories: ["basic-grammar", "tenses"],
    relatedPreStudyContent: ["basic-grammar-theory"],
  },

  {
    id: "daily-weekend-activities",
    title: "理想的な週末の過ごし方",
    category: "daily",
    subcategory: "weekend",
    difficulty: "intermediate",
    level: 3,
    promptType: "guided",
    instruction: "あなたにとって理想的な週末の過ごし方について5-6文で書いてください。",
    context: "友人と週末の計画について話し合っている場面です。",
    keyWords: ["weekend", "relax", "spend", "would like", "perfect"],
    grammarFocus: ["仮定法", "願望表現", "条件文"],
    evaluationCriteria: {
      grammar: 35,
      vocabulary: 25,
      fluency: 30,
      creativity: 10,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "My perfect weekend would start with sleeping in until 9 AM. I would like to spend Saturday morning at a local café, reading a good book with fresh coffee. In the afternoon, I'd meet friends for a walk in the park or visit a museum. On Sunday, I prefer to stay home, cook something special, and prepare for the upcoming week. This kind of weekend helps me feel refreshed and ready for work.",
        explanation: "仮定法と願望表現を使った理想の週末描写",
        grammarPoints: ["仮定法", "would like to", "prefer to", "動名詞"],
        vocabularyHighlights: ["perfect", "sleeping in", "local", "fresh", "upcoming", "refreshed"],
      },
    ],
    relatedGrammarCategories: ["subjunctive", "modals"],
    relatedPreStudyContent: ["subjunctive-theory"],
  },

  // === ビジネス英語カテゴリー ===

  {
    id: "business-meeting-summary",
    title: "会議の要点をまとめよう",
    category: "business",
    subcategory: "meetings",
    difficulty: "intermediate",
    level: 4,
    promptType: "guided",
    instruction: "重要な会議の内容と決定事項について、上司への報告として4-5文で書いてください。",
    context: "会議に参加できなかった上司に内容を報告する場面です。",
    keyWords: ["meeting", "discussed", "decided", "action", "deadline"],
    grammarFocus: ["過去形", "受動態", "報告表現"],
    evaluationCriteria: {
      grammar: 35,
      vocabulary: 35,
      fluency: 25,
      creativity: 5,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "Today's marketing meeting focused on the Q4 campaign strategy. We discussed three different approaches and decided to proceed with the digital-first option. The budget was approved for $50,000, and the creative team will start working on the materials next week. The campaign launch is scheduled for October 15th, and I'll coordinate with the external agency to ensure we meet this deadline.",
        explanation: "ビジネス会議の要点を的確にまとめた報告文",
        grammarPoints: ["過去形", "受動態", "未来表現", "関係詞"],
        vocabularyHighlights: ["focused", "approaches", "proceed", "digital-first", "approved", "coordinate", "external", "ensure"],
      },
    ],
    relatedGrammarCategories: ["passive", "tenses"],
    relatedPreStudyContent: ["business-communication"],
  },

  {
    id: "business-email-apology",
    title: "遅延の謝罪メールを書こう",
    category: "business",
    subcategory: "email",
    difficulty: "intermediate",
    level: 4,
    promptType: "guided",
    instruction: "プロジェクトの遅延について顧客に謝罪し、解決策を提示するメールを5-6文で書いてください。",
    context: "重要な顧客に対してプロジェクトの遅延を謝罪する場面です。",
    keyWords: ["apologize", "delay", "inconvenience", "solution", "commitment"],
    grammarFocus: ["謝罪表現", "説明文", "提案文"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 35,
      fluency: 30,
      creativity: 5,
    },
    sampleAnswers: [
      {
        level: "excellent",
        text: "I sincerely apologize for the unexpected delay in delivering your website project. Due to some technical complications that arose during the final testing phase, we need an additional two weeks to ensure the highest quality standards. To minimize any inconvenience this may cause, we're offering a 15% discount on the total project cost and will provide priority support during the launch phase. I personally guarantee that the revised deadline of March 15th will be met, and I'll send you weekly progress updates until completion. Thank you for your patience and understanding during this time.",
        explanation: "プロフェッショナルな謝罪と具体的な解決策を提示したビジネスメール",
        grammarPoints: ["現在完了", "受動態", "未来表現", "関係詞"],
        vocabularyHighlights: ["sincerely", "unexpected", "complications", "minimize", "inconvenience", "priority", "guarantee", "revised", "completion"],
      },
    ],
    relatedGrammarCategories: ["modals", "tenses"],
    relatedPreStudyContent: ["business-communication"],
  },

  {
    id: "business-proposal-pitch",
    title: "新企画の提案文を書こう",
    category: "business",
    subcategory: "proposals",
    difficulty: "advanced",
    level: 5,
    promptType: "free-writing",
    instruction: "あなたの部署の新しいプロジェクト企画を経営陣に提案する文章を6-8文で書いてください。",
    context: "経営会議で新企画の承認を求める場面です。",
    keyWords: ["propose", "innovative", "revenue", "market", "investment"],
    grammarFocus: ["提案表現", "数値表現", "将来予測"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 40,
      fluency: 25,
      creativity: 5,
    },
    sampleAnswers: [
      {
        level: "excellent",
        text: "I would like to propose an innovative mobile application that targets the growing remote work market. Based on our market research, this segment is expected to grow by 25% annually over the next three years, representing a significant revenue opportunity. The proposed app would integrate project management, video conferencing, and team collaboration features in a single platform. With an initial investment of $500,000, we project breaking even within 18 months and generating $2M in annual revenue by year three. Our development team has already created a prototype, and early user feedback has been overwhelmingly positive. I believe this project aligns perfectly with our company's digital transformation strategy and would position us as leaders in the remote work solutions market.",
        explanation: "データに基づいた説得力のある新企画提案文",
        grammarPoints: ["提案表現", "受動態", "現在完了", "条件文"],
        vocabularyHighlights: ["innovative", "targets", "segment", "integrate", "collaboration", "investment", "prototype", "overwhelmingly", "aligns", "transformation"],
      },
    ],
    relatedGrammarCategories: ["modals", "passive", "tenses"],
    relatedPreStudyContent: ["business-communication", "presentation-skills"],
  },

  // === TOEIC Writing形式 ===

  {
    id: "toeic-opinion-essay",
    title: "TOEIC意見論述：リモートワークについて",
    category: "toeic",
    subcategory: "opinion",
    difficulty: "intermediate",
    level: 4,
    promptType: "structured",
    instruction: "Some companies allow employees to work from home. Do you think this is a good idea? Give reasons and examples to support your opinion. Write 150-200 words.",
    context: "TOEIC Writing Task 2: Opinion Essay形式",
    keyWords: ["remote work", "productivity", "flexibility", "communication", "balance"],
    grammarFocus: ["意見表現", "理由説明", "例示表現"],
    evaluationCriteria: {
      grammar: 25,
      vocabulary: 25,
      fluency: 25,
      creativity: 25,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "I believe that allowing employees to work from home is an excellent idea for several reasons. First, remote work offers greater flexibility, enabling workers to better balance their personal and professional lives. For example, parents can attend their children's school events without taking time off. Second, working from home can increase productivity by eliminating commute time and office distractions. Many studies show that remote workers are often more focused and efficient. However, companies need to ensure proper communication tools are in place to maintain team collaboration. Video conferences and project management software can bridge the gap between remote team members. Overall, the benefits of remote work outweigh the challenges, making it a valuable option for modern businesses.",
        explanation: "TOEIC Writing形式に適した構造化された意見文",
        grammarPoints: ["意見表現", "理由列挙", "例示", "比較表現"],
        vocabularyHighlights: ["flexibility", "enabling", "balance", "eliminate", "distractions", "efficient", "collaboration", "bridge", "outweigh"],
      },
    ],
    relatedGrammarCategories: ["modals", "comparison"],
    relatedPreStudyContent: ["writing-strategy", "toeic-vocabulary-strategy"],
  },

  {
    id: "toeic-email-response",
    title: "TOEIC Eメール返信：会議スケジュール",
    category: "toeic",
    subcategory: "email",
    difficulty: "intermediate",
    level: 3,
    promptType: "structured",
    instruction: "You received an email about rescheduling a meeting. Write a response (120-150 words) confirming your availability and suggesting alternative times.",
    context: "TOEIC Writing Task 1: Email Response形式",
    keyWords: ["reschedule", "availability", "confirm", "alternative", "convenient"],
    grammarFocus: ["丁寧表現", "時間表現", "提案文"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 30,
      fluency: 30,
      creativity: 10,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "Dear Mr. Johnson, Thank you for your email regarding the rescheduling of our quarterly review meeting. I understand that the original time on Friday, March 10th at 2 PM is no longer convenient for you. I am flexible with my schedule and can accommodate the change. I would like to suggest the following alternative times: Thursday, March 9th at 10 AM or 3 PM, or Friday, March 10th at 9 AM or 4 PM. Please let me know which option works best for your schedule. I will send out updated calendar invitations once we confirm the new time. Looking forward to our productive discussion about the quarterly results. Best regards, [Your name]",
        explanation: "TOEIC Email形式に適した丁寧で実用的なビジネスメール",
        grammarPoints: ["丁寧表現", "時間表現", "提案文", "未来表現"],
        vocabularyHighlights: ["regarding", "rescheduling", "quarterly", "convenient", "accommodate", "alternative", "invitations", "productive"],
      },
    ],
    relatedGrammarCategories: ["modals", "tenses"],
    relatedPreStudyContent: ["business-communication"],
  },

  // === アカデミック英語カテゴリー ===

  {
    id: "academic-research-summary",
    title: "研究論文の要約を書こう",
    category: "academic",
    subcategory: "research",
    difficulty: "advanced",
    level: 6,
    promptType: "structured",
    instruction: "あなたが興味を持っている分野の研究について、その目的・方法・結果を5-6文で要約してください。",
    context: "学会発表の抄録を作成する場面です。",
    keyWords: ["research", "methodology", "findings", "analysis", "conclusion"],
    grammarFocus: ["学術表現", "受動態", "客観的記述"],
    evaluationCriteria: {
      grammar: 35,
      vocabulary: 40,
      fluency: 20,
      creativity: 5,
    },
    sampleAnswers: [
      {
        level: "excellent",
        text: "This study investigates the impact of artificial intelligence on language learning efficiency among university students. A total of 200 participants were randomly assigned to either an AI-assisted learning group or a traditional classroom control group over a 12-week period. The methodology involved pre- and post-tests, weekly progress assessments, and qualitative interviews. Results indicate that students using AI tools showed a 35% improvement in vocabulary retention and 28% better performance in speaking fluency compared to the control group. The findings suggest that AI integration can significantly enhance language acquisition when combined with structured pedagogical approaches. These results have important implications for educational technology implementation in higher education institutions.",
        explanation: "学術論文スタイルの客観的で詳細な研究要約",
        grammarPoints: ["受動態", "現在形", "比較表現", "分詞構文"],
        vocabularyHighlights: ["investigates", "randomly assigned", "methodology", "assessments", "qualitative", "retention", "acquisition", "pedagogical", "implications", "implementation"],
      },
    ],
    relatedGrammarCategories: ["passive", "comparison"],
    relatedPreStudyContent: ["academic-writing"],
  },

  {
    id: "academic-argument-essay",
    title: "論証エッセイ：教育の未来",
    category: "academic",
    subcategory: "argument",
    difficulty: "advanced",
    level: 7,
    promptType: "free-writing",
    instruction: "「オンライン教育は従来の対面教育に完全に取って代わることができるか」について、あなたの立場を明確にし、論理的に論証してください（200-250語）。",
    context: "大学の論文試験での論証問題です。",
    keyWords: ["online education", "traditional", "replace", "advantages", "limitations"],
    grammarFocus: ["論証表現", "対比表現", "結論文"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 35,
      fluency: 25,
      creativity: 10,
    },
    sampleAnswers: [
      {
        level: "excellent",
        text: "While online education has revolutionized learning accessibility and flexibility, I argue that it cannot completely replace traditional face-to-face education due to fundamental limitations in human interaction and practical skill development. Online platforms excel in delivering theoretical content and accommodating diverse learning schedules, particularly benefiting working professionals and geographically isolated students. However, traditional education provides irreplaceable elements such as spontaneous classroom discussions, immediate feedback, and collaborative problem-solving that foster critical thinking skills. Furthermore, subjects requiring hands-on experience, laboratory work, or clinical practice cannot be adequately replicated in virtual environments. The most effective educational approach likely involves a hybrid model that combines the convenience and accessibility of online learning with the interpersonal dynamics and practical components of traditional education. This balanced approach maximizes the strengths of both methodologies while addressing their respective limitations, ultimately providing students with a more comprehensive and well-rounded educational experience.",
        explanation: "学術的な論証構造を持つ高度な議論文",
        grammarPoints: ["複合文", "分詞構文", "比較級・最上級", "仮定法"],
        vocabularyHighlights: ["revolutionized", "accessibility", "fundamental", "accommodating", "geographically", "irreplaceable", "spontaneous", "collaborative", "adequately", "replicated", "comprehensive"],
      },
    ],
    relatedGrammarCategories: ["comparison", "subjunctive", "relative"],
    relatedPreStudyContent: ["academic-writing", "critical-thinking"],
  },

  // === 創作・物語カテゴリー ===

  {
    id: "creative-short-story",
    title: "短編ストーリーを書こう",
    category: "creative",
    subcategory: "story",
    difficulty: "intermediate",
    level: 4,
    promptType: "free-writing",
    instruction: "「古い写真を見つけた」という設定で、短い物語を5-7文で書いてください。",
    context: "創作コンテストに応募する短編小説です。",
    keyWords: ["found", "photograph", "memory", "discovered", "mysterious"],
    grammarFocus: ["過去形", "物語表現", "描写文"],
    evaluationCriteria: {
      grammar: 25,
      vocabulary: 30,
      fluency: 25,
      creativity: 20,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "While cleaning my grandmother's attic, I discovered a faded photograph tucked between the pages of an old diary. The black-and-white image showed a young woman standing beside a vintage car, but something about her smile seemed strangely familiar. As I examined the photo more closely, I realized with shock that the woman looked exactly like me. The diary entry dated fifty years ago mentioned a time traveler who had visited their small town briefly. Could this mysterious photograph be evidence of something extraordinary, or was it simply an incredible coincidence that would forever change how I viewed my family's history?",
        explanation: "創造的で魅力的な短編ストーリーの始まり",
        grammarPoints: ["過去形", "分詞構文", "関係詞", "仮定法"],
        vocabularyHighlights: ["discovered", "faded", "tucked", "vintage", "examined", "extraordinary", "coincidence", "forever"],
      },
    ],
    relatedGrammarCategories: ["tenses", "relative"],
    relatedPreStudyContent: ["creative-writing"],
  },

  {
    id: "creative-character-description",
    title: "印象的なキャラクター描写",
    category: "creative",
    subcategory: "description",
    difficulty: "intermediate",
    level: 3,
    promptType: "guided",
    instruction: "あなたが作り出した架空のキャラクターについて、外見・性格・特技を含めて5-6文で描写してください。",
    context: "小説のキャラクター設定を考えている場面です。",
    keyWords: ["character", "appearance", "personality", "talent", "unique"],
    grammarFocus: ["形容詞", "描写表現", "現在形"],
    evaluationCriteria: {
      grammar: 25,
      vocabulary: 35,
      fluency: 25,
      creativity: 15,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "Elena Martinez is a 28-year-old marine biologist with curly auburn hair and bright green eyes that sparkle with curiosity. Despite her petite frame, she possesses an adventurous spirit and isn't afraid to dive into dangerous underwater caves in search of rare species. Her most remarkable talent is her ability to communicate with dolphins through a series of clicks and whistles she learned during her childhood in coastal Mexico. Elena is known for her infectious laughter and her habit of collecting unusual seashells from every beach she visits. Though she appears quiet and reserved in social situations, she becomes incredibly passionate and articulate when discussing ocean conservation.",
        explanation: "詳細で魅力的なキャラクター描写",
        grammarPoints: ["現在形", "関係詞", "分詞", "比較表現"],
        vocabularyHighlights: ["marine biologist", "auburn", "sparkle", "curiosity", "petite", "adventurous", "remarkable", "infectious", "reserved", "articulate", "conservation"],
      },
    ],
    relatedGrammarCategories: ["basic-grammar", "relative"],
    relatedPreStudyContent: ["creative-writing"],
  },

  // === 社会問題・意見文カテゴリー ===

  {
    id: "social-environmental-opinion",
    title: "環境問題への意見を述べよう",
    category: "social",
    subcategory: "environment",
    difficulty: "intermediate",
    level: 4,
    promptType: "structured",
    instruction: "気候変動対策として個人ができることについて、具体例を含めて5-6文で意見を書いてください。",
    context: "環境問題についてのディスカッションフォーラムへの投稿です。",
    keyWords: ["climate change", "individual", "action", "sustainable", "responsibility"],
    grammarFocus: ["意見表現", "提案文", "例示表現"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 35,
      fluency: 25,
      creativity: 10,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "I believe that individual actions play a crucial role in addressing climate change, even though the problem requires large-scale solutions. Simple lifestyle changes such as using public transportation, reducing meat consumption, and choosing renewable energy sources can make a significant difference when adopted by millions of people. For example, if every household switched to LED bulbs and improved home insulation, we could reduce global energy consumption by approximately 15%. Additionally, supporting environmentally responsible companies through our purchasing decisions sends a powerful message to the business community. While governments and corporations must lead the way, individual responsibility and collective action remain essential components of any effective climate strategy.",
        explanation: "論理的で具体例を含む環境問題への意見文",
        grammarPoints: ["意見表現", "条件文", "比較表現", "受動態"],
        vocabularyHighlights: ["crucial", "addressing", "lifestyle", "renewable", "significant", "approximately", "insulation", "consumption", "purchasing", "collective", "essential", "components"],
      },
    ],
    relatedGrammarCategories: ["modals", "comparison"],
    relatedPreStudyContent: ["critical-thinking"],
  },

  {
    id: "social-technology-impact",
    title: "テクノロジーの社会への影響",
    category: "social",
    subcategory: "technology",
    difficulty: "advanced",
    level: 5,
    promptType: "free-writing",
    instruction: "SNSが人間関係に与える影響について、メリットとデメリットの両面から6-8文で論じてください。",
    context: "社会学のレポート課題です。",
    keyWords: ["social media", "relationships", "benefits", "drawbacks", "communication"],
    grammarFocus: ["対比表現", "因果関係", "複合文"],
    evaluationCriteria: {
      grammar: 35,
      vocabulary: 35,
      fluency: 25,
      creativity: 5,
    },
    sampleAnswers: [
      {
        level: "excellent",
        text: "Social media platforms have fundamentally transformed how we form and maintain relationships, bringing both remarkable benefits and concerning drawbacks to human interaction. On the positive side, these platforms enable us to reconnect with old friends, maintain long-distance relationships, and build communities around shared interests regardless of geographical boundaries. They also provide valuable support networks for people dealing with specific challenges or belonging to minority groups. However, the convenience of digital communication often comes at the cost of meaningful face-to-face interactions, leading to more superficial relationships and reduced empathy. Furthermore, the curated nature of social media profiles can create unrealistic expectations and fuel social comparison, potentially damaging self-esteem and authentic connections. The challenge lies in leveraging the connectivity benefits of social media while preserving the depth and authenticity that characterize genuine human relationships.",
        explanation: "バランスの取れた社会問題分析文",
        grammarPoints: ["現在完了", "分詞構文", "比較表現", "関係詞"],
        vocabularyHighlights: ["fundamentally", "transformed", "remarkable", "concerning", "enable", "geographical", "boundaries", "superficial", "curated", "unrealistic", "fuel", "leveraging", "authenticity", "characterize"],
      },
    ],
    relatedGrammarCategories: ["comparison", "relative", "participle"],
    relatedPreStudyContent: ["critical-thinking", "academic-writing"],
  },

  // === 旅行・文化カテゴリー ===

  {
    id: "travel-experience-sharing",
    title: "忘れられない旅行体験",
    category: "travel",
    subcategory: "experience",
    difficulty: "intermediate",
    level: 3,
    promptType: "guided",
    instruction: "あなたが経験した（または経験したい）忘れられない旅行について、5-6文で詳しく書いてください。",
    context: "旅行ブログに投稿する記事です。",
    keyWords: ["journey", "unforgettable", "experience", "culture", "adventure"],
    grammarFocus: ["過去形", "描写表現", "感情表現"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 35,
      fluency: 25,
      creativity: 10,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "Last summer, I embarked on a solo backpacking trip through Southeast Asia that completely changed my perspective on life. The highlight of my journey was spending three days with a local family in a remote village in northern Thailand, where I learned traditional cooking techniques and participated in their daily farming activities. Despite the language barrier, we communicated through gestures, smiles, and shared laughter, creating bonds that transcended cultural differences. The experience taught me that genuine human connection doesn't require words, and that stepping outside our comfort zone often leads to the most meaningful discoveries. This adventure not only enriched my understanding of different cultures but also gave me confidence to embrace uncertainty and appreciate the simple joys of life.",
        explanation: "感情豊かで詳細な旅行体験記",
        grammarPoints: ["過去形", "関係詞", "分詞構文", "比較表現"],
        vocabularyHighlights: ["embarked", "backpacking", "perspective", "highlight", "remote", "participated", "barrier", "gestures", "transcended", "genuine", "enriched", "embrace", "uncertainty"],
      },
    ],
    relatedGrammarCategories: ["tenses", "relative"],
    relatedPreStudyContent: ["cultural-awareness"],
  },

  {
    id: "travel-cultural-comparison",
    title: "文化の違いを比較しよう",
    category: "travel",
    subcategory: "culture",
    difficulty: "intermediate",
    level: 4,
    promptType: "structured",
    instruction: "日本と他の国の文化的違いについて、具体例を挙げながら5-6文で比較してください。",
    context: "国際交流イベントでの発表です。",
    keyWords: ["culture", "difference", "comparison", "tradition", "custom"],
    grammarFocus: ["比較表現", "対比表現", "例示表現"],
    evaluationCriteria: {
      grammar: 35,
      vocabulary: 35,
      fluency: 25,
      creativity: 5,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "Having lived in both Japan and Germany, I've noticed fascinating differences in workplace culture and communication styles. While Japanese business meetings tend to emphasize consensus-building and indirect communication, German meetings are typically more direct and focused on efficient decision-making. For example, in Japan, it's common to have multiple preliminary discussions before the actual meeting, whereas Germans prefer to address issues head-on during the meeting itself. Another striking difference is the concept of work-life balance: Germans strictly separate work and personal time, often refusing to answer work emails after hours, while many Japanese employees feel obligated to be constantly available. These cultural differences reflect deeper values about hierarchy, individual expression, and the role of work in society, making cross-cultural understanding essential for successful international collaboration.",
        explanation: "具体例を含む詳細な文化比較文",
        grammarPoints: ["現在完了", "比較表現", "対比表現", "分詞構文"],
        vocabularyHighlights: ["fascinating", "emphasize", "consensus-building", "indirect", "efficient", "preliminary", "whereas", "head-on", "striking", "strictly", "obligated", "constantly", "hierarchy", "collaboration"],
      },
    ],
    relatedGrammarCategories: ["comparison", "relative"],
    relatedPreStudyContent: ["cultural-awareness"],
  },

  // === 食べ物・料理カテゴリー ===

  {
    id: "food-recipe-description",
    title: "お気に入りのレシピを紹介しよう",
    category: "food",
    subcategory: "cooking",
    difficulty: "beginner",
    level: 2,
    promptType: "guided",
    instruction: "あなたの得意料理のレシピを、作り方の手順を含めて5-6文で説明してください。",
    context: "料理教室で他の参加者にレシピを紹介する場面です。",
    keyWords: ["recipe", "ingredients", "steps", "cooking", "delicious"],
    grammarFocus: ["命令文", "順序表現", "現在形"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 30,
      fluency: 30,
      creativity: 10,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "My favorite dish to cook is homemade pasta with garlic and olive oil, which is surprisingly simple but incredibly flavorful. First, boil the pasta in salted water according to the package instructions while you prepare the sauce. In a large pan, heat olive oil over medium heat and add thinly sliced garlic, cooking until it becomes golden and fragrant. Next, add the cooked pasta directly to the pan along with some pasta water, tossing everything together until well combined. Finally, season with salt, pepper, and fresh parsley, then serve immediately with grated Parmesan cheese. This recipe takes only 15 minutes but always impresses guests with its authentic Italian flavor.",
        explanation: "手順が明確で実用的なレシピ説明文",
        grammarPoints: ["命令文", "時間表現", "分詞", "副詞"],
        vocabularyHighlights: ["homemade", "surprisingly", "incredibly", "flavorful", "according to", "instructions", "thinly sliced", "fragrant", "combined", "season", "impresses", "authentic"],
      },
    ],
    relatedGrammarCategories: ["basic-grammar", "tenses"],
    relatedPreStudyContent: ["practical-english"],
  },

  {
    id: "food-restaurant-review",
    title: "レストランのレビューを書こう",
    category: "food",
    subcategory: "dining",
    difficulty: "intermediate",
    level: 3,
    promptType: "guided",
    instruction: "最近訪れたレストランについて、料理・サービス・雰囲気を含めたレビューを5-6文で書いてください。",
    context: "グルメサイトに投稿するレストランレビューです。",
    keyWords: ["restaurant", "atmosphere", "service", "quality", "recommend"],
    grammarFocus: ["評価表現", "形容詞", "推薦文"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 35,
      fluency: 30,
      creativity: 5,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "I recently dined at Sakura Bistro, a cozy Japanese fusion restaurant that exceeded all my expectations. The menu cleverly combines traditional Japanese flavors with modern presentation techniques, resulting in dishes that are both visually stunning and incredibly delicious. The grilled salmon with miso glaze was perfectly cooked, and the innovative sushi rolls featured unique ingredients like truffle oil and microgreens. The service was attentive without being intrusive, and the staff demonstrated excellent knowledge of both the menu and wine pairings. The warm, intimate atmosphere with soft lighting and jazz music created the perfect setting for our anniversary dinner. I would highly recommend this restaurant to anyone seeking an exceptional dining experience that balances authenticity with creativity.",
        explanation: "詳細で魅力的なレストランレビュー",
        grammarPoints: ["過去形", "関係詞", "比較表現", "分詞"],
        vocabularyHighlights: ["dined", "cozy", "exceeded", "expectations", "cleverly", "presentation", "stunning", "incredibly", "innovative", "featured", "attentive", "intrusive", "demonstrated", "intimate", "exceptional", "authenticity"],
      },
    ],
    relatedGrammarCategories: ["tenses", "relative"],
    relatedPreStudyContent: ["practical-english"],
  },

  // === 健康・スポーツカテゴリー ===

  {
    id: "health-fitness-routine",
    title: "健康的な生活習慣を紹介しよう",
    category: "health",
    subcategory: "fitness",
    difficulty: "beginner",
    level: 2,
    promptType: "guided",
    instruction: "あなたの健康維持のための日常的な取り組みについて4-5文で書いてください。",
    context: "健康雑誌のライフスタイル特集への投稿です。",
    keyWords: ["healthy", "routine", "exercise", "diet", "wellness"],
    grammarFocus: ["現在形", "頻度表現", "習慣表現"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 30,
      fluency: 30,
      creativity: 10,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "I maintain my health through a combination of regular exercise, balanced nutrition, and adequate sleep. Every morning, I start with a 30-minute jog around my neighborhood, followed by a healthy breakfast that includes fresh fruits, yogurt, and whole grain cereal. Throughout the week, I try to incorporate strength training twice and yoga once to improve both my physical fitness and mental well-being. I also make sure to drink plenty of water throughout the day and limit my intake of processed foods and sugary drinks. Most importantly, I prioritize getting 7-8 hours of sleep each night, as I've found that proper rest is essential for maintaining energy levels and overall health.",
        explanation: "実践的で具体的な健康習慣の説明",
        grammarPoints: ["現在形", "頻度副詞", "動名詞", "比較表現"],
        vocabularyHighlights: ["maintain", "combination", "adequate", "incorporate", "strength training", "well-being", "intake", "processed", "prioritize", "essential", "overall"],
      },
    ],
    relatedGrammarCategories: ["basic-grammar", "tenses"],
    relatedPreStudyContent: ["practical-english"],
  },

  // === エンターテイメント・メディアカテゴリー ===

  {
    id: "entertainment-movie-review",
    title: "映画レビューを書こう",
    category: "entertainment",
    subcategory: "movies",
    difficulty: "intermediate",
    level: 3,
    promptType: "guided",
    instruction: "最近観た映画について、ストーリー・演技・総合評価を含めて5-6文でレビューを書いてください。",
    context: "映画レビューサイトへの投稿です。",
    keyWords: ["movie", "plot", "acting", "cinematography", "rating"],
    grammarFocus: ["評価表現", "描写表現", "意見文"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 35,
      fluency: 30,
      creativity: 5,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "I recently watched 'The Silent Ocean,' a thought-provoking science fiction thriller that explores themes of artificial intelligence and human consciousness. The film follows Dr. Sarah Chen, a marine biologist who discovers that dolphins possess advanced AI-like capabilities that could revolutionize our understanding of intelligence. The lead actress delivers a compelling performance, skillfully portraying both scientific curiosity and emotional vulnerability as her character grapples with the ethical implications of her discovery. The cinematography is breathtaking, with stunning underwater sequences that immerse viewers in the mysterious world beneath the waves. While the pacing occasionally feels slow in the middle act, the film's thought-provoking themes and strong performances make it a worthwhile watch. I would give 'The Silent Ocean' 4 out of 5 stars for its original concept and excellent execution.",
        explanation: "詳細で構造化された映画レビュー",
        grammarPoints: ["現在完了", "関係詞", "分詞", "比較表現"],
        vocabularyHighlights: ["thought-provoking", "consciousness", "possess", "revolutionize", "compelling", "skillfully", "vulnerability", "grapples", "ethical", "implications", "cinematography", "breathtaking", "immerse", "mysterious", "occasionally", "worthwhile", "execution"],
      },
    ],
    relatedGrammarCategories: ["relative", "tenses"],
    relatedPreStudyContent: ["media-literacy"],
  },

  {
    id: "entertainment-music-review",
    title: "音楽アルバムのレビューを書こう",
    category: "entertainment",
    subcategory: "music",
    difficulty: "intermediate",
    level: 3,
    promptType: "guided",
    instruction: "最近聴いた音楽アルバムについて、楽曲・アーティストの表現力・総合評価を含めて5-6文でレビューを書いてください。",
    context: "音楽レビューサイトへの投稿です。",
    keyWords: ["album", "tracks", "artist", "performance", "genre"],
    grammarFocus: ["評価表現", "感情表現", "比較文"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 35,
      fluency: 30,
      creativity: 5,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "Luna's latest album 'Midnight Reflections' is a masterful blend of indie pop and electronic elements that showcases her artistic evolution. The opening track 'Starlight' immediately draws listeners in with its haunting melody and introspective lyrics about finding hope in difficult times. Throughout the 12-track album, Luna's vocals demonstrate remarkable range and emotional depth, particularly on the standout ballad 'Broken Wings' where her vulnerability shines through. The production quality is exceptional, with each instrument carefully layered to create a rich, immersive soundscape. While some tracks feel slightly repetitive in the middle section, the album's cohesive theme and Luna's authentic storytelling make it a compelling listen from start to finish. I would rate 'Midnight Reflections' 4.5 out of 5 stars for its artistic maturity and emotional resonance.",
        explanation: "音楽の技術的・感情的側面を評価した詳細なレビュー",
        grammarPoints: ["現在形", "関係詞", "比較表現", "分詞"],
        vocabularyHighlights: ["masterful", "blend", "showcases", "evolution", "haunting", "introspective", "remarkable", "vulnerability", "exceptional", "immersive", "soundscape", "cohesive", "compelling", "maturity", "resonance"],
      },
    ],
    relatedGrammarCategories: ["relative", "comparison"],
    relatedPreStudyContent: ["media-literacy"],
  },

  // === テクノロジー・イノベーションカテゴリー ===

  {
    id: "technology-ai-future",
    title: "AIの未来への期待と懸念",
    category: "technology",
    subcategory: "artificial-intelligence",
    difficulty: "advanced",
    level: 5,
    promptType: "structured",
    instruction: "人工知能の発展が社会に与える影響について、期待と懸念の両面から6-8文で論じてください。",
    context: "テクノロジーカンファレンスでのパネルディスカッション用資料です。",
    keyWords: ["artificial intelligence", "automation", "employment", "innovation", "ethics"],
    grammarFocus: ["対比表現", "将来予測", "条件文"],
    evaluationCriteria: {
      grammar: 35,
      vocabulary: 40,
      fluency: 20,
      creativity: 5,
    },
    sampleAnswers: [
      {
        level: "excellent",
        text: "Artificial intelligence represents both tremendous opportunities and significant challenges for our society's future. On the positive side, AI has the potential to revolutionize healthcare through early disease detection, enhance educational experiences with personalized learning, and solve complex environmental problems that have plagued humanity for decades. However, the rapid advancement of AI also raises serious concerns about widespread job displacement, particularly in industries that rely heavily on routine tasks and data processing. Furthermore, the development of increasingly sophisticated AI systems raises ethical questions about privacy, decision-making transparency, and the potential for algorithmic bias to perpetuate social inequalities. To harness AI's benefits while mitigating its risks, we must establish comprehensive regulatory frameworks and invest in retraining programs for workers whose jobs may be affected. The key lies in ensuring that AI development serves humanity's collective interests rather than concentrating power and wealth in the hands of a few technology giants.",
        explanation: "AI の社会的影響を多角的に分析した高度な論説文",
        grammarPoints: ["現在形", "仮定法", "分詞構文", "比較表現"],
        vocabularyHighlights: ["tremendous", "revolutionize", "personalized", "plagued", "displacement", "sophisticated", "transparency", "algorithmic", "perpetuate", "inequalities", "harness", "mitigating", "comprehensive", "regulatory", "collective"],
      },
    ],
    relatedGrammarCategories: ["comparison", "subjunctive", "modals"],
    relatedPreStudyContent: ["critical-thinking", "future-technology"],
  },

  {
    id: "technology-smartphone-addiction",
    title: "スマートフォン依存について考える",
    category: "technology",
    subcategory: "digital-wellness",
    difficulty: "intermediate",
    level: 4,
    promptType: "structured",
    instruction: "スマートフォンの過度な使用が人々の生活に与える影響と対策について5-6文で書いてください。",
    context: "デジタル・ウェルネスに関するブログ記事です。",
    keyWords: ["smartphone", "addiction", "screen time", "mental health", "balance"],
    grammarFocus: ["因果関係", "提案文", "現在完了"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 35,
      fluency: 25,
      creativity: 10,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "Excessive smartphone use has become a growing concern in our digital age, affecting both our mental health and social relationships. Many people find themselves constantly checking their devices, leading to decreased attention spans, disrupted sleep patterns, and reduced face-to-face interactions with family and friends. The constant stream of notifications and social media updates can create anxiety and a fear of missing out, making it difficult to focus on important tasks or enjoy present moments. To address this issue, experts recommend setting specific times for device use, creating phone-free zones in bedrooms and dining areas, and practicing mindful technology consumption. Additionally, using apps that track and limit screen time can help individuals become more aware of their usage patterns and gradually reduce their dependence on digital devices. The goal is not to eliminate technology entirely but to develop a healthier, more balanced relationship with our smartphones.",
        explanation: "スマートフォン依存の問題と解決策を論理的に説明",
        grammarPoints: ["現在完了", "分詞構文", "動名詞", "不定詞"],
        vocabularyHighlights: ["excessive", "disrupted", "interactions", "notifications", "anxiety", "eliminate", "mindful", "consumption", "patterns", "gradually", "dependence", "balanced"],
      },
    ],
    relatedGrammarCategories: ["tenses", "participle"],
    relatedPreStudyContent: ["digital-literacy", "wellness"],
  },

  // === 教育・学習カテゴリー ===

  {
    id: "education-online-learning",
    title: "オンライン学習の効果的な方法",
    category: "education",
    subcategory: "learning-methods",
    difficulty: "intermediate",
    level: 3,
    promptType: "guided",
    instruction: "オンライン学習を効果的に進めるためのコツやアドバイスを5-6文で書いてください。",
    context: "教育ブログでの学習方法に関する記事です。",
    keyWords: ["online learning", "motivation", "schedule", "interaction", "progress"],
    grammarFocus: ["助動詞", "提案文", "現在形"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 30,
      fluency: 30,
      creativity: 10,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "Successful online learning requires discipline, proper planning, and active engagement with the course material. First, you should establish a dedicated study space free from distractions and maintain a consistent daily schedule to build good learning habits. It's important to actively participate in online discussions, ask questions, and seek help from instructors when you encounter difficulties. Setting specific, measurable goals for each study session can help you stay motivated and track your progress effectively. Additionally, taking regular breaks and connecting with fellow students through virtual study groups can prevent isolation and enhance your learning experience. Remember that online learning demands more self-motivation than traditional classroom settings, but with the right strategies, it can be just as effective and more flexible than face-to-face education.",
        explanation: "オンライン学習の実践的なアドバイスを提供",
        grammarPoints: ["助動詞should", "現在形", "動名詞", "比較表現"],
        vocabularyHighlights: ["discipline", "dedicated", "distractions", "consistent", "participate", "encounter", "measurable", "motivated", "isolation", "enhance", "demands", "strategies", "flexible"],
      },
    ],
    relatedGrammarCategories: ["modals", "basic-grammar"],
    relatedPreStudyContent: ["study-skills", "self-management"],
  },

  {
    id: "education-language-learning-tips",
    title: "効果的な語学学習法を提案しよう",
    category: "education",
    subcategory: "language-learning",
    difficulty: "intermediate",
    level: 4,
    promptType: "guided",
    instruction: "外国語を効果的に習得するための方法について、具体例を含めて6-7文で説明してください。",
    context: "語学学習者向けのガイドブック用記事です。",
    keyWords: ["language learning", "immersion", "practice", "vocabulary", "fluency"],
    grammarFocus: ["提案文", "例示表現", "条件文"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 35,
      fluency: 30,
      creativity: 5,
    },
    sampleAnswers: [
      {
        level: "excellent",
        text: "Effective language learning requires a combination of structured study and immersive practice that exposes learners to authentic, real-world usage. One of the most powerful strategies is to create an immersion environment at home by changing your phone's language settings, watching movies with subtitles in your target language, and listening to podcasts during commutes. Regular conversation practice with native speakers through language exchange apps or conversation clubs is essential for developing natural fluency and confidence. Additionally, keeping a vocabulary journal where you record new words with example sentences and reviewing them through spaced repetition can significantly improve retention rates. Don't be afraid to make mistakes – they are valuable learning opportunities that help you understand grammar patterns and cultural nuances. Most importantly, consistency is key: spending 30 minutes daily is far more effective than cramming for hours once a week, as language acquisition is a gradual process that requires sustained effort and patience.",
        explanation: "科学的根拠に基づく効果的な語学学習法の詳細な説明",
        grammarPoints: ["現在形", "動名詞", "比較表現", "関係詞"],
        vocabularyHighlights: ["immersive", "authentic", "strategies", "subtitles", "commutes", "retention", "nuances", "consistency", "cramming", "acquisition", "gradual", "sustained"],
      },
    ],
    relatedGrammarCategories: ["modals", "comparison"],
    relatedPreStudyContent: ["language-learning-strategies"],
  },

  // === 職業・キャリアカテゴリー ===

  {
    id: "career-job-interview",
    title: "面接での自己アピールを書こう",
    category: "career",
    subcategory: "job-interview",
    difficulty: "intermediate",
    level: 4,
    promptType: "guided",
    instruction: "希望する職種の面接で、あなたの強みと志望動機を5-6文で表現してください。",
    context: "外資系企業の面接で英語で自己紹介をする場面です。",
    keyWords: ["strengths", "experience", "motivation", "contribute", "skills"],
    grammarFocus: ["現在完了", "能力表現", "意志表現"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 35,
      fluency: 30,
      creativity: 5,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "I am excited to apply for the Marketing Manager position because I believe my combination of creative thinking and analytical skills makes me an ideal candidate for this role. Over the past five years, I have successfully managed digital marketing campaigns that increased brand awareness by 40% and generated over $2 million in revenue for my current company. My strength lies in my ability to translate complex data insights into compelling marketing strategies that resonate with target audiences. I am particularly drawn to your company's innovative approach to sustainable marketing and would love to contribute my expertise in social media strategy and customer engagement. Additionally, my experience leading cross-functional teams has taught me the importance of clear communication and collaborative problem-solving, skills that I believe would be valuable in your dynamic work environment. I am confident that my passion for data-driven marketing and my track record of delivering results would make me a strong addition to your team.",
        explanation: "具体的な実績と志望動機を含む説得力のある自己アピール",
        grammarPoints: ["現在完了", "関係詞", "仮定法", "比較表現"],
        vocabularyHighlights: ["combination", "analytical", "candidate", "successfully", "generated", "revenue", "insights", "compelling", "resonate", "innovative", "sustainable", "expertise", "engagement", "cross-functional", "collaborative", "dynamic", "data-driven", "addition"],
      },
    ],
    relatedGrammarCategories: ["tenses", "modals"],
    relatedPreStudyContent: ["business-communication", "self-presentation"],
  },

  {
    id: "career-remote-work-proposal",
    title: "リモートワーク提案書を作成しよう",
    category: "career",
    subcategory: "work-arrangement",
    difficulty: "advanced",
    level: 5,
    promptType: "structured",
    instruction: "上司にリモートワークの導入を提案する文書を、メリットと実施計画を含めて6-8文で作成してください。",
    context: "会社の働き方改革提案として上司に提出する文書です。",
    keyWords: ["remote work", "productivity", "work-life balance", "proposal", "implementation"],
    grammarFocus: ["提案表現", "条件文", "将来表現"],
    evaluationCriteria: {
      grammar: 35,
      vocabulary: 35,
      fluency: 25,
      creativity: 5,
    },
    sampleAnswers: [
      {
        level: "excellent",
        text: "I would like to propose implementing a hybrid remote work policy that allows employees to work from home 2-3 days per week, which could significantly improve both productivity and employee satisfaction. Based on recent studies, companies that offer flexible work arrangements report 25% higher employee retention rates and 20% increased productivity due to reduced commute stress and fewer office distractions. To ensure smooth implementation, I suggest establishing clear communication protocols using collaboration tools like Slack and Zoom, setting specific hours for team availability, and conducting weekly check-ins to maintain project momentum. We could start with a three-month pilot program involving volunteers from different departments to test the system and gather feedback before company-wide rollout. This approach would not only reduce our office space costs by approximately 30% but also help us attract top talent who increasingly value work-life balance in their career decisions. I believe this initiative aligns perfectly with our company's commitment to employee wellness and could position us as a forward-thinking employer in our industry.",
        explanation: "データに基づく説得力のあるリモートワーク提案書",
        grammarPoints: ["仮定法", "関係詞", "分詞構文", "比較表現"],
        vocabularyHighlights: ["implementing", "hybrid", "significantly", "retention", "protocols", "collaboration", "availability", "momentum", "volunteers", "rollout", "approximately", "initiative", "aligns", "commitment", "wellness", "forward-thinking"],
      },
    ],
    relatedGrammarCategories: ["modals", "subjunctive", "comparison"],
    relatedPreStudyContent: ["business-communication", "proposal-writing"],
  },

  // === 追加のTOEIC Writing形式 ===

  {
    id: "toeic-graph-description",
    title: "TOEIC グラフ説明：売上データ分析",
    category: "toeic",
    subcategory: "graph",
    difficulty: "advanced",
    level: 5,
    promptType: "structured",
    instruction: "The graph shows quarterly sales data for three products over two years. Describe the trends and make comparisons. Write 150-200 words.",
    context: "TOEIC Writing Task 3: Graph Description形式",
    keyWords: ["sales", "quarterly", "trends", "increase", "decrease"],
    grammarFocus: ["数値表現", "比較文", "傾向描写"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 35,
      fluency: 25,
      creativity: 10,
    },
    sampleAnswers: [
      {
        level: "excellent",
        text: "The graph illustrates quarterly sales performance for Products A, B, and C over a two-year period from 2022 to 2023. Product A demonstrated the most consistent growth pattern, starting at $50,000 in Q1 2022 and steadily increasing to reach $85,000 by Q4 2023, representing a 70% increase overall. In contrast, Product B showed more volatile performance, beginning at $45,000 but experiencing significant fluctuations throughout both years, with a notable peak of $75,000 in Q3 2022 followed by a sharp decline to $40,000 in Q1 2023. Product C maintained relatively stable sales figures, hovering between $35,000 and $45,000 throughout the entire period with minimal variation. The most dramatic change occurred in Q4 2023, when Product B surged to $80,000, surpassing both other products for the first time. Overall, while Product A showed the most reliable growth trajectory, Product B's recent performance suggests potential for strong future sales despite its earlier inconsistencies.",
        explanation: "TOEIC グラフ描写形式に適した詳細なデータ分析",
        grammarPoints: ["現在形", "過去形", "比較表現", "分詞構文"],
        vocabularyHighlights: ["illustrates", "demonstrated", "consistent", "steadily", "representing", "volatile", "fluctuations", "notable", "decline", "maintained", "hovering", "minimal", "variation", "dramatic", "surged", "surpassing", "reliable", "trajectory", "inconsistencies"],
      },
    ],
    relatedGrammarCategories: ["comparison", "tenses"],
    relatedPreStudyContent: ["data-analysis", "business-communication"],
  },

  // === 環境・持続可能性カテゴリー ===

  {
    id: "environment-sustainable-lifestyle",
    title: "持続可能なライフスタイルの実践",
    category: "environment",
    subcategory: "sustainability",
    difficulty: "intermediate",
    level: 4,
    promptType: "guided",
    instruction: "日常生活で実践できる環境に優しい行動について、具体例を含めて5-6文で書いてください。",
    context: "環境保護団体のニュースレター用記事です。",
    keyWords: ["sustainable", "eco-friendly", "reduce", "recycle", "conservation"],
    grammarFocus: ["現在形", "提案文", "例示表現"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 35,
      fluency: 25,
      creativity: 10,
    },
    sampleAnswers: [
      {
        level: "good",
        text: "Adopting a sustainable lifestyle doesn't require dramatic changes – small, consistent actions can make a significant environmental impact. Simple practices like using reusable water bottles and shopping bags, choosing public transportation or cycling instead of driving, and reducing meat consumption can substantially decrease your carbon footprint. At home, you can conserve energy by switching to LED light bulbs, unplugging electronics when not in use, and adjusting your thermostat by just a few degrees. Supporting local farmers' markets not only provides fresher produce but also reduces the environmental cost of long-distance food transportation. Additionally, practicing the 'reduce, reuse, recycle' principle by buying only what you need, repurposing old items creatively, and properly sorting waste can minimize the amount of material sent to landfills. These mindful choices, when adopted by many individuals, collectively contribute to a healthier planet for future generations.",
        explanation: "実践的で具体的な環境保護行動の提案",
        grammarPoints: ["動名詞", "比較表現", "分詞構文", "条件文"],
        vocabularyHighlights: ["adopting", "dramatic", "consistent", "substantially", "carbon footprint", "conserve", "unplugging", "adjusting", "thermostat", "transportation", "repurposing", "sorting", "minimize", "landfills", "mindful", "collectively", "generations"],
      },
    ],
    relatedGrammarCategories: ["basic-grammar", "modals"],
    relatedPreStudyContent: ["environmental-awareness"],
  },

  // === 最終的な高度な課題 ===

  {
    id: "advanced-philosophical-essay",
    title: "哲学的考察：幸福とは何か",
    category: "philosophy",
    subcategory: "ethics",
    difficulty: "advanced",
    level: 8,
    promptType: "free-writing",
    instruction: "「真の幸福とは何か」について、様々な観点から考察し、あなたの結論を7-10文で論述してください。",
    context: "哲学の授業での最終レポート課題です。",
    keyWords: ["happiness", "fulfillment", "meaning", "philosophy", "well-being"],
    grammarFocus: ["抽象概念", "論証表現", "複合文"],
    evaluationCriteria: {
      grammar: 30,
      vocabulary: 40,
      fluency: 20,
      creativity: 10,
    },
    sampleAnswers: [
      {
        level: "excellent",
        text: "The pursuit of happiness has been humanity's most enduring quest, yet defining true happiness remains one of philosophy's most complex challenges. While hedonistic approaches suggest that happiness lies in maximizing pleasure and minimizing pain, this perspective often leads to temporary satisfaction rather than lasting fulfillment. Aristotelian eudaimonia offers a more profound understanding, proposing that genuine happiness emerges from living virtuously and realizing one's full potential through meaningful activities and relationships. Modern psychological research supports this view, indicating that people who engage in activities that align with their core values and contribute to something greater than themselves report higher levels of life satisfaction and resilience. However, cultural and individual differences significantly influence what constitutes happiness, suggesting that no universal formula exists. Eastern philosophical traditions emphasize the importance of inner peace and acceptance, proposing that true contentment comes from releasing attachment to external outcomes and finding harmony within oneself. Ultimately, I believe that authentic happiness is not a destination but a dynamic process of growth, connection, and contribution that varies uniquely for each individual while maintaining certain universal elements of meaning, relationships, and personal development.",
        explanation: "哲学的深度を持つ高度な論証エッセイ",
        grammarPoints: ["現在完了", "分詞構文", "関係詞", "仮定法"],
        vocabularyHighlights: ["enduring", "quest", "hedonistic", "maximizing", "temporary", "fulfillment", "eudaimonia", "profound", "emerges", "virtuously", "realizing", "potential", "align", "resilience", "constitute", "universal", "formula", "traditions", "contentment", "releasing", "attachment", "outcomes", "harmony", "authentic", "destination", "dynamic", "contribution", "maintaining", "elements"],
      },
    ],
    relatedGrammarCategories: ["relative", "subjunctive", "participle"],
    relatedPreStudyContent: ["critical-thinking", "philosophical-reasoning"],
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
