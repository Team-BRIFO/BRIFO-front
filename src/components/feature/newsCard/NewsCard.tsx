import type { BadgeType } from '@/components/common/Badge'
import { Badge } from '@/components/common/Badge'
import { NewsCardInfo } from '@/components/domain/newsCard/NewsCardInfo'
import { NewsCardPointList } from '@/components/domain/newsCard/NewsCardPointList'
import type { NewsCardData } from '@/types/domain/newsCard'

export interface NewsCardProps {
  data: NewsCardData
  onTermClick?: (termId: string) => void
  className?: string
}

export function NewsCard({ data, onTermClick, className = '' }: NewsCardProps) {
  return (
    <article className={`flex w-full flex-col gap-3 ${className}`}>
      <NewsCardInfo
        publishedDate={data.publishedDate}
        headline={data.headline}
        imageUrl={data.imageUrl}
        importanceBadge={data.importanceBadge}
        source={data.source}
      />

      <div className="flex flex-col gap-5 px-4 py-3.5">
        <NewsCardPointList
          title="3줄 요약"
          points={data.points}
          terms={data.terms}
          onTermClick={onTermClick}
        />

        {data.relatedStocks && data.relatedStocks.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-Yellow-30 dnf-Caption2">주요 관련 종목</h3>
            <div className="flex flex-wrap gap-3">
              {data.relatedStocks.map((stock, idx) => {
                const isPositive = (stock.changeRate ?? 0) > 0
                const isNegative = (stock.changeRate ?? 0) < 0
                const badgeType: BadgeType = isPositive
                  ? 'stock-rise'
                  : isNegative
                    ? 'stock-fall'
                    : 'gray'
                const sign = isPositive ? '+' : ''
                return (
                  <Badge key={idx} type={badgeType}>
                    {stock.changeRate != null
                      ? `${stock.name} ${sign}${stock.changeRate}%`
                      : stock.name}
                  </Badge>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
