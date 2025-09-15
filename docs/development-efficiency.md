# 🚀 開発効率化ガイド

## 📋 目次

- [開発環境の最適化](#開発環境の最適化)
- [便利なスクリプト](#便利なスクリプト)
- [VS Code 設定](#vs-code設定)
- [デバッグテクニック](#デバッグテクニック)
- [パフォーマンス最適化](#パフォーマンス最適化)
- [品質管理](#品質管理)

## 🛠️ 開発環境の最適化

### ホットリロード最適化

```bash
# 開発サーバー起動（最適化済み）
npm run dev

# ネットワークアクセス可能な開発サーバー
npm run dev:host

# デバッグモードで開発サーバー起動
npm run dev:debug
```

### キャッシュクリア

```bash
# ビルドキャッシュをクリア
npm run clean

# すべてのキャッシュをクリア
npm run clean:all

# 完全リセット（依存関係再インストール）
npm run dev:reset
```

## 🔧 便利なスクリプト

### プロジェクト統計

```bash
# プロジェクトの統計情報を表示
node scripts/dev-utils.js stats
```

### 未使用インポートチェック

```bash
# 未使用のインポートをチェック
node scripts/dev-utils.js unused
```

### パフォーマンスヒント

```bash
# パフォーマンス最適化のヒントを表示
node scripts/dev-utils.js tips
```

### 全チェック実行

```bash
# すべてのチェックを実行
node scripts/dev-utils.js all
```

## ⚙️ VS Code 設定

### 推奨拡張機能

以下の拡張機能をインストールすることで、開発効率が大幅に向上します：

- **Prettier** - コードフォーマット
- **Tailwind CSS IntelliSense** - Tailwind CSS 補完
- **TypeScript Importer** - 自動インポート
- **Vitest** - テスト実行
- **GitLens** - Git 機能強化
- **Auto Rename Tag** - HTML タグ自動リネーム

### キーボードショートカット

- `Cmd+Shift+P` - コマンドパレット
- `Cmd+P` - ファイル検索
- `Cmd+Shift+F` - 全体検索
- `Cmd+Shift+O` - シンボル検索
- `F12` - 定義へ移動
- `Shift+F12` - 参照を検索

## 🐛 デバッグテクニック

### React Developer Tools

```bash
# Chrome拡張機能をインストール
# https://chrome.google.com/webstore/detail/react-developer-tools/
```

### コンソールデバッグ

```typescript
// コンポーネントの状態をデバッグ
console.log("Component state:", state);

// パフォーマンス測定
console.time("Component render");
// ... コンポーネント処理
console.timeEnd("Component render");
```

### エラー境界の活用

```typescript
// エラー境界でエラーをキャッチ
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }
}
```

## ⚡ パフォーマンス最適化

### React 最適化

```typescript
// メモ化で再レンダリングを防ぐ
const MemoizedComponent = React.memo(Component);

// コールバックのメモ化
const handleClick = useCallback(() => {
  // 処理
}, [dependency]);

// 値のメモ化
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

### バンドル最適化

```bash
# バンドルサイズを分析
npm run build:analyze
```

### 画像最適化

```typescript
// 遅延読み込み
const LazyImage = lazy(() => import("./Image"));

// WebP形式の使用
<img src="image.webp" alt="description" />;
```

## 🧪 品質管理

### テスト実行

```bash
# ユニットテスト（監視モード）
npm run test:watch

# テストカバレッジ
npm run test:coverage

# E2Eテスト
npm run test:e2e:mcp

# すべてのテスト
npm run test:all
```

### コード品質チェック

```bash
# 型チェック
npm run type-check

# リンター実行
npm run lint

# リンター自動修正
npm run lint:fix

# 全チェック実行
npm run check
```

### Git フック

- **pre-commit**: ビルドテストでエラー検出
- **pre-push**: ビルドテスト + ユニットテストでエラー検出

## 📊 開発メトリクス

### 重要な指標

- **ビルド時間**: 2 秒以内を目標
- **ホットリロード時間**: 1 秒以内を目標
- **テスト実行時間**: 5 秒以内を目標
- **バンドルサイズ**: 500KB 以下を目標

### 監視すべきポイント

- コンポーネントの再レンダリング頻度
- メモリ使用量
- ネットワークリクエスト数
- バンドルサイズの増加

## 🔄 開発ワークフロー

### 1. 機能開発

```bash
# 1. ブランチ作成
git checkout -b feature/new-feature

# 2. 開発サーバー起動
npm run dev

# 3. テスト実行（監視モード）
npm run test:watch
```

### 2. コミット前

```bash
# 品質チェック
npm run check

# ビルドテスト
npm run build
```

### 3. プッシュ前

```bash
# 全テスト実行
npm run test:all
```

## 🚨 トラブルシューティング

### よくある問題と解決方法

#### ビルドエラー

```bash
# キャッシュクリア
npm run clean:all

# 依存関係再インストール
rm -rf node_modules package-lock.json
npm install
```

#### ホットリロードが効かない

```bash
# 開発サーバー再起動
npm run dev:reset
```

#### テストが失敗する

```bash
# テスト環境リセット
npm run clean
npm run test
```

## 📚 参考資料

- [Vite 公式ドキュメント](https://vitejs.dev/)
- [React 公式ドキュメント](https://react.dev/)
- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/)
- [Tailwind CSS 公式ドキュメント](https://tailwindcss.com/)
- [Vitest 公式ドキュメント](https://vitest.dev/)
- [Playwright 公式ドキュメント](https://playwright.dev/)

---

**💡 ヒント**: このガイドを定期的に確認し、新しい効率化テクニックを取り入れることで、開発速度を継続的に向上させることができます。
