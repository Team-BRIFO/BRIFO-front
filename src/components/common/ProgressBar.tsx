export interface ProgressBarProps {
  /** 진행률 (0 ~ 100) */
  progress: number

  /** 동그라미(Thumb) 표시 여부 (기본: false) */
  hasThumb?: boolean

  /** 프로그레스 바 색상 (기본: bg-Yellow-45) */
  barColor?: string

  /** 바의 높이 (기본값: h-2) */
  heightClassName?: string

  /** 래퍼 추가 스타일 className */
  className?: string
}

export function ProgressBar({
  progress,
  hasThumb = false,
  barColor = 'bg-Yellow-45',
  heightClassName = 'h-2',
  className = '',
}: ProgressBarProps) {
  // 0~100 사이 값으로 클램핑
  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <div
      className={['bg-Gray-2 relative w-full rounded-full', heightClassName, className]
        .filter(Boolean)
        .join(' ')}
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={[
          'absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-in-out',
          barColor,
        ].join(' ')}
        style={{ width: `${clampedProgress}%` }}
      >
        {hasThumb && (
          <div
            className={[
              'absolute top-1/2 right-0 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full shadow',
              barColor,
            ].join(' ')}
          />
        )}
      </div>
    </div>
  )
}
