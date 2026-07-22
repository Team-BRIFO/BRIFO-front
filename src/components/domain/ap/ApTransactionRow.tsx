import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import type { ApTransaction } from '@/types/domain/ap'

import { formatApTransactionDate, formatSignedAp, getApAmountColorClass } from './apTransactionMeta'

export interface ApTransactionRowProps extends HTMLAttributes<HTMLLIElement> {
  transaction: ApTransaction
}

/** AP 입출금 내역 한 행 (사유 · 날짜 · 증감) */
export function ApTransactionRow({ transaction, className = '', ...props }: ApTransactionRowProps) {
  const { label, amount, createdAt } = transaction

  return (
    <li
      className={twMerge(
        'border-Gray-2 flex items-center justify-between gap-3 border-t px-4 py-3 first:border-t-0',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <span className="pretendard-Body2-Semibold text-Gray-10 truncate">{label}</span>
        <span className="pretendard-Caption4 text-Gray-5">
          {formatApTransactionDate(createdAt)}
        </span>
      </div>

      <span className={twMerge('dnf-Caption1 shrink-0', getApAmountColorClass(amount))}>
        {formatSignedAp(amount)}
      </span>
    </li>
  )
}
