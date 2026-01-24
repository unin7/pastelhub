import * as React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  // 공통
  Home, Circle, Radio,
  // News
  Calendar, FileText, Twitter as TwitterIcon, Radio as RadioIcon, Music, Youtube,
  // Others
  Image, Mic, Gamepad, ShoppingBag, Megaphone, Bell,
  // Goods
  Ticket, Disc, Store, Calculator,
  // Activities
  CheckSquare, Trophy, TrendingUp, Wrench,
  // Guide
  BookOpen, Heart, PenTool, Users, Siren
} from "lucide-react";
import { useJsonData } from "../hooks/useJsonData"; // 훅 경로 확인해주세요
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";

// ----------------------------------------------------------------------
// 1. 데이터 타입 및 메뉴 정의
// ----------------------------------------------------------------------

interface LiveStatus {
  name: string;
  status: string;
  title: string;
  profileImg: string;
  liveUrl: string;
}

const newsSections = [
  { title: "일정 · D-DAY", icon: Calendar, url: "/news/schedule" },
  { title: "방송 현황", icon: RadioIcon, url: "/news/broadcast" },
  { title: "팬카페 공지", icon: FileText, url: "/news/cafe" },
  { title: "X (트위터)", icon: TwitterIcon, url: "/news/twitter" },
  { title: "YouTube", icon: Youtube, url: "/news/videos" },
  { title: "최근 노래", icon: Music, url: "/news/songs" },
];

const goodsSections = [
  { title: '티켓팅', icon: Ticket, url: '/goods/ticket' },
  { title: '앨범', icon: Disc, url: '/goods/album' },
  { title: '공식 스토어', icon: ShoppingBag, url: '/goods/goods' },
  { title: '2차 창작 부스', icon: Store, url: '/goods/market' },
  { title: '멤버십', icon: Calculator, url: '/goods/membership' },
  { title: '기부 · 서포트', icon: Megaphone, url: '/goods/support' },
];

const activitySections = [
  { title: "할 일 목록", icon: CheckSquare, url: "/activities/todo" },
  { title: "투표 · Hype", icon: Trophy, url: "/activities/voting" },
  { title: "이벤트", icon: Calendar, url: "/activities/events" },
  { title: "트렌딩 툴", icon: TrendingUp, url: "/activities/trending" },
  { title: "음원 스밍", icon: Music, url: "/activities/streaming" },
  { title: "YouTube Fix", icon: Wrench, url: "/activities/youtube-fix" },
];

const otherSections = [
  { title: "팬아트", icon: Image, url: "/others/fanArt" },
  { title: "노래방", icon: Mic, url: "/others/karaoke" },
  { title: "팬게임", icon: Gamepad, url: "/others/games" },
  { title: "굿즈 거래", icon: ShoppingBag, url: "/others/goods" },
  { title: "신문고", icon: Megaphone, url: "/others/sinmungo" },
  { title: "공지·의견", icon: Bell, url: "/others/notice" },
];

const guideSections = [
  { title: '기본 활동', icon: BookOpen, url: '/guide/basic' },
  { title: '굿즈/포카', icon: ShoppingBag, url: '/guide/goods' },
  { title: '공연/티켓', icon: Ticket, url: '/guide/concert' },
  { title: '서포트', icon: Heart, url: '/guide/support' },
  { title: '창작 활동', icon: PenTool, url: '/guide/creation' },
  { title: '커뮤니티', icon: Users, url: '/guide/community' },
  { title: '신고/문의', icon: Siren, url: '/guide/report' },
];

// ----------------------------------------------------------------------
// 2. 내부 컴포넌트: 홈 화면일 때 보일 Live Status 목록
// ----------------------------------------------------------------------
function HomeSidebarContent() {
  const { data: members } = useJsonData<LiveStatus[]>('status');

  const getStatusColor = (status: string) => {
    if (status.includes('live')) return 'text-green-500';
    return 'text-gray-300';
  };

  return (
    <div className="h-full px-2 py-4">
      <div className="mb-3 px-2 flex items-center gap-2">
         <Radio className="w-3 h-3 text-purple-600 animate-pulse" />
         <p className="text-xs font-bold text-purple-600 tracking-wider">LIVE STATION</p>
      </div>

      <div className="space-y-1">
        {members?.map((member, idx) => {
           const isLive = member.status.includes('live');
           return (
             <a
               key={idx}
               href={member.liveUrl}
               target="_blank" 
               rel="noreferrer"
               className={`flex items-center gap-3 px-2 py-2 rounded-xl transition-all cursor-pointer group ${
                   isLive 
                   ? 'bg-white shadow-sm ring-1 ring-purple-100 hover:shadow-md' 
                   : 'hover:bg-white/60'
               }`}
             >
               {/* 아바타 */}
               <div className={`relative w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 p-[2px] ${
                 isLive ? 'bg-gradient-to-br from-pink-400 to-purple-400' : 'bg-gray-100'
               }`}>
                 <img src={member.profileImg} alt={member.name} className="w-full h-full rounded-full object-cover bg-white border border-white" />
                 {isLive && (
                   <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                 )}
               </div>

               {/* 정보 */}
               <div className="flex-1 min-w-0">
                 <div className="flex items-center justify-between">
                   <span className={`text-xs font-bold truncate ${isLive ? 'text-gray-900' : 'text-gray-500'}`}>
                     {member.name}
                   </span>
                   {isLive && (
                     <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full animate-pulse">
                       LIVE
                     </span>
                   )}
                 </div>
                 <p className="text-[10px] text-gray-400 truncate mt-0.5">
                   {isLive ? '방송 중입니다!' : member.title}
                 </p>
               </div>
             </a>
           );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. 메인 컴포넌트: AppSidebar
// ----------------------------------------------------------------------
export function AppSidebar() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const pathname = location.pathname;

  // 현재 경로 확인
  const isHome = pathname === "/";

  let items = [];
  let label = "";

  if (pathname.startsWith("/news")) {
    items = newsSections;
    label = "소식 (News)";
  } else if (pathname.startsWith("/goods")) {
    items = goodsSections;
    label = "굿즈 · 멤버십";
  } else if (pathname.startsWith("/activities")) {
    items = activitySections;
    label = "활동 (Activities)";
  } else if (pathname.startsWith("/others")) {
    items = otherSections;
    label = "기타 (Others)";
  } else if (pathname.startsWith("/guide")) {
    items = guideSections;
    label = "가이드 (Guide)";
  }

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      {/* 배경 스타일 적용 */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-purple-50/50 to-pink-50/50 -z-10" />
      
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-sm">
                  <Home className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-gray-800">PastelHub</span>
                  <span className="text-[10px] text-gray-500">v0.1.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {isHome ? (
          // ✅ 홈 화면: Live Status 패널 (통합됨)
          <HomeSidebarContent />
        ) : (
          // ✅ 서브 페이지: 해당 메뉴 목록
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2">
              {label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="px-2">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.url}
                      tooltip={item.title}
                      className="data-[active=true]:bg-white data-[active=true]:shadow-sm data-[active=true]:text-purple-600 transition-all duration-200"
                    >
                      <Link 
                        to={item.url} 
                        onClick={() => setOpenMobile(false)}
                      >
                        <item.icon />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}