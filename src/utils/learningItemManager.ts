import { VocabularyWord } from "../data/vocabulary";
import { WordCard } from "../types/gacha";
import {
  LearningExample,
  LearningExplanation,
  LearningItem,
  LearningProgress,
  LearningQuestion,
} from "../types/learningItem";

/**
 * 統合学習項目管理システム
 * 全ての学習コンテンツを統一的に管理
 */
export class LearningItemManager {
  private static readonly STORAGE_KEY = "entp-learning-items";
  private static readonly PROGRESS_KEY = "entp-learning-progress";

  /**
   * ガチャカードをLearningItemに変換
   */
  static convertGachaCardToLearningItem(card: WordCard): LearningItem {
    const examples: LearningExample[] = card.examples.map((ex, index) => ({
      id: `${card.id}-example-${index}`,
      sentence: ex.sentence,
      translation: ex.translation,
      situation: ex.situation,
      difficulty: "medium" as const,
    }));

    const explanations: LearningExplanation[] = [];

    // 組み合わせ表現を説明として追加
    if (card.combinations) {
      card.combinations.forEach((combo, index) => {
        explanations.push({
          id: `${card.id}-combo-${index}`,
          type: "usage",
          title: `${combo.type}: ${combo.expression}`,
          content: `${combo.meaning} - ${combo.example}`,
          examples: [combo.translation],
        });
      });
    }

    // よく使われるパターンを説明として追加
    if (card.commonUsages) {
      card.commonUsages.forEach((usage, index) => {
        explanations.push({
          id: `${card.id}-usage-${index}`,
          type: "usage",
          title: usage.pattern,
          content: usage.explanation,
          examples: [usage.example],
        });
      });
    }

    // 問題を自動生成
    const questions = this.generateQuestionsForCard(card);

    return {
      id: `gacha-${card.id}`,
      type: "vocabulary",
      content: card.word,
      meaning: card.meaning,
      category: "toeic",
      level: this.mapRarityToLevel(card.rarity),
      partOfSpeech: card.partOfSpeech,
      examples,
      explanations,
      questions,
      relations: [], // TODO: 関連性の自動生成
      rarity: card.rarity,
      source: "gacha",
      tags: [
        card.toeicSpecific.businessContext,
        ...card.toeicSpecific.parts,
        card.toeicSpecific.frequency,
        card.toeicSpecific.scoreBand,
      ],
      difficulty: this.calculateDifficulty(card),
      importance: this.calculateImportance(card),
      frequency: this.mapFrequencyToScore(card.toeicSpecific.frequency),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * 標準語彙をLearningItemに変換
   */
  static convertVocabularyWordToLearningItem(
    word: VocabularyWord
  ): LearningItem {
    const examples: LearningExample[] = [
      {
        id: `${word.id}-example-0`,
        sentence: word.example,
        translation: word.exampleTranslation,
        situation: "General usage",
        difficulty: "medium" as const,
      },
    ];

    // 基本的な問題を生成
    const questions = this.generateQuestionsForVocabulary(word);

    return {
      id: `vocab-${word.id}`,
      type: "vocabulary",
      content: word.word,
      meaning: word.meaning,
      category: word.category || "general",
      level: word.level,
      partOfSpeech: word.partOfSpeech,
      examples,
      explanations: [],
      questions,
      relations: [],
      source: "standard",
      tags: [word.level, word.category || "general"],
      difficulty: this.calculateVocabularyDifficulty(word),
      importance: 70, // デフォルト重要度
      frequency: 50, // デフォルト頻度
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * ガチャカード用の問題を自動生成
   */
  private static generateQuestionsForCard(card: WordCard): LearningQuestion[] {
    const questions: LearningQuestion[] = [];
    const baseId = `gacha-${card.id}`;

    // 1. 意味選択問題
    questions.push({
      id: `${baseId}-meaning`,
      type: "multiple_choice",
      difficulty: "easy",
      prompt: `"${card.word}"の意味として最も適切なものを選んでください。`,
      options: this.generateMeaningOptions(card),
      correctAnswer: card.meaning,
      explanation: `"${card.word}"は「${card.meaning}」という意味です。${card.toeicSpecific.businessContext}でよく使われます。`,
      learningItemId: `gacha-${card.id}`,
      focusAspect: "meaning",
      estimatedTime: 10,
      tags: ["meaning", "multiple_choice"],
    });

    // 2. 使用法穴埋め問題
    if (card.examples.length > 0) {
      const example = card.examples[0];
      const blankSentence = example.sentence.replace(
        new RegExp(card.word, "gi"),
        "____"
      );

      questions.push({
        id: `${baseId}-usage`,
        type: "fill_blank",
        difficulty: "medium",
        prompt: `次の文の空欄に適切な単語を入れてください。\n\n"${blankSentence}"`,
        correctAnswer: card.word,
        explanation: `正解は「${card.word}」です。\n\n${example.translation}\n\n💡 ${example.situation}`,
        learningItemId: `gacha-${card.id}`,
        focusAspect: "usage",
        estimatedTime: 15,
        tags: ["usage", "fill_blank", "context"],
      });
    }

    // 3. 翻訳問題（日→英）
    questions.push({
      id: `${baseId}-translation-je`,
      type: "translation",
      difficulty: "medium",
      prompt: `次の日本語を英語に翻訳してください：\n\n「${card.meaning}」`,
      correctAnswer: card.word,
      explanation: `「${card.meaning}」は英語で「${card.word}」です。\n\n発音: ${card.phonetic}`,
      learningItemId: `gacha-${card.id}`,
      focusAspect: "meaning",
      estimatedTime: 20,
      tags: ["translation", "meaning"],
    });

    // 4. コロケーション問題
    if (card.combinations && card.combinations.length > 0) {
      const combo = card.combinations[0];
      questions.push({
        id: `${baseId}-collocation`,
        type: "multiple_choice",
        difficulty: "hard",
        prompt: `"${card.word}"と組み合わせて使われる表現として正しいものを選んでください。`,
        options: [
          combo.expression,
          `make ${card.word}`,
          `do ${card.word}`,
          `take ${card.word}`,
        ],
        correctAnswer: combo.expression,
        explanation: `「${combo.expression}」は「${combo.meaning}」という意味の重要な表現です。\n\n例: ${combo.example}\n訳: ${combo.translation}`,
        learningItemId: `gacha-${card.id}`,
        focusAspect: "usage",
        estimatedTime: 25,
        tags: ["collocation", "usage", "advanced"],
      });
    }

    // 5. TOEIC特化問題
    if (card.toeicSpecific.synonyms && card.toeicSpecific.synonyms.length > 0) {
      questions.push({
        id: `${baseId}-synonym`,
        type: "multiple_choice",
        difficulty: "medium",
        prompt: `"${card.word}"の類義語として最も適切なものを選んでください。`,
        options: [
          card.toeicSpecific.synonyms[0],
          card.word, // 元の単語も選択肢に
          "different word",
          "opposite meaning",
        ],
        correctAnswer: card.toeicSpecific.synonyms[0],
        explanation: `「${card.toeicSpecific.synonyms[0]}」は「${
          card.word
        }」の類義語です。\n\nTOEIC ${card.toeicSpecific.parts.join(
          ", "
        )}でよく出題されます。`,
        learningItemId: `gacha-${card.id}`,
        focusAspect: "meaning",
        estimatedTime: 15,
        tags: ["synonym", "toeic", "meaning"],
      });
    }

    return questions;
  }

  /**
   * 意味選択問題の選択肢を生成
   */
  private static generateMeaningOptions(card: WordCard): string[] {
    const correctMeaning = card.meaning;

    // より適切なダミー選択肢を生成
    const dummyOptions = [
      "会議や打ち合わせ",
      "書類や資料",
      "計画や戦略",
      "システムや方法",
      "結果や成果",
      "問題や課題",
      "機会や可能性",
      "責任や義務",
    ];

    // 正解以外の選択肢をランダムに選択
    const shuffledDummies = dummyOptions
      .filter((option) => option !== correctMeaning)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // 正解と混ぜてシャッフル
    const allOptions = [correctMeaning, ...shuffledDummies].sort(
      () => Math.random() - 0.5
    );

    return allOptions;
  }

  /**
   * 標準語彙用の問題を自動生成
   */
  private static generateQuestionsForVocabulary(
    word: VocabularyWord
  ): LearningQuestion[] {
    const questions: LearningQuestion[] = [];
    const baseId = `vocab-${word.id}`;

    // 基本的な意味問題
    questions.push({
      id: `${baseId}-meaning`,
      type: "multiple_choice",
      difficulty: "easy",
      prompt: `"${word.word}"の意味として最も適切なものを選んでください。`,
      options: [word.meaning, "選択肢2", "選択肢3", "選択肢4"], // TODO: より適切な選択肢生成
      correctAnswer: word.meaning,
      explanation: `"${word.word}"は「${word.meaning}」という意味です。`,
      learningItemId: `vocab-${word.id}`,
      focusAspect: "meaning",
      estimatedTime: 10,
      tags: ["meaning", "multiple_choice"],
    });

    return questions;
  }

  /**
   * レアリティをレベルにマッピング
   */
  private static mapRarityToLevel(
    rarity: string
  ): "beginner" | "intermediate" | "advanced" {
    switch (rarity) {
      case "common":
        return "beginner";
      case "uncommon":
        return "intermediate";
      case "rare":
      case "epic":
      case "legendary":
        return "advanced";
      default:
        return "intermediate";
    }
  }

  /**
   * 難易度を計算
   */
  private static calculateDifficulty(card: WordCard): number {
    let difficulty = 50; // ベース難易度

    // レアリティによる調整
    switch (card.rarity) {
      case "common":
        difficulty += 0;
        break;
      case "uncommon":
        difficulty += 15;
        break;
      case "rare":
        difficulty += 25;
        break;
      case "epic":
        difficulty += 35;
        break;
      case "legendary":
        difficulty += 45;
        break;
    }

    // TOEICスコアバンドによる調整
    if (card.toeicSpecific.scoreBand.includes("800+")) {
      difficulty += 20;
    } else if (card.toeicSpecific.scoreBand.includes("700-800")) {
      difficulty += 15;
    } else if (card.toeicSpecific.scoreBand.includes("600-700")) {
      difficulty += 10;
    }

    return Math.min(100, difficulty);
  }

  /**
   * 重要度を計算
   */
  private static calculateImportance(card: WordCard): number {
    let importance = 50; // ベース重要度

    // 頻出度による調整
    switch (card.toeicSpecific.frequency) {
      case "very_high":
        importance += 40;
        break;
      case "high":
        importance += 25;
        break;
      case "medium":
        importance += 10;
        break;
      case "low":
        importance -= 10;
        break;
    }

    return Math.min(100, Math.max(0, importance));
  }

  /**
   * 頻度をスコアにマッピング
   */
  private static mapFrequencyToScore(frequency: string): number {
    switch (frequency) {
      case "very_high":
        return 90;
      case "high":
        return 75;
      case "medium":
        return 50;
      case "low":
        return 25;
      default:
        return 50;
    }
  }

  /**
   * 語彙の難易度を計算
   */
  private static calculateVocabularyDifficulty(word: VocabularyWord): number {
    switch (word.level) {
      case "beginner":
        return 30;
      case "intermediate":
        return 60;
      case "advanced":
        return 85;
      default:
        return 50;
    }
  }

  /**
   * 全ての学習項目を取得
   */
  static getAllLearningItems(): LearningItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading learning items:", error);
    }
    return [];
  }

  /**
   * 学習項目を保存
   */
  static saveLearningItems(items: LearningItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving learning items:", error);
    }
  }

  /**
   * フィルタリングされた学習項目を取得
   */
  static getFilteredLearningItems(
    level?: "beginner" | "intermediate" | "advanced",
    category?: string,
    type?: "vocabulary" | "grammar" | "phrase" | "sentence"
  ): LearningItem[] {
    let items = this.getAllLearningItems();

    if (level) {
      items = items.filter((item) => item.level === level);
    }

    if (category && category !== "all") {
      items = items.filter((item) => item.category === category);
    }

    if (type) {
      items = items.filter((item) => item.type === type);
    }

    return items;
  }

  /**
   * 学習進捗を取得
   */
  static getLearningProgress(itemId: string): LearningProgress | null {
    try {
      const stored = localStorage.getItem(this.PROGRESS_KEY);
      if (stored) {
        const allProgress: LearningProgress[] = JSON.parse(stored);
        return allProgress.find((p) => p.itemId === itemId) || null;
      }
    } catch (error) {
      console.error("Error loading learning progress:", error);
    }
    return null;
  }

  /**
   * 学習進捗を保存
   */
  static saveLearningProgress(progress: LearningProgress): void {
    try {
      const stored = localStorage.getItem(this.PROGRESS_KEY);
      let allProgress: LearningProgress[] = stored ? JSON.parse(stored) : [];

      const existingIndex = allProgress.findIndex(
        (p) => p.itemId === progress.itemId
      );
      if (existingIndex >= 0) {
        allProgress[existingIndex] = progress;
      } else {
        allProgress.push(progress);
      }

      localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(allProgress));
    } catch (error) {
      console.error("Error saving learning progress:", error);
    }
  }
}
