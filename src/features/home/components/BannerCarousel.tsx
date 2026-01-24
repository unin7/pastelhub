import { memo, useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';
import type { Banner } from '../../../types';
import { Loading } from '../../../components/common';

const AUTO_SLIDE_INTERVAL = 5000;

function BannerCarouselComponent() {
  const { data: banners, loading } = useJsonData<Banner[]>('banners');
  const [currentIndex, setCurrentIndex] = useState(0);

  const sortedBanners = useMemo(() => {
    if (!banners || banners.length === 0) return [];
    return [...banners].sort((a, b) => (a.priority || 0) - (b.priority || 0));
  }, [banners]);

  useEffect(() => {
    if (sortedBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sortedBanners.length);
    }, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [sortedBanners.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);
  
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + sortedBanners.length) % sortedBanners.length);
  }, [sortedBanners.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % sortedBanners.length);
  }, [sortedBanners.length]);

  // 👇 [수정] Loading 컴포넌트는 인자 없이 사용합니다.
  if (loading) return <Loading />;
  
  if (!sortedBanners || sortedBanners.length === 0) return null;

  return (
    // ✅ 다시 높이 고정 방식으로 복귀 (가장 문제없고 깔끔함)
    // 320px: 줄어든 가로 폭(max-w-5xl)에 가장 잘 어울리는 배너 높이
    <div 
      className="relative w-full rounded-2xl overflow-hidden shadow-lg group bg-gray-100 flex-none"
      style={{ height: '320px' }}
    >
      
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {sortedBanners.map((banner) => (
          <a 
            key={banner.id}
            href={banner.link || '#'} 
            target="_blank" 
            rel="noreferrer"
            className="w-full h-full flex-shrink-0 relative block"
          >
            {banner.imageUrl ? (
              <>
                <img 
                  src={banner.imageUrl} 
                  alt="Banner" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              </>
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${banner.gradient || 'from-gray-400 to-gray-600'} flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
              </div>
            )}

            {(banner.title || banner.subtitle) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center text-white px-4">
                  <h3 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-md">{banner.title}</h3>
                  <p className="text-sm md:text-lg opacity-90 font-medium drop-shadow-sm">{banner.subtitle}</p>
                </div>
            )}
          </a>
        ))}
      </div>

      {/* 화살표 버튼 */}
      <button
        onClick={(e) => { e.preventDefault(); goToPrevious(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all cursor-pointer border border-white/20 text-white shadow-lg"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={(e) => { e.preventDefault(); goToNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all cursor-pointer border border-white/20 text-white shadow-lg"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* 하단 점 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {sortedBanners.map((_, index) => (
          <button
            key={index}
            onClick={(e) => { e.preventDefault(); goToSlide(index); }}
            className={`h-1.5 rounded-full transition-all shadow-sm cursor-pointer ${
              index === currentIndex ? 'bg-white w-8' : 'bg-white/40 w-1.5 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export const BannerCarousel = memo(BannerCarouselComponent);