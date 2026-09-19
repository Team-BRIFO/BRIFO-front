import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { clearClientSession } from '@/api/client/sessionCleanup'
import {
  useKakaoLoginMutation,
  useNaverLoginMutation,
} from '@/pages/SplashPage/hooks/useSocialLoginMutation'
import { PATH } from '@/routes/paths'
import { getOAuthCallbackRequest, type SocialProvider } from '@/services/auth/oauth'
import { applyOAuthLoginResult } from '@/services/auth/oauthLoginResult'

function isSocialProvider(provider: string | undefined): provider is SocialProvider {
  return provider === 'kakao' || provider === 'naver'
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

        await applyOAuthLoginResult(body.result, navigate)
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
