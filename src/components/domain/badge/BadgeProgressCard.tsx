import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import { ProgressBar } from '@/components/common/ProgressBar'
import type { BadgeProgress } from '@/types/domain/badge'

export interface BadgeProgressCardProps extends HTMLAttributes<HTMLDivElement> {
  progress: BadgeProgress
  /** 카드 제목 (기본: 획득한 배지) */
  title?: string
}

/** 업적 진행률 카드 — 피그마 업적 프로그래스 */
export function BadgeProgressCard({
  progress,
  title = '획득한 배지',
  className = '',
  ...props
}: BadgeProgressCardProps) {
  const { unlockedCount, totalCount } = progress
  const percentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  return (
    <div
      className={twMerge(
        'border-Gray-2 bg-White flex flex-col gap-4 overflow-hidden rounded-lg border px-5 py-4.5',
        className,
      )}
      {...props}
    >
      <div className="flex items-end justify-between leading-none">
        <span className="dnf-Caption2 text-Gray-10">{title}</span>
        <span className="pretendard-Caption3 text-Gray-6">
          {unlockedCount}/{totalCount}
        </span>
      </div>

      <ProgressBar
        progress={percentage}
        heightClassName="h-2.5"
        barColor="bg-Yellow-50"
        trackColor="bg-Gray-2"
      />
    </div>
  )
}
