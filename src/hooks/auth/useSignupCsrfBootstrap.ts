import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { clearClientSession } from '@/api/client/sessionCleanup'
import { ensureSignupCsrfToken, SIGNUP_SESSION_EXPIRED_MESSAGE } from '@/api/client/signupAuth'
import { signupSession } from '@/api/client/signupSession'
import { PATH } from '@/routes/paths'

async function fetchSignupCsrfToken() {
  signupSession.activate()
  await ensureSignupCsrfToken()
}

export function useSignupCsrfBootstrap() {
  const navigate = useNavigate()

  const query = useQuery({
    queryKey: ['auth', 'signup', 'csrf'] as const,
    queryFn: fetchSignupCsrfToken,
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
  })

  const isSessionExpired =
    query.isError &&
    query.error instanceof Error &&
    query.error.message === SIGNUP_SESSION_EXPIRED_MESSAGE

  useEffect(() => {
    if (!isSessionExpired) return

    clearClientSession()
    navigate(PATH.SPLASH, {
      replace: true,
      state: { loginError: '로그인 세션이 만료됐어요. 다시 로그인해 주세요.' },
    })
  }, [isSessionExpired, navigate])

  return {
    isCsrfReady: query.isSuccess,
    isCsrfError: query.isError && !isSessionExpired,
    retryCsrf: () => void query.refetch(),
  }
}
