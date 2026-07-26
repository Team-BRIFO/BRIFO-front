import { useMemo, useState } from 'react'

import { Loading } from '@/components/common/Loading'
import { MyApHistory } from '@/components/feature/my/MyApHistory'
import { useMyApTransactions } from '@/hooks/queries/useMy'
import type { ApPeriod } from '@/types/domain/ap'
import { mapApSummary, mapApTransaction } from '@/utils/myMapper'

import { MyPageError, MyPageLayout } from './MyPageLayout'

/** SCR-15 AP 내역 */
export function MyApPage() {
  const query = useMyApTransactions()
  const [period, setPeriod] = useState<ApPeriod>('all')
  const transactions = useMemo(() => {
    if (!query.data) return []
    const all = query.data.pages.flatMap(mapApTransaction)
    if (period === 'earned') return all.filter((transaction) => transaction.amount > 0)
    if (period === 'spent') return all.filter((transaction) => transaction.amount < 0)
    return all
  }, [period, query.data])

  if (query.isError) {
    return (
      <MyPageLayout title="AP 내역">
        <MyPageError onRetry={() => query.refetch()} />
      </MyPageLayout>
    )
  }
  if (!query.data) {
    return (
      <MyPageLayout title="AP 내역">
        <Loading className="py-10" />
      </MyPageLayout>
    )
  }

  const first = query.data.pages[0]

  return (
    <MyPageLayout title="AP 내역">
      <MyApHistory
        summary={mapApSummary(first)}
        transactions={transactions}
        period={period}
        onChangePeriod={setPeriod}
        hasNext={query.hasNextPage}
        onLoadMore={() => query.fetchNextPage()}
        isLoadingMore={query.isFetchingNextPage}
      />
    </MyPageLayout>
  )
}
