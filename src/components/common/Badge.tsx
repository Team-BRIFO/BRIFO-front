import type { HTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export type BadgeType =
  | 'normal'
  | 'gray'
  | 'hash'
  | 'tag'
  | 'rise'
  | 'watch'
  | 'fall'
  | 'error'
  | 'ap'
  | 'complete'
  | 'progress'
  | 'hot'
  | 'stock-rise'
  | 'stock-fall'
  | 'rookie-complete'
  | 'rookie-progress'
  | 'pro-complete'
  | 'pro-progress'
  | 'tanker-complete'
  | 'tanker-progress'

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface BadgeStyle {
  className: string
  size: BadgeSize
  indicatorClassName?: string
}

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  children: string | number
  type?: BadgeType
  size?: BadgeSize
  left?: ReactNode
  right?: ReactNode
  contentClassName?: string
}

const BADGE_STYLES: Record<BadgeType, BadgeStyle> = {
  normal: {
    className: 'bg-Yellow-100 text-Yellow-10',
    size: 'lg',
  },
  gray: {
    className: 'bg-Background1 text-Gray-5',
    size: 'lg',
  },
  hash: {
    className: 'bg-Yellow-100 text-Yellow-10',
    size: 'lg',
  },
  tag: {
    className: 'bg-transparent text-Gray-6',
    size: 'xs',
  },
  rise: {
    className: 'bg-Pink-60 text-Pink-30',
    size: 'sm',
  },
  watch: {
    className: 'bg-Background1 text-Gray-5',
    size: 'sm',
  },
  fall: {
    className: 'bg-Green-100 text-Green-30',
    size: 'sm',
  },
  error: {
    className: 'bg-Pink-30 text-Pink-100',
    size: 'sm',
  },
  ap: {
    className: 'dnf-Caption1 bg-Pink-60 text-Pink-30',
    size: 'xl',
  },
  complete: {
    className: 'bg-Pink-60 text-Pink-30',
    size: 'lg',
  },
  progress: {
    className: 'bg-Background1 text-Gray-5',
    size: 'lg',
  },
  hot: {
    className: 'bg-Pink-40 text-Yellow-105',
    size: 'lg',
  },
  'stock-rise': {
    className: 'bg-Gray-2 text-Pink-30',
    size: 'md',
  },
  'stock-fall': {
    className: 'bg-Gray-2 text-Green-30',
    size: 'md',
  },
  'rookie-complete': {
    className: 'bg-Pink-50 text-Pink-10',
    size: 'md',
    indicatorClassName: 'bg-Pink-40',
  },
  'rookie-progress': {
    className: 'bg-Gray-3 text-Gray-7',
    size: 'md',
    indicatorClassName: 'bg-Gray-5',
  },
  'pro-complete': {
    className: 'bg-Yellow-45 text-Yellow-5',
    size: 'md',
    indicatorClassName: 'bg-Yellow-20',
  },
  'pro-progress': {
    className: 'bg-Gray-3 text-Gray-7',
    size: 'md',
    indicatorClassName: 'bg-Gray-5',
  },
  'tanker-complete': {
    className: 'bg-Green-40 text-Green-5',
    size: 'md',
    indicatorClassName: 'bg-Green-10',
  },
  'tanker-progress': {
    className: 'bg-Gray-3 text-Gray-7',
    size: 'md',
    indicatorClassName: 'bg-Gray-5',
  },
}

const SIZE_STYLES: Record<BadgeSize, string> = {
  xs: 'h-3 px-0 pretendard-Caption1 gap-0.5',
  sm: 'h-4 px-2 pretendard-Caption1',
  md: 'h-5 px-2 pretendard-Caption1 gap-1',
  lg: 'h-6 px-3 pretendard-Caption1',
  xl: 'h-[1.625rem] px-3 pretendard-Caption1',
}

const INDICATOR_SIZE_STYLES: Record<BadgeSize, string> = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-2.5 w-2.5',
  xl: 'h-2.5 w-2.5',
}

const ICON_SIZE_STYLES: Record<BadgeSize, string> = {
  xs: 'h-2.5 w-2.5 [&_svg]:h-2.5 [&_svg]:w-2.5',
  sm: 'h-3 w-3 [&_svg]:h-3 [&_svg]:w-3',
  md: 'h-3.5 w-3.5 [&_svg]:h-3.5 [&_svg]:w-3.5',
  lg: 'h-4 w-4 [&_svg]:h-4 [&_svg]:w-4',
  xl: 'h-4 w-4 [&_svg]:h-4 [&_svg]:w-4',
}

export function Badge({
  children,
  type = 'normal',
  size,
  left,
  right,
  contentClassName = '',
  className = '',
  ...props
}: BadgeProps) {
  const badgeStyle = BADGE_STYLES[type]
  const badgeSize = size ?? badgeStyle.size
  const sizeStyle = SIZE_STYLES[badgeSize]

  const renderContent = (content: ReactNode) => {
    if (content == null || content === false) return null

    return (
      <span
        className={twMerge(
          'inline-flex shrink-0 items-center justify-center',
          ICON_SIZE_STYLES[badgeSize],
          contentClassName,
        )}
      >
        {content}
      </span>
    )
  }

  return (
    <span
      className={twMerge(
        'inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-full whitespace-nowrap',
        sizeStyle,
        badgeStyle.className,
        className,
      )}
      {...props}
    >
      {badgeStyle.indicatorClassName && (
        <span
          className={twMerge(
            'shrink-0 rounded-full',
            INDICATOR_SIZE_STYLES[badgeSize],
            badgeStyle.indicatorClassName,
          )}
          aria-hidden="true"
        />
      )}
      {renderContent(left)}
      {children}
      {renderContent(right)}
    </span>
  )
}
