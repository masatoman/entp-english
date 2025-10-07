import {
  ExplosionLevel,
  GrammarProgress,
  PreStudyProgress,
  SkillTreeProgress,
  SpecialUnlock,
  SynergyCalculation,
  SynergyExplosionData,
  VocabularyProgress,
} from "../types/synergyExplosionSystem";
import { PreStudyTOEICIntegrationManager } from "./preStudyTOEICIntegration";
import { SkillTreeTOEICIntegrationManager } from "./skillTreeTOEICIntegration";

/**
 * シナジー効果爆発システム
 * 複数学習モードの完了による累積効果を管理
 */
export class SynergyExplosionSystem {
  private static readonly SYSTEM_KEY = "entp-synergy-explosion-system";

  /**
   * 爆発レベル定義
   */
  private static readonly EXPLOSION_LEVELS: ExplosionLevel[] = [
    {
      level: 1,
      name: "スパーク",
      description: "基本のシナジー効果",
      multiplier: 1.2,
      specialEffects: ["基本XP倍率"],
      nextLevelRequirement: "2つの学習モードで70%完了",
    },
    {
      level: 2,
      name: "フレイム",
      description: "燃えるような学習効果",
      multiplier: 1.5,
      specialEffects: ["XP倍率向上", "精度向上"],
      nextLevelRequirement: "3つの学習モードで80%完了",
    },
    {
      level: 3,
      name: "インフェルノ",
      description: "爆発的な学習効果",
      multiplier: 2.0,
      specialEffects: ["高XP倍率", "時間延長", "ヒント解放"],
      nextLevelRequirement: "4つの学習モードで85%完了",
    },
    {
      level: 4,
      name: "アポカリプス",
      description: "究極の学習効果",
      multiplier: 2.5,
      specialEffects: ["最高XP倍率", "全効果解放", "特別問題"],
      nextLevelRequirement: "全学習モードで90%完了",
    },
    {
      level: 5,
      name: "レジェンダリー",
      description: "伝説の学習効果",
      multiplier: 3.0,
      specialEffects: ["伝説級XP倍率", "全システム統合", "限定コンテンツ"],
      nextLevelRequirement: "完璧な学習マスター",
    },
  ];

  /**
   * 特別解放要素定義
   */
  private static readonly SPECIAL_UNLOCKS: Omit<
    SpecialUnlock,
    "isActive" | "unlockedAt"
  >[] = [
    {
      id: "grammar-vocab-synergy",
      name: "文法×語彙シナジー",
      description: "文法と語彙の学習が相互に強化",
      unlockCondition: "文法クイズ70%完了 + 語彙学習70%完了",
      effect: {
        type: "xp_multiplier",
        value: 1.3,
        description: "文法と語彙問題で30%XP増加",
      },
    },
    {
      id: "prestudy-skill-synergy",
      name: "事前学習×スキルツリーシナジー",
      description: "理論学習と実践スキルの完璧な融合",
      unlockCondition: "事前学習80%完了 + スキルツリー80%完了",
      effect: {
        type: "accuracy_boost",
        value: 1.25,
        description: "全問題で25%正解率向上",
      },
    },
    {
      id: "quad-master",
      name: "四重マスター",
      description: "4つの学習モードをマスターした証",
      unlockCondition: "全学習モードで85%完了",
      effect: {
        type: "time_extension",
        value: 30,
        description: "全問題で30秒時間延長",
      },
    },
    {
      id: "perfect-synergy",
      name: "完璧なシナジー",
      description: "全システムの完璧な統合",
      unlockCondition: "全学習モードで95%完了",
      effect: {
        type: "special_questions",
        value: 1,
        description: "特別な高難易度問題が出現",
      },
    },
    {
      id: "legendary-master",
      name: "伝説のマスター",
      description: "学習の真のマスター",
      unlockCondition: "全学習モードで100%完了",
      effect: {
        type: "bonus_rewards",
        value: 2.0,
        description: "全ての報酬が2倍",
      },
    },
  ];

  /**
   * シナジー爆発データを取得
   */
  static getSynergyExplosionData(
    userId: string = "default"
  ): SynergyExplosionData {
    const grammarProgress = this.getGrammarProgress();
    const vocabularyProgress = this.getVocabularyProgress();
    const preStudyProgress = this.getPreStudyProgress(userId);
    const skillTreeProgress = this.getSkillTreeProgress(userId);

    const calculation = this.calculateSynergy(
      grammarProgress,
      vocabularyProgress,
      preStudyProgress,
      skillTreeProgress
    );
    const explosionLevel = this.determineExplosionLevel(calculation);
    const specialUnlocks = this.getActiveSpecialUnlocks(
      grammarProgress,
      vocabularyProgress,
      preStudyProgress,
      skillTreeProgress
    );

    return {
      userId,
      grammarQuizProgress: grammarProgress,
      vocabularyProgress,
      preStudyProgress,
      skillTreeProgress,
      combinedMultiplier: calculation.totalMultiplier,
      specialUnlocks,
      explosionLevel,
      lastUpdated: new Date(),
    };
  }

  /**
   * 文法クイズ進捗を取得（モック実装）
   */
  private static getGrammarProgress(): GrammarProgress {
    // 実際の実装では、文法クイズマネージャーから取得
    return {
      totalCategories: 9,
      completedCategories: 6,
      averageAccuracy: 78.5,
      totalProblems: 270,
      completedProblems: 180,
      lastStudied: new Date(),
      categoryProgress: [
        {
          category: "basic-grammar",
          completionRate: 85,
          accuracy: 82,
          lastStudied: new Date(),
        },
        {
          category: "tenses",
          completionRate: 75,
          accuracy: 76,
          lastStudied: new Date(),
        },
        {
          category: "modals",
          completionRate: 70,
          accuracy: 74,
          lastStudied: new Date(),
        },
      ],
    };
  }

  /**
   * 語彙学習進捗を取得（モック実装）
   */
  private static getVocabularyProgress(): VocabularyProgress {
    // 実際の実装では、語彙学習マネージャーから取得
    return {
      totalWords: 1000,
      masteredWords: 650,
      totalSessions: 45,
      averageScore: 81.2,
      lastStudied: new Date(),
      categoryProgress: [
        {
          category: "business",
          wordsLearned: 200,
          masteryRate: 85,
          lastStudied: new Date(),
        },
        {
          category: "academic",
          wordsLearned: 180,
          masteryRate: 78,
          lastStudied: new Date(),
        },
        {
          category: "daily",
          wordsLearned: 270,
          masteryRate: 82,
          lastStudied: new Date(),
        },
      ],
    };
  }

  /**
   * 事前学習進捗を取得
   */
  private static getPreStudyProgress(userId: string): PreStudyProgress {
    const preStudyData =
      PreStudyTOEICIntegrationManager.getPreStudyProgressForTOEIC(userId);

    return {
      totalTopics: 20, // 実際のトピック数
      completedTopics: preStudyData.completedTopics.length,
      averageRating: 4.2,
      totalTimeSpent: preStudyData.topicProgress.reduce(
        (sum, topic) => sum + topic.timeSpent,
        0
      ),
      lastStudied: new Date(),
      topicProgress: preStudyData.topicProgress,
    };
  }

  /**
   * スキルツリー進捗を取得
   */
  private static getSkillTreeProgress(userId: string): SkillTreeProgress {
    const skillTreeData =
      SkillTreeTOEICIntegrationManager.getSkillTreeProgressForTOEIC(userId);

    return {
      totalSkills: 50, // 実際のスキル数
      unlockedSkills: skillTreeData.unlockedSkills.length,
      averageMastery:
        skillTreeData.skillProgress.reduce(
          (sum, skill) => sum + skill.masteryLevel,
          0
        ) / skillTreeData.skillProgress.length,
      totalXP: 2500,
      lastStudied: new Date(),
      skillProgress: skillTreeData.skillProgress,
    };
  }

  /**
   * シナジー効果を計算
   */
  private static calculateSynergy(
    grammar: GrammarProgress,
    vocabulary: VocabularyProgress,
    preStudy: PreStudyProgress,
    skillTree: SkillTreeProgress
  ): SynergyCalculation {
    const baseMultiplier = 1.0;

    // 各モードの進捗に基づくボーナス
    const grammarBonus = this.calculateModeBonus(
      grammar.completedCategories,
      grammar.totalCategories,
      grammar.averageAccuracy
    );
    const vocabularyBonus = this.calculateModeBonus(
      vocabulary.masteredWords,
      vocabulary.totalWords,
      vocabulary.averageScore
    );
    const preStudyBonus = this.calculateModeBonus(
      preStudy.completedTopics,
      preStudy.totalTopics,
      preStudy.averageRating * 20
    );
    const skillTreeBonus = this.calculateModeBonus(
      skillTree.unlockedSkills,
      skillTree.totalSkills,
      skillTree.averageMastery
    );

    // 組み合わせボーナス
    const combinationBonus = this.calculateCombinationBonus(
      grammar,
      vocabulary,
      preStudy,
      skillTree
    );

    const totalMultiplier =
      baseMultiplier +
      grammarBonus +
      vocabularyBonus +
      preStudyBonus +
      skillTreeBonus +
      combinationBonus;

    const breakdown = [
      {
        source: "文法クイズ",
        contribution: grammarBonus,
        description: `${grammar.completedCategories}/${grammar.totalCategories}カテゴリー完了`,
      },
      {
        source: "語彙学習",
        contribution: vocabularyBonus,
        description: `${vocabulary.masteredWords}/${vocabulary.totalWords}単語習得`,
      },
      {
        source: "事前学習",
        contribution: preStudyBonus,
        description: `${preStudy.completedTopics}/${preStudy.totalTopics}トピック完了`,
      },
      {
        source: "スキルツリー",
        contribution: skillTreeBonus,
        description: `${skillTree.unlockedSkills}/${skillTree.totalSkills}スキル解放`,
      },
      {
        source: "組み合わせボーナス",
        contribution: combinationBonus,
        description: "複数モードの統合効果",
      },
    ];

    return {
      baseMultiplier,
      grammarBonus,
      vocabularyBonus,
      preStudyBonus,
      skillTreeBonus,
      combinationBonus,
      totalMultiplier,
      breakdown,
    };
  }

  /**
   * 個別モードのボーナスを計算
   */
  private static calculateModeBonus(
    completed: number,
    total: number,
    quality: number
  ): number {
    const completionRate = completed / total;
    const qualityRate = quality / 100;

    // 完了率と品質の両方を考慮
    return (completionRate * 0.6 + qualityRate * 0.4) * 0.5;
  }

  /**
   * 組み合わせボーナスを計算
   */
  private static calculateCombinationBonus(
    grammar: GrammarProgress,
    vocabulary: VocabularyProgress,
    preStudy: PreStudyProgress,
    skillTree: SkillTreeProgress
  ): number {
    let bonus = 0;

    // 2モード組み合わせボーナス
    const grammarVocabRate =
      (grammar.completedCategories / grammar.totalCategories +
        vocabulary.masteredWords / vocabulary.totalWords) /
      2;
    if (grammarVocabRate >= 0.7) bonus += 0.2;

    const preStudySkillRate =
      (preStudy.completedTopics / preStudy.totalTopics +
        skillTree.unlockedSkills / skillTree.totalSkills) /
      2;
    if (preStudySkillRate >= 0.7) bonus += 0.2;

    // 3モード組み合わせボーナス
    const threeModeRate =
      (grammar.completedCategories / grammar.totalCategories +
        vocabulary.masteredWords / vocabulary.totalWords +
        preStudy.completedTopics / preStudy.totalTopics) /
      3;
    if (threeModeRate >= 0.8) bonus += 0.3;

    // 4モード全て組み合わせボーナス
    const allModeRate =
      (grammar.completedCategories / grammar.totalCategories +
        vocabulary.masteredWords / vocabulary.totalWords +
        preStudy.completedTopics / preStudy.totalTopics +
        skillTree.unlockedSkills / skillTree.totalSkills) /
      4;
    if (allModeRate >= 0.9) bonus += 0.5;

    return bonus;
  }

  /**
   * 爆発レベルを決定
   */
  private static determineExplosionLevel(
    calculation: SynergyCalculation
  ): ExplosionLevel {
    const multiplier = calculation.totalMultiplier;

    if (multiplier >= 3.0) return this.EXPLOSION_LEVELS[4]; // レジェンダリー
    if (multiplier >= 2.5) return this.EXPLOSION_LEVELS[3]; // アポカリプス
    if (multiplier >= 2.0) return this.EXPLOSION_LEVELS[2]; // インフェルノ
    if (multiplier >= 1.5) return this.EXPLOSION_LEVELS[1]; // フレイム
    return this.EXPLOSION_LEVELS[0]; // スパーク
  }

  /**
   * アクティブな特別解放を取得
   */
  private static getActiveSpecialUnlocks(
    grammar: GrammarProgress,
    vocabulary: VocabularyProgress,
    preStudy: PreStudyProgress,
    skillTree: SkillTreeProgress
  ): SpecialUnlock[] {
    const unlocks: SpecialUnlock[] = [];

    for (const unlock of this.SPECIAL_UNLOCKS) {
      let isUnlocked = false;

      switch (unlock.id) {
        case "grammar-vocab-synergy":
          isUnlocked =
            grammar.completedCategories / grammar.totalCategories >= 0.7 &&
            vocabulary.masteredWords / vocabulary.totalWords >= 0.7;
          break;
        case "prestudy-skill-synergy":
          isUnlocked =
            preStudy.completedTopics / preStudy.totalTopics >= 0.8 &&
            skillTree.unlockedSkills / skillTree.totalSkills >= 0.8;
          break;
        case "quad-master":
          isUnlocked =
            grammar.completedCategories / grammar.totalCategories >= 0.85 &&
            vocabulary.masteredWords / vocabulary.totalWords >= 0.85 &&
            preStudy.completedTopics / preStudy.totalTopics >= 0.85 &&
            skillTree.unlockedSkills / skillTree.totalSkills >= 0.85;
          break;
        case "perfect-synergy":
          isUnlocked =
            grammar.completedCategories / grammar.totalCategories >= 0.95 &&
            vocabulary.masteredWords / vocabulary.totalWords >= 0.95 &&
            preStudy.completedTopics / preStudy.totalTopics >= 0.95 &&
            skillTree.unlockedSkills / skillTree.totalSkills >= 0.95;
          break;
        case "legendary-master":
          isUnlocked =
            grammar.completedCategories / grammar.totalCategories >= 1.0 &&
            vocabulary.masteredWords / vocabulary.totalWords >= 1.0 &&
            preStudy.completedTopics / preStudy.totalTopics >= 1.0 &&
            skillTree.unlockedSkills / skillTree.totalSkills >= 1.0;
          break;
      }

      if (isUnlocked) {
        unlocks.push({
          ...unlock,
          isActive: true,
          unlockedAt: new Date(),
        });
      }
    }

    return unlocks;
  }

  /**
   * 統合データを保存
   */
  static saveSynergyData(userId: string, data: SynergyExplosionData): void {
    localStorage.setItem(`${this.SYSTEM_KEY}-${userId}`, JSON.stringify(data));
  }

  /**
   * 統合データを読み込み
   */
  static loadSynergyData(
    userId: string = "default"
  ): SynergyExplosionData | null {
    try {
      const stored = localStorage.getItem(`${this.SYSTEM_KEY}-${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("シナジーデータの読み込みエラー:", error);
      return null;
    }
  }

  /**
   * 統計情報を更新
   */
  static updateStatistics(userId: string): void {
    const data = this.getSynergyExplosionData(userId);
    this.saveSynergyData(userId, data);
  }
}
