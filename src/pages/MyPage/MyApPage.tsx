import { useMemo } from 'react'

import { MyApHistory } from '@/components/feature/my/MyApHistory'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { useMyApTransactionsQuery } from '@/pages/MyPage/hooks/useMyQueries'
import { MyPageLayout } from '@/pages/MyPage/MyPageLayout'

/** SCR-15 AP 내역 */
export function MyApPage() {
  const query = useMyApTransactionsQuery()
  const transactions = useMemo(() => {
    if (!query.data) return []
    return query.data.pages.flatMap((page) => page.items)
  }, [query.data])

  const content =
    !!query.error && query.fetchStatus === 'idle' && !query.data ? (
      <PageErrorView
        title="정보를 불러오지 못했어요."
        error={query.error}
        onRetry={() => query.refetch()}
      />
    ) : !query.data ? (
      <PageLoadingView />
    ) : (
      <MyApHistory
        summary={query.data.pages[0].summary}
        transactions={transactions}
        hasNext={query.hasNextPage}
        onLoadMore={() => query.fetchNextPage()}
        isLoadingMore={query.isFetchingNextPage}
        loadMoreError={query.isFetchNextPageError}
      />
    )

  return <MyPageLayout title="AP 내역">{content}</MyPageLayout>
}
