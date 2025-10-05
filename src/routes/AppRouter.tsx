import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../components/Home";

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}