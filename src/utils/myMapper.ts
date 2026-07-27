// 대체: domain/ap — AP 거래 타입 → 표시 라벨 맵 (ApTransactionRow와 공유)
import { AP_TRANSACTION_LABEL } from '@/components/domain/ap/apTransactionMeta'
import { MY_PROFILE_META } from '@/pages/MyPage/mockMy'
import type { ApTransactionResult } from '@/types/api/ap'
import type { BadgeDetailResult, BadgeListItemResponse } from '@/types/api/badge'
import type { MyLearnedTermResponse } from '@/types/api/terms'
import type { MyUserResult } from '@/types/api/user'
import type { ApSummary, ApTransaction } from '@/types/domain/ap'
import type { Badge } from '@/types/domain/badge'
import type { MyGlossaryEntry } from '@/types/domain/glossary'
import type { UserProfile, UserProfileFormValues, UserStats } from '@/types/domain/user'

export function mapMyUser(result: MyUserResult): {
  profile: UserProfile
  stats: UserStats
  apSummary: ApSummary
} {
  return {
    profile: {
      // TODO: 실 API 응답에 프로필 메타 필드가 추가되면 MY_PROFILE_META 대신 result를 사용한다.
      id: MY_PROFILE_META.id,
      nickname: result.nickname,
      companyName: result.companyName,
      jobTitle: MY_PROFILE_META.jobTitle,
      characterType: MY_PROFILE_META.characterType,
    },
    stats: {
      hitRate: result.decisionAccuracyRate,
      totalDecisions: result.totalDecision,
      attendanceStreak: result.consecutiveDays,
    },
    apSummary: { balance: result.balanceAp, earned: result.thisWeekEarnedAp, lost: 0 },
  }
}

export function mapProfileFormValues(result: MyUserResult): UserProfileFormValues {
  return {
    nickname: result.nickname,
    companyName: result.companyName,
    // TODO: 실 API 응답에 관심 종목이 추가되면 MY_PROFILE_META 대신 result를 사용한다.
    interestStocks: MY_PROFILE_META.interestStocks,
  }
}

export function mapApSummary(result: ApTransactionResult): ApSummary {
  return {
    balance: result.summary.balanceAp,
    earned: result.summary.monthlyEarnedAp,
    lost: result.summary.monthlyLostAp,
  }
}
export function mapApTransaction(result: ApTransactionResult): ApTransaction[] {
  return result.page.items.map((item) => ({
    id: item.apTransactionId,
    reason: item.reason,
    label: AP_TRANSACTION_LABEL[item.reason],
    amount: item.amount,
    createdAt: item.createdAt,
  }))
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
export function mapBadgeDetail(result: BadgeDetailResult): Badge {
  // BadgeDetailResult는 사용자 보유 배지 상세 응답이므로 성공 시 해금 상태로 매핑한다.
  return {
    id: result.badgeId,
    name: result.name,
    description: result.description ?? '',
    iconKey: result.code,
    isUnlocked: true,
    unlockedAt: null,
  }
}
export function mapMyLearnedTerm(item: MyLearnedTermResponse): MyGlossaryEntry {
  return { ...item }
}
