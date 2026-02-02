import React, { useState } from 'react';
import { Megaphone, Flame, CheckCircle2, PenTool, Loader2, AlertCircle } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';
import { cn } from '../../../utils/common';
import { ReportItem, ReportCategory, ReportStatus } from '../../../types/index';
import { SinmungoList } from './SinmungoList';
import { SinmungoForm } from './SinmungoForm';

// 확장 타입 정의
export interface ExtendedReportItem extends ReportItem {
  agreeCount: number;
  targetCount: number;
  isVoted?: boolean;
}

export function Sinmungo() {
  const { data: initialData, isLoading } = useJsonData<ExtendedReportItem[]>('sinmungo');
  const [items, setItems] = useState<ExtendedReportItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ongoing' | 'answered' | 'write'>('ongoing');

  React.useEffect(() => { if (initialData) setItems(initialData); }, [initialData]);

  // 공감(투표) 로직
  const handleAgree = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const isVoted = !!item.isVoted;
        const newCount = isVoted ? item.agreeCount - 1 : item.agreeCount + 1;
        let newStatus: ReportStatus = item.status;
        if (!isVoted && newCount >= item.targetCount && item.status === 'pending') {
          newStatus = 'in_progress';
        }
        return { ...item, agreeCount: newCount, isVoted: !isVoted, status: newStatus };
      }
      return item;
    }));
  };

  // 글 작성 완료 시 호출될 함수
  const handleCreate = (newItem: ExtendedReportItem) => {
    setItems([newItem, ...items]);
    setActiveTab('ongoing');
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>;

  const ongoingList = items.filter(i => i.status === 'pending' || i.status === 'in_progress');
  const answeredList = items.filter(i => i.status === 'resolved' || i.status === 'rejected');

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      {/* 헤더 영역 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Megaphone className="w-6 h-6 animate-pulse" />
          <h1 className="text-2xl font-bold">파스텔 신문고</h1>
        </div>
        <p className="text-indigo-100 text-sm">여러분의 목소리가 모이면 정식 안건이 됩니다.</p>
        <div className="mt-4 flex items-center gap-2 text-xs bg-white/20 w-fit px-3 py-1.5 rounded-full">
          <AlertCircle className="w-3.5 h-3.5" /> <span>공감 50개 달성 시 공식 전달</span>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex gap-2 border-b border-slate-200">
        <TabButton icon={<Flame className="w-4 h-4"/>} label={`진행 중 (${ongoingList.length})`} isActive={activeTab === 'ongoing'} onClick={() => setActiveTab('ongoing')} />
        <TabButton icon={<CheckCircle2 className="w-4 h-4"/>} label={`답변 완료 (${answeredList.length})`} isActive={activeTab === 'answered'} onClick={() => setActiveTab('answered')} />
        <button onClick={() => setActiveTab('write')} className={cn("ml-auto px-4 py-3 text-sm font-bold text-indigo-600 flex items-center gap-1.5 hover:bg-indigo-50 rounded-t-lg", activeTab === 'write' && "bg-indigo-50")}>
          <PenTool className="w-4 h-4" /> 청원하기
        </button>
      </div>

      {/* 탭 내용 표시 */}
      {activeTab === 'ongoing' && <SinmungoList items={ongoingList} type="ongoing" onAgree={handleAgree} />}
      {activeTab === 'answered' && <SinmungoList items={answeredList} type="answered" />}
      {activeTab === 'write' && <SinmungoForm onSubmit={handleCreate} />}
    </div>
  );
}

// 탭 버튼 컴포넌트 (내부 사용)
const TabButton = ({ icon, label, isActive, onClick }: any) => (
  <button onClick={onClick} className={cn("px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2", isActive ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700")}>
    {icon} {label}
  </button>
);
