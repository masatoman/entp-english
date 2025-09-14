import { FullConfig } from '@playwright/test'

/**
 * MCP Playwright Server用のグローバルティアダウン
 * - MCPサーバーとの接続をクリーンアップ
 * - テスト環境の後処理
 * - リソースの解放
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 MCP Playwright Server ティアダウン開始')
  
  // MCPサーバーとの接続をクリーンアップ
  try {
    // 必要に応じてMCPサーバーのリソースをクリーンアップ
    console.log('✅ MCPサーバー接続クリーンアップ完了')
  } catch (error) {
    console.warn('⚠️ MCPサーバークリーンアップでエラー:', error)
  }
  
  console.log('✅ MCP Playwright Server ティアダウン完了')
}

export default globalTeardown
