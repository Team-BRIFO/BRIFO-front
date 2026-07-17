import type { HTMLAttributes, ReactNode } from 'react'

export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'danger'
export type BadgeSize = 'sm' | 'md' | 'lg'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral: 'bg-Gray-1 text-Gray-7',
  primary: 'bg-Yellow-100 text-Yellow-20',
  success: 'bg-Green-100 text-Green-20',
  danger: 'bg-Pink-100 text-Pink-30',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'h-5 px-2 pretendard-Caption2',
  md: 'h-6 px-2.5 pretendard-Caption1',
  lg: 'h-7 px-3.5 pretendard-Caption1',
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex w-fit shrink-0 items-center justify-center rounded-full whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}
