# BRIFO-front 프로젝트 컨벤션 및 규칙

이 프로젝트에서 작업할 때는 항상 아래의 코딩 컨벤션, 스택 및 규칙을 엄격히 준수해야 합니다.

## 1. Tech Stack

- **코어**: `React 19`, `TypeScript`, `Vite`, `pnpm`
- **스타일링**: `TailwindCSS v4`, 프로젝트 디자인 토큰 우선 사용, `Radix UI` (UI 프리미티브), `lucide-react` (아이콘)
- **상태 관리**:
  - 서버 상태: `TanStack Query (React Query) v5`
  - 클라이언트 상태: `Zustand v5`
- **라우팅**: `React Router DOM v7`
- **폼 / 검증**: `React Hook Form` + `Zod`
- **HTTP**: `Axios` (인터셉터 사용)
- **기타**: `Framer Motion` (애니메이션), `Recharts` (차트), `ESLint 9` + `typescript-eslint`

## 2. Folder Convention

- **도메인/역할 기준 분리**: `pages`, `components`, `api`, `stores`, `types`, `constants`, `hooks`, `lib`
- **components 폴더**: 반드시 도메인 하위 폴더로 묶기 (예: `components/agent/`, `components/layouts/` 등)
- **페이지 컴포넌트**: `pages/{도메인}/XxxPage.tsx` 구조
- **Import 경로**: 항상 `@/` alias 사용 (예: `import { agentsApi } from '@/api/agents'`)

## 3. Branch & Issue Convention

- **브랜치 전략**: Git Flow (`main` 배포용, `dev` 통합용, `feat` 단위 작업)
- **Branch Naming**: `{이슈종류}/{이슈번호}-{기능명}` (예: `feat/12-login-page`)
- **Issue 종류**:
  - `chore`: 세팅 / `feat`: 기능 / `fix`: 버그 / `refactor`: 리팩토링 / `style`: 스타일 / `docs`: 문서

## 4. Commit Message Convention

- **형식**: `<type>: <subject>` (예: `feat: 사원 카드 컴포넌트 추가`)
- **내용**: 본문(Body)에 관련된 상세 설명을 작성

## 5. Pull Request Convention

- 제목 형식: `[Issue_종류] 구현_내용`
- UI 관련 변경 시 스크린샷/GIF 첨부 필수
- `dev` 머지 시 최소 2명 이상의 Approve 필요

## 6. Code Convention

- **컴포넌트 및 페이지**: `PascalCase` 사용 (예: `AgentCard`, `HomePage`)
- **커스텀 훅**: `use` 접두사 + `camelCase` (예: `useAuth`, `useWebSocket`)
- **함수 및 변수**: `camelCase` (예: `getMyAgents`)
- **타입 및 인터페이스**: `PascalCase` (예: `Agent`)
- **상수**: `UPPER_SNAKE_CASE` 또는 `as const` (예: `ROUTES`, `queryKeys`)
- **파일명**:
  - 컴포넌트: export 하는 컴포넌트명과 동일 (`AgentCard.tsx`)
  - 모듈 파일: `camelCase` (`agentConfig.ts`)
- **타입 분리**: `import type` 으로 명시적 가져오기
- **스타일링**: Tailwind 유틸 + 디자인 토큰 사용 (임의 hex 값 지양)

## 7. 상태 관리 Convention

- **서버 상태**: React Query 로만 관리 (useState + axios 직접 호출 지양)
  - 쿼리 키: `src/constants/queryKeys.ts` 에 중앙 관리
- **클라이언트 상태**: Zustand 사용 (`src/stores/*`), 영속성 필요시 `persist` 사용
- **API 호출**: `src/api/{도메인}.ts` 레이어에 모으기 (컴포넌트에서 직접 axios 호출 금지)
- **라우트 경로**: `src/constants/routes.ts` 의 `ROUTES` 사용 (하드코딩 지양)

## 8. 환경 변수
# BRIFO-front 프로젝트 컨벤션 및 규칙

이 프로젝트에서 작업할 때는 항상 아래의 코딩 컨벤션, 스택 및 규칙을 엄격히 준수해야 합니다.

## 1. Tech Stack

- **코어**: `React 19`, `TypeScript`, `Vite`, `pnpm`
- **스타일링**: `TailwindCSS v4`, 프로젝트 디자인 토큰 우선 사용, `Radix UI` (UI 프리미티브), `lucide-react` (아이콘)
- **상태 관리**:
  - 서버 상태: `TanStack Query (React Query) v5`
  - 클라이언트 상태: `Zustand v5`
- **라우팅**: `React Router DOM v7`
- **폼 / 검증**: `React Hook Form` + `Zod`
- **HTTP**: `Axios` (인터셉터 사용)
- **기타**: `Framer Motion` (애니메이션), `Recharts` (차트), `ESLint 9` + `typescript-eslint`

## 2. Folder Convention

- **도메인/역할 기준 분리**: `pages`, `components`, `api`, `stores`, `types`, `constants`, `hooks`, `lib`
- **components 폴더**: 반드시 도메인 하위 폴더로 묶기 (예: `components/agent/`, `components/layouts/` 등)
- **페이지 컴포넌트**: `pages/{도메인}/XxxPage.tsx` 구조
- **Import 경로**: 항상 `@/` alias 사용 (예: `import { agentsApi } from '@/api/agents'`)

## 3. Branch & Issue Convention

- **브랜치 전략**: Git Flow (`main` 배포용, `dev` 통합용, `feat` 단위 작업)
- **Branch Naming**: `{이슈종류}/{이슈번호}-{기능명}` (예: `feat/12-login-page`)
- **Issue 종류**:
  - `chore`: 세팅 / `feat`: 기능 / `fix`: 버그 / `refactor`: 리팩토링 / `style`: 스타일 / `docs`: 문서

## 4. Commit Message Convention

- **형식**: `<type>: <subject>` (예: `feat: 사원 카드 컴포넌트 추가`)
- **내용**: 본문(Body)에 관련된 상세 설명을 작성

## 5. Pull Request Convention

- 제목 형식: `[Issue_종류] 구현_내용`
- UI 관련 변경 시 스크린샷/GIF 첨부 필수
- `dev` 머지 시 최소 2명 이상의 Approve 필요

## 6. Code Convention

- **컴포넌트 및 페이지**: `PascalCase` 사용 (예: `AgentCard`, `HomePage`)
- **커스텀 훅**: `use` 접두사 + `camelCase` (예: `useAuth`, `useWebSocket`)
- **함수 및 변수**: `camelCase` (예: `getMyAgents`)
- **타입 및 인터페이스**: `PascalCase` (예: `Agent`)
- **상수**: `UPPER_SNAKE_CASE` 또는 `as const` (예: `ROUTES`, `queryKeys`)
- **파일명**:
  - 컴포넌트: export 하는 컴포넌트명과 동일 (`AgentCard.tsx`)
  - 모듈 파일: `camelCase` (`agentConfig.ts`)
- **타입 분리**: `import type` 으로 명시적 가져오기
- **스타일링**: Tailwind 유틸 + 디자인 토큰 사용 (임의 hex 값 지양)

## 7. 상태 관리 Convention

- **서버 상태**: React Query 로만 관리 (useState + axios 직접 호출 지양)
  - 쿼리 키: `src/constants/queryKeys.ts` 에 중앙 관리
- **클라이언트 상태**: Zustand 사용 (`src/stores/*`), 영속성 필요시 `persist` 사용
- **API 호출**: `src/api/{도메인}.ts` 레이어에 모으기 (컴포넌트에서 직접 axios 호출 금지)
- **라우트 경로**: `src/constants/routes.ts` 의 `ROUTES` 사용 (하드코딩 지양)

## 8. 환경 변수

- Vite 환경 변수는 `VITE_` 접두사 필수 (`import.meta.env.VITE_*`)
- `.env` 는 커밋 금지, `.env.example` 만 공유

## 9. 작업 흐름 제어 및 커밋 규칙 (Agent Workflow)

- **Push 권한 제한**: 코드를 수정한 후 임의로 원격 저장소에 `git push`를 실행하지 않습니다. 오직 로컬 `commit`까지만 진행하며, 사용자가 명시적으로 "푸시해"라고 지시할 때만 `push`를 실행합니다.
- **Commit 전 사전 검사 (Prettier & Lint)**: 코드를 생성하거나 수정한 뒤 `git commit`을 실행하기 전에는 **반드시** 터미널에서 `pnpm run format` (또는 `pnpm exec prettier --write .`) 와 `pnpm run lint`를 실행하여 프로젝트의 포맷팅 및 린트 룰을 100% 준수한 상태로 커밋해야 합니다.

## 10. 프로젝트 고유 설정 기반 강제 규칙 (Project-specific Constraints)

- **미사용 변수 엄격 금지 (TS6133 에러 방지)**: `tsconfig`에 의해 사용하지 않는 변수나 Props는 빌드 에러를 유발합니다. 코드를 주석 처리할 때 관련된 선언부 변수도 반드시 함께 제외하세요.
- **SVG 아이콘 임포트 (`?react` 접미사 필수)**: `vite-plugin-svgr` 세팅에 의해, SVG 파일을 리액트 컴포넌트로 불러올 때는 반드시 경로 끝에 `?react`를 붙여야 합니다. (예: `import Icon from '@/assets/icons/xxx.svg?react'`)
- **엄격한 Import 정렬 (`simple-import-sort`)**: ESLint에 의해 Import 순서가 강제되므로, 파일 수정 후 포맷터를 실행하여 자동 정렬을 유지하세요.
- **Tailwind 클래스 자동 정렬 (`prettier-plugin-tailwindcss`)**: Prettier 플러그인에 의해 지정된 Tailwind 클래스 순서를 수동으로 어기지 않도록 주의하세요.
- **디자인 토큰(styles 폴더) 엄수 및 임의 색상 금지 (강조)**: 임의의 hex 값뿐만 아니라 **Tailwind 기본 컬러(예: `Red-50`, `Blue-500` 등)**의 사용도 절대 금지합니다. UI 색상은 반드시 `src/styles/` 폴더 내(예: `color.css`)에 정의된 프로젝트 고유 토큰(예: `Pink-100`, `Yellow-30`)만 참조하여 작성해야 합니다.
