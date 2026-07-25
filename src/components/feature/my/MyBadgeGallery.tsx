// 대체: domain/badge — 배지 그리드 아이템 (BadgeUnlockModal과 동일)
import { BadgeItem } from '@/components/domain/badge/BadgeItem'
// 대체: domain/badge — 해금 진행률 카드
import { BadgeProgressCard } from '@/components/domain/badge/BadgeProgressCard'
import type { Badge, BadgeProgress } from '@/types/domain/badge'

export interface MyBadgeGalleryProps {
  badges: Badge[]
  /** 미전달 시 badges 배열에서 계산 */
  progress?: BadgeProgress
  onSelectBadge?: (badgeId: string) => void
}

/** 업적 · 배지 화면(SCR-14) 본문 — 진행률 + 배지 그리드 */
export function MyBadgeGallery({ badges, progress, onSelectBadge }: MyBadgeGalleryProps) {
  const badgeProgress: BadgeProgress = progress ?? {
    unlockedCount: badges.filter((badge) => badge.isUnlocked).length,
    totalCount: badges.length,
  }

  return (
    <div className="flex flex-col gap-4">
      <BadgeProgressCard progress={badgeProgress} />

      {badges.length === 0 ? (
        <p className="pretendard-Body2-Regular text-Gray-5 py-10 text-center">
          아직 도전할 수 있는 업적이 없어요.
        </p>
      ) : (
        <ul className="border-Gray-2 bg-White grid grid-cols-4 gap-x-0 gap-y-3 rounded-lg border px-3 py-4">
          {badges.map((badge) => (
            <li key={badge.id} className="flex justify-center">
              <BadgeItem badge={badge} onClick={() => onSelectBadge?.(badge.id)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
