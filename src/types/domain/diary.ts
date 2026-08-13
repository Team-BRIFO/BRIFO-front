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
 * 카드 내용(종목·칩·AP·별·인용문·날짜)은 **서버가 PNG로 렌더링**하므로,
 * 화면은 shareImageUrl 을 표시하기만 한다.
 *
 * 화면의 카카오톡 공유 문구에는 예측 방향·적중 여부를 쓴다.
 * 나머지 카드 내용은 서버 PNG 안에 이미 그려져 있다.
 */
export interface DiaryDetail {
  id: string
  /** 공유 이미지 URL. 생성 전이면 null → POST 로 생성 필요 */
  shareImageUrl: string | null
  /** 이미지 대체 텍스트에만 사용 */
  stockName: string
  /** 사용자의 예측 방향 (카카오톡 공유 문구용) */
  direction: DiaryDirection
  /** 예측 적중 여부 (카카오톡 공유 문구용) */
  isCorrect: boolean
}

export interface DiaryShareImage {
  diaryId: string
  shareImageUrl: string
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
