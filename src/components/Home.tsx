import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  BookOpen,
  PenTool,
  Trophy,
  Target,
  Flame,
  Star,
  Settings,
  Clock,
  Zap,
  AlertTriangle
} from "lucide-react";
import { DataManager } from "../utils/dataManager";
import { UserStats } from "../data/achievements";
import { isFeatureUnlocked, getAvailableFeatures, getNextUnlockableFeatures, getUnlockCondition } from "../utils/unlockSystem";
import { SoundManager } from "../utils/soundManager";

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

export function Home({ onNavigateToGrammar, onNavigateToVocabulary, onNavigateToGrammarQuiz, onNavigateToEssay, onNavigateToCombinedTest, onNavigateToAchievements, onNavigateToAppSettings, onNavigateToTimeAttack, onNavigateToSimpleTowerDefense }: HomeProps) {
  const [userStats, setUserStats] = useState<UserStats>(DataManager.getUserStats());
  const [todayXP, setTodayXP] = useState(0);
  
  const refreshData = () => {
    // データを読み込み
    const stats = DataManager.getUserStats();
    setUserStats(stats);
    
    // 今日のXPを計算（今日の学習履歴から）
    const today = new Date().toISOString().split('T')[0];
    const history = DataManager.getLearningHistory();
    const todaySessions = history.filter(session => session.date === today);
    const todayXPTotal = todaySessions.reduce((sum, session) => sum + session.xpEarned, 0);
    setTodayXP(todayXPTotal);
    
    console.log('Home data refreshed:', {
      currentStreak: stats.currentStreak,
      lastStudyDate: stats.lastStudyDate,
      today,
      todayXP: todayXPTotal
    });
  };

  useEffect(() => {
    refreshData();
    
    // ページがフォーカスされた時にデータを更新
    const handleFocus = () => {
      refreshData();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // 1日のXP目標を設定から読み込み
  const getDailyXPGoal = () => {
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
  };
  
  const dailyXPGoal = getDailyXPGoal();
  const streak = userStats.currentStreak;
  const level = Math.max(1, Math.floor(userStats.totalXP / 100) + 1); // 最低レベル1、100XP毎にレベルアップ
  
  // 今日のXP進捗（日次目標に対する進捗）
  const xpProgress = Math.min((todayXP / dailyXPGoal) * 100, 100);
  
  // 次のレベルまでのXP計算
  const currentLevelXP = (level - 1) * 100; // 現在のレベルで必要なXP
  const nextLevelXP = level * 100; // 次のレベルで必要なXP
  const xpToNextLevel = nextLevelXP - userStats.totalXP; // 次のレベルまでに必要なXP

  // アンロックシステムを適用
  const availableFeatures = getAvailableFeatures(level, userStats.totalXP, streak, userStats.unlockedAchievements || []);
  const nextUnlockableFeatures = getNextUnlockableFeatures(level, userStats.totalXP, streak, userStats.unlockedAchievements || []);
  
  // デバッグ情報をコンソールに出力
  console.log('Home Debug Info:', {
    level,
    totalXP: userStats.totalXP,
    streak,
    availableFeatures: availableFeatures.length,
    nextUnlockableFeatures: nextUnlockableFeatures.length,
    nextUnlockableFeaturesList: nextUnlockableFeatures,
    unlockedAchievements: userStats.unlockedAchievements || []
  });

  // 各機能のアンロック状況をデバッグ
  console.log('Feature Unlock Status:', {
    vocabulary: isFeatureUnlocked('vocabulary-beginner', level, userStats.totalXP, streak, userStats.unlockedAchievements || []),
    grammar: isFeatureUnlocked('grammar-easy', level, userStats.totalXP, streak, userStats.unlockedAchievements || []),
    essay: isFeatureUnlocked('essay-beginner', level, userStats.totalXP, streak, userStats.unlockedAchievements || []),
    combined: isFeatureUnlocked('combined-test', level, userStats.totalXP, streak, userStats.unlockedAchievements || []),
    timeAttack: isFeatureUnlocked('time-attack', level, userStats.totalXP, streak, userStats.unlockedAchievements || [])
  });

  const menuItems = [
    // 基本機能（常に利用可能）
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

  // アンロックされた機能を追加（デバッグ用に常に表示）
  if (isFeatureUnlocked('vocabulary-beginner', level, userStats.totalXP, streak, userStats.unlockedAchievements || []) || userStats.totalXP === 0) {
    menuItems.unshift({
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

  if (isFeatureUnlocked('grammar-easy', level, userStats.totalXP, streak, userStats.unlockedAchievements || []) || userStats.totalXP === 0) {
    menuItems.unshift({
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

  if (isFeatureUnlocked('essay-beginner', level, userStats.totalXP, streak, userStats.unlockedAchievements || [])) {
    menuItems.unshift({
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

  if (isFeatureUnlocked('combined-test', level, userStats.totalXP, streak, userStats.unlockedAchievements || [])) {
    menuItems.unshift({
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

  if (isFeatureUnlocked('time-attack', level, userStats.totalXP, streak, userStats.unlockedAchievements || [])) {
    menuItems.unshift({
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

  // 次のアンロック予定の機能を追加（ロック状態で表示）
  nextUnlockableFeatures.forEach(feature => {
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

    menuItems.push({
      id: feature.id,
      title: feature.name,
      description: `Level ${feature.condition.level}でアンロック`,
      icon: iconMap[feature.icon] || BookOpen,
      color: 'from-gray-500 to-gray-600',
      available: false,
      onClick: () => {}
    });
  });

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
                <span className="font-bold">{streak}日連続</span>
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
                value={xpProgress} 
                className="h-2 bg-blue-400"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span>レベル {level}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-100">
                    {userStats.totalXP} / {nextLevelXP} XP
                  </div>
                  {xpToNextLevel > 0 && (
                    <div className="text-xs text-blue-200">
                      次レベルまで: {xpToNextLevel}XP
                    </div>
                  )}
                </div>
              </div>
              {xpToNextLevel > 0 && (
                <Progress 
                  value={((userStats.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100} 
                  className="h-1 bg-blue-400"
                />
              )}
            </div>
            
            {/* Next Unlock Info */}
            {nextUnlockableFeatures.length > 0 && (
              <div className="mt-4 pt-4 border-t border-blue-400">
                <div className="text-center space-y-2">
                  <h4 className="text-sm font-medium text-blue-100">🎯 次のアンロック予定</h4>
                  <div className="space-y-1">
                    {nextUnlockableFeatures.slice(0, 2).map((feature) => (
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
                    {!item.available && (() => {
                      const unlockCondition = getUnlockCondition(item.id);
                      return (
                        <div className="space-y-2">
                          <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600 border-gray-300">
                            🔒 ロック中
                          </Badge>
                          <div className="text-xs text-gray-500 space-y-1">
                            <p className="font-medium">{item.description}</p>
                            <p className="text-gray-400">
                              Level {unlockCondition?.level || '?'}でアンロック
                            </p>
                            {unlockCondition?.xpRequired && (
                              <p className="text-gray-400">
                                {unlockCondition.xpRequired}XP必要
                              </p>
                            )}
                            {unlockCondition?.streakRequired && (
                              <p className="text-gray-400">
                                {unlockCondition.streakRequired}日連続必要
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">{userStats.longestStreak}</div>
            <div className="text-xs text-muted-foreground">最長連続</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-emerald-600">{userStats.correctAnswers}</div>
            <div className="text-xs text-muted-foreground">正解数</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-orange-600">{userStats.averageScore}%</div>
            <div className="text-xs text-muted-foreground">正答率</div>
          </Card>
        </div>

        {/* Bottom padding for safe area */}
        <div className="h-8" />
      </div>
    </div>
  );
}