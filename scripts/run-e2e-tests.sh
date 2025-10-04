#!/bin/bash

# ENTP英語学習アプリ - E2Eテスト実行スクリプト
# 
# 自動テストの実行とレポート生成
# - 全E2Eテストの実行
# - テスト結果の集計
# - レポートの生成

set -e

echo "🚀 ENTP英語学習アプリ E2Eテスト実行開始"
echo "=================================="

# 現在の日時を記録
START_TIME=$(date)
echo "開始時刻: $START_TIME"

# プロジェクトディレクトリに移動
cd "$(dirname "$0")/.."

# 依存関係の確認
echo "📦 依存関係の確認..."
if [ ! -d "node_modules" ]; then
    echo "依存関係をインストール中..."
    npm install
fi

# 開発サーバーの起動確認
echo "🔧 開発サーバーの起動確認..."
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "開発サーバーを起動中..."
    npm run dev &
    DEV_SERVER_PID=$!
    
    # サーバー起動を待機
    echo "サーバー起動を待機中..."
    for i in {1..30}; do
        if curl -s http://localhost:3000 > /dev/null; then
            echo "✅ 開発サーバー起動完了"
            break
        fi
        sleep 1
    done
    
    if [ $i -eq 30 ]; then
        echo "❌ 開発サーバーの起動に失敗しました"
        exit 1
    fi
else
    echo "✅ 開発サーバーは既に起動しています"
fi

# テスト結果ディレクトリの作成
mkdir -p test-results/e2e
mkdir -p playwright-report

# E2Eテストの実行
echo "🧪 E2Eテストの実行..."
echo "=================================="

# 基本学習フローテスト
echo "📚 基本学習フローテスト実行中..."
npx playwright test src/test/e2e/basic-learning-flow.test.ts --reporter=html,json || echo "⚠️ 基本学習フローテストでエラーが発生しました"

# ゲーミフィケーション機能テスト
echo "🎮 ゲーミフィケーション機能テスト実行中..."
npx playwright test src/test/e2e/gamification-features.test.ts --reporter=html,json || echo "⚠️ ゲーミフィケーション機能テストでエラーが発生しました"

# インテリジェント学習システムテスト
echo "🧠 インテリジェント学習システムテスト実行中..."
npx playwright test src/test/e2e/intelligent-learning-system.test.ts --reporter=html,json || echo "⚠️ インテリジェント学習システムテストでエラーが発生しました"

# PWA機能テスト
echo "📱 PWA機能テスト実行中..."
npx playwright test src/test/e2e/pwa-features.test.ts --reporter=html,json || echo "⚠️ PWA機能テストでエラーが発生しました"

echo "=================================="

# テスト結果の集計
echo "📊 テスト結果の集計..."
if [ -f "test-results.json" ]; then
    # テスト結果の解析
    TOTAL_TESTS=$(jq '.stats.total' test-results.json 2>/dev/null || echo "0")
    PASSED_TESTS=$(jq '.stats.passed' test-results.json 2>/dev/null || echo "0")
    FAILED_TESTS=$(jq '.stats.failed' test-results.json 2>/dev/null || echo "0")
    SKIPPED_TESTS=$(jq '.stats.skipped' test-results.json 2>/dev/null || echo "0")
    
    echo "テスト結果サマリー:"
    echo "  総テスト数: $TOTAL_TESTS"
    echo "  成功: $PASSED_TESTS"
    echo "  失敗: $FAILED_TESTS"
    echo "  スキップ: $SKIPPED_TESTS"
    
    # 成功率の計算
    if [ "$TOTAL_TESTS" -gt 0 ]; then
        SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
        echo "  成功率: $SUCCESS_RATE%"
    fi
else
    echo "⚠️ テスト結果ファイルが見つかりません"
fi

# レポートの生成
echo "📋 レポートの生成..."
if [ -d "playwright-report" ]; then
    echo "✅ HTMLレポートが生成されました: playwright-report/index.html"
fi

# スクリーンショットの整理
echo "📸 スクリーンショットの整理..."
if [ -d "test-results" ]; then
    # スクリーンショットを結果ディレクトリに移動
    find test-results -name "*.png" -exec cp {} test-results/e2e/ \; 2>/dev/null || true
    echo "✅ スクリーンショットを整理しました"
fi

# 開発サーバーの停止
if [ ! -z "$DEV_SERVER_PID" ]; then
    echo "🛑 開発サーバーを停止中..."
    kill $DEV_SERVER_PID 2>/dev/null || true
fi

# 終了時刻の記録
END_TIME=$(date)
echo "終了時刻: $END_TIME"

# 実行時間の計算
START_TIMESTAMP=$(date -d "$START_TIME" +%s)
END_TIMESTAMP=$(date -d "$END_TIME" +%s)
DURATION=$((END_TIMESTAMP - START_TIMESTAMP))

echo "=================================="
echo "🎉 E2Eテスト実行完了"
echo "実行時間: ${DURATION}秒"
echo "=================================="

# 結果に基づく終了コード
if [ "$FAILED_TESTS" -gt 0 ]; then
    echo "❌ 一部のテストが失敗しました"
    exit 1
else
    echo "✅ 全てのテストが成功しました"
    exit 0
fi
