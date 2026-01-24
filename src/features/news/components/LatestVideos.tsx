import { Youtube } from "lucide-react";
import { VideoGrid, Card, SectionHeader } from '../../../components/common';

export function LatestVideos() {
  return (
    <Card variant="glass" padding="lg">
      <SectionHeader icon={Youtube} title="Latest YouTube Videos" />
      <VideoGrid 
        dataKey="youtube" 
        columns={4}
        showChannel={false}
        emptyMessage="영상이 없습니다."
      />
    </Card>
  );
}
