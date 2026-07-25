import { AnalyzeCard } from '@/components/feature/analyze/AnalyzeCard'

interface HomeCardNewsItem {
  id: number
  stock: {
    name: string
    code?: string
    marketType?: string
    logoUrl?: string | null
    price: number
    changeRate: number
  }
  newsCount: number
  headline: string
  isCompleted: boolean
}

interface HomeCardNewsSectionProps {
  date: string
  time: string
  items: HomeCardNewsItem[]
  onItemClick?: (id: number) => void
}

export default function HomeCardNewsSection({
  date,
  time,
  items,
  onItemClick,
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

      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onItemClick?.(item.id)}
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
              }}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
