import { getQuestions } from "../data/questions";
import {
  TimeAttackMode,
  TimeAttackQuestion,
  TimeAttackSynergyData,
} from "../types/timeAttack";
import { DataManager } from "./dataManager";
import { GachaSystem } from "./gachaSystem";

/**
 * タイムアタック問題生成システム
 * 相乗効果を重視した問題生成
 */
export class TimeAttackGenerator {
  /**
   * 相乗効果データを取得
   */
  static getSynergyData(): TimeAttackSynergyData {
    const userGachaData = GachaSystem.getUserGachaData();
    const preStudyProgress = DataManager.getPreStudyProgress();

    return {
      availableVocabulary: userGachaData.ownedCards.map((card) => ({
        cardId: card.id.toString(),
        word: card.word,
        meaning: card.meaning,
        rarity: card.rarity,
        masteryLevel: this.calculateMasteryLevel(
          DataManager.getUserStats(),
          "vocabulary"
        ),
        lastStudied: undefined,
      })),

      grammarProgress: [
        // 実際の文法クイズ進捗と連携
        {
          category: "basic-grammar",
          accuracy: 0.8,
          lastStudied: Date.now() - 24 * 60 * 60 * 1000,
          weakPoints: ["be動詞", "一般動詞"],
        },
        {
          category: "tenses",
          accuracy: 0.6,
          lastStudied: Date.now() - 48 * 60 * 60 * 1000,
          weakPoints: ["現在完了", "未来形"],
        },
      ],

      completedPreStudyTopics: preStudyProgress.completedContents.map(
        (contentId: string) => ({
          contentId,
          category: this.determineGrammarCategory(DataManager.getUserStats()),
          completedAt: Date.now() - 60 * 60 * 1000,
          comprehensionRating: 4,
        })
      ),

      identifiedWeakAreas: [
        {
          category: "tenses",
          type: "grammar",
          errorCount: 3,
          lastError: Date.now() - 12 * 60 * 60 * 1000,
          needsReview: true,
        },
      ],
    };
  }

  /**
   * モードに基づいて問題を生成
   */
  static generateQuestions(mode: TimeAttackMode): TimeAttackQuestion[] {
    const synergyData = this.getSynergyData();
    const questions: TimeAttackQuestion[] = [];

    switch (mode.focusArea) {
      case "recent-study":
        questions.push(
          ...this.generateRecentStudyQuestions(synergyData, mode.questionCount)
        );
        break;
      case "weak-areas":
        questions.push(
          ...this.generateWeakAreaQuestions(synergyData, mode.questionCount)
        );
        break;
      case "vocabulary":
        questions.push(
          ...this.generateVocabularyQuestions(synergyData, mode.questionCount)
        );
        break;
      case "grammar":
        questions.push(
          ...this.generateGrammarQuestions(synergyData, mode.questionCount)
        );
        break;
      case "mixed":
      default:
        questions.push(
          ...this.generateMixedQuestions(synergyData, mode.questionCount)
        );
        break;
    }

    // 問題をシャッフルして時間制限を設定
    return questions
      .sort(() => Math.random() - 0.5)
      .slice(0, mode.questionCount)
      .map((q) => ({ ...q, timeLimit: mode.timePerQuestion }));
  }

  /**
   * 最近の学習内容に基づく問題生成
   */
  private static generateRecentStudyQuestions(
    synergyData: TimeAttackSynergyData,
    count: number
  ): TimeAttackQuestion[] {
    const questions: TimeAttackQuestion[] = [];
    const recentVocab = synergyData.availableVocabulary.slice(
      0,
      Math.ceil(count * 0.6)
    );
    const recentGrammar = synergyData.grammarProgress.slice(
      0,
      Math.ceil(count * 0.4)
    );

    // 最近獲得した語彙から問題生成
    recentVocab.forEach((vocab, index) => {
      if (questions.length >= count) return;

      const otherVocab = synergyData.availableVocabulary
        .filter((v) => v.cardId !== vocab.cardId)
        .slice(0, 3);

      questions.push({
        id: `recent-vocab-${vocab.cardId}`,
        type: "vocabulary",
        source: "gacha-vocabulary",
        question: `「${vocab.meaning}」を英語で言うと？`,
        options: [vocab.word, ...otherVocab.map((v) => v.word)].sort(
          () => Math.random() - 0.5
        ),
        correctAnswer: vocab.word,
        explanation: `${vocab.word}: ${vocab.meaning}`,
        timeLimit: 10,
        difficulty: "normal",
        relatedContent: {
          vocabularyCard: vocab.cardId,
        },
      });
    });

    // 最近学習した文法から問題生成
    recentGrammar.forEach((grammar) => {
      if (questions.length >= count) return;

      const grammarQuestions = getQuestions(grammar.category as any, "easy");
      if (grammarQuestions.length > 0) {
        const randomQuestion =
          grammarQuestions[Math.floor(Math.random() * grammarQuestions.length)];

        questions.push({
          id: `recent-grammar-${grammar.category}-${randomQuestion.id}`,
          type: "grammar",
          source: "grammar-quiz",
          question: randomQuestion.japanese,
          options: randomQuestion.choices,
          correctAnswer: randomQuestion.correctAnswer,
          explanation: randomQuestion.explanation,
          timeLimit: 15,
          difficulty: "normal",
          category: grammar.category,
          relatedContent: {
            grammarCategory: grammar.category,
          },
        });
      }
    });

    return questions;
  }

  /**
   * 弱点分野に特化した問題生成
   */
  private static generateWeakAreaQuestions(
    synergyData: TimeAttackSynergyData,
    count: number
  ): TimeAttackQuestion[] {
    const questions: TimeAttackQuestion[] = [];
    const weakAreas = synergyData.identifiedWeakAreas.filter(
      (area) => area.needsReview
    );

    weakAreas.forEach((weakArea) => {
      if (questions.length >= count) return;

      if (weakArea.type === "grammar") {
        const grammarQuestions = getQuestions(
          weakArea.category as any,
          "normal"
        );
        const selectedQuestions = grammarQuestions.slice(0, 3);

        selectedQuestions.forEach((q) => {
          if (questions.length >= count) return;

          questions.push({
            id: `weak-grammar-${weakArea.category}-${q.id}`,
            type: "grammar",
            source: "weak-area",
            question: q.japanese,
            options: q.choices,
            correctAnswer: q.correctAnswer,
            explanation: `弱点克服: ${q.explanation}`,
            timeLimit: 18, // 弱点分野は少し長めの時間
            difficulty: "hard",
            category: weakArea.category,
            relatedContent: {
              grammarCategory: weakArea.category,
            },
          });
        });
      }
    });

    // 弱点分野が少ない場合は、低正答率の語彙を追加
    const lowMasteryVocab = synergyData.availableVocabulary
      .filter((v) => v.masteryLevel < 2)
      .slice(0, count - questions.length);

    lowMasteryVocab.forEach((vocab) => {
      const otherVocab = synergyData.availableVocabulary
        .filter((v) => v.cardId !== vocab.cardId)
        .slice(0, 3);

      questions.push({
        id: `weak-vocab-${vocab.cardId}`,
        type: "vocabulary",
        source: "weak-area",
        question: `「${vocab.meaning}」の英語は？`,
        options: [vocab.word, ...otherVocab.map((v) => v.word)].sort(
          () => Math.random() - 0.5
        ),
        correctAnswer: vocab.word,
        explanation: `復習推奨: ${vocab.word} - ${vocab.meaning}`,
        timeLimit: 12,
        difficulty: "hard",
        relatedContent: {
          vocabularyCard: vocab.cardId,
        },
      });
    });

    return questions;
  }

  /**
   * 語彙中心の問題生成
   */
  private static generateVocabularyQuestions(
    synergyData: TimeAttackSynergyData,
    count: number
  ): TimeAttackQuestion[] {
    const questions: TimeAttackQuestion[] = [];
    const vocabulary = synergyData.availableVocabulary.slice(0, count);

    vocabulary.forEach((vocab) => {
      const otherVocab = synergyData.availableVocabulary
        .filter((v) => v.cardId !== vocab.cardId)
        .slice(0, 3);

      // 意味から英語を選ぶ問題
      questions.push({
        id: `vocab-meaning-${vocab.cardId}`,
        type: "vocabulary",
        source: "gacha-vocabulary",
        question: `「${vocab.meaning}」の英語は？`,
        options: [vocab.word, ...otherVocab.map((v) => v.word)].sort(
          () => Math.random() - 0.5
        ),
        correctAnswer: vocab.word,
        explanation: `${vocab.word}: ${vocab.meaning}`,
        timeLimit: 8,
        difficulty:
          vocab.rarity === "legendary"
            ? "hard"
            : vocab.rarity === "rare"
            ? "normal"
            : "easy",
        relatedContent: {
          vocabularyCard: vocab.cardId,
        },
      });
    });

    return questions.slice(0, count);
  }

  /**
   * 文法中心の問題生成
   */
  private static generateGrammarQuestions(
    synergyData: TimeAttackSynergyData,
    count: number
  ): TimeAttackQuestion[] {
    const questions: TimeAttackQuestion[] = [];
    const grammarCategories = ["basic-grammar", "tenses", "modals", "passive"];

    grammarCategories.forEach((category) => {
      if (questions.length >= count) return;

      const categoryQuestions = getQuestions(category as any, "normal").slice(
        0,
        3
      );

      categoryQuestions.forEach((q) => {
        if (questions.length >= count) return;

        questions.push({
          id: `grammar-${category}-${q.id}`,
          type: "grammar",
          source: "grammar-quiz",
          question: q.japanese,
          options: q.choices,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          timeLimit: 15,
          difficulty: "normal",
          category,
          relatedContent: {
            grammarCategory: category,
          },
        });
      });
    });

    return questions.slice(0, count);
  }

  /**
   * 混合問題生成
   */
  private static generateMixedQuestions(
    synergyData: TimeAttackSynergyData,
    count: number
  ): TimeAttackQuestion[] {
    const questions: TimeAttackQuestion[] = [];
    const vocabCount = Math.ceil(count * 0.5);
    const grammarCount = Math.floor(count * 0.5);

    // 語彙問題
    questions.push(
      ...this.generateVocabularyQuestions(synergyData, vocabCount)
    );

    // 文法問題
    questions.push(...this.generateGrammarQuestions(synergyData, grammarCount));

    return questions.sort(() => Math.random() - 0.5);
  }

  /**
   * モードの要件をチェック
   */
  static checkModeRequirements(
    mode: TimeAttackMode,
    synergyData: TimeAttackSynergyData
  ): {
    canPlay: boolean;
    missingRequirements: string[];
  } {
    const missing: string[] = [];

    if (mode.requirements) {
      if (mode.requirements.level) {
        // 実際のユーザーレベルと比較
        // const userLevel = getLevelManager().getLevel();
        // if (userLevel < mode.requirements.level) {
        //   missing.push(`レベル${mode.requirements.level}以上が必要`);
        // }
      }

      if (mode.requirements.vocabularyCards) {
        if (
          synergyData.availableVocabulary.length <
          mode.requirements.vocabularyCards
        ) {
          missing.push(
            `語彙カード${mode.requirements.vocabularyCards}枚以上が必要`
          );
        }
      }

      if (mode.requirements.completedCategories) {
        const completedCategories = synergyData.grammarProgress.map(
          (g) => g.category
        );
        const missingCategories = mode.requirements.completedCategories.filter(
          (cat) => !completedCategories.includes(cat)
        );
        if (missingCategories.length > 0) {
          missing.push(
            `文法カテゴリー「${missingCategories.join(", ")}」の学習が必要`
          );
        }
      }
    }

    return {
      canPlay: missing.length === 0,
      missingRequirements: missing,
    };
  }

  /**
   * 習熟度を計算
   */
  private static calculateMasteryLevel(
    userStats: UserStats,
    type: "vocabulary" | "grammar"
  ): number {
    if (!userStats) return 1;

    if (type === "vocabulary") {
      // 語彙学習数に基づく習熟度計算
      const studied = userStats.vocabularyStudied || 0;
      if (studied < 50) return 1;
      if (studied < 150) return 2;
      if (studied < 300) return 3;
      return 4;
    } else {
      // 文法クイズ完了数に基づく習熟度計算
      const completed = userStats.grammarQuizzesCompleted || 0;
      if (completed < 20) return 1;
      if (completed < 50) return 2;
      if (completed < 100) return 3;
      return 4;
    }
  }

  /**
   * 文法カテゴリを決定
   */
  private static determineGrammarCategory(userStats: any): string {
    // ユーザーの学習履歴に基づいて最適なカテゴリを決定
    const categories = [
      "basic-grammar",
      "tenses",
      "modals",
      "passive",
      "relative",
      "subjunctive",
      "comparison",
      "participle",
      "infinitive",
    ];

    // 簡単な実装：統計に基づいてランダムに選択
    const completed = userStats?.grammarQuizzesCompleted || 0;
    const index = completed % categories.length;
    return categories[index];
  }
}
