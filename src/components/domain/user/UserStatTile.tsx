import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export interface UserStatTileProps extends HTMLAttributes<HTMLDivElement> {
  /** 지표 값 (예: 87) */
  value: number | string
  /** 값 뒤 단위 (예: %, 건, 일) */
  unit?: string
  /** 지표 이름 (예: 적중률) */
  label: string
}

/** 마이 메인 요약 지표 타일 (적중률 / 누적결정 / 연속출석 공용) */
export function UserStatTile({ value, unit, label, className = '', ...props }: UserStatTileProps) {
  const displayValue = typeof value === 'number' ? value.toLocaleString() : value

  return (
    <div
      className={twMerge(
        'border-Gray-2 bg-White flex flex-1 flex-col items-center justify-center gap-1 rounded-lg border px-4 py-3.5',
        'shadow-[0px_0px_5px_0px_rgba(230,230,230,0.25)]',
        className,
      )}
      {...props}
    >
      <p className="dnf-Subtitle3 text-Gray-10 flex items-start justify-center leading-none">
        <span>{displayValue}</span>
        {unit != null && unit !== '' && <span>{unit}</span>}
      </p>
      <p className="pretendard-Caption1 text-Gray-6 leading-[1.32]">{label}</p>
    </div>
  )
}
