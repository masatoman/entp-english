import { Star, Trophy, Zap } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  previousLevel: number;
  xpGained: number;
  totalXP: number;
}

import { Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

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
  totalXP,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center pb-2">
          <DialogTitle className="text-2xl font-bold text-center">
            🎉 レベルアップ！
          </DialogTitle>
        </DialogHeader>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 border-2">
          <CardContent className="p-6 text-center space-y-6">
            {/* レベルアップアイコン */}
            <div className="flex justify-center">
              <div className="relative">
                <Trophy className="w-16 h-16 text-yellow-500" />
                <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>

            {/* レベル表示 */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Lv.{previousLevel}
                </Badge>
                <div className="flex items-center gap-2">
                  <div className="w-8 border-t-2 border-gray-300"></div>
                  <Star className="w-5 h-5 text-yellow-500" />
                  <div className="w-8 border-t-2 border-gray-300"></div>
                </div>
                <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500">
                  Lv.{newLevel}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                レベル {previousLevel} から レベル {newLevel} にアップしました！
              </p>
            </div>

            {/* XP情報 */}
            <div className="bg-white/80 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">獲得XP</span>
              </div>
              <div className="space-y-1">
                <Badge variant="secondary" className="text-base px-3 py-1">
                  +{xpGained} XP
                </Badge>
                <p className="text-xs text-gray-500">総XP: {totalXP}</p>
              </div>
            </div>

            {/* お祝いメッセージ */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
              <p className="text-sm font-medium text-purple-800 mb-2">
                🌟 素晴らしい成長です！
              </p>
              <p className="text-xs text-purple-600">
                継続的な学習でさらなる成長を目指しましょう。
                新しいレベルでより多くの機能が利用できるようになりました！
              </p>
            </div>

            {/* 閉じるボタン */}
            <Button
              onClick={onClose}
              size="lg"
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              <Trophy className="w-4 h-4 mr-2" />
              続ける
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
