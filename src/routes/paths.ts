/**
 * 프로젝트 전체 라우팅 경로 상수
 * - 모든 페이지 이동 시 이 파일의 PATH를 사용하세요. (하드코딩 금지)
 * - 동적 경로는 id를 받는 함수로 정의합니다.
 */
export const PATH = {
  // ─── AuthLayout 영역 ───────────────────────────────────────────
  /** SCR-01: 스플래시 / 로그인 */
  SPLASH: '/splash',

  /** SCR-01a,b: 약관 동의 / 약관 상세 */
  AGREEMENT: '/agreement',
  AGREEMENT_DETAIL: '/agreement/detail',

  /** SCR-02: 온보딩 (닉네임/회사 설정 및 종목 선택) */
  ONBOARDING: '/onboarding',

  /** SCR-03: 튜토리얼 (3스텝 강제 진행) */
  TUTORIAL: '/tutorial',

  // ─── AppLayout - 홈 탭 ─────────────────────────────────────────
  /** 홈 탭: 메인 랜딩 */
  HOME: '/',

  /** 홈 탭 - SCR-17: 알림 */
  NOTIFICATION: '/notification',

  /** 홈 탭 - SCR-05: 카드뉴스 상세 (동적 라우트) */
  CARD_NEWS_DETAIL: (id: string) => `/card-news/${id}`,

  // ─── AppLayout - 사무실 탭 ─────────────────────────────────────
  /** 사무실 탭 - SCR-04: 메인 대시보드 */
  OFFICE: '/office',

  /** 사무실 탭 - SCR-07: AI 사원 보고서 리스트 (메인) */
  BRIEFING: '/briefing',

  /** 사무실 탭 - SCR-07-1: 브리핑 사원 배치 (분석 요청) */
  BRIEFING_ASSIGN: (cardId: string) => `/briefing/assign/${cardId}`,
  BRIEFING_ASSIGN_ROUTE: '/briefing/assign/:cardId',

  /** 사무실 탭 - SCR-07-2: 브리핑 도착 (완료/진행중) */
  BRIEFING_COMPLETE: (cardId: string) => `/briefing/complete/${cardId}`,
  BRIEFING_COMPLETE_ROUTE: '/briefing/complete/:cardId',

  /** 사무실 탭 - SCR-06: AI 사원 보고서 상세 */
  BRIEFING_DETAIL: (briefingId: string) => `/briefing/detail/${briefingId}`,
  BRIEFING_DETAIL_ROUTE: '/briefing/detail/:briefingId',

  // ─── AppLayout - 팀 탭 ─────────────────────────────────────────
  /** 팀 탭 - SCR-12: 사원 관리 인사팀 화면 */
  TEAM: '/team',

  /** 팀 탭 - SCR-12: 사원 상세 (동적 라우트) */
  TEAM_DETAIL: (agentId: string) => `/team/${agentId}`,
  TEAM_DETAIL_ROUTE: '/team/:agentId',

  // ─── AppLayout - 피드 탭 (결정 일기) ───────────────────────────
  /** 피드 탭 - SCR-08: 결정 일기 캘린더 뷰 */
  DIARY_CALENDAR: '/diary',

  /** 피드 탭 - SCR-09: 일기 리스트 필터 뷰 */
  DIARY_LIST: '/diary/list',

  /** 피드 탭 - SCR-10: 일기 상세 및 메모 입력 (동적 라우트) */
  DIARY_DETAIL: (id: string) => `/diary/${id}`,

  // ─── AppLayout - 마이 탭 ───────────────────────────────────────
  /** 마이 탭 - SCR-11, 13: 프로필, 설정, 용어장 및 My Stats 통계 차트 통합 */
  MY_PAGE: '/my',

  // ─── 에러 ──────────────────────────────────────────────────────
  /** 404 */
  NOT_FOUND: '*',
} as const
