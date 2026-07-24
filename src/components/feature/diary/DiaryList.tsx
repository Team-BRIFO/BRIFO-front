import {
  AnalyzeCard,
  type AnalyzeResultType,
} from '@/components/feature/analyze/AnalyzeCard'
import type { DiaryEntry } from '@/types/domain/diary'

/** DiaryEntry(방향 + 적중 여부) → 기존 AnalyzeCard 의 resultType */
function toResultType({ direction, isCorrect }: DiaryEntry): AnalyzeResultType {
  const prefix = isCorrect ? 'SUCCESS' : 'FAIL'
  const suffix = direction === 'up' ? 'UP' : direction === 'down' ? 'DOWN' : 'HOLD'

  return `${prefix}_${suffix}` as AnalyzeResultType
}

export interface DiaryListProps {
  entries: DiaryEntry[]
  /** 카드 선택 시 (상세 이동) */
  onSelectEntry?: (id: string) => void
  /** 다음 페이지 로드 (무한 스크롤) */
  onLoadMore?: () => void
  hasNext?: boolean
  isLoadingMore?: boolean
}

/**
 * 결정일기 리스트 뷰.
 * 카드는 feature/stock 의 AnalyzeCard 를 재사용한다 (배지·푸터·AP 표기가 동일 스펙).
 *
 * 백엔드 문의 중: 시안 카드가 표시하는 주가·등락률·거래일·종목 로고가
 * `GET /api/diaries` 응답에 없다. 시안대로 그리기 위해 지금은 mock 이 채우고 있으며,
 * 값이 없으면 해당 줄을 렌더하지 않으므로 실제 응답이 와도 화면은 깨지지 않는다.
 */
export function DiaryList({
  entries,
  onSelectEntry,
  onLoadMore,
  hasNext = false,
  isLoadingMore = false,
}: DiaryListProps) {
  if (entries.length === 0) {
    return (
      <p className="pretendard-Body2-Regular text-Gray-6 py-10 text-center">
        아직 결정 기록이 없어요.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col gap-2">
        {entries.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              onClick={() => onSelectEntry?.(entry.id)}
              aria-label={`${entry.stockName} 결정 상세 보기`}
              className="focus-visible:ring-Yellow-45 block w-full rounded-lg text-left focus-visible:ring-2 focus-visible:outline-hidden"
            >
              <AnalyzeCard
                resultType={toResultType(entry)}
                apAmount={entry.apDelta}
                stock={{
                  name: entry.stockName,
                  logoUrl: entry.logoUrl,
                  price: entry.price,
                  changeRate: entry.changeRate,
                  tradeDate: entry.date,
                }}
                className="rounded-lg shadow-[0px_4px_40px_0px_color-mix(in_srgb,var(--color-Gray-2)_15%,transparent)]"
              />
            </button>
          </li>
        ))}
      </ul>

      {hasNext && (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={isLoadingMore}
          className="pretendard-Button2 text-Gray-6 focus-visible:ring-Yellow-45 rounded-lg py-3 focus-visible:ring-2 focus-visible:outline-hidden disabled:opacity-50"
        >
          {isLoadingMore ? '불러오는 중…' : '더 보기'}
        </button>
      )}
    </div>
  )
}
