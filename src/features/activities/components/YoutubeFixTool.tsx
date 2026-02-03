import React, { useState } from "react";
import { Wrench, ExternalLink, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";

// ✅ 가이드 데이터: 제공해주신 텍스트를 단계별로 나누었습니다.
// 나중에 실제 이미지 경로('/images/guide_01.png' 등)로 변경해주세요.
const FIX_GUIDES = [
  {
    title: "검색 누락 문제 해결",
    desc: "스텔라들의 좋은 노래가 알고리즘을 타고 있지만, 검색이 안 되는 케이스가 꾸준히 발생하고 있습니다.",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "올바른 시청 방법",
    desc: "오리곡은 '토픽' 채널이 아닌, '본채널 뮤비'로 시청해주세요! 여러분의 도움이 필요합니다.",
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "화력 지원 팁",
    desc: "단순 시청뿐만 아니라 '댓글'과 '공유'까지 함께 한다면 검색 정상화 효과가 훨씬 좋아집니다.",
    image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "지속적인 관리",
    desc: "한번 막힌 영상은 반복해서 막힙니다. 7일 이내 막혔던 노래는 생각날 때 한 번씩 확인 부탁드립니다!",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
  }
];

export function YoutubeFixTool() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const prevStep = () => {
    setCurrentIdx((prev) => (prev === 0 ? FIX_GUIDES.length - 1 : prev - 1));
  };

  const nextStep = () => {
    setCurrentIdx((prev) => (prev === FIX_GUIDES.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-red-100/50">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <Wrench className="w-5 h-5 text-red-500" />
        <h2 className="font-bold text-gray-800 text-lg">유튜브 검색 정상화</h2>
      </div>

      {/* [레이아웃] 높이 320px 고정 */}
      <div className="flex flex-col md:flex-row gap-6 h-auto md:h-80">
        
        {/* [왼쪽] 가이드 슬라이더 (이미지 설명) */}
        <div className="md:w-3/5 h-64 md:h-full relative group rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
          <img 
            src={FIX_GUIDES[currentIdx].image} 
            alt="Fix Guide" 
            className="w-full h-full object-cover transition-all duration-500"
          />
          
          {/* 텍스트 오버레이 */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-5 pt-12 text-left">
            <span className="inline-block px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold mb-1">
              GUIDE {currentIdx + 1}/{FIX_GUIDES.length}
            </span>
            <h3 className="text-white font-bold text-lg mb-1">{FIX_GUIDES[currentIdx].title}</h3>
            <p className="text-gray-200 text-xs leading-relaxed break-keep">
              {FIX_GUIDES[currentIdx].desc}
            </p>
          </div>

          {/* 화살표 컨트롤 */}
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <button 
              onClick={prevStep}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors pointer-events-auto"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextStep}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors pointer-events-auto"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* [오른쪽] 실행 버튼 및 요약 영역 */}
        <div className="md:w-2/5 flex flex-col h-full gap-3">
          
          {/* 요약 박스 */}
          <div className="flex-1 bg-red-50/80 p-4 rounded-xl border border-red-100 flex flex-col justify-center">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm font-bold text-gray-800">우리의 도움이 필요합니다!</p>
            </div>
            <ul className="text-xs text-gray-600 space-y-1.5 ml-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-red-400" />
                <span>본채널 뮤비 시청하기</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-red-400" />
                <span>댓글 작성 및 공유하기</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-red-400" />
                <span>막힌 영상 주기적 확인</span>
              </li>
            </ul>
            <p className="text-[10px] text-gray-400 mt-3 text-right">
              * 1일 1회 업데이트 목표
            </p>
          </div>
          
          {/* 링크 버튼 */}
          <a
            href="https://stelline.xyz/search/" 
            target="_blank"
            rel="noreferrer"
            className="shrink-0 flex flex-col items-center justify-center gap-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-md shadow-red-200 transition-all active:scale-95 group"
          >
            <span className="text-lg flex items-center gap-2">
              정상화 하러가기 <ExternalLink className="w-4 h-4" />
            </span>
            <span className="text-[10px] opacity-80 font-medium">
              stelline.xyz
            </span>
          </a>
        </div>

      </div>
    </div>
  );
}