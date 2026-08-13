import type {
  CreateDiaryShareImageResponseOutput,
  GetDiariesResponseOutput,
  GetDiaryCalendarResponseOutput,
  GetDiaryDetailResponseOutput,
  GetDiaryStatsResponseOutput,
} from '@/api/generated/schemas/diary-controller'
import type {
  DiaryCalendarData,
  DiaryCalendarOutcome,
  DiaryDetail,
  DiaryDirection,
  DiaryEntry,
  DiaryEntryPage,
  DiaryShareImage,
  DiaryStatistics,
} from '@/types/domain/diary'

const DIRECTION_BY_CODE: Record<'UP' | 'DOWN' | 'NEUTRAL', DiaryDirection> = {
  UP: 'up',
  DOWN: 'down',
  NEUTRAL: 'neutral',
}

const AGENT_TYPE_BY_CODE = {
  ROOKIE: 'rookie',
  PRO: 'pro',
  TANKER: 'tanker',
} as const

/** 방향 표시 라벨 */
export const DIRECTION_LABEL: Record<DiaryDirection, string> = {
  up: '상승',
  down: '하락',
  neutral: '관망',
}

/** 확신도 구간 라벨 (LOW = 1~2, MEDIUM = 3, HIGH = 4~5) */
export const CONFIDENCE_LEVEL_LABEL: Record<'LOW' | 'MEDIUM' | 'HIGH', string> = {
  LOW: '낮음',
  MEDIUM: '보통',
  HIGH: '높음',
}

// ─── 캘린더 ────────────────────────────────────────────────────────────────

/**
 * 캘린더 응답 → 도메인 (점은 결과 기준: 적중 → 오답 → 관망 순서)
 *
 * 사용:   year · month · accuracyRate · settledDecisionCount · days[].date · days[].outcome
 * 미사용: correctDecisionCount — 시안이 적중률(%)과 건수만 표시한다
 *
 */
export function mapDiaryCalendar(result: GetDiaryCalendarResponseOutput): DiaryCalendarData {
  const marks = result.days.map((day) => {
    const outcomes: DiaryCalendarOutcome[] = []
    if (day.outcome.decisionWin) outcomes.push('win')
    if (day.outcome.decisionLoss) outcomes.push('loss')
    if (day.outcome.neutralHit) outcomes.push('neutral')

    return { date: day.date, outcomes }
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
export function mapDiaryEntry(item: GetDiariesResponseOutput['page']['items'][number]): DiaryEntry {
  return {
    id: item.diaryId,
    stockId: item.stock.stockId,
    stockName: item.stock.name,
    direction: DIRECTION_BY_CODE[item.decision.direction],
    isCorrect: item.decision.isCorrect,
    apDelta: item.decision.apDelta,
    price: item.stock.price,
    changeRate: item.stock.changeRate,
    date: item.stock.tradeDate,
    logoUrl: item.stock.logoUrl,
  }
}

/** 목록 페이지 응답 → 도메인 */
export function mapDiaryEntryPage(result: GetDiariesResponseOutput): DiaryEntryPage {
  return {
    entries: result.page.items.map(mapDiaryEntry),
    nextCursor: result.page.nextCursor ?? null,
    hasNext: result.page.hasNext,
  }
}

// ─── 상세 ──────────────────────────────────────────────────────────────────

/**
 * 상세 응답 → 도메인
 *
 * 사용: diaryId · stock.name/changeRate · agent.agentType · briefing.direction
 *       decision.isCorrect/confidenceLevel. 공유 카드의 날짜/AP는 POST 응답과 결합한다.
 */
export function mapDiaryDetail(result: GetDiaryDetailResponseOutput): DiaryDetail {
  return {
    id: result.diaryId,
    shareImageUrl: result.shareImageUrl ?? null,
    stockName: result.stock.name,
    changeRate: result.stock.changeRate,
    direction: DIRECTION_BY_CODE[result.briefing.direction],
    isCorrect: result.decision.isCorrect,
    agentType: AGENT_TYPE_BY_CODE[result.agent.agentType],
    confidenceLevel: result.decision.confidenceLevel,
  }
}

export function mapDiaryShareImage(result: CreateDiaryShareImageResponseOutput): DiaryShareImage {
  return {
    diaryId: result.diaryId,
    shareImageUrl: result.shareImageUrl,
    tradeDate: result.tradeDate,
    apDelta: result.apDelta ?? null,
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
export function mapDiaryStatistics(result: GetDiaryStatsResponseOutput): DiaryStatistics {
  const { summary } = result
  const subtitle = `최근 30일 · 결정 ${summary.recent30DaysSettledDecisionCount}건`
  const cumulativeHitRate =
    summary.settledDecisionCount === 0
      ? 0
      : Math.round((summary.correctDecisionCount / summary.settledDecisionCount) * 100)

  return {
    isEmpty: summary.settledDecisionCount === 0,
    cumulativeHitRate,
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
