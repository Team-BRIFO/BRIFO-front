import HeartIcon from '@/assets/icons/heart.svg?react'

interface StockRankItemProps {
  rank?: number
  logo: React.ReactNode
  name: string
  price: string
  changeRate: number
  isFavorite?: boolean
  onToggleFavorite?: () => void
  onClick?: () => void
}

export default function StockRankItem({
  rank,
  logo,
  name,
  price,
  changeRate,
  isFavorite = false,
  onToggleFavorite,
  onClick,
}: StockRankItemProps) {
  const isUp = changeRate >= 0

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between py-3"
    >
      <div className="flex items-center gap-3">
        {rank && <span className="dnf-Subtitle3 text-Yellow-30 w-6 text-center">{rank}</span>}

        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
          {logo}
        </div>

        <div className="flex flex-col items-start">
          <span className="pretendard-Body2-Semibold text-Yellow-5">{name}</span>

          <div className="flex items-center gap-1">
            <span className="pretendard-Caption3 text-Gray-5">{price}</span>

            <span className={`pretendard-Caption3 ${isUp ? 'text-Pink-30' : 'text-Green-30'}`}>
              {isUp ? '+' : ''}
              {changeRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite?.()
        }}
      >
        <HeartIcon
          className={`h-5 w-5 ${
            isFavorite ? 'fill-Yellow-45 text-Yellow-45' : 'text-Yellow-45 fill-none'
          }`}
        />
      </button>
    </button>
  )
}
