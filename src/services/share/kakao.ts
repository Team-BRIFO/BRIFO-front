import { KAKAO_JAVASCRIPT_SDK } from '@/constants/kakao'
import type { DiaryDirection } from '@/types/domain/diary'

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
  direction: DiaryDirection
  isCorrect: boolean
  /** 사용자의 누적 결정 적중률 (0~100, %) */
  accuracyRate: number
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

  const existingElement = document.getElementById(KAKAO_JAVASCRIPT_SDK.scriptId)
  // Kakao 전역 객체가 없으면, 로드 상태를 모르는 기존 태그는 완료·실패 이벤트를 놓쳤을 수 있다.
  // 이 모듈이 로드 중이라고 표시한 script만 재사용해 Promise가 영구 대기하지 않게 한다.
  const reusableScript =
    existingElement instanceof HTMLScriptElement &&
    existingElement.dataset.kakaoSdkState === 'loading'
      ? existingElement
      : null

  if (existingElement && !reusableScript) existingElement.remove()

  const script = reusableScript ?? document.createElement('script')
  const isNewScript = !reusableScript

  sdkLoadPromise = new Promise<KakaoSdk>((resolve, reject) => {
    const cleanUp = () => {
      script.onload = null
      script.onerror = null
    }

    script.onload = () => {
      cleanUp()
      script.dataset.kakaoSdkState = 'loaded'
      try {
        resolve(initializeKakaoSdk(javascriptKey))
      } catch (error) {
        reject(error)
      }
    }

    script.onerror = () => {
      cleanUp()
      script.dataset.kakaoSdkState = 'error'
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
      script.dataset.kakaoSdkState = 'loading'
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

function formatAccuracyRate(rate: number) {
  return `${rate.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}%`
}

/** 결정 결과에 맞춘 카카오톡 기본 메시지 템플릿을 만든다. */
export function createKakaoDiaryShareTemplate({
  stockName,
  direction,
  isCorrect,
  accuracyRate,
  shareImageUrl,
  diaryUrl,
}: KakaoDiaryShareTemplateOptions) {
  const directionLabel = direction === 'up' ? 'UP' : direction === 'down' ? 'DOWN' : '관망'
  const shareMessage =
    direction === 'neutral'
      ? {
          title: '오늘은 순방했다^^',
          description: `${stockName || '오늘의 종목'} 관망 찍었다 이게 바로 리스크 관리다`,
          buttonTitle: '나도 해보기',
        }
      : isCorrect
        ? {
            title: '나 어쩌면 주식 고수일지도?',
            description: `${stockName || '오늘의 종목'} ${directionLabel} 찍고 ${formatAccuracyRate(accuracyRate)} 적중! 나보다 적중률 높을 자신 있으면 들어와`,
            buttonTitle: '적중률 대결',
          }
        : {
            title: '영차영차... 개미는 오늘도 힘들다',
            description: `${stockName || '오늘의 종목'} ${directionLabel} 찍었는데 ${formatAccuracyRate(accuracyRate)}네 내일은 잘해보자 아자스!`,
            buttonTitle: '너도 해볼래?',
          }
  const link = { mobileWebUrl: diaryUrl, webUrl: diaryUrl }

  return {
    objectType: 'feed',
    content: {
      title: shareMessage.title,
      description: shareMessage.description,
      imageUrl: shareImageUrl,
      link,
    },
    buttons: [{ title: shareMessage.buttonTitle, link }],
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
