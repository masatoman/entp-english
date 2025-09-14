import { describe, it, expect } from 'vitest'
import { 
  isFeatureUnlocked, 
  getAvailableFeatures, 
  getNextUnlockableFeatures,
  FEATURE_DEFINITIONS
} from '../../utils/featureUnlockSystem'

describe('Feature Unlock System', () => {
  const mockUserStats = {
    totalXP: 200,
    currentStreak: 5,
    longestStreak: 10,
    vocabularyStudied: 20,
    grammarQuizzesCompleted: 15,
    totalQuestionsAnswered: 100,
    correctAnswers: 80,
    averageScore: 80,
    lastStudyDate: '2023-12-20',
    todayXP: 50,
    totalStudyTime: 3600,
    accuracy: 80,
    streakDays: 5,
    unlockedAchievements: ['vocabulary-beginner', 'grammar-easy']
  }

  describe('isFeatureUnlocked', () => {
    it('基本機能が正しくアンロック判定される', () => {
      // 語彙学習（常にアンロック）
      expect(isFeatureUnlocked('vocabulary-beginner', 1, 0, 0, [])).toBe(true)
      
      // 文法クイズ（常にアンロック）
      expect(isFeatureUnlocked('grammar-easy', 1, 0, 0, [])).toBe(true)
    })

    it('レベル条件でアンロック判定される', () => {
      // レベル2でアンロックされる機能
      expect(isFeatureUnlocked('essay-beginner', 2, 100, 5, [])).toBe(true)
      expect(isFeatureUnlocked('essay-beginner', 1, 100, 5, [])).toBe(false)
    })

    it('XP条件でアンロック判定される', () => {
      // 200XPでアンロックされる機能
      expect(isFeatureUnlocked('combined-test', 1, 200, 5, [])).toBe(true)
      expect(isFeatureUnlocked('combined-test', 1, 150, 5, [])).toBe(false)
    })

    it('ストリーク条件でアンロック判定される', () => {
      // 7日連続でアンロックされる機能
      expect(isFeatureUnlocked('time-attack', 1, 100, 7, [])).toBe(true)
      expect(isFeatureUnlocked('time-attack', 1, 100, 5, [])).toBe(false)
    })

    it('実績条件でアンロック判定される', () => {
      // 特定の実績でアンロックされる機能
      expect(isFeatureUnlocked('advanced-vocabulary', 1, 100, 5, ['vocabulary-master'])).toBe(true)
      expect(isFeatureUnlocked('advanced-vocabulary', 1, 100, 5, [])).toBe(false)
    })

    it('複数条件の組み合わせでアンロック判定される', () => {
      // レベル2 AND 200XP AND 7日連続
      expect(isFeatureUnlocked('advanced-grammar', 2, 200, 7, [])).toBe(true)
      expect(isFeatureUnlocked('advanced-grammar', 1, 200, 7, [])).toBe(false)
      expect(isFeatureUnlocked('advanced-grammar', 2, 150, 7, [])).toBe(false)
      expect(isFeatureUnlocked('advanced-grammar', 2, 200, 5, [])).toBe(false)
    })

    it('存在しない機能はfalseを返す', () => {
      expect(isFeatureUnlocked('non-existent-feature', 10, 1000, 100, [])).toBe(false)
    })
  })

  describe('getAvailableFeatures', () => {
    it('利用可能な機能が正しく取得される', () => {
      const features = getAvailableFeatures(2, 200, 5, ['vocabulary-beginner'])
      
      expect(features).toBeInstanceOf(Array)
      expect(features.length).toBeGreaterThan(0)
      
      // 基本機能は常に含まれる
      expect(features.some(f => f.id === 'vocabulary-beginner')).toBe(true)
      expect(features.some(f => f.id === 'grammar-easy')).toBe(true)
    })

    it('レベルに応じて機能が変わる', () => {
      const level1Features = getAvailableFeatures(1, 200, 5, [])
      const level2Features = getAvailableFeatures(2, 200, 5, [])
      
      expect(level2Features.length).toBeGreaterThanOrEqual(level1Features.length)
    })

    it('XPに応じて機能が変わる', () => {
      const lowXPFeatures = getAvailableFeatures(2, 100, 5, [])
      const highXPFeatures = getAvailableFeatures(2, 500, 5, [])
      
      expect(highXPFeatures.length).toBeGreaterThanOrEqual(lowXPFeatures.length)
    })

    it('ストリークに応じて機能が変わる', () => {
      const lowStreakFeatures = getAvailableFeatures(2, 200, 3, [])
      const highStreakFeatures = getAvailableFeatures(2, 200, 10, [])
      
      expect(highStreakFeatures.length).toBeGreaterThanOrEqual(lowStreakFeatures.length)
    })
  })

  describe('getNextUnlockableFeatures', () => {
    it('次のアンロック予定機能が正しく取得される', () => {
      const nextFeatures = getNextUnlockableFeatures(1, 100, 5, [])
      
      expect(nextFeatures).toBeInstanceOf(Array)
      expect(nextFeatures.length).toBeGreaterThan(0)
      
      // 次のレベルでアンロックされる機能が含まれる（levelが定義されている場合のみ）
      expect(nextFeatures.some(f => f.condition.level && f.condition.level === 2)).toBe(true)
    })

    it('現在のレベルより高い機能が取得される', () => {
      const nextFeatures = getNextUnlockableFeatures(1, 100, 5, [])
      
      nextFeatures.forEach(feature => {
        if (feature.condition.level) {
          expect(feature.condition.level).toBeGreaterThan(1)
        }
      })
    })

    it('現在のXPより高い機能が取得される', () => {
      const nextFeatures = getNextUnlockableFeatures(2, 100, 5, [])
      
      nextFeatures.forEach(feature => {
        if (feature.condition.xp) {
          expect(feature.condition.xp).toBeGreaterThan(100)
        }
      })
    })

    it('現在のストリークより高い機能が取得される', () => {
      const nextFeatures = getNextUnlockableFeatures(2, 200, 5, [])
      
      nextFeatures.forEach(feature => {
        if (feature.condition.streak) {
          expect(feature.condition.streak).toBeGreaterThan(5)
        }
      })
    })

    it('既にアンロックされた機能は含まれない', () => {
      const nextFeatures = getNextUnlockableFeatures(2, 200, 5, ['vocabulary-beginner', 'grammar-easy'])
      
      expect(nextFeatures.some(f => f.id === 'vocabulary-beginner')).toBe(false)
      expect(nextFeatures.some(f => f.id === 'grammar-easy')).toBe(false)
    })

    it('条件を満たしている機能は含まれない', () => {
      const nextFeatures = getNextUnlockableFeatures(2, 200, 7, [])
      
      // レベル2、200XP、7日連続の条件を満たしている機能は含まれない
      nextFeatures.forEach(feature => {
        if (feature.condition.level <= 2 && 
            (!feature.condition.xp || feature.condition.xp <= 200) &&
            (!feature.condition.streak || feature.condition.streak <= 7)) {
          // この条件を満たす機能は既にアンロックされているはず
          expect(isFeatureUnlocked(feature.id, 2, 200, 7, [])).toBe(true)
        }
      })
    })
  })

  describe('エッジケース', () => {
    it('負の値で正しく動作する', () => {
      expect(isFeatureUnlocked('vocabulary-beginner', -1, -100, -5, [])).toBe(true) // 基本機能は常にアンロック
      expect(isFeatureUnlocked('essay-beginner', -1, -100, -5, [])).toBe(false)
    })

    it('極端に大きな値で正しく動作する', () => {
      expect(isFeatureUnlocked('vocabulary-beginner', 1000, 100000, 1000, [])).toBe(true)
      expect(isFeatureUnlocked('essay-beginner', 1000, 100000, 1000, [])).toBe(true)
    })

    it('空の配列で正しく動作する', () => {
      expect(isFeatureUnlocked('vocabulary-beginner', 1, 0, 0, [])).toBe(true)
      expect(getAvailableFeatures(1, 0, 0, [])).toBeInstanceOf(Array)
      expect(getNextUnlockableFeatures(1, 0, 0, [])).toBeInstanceOf(Array)
    })

    it('nullやundefinedで正しく動作する', () => {
      expect(isFeatureUnlocked('vocabulary-beginner', 1, 0, 0, null as any)).toBe(true)
      expect(getAvailableFeatures(1, 0, 0, null as any)).toBeInstanceOf(Array)
      expect(getNextUnlockableFeatures(1, 0, 0, null as any)).toBeInstanceOf(Array)
    })
  })
})
