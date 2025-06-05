# TodoApp Frontend

Spring Boot 백엔드와 연동되는 Next.js 기반 할 일 관리 애플리케이션입니다.

## 주요 기능

- 📝 **할 일 관리**: 할 일 생성, 수정, 삭제, 조회
- 📋 **칸반보드**: 드래그 앤 드롭으로 할 일 상태 관리
- 🔐 **사용자 인증**: 로그인/회원가입 기능
- 📱 **반응형 디자인**: 모바일과 데스크톱 모두 지원
- 🎨 **Tailwind CSS**: 깔끔하고 현대적인 UI

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Hooks

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# API 서버 URL (Spring Boot 백엔드)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# 개발 환경 설정
NODE_ENV=development
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 페이지 구조

- `/` - 홈페이지
- `/todos` - 할 일 목록 (리스트 뷰)
- `/kanban` - 칸반보드 (보드 뷰)
- `/login` - 로그인
- `/register` - 회원가입
- `/me` - 사용자 정보

## API 연동

이 프론트엔드는 다음 백엔드 API와 연동됩니다:

### Todo API
- `GET /todos` - 모든 할 일 조회
- `POST /todos` - 새 할 일 생성
- `GET /todos/{id}` - 특정 할 일 조회
- `PUT /todos/{id}` - 할 일 수정
- `DELETE /todos/{id}` - 할 일 삭제
- `GET /todos/status/{status}` - 상태별 할 일 조회
- `PATCH /todos/{id}/status` - 할 일 상태 변경

### 사용자 API
- `POST /auth/login` - 로그인
- `POST /auth/register` - 회원가입
- `GET /users/me` - 현재 사용자 정보

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── Navigation.tsx  # 네비게이션 바
│   │   ├── TodoForm.tsx    # 할 일 생성/수정 폼
│   │   ├── TodoItem.tsx    # 할 일 아이템
│   │   ├── KanbanColumn.tsx # 칸반보드 컬럼
│   │   └── KanbanCard.tsx  # 칸반보드 카드
│   ├── todos/              # 할 일 목록 페이지
│   ├── kanban/             # 칸반보드 페이지
│   ├── login/              # 로그인 페이지
│   ├── register/           # 회원가입 페이지
│   └── me/                 # 사용자 정보 페이지
└── lib/                    # 유틸리티 및 설정
    ├── api.ts              # API 클라이언트 설정
    ├── types.ts            # TypeScript 타입 정의
    ├── auth.ts             # 인증 관련 유틸리티
    └── hooks/              # 커스텀 훅
        └── useTodos.ts     # Todo 관련 훅
```

## 개발 가이드

### 새로운 컴포넌트 추가
1. `src/app/components/` 디렉토리에 컴포넌트 파일 생성
2. TypeScript 인터페이스 정의
3. Tailwind CSS를 사용한 스타일링

### API 함수 추가
1. `src/lib/types.ts`에 필요한 타입 정의
2. `src/lib/api.ts`에 API 함수 추가
3. 필요시 `src/lib/hooks/`에 커스텀 훅 생성

## 빌드 및 배포

### 프로덕션 빌드
```bash
npm run build
```

### 프로덕션 서버 실행
```bash
npm start
```

## 문제 해결

### 백엔드 연결 오류
- `NEXT_PUBLIC_API_BASE_URL` 환경 변수가 올바르게 설정되었는지 확인
- 백엔드 서버가 실행 중인지 확인
- CORS 설정이 올바른지 확인

### 인증 오류
- 쿠키 설정이 올바른지 확인 (`withCredentials: true`)
- 백엔드의 세션/JWT 설정 확인
