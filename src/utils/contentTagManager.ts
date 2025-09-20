/**
 * コンテンツタグ管理システム
 * 事前学習と問題演習をタグで紐づけ、適切な学習フローを提供
 */

import { Category } from "../types";

export interface ContentTag {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  category: 'skill' | 'topic' | 'difficulty' | 'format';
}

export interface TaggedContent {
  contentId: string;
  contentType: 'pre-study' | 'grammar-quiz' | 'vocabulary' | 'writing' | 'listening';
  tags: string[];
  category?: Category;
  difficulty?: 'easy' | 'normal' | 'hard';
  url: string;
  title: string;
  description: string;
}

/**
 * 学習コンテンツのタグ定義
 */
export const CONTENT_TAGS: Record<string, ContentTag> = {
  // スキル系タグ
  'vocabulary': {
    id: 'vocabulary',
    name: '語彙',
    color: 'bg-blue-100 text-blue-800',
    icon: '📚',
    description: '語彙力向上のためのコンテンツ',
    category: 'skill'
  },
  'grammar': {
    id: 'grammar',
    name: '文法',
    color: 'bg-green-100 text-green-800',
    icon: '📝',
    description: '文法理解のためのコンテンツ',
    category: 'skill'
  },
  'writing': {
    id: 'writing',
    name: '英作文',
    color: 'bg-purple-100 text-purple-800',
    icon: '✍️',
    description: '英作文スキル向上のためのコンテンツ',
    category: 'skill'
  },
  'listening': {
    id: 'listening',
    name: 'リスニング',
    color: 'bg-orange-100 text-orange-800',
    icon: '👂',
    description: 'リスニング力向上のためのコンテンツ',
    category: 'skill'
  },

  // トピック系タグ
  'toeic': {
    id: 'toeic',
    name: 'TOEIC',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '🎯',
    description: 'TOEIC対策のためのコンテンツ',
    category: 'topic'
  },
  'business': {
    id: 'business',
    name: 'ビジネス',
    color: 'bg-gray-100 text-gray-800',
    icon: '💼',
    description: 'ビジネス英語のためのコンテンツ',
    category: 'topic'
  },
  'basic-grammar': {
    id: 'basic-grammar',
    name: '基本文型',
    color: 'bg-indigo-100 text-indigo-800',
    icon: '🏗️',
    description: '英語の基本文型に関するコンテンツ',
    category: 'topic'
  },
  'svo': {
    id: 'svo',
    name: 'SVO',
    color: 'bg-blue-100 text-blue-800',
    icon: '🔗',
    description: 'SVO文型に関するコンテンツ',
    category: 'topic'
  },
  'tenses': {
    id: 'tenses',
    name: '時制',
    color: 'bg-green-100 text-green-800',
    icon: '⏰',
    description: '時制に関するコンテンツ',
    category: 'topic'
  },
  'modals': {
    id: 'modals',
    name: '助動詞',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '🔧',
    description: '助動詞に関するコンテンツ',
    category: 'topic'
  },

  // 難易度系タグ
  'beginner': {
    id: 'beginner',
    name: '初級',
    color: 'bg-green-100 text-green-800',
    icon: '🌱',
    description: '初級者向けのコンテンツ',
    category: 'difficulty'
  },
  'intermediate': {
    id: 'intermediate',
    name: '中級',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '🌿',
    description: '中級者向けのコンテンツ',
    category: 'difficulty'
  },
  'advanced': {
    id: 'advanced',
    name: '上級',
    color: 'bg-red-100 text-red-800',
    icon: '🌳',
    description: '上級者向けのコンテンツ',
    category: 'difficulty'
  },

  // 形式系タグ
  'theory': {
    id: 'theory',
    name: '理論',
    color: 'bg-purple-100 text-purple-800',
    icon: '📖',
    description: '理論的な学習コンテンツ',
    category: 'format'
  },
  'practice': {
    id: 'practice',
    name: '実践',
    color: 'bg-orange-100 text-orange-800',
    icon: '🎯',
    description: '実践的な問題演習',
    category: 'format'
  },
  'quiz': {
    id: 'quiz',
    name: 'クイズ',
    color: 'bg-pink-100 text-pink-800',
    icon: '❓',
    description: 'クイズ形式の学習コンテンツ',
    category: 'format'
  },
  'card': {
    id: 'card',
    name: 'カード',
    color: 'bg-cyan-100 text-cyan-800',
    icon: '🃏',
    description: 'カード形式の学習コンテンツ',
    category: 'format'
  }
};

/**
 * 全コンテンツのタグ付け情報
 */
export const TAGGED_CONTENTS: TaggedContent[] = [
  // 事前学習コンテンツ
  {
    contentId: 'basic-grammar-theory',
    contentType: 'pre-study',
    tags: ['grammar', 'basic-grammar', 'theory', 'beginner'],
    category: 'basic-grammar',
    url: '/learning/pre-study/content/basic-grammar-theory',
    title: '英文の基本構造：SVO完全マスター',
    description: '英語の5文型を理解し、基本的な文の構造を学習'
  },
  {
    contentId: 'tenses-theory-part1',
    contentType: 'pre-study',
    tags: ['grammar', 'tenses', 'theory', 'beginner'],
    category: 'tenses',
    url: '/learning/pre-study/content/tenses-theory-part1',
    title: '時制の完全マスター：基礎編',
    description: '現在・過去・未来時制の基本的な使い方'
  },
  {
    contentId: 'tenses-theory-part2',
    contentType: 'pre-study',
    tags: ['grammar', 'tenses', 'theory', 'intermediate'],
    category: 'tenses',
    url: '/learning/pre-study/content/tenses-theory-part2',
    title: '時制の完全マスター：応用編',
    description: '完了形・進行形の高度な使い方'
  },
  {
    contentId: 'modals-theory',
    contentType: 'pre-study',
    tags: ['grammar', 'modals', 'theory', 'intermediate'],
    category: 'modals',
    url: '/learning/pre-study/content/modals-theory',
    title: '助動詞の基本',
    description: 'can、will、shouldなどの助動詞の使い分け'
  },
  {
    contentId: 'toeic-vocabulary-strategy',
    contentType: 'pre-study',
    tags: ['vocabulary', 'toeic', 'business', 'theory', 'intermediate'],
    url: '/learning/pre-study/content/toeic-vocabulary-strategy',
    title: 'TOEIC語彙攻略法',
    description: 'TOEICで頻出するビジネス語彙の効率的学習法'
  },
  {
    contentId: 'writing-strategy',
    contentType: 'pre-study',
    tags: ['writing', 'grammar', 'theory', 'intermediate'],
    url: '/learning/pre-study/content/writing-strategy',
    title: '英作文で高得点を取る方法',
    description: '効果的な英作文の構成と表現技法'
  },

  // 文法クイズコンテンツ
  {
    contentId: 'basic-grammar-quiz',
    contentType: 'grammar-quiz',
    tags: ['grammar', 'basic-grammar', 'svo', 'practice', 'quiz'],
    category: 'basic-grammar',
    url: '/learning/grammar/pattern/basic-grammar',
    title: '基本文型クイズ',
    description: '英語の基本文型を実践で確認'
  },
  {
    contentId: 'tenses-quiz',
    contentType: 'grammar-quiz',
    tags: ['grammar', 'tenses', 'practice', 'quiz'],
    category: 'tenses',
    url: '/learning/grammar/difficulty/tenses',
    title: '時制クイズ',
    description: '時制の理解を問題で確認'
  },
  {
    contentId: 'modals-quiz',
    contentType: 'grammar-quiz',
    tags: ['grammar', 'modals', 'practice', 'quiz'],
    category: 'modals',
    url: '/learning/grammar/difficulty/modals',
    title: '助動詞クイズ',
    description: '助動詞の使い分けを実践で学習'
  },

  // 語彙学習コンテンツ
  {
    contentId: 'vocabulary-basic',
    contentType: 'vocabulary',
    tags: ['vocabulary', 'practice', 'card', 'beginner'],
    url: '/learning/vocabulary/actualCategory',
    title: '語彙学習（基礎）',
    description: '基本的な英単語をカード形式で学習'
  },
  {
    contentId: 'vocabulary-toeic',
    contentType: 'vocabulary',
    tags: ['vocabulary', 'toeic', 'business', 'practice', 'card', 'intermediate'],
    url: '/learning/vocabulary/actualCategory',
    title: 'TOEIC語彙学習',
    description: 'TOEIC頻出語彙をカード形式で学習'
  },
  {
    contentId: 'vocabulary-business',
    contentType: 'vocabulary',
    tags: ['vocabulary', 'business', 'practice', 'card', 'intermediate'],
    url: '/learning/vocabulary/actualCategory',
    title: 'ビジネス語彙学習',
    description: 'ビジネス場面で使用される語彙を学習'
  },

  // 英作文コンテンツ
  {
    contentId: 'writing-practice',
    contentType: 'writing',
    tags: ['writing', 'grammar', 'practice'],
    url: '/learning/writing/category',
    title: '英作文練習',
    description: '実際に英文を作成して表現力を向上'
  }
];

/**
 * コンテンツタグ管理クラス
 */
export class ContentTagManager {
  private static instance: ContentTagManager;

  static getInstance(): ContentTagManager {
    if (!ContentTagManager.instance) {
      ContentTagManager.instance = new ContentTagManager();
    }
    return ContentTagManager.instance;
  }

  /**
   * タグに基づいて関連コンテンツを検索
   */
  findRelatedContent(
    currentContentId: string,
    excludeTypes: string[] = []
  ): TaggedContent[] {
    const currentContent = TAGGED_CONTENTS.find(c => c.contentId === currentContentId);
    if (!currentContent) return [];

    const currentTags = currentContent.tags;
    
    return TAGGED_CONTENTS
      .filter(content => {
        // 自分自身は除外
        if (content.contentId === currentContentId) return false;
        
        // 除外タイプがあれば除外
        if (excludeTypes.includes(content.contentType)) return false;
        
        // タグの重複度を計算
        const commonTags = content.tags.filter(tag => currentTags.includes(tag));
        return commonTags.length > 0;
      })
      .sort((a, b) => {
        // タグの重複度で並び替え
        const aCommon = a.tags.filter(tag => currentTags.includes(tag)).length;
        const bCommon = b.tags.filter(tag => currentTags.includes(tag)).length;
        return bCommon - aCommon;
      });
  }

  /**
   * 事前学習完了後の推奨コンテンツを取得
   */
  getRecommendedPracticeContent(preStudyContentId: string): TaggedContent[] {
    const practiceContent = this.findRelatedContent(
      preStudyContentId,
      ['pre-study'] // 事前学習は除外
    );

    // 実践系コンテンツを優先
    return practiceContent.sort((a, b) => {
      const practiceTypes = ['grammar-quiz', 'vocabulary', 'writing'];
      const aScore = practiceTypes.includes(a.contentType) ? 1 : 0;
      const bScore = practiceTypes.includes(b.contentType) ? 1 : 0;
      return bScore - aScore;
    });
  }

  /**
   * 特定のタグを持つコンテンツを検索
   */
  findContentByTags(tags: string[], contentType?: string): TaggedContent[] {
    return TAGGED_CONTENTS.filter(content => {
      if (contentType && content.contentType !== contentType) return false;
      return tags.some(tag => content.tags.includes(tag));
    });
  }

  /**
   * コンテンツの最適な遷移先を決定
   */
  getOptimalNextContent(currentContentId: string): TaggedContent | null {
    const recommended = this.getRecommendedPracticeContent(currentContentId);
    
    if (recommended.length === 0) return null;

    // 最もタグが重複しているコンテンツを返す
    return recommended[0];
  }

  /**
   * タグの表示用情報を取得
   */
  getTagDisplayInfo(tagId: string): ContentTag | null {
    return CONTENT_TAGS[tagId] || null;
  }

  /**
   * コンテンツのタグ情報を取得
   */
  getContentTags(contentId: string): ContentTag[] {
    const content = TAGGED_CONTENTS.find(c => c.contentId === contentId);
    if (!content) return [];

    return content.tags
      .map(tagId => CONTENT_TAGS[tagId])
      .filter(tag => tag !== undefined);
  }

  /**
   * 学習パスの推奨順序を取得
   */
  getRecommendedLearningPath(startingTags: string[]): TaggedContent[] {
    // 理論 → 実践の順序で並び替え
    const relatedContent = this.findContentByTags(startingTags);
    
    return relatedContent.sort((a, b) => {
      const typeOrder = {
        'pre-study': 1,
        'grammar-quiz': 2,
        'vocabulary': 3,
        'writing': 4,
        'listening': 5
      };
      
      return (typeOrder[a.contentType] || 999) - (typeOrder[b.contentType] || 999);
    });
  }
}

// シングルトンインスタンスをエクスポート
export const contentTagManager = ContentTagManager.getInstance();
