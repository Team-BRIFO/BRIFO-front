export interface StockPriceChangeProps {
  /** 현재 주가 (예: 2679000) */
  price: number
  /** 등락률 수치 (예: 6.3 또는 -2.5) */
  changeRate: number
  /** 텍스트 정렬 기준 */
  textAlign?: 'left' | 'right'
  className?: string
}

export function StockPriceChange({
  price,
  changeRate,
  textAlign = 'left',
  className = '',
}: StockPriceChangeProps) {
  const isPositive = changeRate > 0
  const isNegative = changeRate < 0

  let textColor = 'text-Gray-6'
  if (isPositive) textColor = 'text-Pink-30'
  else if (isNegative) textColor = 'text-Green-30'

  const alignmentClass = textAlign === 'right' ? 'items-end text-right' : 'items-start text-left'

  const formattedChangeRate = isPositive ? `+${changeRate}%` : `${changeRate}%`

  return (
    <div className={`flex flex-col gap-1 ${alignmentClass} ${className}`}>
      <span className={`dnf-Caption1 ${textColor}`}>{price.toLocaleString()}</span>
      <span className={`pretendard-Caption1 ${textColor}`}>{formattedChangeRate}</span>
    </div>
  )
}
