// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TopNavigation } from "./components/TopNavigation";
import { Sidebar } from "./components/ui/Sidebar";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

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
          <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* 상단 네비게이션 바 */}
            <TopNavigation />

            {/* T자형 레이아웃: 좌측 사이드바 + 메인 콘텐츠 */}
            <div className="flex-1 overflow-hidden flex">
              {/* 좌측 사이드바 */}
              <Sidebar />

              {/* 메인 콘텐츠 영역 */}
              <main className="flex-1 overflow-y-auto custom-scrollbar">
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
              </main>
            </div>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}