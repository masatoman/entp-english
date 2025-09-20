# 包括的スキルツリー設計：英語学習の全領域

## 📚 現在の課題

### 現在実装済みのカテゴリー（9 分野）

- 基本文型、時制、助動詞、受動態、関係詞、仮定法、比較、分詞・動名詞、不定詞

### 不足している重要カテゴリー

1. **品詞** - 名詞、動詞、形容詞、副詞の理解
2. **語順** - 語順ルール、修飾関係
3. **疑問文・否定文** - 基本的な文変換
4. **前置詞** - in, on, at などの使い分け
5. **冠詞** - a, an, the の使い方
6. **複数形・単数形** - 可算・不可算名詞
7. **代名詞** - he, she, it, they の使い分け
8. **接続詞** - and, but, because の文接続
9. **語彙力** - 基本語彙から上級語彙まで
10. **発音・音韻** - 発音ルール、アクセント

## 🎯 包括的スキルツリー設計

### Level 0: 超基礎（Foundation）

```
品詞の理解 → 語順の基本 → 代名詞
    ↓
  冠詞 → 複数形 → 疑問文・否定文
```

### Level 1: 基本文型（Current Implementation）

```
SV → SVO → SVC
```

### Level 2: 基本要素

```
前置詞 → 接続詞 → 基本語彙（500語）
```

### Level 3: 時制・助動詞（Current Implementation）

```
現在時制 → 過去時制 → 未来時制 → 基本助動詞
```

### Level 4: 高度文型（Current Implementation）

```
SVOO → SVOC → 応用文型
```

### Level 5: 専門文法（Current Implementation）

```
受動態 → 関係詞 → 高度助動詞
```

### Level 6: 表現技法（Current Implementation）

```
比較 → 仮定法
```

### Level 7: 複雑な文法（Current Implementation）

```
分詞・動名詞 → 不定詞
```

### Level 8: 応用・実践

```
語彙力（2000語） → 発音・音韻 → 慣用表現
```

### Level 9: マスタリー

```
ビジネス英語 → 学術英語 → 文学的表現
```

## 🔧 拡張実装プラン

### Phase 1: 超基礎カテゴリー追加（Level 0）

#### 品詞カテゴリー

```typescript
"parts-of-speech": {
  subcategories: ["nouns", "verbs", "adjectives", "adverbs"],
  problems: 20問/subcategory,
  difficulty: "beginner"
}
```

#### 語順カテゴリー

```typescript
"word-order": {
  subcategories: ["basic-order", "adjective-order", "adverb-position"],
  problems: 15問/subcategory,
  difficulty: "beginner"
}
```

#### 代名詞カテゴリー

```typescript
"pronouns": {
  subcategories: ["personal", "possessive", "demonstrative", "relative"],
  problems: 15問/subcategory,
  difficulty: "beginner"
}
```

### Phase 2: 基本要素カテゴリー追加（Level 2）

#### 前置詞カテゴリー

```typescript
"prepositions": {
  subcategories: ["time", "place", "direction", "manner"],
  problems: 20問/subcategory,
  difficulty: "intermediate"
}
```

#### 冠詞カテゴリー

```typescript
"articles": {
  subcategories: ["definite", "indefinite", "zero-article"],
  problems: 15問/subcategory,
  difficulty: "beginner"
}
```

#### 複数形カテゴリー

```typescript
"plurals": {
  subcategories: ["regular", "irregular", "countable-uncountable"],
  problems: 15問/subcategory,
  difficulty: "beginner"
}
```

### Phase 3: 高度カテゴリー追加（Level 8-9）

#### 語彙力カテゴリー

```typescript
"vocabulary-mastery": {
  subcategories: ["basic-500", "intermediate-1000", "advanced-2000", "expert-5000"],
  problems: 50問/subcategory,
  difficulty: "varies"
}
```

#### 発音・音韻カテゴリー

```typescript
"pronunciation": {
  subcategories: ["vowels", "consonants", "stress", "intonation"],
  problems: 20問/subcategory,
  difficulty: "intermediate"
}
```

#### 慣用表現カテゴリー

```typescript
"idioms": {
  subcategories: ["common-idioms", "business-idioms", "academic-expressions"],
  problems: 25問/subcategory,
  difficulty: "advanced"
}
```

## 📊 拡張後の全体構造

### 総カテゴリー数: 19 分野

1. **品詞** (parts-of-speech)
2. **語順** (word-order)
3. **代名詞** (pronouns)
4. **冠詞** (articles)
5. **複数形** (plurals)
6. **疑問文・否定文** (questions-negations)
7. **基本文型** (basic-grammar) ✅
8. **前置詞** (prepositions)
9. **接続詞** (conjunctions)
10. **時制** (tenses) ✅
11. **助動詞** (modals) ✅
12. **受動態** (passive) ✅
13. **関係詞** (relative) ✅
14. **仮定法** (subjunctive) ✅
15. **比較** (comparison) ✅
16. **分詞・動名詞** (participle) ✅
17. **不定詞** (infinitive) ✅
18. **語彙力** (vocabulary-mastery)
19. **発音・音韻** (pronunciation)

### 総問題数予想

- **基礎カテゴリー**: 平均 15 問 × 10 分野 = 150 問
- **中級カテゴリー**: 平均 20 問 × 6 分野 = 120 問
- **上級カテゴリー**: 平均 25 問 × 3 分野 = 75 問
- **合計**: 約 345 問のユニーク問題

## 🎮 ENTP に最適化された学習パス

### 推奨学習順序

1. **品詞理解** → 英語の基本要素
2. **語順・代名詞** → 文の基本構造
3. **冠詞・複数形** → 名詞の扱い
4. **基本文型** → 文の骨格
5. **時制** → 時間軸の表現
6. **前置詞・接続詞** → 関係性の表現
7. **助動詞** → 意味の拡張
8. **高度文法** → 専門的表現
9. **語彙力・発音** → 実用性の向上

## 🚀 実装優先度

### 最優先（Phase 1）

- **品詞** - 全ての文法の基礎
- **語順** - 英語の基本ルール
- **前置詞** - 日本人が最も苦手とする分野

### 高優先（Phase 2）

- **冠詞** - 基本的だが重要
- **疑問文・否定文** - 実用性が高い
- **代名詞** - 文の流れに必要

### 中優先（Phase 3）

- **接続詞** - 文の接続
- **複数形** - 名詞の理解
- **語彙力** - 総合力向上

### 低優先（Phase 4）

- **発音・音韻** - 特殊分野
- **慣用表現** - 上級者向け

この拡張により、英語学習の全領域をカバーし、ENTP の学習者が体系的に英語をマスターできるシステムが完成します！

どのカテゴリーから追加実装を始めたいですか？
