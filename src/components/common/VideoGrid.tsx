import { Youtube } from 'lucide-react';
import { useJsonData } from '../../hooks/useJsonData';
import { VideoCard } from './VideoCard';
import { Loading } from './Loading';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
// VideoCardData 타입이 필요하다면 types에서 import 하거나 any로 처리
// import type { YoutubeVideo } from '../../types'; 

interface VideoGridProps {
  dataKey?: string;
  count?: number;
  className?: string;
  showChannel?: boolean;
}

export function VideoGrid({ dataKey = 'youtube', count, className, showChannel = true }: VideoGridProps) {
  // 제네릭 타입 <any[]> 사용 (또는 구체적인 타입 지정)
  const { data: videos, loading, error, refetch } = useJsonData<any[]>(dataKey);

  if (loading) return <Loading />;
  
  if (error) return (
    <ErrorState 
      message={String(error)} 
      onRetry={refetch} 
    />
  );
  
  if (!videos || videos.length === 0) return (
    <EmptyState icon={Youtube} message="등록된 영상이 없습니다." />
  );

  const displayVideos = count ? videos.slice(0, count) : videos;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {displayVideos.map((video, idx) => (
        <VideoCard 
          key={video.id || video.videoId || idx} 
          video={video} 
          showChannel={showChannel}
        />
      ))}
    </div>
  );
}