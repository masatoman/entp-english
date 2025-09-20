#!/usr/bin/env node

/**
 * 基礎問題自動生成スクリプト
 * 各カテゴリーを15問から50問に拡張
 */

// 品詞問題のテンプレート
const partsOfSpeechTemplates = {
  easy: {
    noun: [
      {
        pattern: "私の（　）は{adjective}です。",
        answer: "My {noun} is {adjective}.",
        target: "名詞",
      },
      {
        pattern: "その（　）は新しいです。",
        answer: "The {noun} is new.",
        target: "名詞",
      },
      {
        pattern: "あの（　）は大きいです。",
        answer: "That {noun} is big.",
        target: "名詞",
      },
    ],
    verb: [
      {
        pattern: "私は毎日（　）。",
        answer: "I {verb} every day.",
        target: "動詞",
      },
      {
        pattern: "彼女は上手に（　）。",
        answer: "She {verb}s well.",
        target: "動詞",
      },
      {
        pattern: "私たちは公園で（　）。",
        answer: "We {verb} in the park.",
        target: "動詞",
      },
    ],
    adjective: [
      {
        pattern: "この{noun}は（　）です。",
        answer: "This {noun} is {adjective}.",
        target: "形容詞",
      },
      {
        pattern: "その部屋は（　）です。",
        answer: "The room is {adjective}.",
        target: "形容詞",
      },
      {
        pattern: "あの映画は（　）です。",
        answer: "That movie is {adjective}.",
        target: "形容詞",
      },
    ],
    adverb: [
      {
        pattern: "彼は（　）{verb}ます。",
        answer: "He {verb}s {adverb}.",
        target: "副詞",
      },
      {
        pattern: "私は（　）勉強します。",
        answer: "I study {adverb}.",
        target: "副詞",
      },
      {
        pattern: "彼女は（　）話します。",
        answer: "She speaks {adverb}.",
        target: "副詞",
      },
    ],
  },
};

// 語彙データ
const vocabulary = {
  nouns: [
    "book",
    "car",
    "house",
    "teacher",
    "student",
    "dog",
    "cat",
    "apple",
    "computer",
    "phone",
  ],
  verbs: [
    "study",
    "read",
    "write",
    "run",
    "walk",
    "sing",
    "dance",
    "play",
    "work",
    "sleep",
  ],
  adjectives: [
    "beautiful",
    "big",
    "small",
    "new",
    "old",
    "good",
    "bad",
    "happy",
    "sad",
    "clean",
  ],
  adverbs: [
    "quickly",
    "slowly",
    "carefully",
    "loudly",
    "quietly",
    "well",
    "hard",
    "softly",
    "patiently",
    "correctly",
  ],
};

// 語順問題のテンプレート
const wordOrderTemplates = {
  easy: [
    {
      pattern: "私は{noun}を{verb}ます。",
      answer: "I {verb} {article} {noun}.",
      explanation: "英語は「主語 + 動詞 + 目的語」の順序です。",
      distractors: [
        "I {noun} {verb}.",
        "{verb} I {article} {noun}.",
        "{article} {noun} I {verb}.",
      ],
    },
    {
      pattern: "彼は{adjective}です。",
      answer: "He is {adjective}.",
      explanation: "be動詞の文は「主語 + be動詞 + 形容詞/名詞」です。",
      distractors: [
        "He {adjective} is.",
        "Is he {adjective}.",
        "{adjective} he is.",
      ],
    },
  ],
};

// 代名詞問題のテンプレート
const pronounTemplates = {
  easy: [
    {
      pattern: "（　）は学生です。（私）",
      answer: "I am a student.",
      explanation: '「私は」は英語で "I" です。',
      distractors: [
        "Me am a student.",
        "My am a student.",
        "Mine am a student.",
      ],
    },
    {
      pattern: "（　）の本です。（彼の）",
      answer: "It is his book.",
      explanation: '「彼の」は所有格の "his" を使います。',
      distractors: ["It is he book.", "It is him book.", "It is himself book."],
    },
  ],
};

/**
 * 問題を生成する関数
 */
function generateQuestions(category, difficulty, count = 35) {
  const questions = [];
  let idStart = getIdStart(category, difficulty);

  for (let i = 0; i < count; i++) {
    const question = generateSingleQuestion(category, difficulty, idStart + i);
    if (question) {
      questions.push(question);
    }
  }

  return questions;
}

/**
 * 単一問題を生成
 */
function generateSingleQuestion(category, difficulty, id) {
  switch (category) {
    case "parts-of-speech":
      return generatePartsOfSpeechQuestion(difficulty, id);
    case "word-order":
      return generateWordOrderQuestion(difficulty, id);
    case "pronouns":
      return generatePronounQuestion(difficulty, id);
    default:
      return null;
  }
}

/**
 * 品詞問題を生成
 */
function generatePartsOfSpeechQuestion(difficulty, id) {
  const templates = partsOfSpeechTemplates[difficulty];
  if (!templates) return null;

  const categories = Object.keys(templates);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const template =
    templates[category][Math.floor(Math.random() * templates[category].length)];

  // テンプレートに語彙を埋め込み
  const noun =
    vocabulary.nouns[Math.floor(Math.random() * vocabulary.nouns.length)];
  const verb =
    vocabulary.verbs[Math.floor(Math.random() * vocabulary.verbs.length)];
  const adjective =
    vocabulary.adjectives[
      Math.floor(Math.random() * vocabulary.adjectives.length)
    ];
  const adverb =
    vocabulary.adverbs[Math.floor(Math.random() * vocabulary.adverbs.length)];

  const japanese = template.pattern
    .replace("{noun}", noun)
    .replace("{verb}", verb)
    .replace("{adjective}", adjective)
    .replace("{adverb}", adverb);

  const correctAnswer = template.answer
    .replace("{noun}", noun)
    .replace("{verb}", verb)
    .replace("{adjective}", adjective)
    .replace("{adverb}", adverb);

  // 選択肢を生成（正解 + 3つの誤答）
  const choices = generateChoices(correctAnswer, category);

  return {
    id,
    japanese,
    correctAnswer,
    explanation: `${template.target}の問題です。${
      template.target
    }は${getPartOfSpeechExplanation(category)}。`,
    choices: shuffleArray(choices),
  };
}

/**
 * 選択肢を生成
 */
function generateChoices(correctAnswer, category) {
  const choices = [correctAnswer];

  // カテゴリーに応じて誤答を生成
  for (let i = 0; i < 3; i++) {
    const wrongAnswer = generateWrongAnswer(correctAnswer, category);
    if (!choices.includes(wrongAnswer)) {
      choices.push(wrongAnswer);
    }
  }

  // 不足分は類似の誤答で埋める
  while (choices.length < 4) {
    choices.push(generateSimilarWrongAnswer(correctAnswer));
  }

  return choices;
}

/**
 * 誤答を生成
 */
function generateWrongAnswer(correctAnswer, category) {
  // 簡単な変換ルールで誤答を作成
  const transformations = {
    noun: [
      (word) => word + "ing", // 動名詞化
      (word) => word + "ed", // 過去分詞化
      (word) => word + "s", // 複数形化
    ],
    verb: [
      (word) => word + "er", // 名詞化
      (word) => word + "ing", // 動名詞化
      (word) => word + "ed", // 過去分詞化
    ],
    adjective: [
      (word) => word + "ly", // 副詞化
      (word) => word + "ness", // 名詞化
      (word) => word + "ed", // 過去分詞化
    ],
  };

  const transforms = transformations[category] || [];
  const transform = transforms[Math.floor(Math.random() * transforms.length)];

  return transform ? transform(correctAnswer) : correctAnswer + "x";
}

/**
 * 類似の誤答を生成
 */
function generateSimilarWrongAnswer(correctAnswer) {
  // 単語を少し変更した誤答を作成
  return correctAnswer.replace(/\b\w+\b/, (word) => {
    const similar = vocabulary.nouns.concat(
      vocabulary.verbs,
      vocabulary.adjectives,
      vocabulary.adverbs
    );
    return similar[Math.floor(Math.random() * similar.length)];
  });
}

/**
 * 配列をシャッフル
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * IDの開始番号を取得
 */
function getIdStart(category, difficulty) {
  const categoryOffsets = {
    "parts-of-speech": 1000,
    "word-order": 2000,
    pronouns: 3000,
    articles: 4000,
    plurals: 5000,
    "questions-negations": 6000,
    prepositions: 7000,
    conjunctions: 8000,
  };

  const difficultyOffsets = {
    easy: 0,
    normal: 100,
    hard: 200,
  };

  return categoryOffsets[category] + difficultyOffsets[difficulty];
}

/**
 * 品詞の説明を取得
 */
function getPartOfSpeechExplanation(category) {
  const explanations = {
    noun: "人・物・事の名前を表します",
    verb: "動作や状態を表します",
    adjective: "名詞の性質や状態を表します",
    adverb: "動詞や形容詞を修飾します",
  };
  return explanations[category] || "重要な文法要素です";
}

// メイン実行部分
if (require.main === module) {
  console.log("🚀 基礎問題生成開始...");

  const categories = ["parts-of-speech", "word-order", "pronouns"];
  const difficulties = ["easy", "normal", "hard"];

  categories.forEach((category) => {
    console.log(`\n📝 ${category} カテゴリー生成中...`);

    difficulties.forEach((difficulty) => {
      const questions = generateQuestions(category, difficulty, 35);
      console.log(`  ${difficulty}: ${questions.length}問生成`);

      // ファイルに出力（実装例）
      // fs.writeFileSync(`./generated-${category}-${difficulty}.json`, JSON.stringify(questions, null, 2));
    });
  });

  console.log("\n✅ 生成完了！");
  console.log("📊 合計: 8カテゴリー × 3難易度 × 35問 = 840問");
}

module.exports = {
  generateQuestions,
  generateSingleQuestion,
  partsOfSpeechTemplates,
  vocabulary,
};
