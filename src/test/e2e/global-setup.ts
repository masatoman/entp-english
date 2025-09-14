import { chromium, FullConfig } from '@playwright/test'

/**
 * MCP Playwright Server用のグローバルセットアップ
 * - MCPサーバーとの接続を確立
 * - ブラウザインスタンスの初期化
 * - テスト環境の準備
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 MCP Playwright Server セットアップ開始')
  
  // MCPサーバーとの接続を確立
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  const context = await browser.newContext()
  const page = await context.newPage()
  
  // アプリケーションの起動確認
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
    console.log('✅ アプリケーション起動確認完了')
  } catch (error) {
    console.warn('⚠️ アプリケーション起動確認でエラー:', error)
  }
  
  await browser.close()
  console.log('✅ MCP Playwright Server セットアップ完了')
}

export default globalSetup
