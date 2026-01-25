import * as React from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  Radio, Search, Calendar, FileText, Twitter as TwitterIcon, Radio as RadioIcon, 
  Music, Youtube, Image, Mic, Gamepad, ShoppingBag, Megaphone, Bell, 
  Ticket, Disc, Store, Calculator, CheckSquare, Trophy, TrendingUp, 
  Wrench, BookOpen, Heart, PenTool, Users, Siren 
} from "lucide-react";
import { useJsonData } from "../hooks/useJsonData";
import { 
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, 
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, 
  useSidebar 
} from "./ui/sidebar";
import { cn } from "../utils/common";

// ----------------------------------------------------------------------
// 1. 데이터 정의
// ----------------------------------------------------------------------
interface LiveStatus { name: string; status: string; title: string; profileImg: string; liveUrl: string; }

const newsSections = [ { title: "일정 · D-DAY", icon: Calendar, url: "/news/schedule" }, { title: "방송 현황", icon: RadioIcon, url: "/news/broadcast" }, { title: "팬카페 공지", icon: FileText, url: "/news/cafe" }, { title: "X (트위터)", icon: TwitterIcon, url: "/news/twitter" }, { title: "YouTube", icon: Youtube, url: "/news/videos" }, { title: "최근 노래", icon: Music, url: "/news/songs" } ];
const goodsSections = [ { title: '티켓팅', icon: Ticket, url: '/goods/ticket' }, { title: '앨범', icon: Disc, url: '/goods/album' }, { title: '공식 스토어', icon: ShoppingBag, url: '/goods/goods' }, { title: '2차 창작 부스', icon: Store, url: '/goods/market' }, { title: '멤버십', icon: Calculator, url: '/goods/membership' }, { title: '기부 · 서포트', icon: Megaphone, url: '/goods/support' } ];
const activitySections = [ { title: "할 일 목록", icon: CheckSquare, url: "/activities/todo" }, { title: "투표 · Hype", icon: Trophy, url: "/activities/voting" }, { title: "이벤트", icon: Calendar, url: "/activities/events" }, { title: "트렌딩 툴", icon: TrendingUp, url: "/activities/trending" }, { title: "음원 스밍", icon: Music, url: "/activities/streaming" }, { title: "YouTube Fix", icon: Wrench, url: "/activities/youtube-fix" } ];
const otherSections = [ { title: "팬아트", icon: Image, url: "/others/fanArt" }, { title: "노래방", icon: Mic, url: "/others/karaoke" }, { title: "팬게임", icon: Gamepad, url: "/others/games" }, { title: "굿즈 거래", icon: ShoppingBag, url: "/others/goods" }, { title: "신문고", icon: Megaphone, url: "/others/sinmungo" }, { title: "공지·의견", icon: Bell, url: "/others/notice" } ];
const guideSections = [ { title: '기본 활동', icon: BookOpen, url: '/guide/basic' }, { title: '굿즈/포카', icon: ShoppingBag, url: '/guide/goods' }, { title: '공연/티켓', icon: Ticket, url: '/guide/concert' }, { title: '서포트', icon: Heart, url: '/guide/support' }, { title: '창작 활동', icon: PenTool, url: '/guide/creation' }, { title: '커뮤니티', icon: Users, url: '/guide/community' }, { title: '신고/문의', icon: Siren, url: '/guide/report' } ];

// ----------------------------------------------------------------------
// 2. 홈 화면 사이드바 (Live Status)
// ----------------------------------------------------------------------
function HomeSidebarContent() {
  const { data: members } = useJsonData<LiveStatus[]>('status');

  return (
    <div className="h-full px-4 py-6">
      <div className="mb-5 px-2 flex items-center gap-2">
         <Radio className="w-5 h-5 text-purple-600 animate-pulse" />
         <p className="text-base font-bold text-purple-900/80 tracking-wide">LIVE STATION</p>
      </div>
      <div className="space-y-3">
        {members?.map((member, idx) => {
           const isLive = member.status.includes('live');
           return (
             <a key={idx} href={member.liveUrl} target="_blank" rel="noreferrer" className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer group border ${ isLive ? 'bg-white shadow-md border-purple-100 hover:shadow-lg hover:border-purple-200' : 'border-transparent hover:bg-white/60 hover:border-gray-100' }`}>
               <div className={`relative w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 p-[3px] transition-transform group-hover:scale-105 ${ isLive ? 'bg-gradient-to-br from-pink-400 to-purple-400' : 'bg-gray-100' }`}>
                 <img src={member.profileImg} alt={member.name} className="w-full h-full rounded-full object-cover bg-white border-2 border-white" />
                 {isLive && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full ring-1 ring-green-100"></span>}
               </div>
               <div className="flex-1 min-w-0">
                 <div className="flex items-center justify-between">
                   <span className={`text-base font-bold truncate ${isLive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}`}>{member.name}</span>
                   {isLive && <span className="text-[11px] font-extrabold text-red-500 bg-red-50 px-2 py-0.5 rounded-full animate-pulse tracking-tight">LIVE</span>}
                 </div>
                 <p className="text-sm text-gray-400 truncate mt-1 group-hover:text-gray-500 transition-colors">{isLive ? '방송 중입니다!' : member.title}</p>
               </div>
             </a>
           );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. 가이드 화면 사이드바 (검색 + 목차)
// ----------------------------------------------------------------------
function GuideSidebarContent() {
  const { setOpenMobile } = useSidebar();
  
  return (
    <div className="h-full flex flex-col">
      {/* 검색창 */}
      <div className="px-5 py-6 sticky top-0 bg-white/50 backdrop-blur-sm z-10 border-b border-indigo-100/50">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
          <input 
            type="text" 
            placeholder="가이드 검색..." 
            className="w-full pl-11 pr-4 py-3 bg-white/80 border border-indigo-100 rounded-2xl text-base text-indigo-900 placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* 목차 리스트 */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarGroupLabel className="px-4 text-xs font-bold text-indigo-400/80 mb-3">목차 (Table of Contents)</SidebarGroupLabel>
        <SidebarMenu className="gap-2">
          {guideSections.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className="h-14 rounded-xl hover:bg-indigo-50/80 hover:text-indigo-600 text-gray-500 transition-all">
                <Link to={item.url} onClick={() => setOpenMobile(false)} className="flex items-center gap-4 px-4">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                    <item.icon className="size-5" />
                  </div>
                  <span className="font-medium text-base">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. 메인 AppSidebar
// ----------------------------------------------------------------------
export function AppSidebar() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const pathname = location.pathname;
  
  let items: any[] = [];
  let label = "";
  
  // 섹션별 테마 설정
  let themeConfig = {
    activeBg: "",
    iconActive: "",
    iconInactive: "",
    textActive: "",
    textInactive: "",
    hover: ""
  };

  if (pathname.startsWith("/news")) { 
    items = newsSections; label = "소식 (News)"; 
    themeConfig = {
      activeBg: "bg-white/90 border-blue-200 shadow-xl ring-1 ring-blue-100",
      iconActive: "bg-gradient-to-br from-blue-400 to-cyan-400 shadow-blue-200 text-white",
      iconInactive: "bg-white text-blue-300 group-hover:text-blue-400",
      textActive: "text-blue-900",
      textInactive: "text-gray-500",
      hover: "hover:bg-white/80 hover:border-blue-100 hover:shadow-md"
    };
  }
  else if (pathname.startsWith("/goods")) { 
    items = goodsSections; label = "굿즈 · 멤버십"; 
    themeConfig = {
      activeBg: "bg-white/90 border-purple-200 shadow-xl ring-1 ring-purple-100",
      iconActive: "bg-gradient-to-br from-purple-400 to-violet-400 shadow-purple-200 text-white",
      iconInactive: "bg-white text-purple-300 group-hover:text-purple-400",
      textActive: "text-purple-900",
      textInactive: "text-gray-500",
      hover: "hover:bg-white/80 hover:border-purple-100 hover:shadow-md"
    };
  }
  else if (pathname.startsWith("/activities")) { 
    items = activitySections; label = "활동 (Activities)"; 
    themeConfig = {
      activeBg: "bg-white/90 border-pink-200 shadow-xl ring-1 ring-pink-100",
      iconActive: "bg-gradient-to-br from-pink-400 to-rose-400 shadow-pink-200 text-white",
      iconInactive: "bg-white text-pink-300 group-hover:text-pink-400",
      textActive: "text-pink-900",
      textInactive: "text-gray-500",
      hover: "hover:bg-white/80 hover:border-pink-100 hover:shadow-md"
    };
  }
  else if (pathname.startsWith("/others")) { 
    items = otherSections; label = "기타 (Others)"; 
    themeConfig = {
      activeBg: "bg-white/90 border-emerald-200 shadow-xl ring-1 ring-emerald-100",
      iconActive: "bg-gradient-to-br from-emerald-400 to-teal-400 shadow-emerald-200 text-white",
      iconInactive: "bg-white text-emerald-300 group-hover:text-emerald-400",
      textActive: "text-emerald-900",
      textInactive: "text-gray-500",
      hover: "hover:bg-white/80 hover:border-emerald-100 hover:shadow-md"
    };
  }

  // ✅ w-80 (320px)으로 통일하여 중간 크기 확보
  return (
    <Sidebar collapsible="none" className="border-r bg-white/30 backdrop-blur-sm w-80 h-full">
      <SidebarContent className="px-3 pt-8">
        
        {/* 1. 홈 화면 */}
        {pathname === "/" ? (
          <HomeSidebarContent />
        ) : pathname.startsWith("/guide") ? (
          /* 2. 가이드 화면 */
          <GuideSidebarContent />
        ) : (
          /* 3. 메뉴 화면 (소식/활동/굿즈/기타) */
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 mb-2">
              {label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2.5">
                {items.map((item) => {
                  const isActive = pathname === item.url;
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        // ✅ h-14 (56px)로 버튼 크기 확대
                        className={cn(
                          "h-14 rounded-2xl transition-all duration-300 border border-transparent font-medium group",
                          isActive ? themeConfig.activeBg : themeConfig.hover,
                          isActive ? "scale-[1.02]" : "hover:scale-[1.01]"
                        )}
                      >
                        <Link to={item.url} onClick={() => setOpenMobile(false)} className="flex items-center gap-4 px-4">
                          {/* ✅ 아이콘 박스 크기 확대 (w-10 h-10) */}
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                            isActive ? themeConfig.iconActive : themeConfig.iconInactive
                          )}>
                            <item.icon className="size-5" /> {/* 아이콘 크기 확대 */}
                          </div>
                          
                          {/* ✅ 텍스트 크기 확대 (text-base) */}
                          <span className={cn(
                            "text-base transition-colors",
                            isActive ? themeConfig.textActive : themeConfig.textInactive,
                            !isActive && "group-hover:text-gray-700"
                          )}>
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

      </SidebarContent>
    </Sidebar>
  );
}
