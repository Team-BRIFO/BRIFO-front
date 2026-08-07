import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

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

export function OAuthCallbackPage() {
  const navigate = useNavigate()
  const { provider } = useParams()
  const kakaoLogin = useKakaoLoginMutation()
  const naverLogin = useNaverLoginMutation()
  const hasRequested = useRef(false)

  useEffect(() => {
    if (hasRequested.current) return
    hasRequested.current = true

    const returnToLogin = () => {
      navigate(PATH.SPLASH, {
        replace: true,
        state: { loginError: '로그인에 실패했어요' },
      })
    }

    if (!isSocialProvider(provider)) {
      returnToLogin()
      return
    }

    const completeLogin = (
      result:
        | Awaited<ReturnType<typeof kakaoLogin.mutateAsync>>
        | Awaited<ReturnType<typeof naverLogin.mutateAsync>>,
    ) => {
      if ('token' in result) {
        browserTokenStore.setTokens(result.token)
        navigate(PATH.HOME, { replace: true })
        return
      }

      navigate(PATH.AGREEMENT, { replace: true })
    }

    const requestLogin = async () => {
      try {
        const result =
          provider === 'kakao'
            ? await kakaoLogin.mutateAsync(getOAuthCallbackRequest('kakao'))
            : await naverLogin.mutateAsync(getOAuthCallbackRequest('naver'))
        completeLogin(result)
      } catch {
        returnToLogin()
      }
    }

    void requestLogin()
  }, [kakaoLogin, navigate, naverLogin, provider])

  return null
}
