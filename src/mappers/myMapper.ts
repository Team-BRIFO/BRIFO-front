import type { GetApTransactionsResponse } from '@/api/generated/schemas/ap-controller'
import type { BadgeItem, GetOwnedBadgeResponse } from '@/api/generated/schemas/badge-controller'
import type { GetMyTermsResponse } from '@/api/generated/schemas/term-controller'
import type { GetMyPageResponse } from '@/api/generated/schemas/user-controller'
import type { ApSummary, ApTransactionPage, ApTransactionReason } from '@/types/domain/ap'
import type { Badge, BadgeDetail } from '@/types/domain/badge'
import type { MyGlossaryPage } from '@/types/domain/glossary'
import type { UserOverview } from '@/types/domain/user'

const MY_PROFILE_PRESENTATION_FALLBACK = {
  jobTitle: '사장',
  characterType: 'rookie' as const,
}

const AP_TRANSACTION_LABEL: Record<ApTransactionReason, string> = {
  INITIAL_GRANT: '가입 축하 지급',
  ATTENDANCE: '출석 보상',
  TUTORIAL: '튜토리얼 완료',
  BADGE: '배지 획득',
  DECISION_WIN: '결정 적중',
  DECISION_LOSE: '결정 실패',
  NEUTRAL_HIT: '중립 예측 적중',
  NEUTRAL_MISS: '중립 예측 실패',
  SALARY: '사원 급여',
  SALARY_REFUND: '급여 환급',
  CREDIT_LOAN: 'AP 대출',
}

export function mapMyUser(result: GetMyPageResponse): UserOverview {
  return {
    profile: {
      nickname: result.nickname,
      companyName: result.companyName,
      jobTitle: MY_PROFILE_PRESENTATION_FALLBACK.jobTitle,
      characterType: MY_PROFILE_PRESENTATION_FALLBACK.characterType,
    },
    stats: {
      hitRate: result.decisionAccuracyRate,
      totalDecisions: result.totalDecision,
      attendanceStreak: result.consecutiveDays,
    },
    apSummary: { balance: result.balanceAp, earned: result.thisWeekEarnedAp, lost: 0 },
    profileFormValues: {
      nickname: result.nickname,
      companyName: result.companyName,
      interestStocks: result.stocks.map((stock) => ({ id: stock.stockId, name: stock.name })),
    },
  }
}

function mapApSummary(result: GetApTransactionsResponse): ApSummary {
  return {
    balance: result.summary.balanceAp,
    earned: result.summary.monthlyEarnedAp,
    lost: result.summary.monthlyLostAp,
  }
}

export function mapApTransactionPage(result: GetApTransactionsResponse): ApTransactionPage {
  return {
    summary: mapApSummary(result),
    items: result.page.items.map((item) => ({
      id: item.apTransactionId,
      reason: item.reason,
      label: AP_TRANSACTION_LABEL[item.reason],
      amount: item.amount,
      createdAt: item.createdAt,
    })),
    nextCursor: result.page.nextCursor ?? null,
    hasNext: result.page.hasNext,
  }
}

export function mapBadge(item: BadgeItem): Badge {
  return {
    id: item.badgeId,
    name: item.name,
    description: '',
    iconKey: item.code,
    isUnlocked: item.isOwned,
    unlockedAt: null,
  }
}

export function mapBadgeDetail(result: GetOwnedBadgeResponse): BadgeDetail {
  return {
    badge: {
      id: result.badgeId,
      name: result.name,
      description: result.description ?? '',
      iconKey: result.code,
      isUnlocked: true,
      unlockedAt: null,
    },
    rewardAp: result.rewardAp,
  }
}

export function mapMyGlossaryPage(result: GetMyTermsResponse): MyGlossaryPage {
  return {
    learnedTermCount: result.learnedTermCount,
    entries: result.page.items.map((item) => ({
      termId: item.termId,
      term: item.term,
      definition: item.definition,
      category: item.category,
      learnedAt: item.learnedAt,
    })),
    nextCursor: result.page.nextCursor ?? null,
    hasNext: result.page.hasNext,
  }
}
