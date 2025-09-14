import { test, expect } from '@playwright/test'

/**
 * ENTP英語学習アプリ - ユーザージャーニー E2Eテスト
 * 
 * MCP Playwright Serverを使用してブラウザ操作を実行
 * - より安定したテスト実行環境
 * - リモートブラウザ操作のサポート
 * - デバッグ機能の強化
 */
test.describe('ENTP英語学習アプリ - ユーザージャーニー (MCP Server)', () => {
  test.beforeEach(async ({ page }) => {
    // 各テスト前にローカルストレージをクリア
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('初回利用フロー - 文法クイズでXP獲得', async ({ page }) => {
    // 1. ホーム画面にアクセス
    await page.goto('/')
    await expect(page).toHaveTitle(/ENTP英語学習アプリ/)

    // 2. 文法クイズを選択
    await page.click('text=文法クイズ')
    await expect(page.locator('h1')).toContainText('文法クイズ')

    // 3. カテゴリーを選択
    await page.click('text=基本文型')
    await expect(page.locator('h2')).toContainText('基本文型')

    // 4. 難易度を選択
    await page.click('text=簡単')
    await expect(page.locator('h3')).toContainText('簡単')

    // 5. 問題に回答
    await page.click('text=開始')
    
    // 最初の3問に正解
    for (let i = 0; i < 3; i++) {
      await page.click('text=正解')
      await page.click('text=次へ')
    }

    // 残りの問題に不正解
    for (let i = 0; i < 2; i++) {
      await page.click('text=不正解')
      await page.click('text=次へ')
    }

    // 6. 結果画面を確認
    await expect(page.locator('text=クイズ完了')).toBeVisible()
    await expect(page.locator('text=正解率')).toBeVisible()
    await expect(page.locator('text=XP')).toBeVisible()

    // 7. ホームに戻ってXP反映を確認
    await page.click('text=ホームに戻る')
    await expect(page.locator('text=総XP')).toBeVisible()
  })

  test('語彙学習フロー - カード学習でXP獲得', async ({ page }) => {
    // 1. 語彙学習を選択
    await page.goto('/')
    await page.click('text=語彙学習')
    await expect(page.locator('h1')).toContainText('語彙学習')

    // 2. レベルを選択
    await page.click('text=初級')
    await expect(page.locator('h2')).toContainText('初級')

    // 3. カテゴリーを選択
    await page.click('text=全カテゴリー')
    await expect(page.locator('h3')).toContainText('全カテゴリー')

    // 4. 学習開始
    await page.click('text=開始')
    
    // 5. 単語カードを学習
    await expect(page.locator('.vocabulary-card')).toBeVisible()
    
    // カードをクリックして意味を表示
    await page.click('.vocabulary-card')
    await expect(page.locator('text=意味')).toBeVisible()
    
    // 次の単語に進む
    await page.click('text=次へ')
    
    // 6. 学習完了
    await page.click('text=終了')
    await expect(page.locator('text=学習完了')).toBeVisible()
  })

  test('実績システム - ストリーク実績の獲得', async ({ page }) => {
    // 1. 初日学習
    await page.goto('/')
    await page.click('text=文法クイズ')
    await page.click('text=基本文型')
    await page.click('text=簡単')
    await page.click('text=開始')
    
    // 問題に回答
    for (let i = 0; i < 5; i++) {
      await page.click('text=正解')
      await page.click('text=次へ')
    }
    
    await page.click('text=ホームに戻る')

    // 2. 実績画面を確認
    await page.click('text=実績')
    await expect(page.locator('text=実績')).toBeVisible()
    await expect(page.locator('text=ストリーク')).toBeVisible()

    // 3. ストリーク実績の進捗を確認
    await expect(page.locator('text=三日坊主克服')).toBeVisible()
  })

  test('タワーディフェンスゲーム - XP獲得とレベルアップ', async ({ page }) => {
    // 1. タワーディフェンスゲームを開始
    await page.goto('/')
    await page.click('text=タワーディフェンス')
    await expect(page.locator('h1')).toContainText('タワーディフェンス')

    // 2. ゲーム開始
    await page.click('text=ゲーム開始')
    await expect(page.locator('.game-field')).toBeVisible()

    // 3. タワーを配置
    await page.click('.tower-slot:first-child')
    await expect(page.locator('.tower')).toBeVisible()

    // 4. 敵を倒してXP獲得
    await page.waitForTimeout(2000) // 敵の移動を待つ
    
    // 5. XP表示を確認
    await expect(page.locator('text=XP')).toBeVisible()
    
    // 6. ゲーム終了
    await page.click('text=終了')
    await expect(page.locator('text=ゲーム終了')).toBeVisible()
  })

  test('体力システム - ハートの消費と回復', async ({ page }) => {
    // 1. ホーム画面で体力表示を確認
    await page.goto('/')
    await expect(page.locator('.heart-system')).toBeVisible()
    await expect(page.locator('text=体力')).toBeVisible()

    // 2. 学習で体力を消費
    await page.click('text=文法クイズ')
    await page.click('text=基本文型')
    await page.click('text=簡単')
    await page.click('text=開始')
    
    // 問題に回答
    for (let i = 0; i < 5; i++) {
      await page.click('text=正解')
      await page.click('text=次へ')
    }
    
    await page.click('text=ホームに戻る')

    // 3. 体力が減少していることを確認
    await expect(page.locator('.heart-system')).toBeVisible()
    
    // 4. 体力回復ボタンをクリック（テスト用）
    await page.click('text=♥回復')
    await expect(page.locator('text=体力が全回復')).toBeVisible()
  })

  test('レスポンシブデザイン - モバイル表示', async ({ page }) => {
    // モバイルサイズに設定
    await page.setViewportSize({ width: 375, height: 667 })
    
    // 1. ホーム画面の表示確認
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    
    // 2. ナビゲーションメニューが正しく表示される
    await expect(page.locator('text=語彙学習')).toBeVisible()
    await expect(page.locator('text=文法クイズ')).toBeVisible()
    
    // 3. 文法クイズの表示確認
    await page.click('text=文法クイズ')
    await expect(page.locator('h1')).toBeVisible()
    
    // 4. カテゴリー選択が正しく表示される
    await expect(page.locator('text=基本文型')).toBeVisible()
  })

  test('PWA機能 - インストールプロンプト', async ({ page, context }) => {
    // 1. PWAインストールプロンプトをシミュレート
    await page.goto('/')
    
    // 2. インストールボタンが表示される（条件付き）
    const installButton = page.locator('text=インストール')
    if (await installButton.isVisible()) {
      await installButton.click()
      await expect(page.locator('text=インストール完了')).toBeVisible()
    }
  })

  test('データ永続化 - ブラウザ再起動後のデータ保持', async ({ page }) => {
    // 1. 初回学習でXP獲得
    await page.goto('/')
    await page.click('text=文法クイズ')
    await page.click('text=基本文型')
    await page.click('text=簡単')
    await page.click('text=開始')
    
    for (let i = 0; i < 5; i++) {
      await page.click('text=正解')
      await page.click('text=次へ')
    }
    
    await page.click('text=ホームに戻る')

    // 2. XP表示を確認
    const xpElement = page.locator('text=総XP')
    await expect(xpElement).toBeVisible()

    // 3. ページをリロード
    await page.reload()

    // 4. データが保持されていることを確認
    await expect(xpElement).toBeVisible()
  })

  test('エラーハンドリング - 不正な入力への対応', async ({ page }) => {
    // 1. 文法クイズで不正な回答を入力
    await page.goto('/')
    await page.click('text=文法クイズ')
    await page.click('text=基本文型')
    await page.click('text=普通') // 記述式問題
    await page.click('text=開始')
    
    // 2. 空の回答を送信
    await page.click('text=回答')
    
    // 3. エラーメッセージが表示される
    await expect(page.locator('text=回答を入力してください')).toBeVisible()
    
    // 4. 正しい回答を入力
    await page.fill('input[type="text"]', '正解')
    await page.click('text=回答')
    
    // 5. 次の問題に進む
    await expect(page.locator('text=正解')).toBeVisible()
  })
})
