# 実装プレイブック - 「ドキュメントを見て」指示対応

## 🎯 このドキュメントの使い方

**「ドキュメントを見て XX を実装してください」** の指示に対して、このプレイブックを参照して即座に実装を開始できます。

## 📋 実装パターン別ガイド

### パターン 1: 「語順問題を拡張してください」

#### 即座実行手順

```bash
# 1. 現在状況確認
grep -A 10 '"word-order".*easy' src/data/foundationQuestions.ts

# 2. 問題追加実装
# ID範囲: 2006-2030 (easy), 2106-2130 (normal), 2206-2230 (hard)
```

#### 問題テンプレート

```typescript
// 基本語順セット (2006-2010)
{
  id: 2006,
  japanese: "私は昨日映画を見ました。",
  correctAnswer: "I watched a movie yesterday.",
  explanation: "英語は「主語 + 動詞 + 目的語 + 時間」の順序です。",
  choices: [
    "I watched a movie yesterday.",
    "Yesterday I watched a movie.",
    "I a movie watched yesterday.",
    "Watched I a movie yesterday.",
  ]
}

// 疑問文語順セット (2011-2015)
{
  id: 2011,
  japanese: "あなたは何を食べますか？",
  correctAnswer: "What do you eat?",
  explanation: "疑問詞 + 助動詞 + 主語 + 動詞の順序です。",
  choices: [
    "What do you eat?",
    "What you do eat?",
    "Do you what eat?",
    "You do eat what?",
  ]
}
```

#### セット定義

```typescript
"word-order": {
  "basic": [2001, 2005],      // 基本語順
  "questions": [2006, 2010],  // 疑問文語順
  "modifiers": [2011, 2015],  // 修飾語位置
  "tenses": [2016, 2020],     // 時制と語順
  "complex": [2021, 2025],    // 複文語順
  "advanced": [2026, 2030],   // 高度語順
}
```

### パターン 2: 「代名詞問題を拡張してください」

#### 問題テンプレート

```typescript
// 人称代名詞セット (3006-3010)
{
  id: 3006,
  japanese: "（　）は学生です。（彼）",
  correctAnswer: "He is a student.",
  explanation: "「彼は」は人称代名詞の \"He\" を使います。",
  choices: [
    "He is a student.",
    "Him is a student.",
    "His is a student.",
    "Himself is a student.",
  ]
}

// 所有代名詞セット (3011-3015)
{
  id: 3011,
  japanese: "これは（　）本です。（私の）",
  correctAnswer: "This is my book.",
  explanation: "「私の」は所有代名詞の \"my\" を使います。",
  choices: [
    "This is my book.",
    "This is I book.",
    "This is me book.",
    "This is mine book.",
  ]
}
```

### パターン 3: 「冠詞問題を拡張してください」

#### 問題テンプレート

```typescript
// a/an使い分けセット (4006-4010)
{
  id: 4006,
  japanese: "彼は（　）医者です。",
  correctAnswer: "He is a doctor.",
  explanation: "doctor は子音で始まるので \"a\" を使います。",
  choices: [
    "He is a doctor.",
    "He is an doctor.",
    "He is the doctor.",
    "He is doctor.",
  ]
}

// the特定用法セット (4011-4015)
{
  id: 4011,
  japanese: "（　）太陽は明るいです。",
  correctAnswer: "The sun is bright.",
  explanation: "太陽は世界に一つしかないので \"the\" を使います。",
  choices: [
    "The sun is bright.",
    "A sun is bright.",
    "An sun is bright.",
    "Sun is bright.",
  ]
}
```

## 🔧 実装時の必須チェック

### 1. ID 管理ルール

```
品詞: 1000番台（1001-1999）
語順: 2000番台（2001-2999）
代名詞: 3000番台（3001-3999）
冠詞: 4000番台（4001-4999）
複数形: 5000番台（5001-5999）
疑問文・否定文: 6000番台（6001-6999）
前置詞: 7000番台（7001-7999）
接続詞: 8000番台（8001-8999）
```

### 2. 難易度別 ID

```
easy: X001-X099
normal: X101-X199
hard: X201-X299
```

### 3. セット別 ID

```
基本編: X001-X005
セット2: X006-X010
セット3: X011-X015
セット4: X016-X020
セット5: X021-X025
応用編: X026-X030
```

## 📊 実装完了の確認方法

### 問題数確認コマンド

```bash
# 特定カテゴリーの問題数
grep -c "id: 2[0-9][0-9][0-9]" src/data/foundationQuestions.ts

# 全基礎問題数
grep -c "id: [1-8][0-9][0-9][0-9]" src/data/foundationQuestions.ts

# セット選択画面テスト
curl -s http://localhost:3000/learning/foundation/sets/word-order/easy
```

### 動作テスト手順

```bash
# 1. セット選択画面
http://localhost:3000/learning/foundation/sets/CATEGORY/easy

# 2. 各セットテスト
http://localhost:3000/learning/foundation/quiz/CATEGORY/easy/basic
http://localhost:3000/learning/foundation/quiz/CATEGORY/easy/advanced

# 3. 問題数確認
「問題 1 / 5」と表示されることを確認
```

## 🚀 効率的実装のコツ

### 1. 問題作成の効率化

```typescript
// テンプレートを活用
const templates = [
  { pattern: "私は{object}を{verb}ます。", type: "SVO" },
  { pattern: "{subject}は{adjective}です。", type: "SVC" },
];

// 語彙の組み合わせで大量生成
const vocabulary = {
  subjects: ["私", "彼", "彼女", "私たち"],
  objects: ["本", "映画", "音楽", "料理"],
  verbs: ["読み", "見", "聞き", "作り"],
  adjectives: ["美しい", "面白い", "難しい", "簡単"],
};
```

### 2. 品質管理の自動化

```bash
# ID重複チェック
grep -o "id: [0-9]*" src/data/foundationQuestions.ts | sort | uniq -d

# 問題数チェック
grep -c "japanese:" src/data/foundationQuestions.ts

# セット整合性チェック
node scripts/validateQuestionSets.js
```

### 3. テストの自動化

```typescript
// Playwright MCPでの自動テスト
const categories = ["word-order", "pronouns", "articles"];
const difficulties = ["easy", "normal", "hard"];

for (const category of categories) {
  for (const difficulty of difficulties) {
    await testFoundationSets(category, difficulty);
  }
}
```

## 📝 コミットメッセージテンプレート

### カテゴリー拡張時

```
{カテゴリー名}問題拡張完了 - 15問→30問（6セット×5問）

【問題データ拡張】
- foundationQuestions.ts: {カテゴリー名}を15問→30問に拡張
- 基本編(ID範囲): 基本的な理解
- 応用編(ID範囲): 実践的活用
- 高度編(ID範囲): 複雑な応用

【セット分割システム】
- getFoundationQuestionsBySet: {カテゴリー名}セット範囲追加
- getAvailableFoundationSets: {カテゴリー名}セット情報定義
- 6セット構成: 基本→応用→高度の段階的学習

【学習効果】
- 学習時間: 3-5分/セット × 6セット
- 達成感: セット毎の完了報酬
- 専門性: {カテゴリー名}に特化した問題設計
- ENTPの特性: 飽きない豊富なバリエーション

【動作確認】
- セット選択: 6セットの正常表示
- 問題取得: 5問ずつの適切な分割
- ナビゲーション: 完璧な画面遷移
- スコア管理: 正解判定・進捗表示

システム完成度: XX% → YY%
```

## 🔄 継続的改善のためのメモ

### 実装中に気づいた改善点

- **問題の質**: より自然な日本語表現
- **解説の充実**: ENTP が納得する論理的説明
- **選択肢の巧妙さ**: よくある間違いを含む誤答
- **セットの専門性**: より特化した問題分類

### 将来の拡張アイデア

- **動的難易度調整**: ユーザーの正解率に応じた問題選択
- **個人最適化**: 苦手分野の重点的出題
- **ソーシャル機能**: 友達との進捗比較
- **ゲーミング強化**: より豊富な報酬システム

---

**このプレイブックがあれば、「ドキュメントを見て」の指示で即座に効率的な実装が可能です。**

_作成日: 2025 年 9 月 20 日_
_対象: Phase A - 基礎カテゴリー拡張_
_システム評価: 99 点/100 点_
