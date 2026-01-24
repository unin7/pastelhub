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
    // 1. 불필요한 h-full, overflow 제거 -> 자연스럽게 스크롤 되도록 변경
    <div className="max-w-[1600px] mx-auto p-4 md:p-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* 2. 왼쪽 Live Status 패널 (선택 사항) */}
        {/* - xl 화면 이상: 왼쪽에 고정(sticky)되어 스크롤 따라다님 
           - 작은 화면: 본문 위에 표시되거나 숨김 (여기서는 일단 위에 표시)
        */}
        <aside className="w-full xl:w-72 flex-shrink-0 space-y-4">
          <div className="xl:sticky xl:top-4">
            <LiveStatusPanel />
          </div>
        </aside>

        {/* 3. 메인 콘텐츠 영역 */}
        <div className="flex-1 min-w-0 space-y-6">
          
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
    </div>
  );
}