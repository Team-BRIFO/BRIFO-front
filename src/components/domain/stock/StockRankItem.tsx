import type { ReactNode } from 'react'

import FilledHeartIcon from '@/assets/icons/filledHeart.svg?react'
import HeartIcon from '@/assets/icons/heart.svg?react'

interface StockRankItemProps {
  rank?: number
  logo: ReactNode
  name: string
  /** 종가가 아직 수집되지 않았으면 null */
  price: string | null
  changeRate: number | null
  isFavorite?: boolean
  onToggleFavorite?: () => void
  onClick?: () => void
  disabled?: boolean
  disabledMessage?: string
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
  disabled = false,
  disabledMessage,
}: StockRankItemProps) {
  const isUp = (changeRate ?? 0) >= 0

  return (
    <div className="hover:bg-Yellow-105 active:bg-Yellow-105 flex w-full items-center px-5 py-3 transition-colors">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={disabledMessage}
        className="flex flex-1 items-center gap-3 text-left disabled:cursor-not-allowed disabled:opacity-50"
      >
        {rank !== undefined && (
          <span className="dnf-Subtitle3 text-Yellow-30 w-6 text-center">{rank}</span>
        )}

        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full">
          {logo}
        </div>

        <div className="flex flex-col">
          <span className="pretendard-Body2-Semibold text-Yellow-5">{name}</span>

          <div className="flex items-center gap-1">
            {price !== null && changeRate !== null ? (
              <>
                <span className="pretendard-Caption3 text-Gray-5">{price}</span>

                <span className={`pretendard-Caption3 ${isUp ? 'text-Pink-30' : 'text-Green-30'}`}>
                  {isUp ? '+' : ''}
                  {changeRate.toFixed(1)}%
                </span>
              </>
            ) : (
              <span className="pretendard-Caption3 text-Gray-5">가격 정보 준비 중</span>
            )}
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={onToggleFavorite}
        disabled={disabled}
        aria-label={
          disabled && disabledMessage
            ? `${isFavorite ? '관심 종목 해제' : '관심 종목 추가'}: ${disabledMessage}`
            : isFavorite
              ? '관심 종목 해제'
              : '관심 종목 추가'
        }
        title={disabledMessage}
        className="ml-4 flex h-5 w-5 shrink-0 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isFavorite ? (
          <FilledHeartIcon className="text-Yellow-45 h-5 w-5" aria-hidden="true" />
        ) : (
          <HeartIcon className="text-Yellow-45 h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
