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

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Sparkles, Zap, Target, Timer, Coins, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';

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

  const getEffectIcon = (type: ItemEffect['type']) => {
    switch (type) {
      case 'damage-boost':
        return <Zap className="w-4 h-4" />;
      case 'range-boost':
        return <Target className="w-4 h-4" />;
      case 'speed-boost':
        return <Timer className="w-4 h-4" />;
      case 'gold-bonus':
        return <Coins className="w-4 h-4" />;
      case 'xp-bonus':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getEffectLabel = (type: ItemEffect['type']) => {
    switch (type) {
      case 'damage-boost':
        return 'ダメージブースト';
      case 'range-boost':
        return '射程ブースト';
      case 'speed-boost':
        return 'スピードブースト';
      case 'gold-bonus':
        return 'ゴールドボーナス';
      case 'xp-bonus':
        return 'XPボーナス';
      default:
        return 'エフェクト';
    }
  };

  const getRarityColor = (rarity: ItemEffect['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-300 bg-gray-50';
      case 'rare':
        return 'border-blue-300 bg-blue-50';
      case 'epic':
        return 'border-purple-300 bg-purple-50';
      case 'legendary':
        return 'border-yellow-300 bg-yellow-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityTextColor = (rarity: ItemEffect['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-700';
      case 'rare':
        return 'text-blue-700';
      case 'epic':
        return 'text-purple-700';
      case 'legendary':
        return 'text-yellow-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
      <Alert 
        className={cn(
          "shadow-lg border-2 min-w-[280px] max-w-sm",
          getRarityColor(effect.rarity)
        )}
      >
        <div className="flex items-center gap-2">
          {getEffectIcon(effect.type)}
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>
        <AlertDescription className="ml-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={cn("font-medium", getRarityTextColor(effect.rarity))}>
                {getEffectLabel(effect.type)}
              </span>
              <Badge 
                variant="outline"
                className={cn(
                  "text-xs font-bold",
                  getRarityTextColor(effect.rarity)
                )}
              >
                {effect.rarity.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">効果:</span>
              <Badge className="font-mono">
                +{effect.value}{effect.isPercentage ? '%' : ''}
              </Badge>
            </div>
            
            <div className="text-xs text-muted-foreground">
              アイテム効果が発動しました！
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
            >
              {getRarityText(effect.rarity)}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
