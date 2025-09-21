#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 更新対象のファイル一覧
const filesToUpdate = [
  'src/components/VocabularyDifficultySelection.tsx',
  'src/components/CategorySelection.tsx',
  'src/components/GrammarQuiz.tsx',
  'src/components/Achievements.tsx',
  'src/components/IntegratedLearning.tsx',
  'src/components/SynergyDashboard.tsx',
  'src/components/DifficultySelection.tsx',
  'src/components/GrowthDashboard.tsx',
  'src/components/FoundationQuestionSetSelection.tsx',
  'src/components/CombinedTest.tsx',
  'src/components/CreativeWritingChallenge.tsx',
  'src/components/XPShopPage.tsx',
  'src/components/GrammarQuizDifficultySelection.tsx',
  'src/components/PersonalInsights.tsx',
  'src/components/EnhancedGrammarQuiz.tsx',
  'src/components/SkillTree.tsx',
  'src/components/GachaVocabularyLearning.tsx',
  'src/components/EssayHistory.tsx',
  'src/components/GrammarQuizCategorySelection.tsx',
  'src/components/EssayWriting.tsx',
  'src/components/CardDetailContent.tsx',
  'src/components/QuestionSetSelection.tsx',
  'src/components/GachaResultScreen.tsx',
  'src/components/SentencePatternSelection.tsx'
];

// 色の置換パターン
const colorReplacements = [
  // 背景グラデーション
  {
    pattern: /className="([^"]*?)bg-gradient-to-br from-blue-50 to-indigo-100([^"]*?)"/g,
    replacement: (match, before, after) => {
      const needsImport = !before.includes('style={{');
      return `className="${before.trim()}${after.trim()}" style={{ background: \`linear-gradient(135deg, \${baseColors.ghostWhite} 0%, \${baseColors.periwinkle} 100%)\` }}`;
    }
  },
  {
    pattern: /className="([^"]*?)bg-gradient-to-br from-purple-50 to-pink-50([^"]*?)"/g,
    replacement: (match, before, after) => {
      return `className="${before.trim()}${after.trim()}" style={{ background: \`linear-gradient(135deg, \${baseColors.ghostWhite} 0%, \${baseColors.periwinkle} 100%)\` }}`;
    }
  },
  {
    pattern: /className="([^"]*?)bg-gradient-to-br from-blue-50 to-purple-50([^"]*?)"/g,
    replacement: (match, before, after) => {
      return `className="${before.trim()}${after.trim()}" style={{ background: \`linear-gradient(135deg, \${baseColors.ghostWhite} 0%, \${baseColors.periwinkle} 100%)\` }}`;
    }
  },
  {
    pattern: /className="([^"]*?)bg-gradient-to-b from-blue-50 to-white([^"]*?)"/g,
    replacement: (match, before, after) => {
      return `className="${before.trim()}${after.trim()}" style={{ background: \`linear-gradient(135deg, \${baseColors.ghostWhite} 0%, \${baseColors.periwinkle} 100%)\` }}`;
    }
  },
  {
    pattern: /className="([^"]*?)bg-gradient-to-br from-slate-50 to-blue-100([^"]*?)"/g,
    replacement: (match, before, after) => {
      return `className="${before.trim()}${after.trim()}" style={{ background: \`linear-gradient(135deg, \${baseColors.ghostWhite} 0%, \${baseColors.periwinkle} 100%)\` }}`;
    }
  }
];

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // baseColorsのimportを追加
    if (!content.includes('import { baseColors }') && !content.includes('from "../styles/colors"')) {
      // 既存のimportの後に追加
      const importMatch = content.match(/(import.*from.*["'][^"']*ui[^"']*["'];?\n)/);
      if (importMatch) {
        const importIndex = content.indexOf(importMatch[0]) + importMatch[0].length;
        content = content.slice(0, importIndex) + 
          'import { baseColors } from "../styles/colors";\n' + 
          content.slice(importIndex);
        modified = true;
      }
    }
    
    // 色の置換を実行
    colorReplacements.forEach(({ pattern, replacement }) => {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️  No changes: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// メイン処理
console.log('🎨 Starting color palette update...\n');

let totalUpdated = 0;
filesToUpdate.forEach(file => {
  if (updateFile(file)) {
    totalUpdated++;
  }
});

console.log(`\n🎯 Update completed: ${totalUpdated}/${filesToUpdate.length} files updated`);
