import type { HTMLAttributes, ReactNode } from 'react'

export type BannerVariant = 'info' | 'success' | 'warning' | 'error'

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode
  description?: ReactNode
  leftIcon?: ReactNode
  action?: ReactNode
  variant?: BannerVariant
  children?: ReactNode
}

const variantStyles: Record<BannerVariant, string> = {
  info: 'border-Yellow-60 bg-Yellow-100 text-Yellow-10',
  success: 'border-Green-60 bg-Green-100 text-Green-10',
  warning: 'border-Yellow-40 bg-Yellow-80 text-Yellow-5',
  error: 'border-Pink-50 bg-Pink-100 text-Pink-30',
}

export function Banner({
  title,
  description,
  leftIcon,
  action,
  variant = 'info',
  className = '',
  children,
  ...props
}: BannerProps) {
  const content = children ?? description

  return (
    <div
      role="status"
      className={[
        'flex w-full items-start gap-3 rounded-2xl border px-4 py-3',
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {leftIcon && <span className="mt-0.5 flex shrink-0 items-center">{leftIcon}</span>}

      <div className="min-w-0 flex-1">
        {title && <p className="pretendard-Body2-Semibold truncate">{title}</p>}
        {content && (
          <div className="pretendard-Body2-Regular mt-0.5 wrap-break-word text-current">
            {content}
          </div>
        )}
      </div>

      {action && <div className="flex shrink-0 items-center">{action}</div>}
    </div>
  )
}
