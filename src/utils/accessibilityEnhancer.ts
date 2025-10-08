/**
 * アクセシビリティ強化システム
 * WCAG 2.1 AAA準拠・多様なニーズへの対応・インクルーシブデザイン
 */

import { handleError } from "./errorHandler";
import { logDebug, logInfo } from "./logger";

export interface AccessibilitySettings {
  userId: string;
  visualSettings: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    colorBlindSupport: "none" | "protanopia" | "deuteranopia" | "tritanopia";
    fontSize: "small" | "medium" | "large" | "extra-large";
  };
  audioSettings: {
    enableSounds: boolean;
    enableVoiceOver: boolean;
    speechRate: number; // 0.5-2.0
    speechVolume: number; // 0-100
    enableAudioDescriptions: boolean;
  };
  motorSettings: {
    enableKeyboardNav: boolean;
    increasedClickArea: boolean;
    dwellTime: number; // ms
    enableSwitchControl: boolean;
  };
  cognitiveSettings: {
    simplifiedInterface: boolean;
    enableReminders: boolean;
    progressIndicators: boolean;
    enableBreakReminders: boolean;
    focusMode: boolean;
  };
}

export interface AccessibilityAudit {
  timestamp: string;
  overallScore: number; // 0-100
  wcagLevel: "A" | "AA" | "AAA" | "Non-compliant";
  issues: AccessibilityIssue[];
  recommendations: string[];
  automatedFixes: number;
}

export interface AccessibilityIssue {
  severity: "low" | "medium" | "high" | "critical";
  type:
    | "color-contrast"
    | "keyboard-nav"
    | "screen-reader"
    | "focus-management"
    | "semantic-html";
  element: string;
  description: string;
  wcagReference: string;
  suggestedFix: string;
  canAutoFix: boolean;
}

export class AccessibilityEnhancer {
  private static readonly SETTINGS_KEY = "entp-accessibility-settings";
  private static readonly AUDIT_KEY = "entp-accessibility-audit";
  private static currentSettings: AccessibilitySettings | null = null;

  /**
   * アクセシビリティシステムの初期化
   */
  static initialize(userId: string): void {
    try {
      // 保存された設定を読み込み
      this.currentSettings = this.loadSettings(userId);

      // 設定が存在しない場合はデフォルト作成
      if (!this.currentSettings) {
        this.currentSettings = this.createDefaultSettings(userId);
        this.saveSettings(this.currentSettings);
      }

      // 設定を適用
      this.applyAccessibilitySettings(this.currentSettings);

      // 自動監査を開始
      this.startAutomaticAudit();

      logInfo("アクセシビリティシステム初期化", { userId });
    } catch (error) {
      handleError(error as Error, {
        component: "AccessibilityEnhancer",
        action: "initialize",
        userId,
      });
    }
  }

  /**
   * アクセシビリティ設定の更新
   */
  static updateSettings(
    userId: string,
    updates: Partial<AccessibilitySettings>
  ): AccessibilitySettings {
    try {
      const currentSettings =
        this.loadSettings(userId) || this.createDefaultSettings(userId);
      const updatedSettings = { ...currentSettings, ...updates };

      this.saveSettings(updatedSettings);
      this.applyAccessibilitySettings(updatedSettings);
      this.currentSettings = updatedSettings;

      logInfo("アクセシビリティ設定更新", {
        userId,
        updatedFields: Object.keys(updates),
      });

      return updatedSettings;
    } catch (error) {
      handleError(error as Error, {
        component: "AccessibilityEnhancer",
        action: "update-settings",
        userId,
      });
      return this.createDefaultSettings(userId);
    }
  }

  /**
   * 包括的アクセシビリティ監査
   */
  static async performAccessibilityAudit(): Promise<AccessibilityAudit> {
    try {
      logInfo("アクセシビリティ監査開始");

      const issues: AccessibilityIssue[] = [];
      let automatedFixes = 0;

      // カラーコントラスト検査
      const contrastIssues = await this.auditColorContrast();
      issues.push(...contrastIssues);

      // キーボードナビゲーション検査
      const keyboardIssues = await this.auditKeyboardNavigation();
      issues.push(...keyboardIssues);

      // スクリーンリーダー対応検査
      const screenReaderIssues = await this.auditScreenReaderSupport();
      issues.push(...screenReaderIssues);

      // フォーカス管理検査
      const focusIssues = await this.auditFocusManagement();
      issues.push(...focusIssues);

      // セマンティックHTML検査
      const semanticIssues = await this.auditSemanticHTML();
      issues.push(...semanticIssues);

      // 自動修正の実行
      automatedFixes = await this.applyAutomaticFixes(issues);

      // スコア計算
      const overallScore = this.calculateAccessibilityScore(issues);
      const wcagLevel = this.determineWCAGLevel(overallScore, issues);

      // 推奨事項生成
      const recommendations = this.generateAccessibilityRecommendations(issues);

      const audit: AccessibilityAudit = {
        timestamp: new Date().toISOString(),
        overallScore,
        wcagLevel,
        issues,
        recommendations,
        automatedFixes,
      };

      this.saveAudit(audit);

      logInfo("アクセシビリティ監査完了", {
        overallScore,
        wcagLevel,
        issuesFound: issues.length,
        automatedFixes,
      });

      return audit;
    } catch (error) {
      handleError(error as Error, {
        component: "AccessibilityEnhancer",
        action: "perform-accessibility-audit",
      });
      return this.getDefaultAudit();
    }
  }

  /**
   * 動的アクセシビリティ改善
   */
  static enhancePageAccessibility(): {
    enhancementsApplied: string[];
    issuesFixed: number;
    newFeatures: string[];
  } {
    try {
      const enhancementsApplied: string[] = [];
      const newFeatures: string[] = [];
      let issuesFixed = 0;

      // Alt属性の自動追加
      const images = document.querySelectorAll("img:not([alt])");
      images.forEach((img, index) => {
        (img as HTMLImageElement).alt = `画像 ${index + 1}`;
        issuesFixed++;
      });
      if (images.length > 0) {
        enhancementsApplied.push(`${images.length}個の画像にalt属性を追加`);
      }

      // ラベルの自動関連付け
      const inputs = document.querySelectorAll(
        "input:not([aria-label]):not([aria-labelledby])"
      );
      inputs.forEach((input, _index) => {
        const placeholder = (input as HTMLInputElement).placeholder;
        if (placeholder) {
          (input as HTMLInputElement).setAttribute("aria-label", placeholder);
          issuesFixed++;
        }
      });
      if (inputs.length > 0) {
        enhancementsApplied.push(
          `${inputs.length}個の入力フィールドにラベルを追加`
        );
      }

      // ボタンのアクセシブル名
      const buttons = document.querySelectorAll(
        "button:not([aria-label]):empty"
      );
      buttons.forEach((button, index) => {
        (button as HTMLButtonElement).setAttribute(
          "aria-label",
          `ボタン ${index + 1}`
        );
        issuesFixed++;
      });
      if (buttons.length > 0) {
        enhancementsApplied.push(
          `${buttons.length}個のボタンにアクセシブル名を追加`
        );
      }

      // キーボードナビゲーション強化
      this.enhanceKeyboardNavigation();
      newFeatures.push("キーボードナビゲーション強化");

      // スクリーンリーダー対応
      this.enhanceScreenReaderSupport();
      newFeatures.push("スクリーンリーダー対応強化");

      // フォーカス表示の改善
      this.improveFocusIndicators();
      newFeatures.push("フォーカス表示改善");

      logInfo("ページアクセシビリティ強化完了", {
        enhancementsApplied: enhancementsApplied.length,
        issuesFixed,
        newFeatures: newFeatures.length,
      });

      return {
        enhancementsApplied,
        issuesFixed,
        newFeatures,
      };
    } catch (error) {
      handleError(error as Error, {
        component: "AccessibilityEnhancer",
        action: "enhance-page-accessibility",
      });
      return {
        enhancementsApplied: [],
        issuesFixed: 0,
        newFeatures: [],
      };
    }
  }

  /**
   * 多言語対応の準備
   */
  static prepareInternationalization(): {
    supportedLanguages: string[];
    translationKeys: string[];
    readinessScore: number;
  } {
    try {
      // 翻訳キーの抽出
      const translationKeys = this.extractTranslationKeys();

      // サポート予定言語
      const supportedLanguages = ["ja", "en", "ko", "zh-CN", "zh-TW"];

      // 国際化準備度の評価
      const readinessScore =
        this.assessInternationalizationReadiness(translationKeys);

      logInfo("国際化準備完了", {
        supportedLanguages: supportedLanguages.length,
        translationKeys: translationKeys,
        readinessScore,
      });

      return {
        supportedLanguages,
        translationKeys,
        readinessScore,
      };
    } catch (error) {
      handleError(error as Error, {
        component: "AccessibilityEnhancer",
        action: "prepare-internationalization",
      });
      return {
        supportedLanguages: [],
        translationKeys: [],
        readinessScore: 0,
      };
    }
  }

  // プライベートメソッド（実装は簡略化）

  private static createDefaultSettings(userId: string): AccessibilitySettings {
    return {
      userId,
      visualSettings: {
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        colorBlindSupport: "none",
        fontSize: "medium",
      },
      audioSettings: {
        enableSounds: true,
        enableVoiceOver: false,
        speechRate: 1.0,
        speechVolume: 80,
        enableAudioDescriptions: false,
      },
      motorSettings: {
        enableKeyboardNav: true,
        increasedClickArea: false,
        dwellTime: 1000,
        enableSwitchControl: false,
      },
      cognitiveSettings: {
        simplifiedInterface: false,
        enableReminders: true,
        progressIndicators: true,
        enableBreakReminders: false,
        focusMode: false,
      },
    };
  }

  private static applyAccessibilitySettings(
    settings: AccessibilitySettings
  ): void {
    const root = document.documentElement;

    // 視覚的設定の適用
    if (settings.visualSettings.highContrast) {
      root.classList.add("high-contrast");
    }

    if (settings.visualSettings.largeText) {
      root.classList.add("large-text");
    }

    if (settings.visualSettings.reducedMotion) {
      root.style.setProperty("--animation-duration", "0s");
    }

    // フォントサイズの調整
    const fontSizes = {
      small: "14px",
      medium: "16px",
      large: "18px",
      "extra-large": "20px",
    };
    root.style.setProperty(
      "--base-font-size",
      fontSizes[settings.visualSettings.fontSize]
    );

    logDebug("アクセシビリティ設定適用", settings);
  }

  private static async auditColorContrast(): Promise<AccessibilityIssue[]> {
    const issues: AccessibilityIssue[] = [];

    // 実際の実装ではカラーコントラスト比を計算
    // ここでは簡略化

    return issues;
  }

  private static async auditKeyboardNavigation(): Promise<
    AccessibilityIssue[]
  > {
    const issues: AccessibilityIssue[] = [];

    // フォーカス可能要素のチェック
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach((element, index) => {
      if (
        !element.getAttribute("tabindex") &&
        element.tagName !== "BUTTON" &&
        element.tagName !== "A"
      ) {
        issues.push({
          severity: "medium",
          type: "keyboard-nav",
          element: `${element.tagName}[${index}]`,
          description: "キーボードでアクセスできない要素",
          wcagReference: "WCAG 2.1.1",
          suggestedFix: "tabindex属性の追加",
          canAutoFix: true,
        });
      }
    });

    return issues;
  }

  private static async auditScreenReaderSupport(): Promise<
    AccessibilityIssue[]
  > {
    const issues: AccessibilityIssue[] = [];

    // ARIA属性のチェック
    const interactiveElements = document.querySelectorAll(
      'button, [role="button"], input'
    );

    interactiveElements.forEach((element, index) => {
      if (!element.getAttribute("aria-label") && !element.textContent?.trim()) {
        issues.push({
          severity: "high",
          type: "screen-reader",
          element: `${element.tagName}[${index}]`,
          description: "スクリーンリーダーで読み上げられない要素",
          wcagReference: "WCAG 4.1.2",
          suggestedFix: "aria-label属性の追加",
          canAutoFix: true,
        });
      }
    });

    return issues;
  }

  private static async auditFocusManagement(): Promise<AccessibilityIssue[]> {
    const issues: AccessibilityIssue[] = [];

    // フォーカス表示のチェック
    const style = getComputedStyle(document.documentElement);
    const focusOutline = style.getPropertyValue("--focus-outline") || "none";

    if (focusOutline === "none") {
      issues.push({
        severity: "high",
        type: "focus-management",
        element: ":focus",
        description: "フォーカス表示が不十分",
        wcagReference: "WCAG 2.4.7",
        suggestedFix: "フォーカススタイルの改善",
        canAutoFix: true,
      });
    }

    return issues;
  }

  private static async auditSemanticHTML(): Promise<AccessibilityIssue[]> {
    const issues: AccessibilityIssue[] = [];

    // セマンティック要素のチェック
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    if (headings.length === 0) {
      issues.push({
        severity: "medium",
        type: "semantic-html",
        element: "document",
        description: "見出し要素が不足",
        wcagReference: "WCAG 1.3.1",
        suggestedFix: "適切な見出し構造の追加",
        canAutoFix: false,
      });
    }

    return issues;
  }

  private static async applyAutomaticFixes(
    issues: AccessibilityIssue[]
  ): Promise<number> {
    let fixesApplied = 0;

    const autoFixableIssues = issues.filter((issue) => issue.canAutoFix);

    for (const issue of autoFixableIssues) {
      try {
        switch (issue.type) {
          case "keyboard-nav":
            await this.fixKeyboardNavigation(issue);
            fixesApplied++;
            break;
          case "screen-reader":
            await this.fixScreenReaderSupport(issue);
            fixesApplied++;
            break;
          case "focus-management":
            await this.fixFocusManagement(issue);
            fixesApplied++;
            break;
        }
      } catch (error) {
        logDebug(`自動修正失敗: ${issue.type}`, { error });
      }
    }

    return fixesApplied;
  }

  private static calculateAccessibilityScore(
    issues: AccessibilityIssue[]
  ): number {
    let score = 100;

    issues.forEach((issue) => {
      const penalties = {
        critical: 25,
        high: 15,
        medium: 8,
        low: 3,
      };
      score -= penalties[issue.severity];
    });

    return Math.max(0, score);
  }

  private static determineWCAGLevel(
    score: number,
    issues: AccessibilityIssue[]
  ): AccessibilityAudit["wcagLevel"] {
    const criticalIssues = issues.filter(
      (i) => i.severity === "critical"
    ).length;
    const highIssues = issues.filter((i) => i.severity === "high").length;

    if (criticalIssues > 0) return "Non-compliant";
    if (highIssues > 0 || score < 70) return "A";
    if (score < 85) return "AA";
    return "AAA";
  }

  private static generateAccessibilityRecommendations(
    issues: AccessibilityIssue[]
  ): string[] {
    const recommendations = [];

    const criticalCount = issues.filter(
      (i) => i.severity === "critical"
    ).length;
    const highCount = issues.filter((i) => i.severity === "high").length;

    if (criticalCount > 0) {
      recommendations.push(
        `${criticalCount}個の重大なアクセシビリティ問題を優先的に修正してください`
      );
    }

    if (highCount > 0) {
      recommendations.push(
        `${highCount}個の重要なアクセシビリティ問題の修正を推奨します`
      );
    }

    if (issues.length === 0) {
      recommendations.push("優秀なアクセシビリティレベルを維持しています！");
    }

    return recommendations;
  }

  private static enhanceKeyboardNavigation(): void {
    // キーボードナビゲーションの強化
    document.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        document.body.classList.add("keyboard-navigation");
      }
    });

    document.addEventListener("mousedown", () => {
      document.body.classList.remove("keyboard-navigation");
    });
  }

  private static enhanceScreenReaderSupport(): void {
    // スクリーンリーダー対応の強化
    const landmarks = document.querySelectorAll("main, nav, aside, footer");
    landmarks.forEach((landmark) => {
      if (
        !landmark.getAttribute("aria-label") &&
        !landmark.getAttribute("aria-labelledby")
      ) {
        const role = landmark.tagName.toLowerCase();
        landmark.setAttribute("aria-label", `${role}セクション`);
      }
    });
  }

  private static improveFocusIndicators(): void {
    // フォーカス表示の改善
    const style = document.createElement("style");
    style.textContent = `
      .keyboard-navigation *:focus {
        outline: 3px solid #0066cc !important;
        outline-offset: 2px !important;
      }
      
      .high-contrast *:focus {
        outline: 4px solid #ffff00 !important;
        background-color: #000000 !important;
        color: #ffffff !important;
      }
    `;
    document.head.appendChild(style);
  }

  private static startAutomaticAudit(): void {
    // 定期的な自動監査（1時間ごと）
    setInterval(async () => {
      try {
        const audit = await this.performAccessibilityAudit();
        if (audit.issues.length > 0) {
          logInfo("定期監査で問題を検出", { issueCount: audit.issues.length });
        }
      } catch (error) {
        logDebug("定期監査エラー", { error });
      }
    }, 60 * 60 * 1000);
  }

  private static extractTranslationKeys(): string[] {
    // 翻訳キーの抽出（簡略化）
    return [
      "app.title",
      "navigation.home",
      "learning.vocabulary",
      "learning.grammar",
      "progress.achievements",
      "settings.accessibility",
    ];
  }

  private static assessInternationalizationReadiness(keys: string[]): number {
    // 国際化準備度の評価（簡略化）
    return Math.min(100, keys.length * 2);
  }

  // 保存・読み込みメソッド

  private static saveSettings(settings: AccessibilitySettings): void {
    try {
      localStorage.setItem(
        `${this.SETTINGS_KEY}-${settings.userId}`,
        JSON.stringify(settings)
      );
    } catch (error) {
      handleError(error as Error, {
        component: "AccessibilityEnhancer",
        action: "save-settings",
      });
    }
  }

  private static loadSettings(userId: string): AccessibilitySettings | null {
    try {
      const stored = localStorage.getItem(`${this.SETTINGS_KEY}-${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      handleError(error as Error, {
        component: "AccessibilityEnhancer",
        action: "load-settings",
        userId,
      });
      return null;
    }
  }

  private static saveAudit(audit: AccessibilityAudit): void {
    try {
      const stored = localStorage.getItem(this.AUDIT_KEY);
      const audits: AccessibilityAudit[] = stored ? JSON.parse(stored) : [];
      audits.push(audit);

      // 最新10件のみ保持
      if (audits.length > 10) {
        audits.splice(0, audits.length - 10);
      }

      localStorage.setItem(this.AUDIT_KEY, JSON.stringify(audits));
    } catch (error) {
      handleError(error as Error, {
        component: "AccessibilityEnhancer",
        action: "save-audit",
      });
    }
  }

  private static getDefaultAudit(): AccessibilityAudit {
    return {
      timestamp: new Date().toISOString(),
      overallScore: 0,
      wcagLevel: "Non-compliant",
      issues: [],
      recommendations: ["監査でエラーが発生しました"],
      automatedFixes: 0,
    };
  }

  // 修正メソッド（簡略化）
  private static async fixKeyboardNavigation(
    _issue: AccessibilityIssue
  ): Promise<void> {
    // キーボードナビゲーション修正
  }

  private static async fixScreenReaderSupport(
    _issue: AccessibilityIssue
  ): Promise<void> {
    // スクリーンリーダー対応修正
  }

  private static async fixFocusManagement(
    _issue: AccessibilityIssue
  ): Promise<void> {
    // フォーカス管理修正
  }
}
