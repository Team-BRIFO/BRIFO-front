import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import { ProgressBar } from '@/components/common/ProgressBar'
import type { BadgeProgress } from '@/types/domain/badge'

export interface BadgeProgressCardProps extends HTMLAttributes<HTMLDivElement> {
  progress: BadgeProgress
  /** 카드 제목 (기본: 업적 진행률) */
  title?: string
}

/** 업적 진행률 카드 (획득 수 / 전체 수 + ProgressBar) */
export function BadgeProgressCard({
  progress,
  title = '업적 진행률',
  className = '',
  ...props
}: BadgeProgressCardProps) {
  const { unlockedCount, totalCount } = progress
  const percentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  return (
    <div
      className={twMerge(
        'border-Gray-2 bg-White flex flex-col gap-3 rounded-lg border px-5 py-4',
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="pretendard-Body2-Semibold text-Gray-10">{title}</span>
        <span className="dnf-Caption1 text-Yellow-20">
          {unlockedCount} / {totalCount}
        </span>
      </div>

      <ProgressBar progress={percentage} />
    </div>
  )
}
