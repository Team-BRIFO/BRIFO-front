import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Loading } from '@/components/common/Loading'
import { BadgeUnlockModal } from '@/components/feature/my/BadgeUnlockModal'
import { MyBadgeGallery } from '@/components/feature/my/MyBadgeGallery'

import { useMyBadgeDetailQuery, useMyBadgesQuery } from './hooks/useMyQueries'
import { MyPageError, MyPageLayout } from './MyPageLayout'

export function MyBadgePage() {
  const [params, setParams] = useSearchParams()
  const [selectedId, setSelectedId] = useState<string | null>(params.get('newBadgeId'))
  const badgesQuery = useMyBadgesQuery()
  const detailQuery = useMyBadgeDetailQuery(selectedId)
  useEffect(() => {
    if (params.get('newBadgeId')) {
      const next = new URLSearchParams(params)
      next.delete('newBadgeId')
      setParams(next, { replace: true })
    }
  }, [params, setParams])
  if (badgesQuery.isError && !badgesQuery.data)
    return (
      <MyPageLayout title="업적 · 배지">
        <MyPageError onRetry={() => badgesQuery.refetch()} />
      </MyPageLayout>
    )
  if (!badgesQuery.data)
    return (
      <MyPageLayout title="업적 · 배지">
        <Loading className="py-10" />
      </MyPageLayout>
    )
  const badges = badgesQuery.data
  return (
    <MyPageLayout title="업적 · 배지">
      <MyBadgeGallery
        badges={badges}
        onSelectBadge={(id) =>
          badges.find((badge) => badge.id === id)?.isUnlocked && setSelectedId(id)
        }
        isEmpty={badges.length === 0}
      />
      <BadgeUnlockModal
        isOpen={Boolean(selectedId && detailQuery.data)}
        badge={detailQuery.data?.badge ?? null}
        rewardAp={detailQuery.data?.rewardAp}
        onClose={() => setSelectedId(null)}
      />
    </MyPageLayout>
  )
}
