import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import {
  formatApTransactionDateTime,
  getApAmountColorClass,
} from '@/components/domain/ap/apTransactionMeta'
import type { ApTransaction } from '@/types/domain/ap'

export interface ApTransactionRowProps extends HTMLAttributes<HTMLLIElement> {
  transaction: ApTransaction
}

/** AP 입출금 내역 한 행 (사유 · 날짜 · 증감) — 피그마 h-65 / px-16 py-14 */
export function ApTransactionRow({ transaction, className = '', ...props }: ApTransactionRowProps) {
  const { label, amount, createdAt } = transaction
  const { date, time } = formatApTransactionDateTime(createdAt)
  const sign = amount > 0 ? '+' : amount < 0 ? '-' : ''

  return (
    <li
      className={twMerge(
        'border-Gray-2 bg-White flex h-16.25 items-center justify-between gap-3 border-b px-4 py-3.5 last:border-b-0',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="pretendard-Body2-Semibold text-Gray-10 truncate">{label}</span>
        <div className="pretendard-Caption3 text-Gray-6 flex items-center gap-1 leading-none">
          <span>{date}</span>
          {time && <span>{time}</span>}
        </div>
      </div>

      <span
        className={twMerge(
          'dnf-Caption2 flex shrink-0 items-center gap-1 leading-none',
          getApAmountColorClass(amount),
        )}
      >
        {sign && <span>{sign}</span>}
        <span>{Math.abs(amount).toLocaleString()}</span>
        <span>AP</span>
      </span>
    </li>
  )
}
