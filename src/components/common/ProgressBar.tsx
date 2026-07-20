import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface ProgressBarProps {
  /** 진행률 (0 ~ 100) */
  progress: number

  /** 동그라미(Thumb) 표시 여부 (기본: false) */
  hasThumb?: boolean

  /** 부드러운 애니메이션 적용 여부 (기본: true, 슬라이더 드래그 시 false 권장) */
  isAnimated?: boolean

  /** 프로그레스 바 색상 (기본: bg-Yellow-45) */
  barColor?: string

  /** 트랙(배경) 색상 (기본: bg-Gray-2) */
  trackColor?: string

  /** 바의 높이 (기본값: h-2) */
  heightClassName?: string

  /** 래퍼 추가 스타일 className */
  className?: string

  /** 바 위에 겹쳐 렌더할 오버레이 콘텐츠 (라벨 등) */
  children?: ReactNode
}

export function ProgressBar({
  progress,
  hasThumb = false,
  isAnimated = true,
  barColor = 'bg-Yellow-45',
  trackColor = 'bg-Gray-2',
  heightClassName = 'h-2',
  className = '',
  children,
}: ProgressBarProps) {
  // NaN 방어 로직: 값이 없거나 NaN이면 0으로 처리
  const safeProgress = Number.isNaN(progress) ? 0 : progress
  // 0~100 사이 값으로 클램핑
  const clampedProgress = Math.min(Math.max(safeProgress, 0), 100)

  return (
    <div
      className={twMerge(trackColor, 'relative w-full rounded-full', heightClassName, className)}
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={[
          'absolute top-0 left-0 h-full rounded-[inherit]',
          isAnimated ? 'transition-all duration-300 ease-in-out' : '',
          barColor,
        ]
          .filter(Boolean)
          .join(' ')}
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

      {children && <div className="pointer-events-none absolute inset-0">{children}</div>}
    </div>
  )
}
