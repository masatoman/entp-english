import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { 
  BookOpen, 
  PenTool, 
  Target, 
  Clock, 
  Settings, 
  Trophy, 
  Star, 
  Flame,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { DataManager } from '../utils/dataManager';
import { SoundManager } from '../utils/soundManager';
import { 
  getAvailableFeatures, 
  getNextUnlockableFeatures, 
  isFeatureUnlocked 
} from '../utils/featureUnlockSystem';
import { StatusAllocationComponent } from './StatusAllocation';
import { HeartSystemDisplay } from './HeartSystem';
import { LearningFeedbackForm } from './LearningFeedbackForm';
import { analyzeLearningData, getLearningSessions, sendLearningDataToNetlify } from '../utils/learningAnalytics';
import type { UserStats } from '../data/achievements';

interface HomeProps {
  onNavigateToGrammar: () => void;
  onNavigateToVocabulary: () => void;
  onNavigateToGrammarQuiz: () => void;
  onNavigateToEssay: () => void;
  onNavigateToCombinedTest: () => void;
  onNavigateToAchievements: () => void;
  onNavigateToAppSettings: () => void;
  onNavigateToTimeAttack: () => void;
  onNavigateToSimpleTowerDefense: () => void;
}

export const Home = React.memo(function Home({ 
  onNavigateToGrammar, 
  onNavigateToVocabulary, 
  onNavigateToGrammarQuiz, 
  onNavigateToEssay, 
  onNavigateToCombinedTest, 
  onNavigateToAchievements, 
  onNavigateToAppSettings, 
  onNavigateToTimeAttack, 
  onNavigateToSimpleTowerDefense 
}: HomeProps) {
  const [userStats, setUserStats] = useState<UserStats>(DataManager.getUserStats());
  const [todayXP, setTodayXP] = useState(0);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [learningAnalytics, setLearningAnalytics] = useState<any>(null);
  
  // メモ化された日次XP目標の取得
  const dailyXPGoal = useMemo(() => {
    try {
      const saved = localStorage.getItem('app-settings');
      if (saved) {
        const settings = JSON.parse(saved);
        return settings.dailyXPGoal || 100;
      }
    } catch (error) {
      console.error('Error loading daily XP goal:', error);
    }
    return 100;
  }, []);

  // メモ化された計算値
  const calculatedValues = useMemo(() => {
    const level = Math.max(1, Math.floor(userStats.totalXP / 100) + 1);
    const streak = userStats.currentStreak;
    const xpProgress = Math.min((todayXP / dailyXPGoal) * 100, 100);
    const currentLevelXP = (level - 1) * 100;
    const nextLevelXP = level * 100;
    const xpToNextLevel = nextLevelXP - userStats.totalXP;
    
    return {
      level,
      streak,
      xpProgress,
      currentLevelXP,
      nextLevelXP,
      xpToNextLevel
    };
  }, [userStats.totalXP, todayXP, dailyXPGoal, userStats.currentStreak]);

  // メモ化されたアンロック機能
  const unlockFeatures = useMemo(() => {
    const availableFeatures = getAvailableFeatures(
      calculatedValues.level, 
      userStats.totalXP, 
      calculatedValues.streak, 
[]
    );
    const nextUnlockableFeatures = getNextUnlockableFeatures(
      calculatedValues.level, 
      userStats.totalXP, 
      calculatedValues.streak, 
[]
    );
    
    return { availableFeatures, nextUnlockableFeatures };
  }, [calculatedValues.level, userStats.totalXP, calculatedValues.streak, []]);

  // 学習データ分析の初期化
  useEffect(() => {
    const sessions = getLearningSessions();
    if (sessions.length > 0) {
      const analytics = analyzeLearningData(sessions);
      setLearningAnalytics(analytics);
      
      // Netlify Functionsにデータを送信（開発環境では無効）
      if (process.env.NODE_ENV === 'production') {
        sendLearningDataToNetlify(analytics).catch(console.error);
      }
    }
  }, []);

  // メモ化されたデータ更新関数
  const refreshData = useCallback(() => {
    const stats = DataManager.getUserStats();
    setUserStats(stats);
    
    const today = new Date().toISOString().split('T')[0];
    const history = DataManager.getLearningHistory();
    const todaySessions = history.filter(session => session.date === today);
    const todayXPTotal = todaySessions.reduce((sum, session) => sum + session.xpEarned, 0);
    setTodayXP(todayXPTotal);
  }, []);

  useEffect(() => {
    refreshData();
    
    const handleFocus = () => {
      refreshData();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshData]);

  // メモ化されたメニューアイテム
  const menuItems = useMemo(() => {
    const items = [
      {
        id: 'achievements',
        title: '実績',
        description: '学習記録',
        icon: Trophy,
        color: 'from-purple-500 to-purple-600',
        available: true,
        onClick: () => {
          SoundManager.sounds.click();
          onNavigateToAchievements();
        }
      },
      {
        id: 'settings',
        title: 'アプリ設定',
        description: '全般設定・通知設定',
        icon: Settings,
        color: 'from-gray-500 to-gray-600',
        available: true,
        onClick: () => {
          SoundManager.sounds.click();
          onNavigateToAppSettings();
        }
      },
      {
        id: 'simple-tower-defense',
        title: 'タワーディフェンス',
        description: 'シンプルなゲーム学習',
        icon: Target,
        color: 'from-blue-500 to-blue-600',
        available: true,
        onClick: () => {
          SoundManager.sounds.click();
          onNavigateToSimpleTowerDefense();
        }
      }
    ];

    // アンロックされた機能を追加
    if (true) {
      items.unshift({
        id: 'vocabulary',
        title: '単語学習',
        description: '語彙力を鍛える',
        icon: BookOpen,
        color: 'from-blue-500 to-blue-600',
        available: true,
        onClick: () => {
          SoundManager.sounds.click();
          onNavigateToVocabulary();
        }
      });
    }

    if (true) {
      items.unshift({
        id: 'grammar',
        title: '文法クイズ',
        description: '文法問題に挑戦',
        icon: PenTool,
        color: 'from-emerald-500 to-emerald-600',
        available: true,
        onClick: () => {
          SoundManager.sounds.click();
          onNavigateToGrammarQuiz();
        }
      });
    }

    if (true) {
      items.unshift({
        id: 'essay',
        title: '英作文',
        description: '英作文練習',
        icon: PenTool,
        color: 'from-purple-500 to-purple-600',
        available: true,
        onClick: () => {
          SoundManager.sounds.click();
          onNavigateToEssay();
        }
      });
    }

    if (true) {
      items.unshift({
        id: 'test',
        title: '総合テスト',
        description: '全スキルのテスト',
        icon: Target,
        color: 'from-orange-500 to-orange-600',
        available: true,
        onClick: () => {
          SoundManager.sounds.click();
          onNavigateToCombinedTest();
        }
      });
    }

    if (true) {
      items.unshift({
        id: 'time-attack',
        title: 'タイムアタック',
        description: '制限時間内で連続正解',
        icon: Clock,
        color: 'from-red-500 to-red-600',
        available: true,
        onClick: () => {
          SoundManager.sounds.click();
          onNavigateToTimeAttack();
        }
      });
    }

    // 次のアンロック予定の機能を追加
    unlockFeatures.nextUnlockableFeatures.forEach(feature => {
      const iconMap: { [key: string]: any } = {
        'BookOpen': BookOpen,
        'PenTool': PenTool,
        'Target': Target,
        'Clock': Clock,
        'Zap': Zap,
        'AlertTriangle': AlertTriangle,
        'Flame': Flame,
        'Trophy': Trophy
      };

      items.push({
        id: feature.id,
        title: feature.name,
        description: `Level ${feature.condition.level}でアンロック`,
        icon: iconMap[feature.icon] || BookOpen,
        color: 'from-gray-500 to-gray-600',
        available: false,
        onClick: () => {}
      });
    });

    return items;
  }, [calculatedValues.level, userStats.totalXP, calculatedValues.streak, [], unlockFeatures.nextUnlockableFeatures, onNavigateToAchievements, onNavigateToAppSettings, onNavigateToSimpleTowerDefense, onNavigateToVocabulary, onNavigateToGrammarQuiz, onNavigateToEssay, onNavigateToCombinedTest, onNavigateToTimeAttack]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-3xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            English Master
          </h1>
          <p className="text-muted-foreground mt-1">
            毎日コツコツ英語力アップ
          </p>
        </div>

        {/* Today's Progress */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-foreground border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">今日の進捗</CardTitle>
              <div className="flex items-center space-x-1">
                <Flame className="w-5 h-5 text-orange-300" />
                <span className="font-bold">{calculatedValues.streak}日連続</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>今日のXP</span>
                <div className="text-right">
                  <span className="font-bold">{todayXP} / {dailyXPGoal}</span>
                  {todayXP >= dailyXPGoal && (
                    <div className="text-xs text-green-200">🎉 目標達成！</div>
                  )}
                </div>
              </div>
              <Progress 
                value={calculatedValues.xpProgress} 
                className="h-2 bg-blue-400"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span>レベル {calculatedValues.level}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-100">
                    {userStats.totalXP} / {calculatedValues.nextLevelXP} XP
                  </div>
                  {calculatedValues.xpToNextLevel > 0 && (
                    <div className="text-xs text-blue-200">
                      次レベルまで: {calculatedValues.xpToNextLevel}XP
                    </div>
                  )}
                </div>
              </div>
              {calculatedValues.xpToNextLevel > 0 && (
                <Progress 
                  value={((userStats.totalXP - calculatedValues.currentLevelXP) / (calculatedValues.nextLevelXP - calculatedValues.currentLevelXP)) * 100} 
                  className="h-1 bg-blue-400"
                />
              )}
            </div>
            
            {/* Next Unlock Info */}
            {unlockFeatures.nextUnlockableFeatures.length > 0 && (
              <div className="mt-4 pt-4 border-t border-blue-400">
                <div className="text-center space-y-2">
                  <h4 className="text-sm font-medium text-blue-100">🎯 次のアンロック予定</h4>
                  <div className="space-y-1">
                    {unlockFeatures.nextUnlockableFeatures.slice(0, 2).map((feature) => (
                      <div key={feature.id} className="text-xs text-blue-200">
                        <span className="font-medium">{feature.name}</span>
                        <span className="text-blue-300"> - Level {feature.condition.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ステータス振り分けとハートシステム */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatusAllocationComponent readOnly={true} />
          <HeartSystemDisplay compact={false} />
        </div>

        {/* フィードバックボタン */}
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => setShowFeedbackForm(true)}
            className="flex items-center space-x-2"
          >
            <Star className="w-4 h-4" />
            <span>学習フィードバック</span>
          </Button>
        </div>

        {/* Menu Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-center">学習メニュー</h2>
          <div className="grid grid-cols-2 gap-4">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              
              return (
                <Card
                  key={item.id}
                  className={`
                    cursor-pointer transition-all duration-200 border-0 shadow-lg
                    ${item.available 
                      ? 'hover:scale-105 active:scale-95' 
                      : 'opacity-60 cursor-not-allowed'
                    }
                  `}
                  onClick={item.available ? item.onClick : undefined}
                >
                  <CardContent className="p-6 text-center space-y-3">
                    <div className={`
                      w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${item.color} 
                      flex items-center justify-center shadow-lg
                    `}>
                      <IconComponent className="w-8 h-8 text-foreground" />
                    </div>
                    <div className="space-y-1">
                      <h3 className={`font-medium ${item.available ? 'text-foreground' : 'text-gray-700'}`}>{item.title}</h3>
                      <p className={`text-sm ${item.available ? 'text-muted-foreground' : 'text-gray-600'}`}>
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* フィードバックフォームモーダル */}
        {showFeedbackForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md">
              <LearningFeedbackForm onClose={() => setShowFeedbackForm(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});