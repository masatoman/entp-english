import { preStudyContents } from "../data/preStudyContents";
import { TOEICQuestion } from "../types/mockTest";
import {
  PreStudyProgressForTOEIC,
  PreStudyTOEICBoost,
  PreStudyTopicMapping,
  TOEICPreStudyIntegration,
  TOEICQuestionWithPreStudyBoost,
} from "../types/preStudyTOEICIntegration";
import { PreStudyProgressManager } from "./preStudyProgressManager";

/**
 * 事前学習とTOEIC模擬テストの統合管理システム
 */
export class PreStudyTOEICIntegrationManager {
  private static readonly INTEGRATION_KEY = "entp-prestudy-toeic-integration";

  /**
   * 事前学習トピックとTOEICパートのマッピング定義
   */
  private static readonly TOPIC_MAPPINGS: PreStudyTopicMapping[] = [
    {
      topicId: "basic-grammar-theory",
      topicTitle: "英文の基本構造：SVO完全マスター",
      relatedTOEICParts: [5, 6],
      synergyEffects: [
        {
          partNumber: 5,
          effectType: "xp_boost",
          effectValue: 1.5,
          condition: "基本文型問題で正解時",
        },
        {
          partNumber: 6,
          effectType: "accuracy_boost",
          effectValue: 1.2,
          condition: "語順問題で正解率向上",
        },
      ],
      unlocksAdvancedQuestions: true,
    },
    {
      topicId: "tenses-theory-part1",
      topicTitle: "時制の基本：現在・過去・未来",
      relatedTOEICParts: [2, 5],
      synergyEffects: [
        {
          partNumber: 2,
          effectType: "xp_boost",
          effectValue: 1.3,
          condition: "時制関連応答問題で正解時",
        },
        {
          partNumber: 5,
          effectType: "accuracy_boost",
          effectValue: 1.25,
          condition: "時制問題で正解率向上",
        },
      ],
      prerequisiteTopics: ["basic-grammar-theory"],
    },
    {
      topicId: "tenses-theory-part2",
      topicTitle: "時制の応用：完了形・進行形",
      relatedTOEICParts: [2, 5, 6],
      synergyEffects: [
        {
          partNumber: 2,
          effectType: "xp_boost",
          effectValue: 1.4,
          condition: "完了形・進行形応答問題で正解時",
        },
        {
          partNumber: 5,
          effectType: "accuracy_boost",
          effectValue: 1.3,
          condition: "時制応用問題で正解率向上",
        },
        {
          partNumber: 6,
          effectType: "time_extension",
          effectValue: 10,
          condition: "時制関連長文問題で時間延長",
        },
      ],
      prerequisiteTopics: ["tenses-theory-part1"],
    },
    {
      topicId: "modals-theory",
      topicTitle: "助動詞の完全理解",
      relatedTOEICParts: [2, 5],
      synergyEffects: [
        {
          partNumber: 2,
          effectType: "xp_boost",
          effectValue: 1.35,
          condition: "助動詞応答問題で正解時",
        },
        {
          partNumber: 5,
          effectType: "hint_unlock",
          effectValue: 1,
          condition: "助動詞問題でヒント表示",
        },
      ],
      prerequisiteTopics: ["basic-grammar-theory"],
    },
    {
      topicId: "passive-voice-theory",
      topicTitle: "受動態のマスター",
      relatedTOEICParts: [5, 6],
      synergyEffects: [
        {
          partNumber: 5,
          effectType: "xp_boost",
          effectValue: 1.4,
          condition: "受動態問題で正解時",
        },
        {
          partNumber: 6,
          effectType: "accuracy_boost",
          effectValue: 1.3,
          condition: "受動態長文問題で正解率向上",
        },
      ],
      prerequisiteTopics: ["basic-grammar-theory", "tenses-theory-part1"],
    },
    {
      topicId: "relative-clauses-theory",
      topicTitle: "関係詞の完全攻略",
      relatedTOEICParts: [5, 6, 7],
      synergyEffects: [
        {
          partNumber: 5,
          effectType: "xp_boost",
          effectValue: 1.5,
          condition: "関係詞問題で正解時",
        },
        {
          partNumber: 6,
          effectType: "accuracy_boost",
          effectValue: 1.4,
          condition: "関係詞長文問題で正解率向上",
        },
        {
          partNumber: 7,
          effectType: "time_extension",
          effectValue: 15,
          condition: "関係詞読解問題で時間延長",
        },
      ],
      prerequisiteTopics: ["basic-grammar-theory"],
    },
  ];

  /**
   * ユーザーの事前学習進捗をTOEIC用に取得
   */
  static getPreStudyProgressForTOEIC(
    _userId: string = "default"
  ): PreStudyProgressForTOEIC {
    const completedTopics = PreStudyProgressManager.getCompletedContents();

    const topicProgress = completedTopics.map((topicId) => {
      const content = preStudyContents.find((c) => c.id === topicId);
      return {
        topicId,
        completionDate: new Date(), // TODO: 実際の完了日時を取得
        comprehensionRating: 4, // TODO: 実際の理解度評価を取得
        timeSpent: content?.duration || 0,
      };
    });

    const availableBoosts = this.calculateAvailableBoosts(completedTopics);
    const nextRecommendedTopics =
      this.getNextRecommendedTopics(completedTopics);

    return {
      completedTopics,
      topicProgress,
      availableBoosts,
      nextRecommendedTopics,
    };
  }

  /**
   * 完了した事前学習に基づく利用可能なブーストを計算
   */
  static calculateAvailableBoosts(
    completedTopics: string[]
  ): PreStudyTOEICBoost {
    const preStudyEffects: {
      topicId: string;
      partNumber: number;
      effectType:
        | "xp_boost"
        | "accuracy_boost"
        | "time_extension"
        | "hint_unlock";
      effectValue: number;
      description: string;
    }[] = [];
    const unlockedParts = new Set<number>();
    const bonusQuestions: string[] = [];

    for (const topicId of completedTopics) {
      const mapping = this.TOPIC_MAPPINGS.find((m) => m.topicId === topicId);
      if (mapping) {
        // 関連するTOEICパートを解放
        mapping.relatedTOEICParts.forEach((part) => unlockedParts.add(part));

        // シナジー効果を追加
        mapping.synergyEffects.forEach((effect) => {
          preStudyEffects.push({
            topicId,
            partNumber: effect.partNumber,
            effectType: effect.effectType,
            effectValue: effect.effectValue,
            description: effect.condition,
          });
        });

        // 高度な問題を解放
        if (mapping.unlocksAdvancedQuestions) {
          bonusQuestions.push(`advanced-${topicId}`);
        }
      }
    }

    // シナジー倍率を計算
    const synergyMultiplier = Math.min(1.0 + preStudyEffects.length * 0.1, 2.0);

    return {
      completedTopics,
      synergyMultiplier,
      unlockedParts: Array.from(unlockedParts),
      bonusQuestions,
      preStudyEffects,
    };
  }

  /**
   * 次の推奨事前学習トピックを取得
   */
  static getNextRecommendedTopics(completedTopics: string[]): string[] {
    const recommendations: string[] = [];

    for (const mapping of this.TOPIC_MAPPINGS) {
      // まだ完了していないトピック
      if (!completedTopics.includes(mapping.topicId)) {
        // 前提条件を満たしているかチェック
        const prerequisitesMet =
          !mapping.prerequisiteTopics ||
          mapping.prerequisiteTopics.every((prereq) =>
            completedTopics.includes(prereq)
          );

        if (prerequisitesMet) {
          recommendations.push(mapping.topicId);
        }
      }
    }

    return recommendations.slice(0, 3); // 最大3つまで推奨
  }

  /**
   * TOEIC問題に事前学習ブーストを適用
   */
  static applyPreStudyBoostToQuestion(
    question: TOEICQuestion,
    completedTopics: string[]
  ): TOEICQuestionWithPreStudyBoost {
    const questionWithBoost = { ...question } as TOEICQuestionWithPreStudyBoost;

    // 該当する事前学習トピックを探す
    for (const topicId of completedTopics) {
      const mapping = this.TOPIC_MAPPINGS.find((m) => m.topicId === topicId);
      if (mapping && mapping.relatedTOEICParts.includes(question.part)) {
        const relevantEffect = mapping.synergyEffects.find(
          (effect) => effect.partNumber === question.part
        );

        if (relevantEffect) {
          questionWithBoost.preStudyBoost = {
            topicId,
            boostType: relevantEffect.effectType,
            boostValue: relevantEffect.effectValue,
            isActive: true,
          };
          break; // 最初に見つかった効果を適用
        }
      }
    }

    return questionWithBoost;
  }

  /**
   * 事前学習ブーストに基づくXP計算
   */
  static calculateBoostedXP(
    baseXP: number,
    question: TOEICQuestionWithPreStudyBoost,
    isCorrect: boolean
  ): number {
    if (!isCorrect || !question.preStudyBoost?.isActive) {
      return baseXP;
    }

    const boost = question.preStudyBoost;
    switch (boost.boostType) {
      case "xp_boost":
        return Math.floor(baseXP * boost.boostValue);
      case "accuracy_boost":
        return Math.floor(baseXP * 1.1); // 正解率向上の場合は控えめなボーナス
      default:
        return baseXP;
    }
  }

  /**
   * 統合データを保存
   */
  static saveIntegrationData(
    userId: string,
    data: TOEICPreStudyIntegration
  ): void {
    localStorage.setItem(
      `${this.INTEGRATION_KEY}-${userId}`,
      JSON.stringify(data)
    );
  }

  /**
   * 統合データを読み込み
   */
  static loadIntegrationData(
    userId: string = "default"
  ): TOEICPreStudyIntegration | null {
    try {
      const stored = localStorage.getItem(`${this.INTEGRATION_KEY}-${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("統合データの読み込みエラー:", error);
      return null;
    }
  }

  /**
   * 統計情報を更新
   */
  static updateStatistics(userId: string): void {
    const progress = this.getPreStudyProgressForTOEIC(userId);
    const boosts = progress.availableBoosts;

    const statistics = {
      totalPreStudyCompleted: progress.completedTopics.length,
      totalBoostsActive: boosts.preStudyEffects.length,
      averageSynergyMultiplier: boosts.synergyMultiplier,
      mostEffectiveTopic: this.findMostEffectiveTopic(progress.completedTopics),
    };

    const integrationData: TOEICPreStudyIntegration = {
      userId,
      completedPreStudy: progress.completedTopics,
      toeicBoosts: boosts,
      lastUpdated: new Date(),
      statistics,
    };

    this.saveIntegrationData(userId, integrationData);
  }

  /**
   * 最も効果的なトピックを特定
   */
  private static findMostEffectiveTopic(completedTopics: string[]): string {
    let mostEffective = "";
    let maxEffects = 0;

    for (const topicId of completedTopics) {
      const mapping = this.TOPIC_MAPPINGS.find((m) => m.topicId === topicId);
      if (mapping && mapping.synergyEffects.length > maxEffects) {
        mostEffective = mapping.topicTitle;
        maxEffects = mapping.synergyEffects.length;
      }
    }

    return mostEffective;
  }
}
