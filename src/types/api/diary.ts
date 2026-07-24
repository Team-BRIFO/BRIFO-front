import type { ApiResponse } from './common'

/**
 * 결정일기 API 타입 (백엔드 명세 기준)
 * - GET  /api/diaries/calendar?year&month
 * - GET  /api/diaries?cursor&size
 * - GET  /api/diaries/{diaryId}
 * - POST /api/diaries/{diaryId}/share-images
 * - GET  /api/diaries/stats
 */

export type DirectionCode = 'UP' | 'DOWN' | 'NEUTRAL'
export type AgentTypeCode = 'ROOKIE' | 'PRO' | 'TANKER'
/** 확신도 구간 (LOW = 1~2, MEDIUM = 3, HIGH = 4~5) */
export type ConfidenceLevelCode = 'LOW' | 'MEDIUM' | 'HIGH'

// ─── 캘린더 ────────────────────────────────────────────────────────────────

/** 날짜별 결정 방향 존재 여부 (같은 방향 결정이 1건 이상이면 true) */
export interface DiaryCalendarDirectionResponse {
  up: boolean
  down: boolean
  neutral: boolean
}

export interface DiaryCalendarDayResponse {
  /** YYYY-MM-DD */
  date: string
  direction: DiaryCalendarDirectionResponse
}

export interface DiaryCalendarResult {
  year: number
  month: number
  /** 월 정산 완료 결정 수 */
  settledDecisionCount: number
  /** 월 적중 결정 수 */
  correctDecisionCount: number
  /** 월 적중률 (0~100 정수) */
  accuracyRate: number
  /** 정산 완료 결정이 있는 날짜만 포함 */
  days: DiaryCalendarDayResponse[]
}

export type DiaryCalendarApiResponse = ApiResponse<DiaryCalendarResult>

// ─── 목록 (커서 페이지네이션) ──────────────────────────────────────────────

export interface DiaryStockSummaryResponse {
  stockId: string
  name: string
}

export interface DiaryListDecisionResponse {
  direction: DirectionCode
  /** 획득이면 양수, 차감이면 음수, 변동 없으면 0 */
  apDelta: number
  isCorrect: boolean
}

export interface DiaryListItemResponse {
  diaryId: string
  stock: DiaryStockSummaryResponse
  decision: DiaryListDecisionResponse

  /**
   * 🔴 아래 3개는 **현재 API 명세에 없다.** 시안 카드가 주가·등락률·거래일을 표시해서
   * 백엔드에 추가 요청을 넣어둔 상태이며, 그때까지 mock 이 채운다.
   * 응답에 실제로 추가되면 optional 표시만 떼면 된다.
   */
  price?: number
  changeRate?: number
  /** YYYY-MM-DD */
  tradeDate?: string
  /** 🔴 종목 로고 URL. 명세에 없어 mock 이미지를 쓴다 */
  logoUrl?: string
}

export interface DiaryListResult {
  page: {
    items: DiaryListItemResponse[]
    /** 마지막 항목의 diaryId. 다음 데이터가 없으면 null */
    nextCursor: string | null
    hasNext: boolean
  }
}

export type DiaryListApiResponse = ApiResponse<DiaryListResult>

// ─── 상세 ──────────────────────────────────────────────────────────────────

export interface DiaryDetailStockResponse extends DiaryStockSummaryResponse {
  /** 정답 판정에 사용된 등락률 (소수점 한 자리) */
  changeRate: number
}

export interface DiaryDetailAgentResponse {
  agentId: string
  agentType: AgentTypeCode
  nickname: string
}

export interface DiaryDetailBriefingResponse {
  briefingId: string
  /** AI 예측 방향 */
  direction: DirectionCode
  /** AI 브리핑 확신 비율 (0~100 정수) */
  confidenceRate: number
}

export interface DiaryDetailDecisionResponse {
  isCorrect: boolean
  /** 사용자 확신도 단계 (1~5) */
  confidenceLevel: number
}

export interface DiaryDetailResult {
  diaryId: string
  /** 공유 이미지 URL. 생성 전이면 null */
  shareImageUrl: string | null
  stock: DiaryDetailStockResponse
  agent: DiaryDetailAgentResponse
  briefing: DiaryDetailBriefingResponse
  decision: DiaryDetailDecisionResponse
}

export type DiaryDetailApiResponse = ApiResponse<DiaryDetailResult>

// ─── 공유 이미지 생성 ──────────────────────────────────────────────────────

export interface DiaryShareImageResult {
  diaryId: string
  shareImageUrl: string
  /** 기존 생성 이미지를 재사용했는지 여부 */
  reused: boolean
}

export type DiaryShareImageApiResponse = ApiResponse<DiaryShareImageResult>

// ─── 통계 ──────────────────────────────────────────────────────────────────

export interface DiaryStatsSummaryResponse {
  recent30DaysSettledDecisionCount: number
  recent30DaysCorrectDecisionCount: number
  recent30DaysAccuracyRate: number
  settledDecisionCount: number
  correctDecisionCount: number
  /** 확신도 단계 평균 (소수점 한 자리) */
  averageConfidenceLevel: number
  /** 최고 연속 정답 수 */
  bestCorrectStreak: number
}

/** 모든 통계 행이 공유하는 집계 필드 */
interface DiaryStatRateResponse {
  settledDecisionCount: number
  correctDecisionCount: number
  /** 0~100 정수 */
  accuracyRate: number
}

export interface DiaryDirectionStatResponse extends DiaryStatRateResponse {
  direction: DirectionCode
}

export interface DiaryAgentStatResponse extends DiaryStatRateResponse {
  agentId: string
  agentType: AgentTypeCode
  nickname: string
}

export interface DiaryConfidenceStatResponse extends DiaryStatRateResponse {
  level: ConfidenceLevelCode
}

export interface DiaryStockStatResponse extends DiaryStatRateResponse {
  stockId: string
  name: string
}

export interface DiaryStatsResult {
  summary: DiaryStatsSummaryResponse
  directionStats: DiaryDirectionStatResponse[]
  agentStats: DiaryAgentStatResponse[]
  confidenceLevelStats: DiaryConfidenceStatResponse[]
  /** 적중률 상위 3개 */
  stockStats: DiaryStockStatResponse[]
}

export type DiaryStatsApiResponse = ApiResponse<DiaryStatsResult>
