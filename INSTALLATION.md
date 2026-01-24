# 패키지 설치 가이드

## 가이드 시스템에 필요한 패키지

가이드 뷰어 기능을 사용하려면 다음 패키지를 설치해야 합니다:

```bash
npm install react-markdown
npm install -D @tailwindcss/typography
```

## Tailwind 설정

프로젝트 루트에 `tailwind.config.js` 파일을 생성하거나 기존 파일을 수정하세요:

```js
/** @type {import('tailwindcss').Config} */
export default {
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

또는 `tailwind.config.ts` (TypeScript):

```ts
import type { Config } from 'tailwindcss';

export default {
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
} satisfies Config;
```

## 설치 후 확인

설치가 완료되면 다음 명령어로 개발 서버를 실행하세요:

```bash
npm run dev
```

가이드 페이지(`/guide`)에서 마크다운 렌더링이 정상적으로 작동하는지 확인하세요.

