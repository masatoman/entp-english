// Push Notification Manager
export interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  reminderTime: string; // HH:MM format
  streakReminder: boolean;
  achievementReminder: boolean;
}

export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

class NotificationManager {
  private static instance: NotificationManager;
  private settings: NotificationSettings;
  private reminderTimeoutId: NodeJS.Timeout | null = null;

  private constructor() {
    this.settings = this.loadSettings();
  }

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  // Check if notifications are supported
  public isSupported(): boolean {
    return "Notification" in window && "serviceWorker" in navigator;
  }

  // Check current permission status
  public getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }

  // Request notification permission
  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error("Notifications are not supported in this browser");
    }

    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);
    return permission;
  }

  // Show immediate notification
  public async showNotification(data: NotificationData): Promise<void> {
    if (!this.isSupported()) {
      throw new Error("Notifications are not supported");
    }

    if (Notification.permission !== "granted") {
      throw new Error("Notification permission not granted");
    }

    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon || "/pwa-192x192.png",
        badge: data.badge || "/pwa-192x192.png",
        tag: data.tag || "default",
        requireInteraction: data.requireInteraction || false,
      });
    } else {
      // Fallback to regular notification
      new Notification(data.title, {
        body: data.body,
        icon: data.icon || "/pwa-192x192.png",
        tag: data.tag || "default",
      });
    }
  }

  // Schedule daily reminder
  public scheduleDailyReminder(): void {
    this.clearDailyReminder();

    if (!this.settings.dailyReminder || !this.settings.enabled) {
      return;
    }

    const [hours, minutes] = this.settings.reminderTime.split(":").map(Number);
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);

    // If reminder time has passed today, schedule for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const delay = reminderTime.getTime() - now.getTime();

    this.reminderTimeoutId = setTimeout(() => {
      this.showNotification({
        title: "ENTP英語学習アプリ",
        body: "学習の時間です！今日も頑張りましょう 🎯",
        tag: "daily-reminder",
      });

      // Schedule next reminder
      this.scheduleDailyReminder();
    }, delay);

    console.log("Daily reminder scheduled for:", reminderTime);
  }

  // Clear daily reminder
  public clearDailyReminder(): void {
    if (this.reminderTimeoutId) {
      clearTimeout(this.reminderTimeoutId);
      this.reminderTimeoutId = null;
    }
  }

  // Show streak reminder
  public async showStreakReminder(days: number): Promise<void> {
    if (!this.settings.streakReminder || !this.settings.enabled) {
      return;
    }

    await this.showNotification({
      title: "連続学習記録更新！",
      body: `${days}日連続学習中です！この調子で頑張りましょう 🔥`,
      tag: "streak-reminder",
    });
  }

  // Show achievement notification
  public async showAchievementNotification(
    achievementName: string
  ): Promise<void> {
    if (!this.settings.achievementReminder || !this.settings.enabled) {
      return;
    }

    await this.showNotification({
      title: "実績解除！",
      body: `「${achievementName}」を獲得しました！🎉`,
      tag: "achievement-notification",
    });
  }

  // Show learning reminder
  public async showLearningReminder(): Promise<void> {
    await this.showNotification({
      title: "学習リマインダー",
      body: "今日の学習はまだですか？少しでも進めましょう 📚",
      tag: "learning-reminder",
    });
  }

  // Update settings
  public updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();

    // Reschedule reminder if settings changed
    if (
      newSettings.dailyReminder !== undefined ||
      newSettings.reminderTime !== undefined ||
      newSettings.enabled !== undefined
    ) {
      this.scheduleDailyReminder();
    }
  }

  // Get current settings
  public getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  // Load settings from localStorage
  private loadSettings(): NotificationSettings {
    const defaultSettings: NotificationSettings = {
      enabled: false,
      dailyReminder: false,
      reminderTime: "19:00",
      streakReminder: true,
      achievementReminder: true,
    };

    try {
      const saved = localStorage.getItem("notification-settings");
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
    }

    return defaultSettings;
  }

  // Save settings to localStorage
  public saveSettings(): void {
    try {
      localStorage.setItem(
        "notification-settings",
        JSON.stringify(this.settings)
      );
    } catch (error) {
      console.error("Error saving notification settings:", error);
    }
  }

  // Test notification
  public async testNotification(): Promise<void> {
    await this.showNotification({
      title: "テスト通知",
      body: "プッシュ通知が正常に動作しています！",
      tag: "test-notification",
    });
  }
}

export const notificationManager = NotificationManager.getInstance();
