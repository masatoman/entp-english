import { Download, Smartphone, Share } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallButtonProps {
  variant?: 'button' | 'card' | 'compact';
  showInstructions?: boolean;
}

export function PWAInstallButton({ 
  variant = 'button', 
  showInstructions = true 
}: PWAInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructionsState, setShowInstructionsState] = useState(showInstructions);
  const [deviceInfo, setDeviceInfo] = useState<{
    isIOS: boolean;
    isSafari: boolean;
    isMobile: boolean;
    browserName: string;
  }>({
    isIOS: false,
    isSafari: false,
    isMobile: false,
    browserName: 'Unknown'
  });

  useEffect(() => {
    // デバイス・ブラウザ検出
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(userAgent);
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    let browserName = 'Unknown';
    if (/Chrome|CriOS/.test(userAgent)) browserName = 'Chrome';
    else if (/Firefox|FxiOS/.test(userAgent)) browserName = 'Firefox';
    else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) browserName = 'Safari';
    else if (/Edg|EdgiOS/.test(userAgent)) browserName = 'Edge';
    else if (/Brave/.test(userAgent) || /brave/i.test(userAgent)) browserName = 'Brave';

    setDeviceInfo({ isIOS, isSafari, isMobile, browserName });

    // アプリが既にインストールされているかチェック
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // beforeinstallprompt イベントをリッスン
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // appinstalled イベントをリッスン
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // 自動インストール（Android Chrome等）
  const handleAutoInstall = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('📱 PWA インストール成功');
      } else {
        console.log('📱 PWA インストールキャンセル');
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('PWA インストールエラー:', error);
    }
  };

  // 手動インストール指示を表示
  const handleManualInstall = () => {
    setShowInstructionsState(true);
    console.log('📱 手動インストール手順を表示');
    
    // コンパクト版の場合はアラートで手順を表示
    if (variant === 'compact') {
      const instructions = deviceInfo.isIOS 
        ? (deviceInfo.isSafari 
          ? "📱 iPhone Safari でのインストール方法:\n\n1. 画面下部の 📤 共有ボタンをタップ\n2. 「ホーム画面に追加」を選択\n3. 「追加」をタップして完了\n\n✅ ホーム画面にアプリアイコンが追加されます！"
          : "⚠️ iPhone では Safari でのアクセスが推奨されます\n\n現在のブラウザ: " + deviceInfo.browserName + "\n\n📱 Safari でアクセスして:\n1. 共有ボタン（📤）をタップ\n2. 「ホーム画面に追加」を選択\n3. 「追加」をタップ")
        : "📱 アプリインストール方法:\n\n1. ブラウザメニューを開く\n2. 「ホーム画面に追加」を選択\n3. アプリ名を確認して「追加」\n\n✅ ホーム画面にアプリアイコンが追加されます！";
      
      alert(instructions);
    }
  };

  // インストール済みの場合は表示しない
  if (isInstalled) {
    return variant === 'card' ? (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4 text-center">
          <div className="text-green-600 mb-2">
            <Smartphone className="w-8 h-8 mx-auto" />
          </div>
          <p className="text-sm text-green-700 font-medium">
            ✅ アプリがインストール済みです
          </p>
        </CardContent>
      </Card>
    ) : null;
  }

  // コンパクト版
  if (variant === 'compact') {
    console.log('📱 PWAInstallButton compact variant rendered', { 
      deferredPrompt: !!deferredPrompt, 
      isInstalled, 
      deviceInfo 
    });
    
    return (
      <Button
        onClick={() => {
          console.log('📱 アプリ化ボタンクリック', { 
            deferredPrompt: !!deferredPrompt, 
            deviceInfo 
          });
          if (deferredPrompt) {
            handleAutoInstall();
          } else {
            handleManualInstall();
          }
        }}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Download className="w-3 h-3" />
        アプリ化
      </Button>
    );
  }

  // カード版
  if (variant === 'card') {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center mb-4">
            <div className="text-blue-600 mb-2">
              <Smartphone className="w-8 h-8 mx-auto" />
            </div>
            <h3 className="font-semibold text-blue-900 mb-1">
              📱 アプリをインストール
            </h3>
            <p className="text-sm text-blue-700">
              オフラインでも学習を続けられます
            </p>
          </div>

          {/* 自動インストール可能な場合 */}
          {deferredPrompt && (
            <div className="space-y-3">
              <Button
                onClick={handleAutoInstall}
                className="w-full flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                今すぐインストール
              </Button>
            </div>
          )}

          {/* 手動インストール指示 */}
          {!deferredPrompt && (
            <div className="space-y-3">
              <Button
                onClick={handleManualInstall}
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <Share className="w-4 h-4" />
                インストール方法を見る
              </Button>
              
              {showInstructionsState && (
                <div className="text-xs text-blue-700 bg-blue-100 p-3 rounded-lg">
                  <div className="font-medium mb-2">
                    📱 {deviceInfo.isIOS ? 'iPhone' : 'スマートフォン'}でのインストール方法:
                  </div>
                  
                  {deviceInfo.isIOS ? (
                    <div className="space-y-1">
                      {deviceInfo.isSafari ? (
                        <>
                          <div>1. 画面下部の 📤 共有ボタンをタップ</div>
                          <div>2. 「ホーム画面に追加」を選択</div>
                          <div>3. 「追加」をタップして完了</div>
                        </>
                      ) : (
                        <>
                          <div>⚠️ Safari でのアクセスが必要です</div>
                          <div>1. Safari を開く</div>
                          <div>2. このURLにアクセス</div>
                          <div>3. 共有ボタン → ホーム画面に追加</div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div>1. ブラウザメニューを開く</div>
                      <div>2. 「ホーム画面に追加」を選択</div>
                      <div>3. アプリ名を確認して「追加」</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* デバイス情報表示 */}
          <div className="text-xs text-gray-500 mt-3 text-center">
            {deviceInfo.browserName} • {deviceInfo.isIOS ? 'iOS' : 'その他'} • 
            {deferredPrompt ? '自動インストール対応' : '手動インストール'}
          </div>
        </CardContent>
      </Card>
    );
  }

  // ボタン版（デフォルト）
  return (
    <div className="space-y-2">
      <Button
        onClick={deferredPrompt ? handleAutoInstall : handleManualInstall}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        {deferredPrompt ? 'アプリをインストール' : 'インストール方法'}
      </Button>
      
      {showInstructionsState && !deferredPrompt && (
        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <div className="font-medium mb-2">
            📱 インストール手順:
          </div>
          
          {deviceInfo.isIOS ? (
            <div className="space-y-1">
              {deviceInfo.isSafari ? (
                <>
                  <div>1. 📤 共有ボタンをタップ</div>
                  <div>2. 「ホーム画面に追加」を選択</div>
                  <div>3. 「追加」をタップ</div>
                </>
              ) : (
                <>
                  <div className="text-orange-600 font-medium">
                    ⚠️ Safari でのアクセスが推奨されます
                  </div>
                  <div>現在: {deviceInfo.browserName}</div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <div>1. ブラウザメニューを開く</div>
              <div>2. 「ホーム画面に追加」を選択</div>
              <div>3. アプリ名を確認して「追加」</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
