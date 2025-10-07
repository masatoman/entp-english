import { Coins, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { loginBonusManager } from "../utils/loginBonusManager";
import { Button } from "./ui/button";

export function LoginBonusNotification() {
  const [show, setShow] = useState(false);
  const [bonusInfo, setBonusInfo] = useState<{
    received: boolean;
    coins: number;
    consecutiveDays: number;
  } | null>(null);

  useEffect(() => {
    // コンポーネントマウント時にログインボーナス情報を取得
    const info = loginBonusManager.getTodayBonusInfo();
    setBonusInfo(info);

    // 今日まだ受け取っていなければ通知を表示
    if (!info.received) {
      // ページ読み込み後1秒待ってから表示（UX向上）
      setTimeout(() => {
        setShow(true);
      }, 1000);
    }
  }, []);

  if (!bonusInfo || !show) {
    return null;
  }

  const handleClose = () => {
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 max-w-md mx-4 shadow-2xl border-4 border-yellow-400 animate-in fade-in zoom-in duration-500">
        {/* 装飾 */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-yellow-400 rounded-full p-4 shadow-lg">
            <Coins className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* タイトル */}
        <div className="text-center mt-4">
          <h2 className="text-3xl font-bold text-orange-700 mb-2">
            🎉 ログインボーナス！
          </h2>
          <p className="text-gray-700">おかえりなさい！</p>
        </div>

        {/* コイン獲得表示 */}
        <div className="my-6 bg-white rounded-xl p-6 shadow-inner">
          <div className="flex items-center justify-center gap-3">
            <Coins className="w-12 h-12 text-yellow-500" />
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600">
                +{bonusInfo.coins}
              </div>
              <div className="text-sm text-gray-600">コイン</div>
            </div>
          </div>
        </div>

        {/* 連続ログイン日数 */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="text-lg font-semibold text-orange-700">
            連続ログイン {bonusInfo.consecutiveDays} 日目
          </span>
          <Flame className="w-5 h-5 text-orange-500" />
        </div>

        {/* 説明 */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-700">
            毎日ログインして
            <span className="font-bold text-orange-600">2コイン</span>をゲット！
          </p>
          <p className="text-xs text-gray-600 mt-1">
            コインはガチャパックの購入に使えます
          </p>
        </div>

        {/* 閉じるボタン */}
        <Button
          onClick={handleClose}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
        >
          受け取る
        </Button>
      </div>
    </div>
  );
}
