import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { clearClientSession } from '@/api/client/sessionCleanup'
import { ensureSignupCsrfToken } from '@/api/client/signupAuth'
import { signupSession } from '@/api/client/signupSession'
import { browserTokenStore } from '@/api/client/tokenStore'
import {
  useKakaoLoginMutation,
  useNaverLoginMutation,
} from '@/pages/SplashPage/hooks/useSocialLoginMutation'
import { PATH } from '@/routes/paths'
import { getOAuthCallbackRequest, type SocialProvider } from '@/services/auth/oauth'

function isSocialProvider(provider: string | undefined): provider is SocialProvider {
  return provider === 'kakao' || provider === 'naver'
}

function isSignupRequired(result: { loginType: 'LOGIN' | 'SIGNUP_REQUIRED' }) {
  return result.loginType === 'SIGNUP_REQUIRED'
}

export function OAuthCallbackPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { provider } = useParams()
  const kakaoLogin = useKakaoLoginMutation()
  const naverLogin = useNaverLoginMutation()
  const hasRequested = useRef(false)

  useEffect(() => {
    if (hasRequested.current) return
    hasRequested.current = true

    const returnToLogin = () => {
      clearClientSession(queryClient)
      navigate(PATH.SPLASH, {
        replace: true,
        state: { loginError: '로그인에 실패했어요' },
      })
    }

    if (!isSocialProvider(provider)) {
      returnToLogin()
      return
    }

    const requestLogin = async () => {
      try {
        const body =
          provider === 'kakao'
            ? await kakaoLogin.mutateAsync(getOAuthCallbackRequest('kakao'))
            : await naverLogin.mutateAsync(getOAuthCallbackRequest('naver'))

        if (!body.success) {
          throw new Error(body.message || '로그인에 실패했어요')
        }

        if (!body.result) {
          browserTokenStore.clear()
          signupSession.clear()
          navigate(PATH.HOME, { replace: true })
          return
        }

        if (isSignupRequired(body.result)) {
          browserTokenStore.clear()
          signupSession.activate()
          try {
            await ensureSignupCsrfToken()
          } catch {
            // AgreementPage mount에서 CSRF를 다시 발급한다.
          }
          navigate(PATH.AGREEMENT, { replace: true })
          return
        }

        signupSession.clear()
        browserTokenStore.clear()
        if ('token' in body.result && body.result.token) {
          browserTokenStore.setTokens(body.result.token)
        }
        navigate(PATH.HOME, { replace: true })
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('[OAuthCallback] login failed:', error)
        }
        returnToLogin()
      }
    }

    void requestLogin()
  }, [kakaoLogin, navigate, naverLogin, provider, queryClient])

  return null
}
