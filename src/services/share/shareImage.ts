export type ShareImageErrorCode = 'DOWNLOAD_FAILED'

export class ShareImageError extends Error {
  readonly code: ShareImageErrorCode

  constructor(code: ShareImageErrorCode, message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'ShareImageError'
    this.code = code
  }
}

/** 운영체제별로 문제가 되는 파일명 문자를 제거해 예측 가능한 PNG 이름을 만든다. */
export function createDiaryShareImageFilename(stockName: string) {
  const normalizedStockName = stockName
    .trim()
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, '-')
  const suffix = normalizedStockName || 'decision'

  return `brifo-decision-card-${suffix}.png`
}

/** Blob을 실제 파일 다운로드로 연결하고 Object URL을 다음 태스크에서 해제한다. */
export function downloadShareImage(image: Blob, filename: string) {
  try {
    const objectUrl = URL.createObjectURL(image)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = filename
    link.style.display = 'none'
    document.body.append(link)

    try {
      link.click()
    } finally {
      // 일부 모바일 브라우저는 클릭 직후 앵커를 제거하면 다운로드를 취소한다.
      // 파일 저장이 시작될 시간을 준 뒤 링크와 Object URL을 함께 정리한다.
      window.setTimeout(() => {
        link.remove()
        URL.revokeObjectURL(objectUrl)
      }, 1_000)
    }
  } catch (cause) {
    throw new ShareImageError(
      'DOWNLOAD_FAILED',
      '이미지를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.',
      { cause },
    )
  }
}
