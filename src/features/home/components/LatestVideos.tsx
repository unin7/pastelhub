import { Youtube } from 'lucide-react';
import { VideoGrid, Card, SectionHeader } from '../../../components/common';

export function LatestVideos() {
  return (
    <Card variant="glass" padding="lg">
      <SectionHeader icon={Youtube} title="Latest YouTube Videos" />
      <VideoGrid 
        dataKey="youtube_music" 
        columns={4}
        showChannel={true}
      />
    </Card>
  );
}
