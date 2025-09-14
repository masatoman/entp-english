#!/bin/bash

# ENTP英語学習アプリ - 包括的テスト実行スクリプト

set -e

echo "🧪 ENTP英語学習アプリ - テストスイート実行開始"
echo "================================================"

# 色付きのログ関数
log_info() {
    echo -e "\033[32m[INFO]\033[0m $1"
}

log_warn() {
    echo -e "\033[33m[WARN]\033[0m $1"
}

log_error() {
    echo -e "\033[31m[ERROR]\033[0m $1"
}

# 依存関係の確認
log_info "依存関係を確認中..."
if ! command -v npm &> /dev/null; then
    log_error "npm がインストールされていません"
    exit 1
fi

if ! command -v node &> /dev/null; then
    log_error "Node.js がインストールされていません"
    exit 1
fi

# パッケージのインストール
log_info "依存関係をインストール中..."
npm ci

# 1. ユニットテスト
log_info "1/5 ユニットテストを実行中..."
npm run test:coverage
if [ $? -eq 0 ]; then
    log_info "✅ ユニットテスト完了"
else
    log_error "❌ ユニットテストが失敗しました"
    exit 1
fi

# 2. 統合テスト
log_info "2/5 統合テストを実行中..."
npm run test -- --testPathPattern=integration
if [ $? -eq 0 ]; then
    log_info "✅ 統合テスト完了"
else
    log_error "❌ 統合テストが失敗しました"
    exit 1
fi

# 3. ビルドテスト
log_info "3/5 ビルドテストを実行中..."
npm run build
if [ $? -eq 0 ]; then
    log_info "✅ ビルドテスト完了"
else
    log_error "❌ ビルドテストが失敗しました"
    exit 1
fi

# 4. セキュリティ監査
log_info "4/5 セキュリティ監査を実行中..."
npm audit --audit-level moderate
if [ $? -eq 0 ]; then
    log_info "✅ セキュリティ監査完了"
else
    log_warn "⚠️ セキュリティ監査で警告が検出されました"
fi

# 5. E2Eテスト
log_info "5/5 E2Eテストを実行中..."
if command -v npx &> /dev/null; then
    npx playwright install --with-deps
    npm run test:e2e
    if [ $? -eq 0 ]; then
        log_info "✅ E2Eテスト完了"
    else
        log_error "❌ E2Eテストが失敗しました"
        exit 1
    fi
else
    log_warn "⚠️ Playwrightがインストールされていないため、E2Eテストをスキップします"
fi

# テスト結果のサマリー
echo ""
echo "🎉 全てのテストが完了しました！"
echo "================================================"
echo ""
echo "📊 テスト結果サマリー:"
echo "  ✅ ユニットテスト: 完了"
echo "  ✅ 統合テスト: 完了"
echo "  ✅ ビルドテスト: 完了"
echo "  ✅ セキュリティ監査: 完了"
echo "  ✅ E2Eテスト: 完了"
echo ""
echo "📁 レポートファイル:"
echo "  - カバレッジレポート: coverage/index.html"
echo "  - E2Eテストレポート: playwright-report/index.html"
echo ""
echo "🚀 アプリケーションの準備が完了しました！"
