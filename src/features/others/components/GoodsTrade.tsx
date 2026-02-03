import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, Box, ExternalLink, RefreshCw, Clock, Filter, 
  ArrowRightLeft, AlertCircle, Loader2, ChevronDown 
} from 'lucide-react';
import { useJsonData } from "../../../hooks/useJsonData"; 
import { cn, formatDate } from '../../../utils/common';
import { TradeItem } from '../../../types/index';
import { RegionSelector } from './RegionSelector';

export function GoodsTrade() {
  // ✅ 실제 데이터 연동
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
      if (hideCompleted && trade.status === 'completed') return false;
      if (deliveryOnly && !trade.isDeliveryAvailable) return false;
      
      // 지역 필터
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
      
      {/* --- 헤더 --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-indigo-500" />
            </div>
            굿즈 교환소
          </h1>
          <p className="text-slate-500 text-sm mt-2 ml-[52px]">
            중복 굿즈는 교환하고, 없는 굿즈는 채워보세요.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4" />
          교환글 쓰기
        </button>
      </div>

      {/* --- 주의사항 --- */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3 text-sm text-orange-800">
        <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold">주의사항:</span> 이곳은 순수한 <strong>물물교환(Barter)</strong>만을 위한 공간입니다. 
          금전 요구, 계좌 거래 유도 행위 적발 시 이용이 제한될 수 있습니다.
        </p>
      </div>

      {/* --- 필터 바 --- */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-3">
        
        {/* 검색창 */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="굿즈 이름 검색 (예: 유니 아크릴)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-200 transition-all placeholder:text-slate-400 text-sm text-slate-700"
          />
        </div>

        {/* 필터 그룹 */}
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
        </div>
      </div>

      {/* --- 리스트 Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTrades.length > 0 ? (
          filteredTrades.map((trade) => (
            <div 
              key={trade.id}