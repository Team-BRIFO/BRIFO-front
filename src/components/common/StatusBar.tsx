import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

import BellIcon from '@/assets/icons/bell.svg?react'
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg?react'

type StatusBarActionButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>

export interface StatusBarProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** OS 상태 영역 표시 여부 */
  hasStatusArea?: boolean
  /** OS 상태 영역 커스텀 콘텐츠 */
  statusArea?: ReactNode
  /** 좌측 영역 */
  left?: ReactNode
  /** 중앙 제목 */
  title?: ReactNode
  /** 우측 영역 */
  right?: ReactNode
  /** 제목 영역 추가 스타일 */
  titleClassName?: string
}

export function StatusBarBackButton({ className = '', ...props }: StatusBarActionButtonProps) {
  return (
    <button
      type="button"
      aria-label="뒤로 가기"
      className={[
        'flex h-6 w-6 shrink-0 items-center justify-center',
        'focus-visible:ring-Yellow-45 focus-visible:ring-2 focus-visible:outline-none',
        '[&_path]:fill-Gray-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <ChevronLeftIcon width={24} height={24} aria-hidden="true" />
    </button>
  )
}

export function StatusBarNotificationButton({
  className = '',
  ...props
}: StatusBarActionButtonProps) {
  return (
    <button
      type="button"
      aria-label="알림"
      className={[
        'flex h-6 w-6 shrink-0 items-center justify-center',
        'focus-visible:ring-Yellow-45 focus-visible:ring-2 focus-visible:outline-none',
        '[&_path]:fill-Black',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <BellIcon width={24} height={24} aria-hidden="true" />
    </button>
  )
}

export function StatusBarSkipButton({
  className = '',
  children = '건너뛰기',
  ...props
}: StatusBarActionButtonProps) {
  return (
    <button
      type="button"
      className={[
        "shrink-0 font-['Inter',var(--font-pretendard)] text-[12px] leading-[15px] font-bold text-[#8A8499]",
        'focus-visible:ring-Yellow-45 focus-visible:ring-2 focus-visible:outline-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}

function renderPlaceholder() {
  return <span className="h-6 w-6 shrink-0" aria-hidden="true" />
}

export function StatusBar({
  hasStatusArea = true,
  statusArea,
  left,
  title,
  right,
  titleClassName = '',
  className = '',
  ...props
}: StatusBarProps) {
  return (
    <header
      className={['bg-White flex w-full flex-col', className].filter(Boolean).join(' ')}
      {...props}
    >
      {hasStatusArea && (
        <div className="flex h-[30px] w-full shrink-0 items-center justify-center">
          {statusArea}
        </div>
      )}

      <div className="relative flex h-[60px] w-full shrink-0 items-center px-4">
        <div className="z-10 flex min-w-6 items-center justify-start">
          {left ?? renderPlaceholder()}
        </div>

        {title && (
          <div className="pointer-events-none absolute inset-x-0 flex justify-center px-16">
            <h1
              className={['pretendard-Body1-Semibold text-Gray-8 truncate', titleClassName]
                .filter(Boolean)
                .join(' ')}
            >
              {title}
            </h1>
          </div>
        )}

        <div className="z-10 ml-auto flex min-w-6 items-center justify-end">
          {right ?? renderPlaceholder()}
        </div>
      </div>
    </header>
  )
}
