import { useEffect, useState } from 'react'

/** Lazy route module을 가져오는 동안 표시하는 경량 fallback입니다. */
export function RouteLoadingFallback({ delayMs = 300 }: { delayMs?: number }) {
  const [show, setShow] = useState(delayMs === 0)
  const [prevDelay, setPrevDelay] = useState(delayMs)

  if (delayMs !== prevDelay) {
    setPrevDelay(delayMs)
    setShow(delayMs === 0)
  }

  useEffect(() => {
    if (delayMs === 0) return
    const timer = setTimeout(() => setShow(true), delayMs)
    return () => clearTimeout(timer)
  }, [delayMs])

  if (!show) return null

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="bg-Background1 flex min-h-full flex-1 items-center justify-center"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="border-Yellow-45 h-7 w-7 animate-spin rounded-full border-2 border-t-transparent" />
        <p className="pretendard-Body2-Medium text-Gray-6">화면을 불러오는 중이에요.</p>
      </div>
    </div>
  )
}
