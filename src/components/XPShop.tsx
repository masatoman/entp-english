import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { XPShopItem } from '../types/simple-game';
import { XP_SHOP_ITEMS, canAffordItem } from '../data/xpShop';

interface XPShopProps {
  currentXP: number;
  onPurchaseItem: (item: XPShopItem) => void;
}

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { XPShopItem } from '../types/simple-game';
import { XP_SHOP_ITEMS, canAffordItem } from '../data/xpShop';
import { ShoppingCart, Zap } from 'lucide-react';

interface XPShopProps {
  currentXP: number;
  onPurchaseItem: (item: XPShopItem) => void;
}

export function XPShop({ currentXP, onPurchaseItem }: XPShopProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-blue-600" />
          XPショップ
        </CardTitle>
        <p className="text-sm text-muted-foreground">一時的なブーストアイテムを購入</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {XP_SHOP_ITEMS.map((item) => {
          const canAfford = canAffordItem(item, currentXP);
          
          return (
            <Button
              key={item.id}
              onClick={() => onPurchaseItem(item)}
              disabled={!canAfford}
              variant={canAfford ? "outline" : "secondary"}
              className="w-full justify-between h-auto p-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <div className="text-left">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={canAfford ? "default" : "secondary"}
                  className="flex items-center gap-1"
                >
                  <Zap className="w-3 h-3" />
                  {item.cost}
                </Badge>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                </div>
                <span className="text-sm font-bold">{item.cost}XP</span>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
