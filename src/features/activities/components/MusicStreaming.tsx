import React, { useState } from 'react';
import { Music, ChevronRight, ChevronLeft, Info, ExternalLink } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';

// JSON 데이터 타입 정의
interface Platform {
  name: string;
  url: string;
  iconImg: string;
}

interface Guide {
  title: string;
  image: string;
}

interface StreamingData {
  songTitle: string;
  Img: string;
  platforms: Platform[];
  guides?: Guide[];
}

export function MusicStreaming() {
  const { data, loading, error } = useJsonData<StreamingData>('streaming');
  const [currentGuideIdx, setCurrentGuideIdx] = useState(0);

  if (loading) return <div className="p-10 text-center text-gray-500">데이터 불러오는 중...</div>;
  if (error || !data) return null;

  const guides = data.guides || [];
  const hasGuides = guides.length > 0;

  const prevGuide = () => {
    setCurrentGuideIdx((prev) => (prev === 0 ? guides.length - 1 : prev - 1));
  };

  const nextGuide = () => {
    setCurrentGuideIdx((prev) => (prev === guides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100/50">
      <div className="flex items-center gap-2 mb-4">
        <Music className="w-5 h-5 text-purple-500" />
        <h3 className="text-gray-800 font-bold text-lg">음원 스트리밍 가이드</h3>
      </div>

      {/* [레이아웃] 높이 320px로 고정하여 이미지 크기 확보 */}
      <div className="flex flex-col md:flex-row gap-6 h-auto md:h-80">
        
        {/* [왼쪽] 이미지 슬라이더 (60% 너비) */}
        <div className="md:w-3/5 h-64 md:h-full relative group rounded-2xl overflow-hidden border border-purple-100 bg-gray-100 shadow-sm">
            {hasGuides ? (
              <>
                <img 
                  src={guides[currentGuideIdx].image} 
                  alt="Streaming Guide" 
                  className="w-full h-full object-cover transition-all duration-500"
                />
                {/* 텍스트 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5">
                  <span className="flex items-center gap-1 text-purple-300 text-xs font-bold mb-1">
                    <Info className="w-3 h-3" /> STEP {currentGuideIdx + 1}/{guides.length}
                  </span>
                  <h4 className="text-white font-bold text-lg drop-shadow-md leading-tight">
                    {guides[currentGuideIdx].title}
                  </h4>
                </div>
                
                {/* 네비게이션 버튼 (호버 시 등장) */}
                <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <button 
                    onClick={prevGuide}
                    className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors pointer-events-auto"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={nextGuide}
                    className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors pointer-events-auto"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                가이드 이미지가 없습니다.
              </div>
            )}
        </div>

        {/* [오른쪽] 플랫폼 리스트 (40% 너비) */}
        <div className="md:w-2/5 flex flex-col gap-3 h-full">
          {/* 타겟 정보 */}
          <div className="shrink-0 flex items-center gap-3 p-3 bg-purple-50/80 rounded-xl border border-purple-100/50">
            <img 
              src={data.Img} 
              alt={data.songTitle} 
              className="w-12 h-12 rounded-lg object-cover shadow-sm"
            />
            <div className="overflow-hidden">
              <p className="text-[10px] text-purple-500 font-bold uppercase tracking-wider">Target Song</p>
              <p className="text-sm font-bold text-gray-800 truncate">{data.songTitle}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1 min-h-0">
            <p className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Platforms</p>
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar grid grid-cols-1 gap-2">
              {data.platforms.map((plat, idx) => (
                <a
                  key={idx}
                  href={plat.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl transition-all shadow-sm hover:border-purple-200 hover:shadow-md group shrink-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                        <img src={plat.iconImg} alt={plat.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-sm text-gray-700 group-hover:text-purple-700 transition-colors">
                      {plat.name}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-purple-500" />
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}