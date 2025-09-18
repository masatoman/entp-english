import { EssayHistoryEntry } from "./essayHistoryManager";

export interface ShareOptions {
  platform: 'twitter' | 'facebook' | 'linkedin' | 'copy' | 'image';
  includePrompt: boolean;
  includeStats: boolean;
  customMessage?: string;
}

export interface ShareContent {
  text: string;
  url: string;
  hashtags: string[];
  imageData?: string;
}

/**
 * 英作文SNSシェア管理システム
 * ENTPの成果共有欲求に対応
 */
export class EssayShareManager {
  private static readonly APP_NAME = "ENTP英語学習アプリ";
  private static readonly APP_URL = "https://entp-english.netlify.app";

  /**
   * 英作文をシェア用テキストに変換
   */
  static generateShareContent(
    entry: EssayHistoryEntry,
    options: ShareOptions
  ): ShareContent {
    const { prompt, submission, wordCount, createdAt } = entry;
    
    let shareText = "";
    const hashtags = ["ENTP英語学習", "英作文", "英語学習"];

    // カスタムメッセージがある場合
    if (options.customMessage) {
      shareText += `${options.customMessage}\n\n`;
    }

    // プロンプト情報を含める場合
    if (options.includePrompt) {
      shareText += `📝 課題: ${prompt.title}\n`;
      shareText += `📚 カテゴリ: ${prompt.category} | 難易度: ${prompt.difficulty}\n\n`;
    }

    // 英作文本文
    shareText += `✍️ 私の英作文:\n`;
    shareText += `"${submission.text}"\n\n`;

    // 統計情報を含める場合
    if (options.includeStats) {
      shareText += `📊 統計:\n`;
      shareText += `• 単語数: ${wordCount}語\n`;
      shareText += `• 文法評価: ${submission.evaluation?.grammar || 'N/A'}/100\n`;
      shareText += `• 語彙評価: ${submission.evaluation?.vocabulary || 'N/A'}/100\n`;
      shareText += `• 流暢性: ${submission.evaluation?.fluency || 'N/A'}/100\n\n`;
    }

    // アプリ情報
    shareText += `🚀 ${this.APP_NAME}で英語学習中！\n`;
    shareText += `${this.APP_URL}`;

    // カテゴリに応じたハッシュタグ追加
    switch (prompt.category) {
      case "grammar":
        hashtags.push("英文法", "Grammar");
        break;
      case "vocabulary":
        hashtags.push("英単語", "Vocabulary");
        break;
      case "business":
        hashtags.push("ビジネス英語", "BusinessEnglish");
        break;
      case "toeic":
        hashtags.push("TOEIC", "TOEIC対策");
        break;
    }

    // 難易度に応じたハッシュタグ
    switch (prompt.difficulty) {
      case "beginner":
        hashtags.push("英語初心者");
        break;
      case "intermediate":
        hashtags.push("英語中級");
        break;
      case "advanced":
        hashtags.push("英語上級");
        break;
    }

    return {
      text: shareText,
      url: this.APP_URL,
      hashtags,
      imageData: options.platform === 'image' ? this.generateImageData(entry) : undefined,
    };
  }

  /**
   * プラットフォーム別シェアURL生成
   */
  static generateShareUrl(content: ShareContent, platform: string): string {
    const encodedText = encodeURIComponent(content.text);
    const encodedUrl = encodeURIComponent(content.url);
    const hashtagsText = content.hashtags.map(tag => `#${tag}`).join(' ');
    const encodedHashtags = encodeURIComponent(hashtagsText);

    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodedText}&hashtags=${encodedHashtags.replace('#', '')}`;
      
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
      
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`;
      
      default:
        return content.url;
    }
  }

  /**
   * シェア実行
   */
  static async shareEssay(
    entry: EssayHistoryEntry,
    options: ShareOptions
  ): Promise<boolean> {
    try {
      const content = this.generateShareContent(entry, options);

      switch (options.platform) {
        case 'copy':
          await this.copyToClipboard(content.text);
          break;
        
        case 'image':
          await this.downloadAsImage(entry, content);
          break;
        
        default:
          const shareUrl = this.generateShareUrl(content, options.platform);
          window.open(shareUrl, '_blank', 'width=600,height=400');
          break;
      }

      // シェア回数を増加
      const { EssayHistoryManager } = await import('./essayHistoryManager');
      EssayHistoryManager.incrementShareCount(entry.id);

      console.log(`📤 英作文「${entry.id}」を${options.platform}でシェア`);
      return true;
    } catch (error) {
      console.error("シェアエラー:", error);
      return false;
    }
  }

  /**
   * クリップボードにコピー
   */
  private static async copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      // フォールバック
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  /**
   * 画像として保存
   */
  private static async downloadAsImage(
    entry: EssayHistoryEntry,
    content: ShareContent
  ): Promise<void> {
    // Canvas APIを使用して英作文を画像化
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Canvas context not available');

    // キャンバスサイズ設定
    canvas.width = 800;
    canvas.height = 600;

    // 背景
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // グラデーション背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#e0e7ff');
    gradient.addColorStop(1, '#c7d2fe');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // タイトル
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.APP_NAME, canvas.width / 2, 50);

    // 課題タイトル
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.fillText(`📝 ${entry.prompt.title}`, canvas.width / 2, 90);

    // 英作文本文
    ctx.fillStyle = '#334155';
    ctx.font = '16px Arial, sans-serif';
    ctx.textAlign = 'left';
    
    const lines = this.wrapText(ctx, entry.submission.text, canvas.width - 80);
    lines.forEach((line, index) => {
      ctx.fillText(line, 40, 140 + (index * 25));
    });

    // 統計情報
    const statsY = 140 + (lines.length * 25) + 40;
    ctx.fillStyle = '#64748b';
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText(`📊 単語数: ${entry.wordCount}語 | 作成日: ${new Date(entry.createdAt).toLocaleDateString('ja-JP')}`, 40, statsY);

    // アプリURL
    ctx.fillStyle = '#6366f1';
    ctx.font = '12px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.APP_URL, canvas.width / 2, canvas.height - 30);

    // 画像をダウンロード
    const link = document.createElement('a');
    link.download = `essay-${entry.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  /**
   * テキストを行に分割
   */
  private static wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.slice(0, 15); // 最大15行まで
  }

  /**
   * 画像データ生成（将来の拡張用）
   */
  private static generateImageData(entry: EssayHistoryEntry): string {
    // 将来的にOGP画像生成などに使用
    return '';
  }

  /**
   * シェア可能かチェック
   */
  static canShare(): boolean {
    return typeof navigator !== 'undefined' && 
           (navigator.share !== undefined || navigator.clipboard !== undefined);
  }

  /**
   * Web Share API対応チェック
   */
  static supportsWebShare(): boolean {
    return typeof navigator !== 'undefined' && navigator.share !== undefined;
  }

  /**
   * ネイティブシェア（Web Share API）
   */
  static async nativeShare(entry: EssayHistoryEntry): Promise<boolean> {
    if (!this.supportsWebShare()) return false;

    try {
      const content = this.generateShareContent(entry, {
        platform: 'copy',
        includePrompt: true,
        includeStats: true,
      });

      await navigator.share({
        title: `${this.APP_NAME} - ${entry.prompt.title}`,
        text: content.text,
        url: this.APP_URL,
      });

      // シェア回数を増加
      const { EssayHistoryManager } = await import('./essayHistoryManager');
      EssayHistoryManager.incrementShareCount(entry.id);

      return true;
    } catch (error) {
      console.error("ネイティブシェアエラー:", error);
      return false;
    }
  }
}
