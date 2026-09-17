import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import Button from '@/components/common/Button'
import { formatWon } from '@/components/domain/ap/apTransactionMeta'
import type { ApSummary } from '@/types/domain/ap'

export interface ApHistorySummaryCardProps extends HTMLAttributes<HTMLDivElement> {
  summary: ApSummary
  /** 충전하기 버튼 클릭 핸들러. 생략하면 버튼을 숨긴다. */
  onChargeClick?: () => void
}

/** 포인트 내역 상단 요약 카드 (보유 포인트 · 이번 달 획득/사용 · 충전하기) — 피그마 Mypage_AP Card */
export function ApHistorySummaryCard({
  summary,
  onChargeClick,
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
        <span className="dnf-Caption2 text-Gray-10 leading-none">보유 포인트</span>
        <p className="dnf-Title4 text-Yellow-30 flex items-start gap-1 leading-none">
          <span>{formatWon(balance)}</span>
        </p>
      </div>
      <p className="pretendard-Caption3 text-Gray-6 leading-none">
        {`이번 달  획득 +${formatWon(earned)}  ·  사용 -${formatWon(lost)}`}
      </p>
      {onChargeClick && (
        <Button size="sm" color="primary" isFullWidth onClick={onChargeClick}>
          충전하기
        </Button>
      )}
    </div>
  )
}
