# 환경 설정 가이드

## 데이터 소스 설정

현재 프로젝트는 로컬 JSON 파일을 사용하고 있으며, Firebase Hosting으로 쉽게 전환할 수 있도록 설계되었습니다.

### 로컬 모드 (기본값)

로컬 JSON 파일을 사용합니다. `/public/data/` 폴더의 JSON 파일을 읽어옵니다.

### Firebase 모드로 전환

1. `.env` 파일을 프로젝트 루트에 생성합니다:

```env
# 데이터 소스 설정
VITE_DATA_SOURCE=firebase

# Firebase 설정
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

2. `src/services/dataService.ts`의 `FirebaseDataService` 클래스를 구현합니다.

3. Firebase SDK를 설치합니다:

```bash
npm install firebase
```

4. `src/services/dataService.ts`에서 Firebase를 초기화하고 사용합니다.

## 설정 파일 위치

- 환경 설정: `src/config/env.ts`
- 데이터 서비스: `src/services/dataService.ts`
- 커스텀 훅: `src/hooks/useJsonData.ts`

