import { LiveStatusPanel } from './components/LiveStatusPanel';
import { BannerCarousel } from './components/BannerCarousel';
import { QuickAccessButtons } from './components/QuickAccessButtons';
import { EventDday } from './components/EventDday';
import { TodoList } from './components/TodoList';
import { RecentTweets } from './components/RecentTweets';
import { LatestVideos } from './components/LatestVideos';
import { OfficialLinks } from './components/OfficialLinks';

export function HomePage() {
  return (
    <div className="h-full overflow-hidden bg-[#F8F9FA]">
      <div className="flex h-full">
        {/* Left Panel - Live Status */}
        <div className="w-72 flex-shrink-0 overflow-y-auto border-r border-gray-100 bg-white">
          <LiveStatusPanel />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
        
          {/* 1. 배너 영역 */}
          <div className="max-w-5xl mx-auto px-6 pt-4 mb-6">
            <BannerCarousel />
          </div>
              
          {/* 2. 본문 콘텐츠 영역 */}
          <div className="max-w-5xl mx-auto px-6 pb-8 space-y-3">
            
            {/* 바로가기 버튼 */}
            <QuickAccessButtons />

            {/* 스케줄 & 투두 (가로 배치) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <EventDday />
              <TodoList />
            </div>

            {/* 최근 트윗 */}
            <RecentTweets />

            {/* 유튜브 영상 */}
            <LatestVideos />

            {/* 공식 링크 */}
            <OfficialLinks />
          </div>
        </div>
      </div> 
    </div>
  );
}