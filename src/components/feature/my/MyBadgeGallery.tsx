import { BadgeItem } from '@/components/domain/badge/BadgeItem'
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
    <div className="flex flex-col gap-5">
      <BadgeProgressCard progress={badgeProgress} />

      {badges.length === 0 ? (
        <p className="pretendard-Body2-Regular text-Gray-5 py-10 text-center">
          아직 도전할 수 있는 업적이 없어요.
        </p>
      ) : (
        <ul className="grid grid-cols-3 gap-x-2 gap-y-5">
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
