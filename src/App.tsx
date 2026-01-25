import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext";
import { MainLayout } from "./components/MainLayout";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

// 각 페이지 컴포넌트 import (경로는 프로젝트 상황에 맞게)
import { HomePage } from "./features/home/HomePage";
import { NewsRoutes } from "./features/news/NewsRoutes";
import { ActivitiesRoutes } from "./features/activities/ActivitiesRoutes";
import { GoodsRoutes } from "./features/goods/GoodsRoutes";
import { GuideRoutes } from "./features/guide/GuideRoutes";
import { OthersRoutes } from "./features/others/OthersRoutes";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <MainLayout>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/news/*" element={<NewsRoutes />} />
                <Route path="/activities/*" element={<ActivitiesRoutes />} />
                <Route path="/goods/*" element={<GoodsRoutes />} />
                <Route path="/guide/*" element={<GuideRoutes />} />
                <Route path="/others/*" element={<OthersRoutes />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ErrorBoundary>
          </MainLayout>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}