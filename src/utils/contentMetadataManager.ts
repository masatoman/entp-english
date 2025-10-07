import { Category } from "../types";

/**
 * 統一コンテンツメタデータ管理システム
 * 事前学習と文法クイズのシナジー効果を最大化
 */

export interface ContentMetadata {
  id: string;
  category: Category;
  subcategory?: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  relatedContent: string[];
  learningObjectives: string[];
  tags: string[];
  estimatedTime: number; // 分
  synergyBonus: number; // シナジー効果の数値（1.0 = 100%）
  contentType: 'theory' | 'practice' | 'application' | 'assessment';
}

export interface ContentRelationship {
  preStudyId: string;
  grammarQuizCategories: Category[];
  synergyType: 'prerequisite' | 'reinforcement' | 'application';
  strengthMultiplier: number;
  description: string;
}

export interface SynergyProgress {
  contentId: string;
  completionRate: number;
  synergyBonus: number;
  unlockedContent: string[];
  recommendedNext: string[];
  effectivenessScore: number;
}

export interface LearningPath {
  pathId: string;
  name: string;
  description: string;
  steps: ContentMetadata[];
  estimatedTotalTime: number;
  synergyScore: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
}

/**
 * 統一コンテンツカタログ
 * 全ての学習コンテンツのメタデータを一元管理
 */
export const CONTENT_CATALOG: Record<string, ContentMetadata> = {
  // 基本文型関連
  "basic-grammar-theory": {
    id: "basic-grammar-theory",
    category: "basic-grammar",
    title: "英文の基本構造：SVO完全マスター",
    level: "beginner",
    prerequisites: [],
    relatedContent: ["basic-grammar-quiz-easy", "basic-grammar-quiz-normal"],
    learningObjectives: [
      "5文型の理解",
      "SVO構造の習得",
      "文の要素の識別"
    ],
    tags: ["文型", "基礎", "構造"],
    estimatedTime: 8,
    synergyBonus: 1.2,
    contentType: "theory"
  },
  "basic-grammar-quiz-easy": {
    id: "basic-grammar-quiz-easy",
    category: "basic-grammar",
    title: "基本文型クイズ（簡単）",
    level: "beginner",
    prerequisites: ["basic-grammar-theory"],
    relatedContent: ["basic-grammar-quiz-normal", "basic-grammar-application"],
    learningObjectives: [
      "基本文型の識別",
      "4択問題での理解確認"
    ],
    tags: ["練習", "4択", "基礎"],
    estimatedTime: 10,
    synergyBonus: 1.15,
    contentType: "practice"
  },

  // 時制関連
  "tenses-theory-part1": {
    id: "tenses-theory-part1",
    category: "tenses",
    title: "時制の完全マスター：基礎編",
    level: "beginner",
    prerequisites: ["basic-grammar-theory"],
    relatedContent: ["tenses-theory-part2", "tenses-quiz-easy"],
    learningObjectives: [
      "現在・過去・未来時制の理解",
      "基本的な時制の使い分け"
    ],
    tags: ["時制", "基礎", "現在", "過去", "未来"],
    estimatedTime: 12,
    synergyBonus: 1.25,
    contentType: "theory"
  },
  "tenses-theory-part2": {
    id: "tenses-theory-part2",
    category: "tenses",
    title: "時制の完全マスター：応用編",
    level: "intermediate",
    prerequisites: ["tenses-theory-part1"],
    relatedContent: ["tenses-quiz-normal", "tenses-quiz-hard"],
    learningObjectives: [
      "完了形の理解",
      "進行形の活用",
      "複雑な時制の使い分け"
    ],
    tags: ["時制", "完了形", "進行形", "応用"],
    estimatedTime: 15,
    synergyBonus: 1.3,
    contentType: "theory"
  },

  // 助動詞関連
  "modals-theory": {
    id: "modals-theory",
    category: "modals",
    title: "助動詞の基本",
    level: "intermediate",
    prerequisites: ["basic-grammar-theory", "tenses-theory-part1"],
    relatedContent: ["modals-quiz-easy", "modals-quiz-normal"],
    learningObjectives: [
      "助動詞の基本概念",
      "can/will/should等の使い分け",
      "可能性・意志・義務の表現"
    ],
    tags: ["助動詞", "can", "will", "should"],
    estimatedTime: 10,
    synergyBonus: 1.2,
    contentType: "theory"
  }
};

/**
 * コンテンツ関係性の定義
 */
export const CONTENT_RELATIONSHIPS: ContentRelationship[] = [
  {
    preStudyId: "basic-grammar-theory",
    grammarQuizCategories: ["basic-grammar"],
    synergyType: "prerequisite",
    strengthMultiplier: 1.2,
    description: "基本文型理論は文法クイズの基礎となる"
  },
  {
    preStudyId: "tenses-theory-part1",
    grammarQuizCategories: ["tenses"],
    synergyType: "reinforcement",
    strengthMultiplier: 1.25,
    description: "時制理論Part1は基礎的な時制問題を強化"
  },
  {
    preStudyId: "tenses-theory-part2",
    grammarQuizCategories: ["tenses"],
    synergyType: "application",
    strengthMultiplier: 1.3,
    description: "時制理論Part2は高度な時制問題の応用力を向上"
  },
  {
    preStudyId: "modals-theory",
    grammarQuizCategories: ["modals"],
    synergyType: "prerequisite",
    strengthMultiplier: 1.2,
    description: "助動詞理論は助動詞問題の理解を促進"
  }
];

/**
 * シナジー管理クラス
 */
export class SynergyManager {
  private static instance: SynergyManager;

  static getInstance(): SynergyManager {
    if (!SynergyManager.instance) {
      SynergyManager.instance = new SynergyManager();
    }
    return SynergyManager.instance;
  }

  /**
   * 学習者の進捗に基づいて最適な学習パスを提案
   */
  getOptimalLearningPath(
    targetCategory: Category,
    currentProgress: string[]
  ): LearningPath {
    const relatedContent = this.getRelatedContent(targetCategory);
    const optimizedSteps = this.optimizeSteps(relatedContent, currentProgress);
    
    return {
      pathId: `${targetCategory}-optimal`,
      name: `${CONTENT_CATALOG[`${targetCategory}-theory`]?.title || targetCategory}の最適学習パス`,
      description: "事前学習から実践まで、シナジー効果を最大化する学習順序",
      steps: optimizedSteps,
      estimatedTotalTime: optimizedSteps.reduce((total, step) => total + step.estimatedTime, 0),
      synergyScore: this.calculatePathSynergyScore(optimizedSteps),
      difficulty: this.assessPathDifficulty(optimizedSteps)
    };
  }

  /**
   * シナジー効果を計算
   */
  calculateSynergyBonus(
    completedContent: string[],
    targetContent: string
  ): number {
    const targetMeta = CONTENT_CATALOG[targetContent];
    if (!targetMeta) return 1.0;

    let bonus = 1.0;
    
    // 前提条件の完了によるボーナス
    const completedPrereqs = targetMeta.prerequisites.filter(
      prereq => completedContent.includes(prereq)
    );
    bonus += (completedPrereqs.length / targetMeta.prerequisites.length) * 0.2;

    // 関連コンテンツの完了によるボーナス
    const completedRelated = targetMeta.relatedContent.filter(
      related => completedContent.includes(related)
    );
    bonus += (completedRelated.length / targetMeta.relatedContent.length) * 0.1;

    // ベースシナジーボーナス
    bonus *= targetMeta.synergyBonus;

    return Math.min(bonus, 2.0); // 最大200%
  }

  /**
   * 関連コンテンツを自動提案
   */
  suggestRelatedContent(currentContent: string): ContentMetadata[] {
    const currentMeta = CONTENT_CATALOG[currentContent];
    if (!currentMeta) return [];

    const suggestions: ContentMetadata[] = [];
    
    // 直接関連コンテンツ
    currentMeta.relatedContent.forEach(relatedId => {
      const relatedMeta = CONTENT_CATALOG[relatedId];
      if (relatedMeta) suggestions.push(relatedMeta);
    });

    // 同じカテゴリの次のレベル
    const nextLevelContent = this.findNextLevelContent(currentMeta);
    if (nextLevelContent) suggestions.push(nextLevelContent);

    // タグベースの推薦
    const tagBasedSuggestions = this.findTagBasedSuggestions(currentMeta);
    suggestions.push(...tagBasedSuggestions);

    return this.deduplicateAndSort(suggestions);
  }

  /**
   * シナジー進捗を追跡
   */
  trackSynergyProgress(
    _userId: string,
    completedContent: string[]
  ): SynergyProgress[] {
    const progress: SynergyProgress[] = [];

    Object.values(CONTENT_CATALOG).forEach(content => {
      const synergyBonus = this.calculateSynergyBonus(completedContent, content.id);
      const unlockedContent = this.getUnlockedContent(completedContent, content.id);
      const recommendedNext = this.getRecommendedNext(completedContent, content.id);

      progress.push({
        contentId: content.id,
        completionRate: completedContent.includes(content.id) ? 1.0 : 0.0,
        synergyBonus,
        unlockedContent,
        recommendedNext,
        effectivenessScore: this.calculateEffectivenessScore(content, synergyBonus)
      });
    });

    return progress;
  }

  // プライベートヘルパーメソッド
  private getRelatedContent(category: Category): ContentMetadata[] {
    return Object.values(CONTENT_CATALOG).filter(
      content => content.category === category
    );
  }

  private optimizeSteps(
    content: ContentMetadata[],
    currentProgress: string[]
  ): ContentMetadata[] {
    // 依存関係に基づいてソート
    return content.sort((a, b) => {
      // 前提条件の数で比較（少ない方が先）
      const aPrereqsMet = a.prerequisites.filter(p => currentProgress.includes(p)).length;
      const bPrereqsMet = b.prerequisites.filter(p => currentProgress.includes(p)).length;
      
      if (aPrereqsMet !== bPrereqsMet) {
        return bPrereqsMet - aPrereqsMet; // より多くの前提条件を満たしているものが先
      }
      
      // レベルで比較
      const levelOrder = { beginner: 0, intermediate: 1, advanced: 2 };
      return levelOrder[a.level] - levelOrder[b.level];
    });
  }

  private calculatePathSynergyScore(steps: ContentMetadata[]): number {
    let totalScore = 0;
    const completedInPath: string[] = [];

    steps.forEach(step => {
      totalScore += this.calculateSynergyBonus(completedInPath, step.id);
      completedInPath.push(step.id);
    });

    return totalScore / steps.length;
  }

  private assessPathDifficulty(steps: ContentMetadata[]): 'easy' | 'moderate' | 'challenging' {
    const avgLevel = steps.reduce((sum, step) => {
      const levelValue = { beginner: 1, intermediate: 2, advanced: 3 }[step.level];
      return sum + levelValue;
    }, 0) / steps.length;

    if (avgLevel <= 1.3) return 'easy';
    if (avgLevel <= 2.3) return 'moderate';
    return 'challenging';
  }

  private findNextLevelContent(currentMeta: ContentMetadata): ContentMetadata | null {
    const levelOrder = { beginner: 'intermediate', intermediate: 'advanced', advanced: null };
    const nextLevel = levelOrder[currentMeta.level];
    
    if (!nextLevel) return null;

    return Object.values(CONTENT_CATALOG).find(
      content => 
        content.category === currentMeta.category && 
        content.level === nextLevel
    ) || null;
  }

  private findTagBasedSuggestions(currentMeta: ContentMetadata): ContentMetadata[] {
    return Object.values(CONTENT_CATALOG).filter(content => {
      if (content.id === currentMeta.id) return false;
      return content.tags.some(tag => currentMeta.tags.includes(tag));
    }).slice(0, 3); // 最大3件
  }

  private deduplicateAndSort(suggestions: ContentMetadata[]): ContentMetadata[] {
    const unique = suggestions.filter((content, index, array) => 
      array.findIndex(c => c.id === content.id) === index
    );

    return unique.sort((a, b) => b.synergyBonus - a.synergyBonus);
  }

  private getUnlockedContent(completedContent: string[], targetContentId: string): string[] {
    const targetMeta = CONTENT_CATALOG[targetContentId];
    if (!targetMeta || !completedContent.includes(targetContentId)) return [];

    // このコンテンツを完了することで解放される他のコンテンツ
    return Object.values(CONTENT_CATALOG)
      .filter(content => content.prerequisites.includes(targetContentId))
      .map(content => content.id);
  }

  private getRecommendedNext(completedContent: string[], targetContentId: string): string[] {
    if (!completedContent.includes(targetContentId)) return [];

    const targetMeta = CONTENT_CATALOG[targetContentId];
    if (!targetMeta) return [];

    return targetMeta.relatedContent.filter(
      relatedId => !completedContent.includes(relatedId)
    );
  }

  private calculateEffectivenessScore(content: ContentMetadata, synergyBonus: number): number {
    // 基本効果スコア + シナジーボーナス + 学習目標の数による補正
    const baseScore = 0.7;
    const objectiveBonus = content.learningObjectives.length * 0.05;
    return (baseScore + objectiveBonus) * synergyBonus;
  }
}

// シングルトンインスタンスをエクスポート
export const synergyManager = SynergyManager.getInstance();
