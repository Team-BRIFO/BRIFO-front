import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { browserTokenStore } from '@/api/client/tokenStore'
import { useAgreePoliciesMutation } from '@/hooks/queries/policy/useAgreePoliciesMutation'
import { usePendingPoliciesQuery } from '@/hooks/queries/policy/usePolicyQueries'
import { PATH } from '@/routes/paths'

interface PolicyReagreementLocationState {
  checkedPolicyId?: string
}

function hasSessionToken() {
  return Boolean(browserTokenStore.getAccessToken() || browserTokenStore.getRefreshToken())
}

export function usePolicyReagreement() {
  const navigate = useNavigate()
  const location = useLocation()
  const pendingQuery = usePendingPoliciesQuery(hasSessionToken())
  const agreePolicies = useAgreePoliciesMutation()
  const [preCheckedPolicyIds, setPreCheckedPolicyIds] = useState<string[]>([])

  const pendingItems = pendingQuery.data ?? []

  useEffect(() => {
    const state = location.state as PolicyReagreementLocationState | null
    const checkedPolicyId = state?.checkedPolicyId

    if (!checkedPolicyId) return

    // eslint-disable-next-line react-hooks/set-state-in-effect -- 약관 상세 확인 후 체크 상태를 유지한다.
    setPreCheckedPolicyIds((previous) =>
      previous.includes(checkedPolicyId) ? previous : [...previous, checkedPolicyId],
    )
    navigate(location.pathname + location.search, { replace: true, state: null })
  }, [location.pathname, location.search, location.state, navigate])

  const isOpen = !pendingQuery.isPending && pendingItems.length > 0

  const handleAgree = useCallback(
    (policyIds: string[]) => {
      agreePolicies.mutate({ policyIds })
    },
    [agreePolicies],
  )

  const handleViewPolicy = useCallback(
    (policyId: string) => {
      navigate(PATH.AGREEMENT_DETAIL, {
        state: {
          policyId,
          fromPolicyReagreement: true,
          returnTo: `${location.pathname}${location.search}`,
        },
      })
    },
    [location.pathname, location.search, navigate],
  )

  const isAuthError =
    pendingQuery.error?.status === 401 ||
    pendingQuery.error?.status === 403 ||
    agreePolicies.error?.status === 401 ||
    agreePolicies.error?.status === 403

  const errorMessage = isAuthError
    ? null
    : (pendingQuery.error?.serviceMessage ??
      agreePolicies.error?.serviceMessage ??
      (pendingQuery.isError || agreePolicies.isError ? '약관 정보를 불러오지 못했어요' : null))

  return {
    isOpen,
    items: pendingItems,
    preCheckedPolicyIds,
    isPending: agreePolicies.isPending,
    errorMessage,
    onAgree: handleAgree,
    onViewPolicy: handleViewPolicy,
    refetch: pendingQuery.refetch,
  }
}
