import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

// 위에서 만든 컴포넌트 불러오기
import { AuthStatusButton, AuthStatus } from './auth/AuthStatusButton'; 
import { UserDashboardMenu } from './auth/UserDashboardMenu';

interface MenuItem { path: string; label: string; }

const menuItems: MenuItem[] = [
  { path: '/news', label: '소식' },
  { path: '/activities', label: '활동' },
  { path: '/goods', label: '굿즈 · 멤버십' },
  { path: '/guide', label: '가이드' },
  { path: '/others', label: '기타' },
];

export function TopNavigation() {
  const location = useLocation();
  
  // ✅ 로그인 상태 관리 (테스트용)
  const [status, setStatus] = useState<AuthStatus>('guest');

  // 동작 시뮬레이션 함수들
  const handleLogin = () => {
    alert("구글 로그인 창이 열립니다.");
    setStatus('google'); 
  };

  const handleVerify = () => {
    alert("네이버 카페 인증을 진행합니다.");
    setStatus('cafe'); 
  };

  const handleLogout = () => {
    setStatus('guest');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/70 backdrop-blur-xl h-16 flex-none transition-all duration-300">
      <div className="w-full h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* 1. 로고 (홈으로 이동) */}
        <Link to="/" className="flex items-center gap-2 group min-w-max">
          <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <Sparkles className="size-5" />
          </div>
          <span className="hidden md:block font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            PastelHub
          </span>
        </Link>

        {/* 2. 중앙 탭 메뉴 */}
        <div className="hidden lg:flex items-center gap-1 bg-white/50 px-1.5 py-1.5 rounded-full border border-white/60 shadow-inner">
          {menuItems.map((menu) => {
            const isActive = location.pathname.startsWith(menu.path);
            return (
              <Link
                key={menu.path}
                to={menu.path}
                className={`
                  relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${isActive 
                    ? 'text-indigo-600 bg-white shadow-sm ring-1 ring-black/5' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'}
                `}
              >
                {menu.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 w-1 h-1 bg-indigo-500 rounded-full -translate-x-1/2 opacity-0 transition-all duration-300 lg:opacity-100" />
                )}
              </Link>
            );
          })}
        </div>

        {/* 3. 우측: 인증 버튼 & 대시보드 */}
        <div className="flex items-center gap-3 min-w-max justify-end">
          
          {/* 상태별 액션 버튼 (로그인/인증) */}
          <AuthStatusButton 
            status={status} 
            onLogin={handleLogin} 
            onVerify={handleVerify} 
          />

          {/* 유저 대시보드 (드롭다운) */}
          <UserDashboardMenu 
            status={status} 
            onLogout={handleLogout} 
          />
        </div>

      </div>
    </nav>
  );
}