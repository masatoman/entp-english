#!/bin/bash

# Netlifyと同じ条件でローカルビルドテストを実行
# 使用方法: ./scripts/test-production-build.sh

set -e  # エラー時に停止

echo "🚀 Netlify本番ビルドテスト開始..."

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# エラー関数
error_exit() {
    echo -e "${RED}❌ エラー: $1${NC}" >&2
    exit 1
}

# 成功関数
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# 警告関数
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. Node.js バージョンチェック
echo "📋 Node.js バージョンチェック..."
NODE_VERSION=$(node --version)
echo "Node.js version: $NODE_VERSION"

# Netlifyは通常Node.js 18を使用
if [[ $NODE_VERSION == v18* ]]; then
    success "Node.js バージョンOK (Netlify互換)"
else
    warning "Node.js バージョンがNetlifyと異なる可能性があります (Netlify: v18.x, 現在: $NODE_VERSION)"
fi

# 2. npm バージョンチェック
echo "📋 npm バージョンチェック..."
NPM_VERSION=$(npm --version)
echo "npm version: $NPM_VERSION"

# 3. クリーンインストール（Netlifyと同じ条件）
echo "🧹 依存関係のクリーンインストール..."
rm -rf node_modules package-lock.json
npm install

if [ $? -ne 0 ]; then
    error_exit "依存関係のインストールに失敗しました"
fi
success "依存関係のインストール完了"

# 4. TypeScript型チェック
echo "🔍 TypeScript型チェック..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
    error_exit "TypeScript型チェックに失敗しました"
fi
success "TypeScript型チェック完了"

# 5. 本番ビルド
echo "🏗️  本番ビルド実行..."
npm run build

if [ $? -ne 0 ]; then
    error_exit "本番ビルドに失敗しました"
fi
success "本番ビルド完了"

# 6. ビルド成果物の確認
echo "📦 ビルド成果物の確認..."
if [ ! -d "dist" ]; then
    error_exit "distディレクトリが生成されていません"
fi

# 必須ファイルの確認
REQUIRED_FILES=("index.html" "manifest.webmanifest" "sw.js")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "dist/$file" ]; then
        error_exit "必須ファイルが見つかりません: dist/$file"
    fi
done
success "ビルド成果物の確認完了"

# 7. バンドルサイズの確認
echo "📊 バンドルサイズの確認..."
if [ -d "dist/assets" ]; then
    echo "バンドルファイル:"
    ls -lh dist/assets/*.js | awk '{print $5, $9}'
    echo "CSSファイル:"
    ls -lh dist/assets/*.css | awk '{print $5, $9}'
fi

# 8. 本番サーバーでの動作確認（オプション）
if [ "$1" = "--serve" ]; then
    echo "🌐 本番サーバーでの動作確認..."
    echo "http://localhost:8080 でアクセス可能です"
    echo "Ctrl+C で停止してください"
    cd dist && python3 -m http.server 8080
fi

success "🎉 Netlify本番ビルドテスト完了！"
echo ""
echo "📝 次のステップ:"
echo "1. 変更をコミット: git add . && git commit -m 'your message'"
echo "2. プッシュ: git push"
echo "3. Netlifyデプロイを確認"
