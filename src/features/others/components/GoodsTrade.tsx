import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, Box, ExternalLink, RefreshCw, Clock, Filter, 
  ArrowRightLeft, AlertCircle, Loader2, ChevronDown 
} from 'lucide-react';
import { useJsonData } from "../../../hooks/useJsonData"; 
import { cn, formatDate } from '../../../utils/common';
import { TradeItem } from '../../../types/index';
// ✅ 분리한 컴포넌트 import
import { RegionSelector } from './RegionSelector';

export function GoodsTrade() {
  const { data: trades, isLoading } = useJsonData<TradeItem[]>('goodstrade');

  // --- State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [mainRegion, setMainRegion] = useState('전체');
  const [subRegion, setSubRegion] = useState('');
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false); // 모달 상태
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);

  // --- Filter Logic ---
  const filteredTrades = useMemo(() => {
    if (!trades || !Array.isArray(trades)) return [];

    return trades.filter((trade) => {
      if (hideCompleted && trade.status === 'completed') return false;
      if (deliveryOnly && !trade.isDeliveryAvailable) return false;
      
      // 지역 필터 로직
      if (mainRegion !== '전체') {
        if (!trade.region.includes(mainRegion)) return false;
        if (subRegion && subRegion !== '전체' && !trade.region.includes(subRegion)) return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchTarget = [...trade.haveItems, ...trade.wantItems, trade.region];
        return searchTarget.some(item => item.toLowerCase().includes(query));
      }
      return true;
    });
  }, [trades, searchQuery, mainRegion, subRegion, deliveryOnly, hideCompleted]);

  // 지역 라벨 생성
  const currentRegionLabel = mainRegion === '전체' 
    ? '모든 지역' 
    : `${mainRegion} ${subRegion && subRegion !== '전체' ? subRegion : ''}`;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 relative">
      
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <RefreshCw className="w-7 h-7 text-indigo-500" />
            굿즈 교환소
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            중복 굿즈는 교환하고, 없는 굿즈는 채워보세요.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4" />
          교환글 쓰기
        </button>
      </div>

      {/* 주의사항 */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3 text-sm text-orange-800">
        <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>주의사항:</strong> 이곳은 순수한 <b>물물교환(Barter)</b>만을 위한 공간입니다. 
          금전 요구, 계좌 거래 유도 행위 적발 시 이용이 제한될 수 있습니다.
        </p>
      </div>

      {/* 필터 바 */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:gap-3">
        {/* 검색창 */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="굿즈 이름 검색 (예: 유니 아크릴)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-200 transition-all placeholder:text-slate-400 text-sm"
          />
        </div>

        {/* 필터 버튼들 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* ✅ 지역 선택 버튼 (모달 열기) */}
          <button
            onClick={() => setIsRegionModalOpen(true)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all whitespace-nowrap",
              mainRegion !== '전체' 
                ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            <MapPin className="w-4 h-4" />
            {currentRegionLabel}
            <ChevronDown className="w-3.5 h-3.5 opacity-50 ml-1" />
          </button>

          {/* 나머지 필터 버튼들 */}
          <button
            onClick={() => setDeliveryOnly(!deliveryOnly)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm transition-all font-medium whitespace-nowrap",
              deliveryOnly ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
            )}
          >
            <Box className="w-4 h-4" /> 택배 가능
          </button>

          <button
            onClick={() => setHideCompleted(!hideCompleted)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm transition-all font-medium whitespace-nowrap",
              hideCompleted ? "bg-slate-800 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
            )}
          >
            <Filter className="w-4 h-4" /> 거래중만
          </button>
        </div>
      </div>

      {/* 리스트 Grid (기존 코드 유지) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTrades.length > 0 ? (
          filteredTrades.map((trade) => (
            <div key={trade.id} className={cn("group relative bg-white rounded-2xl p-5 border transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col h-full", trade.status === 'completed' ? 'border-slate-100 opacity-60 bg-slate-50' : 'border-indigo-50 hover:border-indigo-100')}>
              {/* ... (카드 내부 내용은 동일하므로 생략, 위에서 작성한 코드 그대로 사용) ... */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <span className={cn("px-2 py-0.5 rounded text-[11px] font-bold border", trade.status === 'active' ? "bg-green-50 text-green-600 border-green-100" : "bg-slate-200 text-slate-500 border-slate-300")}>{trade.status === 'active' ? '교환중' : '교환완료'}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 text-slate-500 border border-slate-100 flex items-center gap-1"><MapPin className="w-3 h-3" /> {trade.region}</span>
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(trade.createdAt)}</span>
              </div>
              <div className="flex-1 space-y-3 mb-5">
                <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100/60 relative"><span className="absolute -top-2.5 left-3 bg-indigo-100 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">HAVE (보유)</span><div className="mt-1 flex flex-wrap gap-1.5">{trade.haveItems.map((item, idx) => (<span key={idx} className="text-sm font-medium text-indigo-900 bg-white px-2 py-0.5 rounded shadow-sm border border-indigo-50">{item}</span>))}</div></div>
                <div className="flex justify-center -my-2 relative z-10"><div className="bg-white p-1.5 rounded-full border shadow-sm text-slate-400"><ArrowRightLeft className="w-4 h-4" /></div></div>
                <div className="bg-pink-50/60 p-3 rounded-xl border border-pink-100/60 relative"><span className="absolute -top-2.5 left-3 bg-pink-100 text-pink-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-pink-200">WANT (구함)</span><div className="mt-1 flex flex-wrap gap-1.5">{trade.wantItems.map((item, idx) => (<span key={idx} className="text-sm font-medium text-pink-900 bg-white px-2 py-0.5 rounded shadow-sm border border-pink-50">{item}</span>))}</div></div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                <div className="flex flex-col"><div className="flex items-center gap-1.5 text-xs text-slate-500"><span className="font-bold text-slate-700">{trade.author.name}</span>{trade.author.level === 'cafe' && (<span className="text-[10px] bg-green-100 text-green-700 px-1 py-px rounded-sm">카페인증</span>)}</div>{trade.isDeliveryAvailable && (<span className="text-[10px] text-blue-500 mt-0.5 flex items-center gap-0.5"><Box className="w-3 h-3" /> 택배거래 가능</span>)}</div>
                <a href={trade.openChatLink} target="_blank" rel="noreferrer" className={cn("flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all", trade.status === 'active' ? "bg-[#FAE100] text-[#371D1E] hover:bg-[#FCE620] shadow-sm" : "bg-slate-100 text-slate-400 cursor-not-allowed")} onClick={(e) => trade.status === 'completed' && e.preventDefault()}><ExternalLink className="w-3 h-3" />오픈톡</a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100"><Search className="w-8 h-8 text-slate-300" /></div>
            <p className="text-slate-500 font-medium">조건에 맞는 교환글이 없습니다.</p>
          </div>
        )}
      </div>

      {/* ✅ 분리된 지역 선택 모달 사용 */}
      <RegionSelector 
        isOpen={isRegionModalOpen}
        onClose={() => setIsRegionModalOpen(false)}
        selectedMain={mainRegion}
        selectedSub={subRegion}
        onSelect={(main, sub) => {
          setMainRegion(main);
          setSubRegion(sub);
        }}
      />

    </div>
  );
}