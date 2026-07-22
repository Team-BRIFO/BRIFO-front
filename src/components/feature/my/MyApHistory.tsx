import Button from '@/components/common/Button'
import { Tabs } from '@/components/common/Tabs'
import { ApBalanceCard } from '@/components/domain/ap/ApBalanceCard'
import { ApTransactionRow } from '@/components/domain/ap/ApTransactionRow'
import type { ApPeriod, ApSummary, ApTransaction } from '@/types/domain/ap'

/** 기간 필터 항목 — 라벨은 AP 카드 증감 라벨로도 재사용한다 */
const AP_PERIOD_ITEMS: { value: ApPeriod; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'week', label: '이번주' },
  { value: 'month', label: '이번달' },
]

export interface MyApHistoryProps {
  summary: ApSummary
  transactions: ApTransaction[]
  period: ApPeriod
  onChangePeriod: (period: ApPeriod) => void
  /** 다음 페이지 존재 여부 (커서 기반) */
  hasNext?: boolean
  onLoadMore?: () => void
  isLoading?: boolean
}

/** AP 내역 화면(SCR-15) 본문 — 요약 카드 · 기간 필터 · 입출금 리스트 */
export function MyApHistory({
  summary,
  transactions,
  period,
  onChangePeriod,
  hasNext = false,
  onLoadMore,
  isLoading = false,
}: MyApHistoryProps) {
  const periodLabel = AP_PERIOD_ITEMS.find((item) => item.value === period)?.label

  return (
    <div className="flex flex-col gap-5">
      <ApBalanceCard summary={summary} deltaLabel={period === 'all' ? undefined : periodLabel} />

      <Tabs
        value={period}
        onChange={(value) => onChangePeriod(value as ApPeriod)}
        items={AP_PERIOD_ITEMS}
        variant="pill"
        ariaLabel="AP 내역 기간 필터"
      />

      {transactions.length === 0 ? (
        <p className="pretendard-Body2-Regular text-Gray-5 py-10 text-center">
          해당 기간의 AP 내역이 없어요.
        </p>
      ) : (
        <ul className="border-Gray-2 bg-White flex flex-col overflow-hidden rounded-lg border">
          {transactions.map((transaction) => (
            <ApTransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </ul>
      )}

      {hasNext && (
        <Button
          variant="outline"
          color="assistive"
          size="md"
          isFullWidth
          disabled={isLoading}
          onClick={onLoadMore}
        >
          {isLoading ? '불러오는 중...' : '더 보기'}
        </Button>
      )}
    </div>
  )
}
