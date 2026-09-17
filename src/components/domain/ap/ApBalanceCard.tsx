import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import { formatWon, getApAmountColorClass } from '@/components/domain/ap/apTransactionMeta'
import type { ApSummary } from '@/types/domain/ap'

export interface ApBalanceCardProps extends HTMLAttributes<HTMLDivElement> {
  summary: ApSummary
  /**
   * 우측 증감에 붙는 기간 라벨 (예: 이번주).
   * 집계 기간이 화면마다 달라질 수 있어 데이터로 받는다. 생략하면 증감 영역을 숨긴다.
   */
  deltaLabel?: string
  /** 잔액 옆 "+" 충전 버튼 클릭 핸들러. 생략하면 버튼을 숨긴다. */
  onChargeClick?: () => void
}

/** 보유 자금 + 기간 내 증감 카드 (마이 메인 · 자금 내역 상단) */
export function ApBalanceCard({
  summary,
  deltaLabel,
  onChargeClick,
  className = '',
  ...props
}: ApBalanceCardProps) {
  const { balance, earned, lost } = summary
  const delta = earned - lost

  const sign = delta > 0 ? '+' : delta < 0 ? '-' : ''

  return (
    <div
      className={twMerge(
        'border-Gray-2 bg-White flex h-17.75 items-center justify-between rounded-lg border px-5 py-4',
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-2">
        <span className="pretendard-Caption3 text-Gray-6 leading-none">보유 자금</span>
        <p className="dnf-Subtitle1 text-Gray-10 flex items-center gap-1.5 leading-none">
          <span>{formatWon(balance)}</span>
          {onChargeClick && (
            <button
              type="button"
              onClick={onChargeClick}
              aria-label="자금 충전하기"
              className="bg-Pink-30 text-White flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs leading-none font-bold"
            >
              +
            </button>
          )}
        </p>
      </div>

      {deltaLabel && (
        <div
          className={twMerge(
            'dnf-Caption2 flex items-center gap-2 leading-none',
            getApAmountColorClass(delta),
          )}
        >
          <span>{deltaLabel}</span>
          <span className="flex items-center gap-0.5">
            {sign && <span>{sign}</span>}
            <span>{formatWon(delta)}</span>
          </span>
        </div>
      )}
    </div>
  )
}
