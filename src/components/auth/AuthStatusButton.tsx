import { LogIn, User, CheckCircle } from "lucide-react";

export type AuthStatus = 'guest' | 'google' | 'cafe';

interface AuthStatusButtonProps {
  status: AuthStatus;
  onLogin: () => void;
  onVerify: () => void;
}

export function AuthStatusButton({ status, onLogin, onVerify }: AuthStatusButtonProps) {
  if (status === 'guest') {
    return (
      <button onClick={onLogin} className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-all hover:scale-105 active:scale-95">
        <LogIn className="w-3.5 h-3.5" /><span>로그인 필요</span>
      </button>
    );
  }
  if (status === 'google') {
    return (
      <button onClick={onVerify} className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-sm shadow-blue-100">
        <User className="w-3.5 h-3.5" /><span>구글 로그인됨</span>
        <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1 animate-pulse">인증 필요</span>
      </button>
    );
  }
  if (status === 'cafe') {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 font-bold text-xs cursor-default select-none">
        <CheckCircle className="w-3.5 h-3.5 fill-green-100" /><span>카페 인증 완료</span>
      </div>
    );
  }
  return null;
}