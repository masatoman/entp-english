const fs = require("fs");

// vocabulary.tsファイルを読み込み
const filePath = "src/data/vocabulary.ts";
let content = fs.readFileSync(filePath, "utf8");

// VocabularyWordオブジェクトのパターンを特定して修正
// より正確な正規表現でマッチング
const pattern = /(\s+level:\s*"[^"]+",\s*)(\n\s*},)/g;

content = content.replace(pattern, (match, beforeLevel, afterBrace) => {
  // 既にexamplesとcontentがある場合はスキップ
  if (match.includes("examples:") && match.includes("content:")) {
    return match;
  }

  // wordプロパティの値を取得
  const wordMatch = match.match(/word:\s*"([^"]+)"/);
  const exampleMatch = match.match(/example:\s*"([^"]+)"/);

  if (wordMatch && exampleMatch) {
    const word = wordMatch[1];
    const example = exampleMatch[1];
    return (
      beforeLevel +
      `\n    examples: ["${example}"],\n    content: "${word}",` +
      afterBrace
    );
  }
  return match;
});

// ファイルに書き戻し
fs.writeFileSync(filePath, content);

console.log("vocabulary.tsの最終修正が完了しました");
