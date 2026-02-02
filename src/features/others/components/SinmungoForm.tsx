import React, { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '../../../utils/common';
import { ReportCategory } from '../../../types/index';
import { ExtendedReportItem } from './SinmungoPage';

interface Props {
  onSubmit: (item: ExtendedReportItem) => void;
}

const CATEGORIES: { value: ReportCategory; label: string }[] = [
  { value: 'suggestion', label: '개선 제안' },
  { value: 'bug', label: '버그 제보' },
  { value: 'user', label: '악성 유저' },
  { value: 'etc', label: '기타 문의' },
];

export function SinmungoForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState({ category: 'suggestion' as ReportCategory, title: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const newItem: ExtendedReportItem = {
        id: Date.now().toString(), authorId: 'me', authorName: '나',
        category: formData.category, title: formData.title, content: formData.content,
        status: 'pending', createdAt: new Date().toISOString(),
        agreeCount: 1, targetCount: 50, isVoted: true,
      };
      onSubmit(newItem);
      setIsSubmitting(false); setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); setFormData({ category: 'suggestion', title: '', content: '' }); }, 1500);
    }, 1000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 relative overflow-hidden">
      {showSuccess && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4"><CheckCircle2 className="w-8 h-8" /></div>
          <h3 className="text-xl font-bold text-slate-800">청원이 등록되었습니다!</h3>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">주제 선택</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat.value} type="button" onClick={() => setFormData({ ...formData, category: cat.value })} className={cn("px-4 py-2 rounded-full text-sm font-medium border transition-all", formData.category === cat.value ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50")}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">제목</label>
          <input type="text" required placeholder="제목을 입력하세요" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">내용</label>
          <textarea required rows={8} placeholder="내용을 입력하세요" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all resize-none" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
        </div>
        <button type="submit" disabled={isSubmitting || !formData.title || !formData.content} className={cn("w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all", isSubmitting || !formData.title || !formData.content ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg")}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : "청원 등록하기"}
        </button>
      </form>
    </div>
  );
}