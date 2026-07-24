import type {
  ConfidenceLevelCode,
  DiaryCalendarResult,
  DiaryDetailResult,
  DiaryListItemResponse,
  DiaryListResult,
  DiaryStatsResult,
  DirectionCode,
} from '@/types/api/diary'
import type {
  DiaryDayMark,
  DiaryDetail,
  DiaryDirection,
  DiaryEntry,
  DiaryEntryPage,
  DiaryHitRate,
  DiaryStatistics,
} from '@/types/domain/diary'

const DIRECTION_BY_CODE: Record<DirectionCode, DiaryDirection> = {
  UP: 'up',
  DOWN: 'down',
  NEUTRAL: 'neutral',
}

/** 방향 표시 라벨 */
export const DIRECTION_LABEL: Record<DiaryDirection, string> = {
  up: '상승',
  down: '하락',
  neutral: '관망',
}

/** 확신도 구간 라벨 (LOW = 1~2, MEDIUM = 3, HIGH = 4~5) */
export const CONFIDENCE_LEVEL_LABEL: Record<ConfidenceLevelCode, string> = {
  LOW: '낮음',
  MEDIUM: '보통',
  HIGH: '높음',
}

// ─── 캘린더 ────────────────────────────────────────────────────────────────

/**
 * 캘린더 응답 → 도메인 (점은 방향 기준: 상승 → 하락 → 관망 순서)
 *
 * 사용:   year · month · accuracyRate · settledDecisionCount · days[].date · days[].direction
 * 미사용: correctDecisionCount — 시안이 적중률(%)과 건수만 표시한다
 *
 * ⚠️ 시안 범례는 적중/오답/관망이지만 응답에 날짜별 적중 여부가 없어(월 합계만 존재)
 * 방향(상승/하락/관망) 기준으로 그린다. 백엔드에 날짜별 outcome 추가 요청 상태.
 */
export function mapDiaryCalendar(result: DiaryCalendarResult): {
  marks: DiaryDayMark[]
  hitRate: DiaryHitRate
} {
  const marks = result.days.map((day) => {
    const directions: DiaryDirection[] = []
    if (day.direction.up) directions.push('up')
    if (day.direction.down) directions.push('down')
    if (day.direction.neutral) directions.push('neutral')

    return { date: day.date, directions }
  })

  return {
    marks,
    hitRate: {
      rate: result.accuracyRate,
      totalCount: result.settledDecisionCount,
      periodLabel: `${result.year}.${String(result.month).padStart(2, '0')}`,
    },
  }
}

// ─── 목록 ──────────────────────────────────────────────────────────────────

/**
 * 목록 아이템 응답 → 도메인
 *
 * 사용:   diaryId · stock.name · decision.direction · decision.isCorrect · decision.apDelta
 * 미사용: stock.stockId — 종목 상세 연결이 생기면 쓸 수 있어 도메인에는 남겨둔다
 */
export function mapDiaryEntry(item: DiaryListItemResponse): DiaryEntry {
  return {
    id: item.diaryId,
    stockId: item.stock.stockId,
    stockName: item.stock.name,
    direction: DIRECTION_BY_CODE[item.decision.direction],
    isCorrect: item.decision.isCorrect,
    apDelta: item.decision.apDelta,
    // 🔴 명세 외 필드 — 현재 mock 이 채운다
    price: item.price,
    changeRate: item.changeRate,
    date: item.tradeDate,
    logoUrl: item.logoUrl,
  }
}

/** 목록 페이지 응답 → 도메인 */
export function mapDiaryEntryPage(result: DiaryListResult): DiaryEntryPage {
  return {
    entries: result.page.items.map(mapDiaryEntry),
    nextCursor: result.page.nextCursor,
    hasNext: result.page.hasNext,
  }
}

// ─── 상세 ──────────────────────────────────────────────────────────────────

/**
 * 상세 응답 → 도메인
 *
 * 사용:   diaryId · shareImageUrl · stock.name(이미지 alt)
 * 미사용: stock.stockId · stock.changeRate · agent.* · briefing.* · decision.*
 *         → 카드 내용을 서버가 PNG 로 렌더링하므로 화면이 직접 그릴 값이 없다.
 *           상세를 조립형 UI 로 바꾸면 그때 매핑을 되살린다.
 */
export function mapDiaryDetail(result: DiaryDetailResult): DiaryDetail {
  return {
    id: result.diaryId,
    shareImageUrl: result.shareImageUrl,
    stockName: result.stock.name,
  }
}

// ─── 통계 ──────────────────────────────────────────────────────────────────

/**
 * 통계 응답 → 도메인
 *
 * 사용:   summary.recent30DaysAccuracyRate · recent30DaysSettledDecisionCount
 *         summary.settledDecisionCount · correctDecisionCount · averageConfidenceLevel · bestCorrectStreak
 *         directionStats[].direction · agentStats[].nickname · confidenceLevelStats[].level
 *         stockStats[].name · 각 배열의 accuracyRate
 * 미사용: summary.recent30DaysCorrectDecisionCount — 최근 30일은 적중률(%)과 모수만 표시한다
 *         각 배열의 settledDecisionCount · correctDecisionCount — 행이 라벨·바·% 만 보여준다
 *         agentStats[].agentId · agentStats[].agentType · stockStats[].stockId — 화면에 연결 대상이 없다
 */
export function mapDiaryStatistics(result: DiaryStatsResult): DiaryStatistics {
  const { summary } = result
  const subtitle = `최근 30일 · 결정 ${summary.recent30DaysSettledDecisionCount}건`

  return {
    hitRate: {
      rate: summary.recent30DaysAccuracyRate,
      totalCount: summary.recent30DaysSettledDecisionCount,
      periodLabel: '최근 30일',
    },
    items: [
      {
        id: 'settled',
        value: summary.settledDecisionCount.toLocaleString(),
        unit: '건',
        label: '누적결정',
      },
      {
        id: 'correct',
        value: summary.correctDecisionCount.toLocaleString(),
        unit: '건',
        label: '적중',
      },
      {
        id: 'avg-confidence',
        value: summary.averageConfidenceLevel.toFixed(1),
        label: '평균확신도',
      },
      {
        id: 'best-streak',
        value: summary.bestCorrectStreak.toLocaleString(),
        unit: '회',
        label: '최고 연속 적중',
      },
    ],
    groups: [
      {
        id: 'direction',
        title: '방향별 적중률',
        subtitle,
        rows: result.directionStats.map((stat) => ({
          label: DIRECTION_LABEL[DIRECTION_BY_CODE[stat.direction]],
          value: stat.accuracyRate,
        })),
      },
      {
        id: 'agent',
        title: '사원별 채택 적중률',
        subtitle,
        rows: result.agentStats.map((stat) => ({
          label: stat.nickname,
          value: stat.accuracyRate,
        })),
      },
      {
        id: 'confidence',
        title: '확신도별 적중률',
        subtitle,
        rows: result.confidenceLevelStats.map((stat) => ({
          label: CONFIDENCE_LEVEL_LABEL[stat.level],
          value: stat.accuracyRate,
        })),
      },
      {
        id: 'stock',
        title: '종목별 적중률',
        subtitle,
        rows: result.stockStats.map((stat) => ({
          label: stat.name,
          value: stat.accuracyRate,
        })),
      },
    ],
  }
}
