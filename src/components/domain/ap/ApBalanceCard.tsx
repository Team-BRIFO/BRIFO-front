import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import { formatWon, getApAmountColorClass } from '@/components/domain/ap/apTransactionMeta'
import type { ApSummary } from '@/types/domain/ap'

/** 잔액 자릿수가 늘어나도 카드 밖으로 밀려나거나 줄바꿈되지 않도록 글자 수에 맞춰 폰트를 단계적으로 줄인다. */
function getBalanceFontClass(text: string) {
  const length = text.length
  if (length <= 7) return 'dnf-Subtitle1'
  if (length <= 8) return 'dnf-Subtitle2'
  if (length <= 10) return 'dnf-Subtitle3'
  if (length <= 13) return 'dnf-Caption1'
  return 'dnf-Caption2'
}

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
        'border-Gray-2 bg-White flex min-h-17.75 items-center gap-2 rounded-lg border px-5 py-4',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="pretendard-Caption3 text-Gray-6 shrink-0 leading-none">보유 자금</span>

        <div className="flex min-w-0 items-baseline justify-between gap-2">
          <p
            className={twMerge(
              getBalanceFontClass(formatWon(balance)),
              'text-Gray-10 flex min-w-0 items-center gap-1.5 leading-none',
            )}
          >
            <span className="truncate">{formatWon(balance)}</span>
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

          {deltaLabel && (
            <div
              className={twMerge(
                'dnf-Caption2 flex min-w-0 shrink-0 items-baseline gap-2 leading-none',
                getApAmountColorClass(delta),
              )}
            >
              <span>{deltaLabel}</span>
              <span className="flex items-baseline gap-0.5">
                {sign && <span>{sign}</span>}
                <span>{formatWon(delta)}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
