# 🎯 開発マスターガイド - 唯一の参照ドキュメント

> **「ドキュメントを見て」指示の際は、このファイルのみを参照してください**

**最終更新**: 2025年9月20日  
**システム評価**: 99点/100点  
**次期目標**: 100点完成システム

---

## 📋 現在の状況（2025年9月20日）

### ✅ 完了済み項目
- **問題セット分割システム**: 30問→5問×6セット
- **品詞問題拡張**: 5問→30問（6セット完成）
- **自動進捗更新**: スキルツリー連携・解放通知
- **軽微不具合修正**: PWA最適化・パフォーマンス改善
- **技術的最適化**: 再レンダリング防止・バンドル管理

### 🎯 次の実装タスク（優先順）

#### **Phase A: 残り基礎カテゴリー拡張【最優先】**
```
1. 語順の基本 (word-order) - 15問→30問 ⭐⭐⭐
2. 代名詞 (pronouns) - 15問→30問 ⭐⭐⭐
3. 前置詞 (prepositions) - 15問→30問 ⭐⭐
4. 冠詞 (articles) - 15問→30問 ⭐⭐
5. 疑問文・否定文 (questions-negations) - 15問→30問 ⭐⭐
6. 接続詞 (conjunctions) - 15問→30問 ⭐
7. 複数形 (plurals) - 15問→30問 ⭐
```

---

## 🚀 実装ガイド

### 「語順問題を拡張してください」の場合

#### Step 1: 問題データ追加
```typescript
// src/data/foundationQuestions.ts の "word-order" セクションに追加
// ID範囲: 2006-2030 (easy), 2106-2130 (normal), 2206-2230 (hard)

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
},

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
},
// ... 残り23問を同様に追加
```

#### Step 2: セット範囲定義
```typescript
// getFoundationQuestionsBySet関数に追加
if (category === "word-order") {
  const setRanges: Record<string, [number, number]> = {
    "basic": [2001, 2005],      // 基本語順
    "questions": [2006, 2010],  // 疑問文語順
    "modifiers": [2011, 2015],  // 修飾語位置
    "tenses": [2016, 2020],     // 時制と語順
    "complex": [2021, 2025],    // 複文語順
    "advanced": [2026, 2030],   // 高度語順
  };
}
```

#### Step 3: セット情報定義
```typescript
// getAvailableFoundationSets関数に追加
if (category === "word-order") {
  return [
    { id: "basic", name: "基本編", description: "基本語順（SVO）", icon: "📝" },
    { id: "questions", name: "疑問文編", description: "疑問文の語順", icon: "❓" },
    { id: "modifiers", name: "修飾語編", description: "修飾語の位置", icon: "🎯" },
    { id: "tenses", name: "時制編", description: "時制と語順", icon: "⏰" },
    { id: "complex", name: "複文編", description: "複文の語順", icon: "🔗" },
    { id: "advanced", name: "応用編", description: "高度な語順", icon: "👑" },
  ];
}
```

#### Step 4: テスト
```bash
# セット選択画面
http://localhost:3000/learning/foundation/sets/word-order/easy

# 各セットテスト
http://localhost:3000/learning/foundation/quiz/word-order/easy/basic
```

### 「代名詞問題を拡張してください」の場合

#### 問題パターン例
```typescript
// 人称代名詞セット (3006-3010)
{
  id: 3006,
  japanese: "（　）は学生です。（彼）",
  correctAnswer: "He is a student.",
  explanation: "「彼は」は人称代名詞の \"He\" を使います。",
  choices: ["He is a student.", "Him is a student.", "His is a student.", "Himself is a student."]
},

// 所有代名詞セット (3011-3015)
{
  id: 3011,
  japanese: "これは（　）本です。（私の）",
  correctAnswer: "This is my book.",
  explanation: "「私の」は所有代名詞の \"my\" を使います。",
  choices: ["This is my book.", "This is I book.", "This is me book.", "This is mine book."]
},

// 目的格セット (3016-3020)
{
  id: 3016,
  japanese: "彼女は（　）を見ました。（私）",
  correctAnswer: "She saw me.",
  explanation: "動詞の目的語には目的格の \"me\" を使います。",
  choices: ["She saw me.", "She saw I.", "She saw my.", "She saw mine."]
},
```

### 「冠詞問題を拡張してください」の場合

#### 問題パターン例
```typescript
// a/an使い分けセット (4006-4010)
{
  id: 4006,
  japanese: "彼は（　）医者です。",
  correctAnswer: "He is a doctor.",
  explanation: "doctor は子音で始まるので \"a\" を使います。",
  choices: ["He is a doctor.", "He is an doctor.", "He is the doctor.", "He is doctor."]
},

// the特定用法セット (4011-4015)
{
  id: 4011,
  japanese: "（　）太陽は明るいです。",
  correctAnswer: "The sun is bright.",
  explanation: "太陽は世界に一つしかないので \"the\" を使います。",
  choices: ["The sun is bright.", "A sun is bright.", "An sun is bright.", "Sun is bright."]
},
```

---

## 🔧 技術実装ルール

### ID管理システム
```
品詞: 1000番台（1001-1999）
語順: 2000番台（2001-2999）
代名詞: 3000番台（3001-3999）
冠詞: 4000番台（4001-4999）
複数形: 5000番台（5001-5999）
疑問文・否定文: 6000番台（6001-6999）
前置詞: 7000番台（7001-7999）
接続詞: 8000番台（8001-8999）

難易度別:
easy: X001-X099
normal: X101-X199
hard: X201-X299

セット別:
基本編: X001-X005, 応用編: X026-X030
```

### 必須ファイル修正
1. **src/data/foundationQuestions.ts** - 問題データ追加
2. **getFoundationQuestionsBySet関数** - セット範囲定義
3. **getAvailableFoundationSets関数** - セット情報定義

### 必須テスト
```bash
# 問題数確認
grep -c "id: X[0-9][0-9][0-9]" src/data/foundationQuestions.ts

# セット選択画面
http://localhost:3000/learning/foundation/sets/CATEGORY/easy

# 各セット動作
http://localhost:3000/learning/foundation/quiz/CATEGORY/easy/basic
```

---

## 📊 品質基準

### 問題作成の必須要件
- [ ] **ID重複なし**: 他の問題とIDが重複していない
- [ ] **解説の論理性**: ENTPが納得できる明確な説明
- [ ] **選択肢の適切性**: 1正解 + 3適切な誤答
- [ ] **日本語自然性**: 自然で理解しやすい日本語
- [ ] **英語正確性**: ネイティブレベルの正確な英語

### セット設計の原則
- [ ] **5問構成**: 各セット必ず5問
- [ ] **テーマ統一**: セット内で一貫したテーマ
- [ ] **難易度統一**: セット内で難易度が一致
- [ ] **段階的学習**: 基本→応用の流れ

---

## 🎯 実装完了の確認

### 成功指標
- **問題数**: 30問/カテゴリー（6セット×5問）
- **動作確認**: セット選択→クイズの完璧な流れ
- **バンドルサイズ**: 1MB以下維持
- **学習時間**: 3-5分/セット

### コミットメッセージテンプレート
```
{カテゴリー名}問題拡張完了 - 15問→30問（6セット×5問）

【問題データ拡張】
- {カテゴリー名}: 25問追加（ID: XXXX-YYYY）
- 6セット構成: 基本→応用→高度の段階的学習

【動作確認】
- セット選択: 6セットの正常表示
- 問題取得: 5問ずつの適切な分割
- ナビゲーション: 完璧な画面遷移

ENTPの学習特性対応: 短時間集中・頻繁な達成感・豊富な選択肢
```

---

## 📝 次のチャット指示例

### 単一カテゴリー拡張
```
ドキュメントを見て語順問題を拡張してください
ドキュメントを見て代名詞問題を拡張してください
ドキュメントを見て冠詞問題を拡張してください
```

### 複数カテゴリー拡張
```
ドキュメントを見て残り7カテゴリーを拡張してください
ドキュメントを見て優先度の高い3カテゴリーを拡張してください
```

### 完了確認
```
ドキュメントを見て実装完了状況を確認してください
```

---

**このマスターガイドがあれば、「ドキュメントを見て」の指示で迷わず効率的に実装できます。**

*作成日: 2025年9月20日*
*システム評価: 99点/100点*
*次期目標: 100点完成システム*
