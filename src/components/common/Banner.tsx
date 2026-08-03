import type { HTMLAttributes, ReactNode } from 'react'

export type BannerVariant = 'info' | 'success' | 'warning' | 'error' | 'guide'

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode
  description?: ReactNode
  leftIcon?: ReactNode
  action?: ReactNode
  variant?: BannerVariant
  children?: ReactNode
}

interface BannerVariantStyles {
  container: string
  content: string
}

const VARIANT_STYLES: Record<BannerVariant, BannerVariantStyles> = {
  info: {
    container: 'rounded-2xl border-Yellow-60 bg-Yellow-100 py-3 text-Yellow-10',
    content: 'pretendard-Body2-Regular mt-0.5',
  },
  success: {
    container: 'rounded-2xl border-Green-60 bg-Green-100 py-3 text-Green-10',
    content: 'pretendard-Body2-Regular mt-0.5',
  },
  warning: {
    container: 'rounded-2xl border-Yellow-40 bg-Yellow-80 py-3 text-Yellow-5',
    content: 'pretendard-Body2-Regular mt-0.5',
  },
  error: {
    container: 'rounded-2xl border-Pink-50 bg-Pink-100 py-3 text-Pink-30',
    content: 'pretendard-Body2-Regular mt-0.5',
  },
  guide: {
    container: 'rounded-lg border-Yellow-80 bg-Yellow-100 py-3.5 text-Gray-6',
    content: 'pretendard-Caption1 leading-[1.32]',
  },
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
        'flex w-full items-start gap-3 border px-4',
        VARIANT_STYLES[variant].container,
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
          <div className={`${VARIANT_STYLES[variant].content} wrap-break-word text-current`}>
            {content}
          </div>
        )}
      </div>

      {action && <div className="flex shrink-0 items-center">{action}</div>}
    </div>
  )
}
