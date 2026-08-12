import { type ReactNode, useLayoutEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface AdaptiveScrollAreaProps {
  children: ReactNode
  className?: string
  contentClassName?: string
}

/** 콘텐츠가 영역을 넘칠 때만 세로 스크롤 허용 */
export default function AdaptiveScrollArea({
  children,
  className = '',
  contentClassName = '',
}: AdaptiveScrollAreaProps) {
  const containerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [canScroll, setCanScroll] = useState(false)

  useLayoutEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    const updateScrollState = () => {
      setCanScroll(content.scrollHeight > container.clientHeight)
    }

    updateScrollState()

    const observer = new ResizeObserver(updateScrollState)
    observer.observe(container)
    observer.observe(content)

    return () => observer.disconnect()
  }, [children])

  return (
    <section
      ref={containerRef}
      className={twMerge(
        'min-h-0 flex-1',
        canScroll ? 'overflow-y-auto overscroll-y-contain' : 'overflow-hidden',
        className,
      )}
    >
      <div className={canScroll ? undefined : 'grid min-h-full place-content-center'}>
        <div
          ref={contentRef}
          className={twMerge(
            'flex w-full flex-col items-center text-center',
            canScroll ? 'py-6' : undefined,
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
    </section>
  )
}
