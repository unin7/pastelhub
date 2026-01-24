import { memo, useState } from 'react';
import { Play, ImageOff } from 'lucide-react';
import { cn } from '../ui/utils';

export interface VideoCardData {
  id: string;
  title: string;
  thumbnailUrl?: string;
  thumbnail?: string;
  videoUrl?: string;
  url?: string;
  profileImg?: string;
  channelName?: string;
  name?: string;
  date?: string;
  time?: string;
}

interface VideoCardProps {
  video: VideoCardData;
  className?: string;
  showChannel?: boolean;
}

function VideoCardComponent({ video, className, showChannel = true }: VideoCardProps) {
  const [imageError, setImageError] = useState(false);
  const thumbnail = video.thumbnailUrl || video.thumbnail;
  const url = video.videoUrl || video.url;
  const channelName = video.channelName || video.name;
  const channelImg = video.profileImg;

  if (!thumbnail || !url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={cn('group cursor-pointer block', className)}
      aria-label={`${video.title} 영상 보기`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden mb-2 shadow-md group-hover:shadow-xl transition-all bg-gray-100">
        {!imageError ? (
          <img 
            src={thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <ImageOff className="w-8 h-8 text-gray-400" aria-hidden="true" />
          </div>
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <Play className="w-4 h-4 text-purple-600 ml-0.5" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="px-0.5">
        <p className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors leading-snug">
          {video.title}
        </p>
        {showChannel && (channelName || channelImg) && (
          <div className="flex items-center gap-1.5">
            {channelImg && (
              <img 
                src={channelImg} 
                alt={channelName || '채널'} 
                className="w-4 h-4 rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            {channelName && (
              <span className="text-xs text-gray-500 truncate">{channelName}</span>
            )}
          </div>
        )}
        {(video.date || video.time) && (
          <p className="text-xs text-gray-500 mt-1">{video.date || video.time}</p>
        )}
      </div>
    </a>
  );
}

export const VideoCard = memo(VideoCardComponent);

