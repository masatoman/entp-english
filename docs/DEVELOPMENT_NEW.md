# 開発ガイド

## 🚀 開発環境

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# テスト
npm run test:core
```

## 📋 実装時の基本ルール

### 1. Router 対応コンポーネント

```typescript
// ✅ 正しい（Router対応）
export default function Component() {
  const { id } = useParams();
  const navigate = useNavigate();
  // ...
}

// ❌ 間違い（props形式）
export default function Component({ id }: Props) {
  // ...
}
```

### 2. デザインシステム

- **shadcn/ui**を優先的に使用
- カスタムコンポーネントが必要な場合は Radix UI をベースに
- Tailwind v4 のユーティリティクラスで実装

### 3. 型安全性

- `any`型の使用禁止
- すべてのコンポーネントに Props の型定義
- データ構造はすべて`types/`で定義

## 🧪 テスト戦略

### 優先順位

1. **E2E テスト（Playwright MCP）** - 最優先
2. **主要機能の単体テスト** - 重要
3. **統合テスト** - 必要に応じて

### 実行コマンド

```bash
# コアテスト（推奨）
npm run test:core

# E2Eテスト
npm run test:e2e:mcp

# 全テスト
npm run test
```

## 📦 データ構造

### 問題データ

```typescript
// src/data/questions.ts
export interface QuestionData {
  id: number;
  japanese: string;
  correctAnswer: string;
  explanation: string;
  choices?: string[]; // easy モードのみ
}
```

### 語彙データ

```typescript
// src/data/vocabulary.ts
export interface VocabularyWord {
  id: number;
  word: string;
  meaning: string;
  partOfSpeech: string;
  example: string;
  exampleTranslation: string;
  level: "beginner" | "intermediate" | "advanced";
  category: "all" | "toeic" | "business" | "daily" | "academic";
}
```

### ユーザーデータ

```typescript
// localStorage: "userData"
interface UserData {
  xp: number;
  level: number;
  streak: number;
  studyHistory: StudySession[];
  unlockedFeatures: string[]; // 追加予定
  currentGoal?: Goal; // 追加予定
}
```

## 🎨 デザイン原則

### コア機能の絞り込み（実装予定）

初期画面で表示する機能を**5 つ**に制限：

1. 語彙学習（ガチャ連携）
2. 文法クイズ（基礎のみ）
3. 日替わりクエスト
4. 学習進捗ダッシュボード
5. 週次チェックポイント

その他の機能は「もっと見る」または段階的にアンロック。

### 用語の注意点

**使用禁止ワード：**

- 「復習」→「ラッキー問題」「成長加速チャレンジ」
- 「暗記」→「覚える」「身につける」
- 「テスト」→「チャレンジ」「クイズ」
- 「間違い」→「成長のチャンス」

## 🔧 よくあるエラーと対処法

### ビルドエラー

```bash
# キャッシュクリア
npm run clean:all

# 依存関係再インストール
rm -rf node_modules package-lock.json
npm install
```

### TypeScript エラー

```bash
# 型チェック
npm run type-check
```

### テスト失敗

```bash
# テスト環境リセット
npm run clean
npm run test
```

## 📊 パフォーマンス指標

- **初回読み込み**: 3 秒以内
- **ページ遷移**: 1 秒以内
- **バンドルサイズ**: 1MB 以下
- **メモリ使用**: 20MB 以下

## 🚨 緊急時の対応

### Git Push エラー

1. エラー内容を確認
2. 重大度を判定（重大/警告/軽微）
3. 段階的に修正
4. `--no-verify`は**使用禁止**

### 真っ白ページ

1. Playwright MCP で該当ページをテスト
2. コンソールエラーを確認
3. Router 対応を確認
4. default export を確認

## 📚 参考資料

- [React 公式](https://react.dev/)
- [TypeScript 公式](https://www.typescriptlang.org/)
- [Tailwind CSS 公式](https://tailwindcss.com/)
- [shadcn/ui 公式](https://ui.shadcn.com/)
- [Vite 公式](https://vitejs.dev/)
