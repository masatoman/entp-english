/**
 * データの動的読み込み最適化
 * 必要なデータのみを遅延読み込みしてバンドルサイズを削減
 */

// データファイルの動的インポート
export const loadVocabularyData = async (category: string) => {
  switch (category) {
    case "basic":
      return await import("../data/expandedBasicVocabulary");
    case "intermediate":
      return await import("../data/intermediateBusinessVocabulary");
    case "advanced":
      return await import("../data/advancedBusinessVocabulary");
    case "toeic":
      return await import("../data/toeicGachaCards");
    default:
      return await import("../data/vocabulary");
  }
};

export const loadGrammarData = async (category: string) => {
  switch (category) {
    case "basic":
      return await import("../data/grammarQuiz");
    case "advanced":
      return await import("../data/grammarQuizCategorized");
    default:
      return await import("../data/questions");
  }
};

export const loadTOEICData = async (type: string) => {
  switch (type) {
    case "mock":
      return await import("../data/toeicMockTestQuestions");
    case "listening":
      return await import("../data/listeningQuestions");
    default:
      return await import("../data/toeicGachaCards");
  }
};

export const loadAchievementData = async () => {
  return await import("../data/achievements");
};

export const loadShopData = async () => {
  return await import("../data/xpShop");
};

// プリロード用の関数
export const preloadEssentialData = async () => {
  const [achievements, shopData] = await Promise.all([
    loadAchievementData(),
    loadShopData(),
  ]);

  return { achievements, shopData };
};

// データのキャッシュ管理
const dataCache = new Map<string, any>();

export const getCachedData = (key: string) => {
  return dataCache.get(key);
};

export const setCachedData = (key: string, data: any) => {
  dataCache.set(key, data);
};

export const clearCache = () => {
  dataCache.clear();
};
