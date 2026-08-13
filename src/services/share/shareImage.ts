export type ShareImageErrorCode = 'FETCH_FAILED' | 'INVALID_RESPONSE' | 'DOWNLOAD_FAILED'

export class ShareImageError extends Error {
  readonly code: ShareImageErrorCode

  constructor(code: ShareImageErrorCode, message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'ShareImageError'
    this.code = code
  }
}

/** 서버가 준 공유 이미지 URL을 저장에 쓸 수 있는 Blob으로 바꾼다. */
export async function fetchShareImageBlob(shareImageUrl: string) {
  let response: Response

  try {
    response = await fetch(shareImageUrl)
  } catch (cause) {
    throw new ShareImageError(
      'FETCH_FAILED',
      '공유 이미지를 가져오지 못했어요. 네트워크 연결 또는 이미지 접근 권한을 확인한 뒤 다시 시도해 주세요.',
      { cause },
    )
  }

  if (!response.ok) {
    throw new ShareImageError(
      'INVALID_RESPONSE',
      '공유 이미지를 가져오지 못했어요. 잠시 후 다시 시도해 주세요.',
    )
  }

  try {
    const image = await response.blob()
    const mimeType = image.type.split(';', 1)[0]?.trim().toLowerCase()
    if (image.size === 0 || mimeType !== 'image/png') {
      throw new Error('The response body is not a PNG image.')
    }

    return image
  } catch (cause) {
    throw new ShareImageError(
      'INVALID_RESPONSE',
      '공유 이미지가 PNG 형식인지 확인하지 못했어요. 잠시 후 다시 시도해 주세요.',
      { cause },
    )
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
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0)
    }
  } catch (cause) {
    throw new ShareImageError(
      'DOWNLOAD_FAILED',
      '이미지를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.',
      { cause },
    )
  }
}
