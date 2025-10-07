import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Bell, BellOff, Clock, TestTube, CheckCircle } from 'lucide-react';
import { notificationManager, NotificationSettings as NotificationSettingsType } from '../utils/notificationManager';

interface NotificationSettingsProps {
  onBack: () => void;
}

export function NotificationSettings({ onBack }: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSettingsType>(notificationManager.getSettings());
  const [permission, setPermission] = useState<NotificationPermission>(notificationManager.getPermissionStatus());
  const [isSupported, setIsSupported] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    setIsSupported(notificationManager.isSupported());
    setPermission(notificationManager.getPermissionStatus());
  }, []);

  const handlePermissionRequest = async () => {
    try {
      const newPermission = await notificationManager.requestPermission();
      setPermission(newPermission);
    } catch (error) {
      console.error('Error requesting permission:', error);
      alert('通知の許可を取得できませんでした。ブラウザの設定を確認してください。');
    }
  };

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean | string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    notificationManager.updateSettings(newSettings);
  };

  const handleTestNotification = async () => {
    if (permission !== 'granted') {
      alert('通知の許可が必要です。');
      return;
    }

    setIsTesting(true);
    try {
      await notificationManager.testNotification();
    } catch (error) {
      console.error('Error showing test notification:', error);
      alert('テスト通知の表示に失敗しました。');
    } finally {
      setIsTesting(false);
    }
  };

  const getPermissionStatusText = () => {
    switch (permission) {
      case 'granted':
        return { text: '許可済み', color: 'text-green-600', icon: CheckCircle };
      case 'denied':
        return { text: '拒否済み', color: 'text-red-600', icon: BellOff };
      default:
        return { text: '未設定', color: 'text-yellow-600', icon: Bell };
    }
  };

  const permissionStatus = getPermissionStatusText();
  const StatusIcon = permissionStatus.icon;

  if (!isSupported) {
    return (
      <div className="min-h-screen p-4 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full space-y-6">
          <div className="text-center">
            <BellOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">通知機能が利用できません</h1>
            <p className="text-gray-600 mb-6">
              お使いのブラウザは通知機能をサポートしていません。
            </p>
            <Button onClick={onBack} variant="outline">
              戻る
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="p-2">
            ←
          </Button>
          <h1 className="text-2xl font-bold">通知設定</h1>
          <div className="w-10" />
        </div>

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
                <StatusIcon className={`w-5 h-5 ${permissionStatus.color}`} />
                <span className={permissionStatus.color}>{permissionStatus.text}</span>
              </div>
              {permission !== 'granted' && (
                <Button onClick={handlePermissionRequest} size="sm">
                  許可をリクエスト
                </Button>
              )}
            </div>
            {permission === 'denied' && (
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
                <Label htmlFor="enable-notifications">通知を有効にする</Label>
                <p className="text-sm text-muted-foreground">
                  すべての通知機能を有効/無効にします
                </p>
              </div>
              <Switch
                id="enable-notifications"
                checked={settings.enabled}
                onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
                disabled={permission !== 'granted'}
              />
            </div>

            {/* Daily Reminder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="daily-reminder">毎日の学習リマインダー</Label>
                  <p className="text-sm text-muted-foreground">
                    指定した時間に学習を促す通知を送信します
                  </p>
                </div>
                <Switch
                  id="daily-reminder"
                  checked={settings.dailyReminder}
                  onCheckedChange={(checked) => handleSettingChange('dailyReminder', checked)}
                  disabled={!settings.enabled || permission !== 'granted'}
                />
              </div>

              {settings.dailyReminder && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="reminder-time">通知時間</Label>
                  <Input
                    id="reminder-time"
                    type="time"
                    value={settings.reminderTime}
                    onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
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
                checked={settings.streakReminder}
                onCheckedChange={(checked) => handleSettingChange('streakReminder', checked)}
                disabled={!settings.enabled || permission !== 'granted'}
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
                checked={settings.achievementReminder}
                onCheckedChange={(checked) => handleSettingChange('achievementReminder', checked)}
                disabled={!settings.enabled || permission !== 'granted'}
              />
            </div>
          </CardContent>
        </Card>

        {/* Test Notification */}
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={handleTestNotification}
              disabled={permission !== 'granted' || isTesting}
              className="w-full"
              variant="outline"
            >
              <TestTube className="w-4 h-4 mr-2" />
              {isTesting ? 'テスト中...' : 'テスト通知を送信'}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              通知が正常に動作するかテストできます
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
