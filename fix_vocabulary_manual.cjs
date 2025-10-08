const fs = require("fs");

// vocabulary.tsファイルを読み込み
const filePath = "src/data/vocabulary.ts";
let content = fs.readFileSync(filePath, "utf8");

// より強力な正規表現でマッチング
// オブジェクト全体をマッチングして修正
const objectPattern =
  /(\s*{\s*id:\s*\d+,\s*word:\s*"[^"]+",\s*english:\s*"[^"]+",\s*japanese:\s*"[^"]+",\s*meaning:\s*"[^"]+",\s*partOfSpeech:\s*"[^"]+",\s*example:\s*"[^"]+",\s*exampleTranslation:\s*"[^"]+",\s*level:\s*"[^"]+",\s*)(\n\s*},)/g;

content = content.replace(objectPattern, (match, beforeLevel, afterBrace) => {
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

console.log("vocabulary.tsの手動修正が完了しました");
