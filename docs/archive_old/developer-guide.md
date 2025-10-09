# ENTP 英語学習アプリ - 開発者ガイド

## 🏗️ アーキテクチャ概要

### 技術スタック

- **フロントエンド**: React 18 + TypeScript + Vite
- **スタイリング**: Tailwind CSS v4 + shadcn/ui + Radix UI
- **状態管理**: React Hooks + カスタムフック
- **データ永続化**: IndexedDB + LocalStorage
- **PWA**: Vite PWA Plugin + Workbox
- **テスト**: Playwright MCP + Serena MCP

### プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── ui/             # 再利用可能なUIコンポーネント
│   ├── starSystem/     # 事前学習システム
│   └── ...             # 機能別コンポーネント
├── data/               # データファイル
├── types/              # TypeScript型定義
├── utils/              # ユーティリティ関数
├── hooks/              # カスタムフック
└── routes/             # ルーティング設定
```

## 🚀 開発環境セットアップ

### 前提条件

- Node.js 18 以上
- npm または yarn
- Git

### セットアップ手順

```bash
# リポジトリのクローン
git clone <repository-url>
cd entp-english

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# テスト実行
npm run test

# 本番ビルド
npm run build
```

## 📁 主要コンポーネント

### 🏠 ホーム画面 (`NewHome.tsx`)

```typescript
// メインのホーム画面コンポーネント
export const NewHome: React.FC = () => {
  // 状態管理
  const [showDailyChallenges, setShowDailyChallenges] = useState(false);

  // 学習開始ハンドラー
  const handleStartLearning = (type: string) => {
    // 学習タイプに応じたナビゲーション
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ヘッダー、学習オプション、フッター */}
    </div>
  );
};
```

### 🎯 TOEIC 模擬テスト (`TOEICMockTestContainer.tsx`)

```typescript
// TOEIC模擬テストのコンテナコンポーネント
export const TOEICMockTestContainer: React.FC = () => {
  const [phase, setPhase] = useState<TestPhase>("config");
  const [testConfig, setTestConfig] = useState<TOEICTestConfig | null>(null);

  // テスト開始
  const handleStartTest = (config: TOEICTestConfig) => {
    setTestConfig(config);
    setPhase("test");
  };

  return <div className="container mx-auto p-4">{renderCurrentPhase()}</div>;
};
```

### 🎮 学習パスチャレンジ (`LearningPathChallengeDashboard.tsx`)

```typescript
// 学習パスチャレンジのダッシュボード
export const LearningPathChallengeDashboard: React.FC = () => {
  const [challenges, setChallenges] = useState<LearningPathChallenge[]>([]);
  const [userProgress, setUserProgress] = useState<ChallengeProgress[]>([]);

  // チャレンジ開始
  const handleStartChallenge = (challengeId: string) => {
    // チャレンジ開始ロジック
  };

  return (
    <div className="container mx-auto p-4">
      {/* チャレンジ一覧と進捗表示 */}
    </div>
  );
};
```

## 🔧 ユーティリティ関数

### 📊 データ管理 (`useDataManager.ts`)

```typescript
// 中央集権的なデータ管理フック
export const useDataManager = () => {
  // リスニング進捗
  const saveListeningProgress = async (progress: ListeningProgress) => {
    // IndexedDBに保存
  };

  // 語彙学習進捗
  const saveVocabularyProgress = async (progress: VocabularyProgress) => {
    // IndexedDBに保存
  };

  return {
    saveListeningProgress,
    saveVocabularyProgress,
    // その他のデータ管理関数
  };
};
```

### 🎯 レベルシステム (`useLevelSystem.ts`)

```typescript
// XP・レベル管理フック
export const useLevelSystem = () => {
  const [level, setLevel] = useState<number>(1);
  const [xp, setXp] = useState<number>(0);

  // XP追加
  const addXP = (amount: number) => {
    const newXp = xp + amount;
    setXp(newXp);

    // レベルアップチェック
    const newLevel = calculateLevel(newXp);
    if (newLevel > level) {
      setLevel(newLevel);
      // レベルアップ通知
    }
  };

  return { level, xp, addXP };
};
```

### ❤️ ハートシステム (`useHeartSystem.ts`)

```typescript
// スタミナ管理フック
export const useHeartSystem = () => {
  const [hearts, setHearts] = useState<number>(3);
  const [maxHearts, setMaxHearts] = useState<number>(3);

  // ハート消費
  const consumeHeart = () => {
    if (hearts > 0) {
      setHearts(hearts - 1);
      return true;
    }
    return false;
  };

  // ハート回復
  const restoreHeart = () => {
    if (hearts < maxHearts) {
      setHearts(hearts + 1);
    }
  };

  return { hearts, maxHearts, consumeHeart, restoreHeart };
};
```

## 🗄️ データ管理

### IndexedDB 構造

```typescript
// データベース構造
const DB_CONFIG = {
  name: "ENTPEnglishApp",
  version: 2,
  stores: {
    LISTENING_PROGRESS: "listeningProgress",
    LISTENING_ACHIEVEMENTS: "listeningAchievements",
    FEEDBACK: "feedback",
    USER_GACHA_DATA: "userGachaData",
    TOEIC_CURRENT_SESSION: "toeic_current_session",
    TOEIC_TEST_RESULTS: "toeic_test_results",
    TOEIC_PROGRESS: "toeic_progress",
  },
};
```

### データ永続化パターン

```typescript
// データ保存の基本パターン
export const saveData = async <T>(
  storeName: string,
  data: T
): Promise<void> => {
  const db = await openDB(DB_CONFIG.name, DB_CONFIG.version);
  const tx = db.transaction(storeName, "readwrite");
  await tx.store.add(data);
  await tx.done;
};

// データ取得の基本パターン
export const getData = async <T>(
  storeName: string,
  key: string
): Promise<T | null> => {
  const db = await openDB(DB_CONFIG.name, DB_CONFIG.version);
  return await db.get(storeName, key);
};
```

## 🎨 スタイリングガイド

### Tailwind CSS + shadcn/ui

```typescript
// コンポーネントのスタイリング例
export const ExampleComponent: React.FC = () => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-800">
          タイトル
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="default"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleClick}
        >
          ボタン
        </Button>
      </CardContent>
    </Card>
  );
};
```

### レスポンシブデザイン

```typescript
// レスポンシブ対応の例
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card className="p-4 sm:p-6">
    <h3 className="text-lg sm:text-xl font-semibold">レスポンシブタイトル</h3>
  </Card>
</div>
```

## 🧪 テスト戦略

### E2E テスト (Playwright MCP)

```typescript
// ページアクセステストの例
const testPageAccess = async (url: string, pageName: string) => {
  await browser.navigate(url);
  await browser.waitFor({ time: 3 });

  // エラーチェック
  const errors = await checkConsoleErrors();
  expect(errors).toHaveLength(0);

  // 基本UI要素の確認
  const title = await browser.getElement("ページタイトル");
  expect(title).toBeVisible();
};
```

### コードベース分析 (Serena MCP)

```typescript
// シンボル検索の例
const findComponent = async (componentName: string) => {
  const symbols = await serena.findSymbol(componentName);
  return symbols;
};

// パターン検索の例
const searchPattern = async (pattern: string) => {
  const results = await serena.searchForPattern(pattern);
  return results;
};
```

## 🚀 デプロイメント

### 本番ビルド

```bash
# 本番ビルドの実行
npm run build

# ビルド結果の確認
ls -la dist/

# ローカルでの本番確認
npx serve dist -l 3001
```

### Netlify 設定

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

## 🔧 開発ベストプラクティス

### コンポーネント設計

1. **単一責任の原則**: 各コンポーネントは明確な役割を持つ
2. **再利用性**: 共通コンポーネントは`ui/`ディレクトリに配置
3. **型安全性**: TypeScript の型定義を適切に使用
4. **アクセシビリティ**: WCAG 2.1 AA 準拠の実装

### 状態管理

1. **ローカル状態**: `useState`でコンポーネント内の状態管理
2. **グローバル状態**: カスタムフックで共有状態管理
3. **永続化**: 重要なデータは IndexedDB に保存

### パフォーマンス

1. **コード分割**: 動的インポートでバンドルサイズ最適化
2. **メモ化**: `useMemo`、`useCallback`で不要な再レンダリング防止
3. **遅延読み込み**: 必要時のみコンポーネントを読み込み

## 🐛 デバッグとトラブルシューティング

### よくある問題と解決策

**問題**: コンポーネントが表示されない
**解決策**:

1. ルーティング設定を確認
2. コンポーネントの export/import を確認
3. コンソールエラーをチェック

**問題**: データが保存されない
**解決策**:

1. IndexedDB の設定を確認
2. データ形式を確認
3. ブラウザのストレージ容量を確認

**問題**: スタイルが適用されない
**解決策**:

1. Tailwind CSS の設定を確認
2. クラス名のスペルを確認
3. CSS の優先度を確認

### デバッグツール

- **React DevTools**: コンポーネントの状態確認
- **Chrome DevTools**: パフォーマンス分析
- **Playwright MCP**: E2E テストとデバッグ
- **Serena MCP**: コードベース分析

## 📚 参考資料

### 公式ドキュメント

- [React 18 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

### プロジェクト固有

- [プロジェクト概要](./overview.md)
- [技術仕様](./tech-specs.md)
- [開発フロー](./development-workflow.md)

## 🤝 コントリビューション

### 開発フロー

1. **Issue 作成**: バグ報告や機能要望
2. **ブランチ作成**: `feature/機能名`または`fix/バグ名`
3. **開発**: コーディングとテスト
4. **プルリクエスト**: コードレビューとマージ

### コーディング規約

- **ESLint**: コード品質の自動チェック
- **Prettier**: コードフォーマットの統一
- **TypeScript**: 型安全性の確保
- **テスト**: 新機能には必ずテストを追加

---

**開発を楽しんでください！** 🚀
