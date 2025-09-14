import { defineConfig, devices } from '@playwright/test'

/**
 * @see https://playwright.dev/docs/test-configuration
 * 
 * MCP Playwright Serverを使用する設定
 * - MCPサーバー経由でブラウザ操作を実行
 * - より安定したテスト実行環境を提供
 */
export default defineConfig({
  testDir: './src/test/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* MCP Playwright Server設定 */
    launchOptions: {
      headless: process.env.CI ? true : false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  },

  /* Configure projects for major browsers - MCPサーバー経由で実行 */
  projects: [
    {
      name: 'chromium-mcp',
      use: { 
        ...devices['Desktop Chrome'],
        // MCPサーバー経由でブラウザ操作を実行
        channel: 'chrome'
      },
    },

    {
      name: 'firefox-mcp',
      use: { 
        ...devices['Desktop Firefox'],
        // MCPサーバー経由でFirefox操作を実行
      },
    },

    {
      name: 'webkit-mcp',
      use: { 
        ...devices['Desktop Safari'],
        // MCPサーバー経由でSafari操作を実行
      },
    },

    /* Test against mobile viewports - MCPサーバー経由 */
    {
      name: 'Mobile Chrome MCP',
      use: { 
        ...devices['Pixel 5'],
        // MCPサーバー経由でモバイルChrome操作を実行
        channel: 'chrome'
      },
    },
    {
      name: 'Mobile Safari MCP',
      use: { 
        ...devices['iPhone 12'],
        // MCPサーバー経由でモバイルSafari操作を実行
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  
  /* MCP Playwright Server用の追加設定 */
  globalSetup: './src/test/e2e/global-setup.ts',
  globalTeardown: './src/test/e2e/global-teardown.ts',
})
