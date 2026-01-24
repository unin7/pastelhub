import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TopNavigation } from "./components/TopNavigation";
import { SidebarProvider } from "./components/ui/sidebar"; 
import { AppSidebar } from "./components/AppSidebar"; 
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
          <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            
            {/* 1. 상단 네비게이션 (고정) */}
            <TopNavigation />

            {/* 2. 하단 영역 (사이드바 + 메인 콘텐츠) */}
            <SidebarProvider className="flex-1 flex overflow-hidden">
              <div className="flex w-full h-full">
                
                {/* 왼쪽 고정 패널 */}
                <AppSidebar />
                
                {/* 메인 콘텐츠 */}
                <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
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
            </SidebarProvider>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}