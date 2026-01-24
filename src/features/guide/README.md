# 가이드 시스템 구현 가이드

## 설치 필요 패키지

다음 패키지들을 설치해야 합니다:

```bash
npm install react-markdown
npm install -D @tailwindcss/typography
```

## Tailwind 설정

`tailwind.config.js` 파일에 `@tailwindcss/typography` 플러그인을 추가해야 합니다:

```js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

## Firestore 데이터 구조

### Collection: `guides`

각 문서는 `GuideDocument` 인터페이스를 따릅니다:

```typescript
{
  id: string;
  title: string;
  category: string; // 'Basic', 'Culture', etc.
  parentId: string | null; // Adjacency List 패턴
  content: string; // Markdown 본문
  tags: string[];
  mediaUrls: string[];
  views: number;
  lastUpdated: Timestamp;
  editorLevel: number; // 기본 2
}
```

## 사용 방법

### 1. 가이드 목록 표시

```tsx
import { GuideList } from './components/GuideList';

<GuideList 
  guides={guides} 
  category="Basic"
  onGuideClick={(guide) => console.log(guide)}
/>
```

### 2. 개별 가이드 문서 표시

라우팅은 자동으로 처리됩니다:
- `/guide/:category` - 카테고리 목록
- `/guide/:category/:id` - 개별 문서

### 3. 마크다운 작성 팁

**이미지 자동 변환:**
```
![Alt text](https://example.com/image.jpg)
```
→ 자동으로 ImageCard 컴포넌트로 변환됩니다.

**유튜브 임베드:**
```
https://www.youtube.com/watch?v=VIDEO_ID
또는
https://youtu.be/VIDEO_ID
```
→ 자동으로 iframe 플레이어로 변환됩니다.

**목차 자동 생성:**
- `#` (h1), `##` (h2), `###` (h3) 등이 자동으로 목차에 추가됩니다.

## Firebase 연동

현재는 JSON 파일을 사용하지만, Firebase로 전환하려면:

1. `GuideDocumentViewer.tsx`의 데이터 로딩 부분 수정
2. Firestore 쿼리로 데이터 가져오기
3. `views` 필드 업데이트는 `increment()` 사용

```typescript
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

const guideRef = doc(db, 'guides', id);
const guideSnap = await getDoc(guideRef);
const guide = { id: guideSnap.id, ...guideSnap.data() } as GuideDocument;

// 조회수 증가
await updateDoc(guideRef, {
  views: increment(1)
});
```

