import { createContext, useContext, useState, ReactNode } from 'react';
import { USER_LEVELS, UserLevel } from './auth.const';

interface AuthContextType {
  userLevel: UserLevel;
  login: () => void;
  verifyNaver: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userLevel, setUserLevel] = useState<UserLevel>(USER_LEVELS.GUEST);

  const login = () => { alert("구글 로그인 완료 (가상)"); setUserLevel(USER_LEVELS.MEMBER); };
  const verifyNaver = () => { alert("네이버 인증 완료 (가상)"); setUserLevel(USER_LEVELS.VERIFIED); };
  const logout = () => { setUserLevel(USER_LEVELS.GUEST); };

  return (
    <AuthContext.Provider value={{ userLevel, login, verifyNaver, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};