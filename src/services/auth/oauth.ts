import { PATH } from '@/routes/paths'

export type SocialProvider = 'kakao' | 'naver'

interface KakaoCallbackRequest {
  authorizationCode: string
  redirectUri: string
}

interface NaverCallbackRequest extends KakaoCallbackRequest {
  state: string
}

const OAUTH_STATE_STORAGE_KEYS: Record<SocialProvider, string> = {
  kakao: 'kakaoOAuthState',
  naver: 'naverOAuthState',
}

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
  const state = crypto.randomUUID()
  sessionStorage.setItem(OAUTH_STATE_STORAGE_KEYS[provider], state)

  if (provider === 'kakao') {
    const authorizationUrl = new URL('https://kauth.kakao.com/oauth/authorize')
    authorizationUrl.search = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      state,
    }).toString()
    window.location.assign(authorizationUrl)
    return
  }

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

  const state = searchParameters.get('state')
  const stateStorageKey = OAUTH_STATE_STORAGE_KEYS[provider]
  const savedState = sessionStorage.getItem(stateStorageKey)
  sessionStorage.removeItem(stateStorageKey)

  if (!state || !savedState || state !== savedState) {
    throw new Error(
      `${provider === 'kakao' ? '카카오' : '네이버'} 로그인 요청을 확인할 수 없습니다. 다시 로그인해 주세요.`,
    )
  }

  const redirectUri = getRedirectUri(provider)
  if (provider === 'kakao') return { authorizationCode, redirectUri }

  return { authorizationCode, redirectUri, state }
}
