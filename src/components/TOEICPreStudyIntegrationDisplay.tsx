import React from "react";
import { PreStudyTOEICBoost } from "../types/preStudyTOEICIntegration";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

interface TOEICPreStudyIntegrationDisplayProps {
  boosts: PreStudyTOEICBoost;
}

export const TOEICPreStudyIntegrationDisplay: React.FC<
  TOEICPreStudyIntegrationDisplayProps
> = ({ boosts }) => {
  if (!boosts || boosts.completedTopics.length === 0) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">📚 事前学習連携</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700">
            事前学習を完了すると、TOEIC模擬テストで特別なボーナスが得られます！
          </p>
          <div className="mt-3">
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              事前学習を始める
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center gap-2">
          ✨ 事前学習連携アクティブ
          <Badge variant="default" className="bg-green-500">
            {boosts.synergyMultiplier.toFixed(1)}x ブースト
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 完了したトピック */}
        <div>
          <h4 className="font-semibold text-green-800 mb-2">
            完了した事前学習 ({boosts.completedTopics.length}件)
          </h4>
          <div className="flex flex-wrap gap-2">
            {boosts.completedTopics.map((topic, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                {topic.replace("-theory", "").replace("-", " ")}
              </Badge>
            ))}
          </div>
        </div>

        {/* 解放されたパート */}
        {boosts.unlockedParts.length > 0 && (
          <div>
            <h4 className="font-semibold text-green-800 mb-2">
              解放されたTOEICパート
            </h4>
            <div className="flex flex-wrap gap-2">
              {boosts.unlockedParts.map((part) => (
                <Badge key={part} variant="default" className="bg-green-500">
                  Part {part}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* シナジー効果 */}
        {boosts.preStudyEffects.length > 0 && (
          <div>
            <h4 className="font-semibold text-green-800 mb-2">
              アクティブなシナジー効果
            </h4>
            <div className="space-y-2">
              {boosts.preStudyEffects.map((effect, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-green-100 rounded"
                >
                  <div>
                    <span className="font-medium text-green-800">
                      Part {effect.partNumber}: {effect.description}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-200 text-green-800"
                  >
                    {effect.effectType === "xp_boost" &&
                      `${effect.effectValue}x XP`}
                    {effect.effectType === "accuracy_boost" &&
                      `${effect.effectValue}x 精度`}
                    {effect.effectType === "time_extension" &&
                      `+${effect.effectValue}秒`}
                    {effect.effectType === "hint_unlock" && "ヒント解放"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* シナジー倍率 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-green-800">
              総合シナジー倍率
            </span>
            <span className="text-lg font-bold text-green-800">
              {boosts.synergyMultiplier.toFixed(1)}x
            </span>
          </div>
          <Progress
            value={(boosts.synergyMultiplier - 1) * 100}
            className="h-2"
          />
          <p className="text-sm text-green-700 mt-1">
            事前学習の完了により、TOEIC模擬テストでボーナスXPが獲得できます！
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TOEICPreStudyIntegrationDisplay;
