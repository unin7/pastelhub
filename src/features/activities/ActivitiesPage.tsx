import { Outlet, useLocation, Navigate } from "react-router-dom";

export function ActivitiesPage() {
  const location = useLocation();

  // /activities로만 들어왔을 때 첫 메뉴로 이동
  if (location.pathname === "/activities" || location.pathname === "/activities/") {
    return <Navigate to="todo" replace />;
  }

  return (
    <div className="h-full w-full animate-in fade-in duration-500">
      <Outlet />
    </div>
  );
}