import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import BadgeUnlockSection from '@/components/feature/my/BadgeUnlockSection'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { useMyBadgesQuery } from '@/pages/MyPage/hooks/useMyQueries'
import { MyPageLayout } from '@/pages/MyPage/MyPageLayout'

export function MyBadgePage() {
  const [params, setParams] = useSearchParams()
  const initialBadgeId = params.get('newBadgeId')
  const badgesQuery = useMyBadgesQuery()
  useEffect(() => {
    if (params.get('newBadgeId')) {
      const next = new URLSearchParams(params)
      next.delete('newBadgeId')
      setParams(next, { replace: true })
    }
  }, [params, setParams])
  const content =
    !!badgesQuery.error && badgesQuery.fetchStatus === 'idle' && !badgesQuery.data ? (
      <PageErrorView
        title="정보를 불러오지 못했어요."
        error={badgesQuery.error}
        onRetry={() => badgesQuery.refetch()}
      />
    ) : !badgesQuery.data ? (
      <PageLoadingView />
    ) : (
      <BadgeUnlockSection badges={badgesQuery.data} initialBadgeId={initialBadgeId} />
    )

  return <MyPageLayout title="업적 · 배지">{content}</MyPageLayout>
}
