/**
 * 프로젝트 전체 라우팅 경로 상수
 * - 모든 페이지 이동 시 이 파일의 PATH를 사용하세요. (하드코딩 금지)
 * - 동적 경로는 id를 받는 함수로 정의합니다.
 */
export const PATH = {
  /** 홈 (카드뉴스 목록) */
  HOME: '/',

  /** 결정 페이지 */
  DECISION: '/decision',

  /** 결정 일기 목록 페이지 */
  DIARY: '/diary',

  /** 카드뉴스 상세 페이지 (동적 라우트) */
  CARD_NEWS_DETAIL: (id: string) => `/card-news/${id}`,

  /** 404 페이지 */
  NOT_FOUND: '*',
} as const
