# BRIFO Frontend

> **B**riefing **R**oom for **I**nvestment & **F**inancial **O**perations
>
> "모든 투자 결정은 브리포에서 시작된다"

BRIFO는 사용자가 투자 회사의 **사장(CEO)** 이 되어 개성 있는 AI 사원 3명(루키·프로·탱커)을 고용하고, 이들의 분석 보고서를 바탕으로 투자 의사결정을 내리는 **게이미피케이션 기반 AI 투자 교육 플랫폼**입니다.

## 📖 프로젝트 소개

| 항목        | 내용                                                                      |
| ----------- | ------------------------------------------------------------------------- |
| 한 줄 정의  | "나는 사장, AI는 사원. 우리 팀이 분석하고, 내가 결정한다."                |
| 분류        | 게이미피케이션 기반 AI 투자 교육 플랫폼                                   |
| 핵심 컨셉   | 사장(CEO)이 된 사용자가 AI 사원 3명을 고용하고, 분석 보고서로 투자를 결정 |
| 타겟 사용자 | 2030 주식 입문자~중급(1차), 투자 교육에 관심 있는 대학생/사회초년생(2차)  |
| 개발 기간   | 2026.06.22 ~ 2026.08.21 (약 9주)                                          |

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

| 분류            | 기술                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 코어            | `React 19`, `TypeScript`, `Vite`, `pnpm`                                                                                        |
| 스타일링        | `TailwindCSS v4`(`@tailwindcss/vite`), 디자인 토큰(BERIFO 디자인 시스템), `Radix UI`(Dialog/Select/Tabs/Slider), `lucide-react` |
| 서버 상태       | `TanStack Query (React Query) v5`                                                                                               |
| 클라이언트 상태 | `Zustand v5`                                                                                                                    |
| 라우팅          | `React Router DOM v7`                                                                                                           |
| 폼 / 검증       | `React Hook Form` + `Zod`                                                                                                       |
| HTTP            | `Axios` (인터셉터로 JWT 주입 / 401 처리)                                                                                        |
| 애니메이션      | `Framer Motion`                                                                                                                 |
| 차트            | `Recharts`                                                                                                                      |
| 린트 / 포맷     | `ESLint 9`(flat config) + `typescript-eslint`, `Prettier`                                                                       |

---

## 📁 폴더 구조

```
src/
├── main.tsx              # React root 렌더링 진입점
├── App.tsx               # 전역 Provider와 Router 연결
├── assets/               # 아이콘, 캐릭터 등 정적 에셋
│   ├── characters/
│   └── icons/
├── routes/               # React Router route tree와 path 상수
├── providers/            # QueryClientProvider 등 전역 Provider
├── components/
│   ├── common/           # 순수 공용 UI 컴포넌트
│   ├── domain/           # 도메인 데이터를 표현하는 재사용 컴포넌트
│   └── feature/          # 화면 일부 기능을 조합하는 컴포넌트
├── pages/                # 라우트 단위 화면
│   ├── HomePage/
│   │   ├── HomePage.tsx
│   │   ├── useHomePageData.ts
│   │   └── index.ts
│   ├── CardNewsDetailPage/
│   │   ├── CardNewsDetailPage.tsx
│   │   ├── useCardNewsDetailPageData.ts
│   │   └── index.ts
│   ├── DecisionPage/
│   │   ├── DecisionPage.tsx
│   │   ├── useDecisionPageData.ts
│   │   └── index.ts
│   └── DiaryPage/
│       ├── DiaryPage.tsx
│       ├── useDiaryPageData.ts
│       └── index.ts
├── hooks/
│   ├── queries/          # 전역 재사용 query hook
│   ├── mutations/        # 전역 재사용 mutation hook
│   └── ui/               # 서버와 무관한 UI hook
├── services/
│   └── api/              # axios client와 API 함수 레이어
├── stores/               # Zustand 전역 client state
├── types/
│   ├── domain/           # 프론트 도메인 타입
│   └── api/              # API 요청/응답 타입
├── utils/                # 순수 유틸 함수
└── styles/               # 디자인 토큰과 전역 스타일
```

- **Import 경로**: 항상 `@/` alias 사용 (상대경로 `../../` 지양)

```typescript
import { Button } from '@/components/common/Button'
import type { Agent } from '@/types/domain/agent'
```

- `components/common`: API 호출, store 접근, routing 의존성이 없는 순수 공용 UI
- `components/domain`: 도메인 데이터를 props로 받아 표현하는 재사용 컴포넌트
- `components/feature`: common/domain 컴포넌트를 조합하는 화면 일부 기능 컴포넌트
- `pages`: routing, query/mutation 연결, store 연결, loading/error 처리, feature 조립 담당
- `pages/*/use<Page>Data.ts`: 특정 page에만 쓰이는 데이터 조합 hook
- `hooks/queries`, `hooks/mutations`, `hooks/ui`: 전역 재사용 가능한 hook
- `services/api`: axios client와 도메인별 API 함수 레이어

---

## 🌿 브랜치 컨벤션

- **전략**: Git Flow (`main` 배포용 / `dev` 개발 통합용 / `feat` 등 기능 단위 작업 브랜치)
- `main`: 실제 배포 CI/CD용 (보호, 직접 push 금지)
- `dev`: 개발 통합 CI/CD용
- `feat` 브랜치는 반드시 `dev`에서 분기하여 `dev`로 머지
- **브랜치명**: `{이슈종류}/{이슈번호}-{기능명}`
  예) `feat/12-login-page`, `fix/30-briefing-tab`

### Issue 종류

| 종류       | 의미                                |
| ---------- | ----------------------------------- |
| `chore`    | 배포 또는 프로젝트 기본 세팅        |
| `feat`     | 기능 구현                           |
| `fix`      | 버그 수정                           |
| `refactor` | 코드 리팩토링                       |
| `style`    | 스타일/마크업 변경 (로직 변화 없음) |
| `docs`     | 문서 추가                           |

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

카카오/네이버 소셜 로그인 버튼 UI 추가
OAuth redirect URL 연결
```

| type       | 예시                            |
| ---------- | ------------------------------- |
| `feat`     | `feat: 사원 카드 컴포넌트 추가` |
| `fix`      | `fix: 브리핑 탭 전환 오류 수정` |
| `refactor` | `refactor: API 레이어 분리`     |
| `style`    | `style: 홈 대시보드 간격 조정`  |
| `docs`     | `docs: README 작성`             |

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
  - `VITE_NAVER_CLIENT_ID` — 네이버 소셜 로그인

---

## 🖥 화면 목록 및 플로우

> 화면 정의의 기준은 **MVP 기능명세서 8.5**입니다. 아래는 프론트 작업 단위로 추린 요약이며, 상세 스펙은 명세서를 따릅니다.

### 온보딩 플로우

```text
[스플래시] → [소셜 로그인 (카카오 / 네이버)]
       ↓
[약관 동의 (필수 4 + 선택 1)]
       ↓
[닉네임 + 회사명 입력 (🎲 랜덤 추천)]
       ↓
[관심 종목 1~3개 선택]
       ↓
[튜토리얼 3스텝 (강제 진행)]
```

### 핵심 화면 목록 (MVP)

| 화면 ID | 화면명                    | 주요 컴포넌트 / 내용                                                                                       |
| ------- | ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| SCR-01  | 스플래시 / 로그인         | 로고 + 캐릭터 등장 애니메이션, 소셜 로그인 버튼 2종(카카오·네이버)                                         |
| SCR-01a | 약관 동의                 | 전체 동의 + 필수 4 / 선택 1 체크, 항목별 "보기 >", 만 14세 확인                                            |
| SCR-01b | 약관 상세                 | 이용약관 / 개인정보 / 투자 유의사항 전문 스크롤                                                            |
| SCR-01c | 프로필 입력               | 닉네임, 회사명 + 🎲 주사위 랜덤 버튼                                                                       |
| SCR-02  | 온보딩 - 종목 선택        | 검색바, 종목 카드 그리드, 선택 카운터 `n/3`                                                                |
| SCR-03  | 튜토리얼 (3스텝)          | 단계 인디케이터, 캐릭터 말풍선 가이드, 강조 오버레이                                                       |
| SCR-04  | 홈 (메인 대시보드)        | 사원 도트 3명, **종목별 그룹 카드**(대표 헤드라인 · 카드뉴스 N건 · 의뢰 상태칩), AP 잔액, 오늘의 예측 배너 |
| SCR-05  | 종목 카드뉴스 (슬라이드)  | 종목 헤더(현재가·지연), 카드뉴스 가로 캐러셀, 용어 형광펜 + 정의 팝업, '사원에게 분석 의뢰' CTA            |
| SCR-05a | 사원 배치 · 의뢰 (Deploy) | 사원 3명 카드(성향·의뢰비), 1~3명 다중 선택, 의뢰비 합계 / 의뢰 후 잔액, 잔액 부족 시 CTA 비활성           |
| SCR-06  | 브리핑 상세               | 사원 3탭, 보고서 본문, 개인화 코멘트, 현재가 헤더, '이 브리핑으로 결정하기'                                |
| SCR-06a | 확신도 입력               | 캐릭터 표정 강도 슬라이더 + 5단계 라벨, 근거 메모                                                          |
| SCR-07  | 결정 완료 / 대기          | 캐릭터 환호 애니메이션, '15:30 정산 예정' 안내                                                             |
| SCR-07a | 오늘의 예측 현황          | 정산 대기 리스트(종목·사원·방향·확신·지연 등락), 읽기 전용                                                 |
| SCR-08  | 결정 일기 - 캘린더        | 월 캘린더, 셀 하단 결과 유형별 점(적중·오답·관망), 셀 탭 시 바텀시트                                       |
| SCR-09  | 결정 일기 - 리스트        | 일기 카드 리스트, 필터 / 정렬                                                                              |
| SCR-10  | 결정 일기 - 카드 상세     | 사원 의견 vs 실제 대비, 확정 변동률, 공유 이미지 미리보기, 메모                                            |
| SCR-11  | 통계 (My Stats)           | 적중률, 사원별 / 방향별 / 확신도별 차트                                                                    |
| SCR-12  | 사무실 (Office)           | 픽셀 오피스 씬(typing `…` / ready `❗`), 분석 큐(종목 병렬 · 사원별 색 분할 진행바), 빈 상태               |
| SCR-12a | 사원 상세                 | 성향 · 모델 · Level/EXP · 적중률 · 의뢰비                                                                  |
| SCR-12c | 사원 목록                 | 사원 3명 카드(Level/EXP 바, 적중률, 의뢰비) → 사원 상세                                                    |
| SCR-13  | 마이 / 설정               | 프로필 카드(루키 아바타 고정), 보유 AP, 프로필 편집, 내 용어장, 약관, 로그아웃, 탈퇴                       |
| SCR-14  | 업적 & 뱃지               | 12종 뱃지 도감(획득 = 컬러 / 미획득 = 실루엣), `n/12`, 획득 모달                                           |
| SCR-15  | AP 내역                   | AP 입출금 원장 리스트(사유 · 부호 · 시각)                                                                  |
| SCR-16  | 내 용어장                 | 학습한 용어 카드 리스트, 학습 개수 요약                                                                    |
| SCR-17  | 인앱 알림함               | 전체 / 정산 / 사원 / 시스템 탭, 안 읽음 배지, 빈 상태 (인앱 전용)                                          |

**주요 모달**: 분석 의뢰 완료("분석을 의뢰했어요!") · 예측 등록 완료 · 정산 적중 / 오답 · AP 부족(2단계) · 뱃지 획득 · 용어 정의 팝업 · 출석 체크
→ **모든 모달은 캐릭터 인터랙션(액션 + 말풍선)을 포함합니다.**

### 일일 사용자 여정 (Core Loop)

```text
출근(자동 출석 · +50 AP)
   ↓
홈에서 내 종목 소식 확인 (관심 종목 1~3개 × 카드뉴스 최대 2건)
   ↓
종목 카드뉴스 슬라이드 → 사원 선택 (루키/프로/탱커 중 1~3명)
   ↓
분석 의뢰 (의뢰비 선지급 · 종목당 하루 1회) → 사무실에서 진행 상황 확인
   ↓
브리핑 열람 → 의사결정 (채택 사원 → 방향 UP/DOWN/NEUTRAL + 확신도 1~5)
   ↓
15:30 장 마감 자동 정산 → AP 획득/차감 + 채택 사원 EXP 증가
   ↓
결정 일기 자동 기록 (캘린더 / 리스트 / 통계)
```

- **분석 단위는 종목**입니다. 카드뉴스 1건이 아니라 **종목 1개 × 거래일 1일 = 분석 1건**이며, 사원은 그 종목의 오늘 카드뉴스를 모두 읽고 보고서 1개를 씁니다.
- AP는 **의뢰 시점에 선지급**됩니다. 잔액이 의뢰비 합계보다 적으면 의뢰가 불가합니다.

### 라우트 구조

- `AuthLayout`(비로그인) / `AppLayout`(로그인 가드 + 하단 탭) 두 레이아웃으로 구성
- 하단 탭 5종: **사원 · 사무실 · 홈 · 일기 · 마이** (홈이 가운데, 모바일 우선 `max-w-md` 컨테이너)
- 브리핑은 별도 탭이 없습니다. **사무실의 분석 큐에서 완료된 종목을 탭하면 브리핑 상세로** 들어갑니다.
- 상세 화면(브리핑 상세 · 사원 상세 · 설정 등)은 하단 탭을 숨기고 백 버튼만 둡니다.
