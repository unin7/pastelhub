import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, UserLevel } from '../types';

interface AuthContextType {
  user: User | null;
  level: UserLevel;
  login: (level: UserLevel, userData?: Partial<User>) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'pastelhub_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // 로컬 스토리지에서 사용자 정보 복원
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = (level: UserLevel, userData?: Partial<User>) => {
    const newUser: User = {
      id: userData?.id || `user_${Date.now()}`,
      email: userData?.email,
      name: userData?.name,
      avatar: userData?.avatar,
      level,
      googleAuth: level >= 1,
      naverCafeVerified: level >= 2,
      isActiveUser: level >= 3,
      createdAt: userData?.createdAt || new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      ...userData,
    };
    
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      ...updates,
      lastActiveAt: new Date().toISOString(),
    };
    
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const level = user?.level ?? 0;
  const isAuthenticated = level > 0;

  return (
    <AuthContext.Provider
      value={{
        user,
        level,
        login,
        logout,
        updateUser,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

