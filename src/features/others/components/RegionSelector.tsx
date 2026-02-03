import React, { useState } from 'react';
import { MapPin, X, ChevronRight, Check } from 'lucide-react';
import { cn } from '../../../utils/common';

// 방대한 지역 데이터는 컴포넌트 밖이나 별도 data 파일로 빼는 것이 좋습니다.
export const REGION_DATA: Record<string, string[]> = {
  '전체': [],
  '서울': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
  '경기': ['수원시', '고양시', '용인시', '성남시', '부천시', '화성시', '안산시', '남양주시', '안양시', '평택시', '시흥시', '파주시', '의정부시', '김포시', '광주시', '광명시', '군포시', '하남시', '오산시', '양주시', '이천시', '구리시', '안성시', '포천시', '의왕시', '양평군', '여주시', '동두천시', '가평군', '과천시', '연천군'],
  '인천': ['전체', '중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
  '부산': ['전체'], '대구': ['전체'], '광주': ['전체'], '대전': ['전체'], 
  '울산': ['전체'], '강원': ['전체'], '경남': ['전체'], '경북': ['전체'], '전남': ['전체'], 
  '전북': ['전체'], '충남': ['전체'], '충북': ['전체'], '제주': ['전체'], '전국': ['전체']
};

const MAIN_REGIONS = Object.keys(REGION_DATA);

interface RegionSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (main: string, sub: string) => void;
  selectedMain: string;
  selectedSub: string;
}

export function RegionSelector({ isOpen, onClose, onSelect, selectedMain, selectedSub }: RegionSelectorProps) {
  // 모달 내부에서만 쓸 임시 선택 상태 (확인 눌러야 반영되게 하려면 필요)
  const [tempMain, setTempMain] = useState(selectedMain);
  const [tempSub, setTempSub] = useState(selectedSub);

  // 모달이 열릴 때 부모의 상태로 초기화 (useEffect 사용 가능하지만 간단히 처리)
  React.useEffect(() => {
    if (isOpen) {
      setTempMain(selectedMain);
      setTempSub(selectedSub);
    }
  }, [isOpen, selectedMain, selectedSub]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-500" />
            지역 선택
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 컨텐츠 (2단 컬럼) */}
        <div className="flex-1 flex overflow-hidden min-h-[300px]">
          
          {/* 1. 시/도 선택 */}
          <div className="w-1/3 bg-slate-50 border-r border-slate-100 overflow-y-auto custom-scrollbar">
            {MAIN_REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => {
                  setTempMain(region);
                  setTempSub(''); // 상위 지역 바뀌면 하위 초기화
                  // 하위 지역이 없거나 '전체' 뿐이면 바로 선택 간주
                  if (region === '전체' || REGION_DATA[region].length === 0) {
                    setTempSub('전체');
                  }
                }}
                className={cn(
                  "w-full text-left px-4 py-3.5 text-sm font-medium transition-all flex justify-between items-center",
                  tempMain === region 
                    ? "bg-white text-indigo-600 border-l-4 border-indigo-500 shadow-sm" 
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 border-l-4 border-transparent"
                )}
              >
                {region}
                {tempMain === region && <ChevronRight className="w-4 h-4 opacity-50" />}
              </button>
            ))}
          </div>

          {/* 2. 시/군/구 선택 */}
          <div className="w-2/3 bg-white overflow-y-auto custom-scrollbar p-3">
            {tempMain !== '전체' ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTempSub('전체')}
                  className={cn(
                    "px-3 py-2.5 rounded-xl text-sm font-medium border text-center transition-all flex items-center justify-center gap-1",
                    tempSub === '전체' || tempSub === ''
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700 ring-1 ring-indigo-200" 
                      : "border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-slate-50"
                  )}
                >
                  {tempSub === '전체' && <Check className="w-3.5 h-3.5" />}
                  전체
                </button>
                {REGION_DATA[tempMain]?.map((sub) => (
                  sub !== '전체' && (
                    <button
                      key={sub}
                      onClick={() => setTempSub(sub)}
                      className={cn(
                        "px-3 py-2.5 rounded-xl text-sm font-medium border text-center transition-all flex items-center justify-center gap-1",
                        tempSub === sub
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700 ring-1 ring-indigo-200" 
                          : "border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-slate-50"
                      )}
                    >
                      {tempSub === sub && <Check className="w-3.5 h-3.5" />}
                      {sub}
                    </button>
                  )
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm gap-2 opacity-50">
                <MapPin className="w-10 h-10 bg-slate-100 p-2 rounded-full" />
                <p>좌측에서 시/도를 선택해주세요.</p>
              </div>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center shrink-0">
          <div className="text-xs text-slate-500">
            선택됨: <span className="font-bold text-indigo-600 ml-1 text-sm">
              {tempMain} {tempSub && tempSub !== '전체' ? tempSub : ''}
            </span>
          </div>
          <button 
            onClick={() => {
              onSelect(tempMain, tempSub || '전체');
              onClose();
            }}
            disabled={!tempMain}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
}