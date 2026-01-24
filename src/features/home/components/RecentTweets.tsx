import { memo, useMemo } from 'react';
import { MessageCircle } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';
import type { FeedItem } from '../../../types';
import { formatDate } from '../../../utils/common';
import { Loading, ErrorState, Card, SectionHeader } from '../../../components/common';

const FALLBACK_FEEDS: FeedItem[] = [
  {
    type: "IMAGE",
    name: "Stellar Live",
    profileImg: "https://ui-avatars.com/api/?name=Stellar&background=random",
    content: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    time: new Date().toISOString()
  },
  {
    type: "TEXT",
    name: "Official Notice",
    profileImg: "https://ui-avatars.com/api/?name=Admin&background=random",
    content: "이번 주말 특별 이벤트 공지가 업로드되었습니다. 카페를 확인해주세요! 📢",
    time: new Date().toISOString()
  }
];

function RecentTweetsComponent() {
  const { data: serverFeeds, loading, error, refetch } = useJsonData<FeedItem[]>('1');

  const feeds = useMemo(() => {
    return (serverFeeds && serverFeeds.length > 0) ? serverFeeds : FALLBACK_FEEDS;
  }, [serverFeeds]);

  // Loading 컴포넌트 사용
  if (loading) return <Loading />;
  
  // 👇 [수정됨] 에러 메시지 처리 방식을 단순화 (타입 에러 해결)
  if (error) return (
    <ErrorState 
      message={String(error)} // 에러가 객체든 문자열이든 안전하게 문자로 변환
      onRetry={refetch} 
    />
  );
  
  if (!feeds || feeds.length === 0) return null;

  return (
    <Card variant="glass" padding="lg">
      <SectionHeader icon={MessageCircle} title="Recent Updates" />

      <div className="space-y-4" role="feed" aria-label="최신 업데이트">
        {feeds.map((feed, idx) => (
          // 👇 id가 있으면 쓰고, 없으면 인덱스(idx) 사용
          <article key={feed.id || idx} className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center flex-shrink-0 p-[2px]">
              <img src={feed.profileImg} alt={feed.name} className="w-full h-full rounded-full object-cover bg-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs font-bold text-gray-800">{feed.name}</span>
                <span className="text-[10px] text-gray-400">{feed.time ? formatDate(feed.time) : ''}</span>
              </div>
              
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-purple-100/50 inline-block max-w-full">
                 {feed.type === 'IMAGE' ? (
                    <div className="rounded-lg overflow-hidden mt-1">
                        <img 
                          src={feed.content} 
                          alt="Content" 
                          className="max-w-full w-full object-cover" 
                          style={{ 
                            height: '200px', 
                            maxHeight: '200px',
                            objectFit: 'cover' 
                          }}
                        />
                    </div>
                 ) : (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{feed.content}</p>
                 )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <button 
        className="w-full mt-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-700 rounded-lg transition-all text-sm font-medium"
        aria-label="모든 업데이트 보기"
      >
        View All Updates
      </button>
    </Card>
  );
}

export const RecentTweets = memo(RecentTweetsComponent);