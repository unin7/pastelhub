{\rtf1}import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User, Settings, LogOut, CreditCard } from "lucide-react";
import { AuthStatus } from "./AuthStatusButton";

interface UserDashboardMenuProps {
  status: AuthStatus;
  onLogout: () => void;
}

export function UserDashboardMenu({ status, onLogout }: UserDashboardMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-50 to-pink-50 text-slate-500 transition-all duration-300 hover:bg-white hover:text-pink-500 hover:shadow-md hover:scale-105 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-200"
        >
          <User className="h-5 w-5" />
          {/* 상태 뱃지 (우측 하단 점) */}
          <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
            status === 'cafe' ? 'bg-green-500' : (status === 'google' ? 'bg-blue-500' : 'bg-gray-300')
          }`} />
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">사용자 님</p>
            <p className="text-xs leading-none text-muted-foreground">
              {status === 'guest' ? '로그인이 필요합니다' : 'user@example.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {status !== 'guest' && (
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>프로필 설정</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>멤버십 관리</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>환경 설정</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{status === 'guest' ? '로그인 하러가기' : '로그아웃'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}