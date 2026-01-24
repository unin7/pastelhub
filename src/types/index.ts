// ============================================
// User & Auth Types
// ============================================
export type UserLevel = 0 | 1 | 2 | 3;

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  level: UserLevel;
  googleAuth?: boolean;
  naverCafeVerified?: boolean;
  isActiveUser?: boolean;
  createdAt?: string;
  lastActiveAt?: string;
}

export const USER_LEVEL_INFO = {
  0: { label: '비로그인', color: 'gray', description: '로그인이 필요합니다' },
  1: { label: 'Google 로그인', color: 'blue', description: 'Google 계정으로 로그인됨' },
  2: { label: '네이버 카페 인증', color: 'green', description: '네이버 카페 인증 완료' },
  3: { label: '활동 우수자', color: 'purple', description: '사이트 활동 우수자' },
} as const;

// ============================================
// Chat Types
// ============================================
export interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  icon: string;
}

export interface ChatMessage {
  id: string;
  type: 'text' | 'date' | 'file' | 'link';
  sender?: string;
  content?: string;
  time?: string;
  fileName?: string;
  description?: string;
  title?: string;
  url?: string;
}

// ============================================
// Broadcast Types
// ============================================
export interface BroadcastItem {
  name: string;
  message: string;
  image: string;
  link: string;
}

export interface BroadcastGroup {
  id: string;
  title: string;
  color: string;
  items: BroadcastItem[];
}

// ============================================
// YouTube Types
// ============================================
export interface YoutubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  channelName: string;
  channelProfile: string;
  videoUrl: string;
  channelUrl: string;
  uploadedAt: string;
  type?: "video" | "shorts";
}

// ============================================
// Tweet Types
// ============================================
export interface Tweet {
  id: string;
  author: string;
  handle: string;
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
}

export interface FeedItem {
  id?: string;
  type: "TEXT" | "IMAGE" | "VIDEO";
  name: string;
  profileImg: string;
  content: string;
  time: string;
}


// ============================================
// Schedule Types
// ============================================
export interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'broadcast' | 'event' | 'release' | 'other';
  description?: string;
}

export interface ScheduleItem {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'birthday' | 'album' | 'concert' | 'broadcast' | 'event';
}

// ============================================
// Goods Types
// ============================================
export interface GoodsItem {
  id: string;
  name: string;
  price: number;
  image: string;
  link: string;
  category: 'official' | 'personal' | 'collab';
  status: 'available' | 'soldout' | 'upcoming';
}

// ============================================
// Todo Types
// ============================================
export interface TodoItem {
  id: string;
  task: string;
  url?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  url: string;
  type: 'message' | 'play' | 'star' | 'heart';
}

export interface RewardImage {
  url: string;
  caption: string;
  unlockedMessage: string;
}

export interface TodoData {
  dailyMissions: TodoItem[];
  rewardImage: RewardImage;
  quickActions: QuickAction[];
}

// ============================================
// Streaming Types
// ============================================
export interface Platform {
  name: string;
  url: string;
  iconImg: string;
}

export interface Guide {
  title: string;
  image: string;
}

export interface StreamingData {
  songTitle: string;
  Img: string;
  platforms: Platform[];
  guides?: Guide[];
}

// ============================================
// Trend Types
// ============================================
export interface TrendData {
  title: string;
  hashtags: string[];
  keywords: string[];
  baseword: string;
  time: string;
}

// ============================================
// Banner Types
// ============================================
export interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  gradient?: string;
  imageUrl?: string; 
  subtitle?: string; 
  priority?: number; 
}

// ============================================
// Fan Game Types
// ============================================
export interface FanGame {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  author: string;
  category: string;
  tags: string[];
  time: string;
}

// ============================================
// Karaoke Types
// ============================================
export interface KaraokeSong {
  title: string;
  type: string;
  tj?: string;
  ky?: string;
  solo?: boolean;
}

// ============================================
// Guide Types (Firestore Schema)
// ============================================
export interface GuideDocument {
  id: string;
  title: string;
  category: string; // 'Basic', 'Culture', etc.
  parentId: string | null; // Adjacency List 패턴
  content: string; // Markdown 본문
  tags: string[]; // 검색용 태그
  mediaUrls: string[]; // 썸네일용 이미지 링크
  views: number; // 조회수
  lastUpdated: any; // Firebase Timestamp
  editorLevel: number; // 수정 가능 등급 (기본 2)
}

export interface GuideTOCItem {
  id: string;
  text: string;
  level: number; // h1=1, h2=2, etc.
  element?: HTMLElement;
}
