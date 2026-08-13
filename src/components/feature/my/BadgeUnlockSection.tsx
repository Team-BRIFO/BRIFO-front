import { useCallback, useState } from 'react'

import { BadgeUnlockModal } from '@/components/feature/my/BadgeUnlockModal'
import { MyBadgeGallery } from '@/components/feature/my/MyBadgeGallery'
import { useMyBadgeDetailQuery } from '@/pages/MyPage/hooks/useMyQueries'
import type { Badge } from '@/types/domain/badge'

interface BadgeUnlockSectionProps {
  badges: Badge[]
  initialBadgeId: string | null
}

/**
 * 배지 선택과 상세 모달에만 필요한 상태·쿼리 경계.
 * 모달을 열고 닫아도 배지 갤러리 전체가 다시 렌더되지 않게 한다.
 */
export default function BadgeUnlockSection({ badges, initialBadgeId }: BadgeUnlockSectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(initialBadgeId)
  const detailQuery = useMyBadgeDetailQuery(selectedId)

  const handleSelectBadge = useCallback(
    (id: string) => {
      if (badges.find((badge) => badge.id === id)?.isUnlocked) setSelectedId(id)
    },
    [badges],
  )

  return (
    <>
      <MyBadgeGallery
        badges={badges}
        onSelectBadge={handleSelectBadge}
        isEmpty={badges.length === 0}
      />
      <BadgeUnlockModal
        isOpen={Boolean(selectedId)}
        badge={detailQuery.data?.badge ?? null}
        rewardAp={detailQuery.data?.rewardAp}
        isLoading={Boolean(selectedId && !detailQuery.data && detailQuery.isFetching)}
        errorMessage={
          selectedId && !detailQuery.data && detailQuery.isError
            ? '배지 정보를 불러오지 못했어요.'
            : undefined
        }
        onRetry={() => detailQuery.refetch()}
        onClose={() => setSelectedId(null)}
      />
    </>
  )
}
