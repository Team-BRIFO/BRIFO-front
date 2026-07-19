import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export interface AgentStatCardProps extends HTMLAttributes<HTMLDivElement> {
  /** 값 (예: 64, "1,240") */
  value: string | number
  /** 단위 (예: %, 건, 일) */
  unit?: string
  /** 라벨 (예: 적중률) */
  label: string
}

/** 사원 상세 통계 단일 카드 (값+단위 / 라벨) */
export function AgentStatCard({
  value,
  unit,
  label,
  className = '',
  ...props
}: AgentStatCardProps) {
  return (
    <div
      className={twMerge(
        'border-Gray-2 bg-White flex flex-col items-center gap-1 rounded-lg border px-4 py-3.5',
        'shadow-[0px_0px_10px_0px_color-mix(in_srgb,var(--color-Gray-2)_25%,transparent)]',
        className,
      )}
      {...props}
    >
      <div className="dnf-Subtitle3 text-Gray-10 flex items-baseline">
        <span>{value}</span>
        {unit && <span>{unit}</span>}
      </div>
      <span className="pretendard-Caption1 text-Gray-6">{label}</span>
    </div>
  )
}
