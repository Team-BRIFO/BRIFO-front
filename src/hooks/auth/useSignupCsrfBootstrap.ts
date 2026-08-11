import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { clearClientSession } from '@/api/client/sessionCleanup'
import {
  ensureSignupCsrfToken,
  SIGNUP_CSRF_QUERY_KEY,
  SIGNUP_SESSION_EXPIRED_MESSAGE,
} from '@/api/client/signupAuth'
import { signupSession } from '@/api/client/signupSession'
import { PATH } from '@/routes/paths'

async function fetchSignupCsrfToken({ signal }: { signal?: AbortSignal }) {
  signupSession.activate()
  return ensureSignupCsrfToken({ signal })
}

export function useSignupCsrfBootstrap() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: SIGNUP_CSRF_QUERY_KEY,
    queryFn: ({ signal }) => fetchSignupCsrfToken({ signal }),
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
  })

  const isSessionExpired =
    query.isError &&
    query.error instanceof Error &&
    query.error.message === SIGNUP_SESSION_EXPIRED_MESSAGE

  useEffect(() => {
    if (!isSessionExpired) return

    clearClientSession(queryClient)
    navigate(PATH.SPLASH, {
      replace: true,
      state: { loginError: '로그인 세션이 만료됐어요. 다시 로그인해 주세요.' },
    })
  }, [isSessionExpired, navigate, queryClient])

  return {
    isCsrfReady: query.isSuccess,
    isCsrfError: query.isError && !isSessionExpired,
    retryCsrf: () => void query.refetch(),
  }
}
