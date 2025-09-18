import {
  Bell,
  BellOff,
  CheckCircle,
  Clock,
  Download,
  Target,
  TestTube,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import {
  AppSettings as AppSettingsType,
  DataManager,
} from "../utils/dataManager";
import {
  notificationManager,
  NotificationSettings,
} from "../utils/notificationManager";
import { SoundManager } from "../utils/soundManager";
import { Button } from "./ui/button";
import { PWAInstallButton } from "./PWAInstallButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";

export default function AppSettings() {
  const navigate = useNavigate();
  useScrollToTop();
  const [settings, setSettings] = useState<AppSettingsType>({
    dailyXPGoal: 100,
    grammarQuizQuestionCount: 10,
    vocabularyQuestionCount: 10,
    essayQuestionCount: 10,
  });

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(notificationManager.getSettings());
  const [permission, setPermission] = useState<NotificationPermission>(
    notificationManager.getPermissionStatus()
  );
  const [isSupported, setIsSupported] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(SoundManager.getEnabled());

  useEffect(() => {
    loadSettings();
    setIsSupported(notificationManager.isSupported());
    setPermission(notificationManager.getPermissionStatus());
  }, []);

  const loadSettings = () => {
    const savedSettings = DataManager.getAppSettings();
    setSettings(savedSettings);
  };

  const saveSettings = (newSettings: Partial<AppSettingsType>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    DataManager.saveAppSettings(updatedSettings);
  };

  const handleSettingChange = (key: keyof AppSettingsType, value: any) => {
    saveSettings({ [key]: value });
  };

  const handleNotificationSettingChange = (
    key: keyof NotificationSettings,
    value: boolean | string
  ) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
    notificationManager.updateSettings(newSettings);
  };

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    SoundManager.setEnabled(enabled);
    if (enabled) {
      SoundManager.sounds.click();
    }
  };

  const handlePermissionRequest = async () => {
    try {
      const newPermission = await notificationManager.requestPermission();
      setPermission(newPermission);
    } catch (error) {
      console.error("Error requesting permission:", error);
      alert(
        "通知の許可を取得できませんでした。ブラウザの設定を確認してください。"
      );
    }
  };

  const handleTestNotification = async () => {
    if (permission !== "granted") {
      alert("通知の許可が必要です。");
      return;
    }

    setIsTesting(true);
    try {
      await notificationManager.testNotification();
    } catch (error) {
      console.error("Error showing test notification:", error);
      alert("テスト通知の表示に失敗しました。");
    } finally {
      setIsTesting(false);
    }
  };

  const getPermissionStatusText = () => {
    switch (permission) {
      case "granted":
        return { text: "許可済み", color: "text-green-600", icon: CheckCircle };
      case "denied":
        return { text: "拒否済み", color: "text-red-600", icon: BellOff };
      default:
        return { text: "未設定", color: "text-yellow-600", icon: Bell };
    }
  };

  const permissionStatus = getPermissionStatusText();
  const StatusIcon = permissionStatus.icon;

  const handleClearData = () => {
    if (
      confirm("すべての学習データを削除しますか？この操作は取り消せません。")
    ) {
      if (confirm("本当に削除しますか？")) {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  const handleExportData = () => {
    try {
      const data = {
        userStats: DataManager.getUserStats(),
        learningHistory: DataManager.getLearningHistory(),
        achievements: DataManager.getAchievements(),
        vocabularyProgress: DataManager.getVocabularyProgress(),
        appSettings: settings,
        notificationSettings: notificationSettings,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `entp-english-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("データのエクスポートに失敗しました。");
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="p-2">
            ←
          </Button>
          <h1 className="text-2xl font-bold">アプリ設定</h1>
          <div className="w-10" />
        </div>

        {/* Learning Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              学習設定
            </CardTitle>
            <CardDescription>学習目標をカスタマイズできます</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Daily XP Goal */}
            <div className="space-y-2">
              <label className="text-sm font-medium">1日のXP目標</label>
              <Select
                value={settings.dailyXPGoal.toString()}
                onValueChange={(value) =>
                  handleSettingChange("dailyXPGoal", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50 XP</SelectItem>
                  <SelectItem value="100">100 XP</SelectItem>
                  <SelectItem value="150">150 XP</SelectItem>
                  <SelectItem value="200">200 XP</SelectItem>
                  <SelectItem value="300">300 XP</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                ホーム画面の進捗バーに反映されます
              </p>
            </div>

            {/* Grammar Quiz Question Count */}
            <div className="space-y-2">
              <label className="text-sm font-medium">文法クイズの問題数</label>
              <Select
                value={settings.grammarQuizQuestionCount.toString()}
                onValueChange={(value) =>
                  handleSettingChange(
                    "grammarQuizQuestionCount",
                    parseInt(value)
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5問</SelectItem>
                  <SelectItem value="10">10問</SelectItem>
                  <SelectItem value="15">15問</SelectItem>
                  <SelectItem value="20">20問</SelectItem>
                  <SelectItem value="25">25問</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                文法クイズで出題される問題数を設定します
              </p>
            </div>

            {/* Vocabulary Question Count */}
            <div className="space-y-2">
              <label className="text-sm font-medium">語彙学習の問題数</label>
              <Select
                value={settings.vocabularyQuestionCount.toString()}
                onValueChange={(value) =>
                  handleSettingChange(
                    "vocabularyQuestionCount",
                    parseInt(value)
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5問</SelectItem>
                  <SelectItem value="10">10問</SelectItem>
                  <SelectItem value="15">15問</SelectItem>
                  <SelectItem value="20">20問</SelectItem>
                  <SelectItem value="25">25問</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                語彙学習で出題される問題数を設定します
              </p>
            </div>

            {/* Essay Question Count */}
            <div className="space-y-2">
              <label className="text-sm font-medium">英作文の問題数</label>
              <Select
                value={settings.essayQuestionCount.toString()}
                onValueChange={(value) =>
                  handleSettingChange("essayQuestionCount", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5問</SelectItem>
                  <SelectItem value="10">10問</SelectItem>
                  <SelectItem value="15">15問</SelectItem>
                  <SelectItem value="20">20問</SelectItem>
                  <SelectItem value="25">25問</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                英作文で出題される問題数を設定します
              </p>
            </div>

            {/* Sound Settings */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sound-enabled">効果音を有効にする</Label>
                <p className="text-sm text-muted-foreground">
                  操作時の効果音を有効/無効にします
                </p>
              </div>
              <Switch
                id="sound-enabled"
                checked={soundEnabled}
                onCheckedChange={handleSoundToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              データ管理
            </CardTitle>
            <CardDescription>学習データのバックアップと管理</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              データをエクスポート
            </Button>
            <Button
              onClick={handleClearData}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              すべてのデータを削除
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        {isSupported ? (
          <>
            {/* Permission Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  通知の許可状況
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIcon
                      className={`w-5 h-5 ${permissionStatus.color}`}
                    />
                    <span className={permissionStatus.color}>
                      {permissionStatus.text}
                    </span>
                  </div>
                  {permission !== "granted" && (
                    <Button onClick={handlePermissionRequest} size="sm">
                      許可をリクエスト
                    </Button>
                  )}
                </div>
                {permission === "denied" && (
                  <p className="text-sm text-red-600 mt-2">
                    通知が拒否されています。ブラウザの設定から許可してください。
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>通知設定</CardTitle>
                <CardDescription>
                  学習のリマインダーや実績通知を設定できます
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Enable Notifications */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-notifications">
                      通知を有効にする
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      すべての通知機能を有効/無効にします
                    </p>
                  </div>
                  <Switch
                    id="enable-notifications"
                    checked={notificationSettings.enabled}
                    onCheckedChange={(checked) =>
                      handleNotificationSettingChange("enabled", checked)
                    }
                    disabled={permission !== "granted"}
                  />
                </div>

                {/* Daily Reminder */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="daily-reminder">
                        毎日の学習リマインダー
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        指定した時間に学習を促す通知を送信します
                      </p>
                    </div>
                    <Switch
                      id="daily-reminder"
                      checked={notificationSettings.dailyReminder}
                      onCheckedChange={(checked) =>
                        handleNotificationSettingChange(
                          "dailyReminder",
                          checked
                        )
                      }
                      disabled={
                        !notificationSettings.enabled ||
                        permission !== "granted"
                      }
                    />
                  </div>

                  {notificationSettings.dailyReminder && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <Label htmlFor="reminder-time">通知時間</Label>
                      <Input
                        id="reminder-time"
                        type="time"
                        value={notificationSettings.reminderTime}
                        onChange={(e) =>
                          handleNotificationSettingChange(
                            "reminderTime",
                            e.target.value
                          )
                        }
                        className="w-32"
                      />
                    </div>
                  )}
                </div>

                {/* Streak Reminder */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="streak-reminder">連続学習記録通知</Label>
                    <p className="text-sm text-muted-foreground">
                      連続学習記録が更新された時に通知します
                    </p>
                  </div>
                  <Switch
                    id="streak-reminder"
                    checked={notificationSettings.streakReminder}
                    onCheckedChange={(checked) =>
                      handleNotificationSettingChange("streakReminder", checked)
                    }
                    disabled={
                      !notificationSettings.enabled || permission !== "granted"
                    }
                  />
                </div>

                {/* Achievement Reminder */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="achievement-reminder">実績解除通知</Label>
                    <p className="text-sm text-muted-foreground">
                      新しい実績を獲得した時に通知します
                    </p>
                  </div>
                  <Switch
                    id="achievement-reminder"
                    checked={notificationSettings.achievementReminder}
                    onCheckedChange={(checked) =>
                      handleNotificationSettingChange(
                        "achievementReminder",
                        checked
                      )
                    }
                    disabled={
                      !notificationSettings.enabled || permission !== "granted"
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Test Notification */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={handleTestNotification}
                  disabled={permission !== "granted" || isTesting}
                  className="w-full"
                  variant="outline"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  {isTesting ? "テスト中..." : "テスト通知を送信"}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  通知が正常に動作するかテストできます
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <BellOff className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  通知機能が利用できません
                </h3>
                <p className="text-sm text-gray-600">
                  お使いのブラウザは通知機能をサポートしていません。
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* PWA インストール */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Download className="w-5 h-5" />
            アプリインストール
          </h2>
          
          <PWAInstallButton variant="card" showInstructions={true} />
          
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">📱 PWA機能について</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">✅ 利用可能な機能</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• オフライン学習</li>
                    <li>• ホーム画面から直接起動</li>
                    <li>• ネイティブアプリのような体験</li>
                    <li>• 自動更新</li>
                    <li>• 学習データの永続保存</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">📱 対応ブラウザ</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• <strong>iPhone</strong>: Safari 推奨</li>
                    <li>• <strong>Android</strong>: Chrome, Edge</li>
                    <li>• <strong>デスクトップ</strong>: Chrome, Edge</li>
                    <li>• <strong>制限</strong>: iOS版サードパーティブラウザ</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>💡 iPhoneユーザーの方へ</strong><br />
                  Brave、Chrome等では制限があります。Safari でアクセスして「共有ボタン → ホーム画面に追加」をお試しください。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
