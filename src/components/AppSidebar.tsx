import * as React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  // 공통
  Home, ChevronLeft,
  // News
  Calendar, FileText, Twitter, Radio, Music, Youtube,
  // Others
  Image, Mic, Gamepad, ShoppingBag, Megaphone, Bell,
  // Goods
  Ticket, Disc, Store, Calculator,
  // Activities
  CheckSquare, Trophy, TrendingUp, Wrench,
  // Guide
  BookOpen, Heart, PenTool, Users, Siren
} from "lucide-react";
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

// --- 메뉴 데이터 정의 ---
const newsSections = [
  { title: "일정 · D-DAY", icon: Calendar, url: "/news/schedule" },
  { title: "방송 현황", icon: Radio, url: "/news/broadcast" },
  { title: "팬카페 공지", icon: FileText, url: "/news/cafe" },
  { title: "X (트위터)", icon: Twitter, url: "/news/twitter" },
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

export function AppSidebar() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  // 현재 경로 확인
  const pathname = location.pathname;
  let items = [];
  let label = "메뉴";

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
  } else {
    items = [
      { title: "홈으로", icon: Home, url: "/" },
      { title: "소식 보러가기", icon: Calendar, url: "/news/schedule" },
    ];
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Home className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">PastelHub</span>
                  <span className="">v0.1.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link 
                      to={item.url} 
                      onClick={() => setOpenMobile(false)}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}