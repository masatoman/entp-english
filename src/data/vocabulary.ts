export interface VocabularyWord {
  id: number;
  word: string;
  meaning: string;
  partOfSpeech: string;
  example: string;
  exampleTranslation: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export const vocabularyWords: VocabularyWord[] = [
  {
    id: 1,
    word: "accomplish",
    meaning: "達成する、成し遂げる",
    partOfSpeech: "動詞",
    example: "She accomplished her goal of learning English.",
    exampleTranslation: "彼女は英語を学ぶという目標を達成した。",
    level: "intermediate"
  },
  {
    id: 2,
    word: "opportunity",
    meaning: "機会、チャンス",
    partOfSpeech: "名詞",
    example: "This is a great opportunity to improve your skills.",
    exampleTranslation: "これはスキルを向上させる絶好の機会です。",
    level: "intermediate"
  },
  {
    id: 3,
    word: "determine",
    meaning: "決定する、決心する",
    partOfSpeech: "動詞",
    example: "We need to determine the best solution.",
    exampleTranslation: "最良の解決策を決定する必要があります。",
    level: "intermediate"
  },
  {
    id: 4,
    word: "significant",
    meaning: "重要な、意義のある",
    partOfSpeech: "形容詞",
    example: "This discovery has significant implications.",
    exampleTranslation: "この発見は重要な意味を持っています。",
    level: "advanced"
  },
  {
    id: 5,
    word: "establish",
    meaning: "設立する、確立する",
    partOfSpeech: "動詞",
    example: "They established a new company last year.",
    exampleTranslation: "彼らは昨年新しい会社を設立した。",
    level: "intermediate"
  },
  {
    id: 6,
    word: "reliable",
    meaning: "信頼できる、頼りになる",
    partOfSpeech: "形容詞",
    example: "He is a reliable friend who always helps.",
    exampleTranslation: "彼はいつも助けてくれる信頼できる友人です。",
    level: "beginner"
  },
  {
    id: 7,
    word: "appreciate",
    meaning: "感謝する、評価する",
    partOfSpeech: "動詞",
    example: "I appreciate your help with this project.",
    exampleTranslation: "このプロジェクトでの助けに感謝します。",
    level: "intermediate"
  },
  {
    id: 8,
    word: "essential",
    meaning: "不可欠な、必要不可欠な",
    partOfSpeech: "形容詞",
    example: "Water is essential for all living things.",
    exampleTranslation: "水はすべての生物にとって不可欠です。",
    level: "intermediate"
  },
  {
    id: 9,
    word: "consequence",
    meaning: "結果、影響",
    partOfSpeech: "名詞",
    example: "Every action has a consequence.",
    exampleTranslation: "すべての行動には結果があります。",
    level: "advanced"
  },
  {
    id: 10,
    word: "obviously",
    meaning: "明らかに、当然",
    partOfSpeech: "副詞",
    example: "Obviously, we need to work harder.",
    exampleTranslation: "明らかに、私たちはもっと頑張る必要があります。",
    level: "intermediate"
  },
  {
    id: 11,
    word: "confident",
    meaning: "自信のある、確信している",
    partOfSpeech: "形容詞",
    example: "She feels confident about the presentation.",
    exampleTranslation: "彼女はプレゼンテーションに自信を持っています。",
    level: "beginner"
  },
  {
    id: 12,
    word: "implement",
    meaning: "実行する、実施する",
    partOfSpeech: "動詞",
    example: "We will implement the new policy next month.",
    exampleTranslation: "来月から新しい方針を実施します。",
    level: "advanced"
  },
  {
    id: 13,
    word: "brilliant",
    meaning: "優秀な、素晴らしい",
    partOfSpeech: "形容詞",
    example: "That was a brilliant idea!",
    exampleTranslation: "それは素晴らしいアイデアでした！",
    level: "intermediate"
  },
  {
    id: 14,
    word: "evaluate",
    meaning: "評価する、査定する",
    partOfSpeech: "動詞",
    example: "Teachers evaluate students' progress regularly.",
    exampleTranslation: "教師は定期的に生徒の進歩を評価します。",
    level: "advanced"
  },
  {
    id: 15,
    word: "appropriate",
    meaning: "適切な、ふさわしい",
    partOfSpeech: "形容詞",
    example: "Please wear appropriate clothing for the meeting.",
    exampleTranslation: "会議にふさわしい服装をしてください。",
    level: "intermediate"
  }
];

export function getVocabularyWords(level?: 'beginner' | 'intermediate' | 'advanced'): VocabularyWord[] {
  if (level) {
    return vocabularyWords.filter(word => word.level === level);
  }
  return vocabularyWords;
}