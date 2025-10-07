import { useCallback, useEffect, useState } from "react";
import { Category } from "../types";
import { 
  synergyManager, 
  SynergyProgress, 
  ContentMetadata 
} from "../utils/contentMetadataManager";

interface SynergyTrackingState {
  completedContent: string[];
  synergyProgress: SynergyProgress[];
  currentBonus: number;
  totalEffectiveness: number;
  isLoading: boolean;
}

interface SynergyTrackingActions {
  markContentCompleted: (contentId: string) => void;
  calculateBonus: (targetContentId: string) => number;
  getSuggestedContent: (currentContentId: string) => ContentMetadata[];
  getOptimalPath: (category: Category) => any;
  resetProgress: () => void;
  exportProgress: () => string;
  importProgress: (data: string) => void;
}

/**
 * シナジー効果追跡フック
 * 学習進捗とシナジー効果を管理
 */
export function useSynergyTracking(userId: string = "default"): [
  SynergyTrackingState,
  SynergyTrackingActions
] {
  const [state, setState] = useState<SynergyTrackingState>({
    completedContent: [],
    synergyProgress: [],
    currentBonus: 1.0,
    totalEffectiveness: 0,
    isLoading: true
  });

  const STORAGE_KEY = `synergy-tracking-${userId}`;

  // 初期化
  useEffect(() => {
    loadProgress();
  }, [userId]);

  const loadProgress = useCallback(() => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const saved = localStorage.getItem(STORAGE_KEY);
      const completedContent = saved ? JSON.parse(saved) : [];
      
      const synergyProgress = synergyManager.trackSynergyProgress(userId, completedContent);
      const totalEffectiveness = calculateTotalEffectiveness(synergyProgress);
      
      setState({
        completedContent,
        synergyProgress,
        currentBonus: 1.0,
        totalEffectiveness,
        isLoading: false
      });
    } catch (error) {
      console.error("シナジー進捗の読み込みに失敗:", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [userId, STORAGE_KEY]);

  const saveProgress = useCallback((completedContent: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedContent));
      
      // 統計も更新
      const stats = {
        lastUpdated: new Date().toISOString(),
        totalCompleted: completedContent.length,
        categories: getCategoryStats(completedContent)
      };
      localStorage.setItem(`${STORAGE_KEY}-stats`, JSON.stringify(stats));
    } catch (error) {
      console.error("シナジー進捗の保存に失敗:", error);
    }
  }, [STORAGE_KEY]);

  const markContentCompleted = useCallback((contentId: string) => {
    setState(prev => {
      if (prev.completedContent.includes(contentId)) {
        return prev; // 既に完了済み
      }

      const newCompleted = [...prev.completedContent, contentId];
      const synergyProgress = synergyManager.trackSynergyProgress(userId, newCompleted);
      const totalEffectiveness = calculateTotalEffectiveness(synergyProgress);

      // 進捗を保存
      saveProgress(newCompleted);

      // シナジーボーナス通知
      const bonus = synergyManager.calculateSynergyBonus(newCompleted, contentId);
      if (bonus > 1.1) {
        showSynergyNotification(contentId, bonus);
      }

      return {
        ...prev,
        completedContent: newCompleted,
        synergyProgress,
        totalEffectiveness,
        currentBonus: bonus
      };
    });
  }, [userId, saveProgress]);

  const calculateBonus = useCallback((targetContentId: string) => {
    return synergyManager.calculateSynergyBonus(state.completedContent, targetContentId);
  }, [state.completedContent]);

  const getSuggestedContent = useCallback((currentContentId: string) => {
    return synergyManager.suggestRelatedContent(currentContentId);
  }, []);

  const getOptimalPath = useCallback((category: Category) => {
    return synergyManager.getOptimalLearningPath(category, state.completedContent);
  }, [state.completedContent]);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(`${STORAGE_KEY}-stats`);
    setState({
      completedContent: [],
      synergyProgress: [],
      currentBonus: 1.0,
      totalEffectiveness: 0,
      isLoading: false
    });
  }, [STORAGE_KEY]);

  const exportProgress = useCallback(() => {
    const exportData = {
      userId,
      completedContent: state.completedContent,
      exportDate: new Date().toISOString(),
      version: "1.0"
    };
    return JSON.stringify(exportData, null, 2);
  }, [userId, state.completedContent]);

  const importProgress = useCallback((data: string) => {
    try {
      const importData = JSON.parse(data);
      if (importData.version === "1.0" && Array.isArray(importData.completedContent)) {
        const completedContent = importData.completedContent;
        const synergyProgress = synergyManager.trackSynergyProgress(userId, completedContent);
        const totalEffectiveness = calculateTotalEffectiveness(synergyProgress);

        setState({
          completedContent,
          synergyProgress,
          currentBonus: 1.0,
          totalEffectiveness,
          isLoading: false
        });

        saveProgress(completedContent);
      } else {
        throw new Error("無効なデータ形式");
      }
    } catch (error) {
      console.error("進捗データのインポートに失敗:", error);
      alert("進捗データのインポートに失敗しました。データ形式を確認してください。");
    }
  }, [userId, saveProgress]);

  // ヘルパー関数
  const calculateTotalEffectiveness = (progress: SynergyProgress[]): number => {
    if (progress.length === 0) return 0;
    return progress.reduce((sum, p) => sum + p.effectivenessScore, 0) / progress.length;
  };

  const getCategoryStats = (completedContent: string[]) => {
    const categories: Record<string, number> = {};
    completedContent.forEach(contentId => {
      const category = contentId.split('-')[0];
      categories[category] = (categories[category] || 0) + 1;
    });
    return categories;
  };

  const showSynergyNotification = (contentId: string, bonus: number) => {
    // 実際のアプリではトースト通知などを使用
    console.log(`🎯 シナジー効果発動！ ${contentId} で ${Math.round((bonus - 1) * 100)}% の学習効果向上！`);
    
    // 簡易通知（実際の実装では適切な通知システムを使用）
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('シナジー効果発動！', {
        body: `${Math.round((bonus - 1) * 100)}% の学習効果向上！`,
        icon: '/icon.svg'
      });
    }
  };

  return [
    state,
    {
      markContentCompleted,
      calculateBonus,
      getSuggestedContent,
      getOptimalPath,
      resetProgress,
      exportProgress,
      importProgress
    }
  ];
}

/**
 * シナジー効果の統計情報を取得するフック
 */
export function useSynergyStats(userId: string = "default") {
  const [stats, setStats] = useState({
    totalSessions: 0,
    averageBonus: 1.0,
    bestCategory: "",
    streakDays: 0,
    totalEffectiveness: 0
  });

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    try {
      const statsData = localStorage.getItem(`synergy-tracking-${userId}-stats`);
      if (statsData) {
        const parsed = JSON.parse(statsData);
        setStats(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error("統計データの読み込みに失敗:", error);
    }
  };

  return stats;
}

/**
 * シナジー効果のリアルタイム監視フック
 */
export function useSynergyMonitoring(targetContentId?: string) {
  const [synergyState, synergyActions] = useSynergyTracking();
  const [realTimeBonus, setRealTimeBonus] = useState(1.0);

  useEffect(() => {
    if (targetContentId) {
      const bonus = synergyActions.calculateBonus(targetContentId);
      setRealTimeBonus(bonus);
    }
  }, [targetContentId, synergyState.completedContent, synergyActions]);

  return {
    currentBonus: realTimeBonus,
    isHighSynergy: realTimeBonus >= 1.2,
    bonusPercentage: Math.round((realTimeBonus - 1) * 100),
    suggestedContent: targetContentId ? synergyActions.getSuggestedContent(targetContentId) : []
  };
}
