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
interface SectionItem { title: string; description: string; icon: any; url: string; }
interface LiveStatus { name: string; status: string; title: string; profileImg: string; liveUrl: string; }

const newsSections: SectionItem[] = [ 
  { title: "일정 · D-DAY", description: "주요 스케줄 확인", icon: Calendar, url: "/news/schedule" }, 
  { title: "방송 현황", description: "실시간 생방송", icon: RadioIcon, url: "/news/broadcast" }, 
  { title: "팬카페 공지", description: "공식 공지사항", icon: FileText, url: "/news/cafe" }, 
  { title: "X (트위터)", description: "실시간 타임라인", icon: TwitterIcon, url: "/news/twitter" }, 
  { title: "YouTube", description: "공식 영상 모음", icon: Youtube, url: "/news/videos" }, 
  { title: "최근 노래", description: "최신 커버곡 듣기", icon: Music, url: "/news/songs" } 
];
const goodsSections: SectionItem[] = [ 
  { title: '티켓팅', description: '공연/이벤트 예매', icon: Ticket, url: '/goods/ticket' }, 
  { title: '앨범', description: '음반 구매처', icon: Disc, url: '/goods/album' }, 
  { title: '공식 스토어', description: '공식 굿즈샵', icon: ShoppingBag, url: '/goods/goods' }, 
  { title: '2차 창작 부스', description: '팬 메이드 굿즈', icon: Store, url: '/goods/market' }, 
  { title: '멤버십', description: '혜택 및 가입', icon: Calculator, url: '/goods/membership' }, 
  { title: '기부 · 서포트', description: '마음 전하기', icon: Megaphone, url: '/goods/support' } 
];
const activitySections: SectionItem[] = [ 
  { title: "할 일 목록", description: "오늘의 숙제", icon: CheckSquare, url: "/activities/todo" }, 
  { title: "투표 · Hype", description: "화력 지원하기", icon: Trophy, url: "/activities/voting" }, 
  { title: "이벤트", description: "진행중 이벤트", icon: Calendar, url: "/activities/events" }, 
  { title: "실트", description: "원클릭 실트", icon: TrendingUp, url: "/activities/trending" }, 
  { title: "음원 스밍", description: "스트리밍 가이드", icon: Music, url: "/activities/streaming" }, 
  { title: "유튜브 정상화", description: "기능 복구 도구", icon: Wrench, url: "/activities/youtube-fix" } 
];
const otherSections: SectionItem[] = [ 
  { title: "팬아트", description: "금손들의 작품", icon: Image, url: "/others/fanArt" }, 
  { title: "노래방", description: "노래방 번호 검색", icon: Mic, url: "/others/karaoke" }, 
  { title: "팬게임", description: "팬 제작 게임", icon: Gamepad, url: "/others/games" }, 
  { title: "굿즈 거래", description: "중고 장터", icon: ShoppingBag, url: "/others/goods" }, 
  { title: "신문고", description: "건의 및 제보", icon: Megaphone, url: "/others/sinmungo" }, 
  { title: "공지·의견", description: "통합 알림판", icon: Bell, url: "/others/notice" } 
];
const guideSections = [ 
  { title: '기본 활동', description: "입문자 필독", icon: BookOpen, url: '/guide/basic' }, 
  { title: '굿즈/포카', description: "수집 가이드", icon: ShoppingBag, url: '/guide/goods' }, 
  { title: '공연/티켓', description: "예매 꿀팁", icon: Ticket, url: '/guide/concert' }, 
  { title: '서포트', description: "2차 창작 가이드", icon: Heart, url: '/guide/support' }, 
  { title: '창작 활동', description: "2차 창작 규정", icon: PenTool, url: '/guide/creation' }, 
  { title: '커뮤니티', description: "활동 규칙", icon: Users, url: '/guide/community' }, 
  { title: '신고/문의', description: "고객센터", icon: Siren, url: '/guide/report' } 
];

// ----------------------------------------------------------------------
// 2. 홈 화면 사이드바 (Live Status) - 수정됨
// ----------------------------------------------------------------------
function HomeSidebarContent() {
  const { data: members } = useJsonData<LiveStatus[]>('status');

  // ✅ 1. 방송 중인 사람만 필터링 ('live'가 status에 포함된 경우)
  const liveMembers = members?.filter(member => member.status.includes('live')) || [];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 custom-scrollbar">
        {/* 방송 중인 멤버가 없을 경우 안내 메시지 */}
        {liveMembers.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-gray-400">
            현재 방송 중인 멤버가 없습니다.
          </div>
        )}

        {liveMembers.map((member, idx) => {
           // ✅ 2. 플랫폼 감지 (URL에 x.com 또는 twitter.com이 있으면 X 스페이스)
           const isXSpace = member.liveUrl.includes('x.com') || member.liveUrl.includes('twitter.com');
           
           // ✅ 3. 색상 설정 (치지직: 녹색 계열, X: 검은색 계열)
           const borderClass = isXSpace 
             ? "bg-black" // X: 검은색 테두리
             : "bg-gradient-to-br from-green-400 to-emerald-500"; // 치지직: 녹색 그라데이션

           const badgeClass = isXSpace
             ? "bg-black text-white" 
             : "bg-green-50 text-green-600";

           const badgeText = isXSpace ? "SPACE" : "LIVE";

           return (
             <a key={idx} href={member.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 cursor-pointer group border bg-white shadow-sm border-purple-100 hover:shadow-md hover:border-purple-200">
               {/* 프로필 이미지 영역 */}
               <div 
                 className={`relative rounded-full flex items-center justify-center flex-shrink-0 p-[2px] transition-transform group-hover:scale-105 ${borderClass}`}
                 style={{ width: '40px', height: '40px', minWidth: '40px' }} 
               >
                 <img src={member.profileImg} alt={member.name} className="w-full h-full rounded-full object-cover bg-white border-2 border-white" />
                 {/* 우측 하단 상태 점 (X는 검정, 치지직은 초록) */}
                 <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${isXSpace ? 'bg-black' : 'bg-green-500'}`}></span>
               </div>
               
               <div className="flex-1 min-w-0">
                 <div className="flex items-center justify-between">
                   <span className="text-sm font-bold truncate text-gray-900">{member.name}</span>
                   {/* LIVE / SPACE 뱃지 */}
                   <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full animate-pulse tracking-tight flex-none ml-1 ${badgeClass}`}>
                     {badgeText}
                   </span>
                 </div>
                 <p className="text-xs text-gray-400 truncate mt-0.5 group-hover:text-gray-500 transition-colors">
                   {isXSpace ? '스페이스 청취하기' : '치지직 방송 중!'}
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
// 3. 가이드 화면 사이드바 (이하 동일)
// ----------------------------------------------------------------------
function GuideSidebarContent() {
  const { setOpenMobile } = useSidebar();
  const location = useLocation();
  const pathname = location.pathname;

  const guideTheme = {
    activeBg: "bg-white/90 border-indigo-200 shadow-sm ring-1 ring-indigo-100",
    iconActive: "bg-gradient-to-br from-indigo-400 to-violet-400 shadow-indigo-200 text-white",
    iconInactive: "bg-white text-indigo-300 group-hover:text-indigo-400",
    textActive: "text-indigo-900",
    textInactive: "text-gray-500",
    hover: "hover:bg-white/80 hover:border-indigo-100 hover:shadow-sm"
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-4 sticky top-0 bg-white/50 backdrop-blur-sm z-10 border-b border-indigo-100/50 flex-none">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 pointer-events-none" />
          <input 
            type="text" 
            placeholder="가이드 검색..." 
            className="w-full pl-10 pr-3 py-2.5 bg-white/80 border border-indigo-100 rounded-xl text-sm text-indigo-900 placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3 custom-scrollbar">
        <SidebarGroupLabel className="px-4 text-xs font-bold text-indigo-400/80 mb-2">목차 (Table of Contents)</SidebarGroupLabel>
        <SidebarMenu className="gap-3">
          {guideSections.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  className={cn(
                    "h-auto py-3 rounded-xl transition-all duration-300 border border-transparent font-medium group items-start", 
                    isActive ? guideTheme.activeBg : guideTheme.hover,
                    isActive ? "scale-[1.02]" : "hover:scale-[1.01]"
                  )}
                >
                  <Link to={item.url} onClick={() => setOpenMobile(false)} className="flex items-center gap-3 px-3 w-full">
                    <div 
                      className={cn(
                        "rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0",
                        isActive ? guideTheme.iconActive : guideTheme.iconInactive
                      )}
                      style={{ width: '36px', height: '36px', minWidth: '36px' }}
                    >
                      <item.icon className="size-4" />
                    </div>
                    
                    <div className="flex flex-col justify-center min-w-0">
                      <span className={cn("text-sm font-semibold transition-colors leading-tight", isActive ? guideTheme.textActive : guideTheme.textInactive, !isActive && "group-hover:text-gray-700")}>
                        {item.title}
                      </span>
                      {item.description && (
                        <span className={cn("text-[11px] mt-0.5 truncate", isActive ? "opacity-80" : "text-gray-400 group-hover:text-gray-500")}>
                          {item.description}
                        </span>
                      )}
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
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
  
  let themeConfig = {
    activeBg: "", iconActive: "", iconInactive: "", textActive: "", textInactive: "", hover: ""
  };

  if (pathname.startsWith("/news")) { 
    items = newsSections; label = "소식 (News)"; 
    themeConfig = { activeBg: "bg-white/90 border-blue-200 shadow-md ring-1 ring-blue-100", iconActive: "bg-gradient-to-br from-blue-400 to-cyan-400 shadow-blue-200 text-white", iconInactive: "bg-white text-blue-300 group-hover:text-blue-400", textActive: "text-blue-900", textInactive: "text-gray-500", hover: "hover:bg-white/80 hover:border-blue-100 hover:shadow-sm" };
  }
  else if (pathname.startsWith("/goods")) { 
    items = goodsSections; label = "굿즈 · 멤버십"; 
    themeConfig = { activeBg: "bg-white/90 border-purple-200 shadow-md ring-1 ring-purple-100", iconActive: "bg-gradient-to-br from-purple-400 to-violet-400 shadow-purple-200 text-white", iconInactive: "bg-white text-purple-300 group-hover:text-purple-400", textActive: "text-purple-900", textInactive: "text-gray-500", hover: "hover:bg-white/80 hover:border-purple-100 hover:shadow-sm" };
  }
  else if (pathname.startsWith("/activities")) { 
    items = activitySections; label = "활동 (Activities)"; 
    themeConfig = { activeBg: "bg-white/90 border-pink-200 shadow-md ring-1 ring-pink-100", iconActive: "bg-gradient-to-br from-pink-400 to-rose-400 shadow-pink-200 text-white", iconInactive: "bg-white text-pink-300 group-hover:text-pink-400", textActive: "text-pink-900", textInactive: "text-gray-500", hover: "hover:bg-white/80 hover:border-pink-100 hover:shadow-sm" };
  }
  else if (pathname.startsWith("/others")) { 
    items = otherSections; label = "기타 (Others)"; 
    themeConfig = { activeBg: "bg-white/90 border-emerald-200 shadow-md ring-1 ring-emerald-100", iconActive: "bg-gradient-to-br from-emerald-400 to-teal-400 shadow-emerald-200 text-white", iconInactive: "bg-white text-emerald-300 group-hover:text-emerald-400", textActive: "text-emerald-900", textInactive: "text-gray-500", hover: "hover:bg-white/80 hover:border-emerald-100 hover:shadow-sm" };
  }

  return (
    <Sidebar 
      collapsible="none" 
      className="border-r bg-white/30 backdrop-blur-sm flex-none h-full"
      style={{ width: '260px', minWidth: '260px', maxWidth: '260px' }}
    >
      <SidebarContent className="h-full p-0 overflow-hidden flex flex-col">
        
        {pathname === "/" ? (
          <HomeSidebarContent />
        ) : pathname.startsWith("/guide") ? (
          <GuideSidebarContent />
        ) : (
          <div className="flex flex-col h-full pt-6 px-3">
            <SidebarGroup className="flex-1 overflow-y-auto custom-scrollbar px-1 pb-4">
              <SidebarGroupLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 mb-2">
                {label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-3">
                  {items.map((item) => {
                    const isActive = pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={cn(
                            "h-auto py-3 rounded-2xl transition-all duration-300 border border-transparent font-medium group items-start",
                            isActive ? themeConfig.activeBg : themeConfig.hover,
                            isActive ? "scale-[1.02]" : "hover:scale-[1.01]"
                          )}
                        >
                          <Link to={item.url} onClick={() => setOpenMobile(false)} className="flex items-center gap-3 px-3 w-full">
                            <div 
                              className={cn(
                                "rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0",
                                isActive ? themeConfig.iconActive : themeConfig.iconInactive
                              )}
                              style={{ width: '40px', height: '40px', minWidth: '40px' }}
                            >
                              <item.icon className="size-5" />
                            </div>
                            
                            <div className="flex flex-col justify-center min-w-0">
                              <span className={cn("text-sm font-semibold transition-colors leading-tight", isActive ? themeConfig.textActive : themeConfig.textInactive, !isActive && "group-hover:text-gray-700")}>
                                {item.title}
                              </span>
                              {item.description && (
                                <span className={cn("text-[11px] mt-0.5 truncate", isActive ? "opacity-80" : "text-gray-400 group-hover:text-gray-500")}>
                                  {item.description}
                                </span>
                              )}
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        )}

      </SidebarContent>
    </Sidebar>
  );
}
