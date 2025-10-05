#!/bin/bash

# Netlifyのビルドプロセスをローカルで完全再現
# 使用方法: ./scripts/simulate-netlify-build.sh

set -e  # エラー時に停止

echo "🌐 Netlifyビルドプロセス完全再現開始..."

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# 情報関数
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 警告関数
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. 環境情報の表示
echo "📋 環境情報:"
info "Node.js: $(node --version)"
info "npm: $(npm --version)"
info "OS: $(uname -s)"
info "Architecture: $(uname -m)"

# 2. Git情報の確認
echo "📋 Git情報:"
info "Branch: $(git branch --show-current)"
info "Latest commit: $(git log -1 --oneline)"

# 3. ファイル変更の確認
echo "📋 ファイル変更状況:"
if [ -n "$(git status --porcelain)" ]; then
    warning "未コミットの変更があります:"
    git status --short
else
    success "すべての変更がコミット済みです"
fi

# 4. 依存関係のクリーンインストール（Netlifyと同じ）
echo "🧹 依存関係のクリーンインストール（Netlify環境再現）..."
rm -rf node_modules package-lock.json
npm install

if [ $? -ne 0 ]; then
    error_exit "依存関係のインストールに失敗しました"
fi
success "依存関係のインストール完了"

# 5. 依存関係の整合性チェック
echo "🔍 依存関係の整合性チェック..."
npm audit --audit-level moderate

if [ $? -ne 0 ]; then
    warning "セキュリティ脆弱性が検出されました（Netlifyでも同様の警告が出る可能性があります）"
fi

# 6. TypeScript型チェック
echo "🔍 TypeScript型チェック..."
npx tsc --noEmit --strict

if [ $? -ne 0 ]; then
    error_exit "TypeScript型チェックに失敗しました"
fi
success "TypeScript型チェック完了"

# 7. ESLintチェック（設定されている場合）
if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ] || [ -f "eslint.config.js" ]; then
    echo "🔍 ESLintチェック..."
    npm run lint
    
    if [ $? -ne 0 ]; then
        error_exit "ESLintチェックに失敗しました"
    fi
    success "ESLintチェック完了"
else
    info "ESLint設定が見つかりません（スキップ）"
fi

# 8. 本番ビルド実行
echo "🏗️  本番ビルド実行（Netlify build.command と同じ）..."
npm run build

if [ $? -ne 0 ]; then
    error_exit "本番ビルドに失敗しました"
fi
success "本番ビルド完了"

# 9. ビルド成果物の詳細確認
echo "📦 ビルド成果物の詳細確認..."

# distディレクトリの確認
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

# ファイルサイズの確認
echo "📊 ファイルサイズ詳細:"
du -sh dist/
echo ""
echo "主要ファイル:"
ls -lh dist/ | grep -E "\.(html|js|css|json)$"

# 10. PWA機能の確認
echo "📱 PWA機能の確認..."
if [ -f "dist/manifest.webmanifest" ]; then
    info "PWA Manifest: OK"
    # manifest.jsonの内容を簡単チェック
    if grep -q '"name"' dist/manifest.webmanifest; then
        success "PWA Manifest の内容確認: OK"
    else
        warning "PWA Manifest の内容に問題がある可能性があります"
    fi
else
    error_exit "PWA Manifest が見つかりません"
fi

if [ -f "dist/sw.js" ]; then
    success "Service Worker: OK"
else
    error_exit "Service Worker が見つかりません"
fi

# 11. 静的ファイルの配信テスト（オプション）
if [ "$1" = "--serve" ]; then
    echo "🌐 静的ファイル配信テスト..."
    echo "http://localhost:8080 でアクセス可能です"
    echo "Ctrl+C で停止してください"
    cd dist && python3 -m http.server 8080
fi

# 12. 結果サマリー
echo ""
echo "🎉 Netlifyビルドプロセス再現完了！"
echo ""
echo "📊 結果サマリー:"
echo "✅ 依存関係インストール: 成功"
echo "✅ TypeScript型チェック: 成功"
echo "✅ 本番ビルド: 成功"
echo "✅ PWA機能: 正常"
echo ""
echo "📝 次のステップ:"
echo "1. 変更をコミット: git add . && git commit -m 'your message'"
echo "2. プッシュ: git push"
echo "3. Netlifyデプロイを確認"
echo ""
echo "💡 このテストで失敗した場合は、Netlifyでも同じエラーが発生します"
