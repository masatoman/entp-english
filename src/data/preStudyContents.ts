import { PreStudyContent } from '../types/starSystem';

export const samplePreStudyContents: PreStudyContent[] = [
  // Level 1-5: be動詞の理論
  {
    id: "theory_be_001",
    title: "be動詞の基本概念",
    category: "grammar",
    subcategory: "be-verb",
    level: 1,
    contentType: "theory",
    duration: 90,
    content: `# be動詞の本質

## 核心概念
be動詞は「存在」と「状態」を表す動詞です。

## なぜ重要なのか
- 英語の最も基本的な動詞
- 文の骨格を作る役割
- 他の文法の基礎となる

## 3つの形
- **am**: I専用
- **is**: 単数（he, she, it, this, that等）
- **are**: 複数（you, we, they等）

## 使い分けの論理
主語の「人称」と「数」によって自動的に決まる
→ 暗記ではなく、論理で理解`,
    keyPoints: [
      "be動詞は存在・状態を表す",
      "主語によって形が変わる",
      "am/is/areの使い分けは論理的"
    ],
    examples: [
      {
        english: "I am a student.",
        japanese: "私は学生です。",
        explanation: "主語がIなのでam"
      },
      {
        english: "She is kind.",
        japanese: "彼女は親切です。",
        explanation: "三人称単数なのでis"
      },
      {
        english: "They are friends.",
        japanese: "彼らは友達です。",
        explanation: "複数主語なのでare"
      }
    ],
    relatedProblems: ["be001", "be002", "be003"],
    difficulty: "beginner"
  },

  {
    id: "theory_be_002", 
    title: "be動詞の語源と歴史",
    category: "grammar",
    subcategory: "be-verb",
    level: 3,
    contentType: "background",
    duration: 120,
    content: `# be動詞の語源的理解

## 古英語からの変遷
現代のam/is/areは、実は3つの異なる語根から来ています：

## 語源の謎
- **am**: 古英語「eom」< ゲルマン語「esmi」
- **is**: 古英語「is」< ゲルマン語「esti」  
- **are**: 古英語「aron」< ゲルマン語「arun」

## なぜバラバラなのか
最も基本的な動詞だからこそ、古い形が保存された
→ 不規則だが、それが歴史の証拠

## 他言語との比較
- ドイツ語: bin/ist/sind
- フランス語: suis/est/sont
- 共通の印欧語族の起源`,
    keyPoints: [
      "be動詞は3つの語根から成る",
      "不規則性は歴史の証拠",
      "他言語とも共通起源"
    ],
    examples: [
      {
        english: "Evolution of 'am'",
        japanese: "amの変遷",
        explanation: "印欧語→ゲルマン語→古英語→現代英語"
      }
    ],
    prerequisites: ["theory_be_001"],
    difficulty: "intermediate"
  },

  // Level 6-10: 一般動詞の理論
  {
    id: "theory_verb_001",
    title: "一般動詞の概念",
    category: "grammar", 
    subcategory: "general-verb",
    level: 6,
    contentType: "theory",
    duration: 90,
    content: `# 一般動詞の本質

## be動詞との違い
- **be動詞**: 状態・存在
- **一般動詞**: 動作・行為

## 三人称単数現在の「s」
なぜ「He plays」なのか？

## 歴史的経緯
古英語では全ての人称で語尾変化があった
現代では三人称単数のみ残存

## 論理的理解
「三人称単数は特別」という英語の特徴
→ 暗記ではなく、言語の特性として理解`,
    keyPoints: [
      "一般動詞は動作を表す",
      "三人称単数現在にsをつける",
      "歴史的経緯がある規則"
    ],
    examples: [
      {
        english: "I play tennis.",
        japanese: "私はテニスをします。",
        explanation: "一人称なのでplay"
      },
      {
        english: "He plays tennis.",
        japanese: "彼はテニスをします。", 
        explanation: "三人称単数なのでplays"
      }
    ],
    relatedProblems: ["verb001", "verb002"],
    difficulty: "beginner"
  },

  // Level 11-15: 時制の理論
  {
    id: "theory_tense_001",
    title: "英語時制の哲学",
    category: "grammar",
    subcategory: "tense", 
    level: 11,
    contentType: "theory",
    duration: 120,
    content: `# 時制の概念設計

## 時制とは何か
時制 = 時間の文法的表現
英語話者の時間認識を反映

## 3つの基本時制
- **現在**: 今の状況・習慣
- **過去**: 完了した出来事
- **未来**: これから起こること

## 進行形の概念
「動作が進行中」という視点
→ 動作の途中を切り取る感覚

## 完了形の概念  
「過去の動作が現在に影響」
→ 時間軸をまたがる表現`,
    keyPoints: [
      "時制は時間の認識方法",
      "進行形は動作の途中を表現",
      "完了形は時間軸をまたぐ"
    ],
    examples: [
      {
        english: "I am studying.",
        japanese: "勉強中です。",
        explanation: "今まさに進行中の動作"
      },
      {
        english: "I have studied.", 
        japanese: "勉強し終えた状態です。",
        explanation: "過去の動作が現在に影響"
      }
    ],
    relatedProblems: ["tense001", "tense002", "tense003"],
    difficulty: "intermediate"
  },

  // 語彙学習
  {
    id: "vocab_travel_001",
    title: "Travel語彙：移動の概念",
    category: "vocabulary",
    subcategory: "travel",
    level: 8,
    contentType: "explanation", 
    duration: 180,
    content: `# 移動・旅行の語彙体系

## 語根：port（運ぶ）
この語根から多くの単語が派生

## 派生語ネットワーク
- **transport**: trans（横切って）+ port（運ぶ）= 輸送
- **import**: im（中に）+ port（運ぶ）= 輸入
- **export**: ex（外に）+ port（運ぶ）= 輸出
- **portable**: port（運ぶ）+ able（できる）= 持ち運べる

## 記憶戦略
語根を軸とした関連性で覚える
→ 単体暗記より効率的

## 実用コンテキスト
空港・駅・旅行での実際の使用場面`,
    keyPoints: [
      "portは「運ぶ」という意味",
      "語根から派生語を体系的に理解",
      "実際の場面での使用方法"
    ],
    examples: [
      {
        english: "I need to transport my luggage.",
        japanese: "荷物を運ぶ必要があります。",
        explanation: "transportは輸送・運搬の意味"
      },
      {
        english: "This device is portable.",
        japanese: "この機器は持ち運び可能です。",
        explanation: "portableは携帯可能という意味"
      }
    ],
    difficulty: "beginner"
  }
];

// 事前学習コンテンツを取得する関数
export const getPreStudyContentsForLevel = (level: number): PreStudyContent[] => {
  return samplePreStudyContents.filter(content => content.level <= level);
};

// カテゴリ別コンテンツ取得
export const getPreStudyContentsByCategory = (
  category: PreStudyContent['category'],
  level: number
): PreStudyContent[] => {
  return samplePreStudyContents.filter(
    content => content.category === category && content.level <= level
  );
};

// 前提条件をチェック
export const canAccessPreStudyContent = (
  contentId: string,
  completedContents: string[]
): boolean => {
  const content = samplePreStudyContents.find(c => c.id === contentId);
  if (!content || !content.prerequisites) return true;
  
  return content.prerequisites.every(prereq => completedContents.includes(prereq));
};
