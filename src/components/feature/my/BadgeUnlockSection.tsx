import { useMemo, useState } from 'react'

import { BadgeUnlockModal } from '@/components/feature/my/BadgeUnlockModal'
import { MyBadgeGallery } from '@/components/feature/my/MyBadgeGallery'
import type { Badge } from '@/types/domain/badge'

interface BadgeUnlockSectionProps {
  badges: Badge[]
  initialBadgeId: string | null
}

/**
 * 배지 선택 상태만 소유하는 경계 — 목록은 이미 모든 배지(설명·보상 포함)를
 * 들고 있으므로 선택 시 별도 조회 없이 로컬에서 찾아 모달에 넘긴다.
 * 모달을 열고 닫아도 배지 갤러리 전체가 다시 렌더되지 않게 한다.
 */
export default function BadgeUnlockSection({ badges, initialBadgeId }: BadgeUnlockSectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(initialBadgeId)
  const selectedBadge = useMemo(
    () => badges.find((badge) => badge.id === selectedId) ?? null,
    [badges, selectedId],
  )

  return (
    <>
      <MyBadgeGallery badges={badges} onSelectBadge={setSelectedId} isEmpty={badges.length === 0} />
      <BadgeUnlockModal badge={selectedBadge} onClose={() => setSelectedId(null)} />
    </>
  )
}
