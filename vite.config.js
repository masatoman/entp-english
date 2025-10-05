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
                start_url: "/",
                display: "standalone",
                background_color: "#ffffff",
                theme_color: "#ffffff",
                lang: "ja",
                scope: "/",
                orientation: "portrait-primary",
                icons: [
                    {
                        src: "pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                    {
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                ],
                categories: ["education", "productivity"],
                shortcuts: [
                    {
                        name: "文法クイズ",
                        short_name: "文法",
                        description: "文法問題に挑戦",
                        url: "/learning/grammar/category",
                        icons: [{ src: "pwa-192x192.png", sizes: "192x192" }],
                    },
                    {
                        name: "語彙学習",
                        short_name: "語彙",
                        description: "単語を学習",
                        url: "/learning/vocabulary",
                        icons: [{ src: "pwa-192x192.png", sizes: "192x192" }],
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
        outDir: "dist",
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    // ベンダーライブラリを分離
                    if (id.includes("node_modules")) {
                        // React関連を最優先で分離
                        if (id.includes("react/") || id.includes("react-dom/")) {
                            return "vendor-react";
                        }
                        if (id.includes("react-router") || id.includes("react-router-dom")) {
                            return "vendor-router";
                        }
                        if (id.includes("@radix-ui") || id.includes("lucide-react")) {
                            return "vendor-ui";
                        }
                        if (id.includes("framer-motion") || id.includes("zustand")) {
                            return "vendor-animation";
                        }
                        return "vendor";
                    }
                    // アプリケーションコードの分離
                    if (id.includes("/src/components/")) {
                        if (id.includes("SimpleTowerDefense") ||
                            id.includes("GachaSystem")) {
                            return "game";
                        }
                        if (id.includes("TOEIC") || id.includes("MockTest")) {
                            return "toeic";
                        }
                        if (id.includes("Vocabulary") ||
                            id.includes("Grammar") ||
                            id.includes("Listening")) {
                            return "learning";
                        }
                        if (id.includes("Achievements") || id.includes("Dashboard")) {
                            return "progress";
                        }
                        return "components";
                    }
                    if (id.includes("/src/utils/")) {
                        if (id.includes("toeic") || id.includes("mockTest")) {
                            return "toeic";
                        }
                        if (id.includes("tower-defense") || id.includes("gacha")) {
                            return "game";
                        }
                        if (id.includes("level") ||
                            id.includes("xp") ||
                            id.includes("achievement")) {
                            return "progress";
                        }
                        return "utils";
                    }
                    if (id.includes("/src/data/")) {
                        return "data";
                    }
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
});
