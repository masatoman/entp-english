// 学習データ分析とNetlify Functions連携
export interface LearningSession {
  id: string;
  mode: 'vocabulary' | 'grammar' | 'combined' | 'time-attack' | 'tower-defense';
  category: string;
  difficulty: 'easy' | 'normal' | 'hard';
  timestamp: number;
  duration: number; // 秒
  correctAnswers: number;
  totalQuestions: number;
  xpGained: number;
  level: number;
}

export interface LearningAnalytics {
  totalSessions: number;
  totalTime: number; // 分
  averageAccuracy: number; // 0-1
  preferredModes: Record<string, number>;
  difficultyProgression: string[];
  timeSpent: Record<string, number>;
  accuracyByCategory: Record<string, { correct: number; total: number }>;
  engagementLevel: number; // 0-1
  streak: number;
  currentLevel: number;
}

export interface LearningRecommendations {
  type: 'engagement' | 'improvement' | 'challenge';
  message: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}

// 学習セッションを保存
export const saveLearningSession = (session: Omit<LearningSession, 'id' | 'timestamp'>): void => {
  const fullSession: LearningSession = {
    ...session,
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  };

  const sessions = getLearningSessions();
  sessions.push(fullSession);
  
  // 最新100セッションのみ保持
  const recentSessions = sessions.slice(-100);
  localStorage.setItem('learning-sessions', JSON.stringify(recentSessions));
};

// 学習セッションを取得
export const getLearningSessions = (): LearningSession[] => {
  try {
    const saved = localStorage.getItem('learning-sessions');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading learning sessions:', error);
    return [];
  }
};

// 学習データを分析
export const analyzeLearningData = (sessions: LearningSession[]): LearningAnalytics => {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalTime: 0,
      averageAccuracy: 0,
      preferredModes: {},
      difficultyProgression: [],
      timeSpent: {},
      accuracyByCategory: {},
      engagementLevel: 0,
      streak: 0,
      currentLevel: 1,
    };
  }

  const analytics: LearningAnalytics = {
    totalSessions: sessions.length,
    totalTime: Math.round(sessions.reduce((sum, session) => sum + session.duration, 0) / 60),
    averageAccuracy: 0,
    preferredModes: {},
    difficultyProgression: [],
    timeSpent: {},
    accuracyByCategory: {},
    engagementLevel: 0,
    streak: 0,
    currentLevel: 1,
  };

  // 各セッションを分析
  sessions.forEach(session => {
    // 学習モードの好み
    analytics.preferredModes[session.mode] = 
      (analytics.preferredModes[session.mode] || 0) + 1;
    
    // 難易度の進行
    analytics.difficultyProgression.push(session.difficulty);
    
    // 時間分析
    analytics.timeSpent[session.mode] = 
      (analytics.timeSpent[session.mode] || 0) + session.duration;
    
    // カテゴリー別精度
    if (!analytics.accuracyByCategory[session.category]) {
      analytics.accuracyByCategory[session.category] = { correct: 0, total: 0 };
    }
    analytics.accuracyByCategory[session.category].correct += session.correctAnswers;
    analytics.accuracyByCategory[session.category].total += session.totalQuestions;
  });

  // 平均精度計算
  const totalCorrect = sessions.reduce((sum, session) => sum + session.correctAnswers, 0);
  const totalQuestions = sessions.reduce((sum, session) => sum + session.totalQuestions, 0);
  analytics.averageAccuracy = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;

  // エンゲージメントレベル計算
  analytics.engagementLevel = calculateEngagementLevel(sessions);

  // 連続学習日数計算
  analytics.streak = calculateStreak(sessions);

  // 現在のレベル（最新セッションから）
  analytics.currentLevel = sessions.length > 0 ? sessions[sessions.length - 1].level : 1;

  return analytics;
};

// エンゲージメントレベル計算
const calculateEngagementLevel = (sessions: LearningSession[]): number => {
  if (sessions.length === 0) return 0;

  const recentSessions = sessions.slice(-7); // 最近7セッション
  const frequency = recentSessions.length / 7;
  const avgDuration = recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length;
  const avgAccuracy = recentSessions.reduce((sum, s) => sum + (s.correctAnswers / s.totalQuestions), 0) / recentSessions.length;
  
  return Math.min(1, (frequency * 0.4 + (avgDuration / 300) * 0.3 + avgAccuracy * 0.3));
};

// 連続学習日数計算
const calculateStreak = (sessions: LearningSession[]): number => {
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    
    const hasSession = sessions.some(session => {
      const sessionDate = new Date(session.timestamp);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === checkDate.getTime();
    });
    
    if (hasSession) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// 学習提案を生成
export const generateRecommendations = (analytics: LearningAnalytics): LearningRecommendations[] => {
  const recommendations: LearningRecommendations[] = [];

  // エンゲージメントが低い場合
  if (analytics.engagementLevel < 0.7) {
    recommendations.push({
      type: 'engagement',
      message: '新しい学習モードを試してみませんか？',
      suggestion: 'タワーディフェンスゲームで楽しく学習しましょう！',
      priority: 'high',
    });
  }

  // 苦手分野の特定
  Object.entries(analytics.accuracyByCategory).forEach(([category, data]) => {
    const accuracy = data.correct / data.total;
    if (accuracy < 0.6 && data.total >= 5) {
      recommendations.push({
        type: 'improvement',
        message: `${category}の理解を深めましょう`,
        suggestion: `関連する問題を集中的に練習することをお勧めします`,
        priority: 'medium',
      });
    }
  });

  // 高精度の分野でチャレンジ提案
  Object.entries(analytics.accuracyByCategory).forEach(([category, data]) => {
    const accuracy = data.correct / data.total;
    if (accuracy > 0.8 && data.total >= 10) {
      recommendations.push({
        type: 'challenge',
        message: `${category}は得意分野ですね！`,
        suggestion: `より難しい問題にチャレンジしてみませんか？`,
        priority: 'low',
      });
    }
  });

  return recommendations;
};

// Netlify Functionsに学習データを送信
export const sendLearningDataToNetlify = async (analytics: LearningAnalytics): Promise<void> => {
  try {
    const response = await fetch('/.netlify/functions/learning-analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        analytics,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Learning data sent to Netlify:', result);
  } catch (error) {
    console.error('Error sending learning data to Netlify:', error);
  }
};

// 学習進捗レポートを生成
export const generateProgressReport = (analytics: LearningAnalytics): string => {
  const { totalSessions, totalTime, averageAccuracy, streak, currentLevel } = analytics;
  
  return `
📊 学習進捗レポート

🎯 総学習セッション: ${totalSessions}回
⏱️ 総学習時間: ${totalTime}分
🎯 平均正解率: ${Math.round(averageAccuracy * 100)}%
🔥 連続学習日数: ${streak}日
📈 現在のレベル: ${currentLevel}

${streak >= 7 ? '🎉 素晴らしい継続力です！' : '💪 継続は力なり！'}
${averageAccuracy >= 0.8 ? '🌟 高い精度を維持しています！' : '📚 さらなる向上を目指しましょう！'}
  `.trim();
};
