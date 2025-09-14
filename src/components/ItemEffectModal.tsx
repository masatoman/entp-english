import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface ItemEffect {
  type: 'damage-boost' | 'range-boost' | 'speed-boost' | 'gold-bonus' | 'xp-bonus';
  value: number;
  isPercentage: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ItemEffectModalProps {
  effect: ItemEffect | null;
  onClose: () => void;
}

export function ItemEffectModal({ effect, onClose }: ItemEffectModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (effect) {
      setIsVisible(true);
      // 2.5秒後に自動で消す
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // アニメーション完了後にコールバック実行
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [effect, onClose]);

  if (!effect || !isVisible) return null;

  const getEffectName = (type: string) => {
    switch (type) {
      case 'damage-boost': return '攻撃力アップ';
      case 'range-boost': return '射程アップ';
      case 'speed-boost': return '攻撃速度アップ';
      case 'gold-bonus': return 'ゴールドボーナス';
      case 'xp-bonus': return 'XPボーナス';
      default: return '未知の効果';
    }
  };

  const getEffectIcon = (type: string) => {
    switch (type) {
      case 'damage-boost': return '⚔️';
      case 'range-boost': return '🎯';
      case 'speed-boost': return '⚡';
      case 'gold-bonus': return '💰';
      case 'xp-bonus': return '⭐';
      default: return '❓';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'コモン';
      case 'rare': return 'レア';
      case 'epic': return 'エピック';
      case 'legendary': return 'レジェンダリー';
      default: return 'コモン';
    }
  };

  const formatValue = (value: number, isPercentage: boolean) => {
    if (isPercentage) {
      return `+${value}%`;
    }
    return `+${value}`;
  };

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none sm:top-6 sm:right-6">
      <div className="animate-bounce">
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 border-2 border-yellow-300 shadow-2xl transform scale-110 min-w-[180px] sm:min-w-[200px]">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-3xl sm:text-4xl mb-2">
              {getEffectIcon(effect.type)}
            </div>
            <div className="text-foreground font-bold text-sm sm:text-lg mb-1">
              {getEffectName(effect.type)} 獲得！
            </div>
            <div className="text-foreground text-lg sm:text-xl font-bold mb-2">
              {formatValue(effect.value, effect.isPercentage)}
            </div>
            <Badge 
              className={`${getRarityColor(effect.rarity)} text-foreground font-bold text-xs`}
            >
              {getRarityText(effect.rarity)}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
