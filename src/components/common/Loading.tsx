export interface LoadingProps {
  /** 인디케이터 크기 */
  size?: 'sm' | 'md' | 'lg'

  /** 추가 스타일 className */
  className?: string
}

const SIZE_MAP = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-3 h-3',
}

export function Loading({ size = 'md', className = '' }: LoadingProps) {
  const dotSize = SIZE_MAP[size]

  return (
    <div
      className={['flex items-center justify-center gap-1.5', className].filter(Boolean).join(' ')}
      role="status"
      aria-label="Loading"
    >
      <div
        className={[dotSize, 'bg-Gray-6 animate-pulse rounded-full'].join(' ')}
        style={{ animationDelay: '0ms', animationDuration: '1.5s' }}
      />
      <div
        className={[dotSize, 'bg-Gray-6 animate-pulse rounded-full'].join(' ')}
        style={{ animationDelay: '300ms', animationDuration: '1.5s' }}
      />
      <div
        className={[dotSize, 'bg-Gray-6 animate-pulse rounded-full'].join(' ')}
        style={{ animationDelay: '600ms', animationDuration: '1.5s' }}
      />
    </div>
  )
}
