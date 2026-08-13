import { AnalyzeCard } from '@/components/feature/analyze/AnalyzeCard'

interface HomeCardNewsItem {
  id: string | number
  stockId?: string
  stock: {
    name: string
    code?: string
    marketType?: string
    logoUrl?: string | null
    price?: number
    changeRate?: number
  }
  newsCount: number
  headline: string
  isCompleted: boolean
  isRequested: boolean
}

interface HomeCardNewsSectionProps {
  date: string
  time: string
  items: HomeCardNewsItem[]
  onItemClick?: (id: string | number) => void
  selectedId?: string | null
}

export default function HomeCardNewsSection({
  date,
  time,
  items,
  onItemClick,
  selectedId,
}: HomeCardNewsSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="dnf-Subtitle2 text-Gray-10 mt-1 mb-2">오늘의 카드뉴스</h2>

        <div className="pretendard-Caption2 text-Gray-5 flex items-center gap-2">
          <span>{date}</span>
          <span>{time}</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="border-Gray-2 flex flex-col items-center gap-1 rounded-xl border border-dashed px-4 py-10 text-center">
          <p className="pretendard-Body2-Semibold text-Gray-7">
            오늘의 카드뉴스를 아직 준비하고 있어요
          </p>
          <p className="pretendard-Caption2 text-Gray-5">
            사원들이 기사를 정리하는 중이에요. 조금 뒤에 다시 확인해 주세요!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemClick?.(item.stockId ?? String(item.id))}
              className="w-full text-left"
            >
              <AnalyzeCard
                type="normal"
                resultType="BRIEFING"
                stock={item.stock}
                briefingFooter={{
                  newsCount: item.newsCount,
                  headline: item.headline,
                  isCompleted: item.isCompleted,
                  isRequested: item.isRequested,
                }}
                className={
                  selectedId === (item.stockId ?? String(item.id))
                    ? 'border-Yellow-40 border-2 transition-colors'
                    : 'transition-colors'
                }
              />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
