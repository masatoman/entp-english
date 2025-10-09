# ローカルテストガイド

Netlify で初めてエラーに気づくことを防ぐため、ローカルで本番環境と同じ条件を再現できるテストスクリプトを用意しました。

## 🚀 クイックスタート

### 基本的な本番ビルドテスト

```bash
npm run test:production
```

### Netlify 環境の完全再現

```bash
npm run test:netlify
```

### 本番サーバーでの動作確認

```bash
npm run test:production:serve
# または
npm run test:netlify:serve
```

## 📋 利用可能なテストスクリプト

| スクリプト                   | 説明                           | 用途                     |
| ---------------------------- | ------------------------------ | ------------------------ |
| `npm run test:production`    | 基本的な本番ビルドテスト       | 日常的な変更確認         |
| `npm run test:netlify`       | Netlify 環境の完全再現         | 重要な変更前の確認       |
| `npm run precommit:enhanced` | 強化されたプリコミットチェック | コミット前の自動チェック |

## 🔍 テスト内容の詳細

### 1. 本番ビルドテスト (`test:production`)

- Node.js/npm バージョンチェック
- 依存関係のクリーンインストール
- TypeScript 型チェック
- 本番ビルド実行
- ビルド成果物の確認
- バンドルサイズの表示

### 2. Netlify 環境再現 (`test:netlify`)

- 上記のすべてのチェック
- Git 情報の確認
- ファイル変更状況の確認
- セキュリティ脆弱性チェック
- ESLint チェック（設定されている場合）
- PWA 機能の詳細確認

### 3. 強化されたプリコミットチェック (`precommit:enhanced`)

- 変更されたファイルの種類別チェック
- package.json 変更時の依存関係整合性チェック
- TypeScript ファイル変更時の型チェック
- 設定ファイル変更時の構文チェック
- 軽量な本番ビルドテスト

## 🛠️ 使用方法

### 日常的な開発フロー

```bash
# 1. 変更を加える
# ... コードを編集 ...

# 2. 基本的なテストを実行
npm run test:production

# 3. 問題がなければコミット
git add .
git commit -m "your changes"
git push
```

### 重要な変更前

```bash
# 1. Netlify環境を完全再現してテスト
npm run test:netlify

# 2. 問題がなければコミット
git add .
git commit -m "important changes"
git push
```

### コミット前の自動チェック

```bash
# プリコミットフックとして設定（オプション）
# .git/hooks/pre-commit に enhanced-pre-commit.sh をコピー
cp scripts/enhanced-pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## 🚨 エラーが発生した場合

### 依存関係エラー

```bash
# クリーンインストール
rm -rf node_modules package-lock.json
npm install
```

### TypeScript エラー

```bash
# 型チェックのみ実行
npx tsc --noEmit --strict
```

### ビルドエラー

```bash
# 詳細なエラー情報を確認
npm run build
```

## 💡 ベストプラクティス

1. **小さな変更**: `npm run test:production`
2. **大きな変更**: `npm run test:netlify`
3. **設定ファイル変更**: `npm run test:netlify`
4. **依存関係変更**: `npm run test:netlify`

## 🔧 トラブルシューティング

### スクリプトが実行できない

```bash
# 実行権限を付与
chmod +x scripts/*.sh
```

### Node.js バージョンの問題

```bash
# Node.js 18を使用（Netlifyと同じ）
nvm use 18
```

### ビルドが遅い

```bash
# キャッシュをクリア
rm -rf node_modules/.vite
rm -rf dist
```

## 📊 テスト結果の見方

### ✅ 成功

- すべてのチェックが成功
- Netlify でのビルドも成功する可能性が高い

### ⚠️ 警告

- セキュリティ脆弱性など、注意が必要だが致命的ではない問題
- Netlify でも同様の警告が出る可能性がある

### ❌ エラー

- 修正が必要な問題
- Netlify でも同じエラーが発生する

## 🎯 目標

これらのスクリプトを使用することで：

- ✅ ローカルで Netlify と同じ条件を再現
- ✅ ビルドエラーを事前に発見
- ✅ デプロイの成功率を向上
- ✅ 開発効率の向上

**重要**: これらのテストで成功した場合は、Netlify でも高い確率でビルドが成功します。
