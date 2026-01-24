import { useState } from 'react';
import { X, Maximize2 } from 'lucide-react';
import { cn } from '../../../components/ui/utils';

interface ImageCardProps {
  src: string;
  alt?: string;
  className?: string;
}

export function ImageCard({ src, alt = '', className }: ImageCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className={cn('p-4 bg-gray-100 rounded-lg text-center text-gray-400 text-sm', className)}>
        이미지를 불러올 수 없습니다
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'relative group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300',
          className
        )}
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-cover"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
            <Maximize2 className="w-5 h-5 text-gray-700" />
          </div>
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
              aria-label="닫기"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}

