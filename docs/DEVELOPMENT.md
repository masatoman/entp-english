# 開発ガイド（超シンプル版）

## 🚀 開発環境

```bash
npm install
npm run dev
```

## 📋 実装の基本ルール

### 1. シンプル第一

- 迷ったら削る
- 機能追加は後から
- 3ヶ月継続が最優先

### 2. Router対応

```typescript
// ✅ 正しい
export default function Component() {
  const { id } = useParams();
  return <div>...</div>;
}
```

### 3. デザインシステム

- shadcn/ui優先
- Tailwind v4のユーティリティクラス
- レスポンシブ必須

## 🎨 コンポーネント構成（超シンプル版）

### ホーム画面

```typescript
interface SimpleHome {
  header: {
    streak: "🔥 15日連続";
    toeicPrediction: "420点 (↗️ +100)";
  };

  todayMission: {
    morning: { task: "朝の3分"; status: "完了" };
    lunch: { task: "昼の1問"; status: "未完了" };
    evening: { task: "夜の復習"; status: "未完了" };
  };

  quickActions: ["🎰 ガチャ", "📈 成長"];
}
```

### クイズ画面

```typescript
interface SimpleQuiz {
  types: ["おまかせ3分（推奨）", "文法だけ", "単語だけ"];
  // カテゴリー選択なし
  // 難易度選択なし
  // 自動で最適な問題
}
```

### ガチャ画面

```typescript
interface SimpleGacha {
  action: "1回引く";
  result: { word; meaning; example };
  collection: "152/500 単語";
}
```

### 成長画面

```typescript
interface SimpleGrowth {
  mainMetric: "予測TOEICスコア";
  weeklyComparison: "先週との比較";
  milestones: ["15日連続", "100問", "50単語"];
}
```

## 📦 データ構造（最小限）

```typescript
interface UserData {
  basic: {
    xp: number;
    level: number;
    streak: number;
    lastStudyDate: string;
  };
  study: {
    totalQuestions: number;
    correctAnswers: number;
    studyMinutes: number;
    knownWords: string[];
  };
  progress: {
    weeklyHistory: DailyStats[]; // 直近7日
    toeicPrediction: number;
  };
  gacha: {
    tickets: number;
    collection: string[];
  };
}
```

## 🚨 用語ルール

### 使用禁止ワード

- ❌ 復習 → ✅ チャレンジ
- ❌ 暗記 → ✅ 身につける
- ❌ テスト → ✅ クイズ
- ❌ 間違い → ✅ 成長のチャンス

## 🧪 テスト

```bash
# コアテスト
npm run test:core

# E2E
npm run test:e2e:mcp
```

## 🔧 よくあるエラー

```bash
# ビルドエラー
npm run clean:all && npm install

# 型エラー
npm run type-check
```

## 📊 パフォーマンス目標

- **初回読み込み**: 3秒以内
- **バンドルサイズ**: 500KB以下（大幅削減）
- **メモリ使用**: 10MB以下（半減）
