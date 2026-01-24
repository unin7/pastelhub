// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TopNavigation } from "./components/TopNavigation";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"; 
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
          <SidebarProvider>
            <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
              {/* ✅ 스마트 사이드바 적용 */}
              <AppSidebar />
              
              <div className="flex flex-1 flex-col overflow-hidden">
                {/* 상단 네비게이션 (사이드바 트리거 포함) */}
                <header className="flex h-14 items-center gap-4 border-b bg-white/50 px-4 backdrop-blur-md lg:h-[60px]">
                  <SidebarTrigger /> {/* ⬅️ 사이드바 열고 닫는 버튼 */}
                  <TopNavigation />
                </header>

                {/* 메인 콘텐츠 영역 */}
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
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}