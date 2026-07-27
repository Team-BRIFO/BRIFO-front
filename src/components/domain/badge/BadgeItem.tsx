import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import FilledHeartIcon from '@/assets/icons/filled-heart.svg?react'
import type { Badge } from '@/types/domain/badge'

export interface BadgeItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  badge: Badge
  /**
   * 배지 전용 아이콘.
   * TODO: 배지 아이콘 에셋(iconKey → SVG) 확정 전까지는 미전달 시 기본 아이콘으로 대체된다.
   */
  icon?: ReactNode
  /** 아이콘 원 크기(px). 기본 60 (피그마) */
  size?: number
}

/** 업적 배지 한 개 (획득/미획득 상태) — 피그마 업적 */
export function BadgeItem({ badge, icon, size = 60, className = '', ...props }: BadgeItemProps) {
  const { name, isUnlocked } = badge

  return (
    <button
      type="button"
      aria-label={`${name} ${isUnlocked ? '획득' : '미획득'}`}
      className={twMerge(
        'flex w-15 flex-col items-center gap-2',
        'focus-visible:ring-Yellow-45 rounded-lg focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      <span
        style={{ width: size, height: size }}
        className={twMerge(
          'flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-solid',
          isUnlocked ? 'border-Yellow-60 bg-Yellow-100' : 'border-Gray-2 bg-Gray-1',
        )}
      >
        <span
          className={twMerge(
            'flex size-8 items-center justify-center [&_svg]:size-8',
            isUnlocked ? '[&_path]:fill-Yellow-40' : '[&_path]:fill-Gray-4',
          )}
        >
          {icon ?? <FilledHeartIcon aria-hidden="true" />}
        </span>
      </span>

      <span
        className={twMerge(
          'pretendard-Body2-Semibold line-clamp-1 w-full text-center',
          isUnlocked ? 'text-Gray-10' : 'text-Gray-5',
        )}
      >
        {name}
      </span>
    </button>
  )
}
