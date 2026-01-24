import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { GuideDocument, GuideTOCItem } from '../../../types';
import { ImageCard } from './ImageCard';
import { cn } from '../../../components/ui/utils';
import { List, Eye } from 'lucide-react';

interface GuideViewerProps {
  guide: GuideDocument;
  onViewIncrement?: () => void;
}

// 이미지 URL 패턴 감지
const IMAGE_URL_PATTERN = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i;
const YOUTUBE_PATTERN = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;

export function GuideViewer({ guide, onViewIncrement }: GuideViewerProps) {
  const [toc, setToc] = useState<GuideTOCItem[]>([]);
  const [activeTocId, setActiveTocId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tocObserverRef = useRef<IntersectionObserver | null>(null);

  // 조회수 증가 (한 번만)
  useEffect(() => {
    if (onViewIncrement) {
      onViewIncrement();
    }
  }, [guide.id, onViewIncrement]);

  // 목차 추출 및 스크롤 감지
  useEffect(() => {
    if (!contentRef.current) return;

    const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const tocItems: GuideTOCItem[] = [];

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent || '';
      const id = `heading-${index}-${text.toLowerCase().replace(/\s+/g, '-')}`;
      
      heading.id = id;
      heading.setAttribute('data-heading-level', level.toString());

      tocItems.push({
        id,
        text,
        level,
        element: heading as HTMLElement,
      });
    });

    setToc(tocItems);

    // Intersection Observer로 현재 보이는 헤딩 감지
    if (tocObserverRef.current) {
      tocObserverRef.current.disconnect();
    }

    tocObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTocId(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      tocObserverRef.current?.observe(heading);
    });

    return () => {
      tocObserverRef.current?.disconnect();
    };
  }, [guide.content]);

  // 커스텀 마크다운 렌더러
  const markdownComponents: Components = useMemo(() => {
    return {
      // 이미지 렌더링: ImageCard로 변환
      img: ({ src, alt, ...props }) => {
        if (!src) return null;

        // 이미지 URL인지 확인
        if (IMAGE_URL_PATTERN.test(src)) {
          return (
            <div className="my-6">
              <ImageCard src={src} alt={alt || ''} />
            </div>
          );
        }

        // 일반 이미지 태그
        return (
          <img
            src={src}
            alt={alt}
            className="rounded-lg shadow-md my-4 max-w-full h-auto"
            {...props}
          />
        );
      },

      // 링크 렌더링: 유튜브 링크는 iframe으로 변환
      a: ({ href, children, ...props }) => {
        if (!href) return <a {...props}>{children}</a>;

        const youtubeMatch = href.match(YOUTUBE_PATTERN);
        if (youtubeMatch) {
          const videoId = youtubeMatch[1];
          return (
            <div className="my-6 aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          );
        }

        // 일반 링크
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
            {...props}
          >
            {children}
          </a>
        );
      },

      // 헤딩 스타일링
      h1: ({ children, ...props }) => (
        <h1
          className="text-3xl font-bold mt-8 mb-4 text-gray-900 border-b border-gray-200 pb-2"
          {...props}
        >
          {children}
        </h1>
      ),
      h2: ({ children, ...props }) => (
        <h2
          className="text-2xl font-bold mt-6 mb-3 text-gray-800"
          {...props}
        >
          {children}
        </h2>
      ),
      h3: ({ children, ...props }) => (
        <h3
          className="text-xl font-semibold mt-5 mb-2 text-gray-700"
          {...props}
        >
          {children}
        </h3>
      ),

      // 코드 블록
      code: ({ className, children, ...props }) => {
        const isInline = !className;
        return isInline ? (
          <code
            className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono text-pink-600"
            {...props}
          >
            {children}
          </code>
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },

      // 리스트
      ul: ({ children, ...props }) => (
        <ul className="list-disc list-inside space-y-2 my-4" {...props}>
          {children}
        </ul>
      ),
      ol: ({ children, ...props }) => (
        <ol className="list-decimal list-inside space-y-2 my-4" {...props}>
          {children}
        </ol>
      ),

      // 인용구
      blockquote: ({ children, ...props }) => (
        <blockquote
          className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 italic text-gray-700"
          {...props}
        >
          {children}
        </blockquote>
      ),
    };
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const topPos = element.offsetTop - 80;
      window.scrollTo({
        top: topPos,
        behavior: 'smooth',
      });
      setActiveTocId(id);
    }
  };

  return (
    <div className="flex gap-8 max-w-7xl mx-auto px-4 py-8">
      {/* 메인 콘텐츠 */}
      <article className="flex-1 min-w-0">
        {/* 헤더 */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {guide.category}
            </span>
            {guide.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{guide.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{guide.views.toLocaleString()}회 조회</span>
            </div>
            {guide.lastUpdated && (
              <span>
                최종 수정:{' '}
                {guide.lastUpdated?.toDate
                  ? new Date(guide.lastUpdated.toDate()).toLocaleDateString('ko-KR')
                  : typeof guide.lastUpdated === 'string'
                  ? new Date(guide.lastUpdated).toLocaleDateString('ko-KR')
                  : new Date(guide.lastUpdated).toLocaleDateString('ko-KR')}
              </span>
            )}
          </div>
        </div>

        {/* 마크다운 콘텐츠 */}
        <div
          ref={contentRef}
          className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-pink-600"
        >
          <ReactMarkdown components={markdownComponents}>
            {guide.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* 목차 사이드바 (데스크톱만) */}
      {toc.length > 0 && (
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24 h-fit">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <List className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-bold text-gray-700">목차</span>
            </div>
            <nav className="p-2 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-all duration-200 block',
                    item.level === 1 && 'font-semibold',
                    item.level === 2 && 'pl-6 text-gray-600',
                    item.level >= 3 && 'pl-10 text-gray-500 text-xs',
                    activeTocId === item.id
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  {item.text}
                </button>
              ))}
            </nav>
          </div>
        </aside>
      )}
    </div>
  );
}

