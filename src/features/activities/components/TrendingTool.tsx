import { memo, useMemo, useCallback, useState } from 'react';
import { Wand2, Copy, Check } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';
import type { TrendData } from '../../../types';
import { copyToClipboard } from '../../../utils/common';
import { Loading, ErrorState } from '../../../components/common';

function TrendingToolComponent() {
  const { data: trend, loading, error, refetch } = useJsonData<TrendData>('trend');
  const [copied, setCopied] = useState(false);

  // 복사할 전체 텍스트 생성
  const fullText = useMemo(() => {
    if (!trend) return '';
    return `${trend.baseword}\n\n${trend.hashtags.join(' ')}\n${trend.keywords.join(' ')}`;
  }, [trend]);

  const handleCopy = useCallback(async () => {
    if (!fullText) return;
    
    const success = await copyToClipboard(fullText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert('복사에 실패했습니다. 다시 시도해주세요.');
    }
  }, [fullText]);

  // 👇 [수정 1] Loading 컴포넌트는 인자 없이 사용
  if (loading) return <Loading />;
  
  // 👇 [수정 2] Error -> ErrorState 로 변경 및 에러 메시지 타입 처리
  if (error || !trend) return (
    <ErrorState 
      message={error ? String(error) : '데이터를 불러올 수 없습니다.'} 
      onRetry={refetch} 
    />
  );

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-purple-100/50">
      <div className="flex items-center gap-2 mb-4">
        <Wand2 className="w-5 h-5 text-purple-500" />
        <h3 className="text-gray-800">실트 총공 도구</h3>
      </div>

      <div className="space-y-3">
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-bold text-gray-800">{trend?.title}</p>
            <span className="text-xs text-purple-500 bg-white px-2 py-1 rounded-full shadow-sm">
              {trend.time ? new Date(trend.time).toLocaleTimeString('ko-KR', {hour: '2-digit', minute:'2-digit'}) : ''} 기준
            </span>
          </div>
          
          <div className="p-3 bg-white rounded-lg mb-3 border border-purple-100/50">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {fullText}
            </p>
          </div>
          
          <button 
            onClick={handleCopy}
            className="w-full py-2 flex items-center justify-center gap-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            disabled={!fullText}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '복사 완료!' : '문구 전체 복사하기'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export const TrendingTool = memo(TrendingToolComponent);