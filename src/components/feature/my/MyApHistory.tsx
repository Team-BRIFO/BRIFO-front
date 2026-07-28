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
  period: ApPeriod
  onChangePeriod: (period: ApPeriod) => void
  /** 다음 페이지 존재 여부 (커서 기반) */
  hasNext?: boolean
  onLoadMore?: () => void
  isLoadingMore?: boolean
  /** 빈 상태 여부는 조회 데이터를 소유한 Page가 결정한다. */
  isEmpty: boolean
}

/** AP 내역 화면(SCR-15) 본문 — 요약 카드 · 흐름 필터 · 입출금 리스트 */
export function MyApHistory({
  summary,
  transactions,
  period,
  onChangePeriod,
  hasNext = false,
  onLoadMore,
  isLoadingMore = false,
  isEmpty,
}: MyApHistoryProps) {
  return (
    <div className="flex flex-col gap-5">
      <ApHistorySummaryCard summary={summary} />

      <div className="flex flex-col gap-2">
        <Tabs
          value={period}
          onChange={(value) => onChangePeriod(value as ApPeriod)}
          items={AP_PERIOD_ITEMS}
          variant="pill"
          ariaLabel="AP 내역 필터"
        />

        {isEmpty ? (
          <p className="pretendard-Body2-Regular text-Gray-5 py-10 text-center">
            해당 내역이 없어요.
          </p>
        ) : (
          <ul className="overflow-hidden rounded-lg">
            {transactions.map((transaction) => (
              <ApTransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </ul>
        )}
      </div>

      {hasNext && (
        <Button
          variant="outline"
          color="assistive"
          size="md"
          isFullWidth
          disabled={isLoadingMore}
          onClick={onLoadMore}
        >
          {isLoadingMore ? '불러오는 중...' : '더 보기'}
        </Button>
      )}
    </div>
  )
}
