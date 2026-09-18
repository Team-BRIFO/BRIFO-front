import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import { formatWon } from '@/components/domain/ap/apTransactionMeta'
import { MAX_ALLOCATION_RATE_PERCENT } from '@/types/domain/decision'

const PRESET_RATE_PERCENTS = [10, 20, 30, 40]
/** 정산 시 방향 적중 시 배분금에 곱해 지급하는 배당 배율 (서버 DecisionSettlementCalculator와 동일한 값) */
const PAYOUT_MULTIPLIER = 2

export interface AllocationAmountSectionProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange'
> {
  /** 현재 선택된 배분 금액 (부모에서 제어) */
  value: number
  /** 배분 금액 변경 콜백 */
  onChange: (value: number) => void
  /** 보유 자금 (배분 상한 계산에 사용) */
  balance: number
}

export function AllocationAmountSection({
  value,
  onChange,
  balance,
  className,
  ...props
}: AllocationAmountSectionProps) {
  const maxAllocatableAp = Math.floor((balance * MAX_ALLOCATION_RATE_PERCENT) / 100)
  const isOverLimit = value > maxAllocatableAp
  const expectedReward = value * PAYOUT_MULTIPLIER

  const handleCustomAmountChange = (raw: string) => {
    const digitsOnly = raw.replace(/[^0-9]/g, '')
    onChange(digitsOnly ? Number(digitsOnly) : 0)
  }

  return (
    <div className={twMerge('flex w-full flex-col items-stretch gap-3', className)} {...props}>
      <span className="pretendard-Button1 text-Gray-10">자산 배분</span>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-4 gap-2">
          {PRESET_RATE_PERCENTS.map((ratePercent) => {
            const presetAp = Math.floor((balance * ratePercent) / 100)
            return (
              <button
                key={ratePercent}
                type="button"
                onClick={() => onChange(presetAp)}
                className={`dnf-Caption1 rounded-lg border px-2 py-3 text-center ${
                  value === presetAp
                    ? 'border-Yellow-45 bg-Yellow-90 text-Yellow-40'
                    : 'border-Gray-2 bg-White text-Gray-9'
                }`}
              >
                {ratePercent}%
              </button>
            )
          })}
        </div>

        <input
          type="text"
          inputMode="numeric"
          placeholder="배분할 금액을 직접 입력하세요"
          value={value === 0 ? '' : String(value)}
          onChange={(event) => handleCustomAmountChange(event.target.value)}
          className="border-Gray-2 dnf-Caption1 text-Gray-10 rounded-lg border px-4 py-3 outline-none"
        />

        {isOverLimit ? (
          <p role="alert" className="pretendard-Caption1 text-Pink-30 text-center">
            보유 자금의 {MAX_ALLOCATION_RATE_PERCENT}%인 {formatWon(maxAllocatableAp)}까지만 배분할
            수 있어요.
          </p>
        ) : (
          <span className="pretendard-Caption1 text-Gray-6 text-center">
            배분 {formatWon(value)} · 적중 시 +{formatWon(expectedReward)} · 오답 시 전액 소실
          </span>
        )}
      </div>
    </div>
  )
}
