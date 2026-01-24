import { BannerCarousel } from './components/BannerCarousel';
import { QuickAccessButtons } from './components/QuickAccessButtons';
import { EventDday } from './components/EventDday';
import { TodoList } from './components/TodoList';
import { RecentTweets } from './components/RecentTweets';
import { LatestVideos } from './components/LatestVideos';
import { OfficialLinks } from './components/OfficialLinks';

export function HomePage() {
  return (
    // 전체 레이아웃 스크롤은 App.tsx에서 처리하므로, 여기서는 콘텐츠 너비와 간격만 잡습니다.
    <div className="max-w-[1600px] mx-auto p-4 md:p-6 animate-in fade-in duration-500">
      
      {/* 메인 콘텐츠 영역 */}
      <div className="space-y-6">
        
        {/* 배너 영역 */}
        <section className="rounded-2xl overflow-hidden shadow-sm">
          <BannerCarousel />
        </section>
            
        {/* 바로가기 버튼 */}
        <QuickAccessButtons />

        {/* 스케줄 & 투두 (2단 그리드) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EventDday />
          <TodoList />
        </div>

        {/* 하단 콘텐츠들 */}
        <div className="space-y-6">
          <RecentTweets />
          <LatestVideos />
          <OfficialLinks />
        </div>
        
      </div>
    </div>
  );
}