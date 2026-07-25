/**
 * 결정일기(Decision Diary) 도메인 타입
 * - SCR-08 캘린더 / SCR-09 리스트 / SCR-10 결정카드 상세 / 통계
 * - 서버 응답 → 도메인 변환은 utils/diaryMapper 에서 처리한다.
 */

/** 결정 방향 (상승 / 하락 / 관망) */
export type DiaryDirection = 'up' | 'down' | 'neutral'

/**
 * 캘린더 한 칸 — 날짜 + 그날 존재한 결정 방향.
 * ⚠️ 캘린더 점은 적중 여부가 아니라 **방향**을 나타낸다 (API가 direction 만 내려준다).
 */
export interface DiaryDayMark {
  /** YYYY-MM-DD */
  date: string
  /** 그날 1건 이상 존재한 방향 (없으면 빈 배열) */
  directions: DiaryDirection[]
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

  /**
   * 🔴 아래 4개는 목록 API 명세에 없어 현재 mock 이 채운다 (백엔드 추가 요청 중).
   * 값이 없으면 해당 줄을 렌더하지 않으므로 실제 응답이 와도 화면이 깨지지 않는다.
   */
  price?: number
  changeRate?: number
  /** YYYY-MM-DD */
  date?: string
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
 * ⚠️ 그래서 상세 응답의 아래 필드는 화면에서 쓰지 않는다 — 모두 PNG 안에 이미 그려져 있다:
 *   stock.stockId · stock.changeRate
 *   agent.agentId · agent.agentType · agent.nickname
 *   briefing.briefingId · briefing.direction · briefing.confidenceRate
 *   decision.isCorrect · decision.confidenceLevel
 * 상세 화면을 이미지 대신 조립형 UI 로 바꾸게 되면 이 값들이 필요해진다.
 */
export interface DiaryDetail {
  id: string
  /** 공유 이미지 URL. 생성 전이면 null → POST 로 생성 필요 */
  shareImageUrl: string | null
  /** 이미지 대체 텍스트에만 사용 */
  stockName: string
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
  hitRate: DiaryHitRate
  items: DiaryStatItem[]
  groups: DiaryRateGroup[]
}
