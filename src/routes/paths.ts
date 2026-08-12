/**
 * 프로젝트 전체 라우팅 경로 상수
 * - 모든 페이지 이동 시 이 파일의 PATH를 사용하세요. (하드코딩 금지)
 * - 동적 경로는 id를 받는 함수로 정의합니다.
 */
export const PATH = {
  // ─── AuthLayout 영역 ───────────────────────────────────────────
  /** SCR-01: 스플래시 / 로그인 */
  SPLASH: '/splash',

  /** 소셜 로그인 OAuth callback */
  AUTH_CALLBACK: '/auth/callback/:provider',
  AUTH_CALLBACK_FOR: (provider: 'kakao' | 'naver') => `/auth/callback/${provider}`,

  /** SCR-01a,b: 약관 동의 / 약관 상세 */
  AGREEMENT: '/agreement',
  AGREEMENT_DETAIL: '/agreement/detail',

  /** SCR-02: 온보딩 (닉네임/회사 설정 및 종목 선택) */
  ONBOARDING: '/onboarding',

  /** SCR-03: 튜토리얼 (3스텝 강제 진행) */
  TUTORIAL_INTRO: '/tutorial/intro',
  TUTORIAL: '/tutorial',
  /** 설정에서 다시 보는 튜토리얼 — 보상·온보딩 완료 API를 호출하지 않는다. */
  TUTORIAL_REPLAY_INTRO: '/tutorial/replay',
  TUTORIAL_REPLAY: '/tutorial/replay/steps',

  // ─── AppLayout - 홈 탭 ─────────────────────────────────────────
  /** 홈 탭: 메인 랜딩 */
  HOME: '/',

  /** 홈 탭 - SCR-17: 알림 */
  NOTIFICATION: '/notification',

  /** 홈 - SCR-05: 카드뉴스 상세 (동적 라우팅) */
  CARD_NEWS_DETAIL: (stockId: string) => `/card-news/${stockId}`,
  CARD_NEWS_DETAIL_ROUTE: '/card-news/:stockId',

  // ─── AppLayout - 사무실 탭 ─────────────────────────────────────
  /** 사무실 탭 - SCR-04: 메인 대시보드 */
  OFFICE: '/office',

  /** 사무실 탭 - 오늘의 예측 리스트 */
  OFFICE_PREDICTION: '/office/predictions',

  /** 사무실 탭 - SCR-07: AI 사원 보고서 리스트 (메인) */
  BRIEFING: '/briefing',

  /** 사무실 - SCR-07: 특정 종목의 브리핑 리스트로 이동 */
  BRIEFING_FOR_STOCK: (stockId: string) => `/briefing?stockId=${stockId}`,

  /** 사무실 - SCR-07: 사원 배치 */
  BRIEFING_ASSIGN: (stockId: string) => `/briefing/assign/${stockId}`,
  BRIEFING_ASSIGN_ROUTE: '/briefing/assign/:stockId',

  /** 사무실 - SCR-07-3: 브리핑 상세 (Decision) */
  BRIEFING_DETAIL: (briefingId: string) => `/briefing/detail/${briefingId}`,
  BRIEFING_DETAIL_ROUTE: '/briefing/detail/:briefingId',

  // ─── AppLayout - 팀  탭 ─────────────────────────────────────────
  /** 팀 탭 - SCR-12: 사원 관리 인사팀 화면 */
  TEAM: '/team',

  /** 팀 탭 - SCR-12: 사원 상세 (동적 라우트) */
  TEAM_DETAIL: (agentId: string) => `/team/${agentId}`,
  TEAM_DETAIL_ROUTE: '/team/:agentId',

  // ─── AppLayout - 피드 탭 (결정 일기) ───────────────────────────
  /**
   * 피드 탭 - SCR-08~10: 결정 일기 (캘린더 · 리스트 · 통계)
   * 세 뷰는 한 페이지에서 탭으로 전환하며, 선택된 탭은 `?view=list|statistics` 로 남는다.
   */
  DIARY: '/diary',

  /** 피드 탭 - SCR-10: 결정 카드 상세 (동적 라우트) */
  DIARY_DETAIL: (id: string) => `/diary/${id}`,
  DIARY_DETAIL_ROUTE: '/diary/:id',

  // ─── AppLayout - 마이 탭 ───────────────────────────────────────
  /** 마이 탭 - SCR-11, 13: 프로필, 설정, 용어장 및 My Stats 통계 차트 통합 */
  MY_PAGE: '/my',
  /** 마이 탭 - SCR-15: AP 내역 */
  MY_AP: '/my/ap',
  /** 마이 탭 - SCR-14: 업적 · 배지 */
  MY_BADGES: '/my/badges',
  /** 마이 탭 - SCR-16: 내 용어장 */
  MY_GLOSSARY: '/my/glossary',
  /** 마이 탭 - SCR-13: 프로필 편집 */
  MY_EDIT: '/my/edit',
  /** 마이 탭 - SCR-13: 설정 */
  MY_SETTINGS: '/my/settings',
  /** 마이 탭 - 설정 공지사항 */
  MY_NOTICES: '/my/notices',
  /** 마이 탭 - 설정 약관 및 정책 (읽기 전용) */
  MY_TERMS: '/my/terms',
  MY_TERMS_DETAIL: (policyId: string) => `/my/terms/${policyId}`,
  MY_TERMS_DETAIL_ROUTE: '/my/terms/:policyId',
  /** 마이 탭 - 관심종목 변경 */
  MY_EDIT_STOCKS: '/my/edit/stocks',
} as const
