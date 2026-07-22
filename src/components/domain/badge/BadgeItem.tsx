import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import StarIcon from '@/assets/icons/star.svg?react'
import type { Badge } from '@/types/domain/badge'

export interface BadgeItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  badge: Badge
  /**
   * 배지 전용 아이콘.
   * TODO: 배지 아이콘 에셋(iconKey → SVG) 확정 전까지는 미전달 시 기본 아이콘으로 대체된다.
   */
  icon?: ReactNode
  /** 아이콘 원 크기(px). 기본 56 */
  size?: number
}

/** 업적 배지 한 개 (획득/미획득 상태) */
export function BadgeItem({ badge, icon, size = 56, className = '', ...props }: BadgeItemProps) {
  const { name, isUnlocked } = badge

  return (
    <button
      type="button"
      aria-label={`${name} ${isUnlocked ? '획득' : '미획득'}`}
      className={twMerge(
        'flex flex-col items-center gap-2',
        'focus-visible:ring-Yellow-45 rounded-lg focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      <span
        style={{ width: size, height: size }}
        className={twMerge(
          'flex shrink-0 items-center justify-center rounded-full',
          isUnlocked ? 'bg-Yellow-80' : 'bg-Gray-1',
        )}
      >
        <span
          className={twMerge(
            '[&_svg]:h-7 [&_svg]:w-7',
            isUnlocked ? '[&_path]:fill-Yellow-20' : '[&_path]:fill-Gray-4',
          )}
        >
          {icon ?? <StarIcon aria-hidden="true" />}
        </span>
      </span>

      <span
        className={twMerge(
          'pretendard-Caption1 line-clamp-2 text-center',
          isUnlocked ? 'text-Gray-10' : 'text-Gray-5',
        )}
      >
        {name}
      </span>
    </button>
  )
}
