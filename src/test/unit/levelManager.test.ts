import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LevelManager } from '../../utils/levelManager'

// ローカルストレージのモック
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('LevelManager', () => {
  let levelManager: LevelManager

  beforeEach(() => {
    vi.clearAllMocks()
    levelManager = new LevelManager(0)
  })

  describe('初期化', () => {
    it('初期XPが0の場合、レベル1で初期化される', () => {
      const manager = new LevelManager(0)
      const level = manager.getLevel()

      expect(level.level).toBe(1)
      expect(level.xp).toBe(0)
      expect(level.progress).toBe(0)
    })

    it('初期XPが100の場合、適切なレベルで初期化される', () => {
      const manager = new LevelManager(100)
      const level = manager.getLevel()

      expect(level.level).toBeGreaterThan(1)
      expect(level.xp).toBe(100)
    })
  })

  describe('XP追加とレベルアップ', () => {
    it('XP追加でレベルアップが正しく処理される', () => {
      const result = levelManager.addXP(100)

      expect(result.leveledUp).toBe(true)
      expect(result.newLevel).toBeDefined()
      expect(result.newLevel?.level).toBeGreaterThan(1)
    })

    it('XP追加でレベルアップしない場合', () => {
      const result = levelManager.addXP(10)

      expect(result.leveledUp).toBe(false)
      expect(result.newLevel).toBeUndefined()
    })

    it('複数回のXP追加でレベルアップが正しく処理される', () => {
      // 最初のXP追加（50XPでレベル2に到達）
      const result1 = levelManager.addXP(50)
      expect(result1.leveledUp).toBe(true) // 50XPでレベル2に到達

      // 2回目のXP追加（さらに50XP追加）
      const result2 = levelManager.addXP(50)
      expect(result2.leveledUp).toBe(true) // さらに50XPでレベル3に到達
    })
  })

  describe('ハートシステム', () => {
    it('初期体力が正しく設定される', () => {
      const heartSystem = levelManager.getHeartSystem()

      expect(heartSystem.current).toBeGreaterThan(0)
      expect(heartSystem.max).toBeGreaterThan(0)
      expect(heartSystem.current).toBe(heartSystem.max)
    })

    it('体力の消費が正しく処理される', () => {
      const initialHearts = levelManager.getHeartSystem()
      const success = levelManager.consumeHeart()

      expect(success).toBe(true)
      
      const updatedHearts = levelManager.getHeartSystem()
      expect(updatedHearts.current).toBe(initialHearts.current - 1)
    })

    it('体力が0の場合は消費できない', () => {
      // 全ての体力を消費
      const maxHearts = levelManager.getHeartSystem().max
      for (let i = 0; i < maxHearts; i++) {
        levelManager.consumeHeart()
      }

      const success = levelManager.consumeHeart()
      expect(success).toBe(false)
    })

    it('体力の回復が正しく処理される', () => {
      // 体力を消費
      levelManager.consumeHeart()
      
      // 回復処理を実行
      const recoveredHearts = levelManager.processHeartRecovery()

      expect(recoveredHearts.current).toBeGreaterThan(0)
    })
  })

  describe('ステータス配分', () => {
    it('初期ステータス配分が正しく設定される', () => {
      const statusAllocation = levelManager.getStatusAllocation()

      expect(statusAllocation.grammar).toBeGreaterThan(0)
      expect(statusAllocation.vocabulary).toBeGreaterThan(0)
      expect(statusAllocation.listening).toBeGreaterThan(0)
      expect(statusAllocation.reading).toBeGreaterThan(0)
      expect(statusAllocation.writing).toBeGreaterThan(0)
      expect(statusAllocation.idioms).toBeGreaterThan(0)
    })

    it('ステータス配分の更新が正しく処理される', () => {
      const newAllocation = {
        grammar: 5,
        vocabulary: 5,
        listening: 5,
        reading: 5,
        writing: 5,
        idioms: 5,
      }

      const success = levelManager.updateStatusAllocation(newAllocation)
      expect(success).toBe(true)

      const updatedAllocation = levelManager.getStatusAllocation()
      expect(updatedAllocation.grammar).toBe(5)
      expect(updatedAllocation.vocabulary).toBe(5)
    })

    it('無効なステータス配分は更新されない', () => {
      const invalidAllocation = {
        grammar: 10,
        vocabulary: 10,
        listening: 10,
        reading: 10,
        writing: 10,
        idioms: 10, // 合計が60で無効（30でなければならない）
      }

      const success = levelManager.updateStatusAllocation(invalidAllocation)
      expect(success).toBe(false)
    })

    it('ステータステンプレートが正しく適用される', () => {
      const success = levelManager.applyStatusTemplate('balanced')
      expect(success).toBe(true)

      const allocation = levelManager.getStatusAllocation()
      expect(allocation.grammar).toBeGreaterThan(0)
      expect(allocation.vocabulary).toBeGreaterThan(0)
      expect(allocation.listening).toBeGreaterThan(0)
      expect(allocation.reading).toBeGreaterThan(0)
      expect(allocation.writing).toBeGreaterThan(0)
      expect(allocation.idioms).toBeGreaterThan(0)
    })
  })

  describe('問題ランクとスキルフィールド', () => {
    it('次の問題ランクが正しく決定される', () => {
      const questionRank = levelManager.getNextQuestionRank()

      expect(['normal', 'rare', 'epic', 'legendary']).toContain(questionRank)
    })

    it('次のスキルフィールドが正しく決定される', () => {
      const skillField = levelManager.getNextSkillField()

      expect(['grammar', 'vocabulary', 'listening', 'reading', 'writing', 'idioms']).toContain(skillField)
    })
  })

  describe('レベルアップ時の体力システム更新', () => {
    it('レベルアップ時に体力システムが正しく更新される', () => {
      const initialHearts = levelManager.getHeartSystem()
      
      // 大量のXPを追加してレベルアップを発生させる
      const result = levelManager.addXP(1000)
      
      if (result.leveledUp) {
        const updatedHearts = levelManager.getHeartSystem()
        expect(updatedHearts.max).toBeGreaterThanOrEqual(initialHearts.max)
        expect(updatedHearts.current).toBe(updatedHearts.max) // レベルアップ時は全回復
      }
    })
  })
})
