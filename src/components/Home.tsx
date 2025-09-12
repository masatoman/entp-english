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
  Star
} from "lucide-react";
import { DataManager } from "../utils/dataManager";
import { UserStats } from "../data/achievements";

interface HomeProps {
  onNavigateToGrammar: () => void;
  onNavigateToVocabulary: () => void;
  onNavigateToGrammarQuiz: () => void;
  onNavigateToEssay: () => void;
  onNavigateToCombinedTest: () => void;
  onNavigateToAchievements: () => void;
}

export function Home({ onNavigateToGrammar, onNavigateToVocabulary, onNavigateToGrammarQuiz, onNavigateToEssay, onNavigateToCombinedTest, onNavigateToAchievements }: HomeProps) {
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

  const dailyXPGoal = 100; // 設定可能にする場合は、ユーザー設定やレベルに応じて変更
  const streak = userStats.currentStreak;
  const level = Math.floor(userStats.totalXP / 100) + 1; // 100XP毎にレベルアップ
  
  // 今日のXP進捗（日次目標に対する進捗）
  const xpProgress = Math.min((todayXP / dailyXPGoal) * 100, 100);
  
  // 次のレベルまでのXP計算
  const currentLevelXP = (level - 1) * 100; // 現在のレベルで必要なXP
  const nextLevelXP = level * 100; // 次のレベルで必要なXP
  const xpToNextLevel = nextLevelXP - userStats.totalXP; // 次のレベルまでに必要なXP

  const menuItems = [
    {
      id: 'vocabulary',
      title: '単語',
      description: '語彙力を鍛える',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      available: true,
      onClick: onNavigateToVocabulary
    },
    {
      id: 'grammar',
      title: '文法',
      description: '文法クイズ',
      icon: PenTool,
      color: 'from-emerald-500 to-emerald-600',
      available: true,
      onClick: onNavigateToGrammarQuiz
    },
    {
      id: 'essay',
      title: '英作文',
      description: '英作文練習',
      icon: PenTool,
      color: 'from-purple-500 to-purple-600',
      available: true,
      onClick: onNavigateToEssay
    },
    {
      id: 'test',
      title: 'テスト',
      description: '総合テスト',
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      available: true,
      onClick: onNavigateToCombinedTest
    },
    {
      id: 'achievements',
      title: '実績',
      description: '学習記録',
      icon: Trophy,
      color: 'from-purple-500 to-purple-600',
      available: true,
      onClick: onNavigateToAchievements
    }
  ];

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
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">今日の進捗</CardTitle>
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
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    {!item.available && (
                      <Badge variant="outline" className="text-xs">
                        準備中
                      </Badge>
                    )}
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