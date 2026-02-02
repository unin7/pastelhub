import React from 'react';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import { cn, formatDate } from '../../../utils/common';
import { ReportCategory } from '../../../types/index';
import { ExtendedReportItem } from './SinmungoPage'; // 타입 가져오기

const CATEGORY_CONFIG: Record<ReportCategory, { label: string; color: string }> = {
  bug: { label: '버그 제보', color: 'text-red-600 bg-red-50 border-red-100' },
  user: { label: '악성 유저', color: 'text-orange-600 bg-orange-50 border-orange-100' },
  suggestion: { label: '개선 제안', color: 'text-blue-600 bg-blue-50 border-blue-100' },
  etc: { label: '기타 문의', color: 'text-slate-600 bg-slate-50 border-slate-100' },
};

interface Props {
  items: ExtendedReportItem[];
  type: 'ongoing' | 'answered';
  onAgree?: (id: string) => void;
}

export function SinmungoList({ items, type, onAgree }: Props) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
      {items.map((item) => {
        const progress = Math.min(100, Math.round((item.agreeCount / item.targetCount) * 100));
        const isAgenda = item.status === 'in_progress';

        return (
          <div key={item.id} className={cn("bg-white p-5 rounded-2xl border shadow-sm", isAgenda ? "border-indigo-200 ring-1 ring-indigo-100" : "border-slate-100")}>
            {/* 카테고리 & 날짜 */}
            <div className="flex justify-between items-start mb-3">
              <span className={cn("px-2.5 py-1 rounded-lg text-xs font-bold border", CATEGORY_CONFIG[item.category].color)}>
                {CATEGORY_CONFIG[item.category].label}
              </span>
              <span className="text-xs text-slate-400">{formatDate(item.createdAt)}</span>
            </div>

            {/* 내용 */}
            <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
            <p className="text-sm text-slate-600 whitespace-pre-wrap mb-4">{item.content}</p>

            {/* 진행 중일 때: 그래프 & 버튼 */}
            {type === 'ongoing' && onAgree && (
              <>
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className={isAgenda ? "text-indigo-600" : "text-slate-500"}>{isAgenda ? "🎉 정식 안건 채택됨!" : "공감 모으는 중..."}</span>
                    <span className="text-slate-700"><span className="text-indigo-600">{item.agreeCount}</span> / {item.targetCount}명</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-500 rounded-full", isAgenda ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-indigo-400")} style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <button onClick={() => onAgree(item.id)} className={cn("w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95", item.isVoted ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200")}>
                  <ThumbsUp className={cn("w-4 h-4", item.isVoted && "fill-current")} /> {item.isVoted ? "공감 완료" : "공감하고 힘 보태기"}
                </button>
              </>
            )}

            {/* 답변 완료일 때: 답변 박스 */}
            {type === 'answered' && (
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-indigo-200 rounded-full flex items-center justify-center"><MessageCircle className="w-3 h-3 text-indigo-700" /></div>
                  <span className="text-xs font-bold text-indigo-900">운영팀 답변</span>
                </div>
                <p className="text-sm text-indigo-800 leading-relaxed">{item.answer || "답변 내용이 없습니다."}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}