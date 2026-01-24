import { Outlet, useLocation, Navigate } from "react-router-dom";

export function GoodsPage() {
  const location = useLocation();

  // /goods로만 접속했을 때, 첫 번째 메뉴(ticket)로 자동 이동
  if (location.pathname === "/goods" || location.pathname === "/goods/") {
    return <Navigate to="ticket" replace />;
  }

  // 메뉴는 왼쪽 사이드바에 있으므로, 여기서는 내용(Outlet)만 보여줍니다.
  return (
    <div className="h-full w-full animate-in fade-in duration-500">
      <Outlet />
    </div>
  );
}
