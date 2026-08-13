/**
 * 결정일기(Decision Diary) 도메인 타입
 * - SCR-08 캘린더 / SCR-09 리스트 / SCR-10 결정카드 상세 / 통계
 * - 서버 응답 → 도메인 변환은 mappers/diaryMapper 에서 처리한다.
 */

/** 결정 방향 (상승 / 하락 / 관망) */
export type DiaryDirection = 'up' | 'down' | 'neutral'

/** 캘린더 날짜별 정산 결과 */
export type DiaryCalendarOutcome = 'win' | 'loss' | 'neutral'

/** 캘린더 한 칸 — 날짜 + 그날 존재한 정산 결과 */
export interface DiaryDayMark {
  /** YYYY-MM-DD */
  date: string
  /** 그날 1건 이상 존재한 결과 (없으면 빈 배열) */
  outcomes: DiaryCalendarOutcome[]
}

/** 적중률 요약 (캘린더 하단 · 통계 상단) */
export interface DiaryHitRate {
  /** 적중률 (0~100, %) */
  rate: number
  /** 집계 대상 결정 건수 */
  totalCount: number
  /** 집계 범위 설명 (예: '최근 30일', '2026.07') */
  periodLabel: string
}

/** 리스트 카드 1건 */
export interface DiaryEntry {
  id: string
  /** 종목 공개 ID. 현재 화면에 쓰이지 않지만 종목 상세 연결 시 필요해 유지 */
  stockId: string
  /** 종목명 */
  stockName: string
  direction: DiaryDirection
  /** 적중 여부 */
  isCorrect: boolean
  /** AP 증감 (획득 양수 / 차감 음수 / 변동 없으면 0) */
  apDelta: number

  price: number
  changeRate: number
  /** YYYY-MM-DD */
  date: string
  logoUrl?: string
}

/** 리스트 한 페이지 (커서 페이지네이션) */
export interface DiaryEntryPage {
  entries: DiaryEntry[]
  nextCursor: string | null
  hasNext: boolean
}

/**
 * 결정카드 상세.
 *
 * 카드 내용은 상세 응답과 공유 이미지 POST 응답을 조합해 프론트에서 렌더링한다.
 * `tradeDate`와 `apDelta`는 공유 이미지 POST 응답에서 받는다.
 */
export interface DiaryDetail {
  id: string
  /** 서버가 기존 호환을 위해 제공하는 공유 이미지 URL. 프론트 공유 카드에는 사용하지 않는다. */
  shareImageUrl: string | null
  stockName: string
  changeRate: number
  direction: DiaryDirection
  isCorrect: boolean
  agentType: 'rookie' | 'pro' | 'tanker'
  confidenceLevel: number
}

export interface DiaryShareImage {
  diaryId: string
  /** 서버 렌더 PNG URL. 프론트 카드 전환 기간에만 호환 목적으로 유지한다. */
  shareImageUrl: string
  /** YYYY-MM-DD */
  tradeDate: string
  /** API 명세 반영 전 응답은 null로 처리해 잘못된 AP를 카드에 그리지 않는다. */
  apDelta: number | null
}

export interface DiaryCalendarData {
  marks: DiaryDayMark[]
  hitRate: DiaryHitRate
}

/** 통계 상단 요약 타일 1개 */
export interface DiaryStatItem {
  id: string
  /** 표시할 값 (예: '87', '3.6') */
  value: string
  /** 값 뒤 단위 (예: '건', '회'). 없으면 생략 */
  unit?: string
  label: string
}

/**
 * 프로그레스 카드의 한 행.
 * 시안이 라벨·바·퍼센트만 표시하므로 응답의 settledDecisionCount·correctDecisionCount 는 쓰지 않는다.
 */
export interface DiaryRateRow {
  label: string
  /** 적중률 (0~100, %) */
  value: number
}

/** 프로그레스 카드 1개 (그룹 기준은 데이터가 정한다) */
export interface DiaryRateGroup {
  id: string
  title: string
  subtitle: string
  rows: DiaryRateRow[]
}

/** 통계 화면 전체 */
export interface DiaryStatistics {
  isEmpty: boolean
  /** 누적 결정 기준 적중률 (카카오톡 공유 문구용) */
  cumulativeHitRate: number
  hitRate: DiaryHitRate
  items: DiaryStatItem[]
  groups: DiaryRateGroup[]
}
