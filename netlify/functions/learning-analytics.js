// 学習データの分析とパーソナライゼーション
exports.handler = async (event, context) => {
  // CORS設定
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { learningData, userId } = JSON.parse(event.body);

    // 学習パターンの分析
    const analysis = analyzeLearningPattern(learningData);
    
    // パーソナライズされた学習提案
    const recommendations = generateRecommendations(analysis);
    
    // 進捗レポートの生成
    const progressReport = generateProgressReport(learningData);

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        analysis,
        recommendations,
        progressReport,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

function analyzeLearningPattern(learningData) {
  // ENTP学習者の特性を考慮した分析
  const patterns = {
    preferredModes: {},
    difficultyProgression: [],
    timeSpent: {},
    accuracyByCategory: {},
    engagementLevel: 0,
  };

  // 学習データの分析ロジック
  learningData.sessions.forEach(session => {
    // 学習モードの好み分析
    patterns.preferredModes[session.mode] = 
      (patterns.preferredModes[session.mode] || 0) + 1;
    
    // 難易度の進行パターン
    patterns.difficultyProgression.push(session.difficulty);
    
    // 時間分析
    patterns.timeSpent[session.mode] = 
      (patterns.timeSpent[session.mode] || 0) + session.duration;
    
    // カテゴリー別精度
    if (!patterns.accuracyByCategory[session.category]) {
      patterns.accuracyByCategory[session.category] = { correct: 0, total: 0 };
    }
    patterns.accuracyByCategory[session.category].correct += session.correctAnswers;
    patterns.accuracyByCategory[session.category].total += session.totalQuestions;
  });

  // エンゲージメントレベル計算
  patterns.engagementLevel = calculateEngagementLevel(learningData);

  return patterns;
}

function generateRecommendations(analysis) {
  const recommendations = [];

  // ENTP学習者の特性に基づく提案
  if (analysis.engagementLevel < 0.7) {
    recommendations.push({
      type: 'engagement',
      message: '新しい学習モードを試してみませんか？',
      suggestion: 'タワーディフェンスゲームで楽しく学習しましょう！',
    });
  }

  // 苦手分野の特定と提案
  Object.entries(analysis.accuracyByCategory).forEach(([category, data]) => {
    const accuracy = data.correct / data.total;
    if (accuracy < 0.6) {
      recommendations.push({
        type: 'improvement',
        message: `${category}の理解を深めましょう`,
        suggestion: `関連する問題を集中的に練習することをお勧めします`,
      });
    }
  });

  return recommendations;
}

function generateProgressReport(learningData) {
  const totalSessions = learningData.sessions.length;
  const totalTime = learningData.sessions.reduce((sum, session) => sum + session.duration, 0);
  const averageAccuracy = learningData.sessions.reduce((sum, session) => 
    sum + (session.correctAnswers / session.totalQuestions), 0) / totalSessions;

  return {
    totalSessions,
    totalTime: Math.round(totalTime / 60), // 分単位
    averageAccuracy: Math.round(averageAccuracy * 100), // パーセント
    streak: calculateStreak(learningData.sessions),
    level: calculateLevel(totalTime, averageAccuracy),
  };
}

function calculateEngagementLevel(learningData) {
  // セッション頻度、継続時間、精度を考慮
  const recentSessions = learningData.sessions.slice(-7); // 最近7セッション
  const frequency = recentSessions.length / 7;
  const avgDuration = recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length;
  const avgAccuracy = recentSessions.reduce((sum, s) => sum + (s.correctAnswers / s.totalQuestions), 0) / recentSessions.length;
  
  return (frequency * 0.4 + (avgDuration / 300) * 0.3 + avgAccuracy * 0.3);
}

function calculateStreak(sessions) {
  // 連続学習日数の計算
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
}

function calculateLevel(totalTime, averageAccuracy) {
  // 学習時間と精度に基づくレベル計算
  const timeLevel = Math.floor(totalTime / 3600); // 時間単位
  const accuracyLevel = Math.floor(averageAccuracy * 10); // 0-10スケール
  return Math.min(20, Math.max(1, Math.floor((timeLevel + accuracyLevel) / 2)));
}
