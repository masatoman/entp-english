import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "ENTP英語学習アプリ",
        short_name: "ENTP英語",
        description: "ENTPタイプの学習者向け英語学習アプリ",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    outDir: "build",
    rollupOptions: {
      output: {
        manualChunks: {
          // ベンダーライブラリを分離
          vendor: ["react", "react-dom"],
          // UIライブラリを分離
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-progress",
          ],
          // ゲーム関連を分離
          game: [
            "./src/components/SimpleTowerDefense.tsx",
            "./src/utils/tower-defense-data.ts",
          ],
          // 学習機能を分離
          learning: [
            "./src/components/VocabularyCard.tsx",
            "./src/components/GrammarQuiz.tsx",
            "./src/components/CombinedTest.tsx",
          ],
          // 実績・進捗管理を分離
          progress: [
            "./src/components/Achievements.tsx",
            "./src/utils/dataManager.ts",
            "./src/utils/xpCalculator.ts",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: true,
    // ホットリロード最適化
    hmr: {
      overlay: true, // エラーオーバーレイを有効化
    },
    // ファイル監視の最適化
    watch: {
      usePolling: false, // ポーリングを無効化（パフォーマンス向上）
      ignored: ["**/node_modules/**", "**/build/**", "**/dist/**"],
    },
  },
  // 開発時の最適化
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-progress",
    ],
    exclude: ["@vite/client", "@vite/env"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,playwright}.config.*",
      "**/e2e/**",
    ],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "dist/",
        "build/",
      ],
    },
  },
});
