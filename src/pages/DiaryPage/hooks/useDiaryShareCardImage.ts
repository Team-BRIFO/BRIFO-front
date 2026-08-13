import { toBlob } from 'html-to-image'
import { type RefObject, useCallback, useEffect, useState } from 'react'

export type DiaryShareCardImageState = 'loading' | 'generating' | 'failed' | 'ready'

interface UseDiaryShareCardImageOptions {
  cardRef: RefObject<HTMLDivElement | null>
  /** 렌더링 데이터가 바뀌면 새 PNG가 필요하다. 데이터가 준비 전이면 null. */
  cardKey: string | null
}

async function waitForCardResources(card: HTMLDivElement) {
  const images = Array.from(card.querySelectorAll('img'))
  await Promise.all(
    images.map(async (image) => {
      if (!image.complete) {
        await new Promise<void>((resolve) => {
          image.addEventListener('load', () => resolve(), { once: true })
          image.addEventListener('error', () => resolve(), { once: true })
        })
      }

      try {
        await image.decode?.()
      } catch {
        // decode를 지원하지 않거나 SVG를 브라우저가 바로 디코드하는 경우도 캡처 가능하다.
      }
    }),
  )

  await document.fonts?.ready
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  )
}

/** 화면에 렌더링한 카드를 PNG Blob으로 변환한다. Blob은 저장과 카카오 업로드에서 한 번만 재사용한다. */
export function useDiaryShareCardImage({ cardRef, cardKey }: UseDiaryShareCardImageOptions) {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<DiaryShareCardImageState>('loading')
  const [image, setImage] = useState<Blob | null>(null)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!cardKey || !card) {
      setState('loading')
      setImage(null)
      setError(null)
      return
    }

    let isCurrent = true
    setState('generating')
    setImage(null)
    setError(null)

    void (async () => {
      try {
        await waitForCardResources(card)
        const png = await toBlob(card, {
          backgroundColor: '#fff9e6',
          cacheBust: true,
          height: 418,
          pixelRatio: 2,
          width: 320,
        })
        if (!png) throw new Error('The share card could not be converted to a PNG Blob.')

        if (isCurrent) {
          setImage(png)
          setState('ready')
        }
      } catch (captureError) {
        if (isCurrent) {
          setError(captureError)
          setState('failed')
        }
      }
    })()

    return () => {
      isCurrent = false
    }
  }, [attempt, cardKey, cardRef])

  const retry = useCallback(() => setAttempt((previous) => previous + 1), [])

  return { image, state, error, retry }
}
