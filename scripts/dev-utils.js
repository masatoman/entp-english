#!/usr/bin/env node

/**
 * 開発効率化ユーティリティスクリプト
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// カラー出力用
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// プロジェクト統計を表示
function showProjectStats() {
  log("\n📊 プロジェクト統計", "cyan");
  log("=".repeat(50), "cyan");

  try {
    // ファイル数統計
    const srcFiles = execSync(
      'find src -name "*.ts" -o -name "*.tsx" | wc -l',
      { encoding: "utf8" }
    ).trim();
    const testFiles = execSync(
      'find src -name "*.test.*" -o -name "*.spec.*" | wc -l',
      { encoding: "utf8" }
    ).trim();
    const totalLines = execSync(
      'find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | tail -1',
      { encoding: "utf8" }
    ).trim();

    log(`📁 ソースファイル数: ${srcFiles}`, "green");
    log(`🧪 テストファイル数: ${testFiles}`, "green");
    log(`📝 総行数: ${totalLines}`, "green");

    // 依存関係統計
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    const depCount = Object.keys(packageJson.dependencies || {}).length;
    const devDepCount = Object.keys(packageJson.devDependencies || {}).length;

    log(`📦 本番依存関係: ${depCount}`, "blue");
    log(`🔧 開発依存関係: ${devDepCount}`, "blue");
  } catch (error) {
    log("❌ 統計取得エラー: " + error.message, "red");
  }
}

// 未使用のインポートをチェック
function checkUnusedImports() {
  log("\n🔍 未使用インポートチェック", "yellow");
  log("=".repeat(50), "yellow");

  try {
    // 簡単な未使用インポートチェック
    const srcFiles = execSync('find src -name "*.ts" -o -name "*.tsx"', {
      encoding: "utf8",
    })
      .trim()
      .split("\n");

    let unusedCount = 0;
    srcFiles.forEach((file) => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, "utf8");
        const lines = content.split("\n");

        lines.forEach((line, index) => {
          // 簡単な未使用インポート検出（実際のプロジェクトではESLintを使用）
          if (
            line.includes("import") &&
            line.includes("from") &&
            !line.includes("//")
          ) {
            const importName = line.match(/import\s+{([^}]+)}/);
            if (importName) {
              const imports = importName[1].split(",").map((imp) => imp.trim());
              imports.forEach((imp) => {
                const cleanImport = imp.replace(/\s+as\s+\w+/, "").trim();
                if (
                  !content.includes(cleanImport) &&
                  !content.includes(cleanImport + ".")
                ) {
                  log(
                    `⚠️  ${file}:${index + 1} - 未使用の可能性: ${cleanImport}`,
                    "yellow"
                  );
                  unusedCount++;
                }
              });
            }
          }
        });
      }
    });

    if (unusedCount === 0) {
      log("✅ 未使用インポートは見つかりませんでした", "green");
    } else {
      log(`⚠️  ${unusedCount}個の未使用インポートの可能性があります`, "yellow");
    }
  } catch (error) {
    log("❌ 未使用インポートチェックエラー: " + error.message, "red");
  }
}

// パフォーマンスヒントを表示
function showPerformanceTips() {
  log("\n⚡ パフォーマンス最適化ヒント", "magenta");
  log("=".repeat(50), "magenta");

  const tips = [
    "🎯 React.memo()を使用してコンポーネントの再レンダリングを防ぐ",
    "🔄 useCallback()とuseMemo()で関数とオブジェクトの再作成を防ぐ",
    "📦 動的インポートでコード分割を実装する",
    "🖼️ 画像の遅延読み込み（lazy loading）を実装する",
    "🗂️ バンドルサイズを監視し、不要な依存関係を削除する",
    "⚡ Viteの最適化設定を活用する",
    "🧪 パフォーマンステストを定期的に実行する",
  ];

  tips.forEach((tip) => log(tip, "cyan"));
}

// メイン関数
function main() {
  const command = process.argv[2];

  log("🚀 ENTP英語学習アプリ - 開発効率化ツール", "bright");

  switch (command) {
    case "stats":
      showProjectStats();
      break;
    case "unused":
      checkUnusedImports();
      break;
    case "tips":
      showPerformanceTips();
      break;
    case "all":
      showProjectStats();
      checkUnusedImports();
      showPerformanceTips();
      break;
    default:
      log("\n📖 使用方法:", "yellow");
      log("  node scripts/dev-utils.js <command>", "white");
      log("\n🔧 利用可能なコマンド:", "yellow");
      log("  stats  - プロジェクト統計を表示", "white");
      log("  unused - 未使用インポートをチェック", "white");
      log("  tips   - パフォーマンス最適化ヒントを表示", "white");
      log("  all    - すべてのチェックを実行", "white");
      break;
  }
}

main();
