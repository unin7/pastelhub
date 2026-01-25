import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import { AuthStatusButton } from './auth/AuthStatusButton'; 
import { UserDashboardMenu } from './auth/UserDashboardMenu';
import { USER_LEVELS } from './auth/auth.const';

const menuItems = [
  { path: '/news', label: '소식' },
  { path: '/activities', label: '활동' },
  { path: '/goods', label: '굿즈 · 멤버십' },
  { path: '/guide', label: '가이드' },
  { path: '/others', label: '기타' },
];

export function TopNavigation() {
  const location = useLocation();
  const { userLevel, login, verifyNaver, logout } = useAuth();

  const getAuthStatusString = () => {
    if (userLevel === USER_LEVELS.VERIFIED || userLevel === USER_LEVELS.ACTIVE) return 'cafe';
    if (userLevel === USER_LEVELS.MEMBER) return 'google';
    return 'guest';
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 h-16 flex-none">
      <div className="w-full h-full px-6 flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-1.5 transition-opacity hover:opacity-80 min-w-max">
          <Sparkles className="h-5 w-5 text-indigo-300 transition-transform duration-500 group-hover:rotate-180" />
          <h1 className="font-extrabold text-2xl tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400">pastel</span>
            <span className="text-slate-700">hub</span>
          </h1>
        </Link>

        <div className="hidden md:flex items-center gap-1 bg-white/40 px-2 py-1.5 rounded-full border border-white/50 shadow-sm backdrop-blur-sm">
          {menuItems.map((menu) => {
            const isActive = location.pathname.startsWith(menu.path);
            return (
              <Link key={menu.path} to={menu.path} className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out ${isActive ? 'bg-white text-indigo-500 shadow-md ring-1 ring-black/5 scale-100' : 'text-slate-500 hover:text-indigo-400 hover:bg-white/60'}`}>
                {menu.label}
                {isActive && <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-indigo-300" />}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 min-w-max justify-end">
          <AuthStatusButton status={getAuthStatusString()} onLogin={login} onVerify={verifyNaver} />
          <UserDashboardMenu status={getAuthStatusString()} onLogout={logout} />
        </div>
      </div>
    </nav>
  );
}