import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import type { ApSummary } from '@/types/domain/ap'

import { formatSignedAp, getApAmountColorClass } from './apTransactionMeta'

export interface ApBalanceCardProps extends HTMLAttributes<HTMLDivElement> {
  summary: ApSummary
  /**
   * 우측 증감에 붙는 기간 라벨 (예: 이번주).
   * 집계 기간이 화면마다 달라질 수 있어 데이터로 받는다. 생략하면 증감 영역을 숨긴다.
   */
  deltaLabel?: string
}

/** 보유 AP + 기간 내 증감 카드 (마이 메인 · AP 내역 상단) */
export function ApBalanceCard({
  summary,
  deltaLabel,
  className = '',
  ...props
}: ApBalanceCardProps) {
  const { balance, earned, lost } = summary
  const delta = earned - lost

  return (
    <div
      className={twMerge(
        'border-Gray-2 bg-White flex items-center justify-between rounded-lg border px-5 py-4',
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-2">
        <span className="pretendard-Caption3 text-Gray-6">보유AP</span>
        <p className="dnf-Subtitle1 text-Gray-10 flex items-center gap-1">
          <span>{balance.toLocaleString()}</span>
          <span>AP</span>
        </p>
      </div>

      {deltaLabel && (
        <div className={twMerge('flex items-center gap-2', getApAmountColorClass(delta))}>
          <span className="dnf-Caption2">{deltaLabel}</span>
          <span className="dnf-Caption2">{formatSignedAp(delta)}</span>
        </div>
      )}
    </div>
  )
}
