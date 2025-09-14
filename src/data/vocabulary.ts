export interface VocabularyWord {
  id: number;
  word: string;
  meaning: string;
  partOfSpeech: string;
  example: string;
  exampleTranslation: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category?: 'toeic' | 'business' | 'daily' | 'academic';
}

// 難易度別に語彙を取得する関数
export function getVocabularyByDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): VocabularyWord[] {
  return vocabularyWords.filter(word => word.level === difficulty);
}

// カテゴリー別に語彙を取得する関数
export function getVocabularyByCategory(
  category: 'toeic' | 'business' | 'daily' | 'academic'
): VocabularyWord[] {
  return vocabularyWords.filter(word => word.category === category);
}

// 難易度とカテゴリーの両方でフィルタリングする関数
export function getVocabularyByDifficultyAndCategory(
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  category?: 'toeic' | 'business' | 'daily' | 'academic'
): VocabularyWord[] {
  let filtered = vocabularyWords.filter(word => word.level === difficulty);
  
  if (category) {
    filtered = filtered.filter(word => word.category === category);
  }
  
  return filtered;
}

export const vocabularyWords: VocabularyWord[] = [
  // 初級レベル (Beginner) - 基本的な日常会話でよく使われる単語
  {
    id: 1,
    word: "reliable",
    meaning: "信頼できる、頼りになる",
    partOfSpeech: "形容詞",
    example: "He is a reliable friend who always helps.",
    exampleTranslation: "彼はいつも助けてくれる信頼できる友人です。",
    level: "beginner"
  },
  {
    id: 2,
    word: "confident",
    meaning: "自信のある、確信している",
    partOfSpeech: "形容詞",
    example: "She feels confident about the presentation.",
    exampleTranslation: "彼女はプレゼンテーションに自信を持っています。",
    level: "beginner"
  },
  {
    id: 3,
    word: "important",
    meaning: "重要な、大切な",
    partOfSpeech: "形容詞",
    example: "It's important to study regularly.",
    exampleTranslation: "定期的に勉強することが重要です。",
    level: "beginner"
  },
  {
    id: 4,
    word: "different",
    meaning: "異なる、違う",
    partOfSpeech: "形容詞",
    example: "This book is different from that one.",
    exampleTranslation: "この本はあの本とは違います。",
    level: "beginner"
  },
  {
    id: 5,
    word: "beautiful",
    meaning: "美しい、きれいな",
    partOfSpeech: "形容詞",
    example: "The sunset was beautiful yesterday.",
    exampleTranslation: "昨日の夕日は美しかったです。",
    level: "beginner"
  },
  {
    id: 6,
    word: "interesting",
    meaning: "興味深い、面白い",
    partOfSpeech: "形容詞",
    example: "This movie is very interesting.",
    exampleTranslation: "この映画はとても面白いです。",
    level: "beginner"
  },
  {
    id: 7,
    word: "difficult",
    meaning: "難しい、困難な",
    partOfSpeech: "形容詞",
    example: "This problem is too difficult for me.",
    exampleTranslation: "この問題は私には難しすぎます。",
    level: "beginner"
  },
  {
    id: 8,
    word: "possible",
    meaning: "可能な、あり得る",
    partOfSpeech: "形容詞",
    example: "Is it possible to finish this today?",
    exampleTranslation: "今日中にこれを終わらせることは可能ですか？",
    level: "beginner"
  },
  {
    id: 9,
    word: "necessary",
    meaning: "必要な、必要不可欠な",
    partOfSpeech: "形容詞",
    example: "It's necessary to arrive on time.",
    exampleTranslation: "時間通りに到着することが必要です。",
    level: "beginner"
  },
  {
    id: 10,
    word: "successful",
    meaning: "成功した、うまくいった",
    partOfSpeech: "形容詞",
    example: "She is a successful businesswoman.",
    exampleTranslation: "彼女は成功したビジネスウーマンです。",
    level: "beginner"
  },
  {
    id: 11,
    word: "understand",
    meaning: "理解する、分かる",
    partOfSpeech: "動詞",
    example: "I understand what you mean.",
    exampleTranslation: "あなたの言いたいことが分かります。",
    level: "beginner"
  },
  {
    id: 12,
    word: "remember",
    meaning: "覚えている、思い出す",
    partOfSpeech: "動詞",
    example: "I remember meeting you last year.",
    exampleTranslation: "去年あなたに会ったことを覚えています。",
    level: "beginner"
  },
  {
    id: 13,
    word: "believe",
    meaning: "信じる、思う",
    partOfSpeech: "動詞",
    example: "I believe in your ability.",
    exampleTranslation: "あなたの能力を信じています。",
    level: "beginner"
  },
  {
    id: 14,
    word: "decide",
    meaning: "決める、決定する",
    partOfSpeech: "動詞",
    example: "We need to decide quickly.",
    exampleTranslation: "早く決める必要があります。",
    level: "beginner"
  },
  {
    id: 15,
    word: "develop",
    meaning: "発達する、開発する",
    partOfSpeech: "動詞",
    example: "Children develop quickly.",
    exampleTranslation: "子供は早く成長します。",
    level: "beginner"
  },
  {
    id: 16,
    word: "experience",
    meaning: "経験、体験",
    partOfSpeech: "名詞",
    example: "Traveling is a great experience.",
    exampleTranslation: "旅行は素晴らしい経験です。",
    level: "beginner"
  },
  {
    id: 17,
    word: "knowledge",
    meaning: "知識、理解",
    partOfSpeech: "名詞",
    example: "Knowledge is power.",
    exampleTranslation: "知識は力です。",
    level: "beginner"
  },
  {
    id: 18,
    word: "information",
    meaning: "情報、資料",
    partOfSpeech: "名詞",
    example: "I need more information about this.",
    exampleTranslation: "これについてもっと情報が必要です。",
    level: "beginner"
  },
  {
    id: 19,
    word: "education",
    meaning: "教育、学問",
    partOfSpeech: "名詞",
    example: "Education is very important.",
    exampleTranslation: "教育はとても重要です。",
    level: "beginner"
  },
  {
    id: 20,
    word: "relationship",
    meaning: "関係、人間関係",
    partOfSpeech: "名詞",
    example: "Good relationships are important.",
    exampleTranslation: "良い人間関係は重要です。",
    level: "beginner"
  },

  // 中級レベル (Intermediate) - ビジネスや日常でよく使われる単語
  {
    id: 21,
    word: "accomplish",
    meaning: "達成する、成し遂げる",
    partOfSpeech: "動詞",
    example: "She accomplished her goal of learning English.",
    exampleTranslation: "彼女は英語を学ぶという目標を達成した。",
    level: "intermediate"
  },
  {
    id: 22,
    word: "opportunity",
    meaning: "機会、チャンス",
    partOfSpeech: "名詞",
    example: "This is a great opportunity to improve your skills.",
    exampleTranslation: "これはスキルを向上させる絶好の機会です。",
    level: "intermediate"
  },
  {
    id: 23,
    word: "determine",
    meaning: "決定する、決心する",
    partOfSpeech: "動詞",
    example: "We need to determine the best solution.",
    exampleTranslation: "最良の解決策を決定する必要があります。",
    level: "intermediate"
  },
  {
    id: 24,
    word: "establish",
    meaning: "設立する、確立する",
    partOfSpeech: "動詞",
    example: "They established a new company last year.",
    exampleTranslation: "彼らは昨年新しい会社を設立した。",
    level: "intermediate"
  },
  {
    id: 25,
    word: "appreciate",
    meaning: "感謝する、評価する",
    partOfSpeech: "動詞",
    example: "I appreciate your help with this project.",
    exampleTranslation: "このプロジェクトでの助けに感謝します。",
    level: "intermediate"
  },
  {
    id: 26,
    word: "essential",
    meaning: "不可欠な、必要不可欠な",
    partOfSpeech: "形容詞",
    example: "Water is essential for all living things.",
    exampleTranslation: "水はすべての生物にとって不可欠です。",
    level: "intermediate"
  },
  {
    id: 27,
    word: "obviously",
    meaning: "明らかに、当然",
    partOfSpeech: "副詞",
    example: "Obviously, we need to work harder.",
    exampleTranslation: "明らかに、私たちはもっと頑張る必要があります。",
    level: "intermediate"
  },
  {
    id: 28,
    word: "brilliant",
    meaning: "優秀な、素晴らしい",
    partOfSpeech: "形容詞",
    example: "That was a brilliant idea!",
    exampleTranslation: "それは素晴らしいアイデアでした！",
    level: "intermediate"
  },
  {
    id: 29,
    word: "appropriate",
    meaning: "適切な、ふさわしい",
    partOfSpeech: "形容詞",
    example: "Please wear appropriate clothing for the meeting.",
    exampleTranslation: "会議にふさわしい服装をしてください。",
    level: "intermediate"
  },
  {
    id: 30,
    word: "available",
    meaning: "利用可能な、入手可能な",
    partOfSpeech: "形容詞",
    example: "The new product will be available next month.",
    exampleTranslation: "新製品は来月から入手可能になります。",
    level: "intermediate"
  },
  {
    id: 31,
    word: "effective",
    meaning: "効果的な、有効な",
    partOfSpeech: "形容詞",
    example: "This method is very effective for learning.",
    exampleTranslation: "この方法は学習に非常に効果的です。",
    level: "intermediate"
  },
  {
    id: 32,
    word: "efficient",
    meaning: "効率的な、能率的な",
    partOfSpeech: "形容詞",
    example: "We need a more efficient system.",
    exampleTranslation: "より効率的なシステムが必要です。",
    level: "intermediate"
  },
  {
    id: 33,
    word: "flexible",
    meaning: "柔軟な、融通の利く",
    partOfSpeech: "形容詞",
    example: "Our schedule is flexible this week.",
    exampleTranslation: "今週のスケジュールは柔軟です。",
    level: "intermediate"
  },
  {
    id: 34,
    word: "professional",
    meaning: "専門的な、プロの",
    partOfSpeech: "形容詞",
    example: "She has a professional attitude.",
    exampleTranslation: "彼女はプロフェッショナルな態度を持っています。",
    level: "intermediate"
  },
  {
    id: 35,
    word: "responsible",
    meaning: "責任のある、信頼できる",
    partOfSpeech: "形容詞",
    example: "He is responsible for the project.",
    exampleTranslation: "彼はそのプロジェクトの責任者です。",
    level: "intermediate"
  },
  {
    id: 36,
    word: "analyze",
    meaning: "分析する、検討する",
    partOfSpeech: "動詞",
    example: "We need to analyze the data carefully.",
    exampleTranslation: "データを注意深く分析する必要があります。",
    level: "intermediate"
  },
  {
    id: 37,
    word: "communicate",
    meaning: "コミュニケーションを取る、伝える",
    partOfSpeech: "動詞",
    example: "It's important to communicate clearly.",
    exampleTranslation: "明確にコミュニケーションを取ることが重要です。",
    level: "intermediate"
  },
  {
    id: 38,
    word: "consider",
    meaning: "考慮する、検討する",
    partOfSpeech: "動詞",
    example: "Please consider all the options.",
    exampleTranslation: "すべての選択肢を考慮してください。",
    level: "intermediate"
  },
  {
    id: 39,
    word: "demonstrate",
    meaning: "実証する、示す",
    partOfSpeech: "動詞",
    example: "The results demonstrate our success.",
    exampleTranslation: "結果は私たちの成功を示しています。",
    level: "intermediate"
  },
  {
    id: 40,
    word: "maintain",
    meaning: "維持する、保つ",
    partOfSpeech: "動詞",
    example: "We must maintain high quality standards.",
    exampleTranslation: "高い品質基準を維持しなければなりません。",
    level: "intermediate"
  },
  {
    id: 41,
    word: "achieve",
    meaning: "達成する、成し遂げる",
    partOfSpeech: "動詞",
    example: "She achieved her dream of becoming a doctor.",
    exampleTranslation: "彼女は医者になるという夢を達成しました。",
    level: "intermediate"
  },
  {
    id: 42,
    word: "approach",
    meaning: "アプローチ、接近する",
    partOfSpeech: "名詞/動詞",
    example: "We need a different approach to this problem.",
    exampleTranslation: "この問題には異なるアプローチが必要です。",
    level: "intermediate"
  },
  {
    id: 43,
    word: "challenge",
    meaning: "挑戦、課題",
    partOfSpeech: "名詞",
    example: "This project is a real challenge.",
    exampleTranslation: "このプロジェクトは本当の挑戦です。",
    level: "intermediate"
  },
  {
    id: 44,
    word: "environment",
    meaning: "環境、周囲",
    partOfSpeech: "名詞",
    example: "We must protect the environment.",
    exampleTranslation: "環境を守らなければなりません。",
    level: "intermediate"
  },
  {
    id: 45,
    word: "management",
    meaning: "管理、経営",
    partOfSpeech: "名詞",
    example: "Good management is essential for success.",
    exampleTranslation: "成功には良い管理が不可欠です。",
    level: "intermediate"
  },
  {
    id: 46,
    word: "organization",
    meaning: "組織、団体",
    partOfSpeech: "名詞",
    example: "This organization helps many people.",
    exampleTranslation: "この組織は多くの人々を助けています。",
    level: "intermediate"
  },
  {
    id: 47,
    word: "technology",
    meaning: "技術、テクノロジー",
    partOfSpeech: "名詞",
    example: "Technology is advancing rapidly.",
    exampleTranslation: "技術は急速に進歩しています。",
    level: "intermediate"
  },
  {
    id: 48,
    word: "tradition",
    meaning: "伝統、慣習",
    partOfSpeech: "名詞",
    example: "We respect our cultural traditions.",
    exampleTranslation: "私たちは文化的な伝統を尊重します。",
    level: "intermediate"
  },
  {
    id: 49,
    word: "variety",
    meaning: "多様性、種類",
    partOfSpeech: "名詞",
    example: "We offer a variety of services.",
    exampleTranslation: "私たちは様々なサービスを提供しています。",
    level: "intermediate"
  },
  {
    id: 50,
    word: "welfare",
    meaning: "福祉、福利",
    partOfSpeech: "名詞",
    example: "The company cares about employee welfare.",
    exampleTranslation: "会社は従業員の福利を気にかけています。",
    level: "intermediate"
  },

  // 上級レベル (Advanced) - ビジネス、学術、専門的な単語
  {
    id: 51,
    word: "significant",
    meaning: "重要な、意義のある",
    partOfSpeech: "形容詞",
    example: "This discovery has significant implications.",
    exampleTranslation: "この発見は重要な意味を持っています。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 52,
    word: "implement",
    meaning: "実行する、実施する",
    partOfSpeech: "動詞",
    example: "We will implement the new policy next month.",
    exampleTranslation: "来月から新しい方針を実施します。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 53,
    word: "evaluate",
    meaning: "評価する、査定する",
    partOfSpeech: "動詞",
    example: "Teachers evaluate students' progress regularly.",
    exampleTranslation: "教師は定期的に生徒の進歩を評価します。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 54,
    word: "consequence",
    meaning: "結果、影響",
    partOfSpeech: "名詞",
    example: "Every action has a consequence.",
    exampleTranslation: "すべての行動には結果があります。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 55,
    word: "sophisticated",
    meaning: "洗練された、複雑な",
    partOfSpeech: "形容詞",
    example: "This is a sophisticated system.",
    exampleTranslation: "これは洗練されたシステムです。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 56,
    word: "comprehensive",
    meaning: "包括的な、総合的な",
    partOfSpeech: "形容詞",
    example: "We need a comprehensive solution.",
    exampleTranslation: "包括的な解決策が必要です。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 57,
    word: "substantial",
    meaning: "実質的な、相当な",
    partOfSpeech: "形容詞",
    example: "There has been substantial progress.",
    exampleTranslation: "実質的な進歩がありました。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 58,
    word: "fundamental",
    meaning: "基本的な、根本的な",
    partOfSpeech: "形容詞",
    example: "This is a fundamental principle.",
    exampleTranslation: "これは基本的な原則です。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 59,
    word: "strategic",
    meaning: "戦略的な、計画的な",
    partOfSpeech: "形容詞",
    example: "We need strategic planning.",
    exampleTranslation: "戦略的な計画が必要です。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 60,
    word: "innovative",
    meaning: "革新的な、独創的な",
    partOfSpeech: "形容詞",
    example: "This is an innovative approach.",
    exampleTranslation: "これは革新的なアプローチです。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 61,
    word: "collaborate",
    meaning: "協力する、共同作業する",
    partOfSpeech: "動詞",
    example: "We must collaborate to succeed.",
    exampleTranslation: "成功するために協力しなければなりません。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 62,
    word: "facilitate",
    meaning: "促進する、容易にする",
    partOfSpeech: "動詞",
    example: "This tool will facilitate learning.",
    exampleTranslation: "このツールは学習を促進します。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 63,
    word: "optimize",
    meaning: "最適化する、改善する",
    partOfSpeech: "動詞",
    example: "We need to optimize our processes.",
    exampleTranslation: "プロセスを最適化する必要があります。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 64,
    word: "prioritize",
    meaning: "優先順位をつける、優先する",
    partOfSpeech: "動詞",
    example: "We must prioritize urgent tasks.",
    exampleTranslation: "緊急のタスクを優先しなければなりません。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 65,
    word: "synthesize",
    meaning: "統合する、合成する",
    partOfSpeech: "動詞",
    example: "We need to synthesize all the information.",
    exampleTranslation: "すべての情報を統合する必要があります。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 66,
    word: "methodology",
    meaning: "方法論、手法",
    partOfSpeech: "名詞",
    example: "Our methodology is scientifically sound.",
    exampleTranslation: "私たちの方法論は科学的に妥当です。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 67,
    word: "infrastructure",
    meaning: "インフラ、基盤",
    partOfSpeech: "名詞",
    example: "We need better infrastructure.",
    exampleTranslation: "より良いインフラが必要です。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 68,
    word: "perspective",
    meaning: "視点、観点",
    partOfSpeech: "名詞",
    example: "Let's consider this from a different perspective.",
    exampleTranslation: "異なる視点からこれを考えてみましょう。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 69,
    word: "phenomenon",
    meaning: "現象、事象",
    partOfSpeech: "名詞",
    example: "This is an interesting phenomenon.",
    exampleTranslation: "これは興味深い現象です。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 70,
    word: "paradigm",
    meaning: "パラダイム、枠組み",
    partOfSpeech: "名詞",
    example: "We need a new paradigm for this problem.",
    exampleTranslation: "この問題には新しいパラダイムが必要です。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 71,
    word: "criterion",
    meaning: "基準、判断基準",
    partOfSpeech: "名詞",
    example: "What is the criterion for success?",
    exampleTranslation: "成功の基準は何ですか？",
    level: "advanced",
    category: "academic"
  },
  {
    id: 72,
    word: "hypothesis",
    meaning: "仮説、推測",
    partOfSpeech: "名詞",
    example: "We need to test this hypothesis.",
    exampleTranslation: "この仮説を検証する必要があります。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 73,
    word: "synthesis",
    meaning: "統合、合成",
    partOfSpeech: "名詞",
    example: "The synthesis of ideas was successful.",
    exampleTranslation: "アイデアの統合は成功しました。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 74,
    word: "analysis",
    meaning: "分析、解析",
    partOfSpeech: "名詞",
    example: "The analysis shows clear results.",
    exampleTranslation: "分析は明確な結果を示しています。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 75,
    word: "implementation",
    meaning: "実装、実行",
    partOfSpeech: "名詞",
    example: "The implementation was successful.",
    exampleTranslation: "実装は成功しました。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 76,
    word: "evaluation",
    meaning: "評価、査定",
    partOfSpeech: "名詞",
    example: "The evaluation process is thorough.",
    exampleTranslation: "評価プロセスは徹底的です。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 77,
    word: "optimization",
    meaning: "最適化、改善",
    partOfSpeech: "名詞",
    example: "Optimization is an ongoing process.",
    exampleTranslation: "最適化は継続的なプロセスです。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 78,
    word: "collaboration",
    meaning: "協力、共同作業",
    partOfSpeech: "名詞",
    example: "Collaboration is key to success.",
    exampleTranslation: "協力が成功の鍵です。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 79,
    word: "innovation",
    meaning: "革新、イノベーション",
    partOfSpeech: "名詞",
    example: "Innovation drives progress.",
    exampleTranslation: "革新が進歩を推進します。",
    level: "advanced",
    category: "academic"
  },
  {
    id: 80,
    word: "sustainability",
    meaning: "持続可能性、サステナビリティ",
    partOfSpeech: "名詞",
    example: "Sustainability is our priority.",
    exampleTranslation: "持続可能性が私たちの優先事項です。",
    level: "advanced",
    category: "academic"
  },

  // TOEIC頻出語彙 (TOEIC Frequent Words)
  {
    id: 81,
    word: "revenue",
    meaning: "収益、売上高",
    partOfSpeech: "名詞",
    example: "The company's revenue increased by 20%.",
    exampleTranslation: "会社の収益は20%増加しました。",
    level: "intermediate",
    category: "toeic"
  },
  {
    id: 82,
    word: "budget",
    meaning: "予算、経費",
    partOfSpeech: "名詞",
    example: "We need to stay within our budget.",
    exampleTranslation: "予算内に収める必要があります。",
    level: "intermediate",
    category: "toeic"
  },
  {
    id: 83,
    word: "deadline",
    meaning: "締切、期限",
    partOfSpeech: "名詞",
    example: "The deadline for this project is Friday.",
    exampleTranslation: "このプロジェクトの締切は金曜日です。",
    level: "intermediate",
    category: "toeic"
  },
  {
    id: 84,
    word: "schedule",
    meaning: "スケジュール、予定",
    partOfSpeech: "名詞",
    example: "Please check your schedule for next week.",
    exampleTranslation: "来週のスケジュールを確認してください。",
    level: "beginner",
    category: "toeic"
  },
  {
    id: 85,
    word: "meeting",
    meaning: "会議、ミーティング",
    partOfSpeech: "名詞",
    example: "We have a meeting at 3 PM today.",
    exampleTranslation: "今日の午後3時に会議があります。",
    level: "beginner",
    category: "toeic"
  },
  {
    id: 86,
    word: "presentation",
    meaning: "プレゼンテーション、発表",
    partOfSpeech: "名詞",
    example: "She gave an excellent presentation.",
    exampleTranslation: "彼女は素晴らしいプレゼンテーションをしました。",
    level: "intermediate",
    category: "toeic"
  },
  {
    id: 87,
    word: "contract",
    meaning: "契約、契約書",
    partOfSpeech: "名詞",
    example: "Please sign the contract by tomorrow.",
    exampleTranslation: "明日までに契約書にサインしてください。",
    level: "intermediate",
    category: "toeic"
  },
  {
    id: 88,
    word: "customer",
    meaning: "顧客、お客様",
    partOfSpeech: "名詞",
    example: "Customer satisfaction is our priority.",
    exampleTranslation: "顧客満足度が私たちの優先事項です。",
    level: "beginner",
    category: "toeic"
  },
  {
    id: 89,
    word: "employee",
    meaning: "従業員、社員",
    partOfSpeech: "名詞",
    example: "All employees must attend the training.",
    exampleTranslation: "すべての従業員が研修に参加する必要があります。",
    level: "beginner",
    category: "toeic"
  },
  {
    id: 90,
    word: "department",
    meaning: "部門、部署",
    partOfSpeech: "名詞",
    example: "Which department do you work in?",
    exampleTranslation: "どの部署で働いていますか？",
    level: "beginner",
    category: "toeic"
  },
  {
    id: 91,
    word: "product",
    meaning: "製品、商品",
    partOfSpeech: "名詞",
    example: "This product is very popular.",
    exampleTranslation: "この製品はとても人気があります。",
    level: "beginner",
    category: "toeic"
  },
  {
    id: 92,
    word: "service",
    meaning: "サービス、業務",
    partOfSpeech: "名詞",
    example: "Our service is available 24/7.",
    exampleTranslation: "私たちのサービスは24時間365日利用可能です。",
    level: "beginner",
    category: "toeic"
  },
  {
    id: 93,
    word: "market",
    meaning: "市場、マーケット",
    partOfSpeech: "名詞",
    example: "The market is very competitive.",
    exampleTranslation: "市場は非常に競争が激しいです。",
    level: "intermediate",
    category: "toeic"
  },
  {
    id: 94,
    word: "profit",
    meaning: "利益、収益",
    partOfSpeech: "名詞",
    example: "The company made a good profit this year.",
    exampleTranslation: "会社は今年良い利益を上げました。",
    level: "intermediate",
    category: "toeic"
  },
  {
    id: 95,
    word: "investment",
    meaning: "投資、出資",
    partOfSpeech: "名詞",
    example: "This is a good investment opportunity.",
    exampleTranslation: "これは良い投資機会です。",
    level: "intermediate",
    category: "toeic"
  },
  {
    id: 96,
    word: "strategy",
    meaning: "戦略、方針",
    partOfSpeech: "名詞",
    example: "We need a new marketing strategy.",
    exampleTranslation: "新しいマーケティング戦略が必要です。",
    level: "intermediate",
    category: "toeic"
  },
  {
    id: 97,
    word: "performance",
    meaning: "業績、パフォーマンス",
    partOfSpeech: "名詞",
    example: "His performance has improved significantly.",
    exampleTranslation: "彼の業績は大幅に改善されました。",
    level: "intermediate",
    category: "toeic"
  },
  {
    id: 98,
    word: "quality",
    meaning: "品質、質",
    partOfSpeech: "名詞",
    example: "We maintain high quality standards.",
    exampleTranslation: "高い品質基準を維持しています。",
    level: "beginner",
    category: "toeic"
  },
  {
    id: 99,
    word: "efficiency",
    meaning: "効率、能率",
    partOfSpeech: "名詞",
    example: "We need to improve our efficiency.",
    exampleTranslation: "効率を改善する必要があります。",
    level: "intermediate",
    category: "toeic"
  },
  {
    id: 100,
    word: "productivity",
    meaning: "生産性、効率性",
    partOfSpeech: "名詞",
    example: "Productivity has increased this month.",
    exampleTranslation: "今月は生産性が向上しました。",
    level: "intermediate",
    category: "toeic"
  },

  // ビジネス英語 (Business English)
  {
    id: 101,
    word: "negotiate",
    meaning: "交渉する、協議する",
    partOfSpeech: "動詞",
    example: "We need to negotiate the terms.",
    exampleTranslation: "条件を交渉する必要があります。",
    level: "intermediate",
    category: "business"
  },
  {
    id: 102,
    word: "collaborate",
    meaning: "協力する、共同作業する",
    partOfSpeech: "動詞",
    example: "We collaborate with many companies.",
    exampleTranslation: "多くの会社と協力しています。",
    level: "intermediate",
    category: "business"
  },
  {
    id: 103,
    word: "coordinate",
    meaning: "調整する、連携する",
    partOfSpeech: "動詞",
    example: "Please coordinate with the team.",
    exampleTranslation: "チームと調整してください。",
    level: "intermediate",
    category: "business"
  },
  {
    id: 104,
    word: "supervise",
    meaning: "監督する、管理する",
    partOfSpeech: "動詞",
    example: "She supervises the entire department.",
    exampleTranslation: "彼女は部署全体を監督しています。",
    level: "intermediate",
    category: "business"
  },
  {
    id: 105,
    word: "delegate",
    meaning: "委任する、任せる",
    partOfSpeech: "動詞",
    example: "You should delegate some tasks.",
    exampleTranslation: "いくつかのタスクを委任すべきです。",
    level: "intermediate",
    category: "business"
  },
  {
    id: 106,
    word: "facilitate",
    meaning: "促進する、容易にする",
    partOfSpeech: "動詞",
    example: "This will facilitate communication.",
    exampleTranslation: "これはコミュニケーションを促進します。",
    level: "advanced",
    category: "business"
  },
  {
    id: 107,
    word: "streamline",
    meaning: "効率化する、合理化する",
    partOfSpeech: "動詞",
    example: "We need to streamline our processes.",
    exampleTranslation: "プロセスを効率化する必要があります。",
    level: "advanced",
    category: "business"
  },
  {
    id: 108,
    word: "leverage",
    meaning: "活用する、利用する",
    partOfSpeech: "動詞",
    example: "We can leverage our resources better.",
    exampleTranslation: "リソースをより良く活用できます。",
    level: "advanced",
    category: "business"
  },
  {
    id: 109,
    word: "initiative",
    meaning: "イニシアチブ、主導権",
    partOfSpeech: "名詞",
    example: "She took the initiative to solve the problem.",
    exampleTranslation: "彼女は問題解決の主導権を取りました。",
    level: "intermediate",
    category: "business"
  },
  {
    id: 110,
    word: "milestone",
    meaning: "マイルストーン、節目",
    partOfSpeech: "名詞",
    example: "We reached an important milestone.",
    exampleTranslation: "重要な節目に到達しました。",
    level: "intermediate",
    category: "business"
  },
  {
    id: 111,
    word: "benchmark",
    meaning: "ベンチマーク、基準",
    partOfSpeech: "名詞",
    example: "This is our benchmark for success.",
    exampleTranslation: "これが成功の基準です。",
    level: "intermediate",
    category: "business"
  },
  {
    id: 112,
    word: "stakeholder",
    meaning: "ステークホルダー、関係者",
    partOfSpeech: "名詞",
    example: "We need to consider all stakeholders.",
    exampleTranslation: "すべてのステークホルダーを考慮する必要があります。",
    level: "advanced",
    category: "business"
  },
  {
    id: 113,
    word: "consensus",
    meaning: "合意、コンセンサス",
    partOfSpeech: "名詞",
    example: "We reached a consensus on the issue.",
    exampleTranslation: "その問題について合意に達しました。",
    level: "advanced",
    category: "business"
  },
  {
    id: 114,
    word: "feasibility",
    meaning: "実現可能性、実行可能性",
    partOfSpeech: "名詞",
    example: "We need to study the feasibility.",
    exampleTranslation: "実現可能性を研究する必要があります。",
    level: "advanced",
    category: "business"
  },
  {
    id: 115,
    word: "scalability",
    meaning: "スケーラビリティ、拡張性",
    partOfSpeech: "名詞",
    example: "Scalability is important for growth.",
    exampleTranslation: "成長にはスケーラビリティが重要です。",
    level: "advanced",
    category: "business"
  },

  // 日常会話でよく使われる単語 (Daily Conversation)
  {
    id: 116,
    word: "awesome",
    meaning: "素晴らしい、すごい",
    partOfSpeech: "形容詞",
    example: "That movie was awesome!",
    exampleTranslation: "あの映画は素晴らしかった！",
    level: "beginner",
    category: "daily"
  },
  {
    id: 117,
    word: "amazing",
    meaning: "驚くべき、すばらしい",
    partOfSpeech: "形容詞",
    example: "The view from here is amazing.",
    exampleTranslation: "ここからの景色は驚くほど美しいです。",
    level: "beginner",
    category: "daily"
  },
  {
    id: 118,
    word: "fantastic",
    meaning: "素晴らしい、すばらしい",
    partOfSpeech: "形容詞",
    example: "You did a fantastic job!",
    exampleTranslation: "素晴らしい仕事をしましたね！",
    level: "beginner",
    category: "daily"
  },
  {
    id: 119,
    word: "incredible",
    meaning: "信じられない、すごい",
    partOfSpeech: "形容詞",
    example: "The technology is incredible.",
    exampleTranslation: "その技術は信じられないほどです。",
    level: "intermediate",
    category: "daily"
  },
  {
    id: 120,
    word: "wonderful",
    meaning: "素晴らしい、すばらしい",
    partOfSpeech: "形容詞",
    example: "We had a wonderful time.",
    exampleTranslation: "素晴らしい時間を過ごしました。",
    level: "beginner",
    category: "daily"
  },
  {
    id: 121,
    word: "terrible",
    meaning: "ひどい、恐ろしい",
    partOfSpeech: "形容詞",
    example: "The weather was terrible yesterday.",
    exampleTranslation: "昨日の天気はひどかったです。",
    level: "beginner",
    category: "daily"
  },
  {
    id: 122,
    word: "horrible",
    meaning: "恐ろしい、ひどい",
    partOfSpeech: "形容詞",
    example: "That was a horrible accident.",
    exampleTranslation: "それは恐ろしい事故でした。",
    level: "beginner",
    category: "daily"
  },
  {
    id: 123,
    word: "awesome",
    meaning: "素晴らしい、すごい",
    partOfSpeech: "形容詞",
    example: "Your presentation was awesome!",
    exampleTranslation: "あなたのプレゼンテーションは素晴らしかった！",
    level: "beginner",
    category: "daily"
  },
  {
    id: 124,
    word: "excellent",
    meaning: "優秀な、素晴らしい",
    partOfSpeech: "形容詞",
    example: "The food at this restaurant is excellent.",
    exampleTranslation: "このレストランの料理は素晴らしいです。",
    level: "beginner",
    category: "daily"
  },
  {
    id: 125,
    word: "outstanding",
    meaning: "傑出した、優秀な",
    partOfSpeech: "形容詞",
    example: "She has outstanding leadership skills.",
    exampleTranslation: "彼女は傑出したリーダーシップスキルを持っています。",
    level: "intermediate",
    category: "daily"
  },
  {
    id: 126,
    word: "remarkable",
    meaning: "注目すべき、素晴らしい",
    partOfSpeech: "形容詞",
    example: "The progress has been remarkable.",
    exampleTranslation: "進歩は注目すべきものでした。",
    level: "intermediate",
    category: "daily"
  },
  {
    id: 127,
    word: "impressive",
    meaning: "印象的な、素晴らしい",
    partOfSpeech: "形容詞",
    example: "Your work is very impressive.",
    exampleTranslation: "あなたの仕事はとても印象的です。",
    level: "intermediate",
    category: "daily"
  },
  {
    id: 128,
    word: "extraordinary",
    meaning: "並外れた、特別な",
    partOfSpeech: "形容詞",
    example: "She has extraordinary talent.",
    exampleTranslation: "彼女は並外れた才能を持っています。",
    level: "advanced",
    category: "daily"
  },
  {
    id: 129,
    word: "exceptional",
    meaning: "例外的な、優秀な",
    partOfSpeech: "形容詞",
    example: "This is an exceptional opportunity.",
    exampleTranslation: "これは例外的な機会です。",
    level: "advanced",
    category: "daily"
  },
  {
    id: 130,
    word: "phenomenal",
    meaning: "驚異的な、すばらしい",
    partOfSpeech: "形容詞",
    example: "The results were phenomenal.",
    exampleTranslation: "結果は驚異的でした。",
    level: "advanced",
    category: "daily"
  }
];

export function getVocabularyWords(
  level?: 'beginner' | 'intermediate' | 'advanced',
  category?: 'all' | 'toeic' | 'business' | 'daily' | 'academic'
): VocabularyWord[] {
  let filteredWords = vocabularyWords;
  
  // レベルでフィルタリング
  if (level) {
    filteredWords = filteredWords.filter(word => word.level === level);
  }
  
  // カテゴリでフィルタリング
  if (category && category !== 'all') {
    filteredWords = filteredWords.filter(word => word.category === category);
  }
  
  return filteredWords;
}