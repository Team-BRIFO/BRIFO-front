# BRIFO Frontend

> **B**riefing **R**oom for **I**nvestment & **F**inancial **O**perations
>
> "모든 투자 결정은 브리포에서 시작된다"

BRIFO는 사용자가 투자 회사의 **사장(CEO)** 이 되어 개성 있는 AI 사원 3명(루키·프로·탱커)을 고용하고, 이들의 분석 보고서를 바탕으로 투자 의사결정을 내리는 **게이미피케이션 기반 AI 투자 교육 플랫폼**입니다.

## 📖 프로젝트 소개

| 항목       | 내용                                                                        |
| ---------- | --------------------------------------------------------------------------- |
| 한 줄 정의 | "나는 사장, AI는 사원. 우리 팀이 분석하고, 내가 결정한다."                  |
| 분류       | 게이미피케이션 기반 AI 투자 교육 플랫폼                                      |
| 핵심 컨셉  | 사장(CEO)이 된 사용자가 AI 사원 3명을 고용하고, 분석 보고서로 투자를 결정    |
| 타겟 사용자 | 2030 주식 입문자~중급(1차), 투자 교육에 관심 있는 대학생/사회초년생(2차)   |
| 개발 기간  | 2026.06.22 ~ 2026.08.21 (약 9주)                                             |

### 핵심 게임 루프

```
[출근 / 카드뉴스 확인]
        ↓
[사원에게 분석 업무 할당]
        ↓
[AI 사원 보고서 열람 (3명)]
        ↓
[방향 + 확신도 선택]
        ↓
[15:30 장 마감 자동 정산]
        ↓
[AP 획득 + 사원 EXP 증가]
        ↓
[결정 일기 자동 기록]
        ↓
[다음 날 다시 출근]
```

---

## 👥 팀원 및 프론트엔드 역할 분담

| 이름 | GitHub | 담당 역할 |
| ---- | ------ | --------- |
|      |        |           |
|      |        |           |
|      |        |           |

---

## 🛠 기술 스택

| 분류         | 기술                                                                 |
| ------------ | --------------------------------------------------------------------- |
| 코어         | `React 19`, `TypeScript`, `Vite`, `pnpm`                              |
| 스타일링     | `TailwindCSS v4`(`@tailwindcss/vite`), 디자인 토큰(BERIFO 디자인 시스템), `Radix UI`(Dialog/Select/Tabs/Slider), `lucide-react` |
| 서버 상태    | `TanStack Query (React Query) v5`                                     |
| 클라이언트 상태 | `Zustand v5`                                                       |
| 라우팅       | `React Router DOM v7`                                                 |
| 폼 / 검증    | `React Hook Form` + `Zod`                                             |
| HTTP         | `Axios` (인터셉터로 JWT 주입 / 401 처리)                              |
| 애니메이션   | `Framer Motion`                                                       |
| 차트         | `Recharts`                                                            |
| 린트 / 포맷  | `ESLint 9`(flat config) + `typescript-eslint`, `Prettier`             |

---

## 📁 폴더 구조

```
src/
├── api/                  # API 레이어 (도메인별 호출 함수 + axios 인스턴스)
│   ├── axios.ts          # apiClient (JWT 인터셉터 / 401 처리)
│   ├── auth.ts
│   ├── agents.ts
│   ├── briefing.ts
│   ├── news.ts
│   ├── decision.ts
│   ├── feed.ts
│   └── mock.ts           # BE 연동 전 목업 응답
├── components/           # 재사용 컴포넌트 (도메인별 하위 폴더로 구성)
│   ├── ui/common/        # Modal, Toast, PageHeader, BottomNavBar, GlobalHeader …
│   ├── layouts/          # AppLayout(인증 가드) / AuthLayout
│   ├── agent/            # AgentCard, AgentCharacter, AgentChip, AgentStatBar …
│   ├── briefing/         # NewsCard, BriefingReportCard, SpeechBubble
│   ├── feed/
│   └── review/
├── pages/                # 라우트 단위 페이지 (pages/{도메인}/XxxPage.tsx)
│   ├── auth/             # Splash, Onboarding, Login, CompanySetup, FirstAgent
│   ├── home/             # Home, Quest, Notification
│   ├── briefing/         # BriefingList, BriefingSetup, BriefingReport
│   ├── team/             # Team, AgentDetail
│   ├── market/           # Market
│   ├── feed/             # Feed, Ranking, DecisionDetail
│   └── mypage/           # My, ProfileEdit, Review, APHistory, Achievement …
├── stores/               # Zustand 스토어
│   ├── authStore.ts      # 토큰/로그인 상태 (persist)
│   ├── userStore.ts      # 유저 정보, AP 잔액
│   ├── agentStore.ts
│   └── toastStore.ts
├── constants/
│   ├── routes.ts         # ROUTES 경로 상수
│   ├── queryKeys.ts      # React Query 키 중앙 관리
│   └── agentConfig.ts    # 사원(루키/프로/탱커) 설정
├── types/                # 도메인 타입 정의 (user, agent, briefing, news, decision, feed …)
├── hooks/                # 커스텀 훅
├── lib/
│   ├── utils.ts          # cn() 등 유틸 (clsx + tailwind-merge)
│   ├── format.ts         # 날짜/숫자 포맷 (date-fns)
│   └── mockData.ts
├── router.tsx            # createBrowserRouter 라우트 트리
└── main.tsx              # 진입점 (QueryClientProvider + RouterProvider)
```

- **Import 경로**: 항상 `@/` alias 사용 (상대경로 `../../` 지양)

```typescript
import { agentsApi } from '@/api/agents'
import type { Agent } from '@/types/agent'
```

---

## 🌿 브랜치 컨벤션

- **전략**: Git Flow (`main` 배포용 / `dev` 개발 통합용 / `feat` 등 기능 단위 작업 브랜치)
- `main`: 실제 배포 CI/CD용 (보호, 직접 push 금지)
- `dev`: 개발 통합 CI/CD용
- `feat` 브랜치는 반드시 `dev`에서 분기하여 `dev`로 머지
- **브랜치명**: `{이슈종류}/{이슈번호}-{기능명}`
  예) `feat/12-login-page`, `fix/30-briefing-tab`

### Issue 종류

| 종류       | 의미                            |
| ---------- | ------------------------------- |
| `chore`    | 배포 또는 프로젝트 기본 세팅    |
| `feat`     | 기능 구현                       |
| `fix`      | 버그 수정                       |
| `refactor` | 코드 리팩토링                   |
| `style`    | 스타일/마크업 변경 (로직 변화 없음) |
| `docs`     | 문서 추가                       |

### 개발 전 작업 순서

1. Issue 발행 (제목: `[이슈종류] 이슈_제목`, Assignees/Labels 설정)
2. 이슈 번호 기준으로 브랜치 생성: `{이슈종류}/{이슈번호}-{기능명}`
3. `git fetch` & `git pull` 로 로컬 최신화
4. `pnpm install` 로 의존성 설치

---

## 📝 커밋 컨벤션

```
<type>: <subject>

<본문 - 상세 설명>
```

- 형식: `<type>: <subject>` (예: `feat: 사원 카드 컴포넌트 추가`)
- Body에 관련 상세 설명을 작성

```
예시)
feat: 로그인 페이지 구현

카카오/구글 소셜 로그인 버튼 UI 추가
OAuth redirect URL 연결
```

| type       | 예시                                  |
| ---------- | ------------------------------------- |
| `feat`     | `feat: 사원 카드 컴포넌트 추가`       |
| `fix`      | `fix: 브리핑 탭 전환 오류 수정`       |
| `refactor` | `refactor: API 레이어 분리`           |
| `style`    | `style: 홈 대시보드 간격 조정`        |
| `docs`     | `docs: README 작성`                   |

---

## 🔀 Pull Request 컨벤션

- 제목 형식: `[이슈종류] 구현_내용` (예: `[Feat] 로그인 페이지 구현`)
- 팀원이 리뷰하기 쉽도록 자세하게 작성 (`.github/PULL_REQUEST_TEMPLATE.md` 사용)
- UI 관련 변경 시 **스크린샷/GIF 첨부 필수** (머지 전 로컬에서 직접 화면 확인)
- PR 작성 후 리뷰어 · 담당자 · 라벨 설정
- `dev` 브랜치 머지 시 **최소 2명 이상의 Approve** 필요
- 머지 전 `pnpm lint` 통과 확인

---

## 🚀 실행 방법

```bash
# 1. 저장소 클론
git clone https://github.com/Team-BRIFO/BRIFO-front.git
cd BRIFO-front

# 2. 의존성 설치
pnpm install

# 3. 환경 변수 설정 (.env.example 참고하여 .env 생성)
cp .env.example .env

# 4. 개발 서버 실행
pnpm dev

# 5. 빌드
pnpm build

# 6. 빌드 결과 미리보기
pnpm preview

# 7. 린트
pnpm lint
pnpm lint:fix

# 8. 포맷팅
pnpm format
pnpm format:check
```

### 환경 변수

- Vite 환경 변수는 `VITE_` 접두사 필수 (`import.meta.env.VITE_*`)
- `.env`는 커밋 금지, `.env.example`로 키 목록만 공유
- 주요 키
  - `VITE_API_BASE_URL` — BE 서버 주소 (기본 `http://localhost:8080`)
  - `VITE_KAKAO_CLIENT_ID` — 카카오 소셜 로그인
  - `VITE_GOOGLE_CLIENT_ID` — 구글/기타 소셜 로그인

---

## 🖥 화면 목록 및 플로우

### 온보딩 플로우

```
[랜딩] → [소셜 로그인 선택 (카카오/네이버/애플)]
       ↓
[닉네임 + 회사명 입력]
       ↓
[관심 종목 3~5개 선택]
       ↓
[튜토리얼 3스텝 (강제 진행)]
```

### 핵심 화면 목록 (MVP)

| 화면 ID | 화면명                     | 주요 컴포넌트 / 내용                                                          |
| ------- | -------------------------- | ------------------------------------------------------------------------------ |
| SCR-01  | 스플래시 / 로그인          | 로고 + 캐릭터 등장 애니메이션, 소셜 로그인 버튼 3종                            |
| SCR-02  | 온보딩 - 종목 선택         | 검색바, 종목 카드 그리드, 선택 카운터                                          |
| SCR-03  | 튜토리얼 (3스텝)           | 단계 인디케이터, 캐릭터 말풍선 가이드, 강조 오버레이                          |
| SCR-04  | 메인 대시보드 (사무실)     | 사원 도트 3명, 카드뉴스 리스트, AP 잔액, 적중률                                |
| SCR-05  | 카드뉴스 상세              | 헤드라인, 요점 3줄, 주식 용어 형광펜+정의 팝업, '사원에게 분석 의뢰' CTA       |
| SCR-06  | 브리핑 화면                | 사원 3탭(캐릭터 아이콘), 보고서 본문, 채택/방향/확신도 입력                    |
| SCR-07  | 결정 완료 / 대기           | 캐릭터 환호 애니메이션, '15:30 정산 예정' 안내                                 |
| SCR-08  | 결정 일기 - 캘린더         | 월 캘린더, 일자별 적중/오답 도장 표시                                          |
| SCR-09  | 결정 일기 - 리스트         | 일기 카드 리스트, 필터/정렬                                                    |
| SCR-10  | 결정 일기 - 카드 상세      | 공유 이미지 미리보기, 메모 입력                                                |
| SCR-11  | 통계 (My Stats)            | 적중률, 사원별/방향별/확신도별 차트                                            |
| SCR-12  | 사원 관리 (인사팀)         | 사원 3명 카드, Level/EXP 바, 일급 표시                                         |
| SCR-13  | 설정                       | 프로필, 종목 변경, 내 용어장, 로그아웃, 회원 탈퇴, 튜토리얼 다시 보기          |

### 일일 사용자 여정 (Core Loop)

```
출근(자동 출석)
   ↓
카드뉴스 확인 (선택 종목 최대 5개 × 최대 2개)
   ↓
사원 선택 (루키/프로/탱커 중 1~3명, 다중 선택 가능)
   ↓
브리핑 수령 (사원별 탭, 분석 중 → 완료 애니메이션)
   ↓
의사결정 (채택 사원 선택 → 방향 UP/DOWN/NEUTRAL + 확신도 1~5)
   ↓
15:30 장 마감 자동 정산 → AP 획득/차감 + 사원 EXP 증가
   ↓
결정 일기 자동 기록 (캘린더/리스트/통계 카드)
```

### 라우트 구조

- `AuthLayout`(비로그인) / `AppLayout`(로그인 가드 + 하단 탭) 두 레이아웃으로 구성
- 하단 탭: 홈 · 브리핑 · 팀 · 피드 · 마이 (모바일 우선, `max-w-md` 컨테이너)
