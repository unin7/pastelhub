import * as React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  // 공통
  Radio, 
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
import { useJsonData } from "../hooks/useJsonData";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";

// ----------------------------------------------------------------------
// 데이터 섹션 (이전과 동일하게 유지 - 생략 없이 넣어주세요)
// ----------------------------------------------------------------------
interface LiveStatus { name: string; status: string; title: string; profileImg: string; liveUrl: string; }
const newsSections = [ { title: "일정 · D-DAY", icon: Calendar, url: "/news/schedule" }, { title: "방송 현황", icon: RadioIcon, url: "/news/broadcast" }, { title: "팬카페 공지", icon: FileText, url: "/news/cafe" }, { title: "X (트위터)", icon: TwitterIcon, url: "/news/twitter" }, { title: "YouTube", icon: Youtube, url: "/news/videos" }, { title: "최근 노래", icon: Music, url: "/news/songs" }, ];
const goodsSections = [ { title: '티켓팅', icon: Ticket, url: '/goods/ticket' }, { title: '앨범', icon: Disc, url: '/goods/album' }, { title: '공식 스토어', icon: ShoppingBag, url: '/goods/goods' }, { title: '2차 창작 부스', icon: Store, url: '/goods/market' }, { title: '멤버십', icon: Calculator, url: '/goods/membership' }, { title: '기부 · 서포트', icon: Megaphone, url: '/goods/support' }, ];
const activitySections = [ { title: "할 일 목록", icon: CheckSquare, url: "/activities/todo" }, { title: "투표 · Hype", icon: Trophy, url: "/activities/voting" }, { title: "이벤트", icon: Calendar, url: "/activities/events" }, { title: "트렌딩 툴", icon: TrendingUp, url: "/activities/trending" }, { title: "음원 스밍", icon: Music, url: "/activities/streaming" }, { title: "YouTube Fix", icon: Wrench, url: "/activities/youtube-fix" }, ];
const otherSections = [ { title: "팬아트", icon: Image, url: "/others/fanArt" }, { title: "노래방", icon: Mic, url: "/others/karaoke" }, { title: "팬게임", icon: Gamepad, url: "/others/games" }, { title: "굿즈 거래", icon: ShoppingBag, url: "/others/goods" }, { title: "신문고", icon: Megaphone, url: "/others/sinmungo" }, { title: "공지·의견", icon: Bell, url: "/others/notice" }, ];
const guideSections = [ { title: '기본 활동', icon: BookOpen, url: '/guide/basic' }, { title: '굿즈/포카', icon: ShoppingBag, url: '/guide/goods' }, { title: '공연/티켓', icon: Ticket, url: '/guide/concert' }, { title: '서포트', icon: Heart, url: '/guide/support' }, { title: '창작 활동', icon: PenTool, url: '/guide/creation' }, { title: '커뮤니티', icon: Users, url: '/guide/community' }, { title: '신고/문의', icon: Siren, url: '/guide/report' }, ];

function HomeSidebarContent() {
  const { data: members } = useJsonData<LiveStatus[]>('status');
  return (
    <div className="h-full px-3 py-4">
      <div className="mb-4 px-2 flex items-center gap-2">
         <Radio className="w-4 h-4 text-purple-600 animate-pulse" />
         <p className="text-sm font-bold text-purple-900/80 tracking-wide">LIVE STATION</p>
      </div>
      <div className="space-y-2">
        {members?.map((member, idx) => {
           const isLive = member.status.includes('live');
           return (
             <a key={idx} href={member.liveUrl} target="_blank" rel="noreferrer" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 cursor-pointer group border ${ isLive ? 'bg-white shadow-sm border-purple-100 hover:shadow-md hover:border-purple-200' : 'border-transparent hover:bg-white/60 hover:border-gray-100' }`}>
               <div className={`relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 p-[2px] transition-transform group-hover:scale-105 ${ isLive ? 'bg-gradient-to-br from-pink-400 to-purple-400' : 'bg-gray-100' }`}>
                 <img src={member.profileImg} alt={member.name} className="w-full h-full rounded-full object-cover bg-white border border-white" />
                 {isLive && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full ring-1 ring-green-100"></span>}
               </div>
               <div className="flex-1 min-w-0">
                 <div className="flex items-center justify-between">
                   <span className={`text-sm font-bold truncate ${isLive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}`}>{member.name}</span>
                   {isLive && <span className="text-[10px] font-extrabold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full animate-pulse tracking-tight">LIVE</span>}
                 </div>
                 <p className="text-xs text-gray-400 truncate mt-0.5 group-hover:text-gray-500 transition-colors">{isLive ? '방송 중입니다!' : member.title}</p>
               </div>
             </a>
           );
        })}
      </div>
    </div>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const pathname = location.pathname;
  const isHome = pathname === "/";

  let items: any[] = [];
  let label = "";
  let themeClass = "";

  if (pathname.startsWith("/news")) { items = newsSections; label = "소식 (News)"; themeClass = "data-[active=true]:bg-blue-50 data-[active=true]:text-blue-600 data-[active=true]:border-blue-200 hover:bg-blue-50/50 hover:text-blue-600"; }
  else if (pathname.startsWith("/goods")) { items = goodsSections; label = "굿즈 · 멤버십"; themeClass = "data-[active=true]:bg-purple-50 data-[active=true]:text-purple-600 data-[active=true]:border-purple-200 hover:bg-purple-50/50 hover:text-purple-600"; }
  else if (pathname.startsWith("/activities")) { items = activitySections; label = "활동 (Activities)"; themeClass = "data-[active=true]:bg-pink-50 data-[active=true]:text-pink-600 data-[active=true]:border-pink-200 hover:bg-pink-50/50 hover:text-pink-600"; }
  else if (pathname.startsWith("/others")) { items = otherSections; label = "기타 (Others)"; themeClass = "data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-600 data-[active=true]:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-600"; }
  else if (pathname.startsWith("/guide")) { items = guideSections; label = "가이드 (Guide)"; themeClass = "data-[active=true]:bg-indigo-50 data-[active=true]:text-indigo-600 data-[active=true]:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-600"; }

  // ✅ collapsible="none"으로 설정하여 항상 펼쳐진 고정 패널로 만듭니다.
  return (
    <Sidebar collapsible="none" className="border-r bg-white/30 backdrop-blur-sm w-72 h-full">
      <SidebarContent className="px-2 pt-6">
        {isHome ? (
          <HomeSidebarContent />
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-1">
              {label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.url}
                      tooltip={item.title}
                      className={`h-10 rounded-xl transition-all duration-300 border border-transparent font-medium text-gray-500 ${themeClass} data-[active=true]:shadow-sm data-[active=true]:font-bold`}
                    >
                      <Link to={item.url} onClick={() => setOpenMobile(false)} className="flex items-center gap-3 px-3">
                        <item.icon className="size-5" />
                        <span>{item.title}</span>
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