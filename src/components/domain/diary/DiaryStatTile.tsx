import { twMerge } from 'tailwind-merge'

import type { DiaryStatItem } from '@/types/domain/diary'

export interface DiaryStatTileProps {
  item: DiaryStatItem
  className?: string
}

/** 통계 요약 타일 1개 (값 + 단위 + 라벨) */
export function DiaryStatTile({ item, className = '' }: DiaryStatTileProps) {
  const { value, unit, label } = item

  return (
    <div
      className={twMerge(
        'bg-White border-Gray-2 flex flex-col gap-1 rounded-lg border px-4 py-3.5',
        'shadow-[0px_0px_10px_0px_color-mix(in_srgb,var(--color-Gray-2)_25%,transparent)]',
        className,
      )}
    >
      <p className="dnf-Subtitle3 text-Gray-10 flex items-start">
        <span>{value}</span>
        {unit && <span>{unit}</span>}
      </p>
      <p className="pretendard-Caption1 text-Gray-6">{label}</p>
    </div>
  )
}
