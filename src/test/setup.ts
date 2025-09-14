import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// カスタムマッチャーの追加
expect.extend(matchers)

// 各テスト後にクリーンアップ
afterEach(() => {
  cleanup()
})

// ローカルストレージのモック
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

// Date.now()のモック
const mockDateNow = vi.fn(() => 1703001600000) // 2023-12-20 00:00:00 UTC
const mockDate = class MockDate extends Date {
  constructor(...args: any[]) {
    if (args.length === 0) {
      super(1703001600000)
    } else {
      super(...args)
    }
  }
  static now() {
    return mockDateNow()
  }
}
vi.stubGlobal('Date', mockDate)

// コンソールエラーの抑制（テスト中の不要なエラーを防ぐ）
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
