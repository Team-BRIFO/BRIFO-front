import { memo, useMemo, useState } from 'react'

import Button from '@/components/common/Button'
import { Tabs } from '@/components/common/Tabs'
// 대체: domain/ap — AP 잔액·획득·사용 요약 카드
import { ApHistorySummaryCard } from '@/components/domain/ap/ApHistorySummaryCard'
// 대체: domain/ap — AP 입출금 행 (라벨은 apTransactionMeta)
import { ApTransactionRow } from '@/components/domain/ap/ApTransactionRow'
import type { ApPeriod, ApSummary, ApTransaction } from '@/types/domain/ap'

/** 피그마 Mypage_AP 필터: 전체 / 획득 / 사용 */
const AP_PERIOD_ITEMS: { value: ApPeriod; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'earned', label: '획득' },
  { value: 'spent', label: '사용' },
]

export interface MyApHistoryProps {
  summary: ApSummary
  transactions: ApTransaction[]
  /** 다음 페이지 존재 여부 (커서 기반) */
  hasNext?: boolean
  onLoadMore?: () => void
  isLoadingMore?: boolean
  loadMoreError?: boolean
}

const MemoizedApHistorySummaryCard = memo(ApHistorySummaryCard)
const MemoizedApTransactionRow = memo(ApTransactionRow)

/** AP 내역 화면(SCR-15) 본문 — 요약 카드 · 흐름 필터 · 입출금 리스트 */
export function MyApHistory({
  summary,
  transactions,
  hasNext = false,
  onLoadMore,
  isLoadingMore = false,
  loadMoreError = false,
}: MyApHistoryProps) {
  const [period, setPeriod] = useState<ApPeriod>('all')
  const filteredTransactions = useMemo(() => {
    if (period === 'earned') return transactions.filter((transaction) => transaction.amount > 0)
    if (period === 'spent') return transactions.filter((transaction) => transaction.amount < 0)
    return transactions
  }, [period, transactions])
  const isEmpty = filteredTransactions.length === 0

  return (
    <div className="flex flex-col gap-5">
      <MemoizedApHistorySummaryCard summary={summary} />

      <div className="flex flex-col gap-2">
        <Tabs
          value={period}
          onChange={(value) => setPeriod(value as ApPeriod)}
          items={AP_PERIOD_ITEMS}
          variant="segmented"
          isFullWidth={false}
          ariaLabel="AP 내역 필터"
        />

        {isEmpty ? (
          <p className="pretendard-Body2-Regular text-Gray-5 py-10 text-center">
            {hasNext
              ? '아직 불러온 내역에는 해당 항목이 없어요. 더 보기를 눌러 추가 내역을 확인해주세요.'
              : '해당 내역이 없어요.'}
          </p>
        ) : (
          <ul className="overflow-hidden rounded-lg">
            {filteredTransactions.map((transaction) => (
              <MemoizedApTransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </ul>
        )}
      </div>

      {hasNext && (
        <div className="flex flex-col gap-2">
          {loadMoreError && (
            <p role="alert" className="pretendard-Caption2 text-Pink-30 text-center">
              추가 내역을 불러오지 못했어요.
            </p>
          )}
          <Button
            variant="outline"
            color="assistive"
            size="md"
            isFullWidth
            disabled={isLoadingMore}
            onClick={onLoadMore}
          >
            {isLoadingMore ? '불러오는 중...' : loadMoreError ? '다시 시도' : '더 보기'}
          </Button>
        </div>
      )}
    </div>
  )
}
