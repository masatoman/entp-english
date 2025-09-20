import { useEffect, useState } from "react";
import { X, Star, Trophy, Zap } from "lucide-react";
import { skillTreeManager, SkillNode, GRAMMAR_SKILL_TREE } from "../utils/skillTreeManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface SkillUnlockNotificationProps {
  onClose: () => void;
  unlockedSkills: string[];
}

export default function SkillUnlockNotification({ 
  onClose, 
  unlockedSkills 
}: SkillUnlockNotificationProps) {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const unlockedNodes = unlockedSkills
    .map(skillId => GRAMMAR_SKILL_TREE.find(node => node.id === skillId))
    .filter((node): node is SkillNode => node !== undefined);

  useEffect(() => {
    if (unlockedNodes.length === 0) {
      onClose();
      return;
    }

    // 5秒後に自動で次のスキルまたは閉じる
    const timer = setTimeout(() => {
      if (currentSkillIndex < unlockedNodes.length - 1) {
        setCurrentSkillIndex(currentSkillIndex + 1);
      } else {
        handleClose();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentSkillIndex, unlockedNodes.length, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // アニメーション後に閉じる
  };

  const handleNext = () => {
    if (currentSkillIndex < unlockedNodes.length - 1) {
      setCurrentSkillIndex(currentSkillIndex + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentSkillIndex > 0) {
      setCurrentSkillIndex(currentSkillIndex - 1);
    }
  };

  if (unlockedNodes.length === 0) return null;

  const currentNode = unlockedNodes[currentSkillIndex];

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <Card className={`max-w-md mx-4 transform transition-transform duration-300 ${
        isVisible ? 'scale-100' : 'scale-95'
      }`}>
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute right-2 top-2 p-2"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <CardTitle className="text-xl text-green-800">
              新しいスキル解放！
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {currentSkillIndex + 1} / {unlockedNodes.length}
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* 解放されたスキルの詳細 */}
          <div className="text-center">
            <div className="text-3xl mb-2">{currentNode.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800">
              {currentNode.name}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {currentNode.description}
            </p>
            
            <div className="flex justify-center space-x-2 mb-4">
              <Badge variant="outline">Level {currentNode.level}</Badge>
              <Badge variant="outline">{currentNode.difficulty}</Badge>
              <Badge variant="outline">{currentNode.estimatedTime}分</Badge>
            </div>
          </div>

          {/* 報酬情報 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
              <Trophy className="w-4 h-4 mr-2" />
              獲得可能な報酬
            </h4>
            <div className="space-y-1">
              <div className="flex items-center text-sm text-yellow-700">
                <Zap className="w-3 h-3 mr-2" />
                {currentNode.rewards.xp} XP
              </div>
              {currentNode.rewards.badges.map(badge => (
                <div key={badge} className="flex items-center text-sm text-yellow-700">
                  <Star className="w-3 h-3 mr-2" />
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* 解放される機能 */}
          {currentNode.rewards.unlockedFeatures.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-semibold text-blue-800 mb-2">
                🔓 解放される機能
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {currentNode.rewards.unlockedFeatures.map(feature => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ナビゲーションボタン */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSkillIndex === 0}
              size="sm"
            >
              前へ
            </Button>
            
            <div className="flex space-x-2">
              {unlockedNodes.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentSkillIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <Button
              onClick={handleNext}
              size="sm"
            >
              {currentSkillIndex < unlockedNodes.length - 1 ? "次へ" : "完了"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * スキル解放通知を管理するフック
 */
export function useSkillUnlockNotification() {
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  const checkForNewUnlocks = () => {
    const state = skillTreeManager.getSkillTreeState();
    const previousUnlocked = JSON.parse(
      localStorage.getItem("previous-unlocked-skills") || "[]"
    );
    
    const newUnlocks = state.unlockedNodes.filter(
      nodeId => !previousUnlocked.includes(nodeId)
    );

    if (newUnlocks.length > 0) {
      setUnlockedSkills(newUnlocks);
      setShowNotification(true);
      
      // 現在の解放状態を保存
      localStorage.setItem(
        "previous-unlocked-skills", 
        JSON.stringify(state.unlockedNodes)
      );
    }
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
    setUnlockedSkills([]);
  };

  return {
    unlockedSkills,
    showNotification,
    checkForNewUnlocks,
    handleCloseNotification
  };
}
