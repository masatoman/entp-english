import {
  ChallengeCompletion,
  ChallengeRewards,
  LearningPathChallenge,
  LearningPathRecommendation,
} from "../types/learningPathChallenge";
import { GachaSystem } from "./gachaSystem";
import { PreStudyProgressManager } from "./preStudyProgressManager";

/**
 * 学習パス連動チャレンジ管理システム
 * 最適な学習パスに基づいて段階的なチャレンジを提供
 */
export class LearningPathChallengeManager {
  private static readonly CHALLENGE_KEY = "entp-learning-path-challenges";

  // 事前定義されたチャレンジ
  private static readonly PREDEFINED_CHALLENGES: LearningPathChallenge[] = [
    {
      challengeId: "grammar-mastery-path",
      challengeName: "文法マスターパス",
      description: "文法の基礎から応用まで段階的にマスターする",
      challengeType: "progressive",
      difficulty: "beginner",
      learningPath: [
        {
          stepId: "basic-grammar-theory",
          stepName: "基本文型理論",
          description: "SVOの基本構造を理解する",
          stepType: "prestudy",
          targetValue: 1,
          currentValue: 0,
          isCompleted: false,
          estimatedTime: 15,
          prerequisites: [],
          unlocks: ["tenses-theory-part1"],
          rewards: { xp: 100, coins: 50, progressBonus: 10 },
        },
        {
          stepId: "tenses-theory-part1",
          stepName: "時制理論（基礎）",
          description: "基本時制を理解する",
          stepType: "prestudy",
          targetValue: 1,
          currentValue: 0,
          isCompleted: false,
          estimatedTime: 20,
          prerequisites: ["basic-grammar-theory"],
          unlocks: ["tenses-skill-tree"],
          rewards: { xp: 150, coins: 75, progressBonus: 15 },
        },
        {
          stepId: "tenses-skill-tree",
          stepName: "時制スキルツリー",
          description: "時制のスキルツリーノードを習得する",
          stepType: "skill_tree",
          targetValue: 1,
          currentValue: 0,
          isCompleted: false,
          estimatedTime: 25,
          prerequisites: ["tenses-theory-part1"],
          unlocks: ["grammar-quiz-practice"],
          rewards: { xp: 200, coins: 100, progressBonus: 20 },
        },
        {
          stepId: "grammar-quiz-practice",
          stepName: "文法クイズ練習",
          description: "時制に関する文法クイズに挑戦する",
          stepType: "grammar",
          targetValue: 10,
          currentValue: 0,
          isCompleted: false,
          estimatedTime: 30,
          prerequisites: ["tenses-skill-tree"],
          unlocks: ["toeic-part5-practice"],
          rewards: { xp: 300, coins: 150, progressBonus: 25 },
        },
        {
          stepId: "toeic-part5-practice",
          stepName: "TOEIC Part 5練習",
          description: "時制に関するTOEIC Part 5問題に挑戦する",
          stepType: "toeic",
          targetValue: 20,
          currentValue: 0,
          isCompleted: false,
          estimatedTime: 40,
          prerequisites: ["grammar-quiz-practice"],
          unlocks: [],
          rewards: { xp: 500, coins: 250, progressBonus: 30 },
        },
      ],
      requirements: {
        minimumLevel: 1,
        requiredSystems: ["prestudy", "skill_tree", "grammar_quiz"],
        prerequisiteChallenges: [],
        attemptsAllowed: 3,
        difficultyProgression: "linear",
      },
      rewards: {
        xp: 1000,
        coins: 500,
        hearts: 10,
        title: "文法マスター",
        badge: "grammar-master",
        unlocks: ["advanced-grammar-challenges"],
        specialEffects: [
          {
            type: "grammar_accuracy_boost",
            value: 1.2,
            description: "文法問題の正答率が20%向上",
          },
        ],
      },
      isActive: false,
      isCompleted: false,
      currentStep: 0,
      progress: {
        overallProgress: 0,
        stepProgress: {},
        timeSpent: 0,
        attemptsUsed: 0,
        currentStreak: 0,
        bestScore: 0,
        averageScore: 0,
        improvementRate: 0,
      },
    },
    {
      challengeId: "vocabulary-synergy-path",
      challengeName: "語彙シナジーパス",
      description: "ガチャとリスニングを組み合わせた語彙強化パス",
      challengeType: "synergy",
      difficulty: "intermediate",
      learningPath: [
        {
          stepId: "gacha-vocabulary-collection",
          stepName: "ガチャ語彙収集",
          description: "ガチャで語彙カードを50枚収集する",
          stepType: "vocabulary",
          targetValue: 50,
          currentValue: 0,
          isCompleted: false,
          estimatedTime: 60,
          prerequisites: [],
          unlocks: ["listening-vocabulary-practice"],
          rewards: { xp: 200, coins: 100, progressBonus: 15 },
        },
        {
          stepId: "listening-vocabulary-practice",
          stepName: "リスニング語彙練習",
          description: "収集した語彙でリスニング練習を行う",
          stepType: "listening",
          targetValue: 10,
          currentValue: 0,
          isCompleted: false,
          estimatedTime: 45,
          prerequisites: ["gacha-vocabulary-collection"],
          unlocks: ["synergy-challenge"],
          rewards: { xp: 300, coins: 150, progressBonus: 20 },
        },
        {
          stepId: "synergy-challenge",
          stepName: "シナジーチャレンジ",
          description: "語彙とリスニングのシナジー効果を活用したチャレンジ",
          stepType: "synergy",
          targetValue: 1,
          currentValue: 0,
          isCompleted: false,
          estimatedTime: 30,
          prerequisites: ["listening-vocabulary-practice"],
          unlocks: [],
          rewards: { xp: 500, coins: 250, progressBonus: 25 },
        },
      ],
      requirements: {
        minimumLevel: 3,
        requiredSystems: ["gacha", "listening", "synergy"],
        prerequisiteChallenges: ["grammar-mastery-path"],
        attemptsAllowed: 5,
        difficultyProgression: "exponential",
      },
      rewards: {
        xp: 1500,
        coins: 750,
        hearts: 15,
        title: "語彙シナジーマスター",
        badge: "vocabulary-synergy-master",
        unlocks: ["advanced-synergy-challenges"],
        specialEffects: [
          {
            type: "vocabulary_synergy_boost",
            value: 1.3,
            description: "語彙関連問題でシナジー効果30%向上",
          },
        ],
      },
      isActive: false,
      isCompleted: false,
      currentStep: 0,
      progress: {
        overallProgress: 0,
        stepProgress: {},
        timeSpent: 0,
        attemptsUsed: 0,
        currentStreak: 0,
        bestScore: 0,
        averageScore: 0,
        improvementRate: 0,
      },
    },
    {
      challengeId: "toeic-comprehensive-path",
      challengeName: "TOEIC総合パス",
      description: "TOEIC全パートを網羅した総合的な学習パス",
      challengeType: "mastery",
      difficulty: "advanced",
      learningPath: [
        {
          stepId: "toeic-part1-2-mastery",
          stepName: "TOEIC Part 1-2 マスター",
          description: "リスニング Part 1-2をマスターする",
          stepType: "listening",
          targetValue: 50,
          currentValue: 0,
          isCompleted: false,
          estimatedTime: 60,
          prerequisites: [],
          unlocks: ["toeic-part3-4-mastery"],
          rewards: { xp: 400, coins: 200, progressBonus: 20 },
        },
        {
          stepId: "toeic-part3-4-mastery",
          stepName: "TOEIC Part 3-4 マスター",
          description: "リスニング Part 3-4をマスターする",
          stepType: "listening",
          targetValue: 50,
          currentValue: 0,
          isCompleted: false,
          estimatedTime: 75,
          prerequisites: ["toeic-part1-2-mastery"],
          unlocks: ["toeic-part5-6-mastery"],
          rewards: { xp: 500, coins: 250, progressBonus: 25 },
        },
        {
          stepId: "toeic-part5-6-mastery",
          stepName: "TOEIC Part 5-6 マスター",
          description: "リーディング Part 5-6をマスターする",
          stepType: "grammar",
          targetValue: 100,
          currentValue: 0,
          isCompleted: false,
          estimatedTime: 90,
          prerequisites: ["toeic-part3-4-mastery"],
          unlocks: ["toeic-part7-mastery"],
          rewards: { xp: 600, coins: 300, progressBonus: 30 },
        },
        {
          stepId: "toeic-part7-mastery",
          stepName: "TOEIC Part 7 マスター",
          description: "リーディング Part 7をマスターする",
          stepType: "reading",
          targetValue: 100,
          currentValue: 0,
          isCompleted: false,
          estimatedTime: 120,
          prerequisites: ["toeic-part5-6-mastery"],
          unlocks: ["toeic-full-test"],
          rewards: { xp: 800, coins: 400, progressBonus: 35 },
        },
        {
          stepId: "toeic-full-test",
          stepName: "TOEIC フルテスト",
          description: "全パートを含むフルテストに挑戦する",
          stepType: "toeic",
          targetValue: 1,
          currentValue: 0,
          isCompleted: false,
          estimatedTime: 120,
          prerequisites: ["toeic-part7-mastery"],
          unlocks: [],
          rewards: { xp: 1000, coins: 500, progressBonus: 40 },
        },
      ],
      requirements: {
        minimumLevel: 5,
        requiredSystems: ["toeic", "listening", "reading", "grammar"],
        prerequisiteChallenges: [
          "grammar-mastery-path",
          "vocabulary-synergy-path",
        ],
        attemptsAllowed: 2,
        difficultyProgression: "adaptive",
      },
      rewards: {
        xp: 3000,
        coins: 1500,
        hearts: 25,
        title: "TOEIC総合マスター",
        badge: "toeic-comprehensive-master",
        unlocks: ["expert-level-challenges"],
        specialEffects: [
          {
            type: "toeic_comprehensive_boost",
            value: 1.5,
            description: "TOEIC全パートで正答率50%向上",
          },
        ],
      },
      isActive: false,
      isCompleted: false,
      currentStep: 0,
      progress: {
        overallProgress: 0,
        stepProgress: {},
        timeSpent: 0,
        attemptsUsed: 0,
        currentStreak: 0,
        bestScore: 0,
        averageScore: 0,
        improvementRate: 0,
      },
    },
  ];

  /**
   * ユーザーの学習パスチャレンジ進捗を取得
   */
  static getUserChallengeProgress(
    _userId: string = "default"
  ): LearningPathChallenge[] {
    const stored = localStorage.getItem(`${this.CHALLENGE_KEY}-${_userId}`);
    let challenges: LearningPathChallenge[] = stored
      ? JSON.parse(stored)
      : [...this.PREDEFINED_CHALLENGES];

    // 進捗を更新
    challenges = challenges.map((challenge) =>
      this.updateChallengeProgress(challenge, _userId)
    );

    this.saveUserChallengeProgress(_userId, challenges);
    return challenges;
  }

  /**
   * チャレンジ進捗を更新
   */
  private static updateChallengeProgress(
    challenge: LearningPathChallenge,
    _userId: string
  ): LearningPathChallenge {
    const updatedChallenge = { ...challenge };

    // 各ステップの進捗を更新
    updatedChallenge.learningPath = updatedChallenge.learningPath.map(
      (step) => {
        const updatedStep = { ...step };

        switch (step.stepType) {
          case "prestudy":
            const completedPrestudy =
              PreStudyProgressManager.getCompletedContents();
            updatedStep.currentValue = completedPrestudy.includes(step.stepId)
              ? 1
              : 0;
            updatedStep.isCompleted =
              updatedStep.currentValue >= updatedStep.targetValue;
            break;

          case "skill_tree":
            // スキルツリー進捗の取得（仮実装）
            updatedStep.currentValue = 0;
            updatedStep.isCompleted = false;
            break;

          case "vocabulary":
            const gachaData = GachaSystem.getUserGachaData();
            updatedStep.currentValue = gachaData
              ? Object.keys(gachaData.collection).length
              : 0;
            updatedStep.isCompleted =
              updatedStep.currentValue >= updatedStep.targetValue;
            break;

          case "listening":
            // リスニング進捗の取得（仮実装）
            updatedStep.currentValue = 0;
            updatedStep.isCompleted = false;
            break;

          case "grammar":
            // 文法クイズの進捗を取得（仮実装）
            updatedStep.currentValue = 0;
            updatedStep.isCompleted = false;
            break;

          case "toeic":
            // TOEIC結果の取得（仮実装）
            updatedStep.currentValue = 0;
            updatedStep.isCompleted = false;
            break;

          case "synergy":
            // シナジー進捗の取得（仮実装）
            updatedStep.currentValue = 0;
            updatedStep.isCompleted = false;
            break;
        }

        return updatedStep;
      }
    );

    // 全体の進捗を計算
    const completedSteps = updatedChallenge.learningPath.filter(
      (step) => step.isCompleted
    ).length;
    const totalSteps = updatedChallenge.learningPath.length;
    updatedChallenge.progress.overallProgress =
      (completedSteps / totalSteps) * 100;

    // チャレンジ完了チェック
    updatedChallenge.isCompleted = completedSteps === totalSteps;

    return updatedChallenge;
  }

  /**
   * チャレンジを開始
   */
  static startChallenge(userId: string, challengeId: string): boolean {
    const challenges = this.getUserChallengeProgress(userId);
    const challenge = challenges.find((c) => c.challengeId === challengeId);

    if (!challenge) return false;
    if (challenge.isCompleted) return false;
    if (challenge.isActive) return false;

    // 前提条件をチェック
    if (!this.checkChallengeRequirements(challenge, userId)) return false;

    challenge.isActive = true;
    challenge.startedAt = new Date();
    challenge.progress.attemptsUsed++;

    this.saveUserChallengeProgress(userId, challenges);
    return true;
  }

  /**
   * チャレンジの前提条件をチェック
   */
  private static checkChallengeRequirements(
    challenge: LearningPathChallenge,
    _userId: string
  ): boolean {
    // レベルチェック（仮実装）
    // const userLevel = 1; // DataManager.getUserLevel(userId);
    const userLevel = 1; // モック実装
    if (userLevel < challenge.requirements.minimumLevel) return false;

    // 前提チャレンジチェック
    const challenges = this.getUserChallengeProgress(_userId);
    for (const prereqId of challenge.requirements.prerequisiteChallenges) {
      const prereqChallenge = challenges.find(
        (c) => c.challengeId === prereqId
      );
      if (!prereqChallenge || !prereqChallenge.isCompleted) return false;
    }

    // 試行回数チェック
    if (
      challenge.progress.attemptsUsed >= challenge.requirements.attemptsAllowed
    )
      return false;

    return true;
  }

  /**
   * チャレンジを完了
   */
  static completeChallenge(
    _userId: string,
    challengeId: string,
    finalScore: number
  ): ChallengeCompletion | null {
    const challenges = this.getUserChallengeProgress(_userId);
    const challenge = challenges.find((c) => c.challengeId === challengeId);

    if (!challenge || !challenge.isActive || !challenge.isCompleted)
      return null;

    const completion: ChallengeCompletion = {
      challengeId,
      completedAt: new Date(),
      finalScore,
      timeSpent: challenge.progress.timeSpent,
      rewardsEarned: challenge.rewards,
      performanceMetrics: {
        accuracy: finalScore,
        speed: challenge.progress.timeSpent / challenge.learningPath.length,
        consistency: challenge.progress.currentStreak,
        improvement: challenge.progress.improvementRate,
      },
      feedback: this.generateChallengeFeedback(challenge, finalScore),
      nextRecommendations: this.generateNextRecommendations(challenge, _userId),
    };

    // 報酬を付与
    this.grantChallengeRewards(_userId, challenge.rewards);

    // チャレンジを非アクティブ化
    challenge.isActive = false;
    challenge.completedAt = new Date();

    this.saveUserChallengeProgress(_userId, challenges);
    return completion;
  }

  /**
   * チャレンジ報酬を付与
   */
  private static grantChallengeRewards(
    _userId: string,
    rewards: ChallengeRewards
  ): void {
    // XP付与（仮実装）
    console.log(`XP付与: ${rewards.xp}`);

    // コイン付与（仮実装）
    console.log(`コイン付与: ${rewards.coins}`);

    // ハート付与（仮実装）
    console.log(`ハート付与: ${rewards.hearts}`);

    // 特別効果を適用
    if (rewards.specialEffects) {
      for (const _effect of rewards.specialEffects) {
        this.applySpecialEffect(_userId);
      }
    }
  }

  /**
   * 特別効果を適用
   */
  private static applySpecialEffect(effect: any): void {
    // 特別効果の適用ロジック（仮実装）
    console.log(`特別効果適用: ${effect.type} - ${effect.description}`);
  }

  /**
   * チャレンジフィードバックを生成
   */
  private static generateChallengeFeedback(
    challenge: LearningPathChallenge,
    finalScore: number
  ): string {
    if (finalScore >= 90) {
      return `素晴らしい！${challenge.challengeName}を完璧にマスターしました。`;
    } else if (finalScore >= 80) {
      return `優秀です！${challenge.challengeName}をほぼマスターしました。`;
    } else if (finalScore >= 70) {
      return `良好です！${challenge.challengeName}をマスターしました。`;
    } else {
      return `${challenge.challengeName}を完了しました。さらなる向上を目指しましょう。`;
    }
  }

  /**
   * 次の推奨チャレンジを生成
   */
  private static generateNextRecommendations(
    challenge: LearningPathChallenge,
    _userId: string
  ): string[] {
    const recommendations: string[] = [];

    if (challenge.rewards.unlocks) {
      recommendations.push(...challenge.rewards.unlocks);
    }

    // ユーザーの進捗に基づく推奨
    // const userLevel = DataManager.getUserLevel(userId);
    // if (userLevel >= 5) {
    //   recommendations.push("expert-level-challenges");
    // }

    return recommendations;
  }

  /**
   * 学習パス推奨を生成
   */
  static generateLearningPathRecommendation(
    _userId: string
  ): LearningPathRecommendation {
    // const userLevel = 1; // DataManager.getUserLevel(userId);
    const challenges = this.getUserChallengeProgress(_userId);
    const completedChallenges = challenges.filter((c) => c.isCompleted);

    let recommendedPath = "grammar-mastery-path";
    let reason = "文法の基礎から始めることをお勧めします";
    let priority: "high" | "medium" | "low" = "high";

    if (completedChallenges.length === 0) {
      recommendedPath = "grammar-mastery-path";
      reason = "初回学習者には文法マスターパスが最適です";
    } else if (
      completedChallenges.some((c) => c.challengeId === "grammar-mastery-path")
    ) {
      recommendedPath = "vocabulary-synergy-path";
      reason =
        "文法をマスターしたので、語彙シナジーパスに進むことをお勧めします";
      priority = "medium";
    } else if (
      completedChallenges.some(
        (c) => c.challengeId === "vocabulary-synergy-path"
      )
    ) {
      recommendedPath = "toeic-comprehensive-path";
      reason = "基礎を固めたので、TOEIC総合パスに挑戦することをお勧めします";
      priority = "medium";
    }

    return {
      userId: _userId,
      recommendedPath,
      reason,
      expectedBenefit: "学習効率の向上と包括的なスキル習得",
      estimatedTime: 120,
      difficulty: "intermediate",
      prerequisites: [],
      alternatives: [],
      priority,
    };
  }

  /**
   * ユーザーのチャレンジ進捗を保存
   */
  private static saveUserChallengeProgress(
    _userId: string,
    challenges: LearningPathChallenge[]
  ): void {
    localStorage.setItem(
      `${this.CHALLENGE_KEY}-${_userId}`,
      JSON.stringify(challenges)
    );
  }

  /**
   * チャレンジ統計を取得
   */
  static getChallengeStatistics(userId: string): any {
    const challenges = this.getUserChallengeProgress(userId);
    const completedChallenges = challenges.filter((c) => c.isCompleted);
    const activeChallenges = challenges.filter((c) => c.isActive);

    return {
      totalChallenges: challenges.length,
      completedChallenges: completedChallenges.length,
      activeChallenges: activeChallenges.length,
      completionRate: (completedChallenges.length / challenges.length) * 100,
      totalXP: completedChallenges.reduce((sum, c) => sum + c.rewards.xp, 0),
      totalCoins: completedChallenges.reduce(
        (sum, c) => sum + c.rewards.coins,
        0
      ),
      averageScore:
        completedChallenges.reduce(
          (sum, c) => sum + c.progress.averageScore,
          0
        ) / completedChallenges.length || 0,
    };
  }
}
