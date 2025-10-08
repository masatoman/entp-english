const fs = require('fs');
const path = require('path');

const vocabularyFiles = [
  'src/data/advancedAcademicVocabulary.ts',
  'src/data/advancedBusinessVocabulary.ts',
  'src/data/advancedProfessionalVocabulary.ts',
  'src/data/artsCultureVocabulary.ts',
  'src/data/communicationMediaVocabulary.ts',
  'src/data/economicFinancialVocabulary.ts',
  'src/data/educationAcademicVocabulary.ts',
  'src/data/entertainmentMediaVocabulary.ts',
  'src/data/environmentScienceVocabulary.ts',
  'src/data/fashionBeautyVocabulary.ts',
  'src/data/foodCookingVocabulary.ts',
  'src/data/healthMedicalVocabulary.ts',
  'src/data/intermediateBusinessVocabulary.ts',
  'src/data/intermediateDailyVocabulary.ts',
  'src/data/natureEnvironmentVocabulary.ts',
  'src/data/professionalBusinessVocabulary.ts',
  'src/data/sportsFitnessVocabulary.ts',
  'src/data/technologyDigitalVocabulary.ts',
  'src/data/travelLeisureVocabulary.ts',
  'src/data/vocabulary.ts'
];

vocabularyFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 各オブジェクトに不足しているプロパティを追加
    content = content.replace(
      /(\s+{\s*id:\s*\d+,)\s*word:\s*"([^"]+)",\s*meaning:\s*"([^"]+)",/g,
      '$1\n    word: "$2",\n    english: "$2",\n    japanese: "$3",\n    meaning: "$3",'
    );
    
    // examples と content プロパティを追加
    content = content.replace(
      /(\s+category:\s*"[^"]+",\s*)(\s*},)/g,
      '$1\n    examples: ["例文"],\n    content: "$2",$2'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${filePath}`);
  }
});
