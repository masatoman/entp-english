#!/usr/bin/env node

/**
 * 本番ビルドの品質チェックスクリプト
 * 開発環境と本番環境の動作差異を検出
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 本番ビルド品質チェック開始...");

// 1. ビルドファイルの存在確認
const distPath = path.join(__dirname, "../dist");
if (!fs.existsSync(distPath)) {
  console.error("❌ distディレクトリが存在しません");
  process.exit(1);
}

// 2. 重要なファイルの存在確認
const requiredFiles = ["index.html", "manifest.webmanifest", "sw.js"];

requiredFiles.forEach((file) => {
  const filePath = path.join(distPath, file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ 必須ファイルが見つかりません: ${file}`);
    process.exit(1);
  }
});

// 3. Reactバンドルの確認
const assetsPath = path.join(distPath, "assets");
if (fs.existsSync(assetsPath)) {
  const files = fs.readdirSync(assetsPath);
  const reactBundle = files.find((file) => file.includes("vendor-react"));
  const reactDomBundle = files.find((file) => file.includes("vendor-react"));

  if (!reactBundle) {
    console.warn("⚠️  Reactバンドルが見つかりません");
  } else {
    console.log(`✅ Reactバンドル確認: ${reactBundle}`);
  }
}

// 4. バンドルサイズの確認
const bundleSizeLimit = 500 * 1024; // 500KB
files.forEach((file) => {
  if (file.endsWith(".js")) {
    const filePath = path.join(assetsPath, file);
    const stats = fs.statSync(filePath);
    if (stats.size > bundleSizeLimit) {
      console.warn(
        `⚠️  大きなバンドルファイル: ${file} (${Math.round(
          stats.size / 1024
        )}KB)`
      );
    }
  }
});

console.log("✅ 本番ビルド品質チェック完了");
