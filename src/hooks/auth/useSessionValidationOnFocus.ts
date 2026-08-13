import { useCallback, useEffect, useRef } from 'react'

import { browserTokenStore } from '@/api/client/tokenStore'
import { getMyPage } from '@/api/generated/endpoints/user-controller/user-controller'

function hasSessionToken() {
  return Boolean(browserTokenStore.getAccessToken() || browserTokenStore.getRefreshToken())
}

/**
 * 앱 진입 및 브라우저/웹뷰 복귀 시 현재 사용자 API를 호출해 세션 상태를 확인한다.
 * 탈퇴된 계정의 USER_404는 Axios 인터셉터가 토큰을 지우고 /splash로 이동시킨다.
 */
export function useSessionValidationOnFocus() {
  const isValidatingRef = useRef(false)

  const validateSession = useCallback(async () => {
    if (isValidatingRef.current || !hasSessionToken()) return

    isValidatingRef.current = true
    try {
      await getMyPage()
    } catch {
      // 세션 종료를 포함한 오류 처리는 Axios 인터셉터와 각 화면의 기존 오류 처리로 위임한다.
    } finally {
      isValidatingRef.current = false
    }
  }, [])

  useEffect(() => {
    void validateSession()

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') void validateSession()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [validateSession])
}
