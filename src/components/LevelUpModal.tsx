import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Star, Trophy, Zap } from 'lucide-react';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  previousLevel: number;
  xpGained: number;
  totalXP: number;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  newLevel,
  previousLevel,
  xpGained,
  totalXP
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-2xl">
        <CardContent className="p-8 text-center space-y-6">
          {/* レベルアップアイコン */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* レベルアップメッセージ */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-orange-800">
              🎉 Level {newLevel}!
            </h2>
            <p className="text-lg text-orange-700">
              おめでとうございます！
            </p>
          </div>

          {/* 経験値表示 */}
          <div className="bg-white/70 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">経験値の変化</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Level {previousLevel}:</span>
                <span className="font-medium">50/50 XP</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Level {newLevel}:</span>
                <span className="font-medium">0/50 XP</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">獲得XP:</span>
                  <span className="font-bold text-green-600">+{xpGained} XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* 続けるボタン */}
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3 text-lg"
          >
            続ける
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
