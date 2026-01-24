import { Outlet, useLocation, Navigate } from "react-router-dom";

export function GuidePage() {
  const location = useLocation();

  if (location.pathname === "/guide" || location.pathname === "/guide/") {
    return <Navigate to="basic" replace />;
  }

  return (
    // Guide 페이지는 내부 스크롤이 중요하므로 id 유지
    <div id="guide-scroll-container" className="h-full w-full overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
      <Outlet />
    </div>
  );
}