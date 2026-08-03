import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { PageErrorView } from '@/components/feature/error/PageErrorView'
import { PageLoadingView } from '@/components/feature/error/PageLoadingView'
import { BadgeUnlockModal } from '@/components/feature/my/BadgeUnlockModal'
import { MyBadgeGallery } from '@/components/feature/my/MyBadgeGallery'
import { useMyBadgeDetailQuery, useMyBadgesQuery } from '@/pages/MyPage/hooks/useMyQueries'
import { MyPageLayout } from '@/pages/MyPage/MyPageLayout'

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
  if (!!badgesQuery.error && badgesQuery.fetchStatus === 'idle' && !badgesQuery.data)
    return (
      <MyPageLayout title="업적 · 배지">
        <PageErrorView
          title="정보를 불러오지 못했어요."
          error={badgesQuery.error}
          onRetry={() => badgesQuery.refetch()}
        />
      </MyPageLayout>
    )
  if (!badgesQuery.data)
    return (
      <MyPageLayout title="업적 · 배지">
        <PageLoadingView />
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
        isOpen={Boolean(selectedId)}
        badge={detailQuery.data?.badge ?? null}
        rewardAp={detailQuery.data?.rewardAp}
        isLoading={Boolean(selectedId && !detailQuery.data && detailQuery.isPending)}
        errorMessage={
          selectedId && !detailQuery.data && detailQuery.isError
            ? '배지 정보를 불러오지 못했어요.'
            : undefined
        }
        onRetry={() => detailQuery.refetch()}
        onClose={() => setSelectedId(null)}
      />
    </MyPageLayout>
  )
}
