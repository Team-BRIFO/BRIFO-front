import { twMerge } from 'tailwind-merge'

import { StockInfo } from '@/components/domain/stock/StockInfo'
import { StockPriceChange } from '@/components/domain/stock/StockPriceChange'

export interface StockSummaryCardProps {
  stock: {
    name: string
    code?: string
    marketType?: string
    logoUrl?: string | null
    price: number
    changeRate: number
    hashtags?: string[]
  }
  className?: string
}

export function StockSummaryCard({ stock, className }: StockSummaryCardProps) {
  return (
    <div
      className={twMerge(
        'border-Gray-2 bg-White flex flex-col overflow-hidden rounded-2xl border',
        className,
      )}
    >
      <div className="flex items-center justify-between p-4">
        <StockInfo
          name={stock.name}
          code={stock.code}
          marketType={stock.marketType}
          logoUrl={stock.logoUrl}
        />
        <StockPriceChange price={stock.price} changeRate={stock.changeRate} textAlign="right" />
      </div>
      {stock.hashtags && stock.hashtags.length > 0 && (
        <div className="bg-Gray-1 text-Gray-6 pretendard-Caption1 flex flex-wrap gap-2 px-4 py-3">
          {stock.hashtags.map((tag, idx) => (
            <span key={idx}>#{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}
