import { UserLevel, HeartSystem, StatusAllocation, Chapter, QuestionRank, SkillField } from '../types';
import { LEVEL_CONFIGS, CHAPTER_INFO, getTotalXPForLevel, getChapterProgress } from '../data/levelConfig';
import { 
  calculateNewLevel, 
  calculateHeartSystem, 
  determineQuestionRank, 
  selectSkillField,
  processHeartRecovery,
  consumeHeart,
  STATUS_TEMPLATES,
  validateStatusAllocation
} from './newXpCalculator';

// ユーザーレベル管理クラス
export class LevelManager {
  private userLevel: UserLevel;
  private heartSystem: HeartSystem;
  private statusAllocation: StatusAllocation;

  constructor(initialXP: number = 0) {
    this.userLevel = calculateNewLevel(initialXP);
    this.heartSystem = calculateHeartSystem(this.userLevel.level);
    this.statusAllocation = { ...STATUS_TEMPLATES.balanced };
  }

  // レベル情報を取得
  getLevel(): UserLevel {
    return { ...this.userLevel };
  }

  // ハートシステムを取得
  getHeartSystem(): HeartSystem {
    return { ...this.heartSystem };
  }

  // ステータス配分を取得
  getStatusAllocation(): StatusAllocation {
    return { ...this.statusAllocation };
  }

  // XPを追加してレベルアップを処理
  addXP(xp: number): { leveledUp: boolean; newLevel?: UserLevel } {
    const oldLevel = this.userLevel.level;
    this.userLevel = calculateNewLevel(this.userLevel.xp + xp);
    
    const leveledUp = this.userLevel.level > oldLevel;
    
    if (leveledUp) {
      // レベルアップ時にハートシステムを更新
      this.heartSystem = calculateHeartSystem(this.userLevel.level);
    }
    
    return {
      leveledUp,
      newLevel: leveledUp ? { ...this.userLevel } : undefined,
    };
  }

  // ハートの回復を処理
  processHeartRecovery(): HeartSystem {
    this.heartSystem = processHeartRecovery(this.heartSystem);
    return { ...this.heartSystem };
  }

  // ハートを消費
  consumeHeart(): boolean {
    const newHeartSystem = consumeHeart(this.heartSystem);
    if (newHeartSystem) {
      this.heartSystem = newHeartSystem;
      return true;
    }
    return false;
  }

  // ステータス配分を更新
  updateStatusAllocation(allocation: StatusAllocation): boolean {
    if (validateStatusAllocation(allocation)) {
      this.statusAllocation = { ...allocation };
      return true;
    }
    return false;
  }

  // ステータステンプレートを適用
  applyStatusTemplate(templateName: keyof typeof STATUS_TEMPLATES): boolean {
    const template = STATUS_TEMPLATES[templateName];
    if (template) {
      this.statusAllocation = { ...template };
      return true;
    }
    return false;
  }

  // 次の問題のランクを決定
  getNextQuestionRank(): QuestionRank {
    return determineQuestionRank(this.userLevel.level);
  }

  // 次の問題のスキルフィールドを決定
  getNextSkillField(): SkillField {
    return selectSkillField(this.statusAllocation);
  }

  // 章の進捗を取得
  getChapterProgress(): { chapter: Chapter; progress: number; chapterInfo: any } {
    const progress = getChapterProgress(this.userLevel.level);
    const chapterInfo = CHAPTER_INFO[this.userLevel.chapter];
    
    return {
      chapter: this.userLevel.chapter,
      progress,
      chapterInfo,
    };
  }

  // レベル設定を取得
  getLevelConfig() {
    return LEVEL_CONFIGS.find(config => config.level === this.userLevel.level);
  }

  // 次のレベルまでの詳細情報
  getNextLevelInfo() {
    const currentConfig = this.getLevelConfig();
    const nextLevelConfig = LEVEL_CONFIGS.find(config => config.level === this.userLevel.level + 1);
    
    if (!nextLevelConfig) {
      return null; // 最大レベル到達
    }
    
    return {
      currentLevel: this.userLevel.level,
      nextLevel: nextLevelConfig.level,
      xpToNext: this.userLevel.xpToNext,
      progress: this.userLevel.progress,
      nextLevelRequiredXP: nextLevelConfig.requiredXP,
      nextLevelMaxHearts: nextLevelConfig.maxHearts,
    };
  }

  // 章の完了状況
  getChapterCompletion() {
    const chapterProgress = this.getChapterProgress();
    const isChapterComplete = chapterProgress.progress >= 100;
    
    return {
      chapter: chapterProgress.chapter,
      progress: chapterProgress.progress,
      isComplete: isChapterComplete,
      chapterInfo: chapterProgress.chapterInfo,
    };
  }

  // 全体的な進捗情報
  getOverallProgress() {
    const chapterProgress = this.getChapterProgress();
    const nextLevelInfo = this.getNextLevelInfo();
    
    return {
      level: this.userLevel.level,
      chapter: this.userLevel.chapter,
      totalXP: this.userLevel.xp,
      chapterProgress: chapterProgress.progress,
      levelProgress: this.userLevel.progress,
      nextLevelInfo,
      heartSystem: this.heartSystem,
    };
  }

  // データを保存用にシリアライズ
  serialize() {
    return {
      userLevel: this.userLevel,
      heartSystem: this.heartSystem,
      statusAllocation: this.statusAllocation,
    };
  }

  // データから復元
  static deserialize(data: {
    userLevel: UserLevel;
    heartSystem: HeartSystem;
    statusAllocation: StatusAllocation;
  }) {
    const xp = data.userLevel?.xp || 0;
    const manager = new LevelManager(xp);
    manager.userLevel = data.userLevel || { level: 1, xp: 0, totalXP: 0 };
    manager.heartSystem = data.heartSystem || { current: 5, max: 5, lastRecoveryTime: Date.now() };
    manager.statusAllocation = data.statusAllocation || {
      listening: 5,
      reading: 5,
      writing: 5,
      grammar: 5,
      idioms: 5,
      vocabulary: 5
    };
    return manager;
  }
}

// グローバルレベルマネージャーインスタンス
let globalLevelManager: LevelManager | null = null;

// レベルマネージャーを取得（シングルトン）
export function getLevelManager(): LevelManager {
  if (!globalLevelManager) {
    // ローカルストレージから復元を試行
    const savedData = localStorage.getItem('entp-english-level-manager');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        globalLevelManager = LevelManager.deserialize(data);
      } catch (error) {
        console.error('Failed to restore level manager:', error);
        globalLevelManager = new LevelManager();
      }
    } else {
      globalLevelManager = new LevelManager();
    }
  }
  return globalLevelManager;
}

// レベルマネージャーを保存
export function saveLevelManager(): void {
  if (globalLevelManager) {
    localStorage.setItem('entp-english-level-manager', JSON.stringify(globalLevelManager.serialize()));
  }
}

// レベルマネージャーをリセット
export function resetLevelManager(): void {
  globalLevelManager = new LevelManager();
  localStorage.removeItem('entp-english-level-manager');
}
