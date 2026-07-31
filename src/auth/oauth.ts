import { PATH } from '@/routes/paths'

export type SocialProvider = 'kakao' | 'naver'
interface KakaoCallbackRequest {
  authorizationCode: string
  redirectUri: string
}

interface NaverCallbackRequest extends KakaoCallbackRequest {
  state: string
}

const NAVER_STATE_STORAGE_KEY = 'naverOAuthState'
export const SIGNUP_TOKEN_STORAGE_KEY = 'signupToken'

function getRedirectUri(provider: SocialProvider) {
  return new URL(PATH.AUTH_CALLBACK_FOR(provider), window.location.origin).toString()
}

function requireClientId(provider: SocialProvider) {
  const clientId =
    provider === 'kakao'
      ? import.meta.env.VITE_KAKAO_CLIENT_ID
      : import.meta.env.VITE_NAVER_CLIENT_ID

  if (!clientId) {
    throw new Error(`${provider.toUpperCase()} OAuth client ID가 설정되지 않았습니다.`)
  }

  return clientId
}

export function startSocialLogin(provider: SocialProvider) {
  const redirectUri = getRedirectUri(provider)
  const clientId = requireClientId(provider)

  if (provider === 'kakao') {
    const authorizationUrl = new URL('https://kauth.kakao.com/oauth/authorize')
    authorizationUrl.search = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
    }).toString()
    window.location.assign(authorizationUrl)
    return
  }

  const state = crypto.randomUUID()
  sessionStorage.setItem(NAVER_STATE_STORAGE_KEY, state)

  const authorizationUrl = new URL('https://nid.naver.com/oauth2.0/authorize')
  authorizationUrl.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    state,
  }).toString()
  window.location.assign(authorizationUrl)
}

export function getOAuthCallbackRequest(provider: 'kakao'): KakaoCallbackRequest
export function getOAuthCallbackRequest(provider: 'naver'): NaverCallbackRequest
export function getOAuthCallbackRequest(
  provider: SocialProvider,
): KakaoCallbackRequest | NaverCallbackRequest {
  const searchParameters = new URLSearchParams(window.location.search)
  const providerError = searchParameters.get('error')

  if (providerError) {
    throw new Error(searchParameters.get('error_description') ?? '소셜 로그인이 취소되었습니다.')
  }

  const authorizationCode = searchParameters.get('code')
  if (!authorizationCode) throw new Error('OAuth 인가 코드가 없습니다.')

  const redirectUri = getRedirectUri(provider)
  if (provider === 'kakao') return { authorizationCode, redirectUri }

  const state = searchParameters.get('state')
  const savedState = sessionStorage.getItem(NAVER_STATE_STORAGE_KEY)
  sessionStorage.removeItem(NAVER_STATE_STORAGE_KEY)

  if (!state || !savedState || state !== savedState) {
    throw new Error('네이버 로그인 요청을 확인할 수 없습니다. 다시 로그인해 주세요.')
  }

  return { authorizationCode, redirectUri, state }
}
