import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import type { ApSummary } from '@/types/domain/ap'

export interface ApHistorySummaryCardProps extends HTMLAttributes<HTMLDivElement> {
  summary: ApSummary
}

/** AP 내역 상단 요약 카드 (보유 AP · 이번 달 획득/사용) — 피그마 Mypage_AP Card */
export function ApHistorySummaryCard({
  summary,
  className = '',
  ...props
}: ApHistorySummaryCardProps) {
  const { balance, earned, lost } = summary

  return (
    <div
      className={twMerge(
        'border-Gray-2 bg-Yellow-105 flex flex-col gap-3 rounded-lg border px-5 py-4',
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-2">
        <span className="dnf-Caption2 text-Gray-10 leading-none">보유 AP</span>
        <p className="dnf-Title4 text-Yellow-30 flex items-start gap-1 leading-none">
          <span>{balance.toLocaleString()}</span>
          <span>AP</span>
        </p>
      </div>
      <p className="pretendard-Caption3 text-Gray-6 leading-none">
        {`이번 달  획득 +${earned.toLocaleString()}  ·  사용 -${lost.toLocaleString()}`}
      </p>
    </div>
  )
}
