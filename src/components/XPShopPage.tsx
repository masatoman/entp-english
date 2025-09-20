import { ArrowLeft, ShoppingCart, Star, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { XP_SHOP_ITEMS } from "../data/xpShop";
import { XPShopItem } from "../types/simple-game";
import { getLevelManager, saveLevelManager } from "../utils/levelManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function XPShopPage() {
  const navigate = useNavigate();
  const [currentXP, setCurrentXP] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  useEffect(() => {
    const levelManager = getLevelManager();
    setCurrentXP(levelManager.getLevel().totalXP);

    // 購入済みアイテムを取得（ここでは簡単な実装）
    const purchased = localStorage.getItem("purchased-xp-items");
    if (purchased) {
      setPurchasedItems(JSON.parse(purchased));
    }
  }, []);

  const handlePurchase = (item: XPShopItem) => {
    if (currentXP < item.cost) {
      alert("XPが不足しています！");
      return;
    }

    const confirmed = confirm(
      `${item.name}を${item.cost}XPで購入しますか？\n\n${item.description}`
    );
    if (!confirmed) return;

    // XPを消費
    const levelManager = getLevelManager();
    const newXP = currentXP - item.cost;
    levelManager.setXP(newXP);
    saveLevelManager();
    setCurrentXP(newXP);

    // アイテムを購入済みリストに追加
    const newPurchased = [...purchasedItems, item.id];
    setPurchasedItems(newPurchased);
    localStorage.setItem("purchased-xp-items", JSON.stringify(newPurchased));

    // アイテム効果を適用（簡単な実装）
    applyItemEffect(item);

    alert(`${item.name}を購入しました！\n効果時間: ${item.duration}分`);
  };

  const applyItemEffect = (item: XPShopItem) => {
    // ここでアイテム効果を適用
    const effect = {
      itemId: item.id,
      type: item.type,
      startTime: Date.now(),
      duration: item.duration * 60 * 1000, // 分をミリ秒に変換
      multiplier: getItemMultiplier(item.type),
    };

    // エフェクトを保存
    const activeEffects = JSON.parse(
      localStorage.getItem("active-xp-effects") || "[]"
    );
    activeEffects.push(effect);
    localStorage.setItem("active-xp-effects", JSON.stringify(activeEffects));
  };

  const getItemMultiplier = (type: string): number => {
    switch (type) {
      case "learning-boost":
        return 1.5;
      case "vocabulary-boost":
        return 1.3;
      case "grammar-boost":
        return 1.2;
      case "synergy-boost":
        return 2.0;
      case "focus-boost":
        return 1.25;
      default:
        return 1.0;
    }
  };

  const canAfford = (item: XPShopItem): boolean => {
    return currentXP >= item.cost;
  };

  const isRecentlyPurchased = (item: XPShopItem): boolean => {
    return purchasedItems.includes(item.id);
  };

  const learningItems = XP_SHOP_ITEMS.filter((item) =>
    [
      "learning-boost",
      "vocabulary-boost",
      "grammar-boost",
      "synergy-boost",
      "focus-boost",
    ].includes(item.type)
  );

  const gameItems = XP_SHOP_ITEMS.filter(
    (item) =>
      ![
        "learning-boost",
        "vocabulary-boost",
        "grammar-boost",
        "synergy-boost",
        "focus-boost",
      ].includes(item.type)
  );

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>

          <div className="text-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              XPショップ
            </h1>
            <p className="text-gray-600">
              学習ブーストアイテムでスキルアップ！
            </p>
          </div>

          <div className="flex items-center gap-2 bg-yellow-100 px-3 py-2 rounded-lg">
            <Star className="w-5 h-5 text-yellow-600" />
            <span className="font-bold text-yellow-800">{currentXP} XP</span>
          </div>
        </div>

        {/* 学習ブーストアイテム */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            📚 学習ブーストアイテム
            <Badge variant="secondary">おすすめ</Badge>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningItems.map((item) => (
              <Card key={item.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.icon}</span>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                    </div>
                    {isRecentlyPurchased(item) && (
                      <Badge variant="outline" className="text-xs">
                        購入済み
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{item.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      効果時間: {item.duration}分
                    </div>
                    <Badge
                      variant={canAfford(item) ? "default" : "secondary"}
                      className="flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      {item.cost} XP
                    </Badge>
                  </div>

                  <Button
                    onClick={() => handlePurchase(item)}
                    disabled={!canAfford(item)}
                    className="w-full"
                    variant={canAfford(item) ? "default" : "outline"}
                  >
                    {canAfford(item) ? "購入する" : "XP不足"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ゲーム用アイテム */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            🎮 ゲーム用アイテム
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameItems.map((item) => (
              <Card key={item.id} className="relative opacity-60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.icon}</span>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      準備中
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{item.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      効果時間: {item.duration}秒
                    </div>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      {item.cost} XP
                    </Badge>
                  </div>

                  <Button disabled className="w-full" variant="outline">
                    タワーディフェンス準備中
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 使用方法説明 */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              💡 XPショップの使い方
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-700 space-y-2">
            <p>
              • <strong>学習ブーストアイテム</strong>:
              学習効率を一時的に向上させます
            </p>
            <p>
              • <strong>効果時間中</strong>:
              該当する学習でボーナスXPや成功率アップ
            </p>
            <p>
              • <strong>XPの獲得方法</strong>:
              語彙学習、文法クイズ、総合テスト、デイリーチャレンジなど
            </p>
            <p>
              • <strong>おすすめ</strong>:
              「相乗効果マルチプライヤー」で統合学習のXPを2倍に！
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

