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
  // 보상 이미지는 동기 부여를 위해 남겨두는 것을 추천합니다.
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
  // 제네릭 타입에서 QuickAction 제거
  const { data: serverData, loading, error } = useJsonData<TodoData>('todo');
  const [todos, setTodos] = useState<LocalTodo[]>([]);

  useEffect(() => {
    // 초기 로딩 시에만 데이터 동기화
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
  const blurValue = Math.max(0, 20 - (progressPercent / 5));

  if (loading) return <div className="p-10 text-center text-gray-500">로딩 중...</div>;
  if (error || !serverData) return <div className="p-10 text-center text-red-400">데이터를 불러올 수 없습니다.</div>;

  return (
    <div className="flex flex-row flex-nowrap gap-4 h-full w-full min-h-[300px] overflow-hidden">
      
      {/* [왼쪽] TODO 리스트 */}
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
              className="flex items-center gap-2 p-2 bg-white/80 rounded-lg hover:bg-white transition-all border border-purple-100/30 cursor-pointer group active:scale-[0.99]"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                readOnly
                className="w-3.5 h-3.5 rounded md:rounded-md border-2 border-purple-300 text-purple-500 focus:ring-0 pointer-events-none shrink-0"
              />
              
              <div className="flex-1 min-w-0 flex items-center justify-between gap-1">
                <span className={`text-xs md:text-sm truncate transition-colors ${
                  todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                }`}>
                  {todo.task}
                </span>

                {/* 링크가 있으면 외부 링크 아이콘 표시 */}
                {todo.url && (
                  <a 
                    href={todo.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={(e) => e.stopPropagation()} 
                    className="text-gray-400 hover:text-purple-500 p-1 rounded-md hover:bg-purple-50 transition-colors shrink-0"
                  >
                    <ExternalLink className="w-3 h-3" />
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

      {/* [오른쪽] 진척도 & 보상 이미지 (QuickAction 제거됨) */}
      <div className="w-[320px] shrink-0 flex flex-col gap-3">
        
        {/* 1. 진척도 바 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-100/50 shadow-lg flex flex-col justify-center shrink-0">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xl md:text-2xl font-black text-gray-800 tracking-tight tabular-nums">{progressPercent}%</span>
            <span className="text-[9px] md:text-[10px] font-bold text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                Progress
            </span>
          </div>
          <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner border border-slate-100 relative">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(168,85,247,0.4)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 2. 보상 이미지 (공간이 남으므로 flex-1로 꽉 채움) */}
        <div className="relative flex-1 rounded-2xl overflow-hidden border border-purple-100/50 shadow-lg bg-gray-100 group min-h-[100px]">
          <img 
            src={serverData.rewardImage.url} 
            alt="Reward"
            style={{ filter: `blur(${blurValue}px)` }}
            className="w-full h-full object-cover transition-all duration-700 absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-left">
            <p className="text-white font-bold text-sm md:text-base drop-shadow-md truncate">
              {progressPercent === 100 ? serverData.rewardImage.unlockedMessage : "🔒 완료 시 공개"}
            </p>
            <p className="text-white/70 text-[9px] md:text-[10px] mt-0.5 truncate">{serverData.rewardImage.caption}</p>
          </div>
        </div>

      </div>
    </div>
  );
}