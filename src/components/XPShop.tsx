import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { XPShopItem } from '../types/simple-game';
import { XP_SHOP_ITEMS, canAffordItem } from '../data/xpShop';

interface XPShopProps {
  currentXP: number;
  onPurchaseItem: (item: XPShopItem) => void;
}

export function XPShop({ currentXP, onPurchaseItem }: XPShopProps) {
  return (
    <Card className="border-gray-300 border-2 bg-white shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-gray-800">XPショップ</CardTitle>
        <p className="text-xs text-gray-600">一時的なブーストアイテムを購入</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {XP_SHOP_ITEMS.map((item) => {
          const canAfford = canAffordItem(item, currentXP);
          
          return (
            <Button
              key={item.id}
              onClick={() => onPurchaseItem(item)}
              disabled={!canAfford}
              className={`w-full text-left justify-start ${
                canAfford
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
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
