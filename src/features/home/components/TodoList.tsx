import { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  ExternalLink 
} from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';

interface TodoItem {
  id: string;
  task: string;
  url?: string;
}

interface TodoData {
  dailyMissions: TodoItem[];
  rewardImage: {
    url: string;
    caption: string;
    unlockedMessage: string;
  };
}

interface LocalTodo extends TodoItem {
  completed: boolean;
}

export function TodoList() {
  const { data: serverData, loading, error } = useJsonData<TodoData>('todo');
  const [todos, setTodos] = useState<LocalTodo[]>([]);

  useEffect(() => {
    if (serverData?.dailyMissions && todos.length === 0) {
      setTodos(serverData.dailyMissions.map(t => ({ ...t, completed: false })));
    }
  }, [serverData]);

  const toggleTodo = (id: string) => {
    setTodos(prevTodos => 
      prevTodos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const progressPercent = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;
  
  // 블러 효과 계산
  const blurValue = Math.max(0, 10 - (progressPercent / 10));

  if (loading) return <div className="p-10 text-center text-gray-500">로딩 중...</div>;
  if (error || !serverData) return <div className="p-10 text-center text-red-400">데이터를 불러올 수 없습니다.</div>;

  return (
    <div className="flex flex-row flex-nowrap gap-4 h-full w-full min-h-[300px] overflow-hidden">
      
      {/* [왼쪽] TODO 리스트 */}
      {/* flex-1: 남은 공간 차지 (오른쪽이 넓어지면 자연스럽게 좁아짐) */}
      <div className="flex-1 min-w-0 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-purple-100/50 flex flex-col">
        
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <CheckSquare className="w-5 h-5 text-purple-500 shrink-0" />
            <h4 className="text-gray-800 font-bold text-base md:text-lg whitespace-nowrap truncate">TODO</h4>
          </div>
          <span className="px-2 py-0.5 bg-gradient-to-r from-pink-200 to-peach-200 text-gray-700 rounded-full text-[10px] md:text-xs font-bold shrink-0 ml-2">
            {completedCount}/{todos.length}
          </span>
        </div>

        {/* 리스트 아이템 */}
        <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-0">
          {todos.map((todo) => (
            <div
              key={todo.id}
              onClick={() => toggleTodo(todo.id)}
              className="flex items-center gap-2 p-2.5 bg-white/80 rounded-xl hover:bg-white transition-all border border-purple-100/30 cursor-pointer group active:scale-[0.99]"
            >
              {/* 체크박스 */}
              <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${
                todo.completed ? 'bg-purple-500 border-purple-500' : 'border-purple-300 bg-white'
              }`}>
                {todo.completed && <div className="w-2 h-2 bg-white rounded-sm" />}
              </div>
              
              <div className="flex-1 min-w-0 flex items-center justify-between gap-1">
                <span className={`text-xs md:text-sm truncate transition-colors ${
                  todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                }`}>
                  {todo.task}
                </span>

                {todo.url && (
                  <a 
                    href={todo.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={(e) => e.stopPropagation()} 
                    className="text-gray-400 hover:text-purple-500 p-1 rounded-md hover:bg-purple-50 transition-colors shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
           {(!todos || todos.length === 0) && (
            <p className="text-center text-gray-400 text-xs py-10">할 일이 없습니다.</p>
          )}
        </div>
      </div>

      {/* [오른쪽] 진척도 & 보상 이미지 */}
      {/* ✅ [수정] 너비를 340px로 늘려서 왼쪽 리스트 비율을 줄임 */}
      <div className="w-[340px] shrink-0 flex flex-col gap-3">
        
        {/* 1. 진척도 바 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-100/50 shadow-lg flex flex-col justify-center shrink-0">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xl font-black text-gray-800 tracking-tight tabular-nums">
              {progressPercent}%
            </span>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                Progress
            </span>
          </div>
          
          {/* ✅ [수정] 진행도 바 색상 강제 적용 (CSS 이슈 해결) */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ 
                // 최소 5%는 차오르게 해서 시각적으로 보이게 함
                width: `${Math.max(progressPercent, 5)}%`, 
                // Tailwind 클래스 대신 직접 그라데이션 적용
                background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)' 
              }}
            />
          </div>
        </div>

        {/* 2. 보상 이미지 */}
        {/* ✅ [수정] h-full로 채우되, 이미지가 너무 길어지지 않게 aspect 비율이나 object-cover 조절 */}
        <div className="relative h-full rounded-2xl overflow-hidden border border-purple-100/50 shadow-lg bg-gray-100 group">
          <img 
            src={serverData.rewardImage.url} 
            alt="Reward"
            style={{ filter: `blur(${blurValue}px)` }}
            className="w-full h-full object-cover transition-all duration-700 absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-left">
            <p className="text-white font-bold text-sm md:text-base drop-shadow-md truncate">
              {progressPercent === 100 ? serverData.rewardImage.unlockedMessage : "🔒 완료 시 공개"}
            </p>
            <p className="text-white/70 text-[10px] md:text-xs mt-1 truncate">{serverData.rewardImage.caption}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
