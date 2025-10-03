import { TOEICQuestion } from "../types/mockTest";
import {
  SkillBonus,
  SkillTreeProgressForTOEIC,
  SkillTreeTOEICIntegration,
  TOEICQuestionWithSkillBoost,
} from "../types/skillTreeTOEICIntegration";
import { GRAMMAR_SKILL_TREE } from "./skillTreeManager";

/**
 * スキルツリーとTOEIC模擬テストの統合管理システム
 */
export class SkillTreeTOEICIntegrationManager {
  private static readonly INTEGRATION_KEY = "entp-skilltree-toeic-integration";

  /**
   * スキルとTOEICパートのマッピング定義
   */
  private static readonly SKILL_TOEIC_MAPPINGS: SkillBonus[] = [
    {
      skillId: "parts-of-speech",
      skillName: "品詞の理解",
      skillLevel: 0,
      toeicParts: [5, 6],
      bonusEffects: [
        {
          partNumber: 5,
          effectType: "xp_multiplier",
          effectValue: 1.3,
          condition: "品詞問題で正解時",
        },
        {
          partNumber: 6,
          effectType: "accuracy_boost",
          effectValue: 1.15,
          condition: "品詞識別問題で正解率向上",
        },
      ],
      prerequisites: [],
      unlocksAdvancedQuestions: true,
    },
    {
      skillId: "word-order",
      skillName: "語順の基本",
      skillLevel: 0,
      toeicParts: [5, 6],
      bonusEffects: [
        {
          partNumber: 5,
          effectType: "xp_multiplier",
          effectValue: 1.4,
          condition: "語順問題で正解時",
        },
        {
          partNumber: 6,
          effectType: "time_extension",
          effectValue: 5,
          condition: "語順長文問題で時間延長",
        },
      ],
      prerequisites: ["parts-of-speech"],
      unlocksAdvancedQuestions: true,
    },
    {
      skillId: "articles",
      skillName: "冠詞の使い分け",
      skillLevel: 1,
      toeicParts: [5, 6],
      bonusEffects: [
        {
          partNumber: 5,
          effectType: "xp_multiplier",
          effectValue: 1.35,
          condition: "冠詞問題で正解時",
        },
        {
          partNumber: 6,
          effectType: "hint_unlock",
          effectValue: 1,
          condition: "冠詞問題でヒント表示",
        },
      ],
      prerequisites: ["word-order"],
      unlocksAdvancedQuestions: false,
    },
    {
      skillId: "sv-basic",
      skillName: "基本文型（SV・SVC）",
      skillLevel: 1,
      toeicParts: [5, 6],
      bonusEffects: [
        {
          partNumber: 5,
          effectType: "xp_multiplier",
          effectValue: 1.5,
          condition: "基本文型問題で正解時",
        },
        {
          partNumber: 6,
          effectType: "accuracy_boost",
          effectValue: 1.25,
          condition: "文型識別問題で正解率向上",
        },
      ],
      prerequisites: ["word-order"],
      unlocksAdvancedQuestions: true,
    },
    {
      skillId: "sv-basic",
      skillName: "基本文型（SVO・SVOO・SVOC）",
      skillLevel: 1,
      toeicParts: [5, 6, 7],
      bonusEffects: [
        {
          partNumber: 5,
          effectType: "xp_multiplier",
          effectValue: 1.6,
          condition: "文型問題で正解時",
        },
        {
          partNumber: 6,
          effectType: "accuracy_boost",
          effectValue: 1.3,
          condition: "文型応用問題で正解率向上",
        },
        {
          partNumber: 7,
          effectType: "time_extension",
          effectValue: 10,
          condition: "文型読解問題で時間延長",
        },
      ],
      prerequisites: ["sv-basic"],
      unlocksAdvancedQuestions: true,
    },
    {
      skillId: "pronouns",
      skillName: "代名詞の完全理解",
      skillLevel: 1,
      toeicParts: [5, 6],
      bonusEffects: [
        {
          partNumber: 5,
          effectType: "xp_multiplier",
          effectValue: 1.4,
          condition: "代名詞問題で正解時",
        },
        {
          partNumber: 6,
          effectType: "hint_unlock",
          effectValue: 1,
          condition: "代名詞問題でヒント表示",
        },
      ],
      prerequisites: ["parts-of-speech"],
      unlocksAdvancedQuestions: false,
    },
    {
      skillId: "present-simple",
      skillName: "現在形のマスター",
      skillLevel: 2,
      toeicParts: [2, 5, 6],
      bonusEffects: [
        {
          partNumber: 2,
          effectType: "xp_multiplier",
          effectValue: 1.3,
          condition: "現在形応答問題で正解時",
        },
        {
          partNumber: 5,
          effectType: "accuracy_boost",
          effectValue: 1.2,
          condition: "現在形問題で正解率向上",
        },
        {
          partNumber: 6,
          effectType: "time_extension",
          effectValue: 8,
          condition: "現在形長文問題で時間延長",
        },
      ],
      prerequisites: ["sv-basic"],
      unlocksAdvancedQuestions: true,
    },
    {
      skillId: "past-simple",
      skillName: "過去形のマスター",
      skillLevel: 2,
      toeicParts: [2, 5, 6],
      bonusEffects: [
        {
          partNumber: 2,
          effectType: "xp_multiplier",
          effectValue: 1.35,
          condition: "過去形応答問題で正解時",
        },
        {
          partNumber: 5,
          effectType: "accuracy_boost",
          effectValue: 1.25,
          condition: "過去形問題で正解率向上",
        },
        {
          partNumber: 6,
          effectType: "time_extension",
          effectValue: 10,
          condition: "過去形長文問題で時間延長",
        },
      ],
      prerequisites: ["present-simple"],
      unlocksAdvancedQuestions: true,
    },
    {
      skillId: "future-simple",
      skillName: "未来形のマスター",
      skillLevel: 2,
      toeicParts: [2, 5, 6],
      bonusEffects: [
        {
          partNumber: 2,
          effectType: "xp_multiplier",
          effectValue: 1.4,
          condition: "未来形応答問題で正解時",
        },
        {
          partNumber: 5,
          effectType: "accuracy_boost",
          effectValue: 1.3,
          condition: "未来形問題で正解率向上",
        },
        {
          partNumber: 6,
          effectType: "hint_unlock",
          effectValue: 1,
          condition: "未来形問題でヒント表示",
        },
      ],
      prerequisites: ["past-simple"],
      unlocksAdvancedQuestions: true,
    },
    {
      skillId: "present-perfect",
      skillName: "現在完了形のマスター",
      skillLevel: 3,
      toeicParts: [2, 5, 6, 7],
      bonusEffects: [
        {
          partNumber: 2,
          effectType: "xp_multiplier",
          effectValue: 1.6,
          condition: "現在完了形応答問題で正解時",
        },
        {
          partNumber: 5,
          effectType: "accuracy_boost",
          effectValue: 1.4,
          condition: "現在完了形問題で正解率向上",
        },
        {
          partNumber: 6,
          effectType: "time_extension",
          effectValue: 12,
          condition: "現在完了形長文問題で時間延長",
        },
        {
          partNumber: 7,
          effectType: "accuracy_boost",
          effectValue: 1.2,
          condition: "現在完了形読解問題で正解率向上",
        },
      ],
      prerequisites: ["future-simple"],
      unlocksAdvancedQuestions: true,
    },
  ];

  /**
   * ユーザーのスキルツリー進捗をTOEIC用に取得
   */
  static getSkillTreeProgressForTOEIC(
    userId: string = "default"
  ): SkillTreeProgressForTOEIC {
    // スキルツリーの進捗を取得（モックデータ）
    const unlockedSkills = this.getUnlockedSkills(userId);

    const skillProgress = unlockedSkills.map((skillId) => {
      const skill = GRAMMAR_SKILL_TREE.find((s) => s.id === skillId);
      return {
        skillId,
        masteryLevel: Math.floor(Math.random() * 100) + 50, // モックデータ
        completedProblems: Math.floor(Math.random() * 50) + 10,
        averageScore: Math.floor(Math.random() * 40) + 60,
        lastStudied: new Date(),
      };
    });

    const availableBonuses = this.calculateAvailableBonuses(unlockedSkills);
    const nextRecommendedSkills = this.getNextRecommendedSkills(unlockedSkills);
    const skillTreeLevel = this.calculateSkillTreeLevel(skillProgress);

    return {
      unlockedSkills,
      skillProgress,
      availableBonuses,
      nextRecommendedSkills,
      skillTreeLevel,
    };
  }

  /**
   * 解放されたスキルを取得（モック実装）
   */
  private static getUnlockedSkills(userId: string): string[] {
    // 実際の実装では、スキルツリーマネージャーから取得
    return [
      "parts-of-speech",
      "word-order",
      "articles",
      "sv-basic",
      "pronouns",
      "present-simple",
      "past-simple",
    ];
  }

  /**
   * 完了したスキルに基づく利用可能なボーナスを計算
   */
  static calculateAvailableBonuses(unlockedSkills: string[]): SkillBonus[] {
    const bonuses: SkillBonus[] = [];

    for (const skillId of unlockedSkills) {
      const mapping = this.SKILL_TOEIC_MAPPINGS.find(
        (m) => m.skillId === skillId
      );
      if (mapping) {
        // 前提条件を満たしているかチェック
        const prerequisitesMet =
          !mapping.prerequisites ||
          mapping.prerequisites.every((prereq) =>
            unlockedSkills.includes(prereq)
          );

        if (prerequisitesMet) {
          bonuses.push(mapping);
        }
      }
    }

    return bonuses;
  }

  /**
   * 次の推奨スキルを取得
   */
  static getNextRecommendedSkills(unlockedSkills: string[]): string[] {
    const recommendations: string[] = [];

    for (const mapping of this.SKILL_TOEIC_MAPPINGS) {
      // まだ解放されていないスキル
      if (!unlockedSkills.includes(mapping.skillId)) {
        // 前提条件を満たしているかチェック
        const prerequisitesMet =
          !mapping.prerequisites ||
          mapping.prerequisites.every((prereq) =>
            unlockedSkills.includes(prereq)
          );

        if (prerequisitesMet) {
          recommendations.push(mapping.skillId);
        }
      }
    }

    return recommendations.slice(0, 3); // 最大3つまで推奨
  }

  /**
   * スキルツリーレベルを計算
   */
  private static calculateSkillTreeLevel(skillProgress: any[]): number {
    if (skillProgress.length === 0) return 0;

    const totalMastery = skillProgress.reduce(
      (sum, skill) => sum + skill.masteryLevel,
      0
    );
    const averageMastery = totalMastery / skillProgress.length;

    return Math.floor(averageMastery / 20); // 20%ごとにレベルアップ
  }

  /**
   * TOEIC問題にスキルブーストを適用
   */
  static applySkillBoostToQuestion(
    question: TOEICQuestion,
    unlockedSkills: string[]
  ): TOEICQuestionWithSkillBoost {
    const questionWithBoost = { ...question } as TOEICQuestionWithSkillBoost;

    // 該当するスキルを探す
    for (const skillId of unlockedSkills) {
      const mapping = this.SKILL_TOEIC_MAPPINGS.find(
        (m) => m.skillId === skillId
      );
      if (mapping && mapping.toeicParts.includes(question.part)) {
        const relevantEffect = mapping.bonusEffects.find(
          (effect) => effect.partNumber === question.part
        );

        if (relevantEffect) {
          questionWithBoost.skillBoost = {
            skillId,
            boostType: relevantEffect.effectType,
            boostValue: relevantEffect.effectValue,
            isActive: true,
            skillLevel: mapping.skillLevel,
          };
          break; // 最初に見つかった効果を適用
        }
      }
    }

    return questionWithBoost;
  }

  /**
   * スキルブーストに基づくXP計算
   */
  static calculateBoostedXP(
    baseXP: number,
    question: TOEICQuestionWithSkillBoost,
    isCorrect: boolean
  ): number {
    if (!isCorrect || !question.skillBoost?.isActive) {
      return baseXP;
    }

    const boost = question.skillBoost;
    switch (boost.boostType) {
      case "xp_multiplier":
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
    data: SkillTreeTOEICIntegration
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
  ): SkillTreeTOEICIntegration | null {
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
    const progress = this.getSkillTreeProgressForTOEIC(userId);
    const bonuses = progress.availableBonuses;

    const statistics = {
      totalSkillsUnlocked: progress.unlockedSkills.length,
      totalBonusesActive: bonuses.length,
      averageSkillLevel: this.calculateAverageSkillLevel(
        progress.skillProgress
      ),
      mostEffectiveSkill: this.findMostEffectiveSkill(progress.unlockedSkills),
    };

    const integrationData: SkillTreeTOEICIntegration = {
      userId,
      unlockedSkills: progress.unlockedSkills,
      skillBasedQuestions: [], // TODO: 実装
      skillBonuses: bonuses,
      lastUpdated: new Date(),
      statistics,
    };

    this.saveIntegrationData(userId, integrationData);
  }

  /**
   * 平均スキルレベルを計算
   */
  private static calculateAverageSkillLevel(skillProgress: any[]): number {
    if (skillProgress.length === 0) return 0;
    const totalLevel = skillProgress.reduce(
      (sum, skill) => sum + skill.masteryLevel,
      0
    );
    return totalLevel / skillProgress.length;
  }

  /**
   * 最も効果的なスキルを特定
   */
  private static findMostEffectiveSkill(unlockedSkills: string[]): string {
    let mostEffective = "";
    let maxEffects = 0;

    for (const skillId of unlockedSkills) {
      const mapping = this.SKILL_TOEIC_MAPPINGS.find(
        (m) => m.skillId === skillId
      );
      if (mapping && mapping.bonusEffects.length > maxEffects) {
        mostEffective = mapping.skillName;
        maxEffects = mapping.bonusEffects.length;
      }
    }

    return mostEffective;
  }
}
