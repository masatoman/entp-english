# 次期開発フェーズ - 実装ガイド

## 📋 現在の状況（2025 年 9 月 20 日時点）

### ✅ 完了済み項目

- **問題セット分割システム**: 30 問 →5 問 ×6 セット
- **品詞問題拡張**: 5 問 →30 問（6 セット）
- **自動進捗更新**: スキルツリー連携完成
- **軽微不具合修正**: PWA 最適化・パフォーマンス改善
- **システム評価**: 99 点/100 点達成

### 🎯 次期優先タスク

## Phase A: 残り基礎カテゴリーの拡張【高優先】

### 目標

全 8 基礎カテゴリーを 15 問 →30 問（6 セット ×5 問）に拡張

### 実装対象

```
1. 語順の基本 (word-order) - 15問→30問
2. 代名詞 (pronouns) - 15問→30問
3. 冠詞 (articles) - 15問→30問
4. 複数形 (plurals) - 15問→30問
5. 疑問文・否定文 (questions-negations) - 15問→30問
6. 前置詞 (prepositions) - 15問→30問
7. 接続詞 (conjunctions) - 15問→30問
```

### 実装手順

1. **foundationQuestions.ts 修正**

   ```typescript
   // 各カテゴリーのeasy配列に25問追加
   // ID範囲例：
   // - word-order: 2006-2030 (easy), 2106-2130 (normal), 2206-2230 (hard)
   // - pronouns: 3006-3030 (easy), 3106-3130 (normal), 3206-3230 (hard)
   ```

2. **セット定義追加**

   ```typescript
   // getFoundationQuestionsBySet関数に各カテゴリーのセット範囲を追加
   const setRanges: Record<string, Record<string, [number, number]>> = {
     "word-order": {
       basic: [2001, 2005],
       patterns: [2006, 2010],
       // ... 6セット
     },
   };
   ```

3. **FoundationQuestionSetSelection.tsx 更新**
   ```typescript
   // 各カテゴリー用のセット定義を追加
   const wordOrderSets = [
     { id: "basic", name: "基本編", description: "基本語順", icon: "📝" },
     // ... 6セット
   ];
   ```

### 推定工数

- **1 カテゴリー**: 2-3 時間（問題作成 25 問 + セット設定）
- **全 7 カテゴリー**: 14-21 時間
- **テスト・品質確認**: 3-5 時間

## Phase B: 文法カテゴリーの拡張【中優先】

### 目標

文法クイズの主要カテゴリーを 5 問 →25 問（5 セット ×5 問）に拡張

### 実装対象

```
1. 時制 (tenses) - 基本・現在・過去・未来・完了の5セット
2. 助動詞 (modals) - can/will/should/must/mightの5セット
3. 受動態 (passive) - 基本・時制・助動詞・疑問文・否定文の5セット
4. 関係詞 (relative) - who/which/that/where/whenの5セット
```

### 実装手順

1. **sentencePatternQuestions.ts 拡張**
2. **QuestionSetSelection.tsx 修正**
3. **文法専用セット選択画面作成**

## Phase C: 高度機能の実装【低優先】

### 1. AI 支援学習システム

```typescript
interface PersonalizedLearning {
  analyzeWeakPoints(userStats: UserStats): WeakPoint[];
  generateCustomQuestions(weakPoints: WeakPoint[]): Question[];
  adjustDifficulty(performance: Performance): DifficultyLevel;
}
```

### 2. ソーシャル機能

```typescript
interface SocialFeatures {
  shareProgress(progress: SkillTreeState): ShareableProgress;
  compareWithFriends(userStats: UserStats): Comparison[];
  joinStudyGroups(groupId: string): StudyGroup;
}
```

### 3. オフライン強化

```typescript
interface OfflineEnhancement {
  downloadQuestionPacks(categories: string[]): Promise<void>;
  syncProgress(): Promise<SyncResult>;
  manageStorage(): StorageInfo;
}
```

## 🚀 即座実行可能なタスク

### タスク 1: 語順問題の拡張

```bash
# 1. 語順問題の現在数確認
grep -A 20 '"word-order".*easy' src/data/foundationQuestions.ts

# 2. 問題追加（ID: 2006-2030）
# パターン例：
# - 基本語順: SVO構造
# - 疑問文語順: 疑問詞 + 助動詞 + 主語 + 動詞
# - 修飾語順: 形容詞 + 名詞、動詞 + 副詞

# 3. セット定義追加
# - 基本編、疑問文編、修飾語編、時制編、複文編、応用編
```

### タスク 2: 代名詞問題の拡張

```bash
# パターン例：
# - 人称代名詞: I/you/he/she/it/we/they
# - 所有代名詞: my/your/his/her/its/our/their
# - 目的格: me/you/him/her/it/us/them
# - 所有代名詞: mine/yours/his/hers/its/ours/theirs
# - 指示代名詞: this/that/these/those
# - 疑問代名詞: who/what/which/whose
```

### タスク 3: 冠詞問題の拡張

```bash
# パターン例：
# - a/an使い分け: 母音・子音による選択
# - the特定用法: 既知・唯一・最上級
# - 無冠詞: 不可算名詞・複数形一般
# - 固有名詞: 国名・人名・地名
# - 慣用表現: go to school vs go to the hospital
# - 楽器・スポーツ: play the piano vs play soccer
```

## 📊 品質管理チェックリスト

### 新問題作成時の必須確認

- [ ] **ID 重複チェック**: 他の問題と ID が重複していないか
- [ ] **解説の品質**: ENTP が納得できる論理的説明
- [ ] **選択肢の質**: 1 つの正解と 3 つの適切な誤答
- [ ] **難易度適正**: easy/normal/hard の適切な分類
- [ ] **日本語自然性**: 日本語として自然な表現
- [ ] **英語正確性**: ネイティブレベルの正確な英語

### セット設計の原則

- [ ] **5 問構成**: 各セット必ず 5 問
- [ ] **テーマ統一**: セット内の問題が一貫したテーマ
- [ ] **難易度統一**: セット内で難易度が統一
- [ ] **学習効果**: 段階的な理解促進
- [ ] **バリエーション**: 飽きない多様性

## 🔧 技術実装ガイド

### 新カテゴリー拡張の標準手順

#### Step 1: 問題データ作成

```typescript
// src/data/foundationQuestions.ts
"category-name": {
  easy: [
    // 既存5問（ID: X001-X005）
    // 追加25問（ID: X006-X030）
  ],
  normal: [
    // 既存5問（ID: X101-X105）
    // 追加25問（ID: X106-X130）
  ],
  hard: [
    // 既存5問（ID: X201-X205）
    // 追加25問（ID: X206-X230）
  ]
}
```

#### Step 2: セット範囲定義

```typescript
// getFoundationQuestionsBySet関数に追加
if (category === "category-name") {
  const setRanges: Record<string, [number, number]> = {
    basic: [X001, X005],
    set1: [X006, X010],
    set2: [X011, X015],
    set3: [X016, X020],
    set4: [X021, X025],
    advanced: [X026, X030],
  };
}
```

#### Step 3: セット情報定義

```typescript
// getAvailableFoundationSets関数に追加
if (category === "category-name") {
  return [
    { id: "basic", name: "基本編", description: "基本的な理解", icon: "📝" },
    { id: "set1", name: "応用編", description: "応用問題", icon: "🎯" },
    // ... 6セット
  ];
}
```

#### Step 4: テスト手順

```bash
# 1. セット選択画面テスト
http://localhost:3000/learning/foundation/sets/category-name/easy

# 2. 各セットの動作確認
http://localhost:3000/learning/foundation/quiz/category-name/easy/basic

# 3. 問題数確認
grep -c "id: X[0-9]" src/data/foundationQuestions.ts
```

## 📈 成功指標（KPI）

### 拡張完了時の目標値

- **総問題数**: 240 問（8 カテゴリー ×30 問）
- **学習セット数**: 48 セット（8 カテゴリー ×6 セット）
- **学習時間**: 3-5 分/セット
- **バンドルサイズ**: 1MB 以下維持

### 品質指標

- **問題品質**: 各問題に ENTP が納得する解説
- **難易度適正**: easy/normal/hard の適切な分類
- **学習効果**: セット完了率 80%以上
- **継続率**: 7 日後継続率 60%以上

## 🎯 緊急時対応

### 問題発見時の対応手順

1. **問題の特定**: どのセット・問題で発生？
2. **影響範囲確認**: 他のセットへの影響は？
3. **一時的回避**: 該当セットの無効化
4. **根本修正**: 問題データの修正
5. **再テスト**: 修正後の動作確認

### よくある問題と解決法

- **ID 重複**: grep "id: XXXX" で検索・修正
- **選択肢エラー**: choices 配列の確認
- **セット取得失敗**: setRanges 定義の確認
- **ナビゲーションエラー**: ルーティング設定の確認

## 📝 次のチャットでの指示例

### 語順問題拡張の場合

```
ドキュメントを見て語順問題を拡張してください
```

### 代名詞問題拡張の場合

```
ドキュメントを見て代名詞問題を拡張してください
```

### 全カテゴリー一括拡張の場合

```
ドキュメントを見て残り7カテゴリーを拡張してください
```

## 🔄 継続的改善プロセス

### 定期レビュー項目

1. **学習データ分析**: どのセットが人気？
2. **難易度調整**: easy/normal/hard のバランス
3. **新問題追加**: ユーザーフィードバック反映
4. **技術的最適化**: バンドルサイズ・パフォーマンス

### A/B テスト候補

- **セット数**: 6 セット vs 8 セット
- **問題数**: 5 問 vs 7 問/セット
- **解説スタイル**: 簡潔 vs 詳細
- **報酬システム**: XP vs バッジ

## 🚀 Phase A 実装の具体的手順

### 語順問題拡張（例）

#### 1. 問題パターン設計

```typescript
const wordOrderPatterns = {
  basic: "基本語順（SVO）",
  questions: "疑問文の語順",
  modifiers: "修飾語の位置",
  tenses: "時制と語順",
  complex: "複文の語順",
  advanced: "高度な語順",
};
```

#### 2. 具体的問題例

```typescript
{
  id: 2006,
  japanese: "彼は昨日本を読みました。",
  correctAnswer: "He read a book yesterday.",
  explanation: "英語は「主語 + 動詞 + 目的語 + 時間」の順序です。",
  choices: [
    "He read a book yesterday.", // 正解
    "Yesterday he read a book.", // 時間が前
    "He a book read yesterday.", // 語順間違い
    "Read he a book yesterday.", // 動詞が前
  ]
}
```

#### 3. セット範囲定義

```typescript
"word-order": {
  "basic": [2001, 2005],     // 基本語順
  "questions": [2006, 2010], // 疑問文
  "modifiers": [2011, 2015], // 修飾語
  "tenses": [2016, 2020],    // 時制
  "complex": [2021, 2025],   // 複文
  "advanced": [2026, 2030],  // 高度
}
```

### 代名詞問題拡張（例）

#### 1. 問題パターン設計

```typescript
const pronounPatterns = {
  personal: "人称代名詞（I/you/he/she）",
  possessive: "所有代名詞（my/your/his/her）",
  objective: "目的格（me/you/him/her）",
  possessive_pronouns: "所有代名詞（mine/yours/his/hers）",
  demonstrative: "指示代名詞（this/that/these/those）",
  interrogative: "疑問代名詞（who/what/which/whose）",
};
```

#### 2. 具体的問題例

```typescript
{
  id: 3006,
  japanese: "これは（　）の本です。（私）",
  correctAnswer: "This is my book.",
  explanation: "「私の」は所有代名詞の \"my\" を使います。",
  choices: [
    "This is my book.",    // 正解
    "This is I book.",     // 人称代名詞
    "This is me book.",    // 目的格
    "This is mine book.",  // 所有代名詞
  ]
}
```

## 📊 実装優先度マトリックス

| カテゴリー         | 学習重要度 | 実装難易度 | 優先度 |
| ------------------ | ---------- | ---------- | ------ |
| **語順の基本**     | 🔴 高      | 🟢 低      | ⭐⭐⭐ |
| **代名詞**         | 🔴 高      | 🟢 低      | ⭐⭐⭐ |
| **冠詞**           | 🟡 中      | 🟡 中      | ⭐⭐   |
| **前置詞**         | 🟡 中      | 🟡 中      | ⭐⭐   |
| **複数形**         | 🟢 低      | 🟢 低      | ⭐     |
| **疑問文・否定文** | 🟡 中      | 🟢 低      | ⭐⭐   |
| **接続詞**         | 🟢 低      | 🟢 低      | ⭐     |

### 推奨実装順序

1. **語順の基本** - 最重要・最優先
2. **代名詞** - 基礎として重要
3. **前置詞** - 実用性が高い
4. **冠詞** - 日本人が苦手
5. **疑問文・否定文** - 会話で重要
6. **接続詞** - 文章構成で重要
7. **複数形** - 比較的簡単

## 🎯 完成時のシステム仕様

### 最終目標（Phase A 完了時）

```
基礎カテゴリー: 8カテゴリー × 30問 = 240問
セット数: 8カテゴリー × 6セット = 48セット
学習時間: 3-5分/セット × 48セット = 144-240分
達成感: 48回の完了報酬
```

### システム評価目標

- **99 点 → 100 点**: 完璧な基礎学習システム
- **学習継続率**: 70%以上
- **問題完了率**: 85%以上
- **ユーザー満足度**: 4.8/5 以上

## 📋 実装チェックリスト

### 各カテゴリー拡張時

- [ ] 問題データ 25 問追加
- [ ] セット範囲定義追加
- [ ] セット情報設定
- [ ] ID 重複チェック
- [ ] 動作テスト実行
- [ ] 品質確認完了

### 全体完了時

- [ ] 8 カテゴリー ×30 問=240 問確認
- [ ] 48 セットの動作確認
- [ ] バンドルサイズ 1MB 以下維持
- [ ] パフォーマンステスト通過
- [ ] E2E テスト全通過

## 🎮 ENTP ユーザー体験の最終形

### 理想的な学習フロー

```
スキルツリー確認 → カテゴリー選択 → 難易度選択 → セット選択 → 5問クイズ
     ↓
セット完了報酬 → 次セット選択 or 他カテゴリー → 継続学習
     ↓
習熟度80%達成 → 新スキル解放 → より高度な学習へ
```

### 達成される学習特性対応

- ✅ **短時間集中**: 5 問/セット（3-5 分）
- ✅ **頻繁な達成感**: 48 回の完了機会
- ✅ **豊富な選択肢**: 48 種類のセット
- ✅ **段階的成長**: 基礎 → 応用 → 高度
- ✅ **視覚的進捗**: スキルツリー・進捗バー
- ✅ **論理的学習**: 体系的な知識構築

---

**このドキュメントに基づいて「ドキュメントを見て XX を実装してください」の指示で、効率的に次期開発を進められます。**

_最終更新: 2025 年 9 月 20 日_
_システム評価: 99 点/100 点_
_次期目標: 100 点完成システム_
