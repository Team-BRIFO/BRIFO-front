import type { ApTransactionResult } from '@/types/api/ap'
import type { BadgeDetailResult, BadgeListItemResponse } from '@/types/api/badge'
import type { MyLearnedTermsResult } from '@/types/api/terms'
import type { MyUserResult } from '@/types/api/user'
import type { ApSummary, ApTransactionPage, ApTransactionReason } from '@/types/domain/ap'
import type { Badge, BadgeDetail } from '@/types/domain/badge'
import type { MyGlossaryPage } from '@/types/domain/glossary'
import type { UserOverview, UserProfileMeta } from '@/types/domain/user'

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

export function mapMyUser(result: MyUserResult, meta: UserProfileMeta): UserOverview {
  return {
    profile: {
      id: meta.id,
      nickname: result.nickname,
      companyName: result.companyName,
      jobTitle: meta.jobTitle,
      characterType: meta.characterType,
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
      interestStocks: meta.interestStocks,
    },
  }
}

function mapApSummary(result: ApTransactionResult): ApSummary {
  return {
    balance: result.summary.balanceAp,
    earned: result.summary.monthlyEarnedAp,
    lost: result.summary.monthlyLostAp,
  }
}

export function mapApTransactionPage(result: ApTransactionResult): ApTransactionPage {
  return {
    summary: mapApSummary(result),
    items: result.page.items.map((item) => ({
      id: item.apTransactionId,
      reason: item.reason,
      label: AP_TRANSACTION_LABEL[item.reason],
      amount: item.amount,
      createdAt: item.createdAt,
    })),
    nextCursor: result.page.nextCursor,
    hasNext: result.page.hasNext,
  }
}

export function mapBadge(item: BadgeListItemResponse): Badge {
  return {
    id: item.badgeId,
    name: item.name,
    description: '',
    iconKey: item.code,
    isUnlocked: item.isOwned,
    unlockedAt: null,
  }
}

export function mapBadgeDetail(result: BadgeDetailResult): BadgeDetail {
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

export function mapMyGlossaryPage(result: MyLearnedTermsResult): MyGlossaryPage {
  return {
    learnedTermCount: result.learnedTermCount,
    entries: result.page.items.map((item) => ({ ...item })),
    nextCursor: result.page.nextCursor,
    hasNext: result.page.hasNext,
  }
}
