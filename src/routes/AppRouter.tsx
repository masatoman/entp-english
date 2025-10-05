import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// シンプルなホームコンポーネント
function SimpleHome() {
  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          ENTP英語学習アプリ
        </h1>
        <p className="text-lg text-gray-600">
          アプリケーションが準備中です
        </p>
      </div>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<SimpleHome />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}