import type { NavigateFunction } from 'react-router-dom'

import { ensureSignupCsrfToken } from '@/api/client/signupAuth'
import { signupSession } from '@/api/client/signupSession'
import { browserTokenStore } from '@/api/client/tokenStore'
import type { OAuthLoginResult } from '@/api/contracts/auth'
import { PATH } from '@/routes/paths'

function isSignupRequired(result: OAuthLoginResult) {
  return result.loginType === 'SIGNUP_REQUIRED'
}

/**
 * 카카오/네이버/게스트 로그인 응답 처리 공통 분기.
 * 신규 가입이면 signup CSRF 세션을 열어 약관 동의로, 기존 로그인이면 토큰을 저장하고 홈으로 보낸다.
 */
export async function applyOAuthLoginResult(
  result: OAuthLoginResult | undefined,
  navigate: NavigateFunction,
) {
  if (!result || !isSignupRequired(result)) {
    signupSession.clear()
    browserTokenStore.clear()
    if (result && 'token' in result && result.token) {
      browserTokenStore.setTokens(result.token)
    }
    navigate(PATH.HOME, { replace: true })
    return
  }

  browserTokenStore.clear()
  signupSession.activate()
  try {
    await ensureSignupCsrfToken()
  } catch {
    // AgreementPage mount에서 CSRF를 다시 발급한다.
  }
  navigate(PATH.AGREEMENT, { replace: true })
}
