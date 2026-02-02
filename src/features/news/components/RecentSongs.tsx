import { Music } from "lucide-react";
import { VideoGrid, Card, SectionHeader } from '../../../components/common'; // 공통 컴포넌트 경로 확인 필요

export function RecentSongs() {
  return (
    // ✅ Card 컴포넌트로 테두리, 배경 스타일 통일
    <Card variant="glass" padding="lg"> 
      {/* ✅ SectionHeader로 아이콘, 제목 통일 */}
      <SectionHeader icon={Music} title="Recent Songs" />
      
      {/* ✅ VideoGrid 재사용! (데이터 키만 'youtube_music'으로 변경) */}
      <VideoGrid 
        dataKey="youtube_music" 
        columns={4}
        showChannel={false} // 가수 이름 등을 따로 강조할 게 아니라면 채널명 숨김 or 필요시 true
        emptyMessage="노래가 없습니다."
      />
    </Card>
  );
}