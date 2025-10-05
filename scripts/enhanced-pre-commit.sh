#!/bin/bash

# 強化されたプリコミットフック
# Netlifyでのビルド失敗を防ぐため、包括的なチェックを実行

set -e  # エラー時に停止

echo "🔍 強化されたプリコミットチェック開始..."

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# エラー関数
error_exit() {
    echo -e "${RED}❌ エラー: $1${NC}" >&2
    echo -e "${RED}💡 このエラーはNetlifyでも発生する可能性があります${NC}" >&2
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

# 1. ファイル変更の確認
echo "📋 変更されたファイルの確認..."
CHANGED_FILES=$(git diff --cached --name-only)
if [ -z "$CHANGED_FILES" ]; then
    info "コミット対象のファイルがありません"
    exit 0
fi

echo "変更されたファイル:"
echo "$CHANGED_FILES"

# 2. package.jsonの変更チェック
if echo "$CHANGED_FILES" | grep -q "package.json"; then
    echo "📦 package.jsonの変更を検出"
    
    # 依存関係の整合性チェック
    info "依存関係の整合性をチェック中..."
    npm install --package-lock-only
    
    if [ $? -ne 0 ]; then
        error_exit "package.jsonの依存関係に問題があります"
    fi
    success "package.jsonの依存関係: OK"
fi

# 3. TypeScriptファイルの変更チェック
if echo "$CHANGED_FILES" | grep -q "\.ts$\|\.tsx$"; then
    echo "🔍 TypeScriptファイルの変更を検出"
    
    # TypeScript型チェック
    info "TypeScript型チェック実行中..."
    npx tsc --noEmit --strict
    
    if [ $? -ne 0 ]; then
        error_exit "TypeScript型チェックに失敗しました"
    fi
    success "TypeScript型チェック: OK"
fi

# 4. 設定ファイルの変更チェック
if echo "$CHANGED_FILES" | grep -q "vite\.config\|tsconfig\.json"; then
    echo "⚙️  設定ファイルの変更を検出"
    
    # 設定ファイルの構文チェック
    info "設定ファイルの構文チェック中..."
    
    if echo "$CHANGED_FILES" | grep -q "tsconfig\.json"; then
        npx tsc --showConfig > /dev/null
        if [ $? -ne 0 ]; then
            error_exit "tsconfig.jsonに構文エラーがあります"
        fi
        success "tsconfig.json: OK"
    fi
    
    if echo "$CHANGED_FILES" | grep -q "vite\.config"; then
        node -c vite.config.ts 2>/dev/null || node -c vite.config.js 2>/dev/null
        if [ $? -ne 0 ]; then
            error_exit "vite.configに構文エラーがあります"
        fi
        success "vite.config: OK"
    fi
fi

# 5. 本番ビルドテスト（軽量版）
echo "🏗️  本番ビルドテスト（軽量版）..."

# 依存関係のインストール（キャッシュを使用）
if [ ! -d "node_modules" ]; then
    info "依存関係をインストール中..."
    npm install
fi

# ビルド実行
info "本番ビルド実行中..."
npm run build

if [ $? -ne 0 ]; then
    error_exit "本番ビルドに失敗しました"
fi
success "本番ビルド: OK"

# 6. ビルド成果物の基本チェック
info "ビルド成果物の基本チェック..."
REQUIRED_FILES=("dist/index.html" "dist/manifest.webmanifest" "dist/sw.js")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        error_exit "必須ファイルが生成されていません: $file"
    fi
done
success "ビルド成果物: OK"

# 7. セキュリティチェック（軽量版）
if command -v npm >/dev/null 2>&1; then
    info "セキュリティチェック（軽量版）..."
    npm audit --audit-level high --production > /dev/null 2>&1
    
    if [ $? -ne 0 ]; then
        warning "高レベルのセキュリティ脆弱性が検出されました（Netlifyでも警告が出る可能性があります）"
    else
        success "セキュリティチェック: OK"
    fi
fi

# 8. 結果サマリー
echo ""
success "🎉 プリコミットチェック完了！"
echo ""
info "✅ すべてのチェックが成功しました"
info "✅ Netlifyでのビルドも成功する可能性が高いです"
echo ""
echo "📝 次のステップ:"
echo "1. git commit を続行"
echo "2. git push"
echo "3. Netlifyデプロイを確認"
echo ""
echo "💡 より詳細なテストが必要な場合は:"
echo "   npm run test:production"
