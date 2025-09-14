# 推奨コマンド集

## 開発コマンド
```bash
# 開発サーバーの起動
npm run dev

# 本番ビルド
npm run build

# アイコン生成（ビルド前）
npm run generate-icons
```

## テストコマンド
```bash
# ユニットテスト実行
npm run test

# テストUI起動
npm run test:ui

# カバレッジ付きテスト
npm run test:coverage

# E2Eテスト実行（MCP Playwright Server）
npm run test:e2e:mcp

# 全ブラウザでE2Eテスト
npm run test:e2e:mcp:all

# 全テスト実行
npm run test:all
```

## システムコマンド（macOS）
```bash
# ファイル検索
find . -name "*.tsx" -type f

# パターン検索
grep -r "pattern" src/

# ディレクトリ一覧
ls -la

# 現在のディレクトリ
pwd

# ディレクトリ移動
cd /path/to/directory

# Git操作
git status
git add .
git commit -m "message"
git push

# プロセス確認
ps aux | grep node

# ポート確認
lsof -i :3000
```

## デバッグコマンド
```bash
# 開発サーバー起動（デバッグモード）
npm run dev -- --debug

# ビルド分析
npm run build -- --analyze

# 依存関係確認
npm list

# 依存関係更新
npm update
```

## 品質管理コマンド
```bash
# 型チェック
npx tsc --noEmit

# リンター実行（ESLint）
npx eslint src/

# フォーマッター実行（Prettier）
npx prettier --write src/

# バンドルサイズ分析
npx vite-bundle-analyzer
```

## PWA関連コマンド
```bash
# PWAビルド
npm run build

# Service Worker確認
# ブラウザのDevTools > Application > Service Workers

# マニフェスト確認
# ブラウザのDevTools > Application > Manifest
```

## 緊急時コマンド
```bash
# プロセス強制終了
pkill -f "vite"

# ポート解放
lsof -ti:3000 | xargs kill -9

# キャッシュクリア
rm -rf node_modules/.vite
rm -rf build/
rm -rf dist/

# 依存関係再インストール
rm -rf node_modules package-lock.json
npm install
```