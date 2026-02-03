import React, { useState, useEffect } from "react";
import { MapPin, X, Check, ChevronRight } from "lucide-react";
// ✅ 경로가 맞는지 확인해주세요
import { cn } from "../../../utils/common";

export const REGION_DATA: Record<string, string[]> = {
  전체: [],
  서울: [ "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구" ],
  경기: [ "수원시", "고양시", "용인시", "성남시", "부천시", "화성시", "안산시", "남양주시", "안양시", "평택시", "시흥시", "파주시", "의정부시", "김포시", "광주시", "광명시", "군포시", "하남시", "오산시", "양주시", "이천시", "구리시", "안성시", "포천시", "의왕시", "양평군", "여주시", "동두천시", "가평군", "과천시", "연천군" ],
  인천: [ "전체", "중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군" ],
  부산: ["전체"], 대구: ["전체"], 광주: ["전체"], 대전: ["전체"], 울산: ["전체"],
  강원: ["전체"], 경남: ["전체"], 경북: ["전체"], 전남: ["전체"], 전북: ["전체"],
  충남: ["전체"], 충북: ["전체"], 제주: ["전체"], 전국: ["전체"],
};

const MAIN_REGIONS = Object.keys(REGION_DATA);

interface RegionSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (main: string, sub: string) => void;
  selectedMain: string;
  selectedSub: string;
}

export function RegionSelector({
  isOpen,
  onClose,
  onSelect,
  selectedMain,
  selectedSub,
}: RegionSelectorProps) {
  const [tempMain, setTempMain] = useState(selectedMain);
  const [tempSub, setTempSub] = useState(selectedSub);

  useEffect(() => {
    if (isOpen) {
      setTempMain(selectedMain);
      setTempSub(selectedSub);
    }
  }, [isOpen, selectedMain, selectedSub]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* 레이아웃 고정 */}
      <div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        style={{ width: '640px', height: '520px', maxWidth: '95vw', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. 헤더 */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
              {/* ✅ 헤더 아이콘 크기 살짝 축소 (w-5 -> w-4.5) */}
              <MapPin className="w-4.5 h-4.5" />
            </div>
            지역 선택
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. 바디 */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          
          {/* [왼쪽] 시/도 선택 */}
          <div 
            className="bg-slate-50/80 border-r border-slate-100 overflow-y-auto shrink-0 custom-scrollbar"
            style={{ width: '180px' }}
          >
            {MAIN_REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => {
                  setTempMain(region);
                  setTempSub("");
                  if (REGION_DATA[region].length === 0) {
                    setTempSub("전체");
                  }
                }}
                className={cn(
                  "w-full text-left px-5 py-4 text-sm transition-all flex justify-between items-center border-l-[3px]",
                  tempMain === region
                    ? "bg-white text-indigo-700 border-l-indigo-600 font-bold shadow-sm"
                    : "text-slate-500 border-l-transparent hover:bg-slate-100 hover:text-slate-700 font-medium"
                )}
              >
                {region}
                {tempMain === region && (
                  <ChevronRight className="w-4 h-4 text-indigo-600" />
                )}
              </button>
            ))}
          </div>

          {/* [오른쪽] 시/군/구 선택 */}
          <div className="flex-1 bg-white overflow-y-auto p-5 custom-scrollbar">
            {tempMain !== "전체" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* 1. 전체 버튼 */}
                <button
                  onClick={() => setTempSub("전체")}
                  // ✅ 수정: scale 효과 제거, 그림자와 테두리 유지
                  className={cn(
                    "py-3 px-2 rounded-xl text-sm border text-center transition-all flex items-center justify-center gap-1.5",
                    tempSub === "전체" || tempSub === ""
                      ? "bg-indigo-600 border-indigo-600 text-white font-bold shadow-md"
                      : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 font-medium"
                  )}
                >
                  {tempSub === "전체" && <Check className="w-3.5 h-3.5" />}
                  전체
                </button>
                
                {/* 2. 나머지 지역 버튼들 */}
                {REGION_DATA[tempMain]?.map(
                  (sub) =>
                    sub !== "전체" && (
                      <button
                        key={sub}
                        onClick={() => setTempSub(sub)}
                        // ✅ 수정: scale 효과 제거
                        className={cn(
                          "py-3 px-2 rounded-xl text-sm border text-center transition-all flex items-center justify-center gap-1.5",
                          tempSub === sub
                            ? "bg-indigo-600 border-indigo-600 text-white font-bold shadow-md"
                            : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 font-medium"
                        )}
                      >
                        {tempSub === sub && <Check className="w-3.5 h-3.5" />}
                        {sub}
                      </button>
                    )
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-80">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                  <MapPin className="w-8 h-8 text-slate-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-500">모든 지역이 선택되었습니다.</p>
                  <p className="text-xs text-slate-400 mt-1">특정 지역을 찾으시려면 좌측에서 시/도를 선택해주세요.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. 푸터 */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div className="text-sm text-slate-600">
            선택된 지역:{" "}
            <span className="font-bold text-indigo-600 ml-1 text-base">
              {tempMain}
              {tempSub && tempSub !== "전체" ? ` ${tempSub}` : ""}
            </span>
          </div>
          <button
            onClick={() => {
              onSelect(tempMain, tempSub || "전체");
              onClose();
            }}
            disabled={!tempMain}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
}
