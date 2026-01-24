import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye, Calendar, Tag } from 'lucide-react';
import type { GuideDocument } from '../../../types';
import { formatDate } from '../../../utils/common';
import { cn } from '../../../components/ui/utils';

interface GuideListProps {
  guides: GuideDocument[];
  category: string;
  onGuideClick?: (guide: GuideDocument) => void;
}

/**
 * 가이드 목록을 표시하는 컴포넌트
 * 카테고리별로 가이드 문서들을 카드 형태로 표시
 */
export function GuideList({ guides, category, onGuideClick }: GuideListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // 검색 필터링
  const filteredGuides = guides.filter((guide) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      guide.title.toLowerCase().includes(query) ||
      guide.content.toLowerCase().includes(query) ||
      guide.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  // 카테고리별 필터링
  const categoryGuides = filteredGuides.filter(
    (guide) => guide.category === category || !category
  );

  if (categoryGuides.length === 0) {
    return (
      <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-400">
          {searchQuery ? '검색 결과가 없습니다.' : '가이드가 아직 준비되지 않았습니다.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 검색 바 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <input
          type="text"
          placeholder="가이드 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* 가이드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryGuides.map((guide) => (
          <Link
            key={guide.id}
            to={`/guide/${category}/${guide.id}`}
            onClick={() => onGuideClick?.(guide)}
            className="group"
          >
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              {/* 썸네일 */}
              {guide.mediaUrls && guide.mediaUrls.length > 0 && (
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={guide.mediaUrls[0]}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* 콘텐츠 */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                    {guide.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {guide.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                  {guide.content.substring(0, 150)}...
                </p>

                {/* 태그 */}
                {guide.tags && guide.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {guide.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* 메타 정보 */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{guide.views.toLocaleString()}</span>
                  </div>
                  {guide.lastUpdated && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {guide.lastUpdated?.toDate
                          ? formatDate(guide.lastUpdated.toDate())
                          : typeof guide.lastUpdated === 'string'
                          ? formatDate(guide.lastUpdated)
                          : formatDate(new Date(guide.lastUpdated))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

