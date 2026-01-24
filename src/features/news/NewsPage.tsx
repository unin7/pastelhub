import { Outlet, useLocation, Navigate } from "react-router-dom";

export function NewsPage() {
  const location = useLocation();

  // /news로만 들어왔을 때 첫 메뉴로 자동 이동
  if (location.pathname === "/news" || location.pathname === "/news/") {
    return <Navigate to="schedule" replace />;
  }

  return (
    <div className="h-full w-full animate-in fade-in duration-500">
      <Outlet />
    </div>
  );
}