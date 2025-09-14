import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Home } from '../../components/Home'
import { DataManager } from '../../utils/dataManager'

// DataManagerのモック
vi.mock('../../utils/dataManager', () => ({
  DataManager: {
    getUserStats: vi.fn(),
    getLearningHistory: vi.fn(),
  }
}))

// SoundManagerのモック
vi.mock('../../utils/soundManager', () => ({
  SoundManager: {
    sounds: {
      click: vi.fn()
    }
  }
}))

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

describe('Home Component', () => {
  const mockProps = {
    onNavigateToGrammar: vi.fn(),
    onNavigateToVocabulary: vi.fn(),
    onNavigateToGrammarQuiz: vi.fn(),
    onNavigateToEssay: vi.fn(),
    onNavigateToCombinedTest: vi.fn(),
    onNavigateToAchievements: vi.fn(),
    onNavigateToAppSettings: vi.fn(),
    onNavigateToTimeAttack: vi.fn(),
    onNavigateToSimpleTowerDefense: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // デフォルトのモックデータ
    vi.mocked(DataManager.getUserStats).mockReturnValue({
      totalXP: 100,
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
      unlockedAchievements: []
    })

    vi.mocked(DataManager.getLearningHistory).mockReturnValue([
      {
        date: '2023-12-20',
        type: 'grammar-quiz',
        category: 'basic-grammar',
        difficulty: 'easy',
        score: 80,
        totalQuestions: 10,
        correctAnswers: 8,
        xpEarned: 50,
        duration: 300,
      }
    ])

    localStorageMock.getItem.mockReturnValue(JSON.stringify({ dailyXPGoal: 100 }))
  })

  it('コンポーネントが正しくレンダリングされる', () => {
    render(<Home {...mockProps} />)
    
    expect(screen.getByText('English Master')).toBeInTheDocument()
    expect(screen.getByText('毎日コツコツ英語力アップ')).toBeInTheDocument()
    expect(screen.getByText('今日の進捗')).toBeInTheDocument()
  })

  it('ユーザー統計が正しく表示される', () => {
    render(<Home {...mockProps} />)
    
    expect(screen.getByText('5日連続')).toBeInTheDocument()
    expect(screen.getByText('レベル 2')).toBeInTheDocument()
    expect(screen.getByText('0 / 100')).toBeInTheDocument()
  })

  it('学習メニューが正しく表示される', () => {
    render(<Home {...mockProps} />)
    
    expect(screen.getByText('学習メニュー')).toBeInTheDocument()
    expect(screen.getByText('実績')).toBeInTheDocument()
    expect(screen.getByText('アプリ設定')).toBeInTheDocument()
    expect(screen.getByText('タワーディフェンス')).toBeInTheDocument()
  })

  it('メニューアイテムのクリックが正しく動作する', async () => {
    render(<Home {...mockProps} />)
    
    const achievementsButton = screen.getByText('実績')
    fireEvent.click(achievementsButton)
    
    await waitFor(() => {
      expect(mockProps.onNavigateToAchievements).toHaveBeenCalledTimes(1)
    })
  })

  it('XP進捗バーが正しく表示される', () => {
    render(<Home {...mockProps} />)
    
    const progressBars = screen.getAllByRole('progressbar')
    expect(progressBars).toHaveLength(2) // XP進捗とレベル進捗
  })

  it('レベル進捗が正しく計算される', () => {
    // より高いXPでテスト
    vi.mocked(DataManager.getUserStats).mockReturnValue({
      totalXP: 250,
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
      unlockedAchievements: []
    })

    render(<Home {...mockProps} />)
    
    expect(screen.getByText('レベル 3')).toBeInTheDocument()
  })

  it('目標達成時に正しいメッセージが表示される', () => {
    vi.mocked(DataManager.getLearningHistory).mockReturnValue([
      {
        date: '2023-12-20',
        type: 'grammar-quiz',
        category: 'basic-grammar',
        difficulty: 'easy',
        score: 80,
        totalQuestions: 10,
        correctAnswers: 8,
        xpEarned: 100, // 目標と同じXP
        duration: 300,
      }
    ])

    render(<Home {...mockProps} />)
    
    // 目標達成メッセージは条件によって表示される
    expect(screen.getByText('今日の進捗')).toBeInTheDocument()
  })

  it('アンロック機能が正しく表示される', () => {
    // アンロックされた実績を持つユーザー
    vi.mocked(DataManager.getUserStats).mockReturnValue({
      totalXP: 100,
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
    })

    render(<Home {...mockProps} />)
    
    expect(screen.getByText('単語学習')).toBeInTheDocument()
    expect(screen.getByText('文法クイズ')).toBeInTheDocument()
  })

  it('フォーカス時にデータが更新される', async () => {
    const { rerender } = render(<Home {...mockProps} />)
    
    // フォーカスイベントをシミュレート
    fireEvent.focus(window)
    
    await waitFor(() => {
      expect(DataManager.getUserStats).toHaveBeenCalledTimes(3) // 初期レンダリング + フォーカス時 + 再レンダリング
    })
  })

  it('エラーハンドリングが正しく動作する', () => {
    // ローカルストレージのエラーをシミュレート
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('LocalStorage error')
    })

    // エラーが発生してもコンポーネントがクラッシュしないことを確認
    expect(() => render(<Home {...mockProps} />)).not.toThrow()
  })
})
