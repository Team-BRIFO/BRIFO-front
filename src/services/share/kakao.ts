import { KAKAO_JAVASCRIPT_SDK } from '@/constants/kakao'

export type KakaoSdkErrorCode = 'MISSING_JAVASCRIPT_KEY' | 'LOAD_FAILED' | 'INITIALIZATION_FAILED'

export class KakaoSdkError extends Error {
  readonly code: KakaoSdkErrorCode

  constructor(code: KakaoSdkErrorCode, message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'KakaoSdkError'
    this.code = code
  }
}

export interface KakaoSdk {
  init: (javascriptKey: string) => void
  isInitialized: () => boolean
  Share?: {
    sendDefault: (template: unknown) => void | Promise<void>
  }
}

export interface KakaoDiaryShareTemplateOptions {
  stockName: string
  shareImageUrl: string
  diaryUrl: string
}

declare global {
  interface Window {
    Kakao?: KakaoSdk
  }
}

let sdkLoadPromise: Promise<KakaoSdk> | null = null

export function getKakaoJavascriptKey() {
  return import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY?.trim() || undefined
}

/**
 * 카카오톡 메시지 링크에 쓸 공개 웹 주소를 만든다.
 * 로컬호스트는 Kakao Product Link의 웹 도메인으로 사용할 수 없으므로 개발 시 공개 테스트 주소를 별도로 받는다.
 */
export function getKakaoShareWebUrl(pathname: string) {
  const configuredOrigin = import.meta.env.VITE_KAKAO_SHARE_WEB_URL?.trim()
  const fallbackOrigin = typeof window === 'undefined' ? undefined : window.location.origin
  const baseOrigin = configuredOrigin || fallbackOrigin

  if (!baseOrigin) return undefined

  try {
    const baseUrl = new URL(baseOrigin)
    const isLoopback = ['localhost', '127.0.0.1', '[::1]', '::1'].includes(baseUrl.hostname)
    if (isLoopback) return undefined

    return new URL(pathname, baseUrl).toString()
  } catch {
    return undefined
  }
}

function initializeKakaoSdk(javascriptKey: string) {
  const kakao = window.Kakao
  if (!kakao) {
    throw new KakaoSdkError(
      'LOAD_FAILED',
      '카카오톡 공유 도구를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
    )
  }

  try {
    if (!kakao.isInitialized()) kakao.init(javascriptKey)

    if (!kakao.isInitialized()) {
      throw new Error('Kakao SDK did not initialize.')
    }
  } catch (cause) {
    throw new KakaoSdkError(
      'INITIALIZATION_FAILED',
      '카카오톡 공유를 준비하지 못했어요. JavaScript 키와 등록 도메인을 확인해 주세요.',
      { cause },
    )
  }

  return kakao
}

/**
 * 공식 Kakao JavaScript SDK를 한 번만 로드하고 JavaScript 키로 초기화한다.
 * OAuth Client ID는 이 함수에 사용하지 않는다.
 */
export function loadKakaoJavascriptSdk(
  javascriptKey: string | undefined = getKakaoJavascriptKey(),
) {
  if (!javascriptKey) {
    return Promise.reject(
      new KakaoSdkError(
        'MISSING_JAVASCRIPT_KEY',
        '카카오 JavaScript 키가 설정되지 않았어요. 배포 환경 설정을 확인해 주세요.',
      ),
    )
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.reject(
      new KakaoSdkError('LOAD_FAILED', '카카오톡 공유는 브라우저에서만 사용할 수 있어요.'),
    )
  }

  if (window.Kakao) {
    try {
      return Promise.resolve(initializeKakaoSdk(javascriptKey))
    } catch (error) {
      return Promise.reject(error)
    }
  }

  if (sdkLoadPromise) return sdkLoadPromise

  const existingScript = document.getElementById(KAKAO_JAVASCRIPT_SDK.scriptId)
  const script =
    existingScript instanceof HTMLScriptElement ? existingScript : document.createElement('script')
  const isNewScript = !existingScript

  sdkLoadPromise = new Promise<KakaoSdk>((resolve, reject) => {
    const cleanUp = () => {
      script.onload = null
      script.onerror = null
    }

    script.onload = () => {
      cleanUp()
      try {
        resolve(initializeKakaoSdk(javascriptKey))
      } catch (error) {
        reject(error)
      }
    }

    script.onerror = () => {
      cleanUp()
      if (isNewScript) script.remove()
      reject(
        new KakaoSdkError(
          'LOAD_FAILED',
          '카카오톡 공유 도구를 불러오지 못했어요. 네트워크와 등록 도메인을 확인해 주세요.',
        ),
      )
    }

    if (isNewScript) {
      script.id = KAKAO_JAVASCRIPT_SDK.scriptId
      script.src = KAKAO_JAVASCRIPT_SDK.src
      script.integrity = KAKAO_JAVASCRIPT_SDK.integrity
      script.crossOrigin = 'anonymous'
      script.async = true
      document.head.append(script)
    }
  })

  const loadingPromise = sdkLoadPromise
  const clearLoadingPromise = () => {
    if (sdkLoadPromise === loadingPromise) sdkLoadPromise = null
  }
  void loadingPromise.then(clearLoadingPromise, clearLoadingPromise)

  return loadingPromise
}

/** 결정 카드의 임시 카카오톡 기본 메시지 템플릿을 만든다. */
export function createKakaoDiaryShareTemplate({
  stockName,
  shareImageUrl,
  diaryUrl,
}: KakaoDiaryShareTemplateOptions) {
  const title = `${stockName || '오늘의 종목'}, AI 사원과 내린 투자 결정`
  const link = { mobileWebUrl: diaryUrl, webUrl: diaryUrl }

  return {
    objectType: 'feed',
    content: {
      title,
      description: 'BRIFO에서 AI 사원과 투자 결정을 기록하고 결과를 확인하세요!',
      imageUrl: shareImageUrl,
      link,
    },
    buttons: [{ title: 'BRIFO 시작하기', link }],
  }
}

/**
 * 카카오톡 기본 템플릿을 현재 클릭 이벤트 안에서 즉시 전송한다.
 *
 * `sendDefault`는 새 창을 열 수 있으므로 SDK를 비동기로 기다리면 브라우저의 사용자 활성화가 사라진다.
 * 호출 전 화면 진입 시점에 `loadKakaoJavascriptSdk`가 완료되어 있어야 한다.
 */
export function sendKakaoDefaultShare(
  template: unknown,
  javascriptKey: string | undefined = getKakaoJavascriptKey(),
) {
  if (!javascriptKey) {
    throw new KakaoSdkError(
      'MISSING_JAVASCRIPT_KEY',
      '카카오 JavaScript 키가 설정되지 않았어요. 배포 환경 설정을 확인해 주세요.',
    )
  }

  if (typeof window === 'undefined') {
    throw new KakaoSdkError('LOAD_FAILED', '카카오톡 공유는 브라우저에서만 사용할 수 있어요.')
  }

  const kakao = initializeKakaoSdk(javascriptKey)

  if (!kakao.Share?.sendDefault) {
    throw new KakaoSdkError(
      'INITIALIZATION_FAILED',
      '카카오톡 공유 기능을 준비하지 못했어요. 잠시 후 다시 시도해 주세요.',
    )
  }

  return kakao.Share.sendDefault(template)
}
