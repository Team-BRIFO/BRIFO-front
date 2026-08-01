import { useMemo, useState } from 'react'

import { PageErrorView } from '@/components/feature/error/PageErrorView'
import { PageLoadingView } from '@/components/feature/error/PageLoadingView'
import { MyApHistory } from '@/components/feature/my/MyApHistory'
import { useMyApTransactionsQuery } from '@/pages/MyPage/hooks/useMyQueries'
import { MyPageLayout } from '@/pages/MyPage/MyPageLayout'
import type { ApPeriod } from '@/types/domain/ap'

/** SCR-15 AP 내역 */
export function MyApPage() {
  const query = useMyApTransactionsQuery()
  const [period, setPeriod] = useState<ApPeriod>('all')
  const transactions = useMemo(() => {
    if (!query.data) return []
    const all = query.data.pages.flatMap((page) => page.items)
    if (period === 'earned') return all.filter((transaction) => transaction.amount > 0)
    if (period === 'spent') return all.filter((transaction) => transaction.amount < 0)
    return all
  }, [period, query.data])

  if (!!query.error && query.fetchStatus === 'idle' && !query.data) {
    return (
      <MyPageLayout title="AP 내역">
        <PageErrorView
          title="정보를 불러오지 못했어요."
          error={query.error}
          onRetry={() => query.refetch()}
        />
      </MyPageLayout>
    )
  }
  if (!query.data) {
    return (
      <MyPageLayout title="AP 내역">
        <PageLoadingView />
      </MyPageLayout>
    )
  }

  const first = query.data.pages[0]

  return (
    <MyPageLayout title="AP 내역">
      <MyApHistory
        summary={first.summary}
        transactions={transactions}
        period={period}
        onChangePeriod={setPeriod}
        hasNext={query.hasNextPage}
        onLoadMore={() => query.fetchNextPage()}
        isLoadingMore={query.isFetchingNextPage}
        isEmpty={transactions.length === 0}
      />
    </MyPageLayout>
  )
}
