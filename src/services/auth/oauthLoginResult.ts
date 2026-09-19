import type { NavigateFunction } from 'react-router-dom'

import { requireApiResult } from '@/api/client/result'
import { ensureSignupCsrfToken } from '@/api/client/signupAuth'
import { signupSession } from '@/api/client/signupSession'
import { browserTokenStore } from '@/api/client/tokenStore'
import type { OAuthLoginResult } from '@/api/contracts/auth'
import {
  agreePolicies,
  getPolicies,
} from '@/api/generated/endpoints/policy-controller/policy-controller'
import { PATH } from '@/routes/paths'

function isSignupRequired(result: OAuthLoginResult) {
  return result.loginType === 'SIGNUP_REQUIRED'
}

/**
 * 약관 동의 화면을 건너뛰는 플로우(게스트 로그인)를 위해 필수 약관에 자동으로 동의한다.
 * 동의를 생략하면 온보딩 완료 후 홈에서 약관 재동의 바텀시트가 다시 뜨게 되므로 미리 처리해둔다.
 */
async function autoAgreeRequiredPolicies() {
  const policiesResponse = await getPolicies()
  const { items } = requireApiResult(policiesResponse, 'getPolicies')
  const requiredPolicyIds = items.filter((item) => item.isRequired).map((item) => item.policyId)

  if (requiredPolicyIds.length === 0) return

  await agreePolicies({ policyIds: requiredPolicyIds })
}

interface ApplyOAuthLoginResultOptions {
  /** 게스트(테스트) 로그인처럼 약관 동의 화면 없이 바로 온보딩으로 보낼 때 사용한다. */
  skipAgreement?: boolean
}

/**
 * 카카오/네이버/게스트 로그인 응답 처리 공통 분기.
 * 신규 가입이면 signup CSRF 세션을 열어 약관 동의로, 기존 로그인이면 토큰을 저장하고 홈으로 보낸다.
 */
export async function applyOAuthLoginResult(
  result: OAuthLoginResult | undefined,
  navigate: NavigateFunction,
  { skipAgreement = false }: ApplyOAuthLoginResultOptions = {},
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

  if (skipAgreement) {
    try {
      await autoAgreeRequiredPolicies()
    } catch {
      // 자동 동의에 실패해도 온보딩은 계속 진행한다. 이후 홈의 약관 재동의 바텀시트가 안전망 역할을 한다.
    }
    navigate(PATH.ONBOARDING, { replace: true })
    return
  }

  navigate(PATH.AGREEMENT, { replace: true })
}
