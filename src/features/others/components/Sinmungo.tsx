import React, { useState } from 'react';
import { 
  Megaphone, Flame, CheckCircle2, ThumbsUp, PenTool, 
  Loader2, MessageCircle, AlertCircle, ChevronRight 
} from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';
import { cn, formatDate } from '../../../utils/common';
import { SinmungoItem, CATEGORY_CONFIG, SinmungoCategory } from '../types/sinmungo';

export function SinmungoPage() {
  // --- Data ---
  const { data: initialData, isLoading } = useJsonData<SinmungoItem[]>('sinmungo');
  
  // 로컬 상태로 데이터 관리 (좋아요 클릭 즉시 반영을 위해)
  const [items, setItems] = useState<SinmungoItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ongoing' | 'answered' | 'write'>('ongoing');
  
  // 초기 데이터 로드 시 로컬 상태 동기화
  React.useEffect(() => {
    if (initialData) setItems(initialData);
  }, [initialData]);

  // --- Form State ---
  const [formData, setFormData] = useState({
    category: 'contents' as SinmungoCategory,
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- Actions ---
  
  // 공감하기 (투표) 핸들러
  const handleAgree = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        // 이미 투표했으면 취소, 아니면 추가
        const isVoted = !!item.isVoted;
        const newCount = isVoted ? item.agreeCount - 1 : item.agreeCount + 1;
        
        // 목표 달성 시 상태 변경 로직 (시뮬레이션)
        let newStatus = item.status;
        if (!isVoted && newCount >= item.targetCount && item.status === 'gathering') {
          newStatus = 'agenda'; // 정식 안건으로 승격
        }

        return { ...item, agreeCount: newCount, isVoted: !isVoted, status: newStatus };
      }
      return item;
    }));
  };

  // 글 작성 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newItem: SinmungoItem = {
        id: Date.now().toString(),
        userId: 'me',
        category: formData.category,
        title: formData.title,
        content: formData.content,
        agreeCount: 1, // 작성자는 자동 동의
        targetCount: 50,
        isVoted: true,
        status: 'gathering',
        createdAt: new Date().toISOString()
      };

      setItems([newItem, ...items]);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({ category: 'contents', title: '', content: '' });
        setActiveTab('ongoing');
      }, 1500);
    }, 1000);
  };

  // --- Render Helpers ---

  // 진행률 계산
  const getProgress = (current: number, target: number) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>;

  const ongoingList = items.filter(i => i.status !== 'answered');
  const answeredList = items.filter(i => i.status === 'answered');

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Megaphone className="w-6 h-6 animate-pulse" />
          <h1 className="text-2xl font-bold">파스텔 신문고</h1>
        </div>
        <p className="text-indigo-100 text-sm md:text-base">
          여러분의 목소리가 모이면 정식 안건이 됩니다. <br className="md:hidden"/>
          불편한 점, 바라는 점을 제안하고 공감해주세요.
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs bg-white/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>공감 50개 달성 시 회사로 공식 전달됩니다.</span>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('ongoing')}
          className={cn(
            "px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2",
            activeTab === 'ongoing' 
              ? "border-indigo-600 text-indigo-600" 
              : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          <Flame className="w-4 h-4" /> 진행 중 청원 ({ongoingList.length})
        </button>
        <button
          onClick={() => setActiveTab('answered')}
          className={cn(
            "px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2",
            activeTab === 'answered' 
              ? "border-indigo-600 text-indigo-600" 
              : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          <CheckCircle2 className="w-4 h-4" /> 답변 완료 ({answeredList.length})
        </button>
        <button
          onClick={() => setActiveTab('write')}
          className={cn(
            "ml-auto px-4 py-3 text-sm font-bold text-indigo-600 flex items-center gap-1.5 hover:bg-indigo-50 rounded-t-lg transition-colors",
            activeTab === 'write' && "bg-indigo-50"
          )}
        >
          <PenTool className="w-4 h-4" /> 청원하기
        </button>
      </div>

      {/* 1. 진행 중인 청원 탭 */}
      {activeTab === 'ongoing' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          {ongoingList.map((item) => {
            const progress = getProgress(item.agreeCount, item.targetCount);
            const isAgenda = item.status === 'agenda';

            return (
              <div key={item.id} className={cn("bg-white p-5 rounded-2xl border shadow-sm transition-all", isAgenda ? "border-indigo-200 ring-1 ring-indigo-100" : "border-slate-100")}>
                <div className="flex justify-between items-start mb-3">
                  <span className={cn("px-2.5 py-1 rounded-lg text-xs font-bold", CATEGORY_CONFIG[item.category].color)}>
                    {CATEGORY_CONFIG[item.category].label}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(item.createdAt)}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 whitespace-pre-wrap mb-4">{item.content}</p>

                {/* 진행률 바 */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className={isAgenda ? "text-indigo-600" : "text-slate-500"}>
                      {isAgenda ? "🎉 정식 안건 채택됨!" : "공감 모으는 중..."}
                    </span>
                    <span className="text-slate-700">
                      <span className="text-indigo-600">{item.agreeCount}</span> / {item.targetCount}명
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-500 rounded-full", isAgenda ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-indigo-400")} 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                </div>

                {/* 액션 버튼 */}
                <button
                  onClick={() => handleAgree(item.id)}
                  className={cn(
                    "w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95",
                    item.isVoted
                      ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                  )}
                >
                  <ThumbsUp className={cn("w-4 h-4", item.isVoted && "fill-current")} />
                  {item.isVoted ? "공감 완료" : "공감하고 힘 보태기"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. 답변 완료 탭 */}
      {activeTab === 'answered' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          {answeredList.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[11px] font-bold border border-green-200">답변완료</span>
                <span className="text-slate-300">|</span>
                <span className={cn("text-xs font-medium", CATEGORY_CONFIG[item.category].color.split(' ')[0])}>
                  {CATEGORY_CONFIG[item.category].label}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{item.content}</p>
              
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-indigo-200 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-3 h-3 text-indigo-700" />
                  </div>
                  <span className="text-xs font-bold text-indigo-900">운영팀 답변</span>
                </div>
                <p className="text-sm text-indigo-800 leading-relaxed">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. 청원하기 탭 */}
      {activeTab === 'write' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 relative overflow-hidden">
           {showSuccess && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">청원이 등록되었습니다!</h3>
              <p className="text-slate-500 mt-2">많은 공감을 받아 안건으로 채택되길 응원합니다.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">주제 선택</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: key as SinmungoCategory })}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                      formData.category === key
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">제목</label>
              <input
                type="text"
                required
                placeholder="어떤 점을 개선하면 좋을까요?"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">내용</label>
              <textarea
                required
                rows={8}
                placeholder="구체적인 상황과 개선 방안을 적어주시면 더 많은 공감을 받을 수 있습니다."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all resize-none"
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.content}
              className={cn(
                "w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all",
                isSubmitting || !formData.title || !formData.content
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl"
              )}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "청원 등록하기"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
