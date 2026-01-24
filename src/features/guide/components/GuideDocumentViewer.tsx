import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { GuideViewer } from './GuideViewer'; // 작성하신 컴포넌트 import
import { useJsonData } from '../../../hooks/useJsonData'; // 데이터 훅 사용
import type { GuideDocument } from '../../../types';

export function GuideDocumentViewer() {
  const { category, id } = useParams(); // URL 파라미터 가져오기
  const navigate = useNavigate();
  const { data: guides, loading } = useJsonData<GuideDocument[]>('guides'); // 전체 가이드 데이터 로드
  const [targetGuide, setTargetGuide] = useState<GuideDocument | null>(null);

  useEffect(() => {
    if (guides && id) {
      // ID로 가이드 찾기
      const found = guides.find(g => g.id === id);
      setTargetGuide(found || null);
    }
  }, [guides, id]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  // 가이드를 찾지 못한 경우
  if (!targetGuide) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-gray-500">찾으시는 가이드 문서가 없습니다.</p>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로 가기
        </button>
      </div>
    );
  }

  // ✅ 작성하신 GuideViewer 컴포넌트에 데이터를 넘겨줍니다.
  return (
    <div className="min-h-screen bg-white">
      {/* 상단 뒤로가기 네비게이션 */}
      <div className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">목록으로</span>
          </button>
        </div>
      </div>

      {/* 뷰어 렌더링 */}
      <GuideViewer guide={targetGuide} />
    </div>
  );
}