import { Outlet, useLocation, Navigate } from "react-router-dom";

export function OthersPage() {
  const location = useLocation();

  if (location.pathname === "/others" || location.pathname === "/others/") {
    return <Navigate to="fanArt" replace />;
  }

  return (
    <div className="h-full w-full animate-in fade-in duration-500">
      <Outlet />
    </div>
  );
}