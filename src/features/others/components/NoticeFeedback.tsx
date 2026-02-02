import React, { useState } from 'react';
import { 
  Megaphone, HelpCircle, ChevronDown, ChevronUp, Send, 
  Loader2, Mail, CheckCircle2, AlertCircle, Wrench 
} from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';
import { cn, formatDate } from '../../../utils/common';

// --- Types ---
interface DevNewsItem {
  id: string;
  type: 'notice' | 'update' | 'maintenance'; // 타입 변경
  title: string;
  content: string;
  date: string;
  isImportant?: boolean;
}

interface FeedbackForm {
  email: string;
  type: 'bug' | 'account' | 'other';
  content: string;
}

// 뱃지 설정
const NEWS_TYPE_CONFIG = {
  notice: { label: '소식', color: 'bg-blue-100 text-blue-700' },
  update: { label: '패치', color: 'bg-green-100 text-green-700' },
  maintenance: { label: '점검', color: 'bg-orange-100 text-orange-700' },
};

export function NoticeFeedback() {
  // --- Data ---
  // ✅ 파일명 변경: public/dev_news.json 을 불러옵니다.
  const { data: newsList, isLoading } = useJsonData<DevNewsItem[]>('dev_news');

  // --- State ---
  const [activeTab, setActiveTab] = useState<'news' | 'feedback'>('news');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const [form, setForm] = useState<FeedbackForm>({ email: '', type: 'bug', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Handlers ---
  const toggleNews = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setForm({ email: '', type: 'bug', content: '' }); 
      
      setTimeout(() => setIsSuccess(false), 3000); 
    }, 1500);
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* 헤더 */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">개발팀 뉴스 & 피드백</h1>
        <p className="text-slate-500 text-sm">
          파스텔 허브의 업데이트 내역을 확인하고,<br />
          개발팀에게 직접 의견을 보내주세요.
        </p>
      </div>

      {/* 탭 메뉴 */}
      <div className="bg-slate-100 p-1 rounded-xl flex">
        <button
          onClick={() => setActiveTab('news')}
          className={cn(
            "flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all",
            activeTab === 'news' 
              ? "bg-white text-indigo-600 shadow-sm" 
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Wrench className="w-4 h-4" /> 개발 소식
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={cn(
            "flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all",
            activeTab === 'feedback' 
              ? "bg-white text-indigo-600 shadow-sm" 
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Mail className="w-4 h-4" /> 1:1 문의
        </button>
      </div>

      {/* 1. 개발 소식 탭 */}
      {activeTab === 'news' && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
          {newsList && newsList.length > 0 ? (
            newsList.map((item) => (
              <div 
                key={item.id} 
                className={cn(
                  "bg-white border rounded-xl overflow-hidden transition-all",
                  expandedId === item.id ? "border-indigo-200 shadow-md" : "border-slate-100 hover:border-indigo-100"
                )}
              >
                <button 
                  onClick={() => toggleNews(item.id)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", NEWS_TYPE_CONFIG[item.type].color)}>
                        {NEWS_TYPE_CONFIG[item.type].label}
                      </span>
                      {item.isImportant && (
                        <span className="text-[10px] font-bold text-red-500 flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" /> 중요
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{formatDate(item.date)}</span>
                    </div>
                    <h3 className={cn("font-bold text-slate-800", expandedId === item.id && "text-indigo-600")}>
                      {item.title}
                    </h3>
                  </div>
                  {expandedId === item.id ? (
                    <ChevronUp className="w-5 h-5 text-indigo-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-300" />
                  )}
                </button>
                
                {/* 내용 (아코디언) */}
                {expandedId === item.id && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="h-px w-full bg-slate-50 mb-4" />
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {item.content}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-100 border-dashed">
              등록된 소식이 없습니다.
            </div>
          )}
        </div>
      )}

      {/* 2. 1:1 문의 탭 (유지) */}
      {activeTab === 'feedback' && (
        <div className="animate-in fade-in slide-in-from-bottom-2">
          {isSuccess ? (
            <div className="bg-white border border-green-100 rounded-2xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">개발팀에 전달되었습니다!</h3>
              <p className="text-slate-500 text-sm">
                버그 제보와 소중한 의견은<br />
                빠르게 검토하여 반영하겠습니다.
              </p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="mt-6 text-indigo-600 font-bold text-sm hover:underline"
              >
                추가 문의 보내기
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold border-b border-slate-50 pb-4">
                <HelpCircle className="w-5 h-5 text-indigo-500" />
                문의 / 제보하기
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">분류</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['bug', 'account', 'other'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm({ ...form, type: type as any })}
                        className={cn(
                          "py-2.5 rounded-lg text-sm font-medium border transition-all",
                          form.type === type
                            ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                        )}
                      >
                        {type === 'bug' && '버그 발견'}
                        {type === 'account' && '계정 문제'}
                        {type === 'other' && '기타/건의'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">이메일</label>
                  <input
                    type="email"
                    required
                    placeholder="답변 받을 이메일을 입력하세요"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">내용</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="구체적인 내용을 적어주시면 개발에 큰 도움이 됩니다."
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !form.content || !form.email}
                  className={cn(
                    "w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all mt-2",
                    isSubmitting || !form.content || !form.email
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
                  )}
                >
                  {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <><Send className="w-4 h-4" /> 개발팀에 보내기</>}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}