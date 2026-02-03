import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, Box, ExternalLink, RefreshCw, Clock, Filter, 
  ArrowRightLeft, AlertCircle, Loader2, ChevronDown 
} from 'lucide-react';
import { useJsonData } from "../../../hooks/useJsonData"; 
import { cn, formatDate } from '../../../utils/common';
import { RegionSelector } from './RegionSelector';

// 타입 정의
interface TradeItem {
  id: string;
  haveItems: string[];
  wantItems: string[];
  region: string;
  status: "active" | "completed";
  isDeliveryAvailable: boolean;
  createdAt: string;
  openChatLink: string;
  author: {
    name: string;
    level: string;
  };
}

export function GoodsTrade() {
  // 데이터 로딩
  const { data: trades, isLoading } = useJsonData<TradeItem[]>('goodstrade');

  // --- State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [mainRegion, setMainRegion] = useState('전체');
  const [subRegion, setSubRegion] = useState('');
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);

  // --- Filter Logic ---
  const filteredTrades = useMemo(() => {
    if (!trades || !Array.isArray(trades)) return [];

    return trades.filter((trade) => {
      // 1. 거래완료 안보기
      if (hideCompleted && trade.status === 'completed') return false;
      // 2. 택배만 보기
      if (deliveryOnly && !trade.isDeliveryAvailable) return false;
      
      // 3. 지역 필터
      if (mainRegion !== '전체') {
        if (!trade.region.includes(mainRegion)) return false;
        if (subRegion && subRegion !== '전체' && !trade.region.includes(subRegion)) return false;
      }

      // 4. 검색어 필터
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchTarget = [...trade.haveItems, ...trade.wantItems, trade.region];
        return searchTarget.some(item => item.toLowerCase().includes(query));
      }
      return true;
    });
  }, [trades, searchQuery, mainRegion, subRegion, deliveryOnly, hideCompleted]);

  // 지역 라벨 표시
  const currentRegionLabel = mainRegion === '전체' 
    ? '모든 지역' 
    : `${mainRegion}${subRegion && subRegion !== '전체' ? ` ${subRegion}` : ''}`;

  // 지역 선택 핸들러
  const handleRegionSelect = (main: string, sub: string) => {
    setMainRegion(main);
    setSubRegion(sub);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* 1. 주의사항 (가장 위로 이동) */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3 text-sm text-orange-800 shadow-sm">
        <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold">주의사항:</span> 이곳은 순수한 <strong>물물교환(Barter)</strong>만을 위한 공간입니다. 
          금전 요구, 계좌 거래 유도 행위 적발 시 이용이 제한될 수 있습니다.
        </p>
      </div>

      {/* 2. 헤더 (버튼 제거) */}
      <div className="flex flex-col justify-center gap-2 border-b border-slate-100 pb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-indigo-500" />
          </div>
          굿즈 교환소
        </h1>
        <p className="text-slate-500 text-sm ml-[52px]">
          중복 굿즈는 교환하고, 없는 굿즈는 채워보세요.
        </p>
      </div>

      {/* 3. 필터 바 & 교환글 쓰기 버튼 */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-3">
        
        {/* 검색창 */}
        <div className="relative flex-1 min-w-[200px]">
          {/* 아이콘 위치 수정: left-4로 여유를 줌 */}
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="굿즈 이름 검색 (예: 유니 아크릴)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            // 텍스트 겹침 방지: pl-12 (48px)로 패딩 확보
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-200 transition-all placeholder:text-slate-400 text-sm text-slate-700"
          />
        </div>

        {/* 필터 그룹 & 쓰기 버튼 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 지역 선택 버튼 */}
          <button
            onClick={() => setIsRegionModalOpen(true)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all whitespace-nowrap min-w-[140px] justify-between",
              mainRegion !== '전체' 
                ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="truncate max-w-[100px]">{currentRegionLabel}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 opacity-50" />
          </button>

          <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

          {/* 택배 필터 */}
          <button
            onClick={() => setDeliveryOnly(!deliveryOnly)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm transition-all font-medium whitespace-nowrap",
              deliveryOnly 
                ? "bg-blue-50 border-blue-200 text-blue-600" 
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
            )}
          >
            <Box className="w-4 h-4" /> 택배 가능
          </button>

          {/* 거래중 필터 */}
          <button
            onClick={() => setHideCompleted(!hideCompleted)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm transition-all font-medium whitespace-nowrap",
              hideCompleted
                ? "bg-slate-800 border-slate-800 text-white"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
            )}
          >
            <Filter className="w-4 h-4" /> 거래중만
          </button>

          <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

          {/* ✅ 교환글 쓰기 버튼 (이곳으로 이동) */}
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap">
            <ArrowRightLeft className="w-4 h-4" />
            <span className="hidden sm:inline">교환글 쓰기</span>
            <span className="sm:hidden">글쓰기</span>
          </button>
        </div>
      </div>

      {/* --- 리스트 Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTrades.length > 0 ? (
          filteredTrades.map((trade) => (
            <div 
              key={trade.id} 
              className={cn(
                "group relative bg-white rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col h-full",
                trade.status === 'completed' 
                  ? 'border-slate-100 opacity-60 bg-slate-50' 
                  : 'border-indigo-50 hover:border-indigo-100'
              )}
            >
              {/* 상단 정보 */}
              <div className="p-5 pb-0">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-bold border",
                      trade.status === 'active' 
                        ? "bg-green-50 text-green-600 border-green-100" 
                        : "bg-slate-200 text-slate-500 border-slate-300"
                    )}>
                      {trade.status === 'active' ? '교환중' : '교환완료'}
                    </span>
                    {trade.isDeliveryAvailable && (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-500 border border-blue-100 flex items-center gap-1">
                        <Box className="w-3 h-3" /> 택배
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatDate(trade.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  {trade.region}
                </div>
              </div>

              {/* 메인: HAVE <-> WANT */}
              <div className="flex-1 px-5 space-y-3">
                {/* HAVE (파스텔 인디고) */}
                <div className="bg-indigo-50/60 rounded-xl border border-indigo-100/60 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                      HAVE (보유)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {trade.haveItems.map((item, idx) => (
                      <span key={idx} className="text-xs font-medium text-indigo-900 bg-white px-2 py-1.5 rounded-lg border border-indigo-50 shadow-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 화살표 */}
                <div className="flex justify-center -my-1">
                  <div className="bg-slate-50 p-1.5 rounded-full border border-slate-100 text-slate-400 shadow-sm z-10">
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* WANT (파스텔 핑크) */}
                <div className="bg-pink-50/60 rounded-xl border border-pink-100/60 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
                      WANT (구함)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {trade.wantItems.map((item, idx) => (
                      <span key={idx} className="text-xs font-medium text-pink-900 bg-white px-2 py-1.5 rounded-lg border border-pink-50 shadow-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 하단 액션 */}
              <div className="p-4 pt-4 flex items-center justify-between border-t border-slate-50 mt-4 bg-white/50 rounded-b-2xl">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="font-bold text-slate-700">{trade.author.name}</span>
                    {trade.author.level === 'cafe' && (
                      <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                        카페인증
                      </span>
                    )}
                  </div>
                </div>
                
                <a 
                  href={trade.openChatLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm",
                    trade.status === 'active'
                      ? "bg-[#FAE100] text-[#371D1E] hover:bg-[#FCE620]" // 카카오 색상
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  )}
                  onClick={(e) => trade.status === 'completed' && e.preventDefault()}
                >
                  <ExternalLink className="w-3 h-3" />
                  오픈톡
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">조건에 맞는 교환글이 없습니다.</p>
            <p className="text-slate-400 text-sm mt-1">
              다른 검색어나 필터를 시도해보세요.
            </p>
          </div>
        )}
      </div>

      {/* ✅ 지역 선택 모달 */}
      <RegionSelector 
        isOpen={isRegionModalOpen}
        onClose={() => setIsRegionModalOpen(false)}
        selectedMain={mainRegion}
        selectedSub={subRegion}
        onSelect={handleRegionSelect}
      />

    </div>
  );
}
