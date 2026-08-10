import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Button from '@/components/common/Button'
import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import { Toast } from '@/components/common/Toast'
import UserAgreementItem from '@/components/feature/onboarding/UserAgreementItem'
import { useSignupCsrfBootstrap } from '@/hooks/auth/useSignupCsrfBootstrap'
import type { AgreementId } from '@/pages/AgreementPage/agreement'
import { AGREEMENTS } from '@/pages/AgreementPage/agreement'
import {
  useAgreePoliciesMutation,
  usePoliciesQuery,
} from '@/pages/AgreementPage/hooks/usePoliciesApi'
import { findPolicyByAgreementId } from '@/pages/AgreementPage/policyMapping'
import { PATH } from '@/routes/paths'

type AgreementCheckedState = Record<AgreementId, boolean>

interface AgreementLocationState {
  checkedAgreementId?: AgreementId
}

const INITIAL_CHECKED_STATE: AgreementCheckedState = {
  age: false,
  service: false,
  privacy: false,
  investment: false,
  marketing: false,
}

const REQUIRED_AGREEMENT_IDS: AgreementId[] = ['age', 'service', 'privacy', 'investment']

export default function AgreementPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const policiesQuery = usePoliciesQuery()
  const agreePolicies = useAgreePoliciesMutation()
  const { isCsrfReady, isCsrfError, retryCsrf } = useSignupCsrfBootstrap()
  const [checked, setChecked] = useState<AgreementCheckedState>(INITIAL_CHECKED_STATE)
  const isAllChecked = Object.values(checked).every(Boolean)
  const isRequiredChecked = REQUIRED_AGREEMENT_IDS.every((id) => checked[id])

  useEffect(() => {
    const state = location.state as AgreementLocationState | null
    const checkedAgreementId = state?.checkedAgreementId

    if (!checkedAgreementId) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChecked((previous) => ({
      ...previous,
      [checkedAgreementId]: true,
    }))
    navigate(PATH.AGREEMENT, {
      replace: true,

      state: null,
    })
  }, [location.state, navigate])

  const handleToggle = (id: AgreementId) => {
    setChecked((previous) => ({
      ...previous,
      [id]: !previous[id],
    }))
  }

  const handleToggleAll = () => {
    const nextChecked = !isAllChecked

    setChecked({
      age: nextChecked,
      service: nextChecked,
      privacy: nextChecked,
      investment: nextChecked,
      marketing: nextChecked,
    })
  }

  const handleNext = () => {
    if (!isRequiredChecked || !policiesQuery.data) return

    const policyIds = policiesQuery.data.items
      .filter((policy) => {
        if (policy.isRequired) return true

        const agreement = AGREEMENTS.find(
          ({ id }) => findPolicyByAgreementId([policy], id) !== undefined,
        )
        return agreement ? checked[agreement.id] : false
      })
      .map((policy) => policy.policyId)

    agreePolicies.mutate(
      { policyIds },
      {
        onSuccess: () => navigate(PATH.ONBOARDING),
      },
    )
  }

  return (
    <main className="flex w-full flex-1 flex-col px-4 pt-6 pb-5">
      <StatusBar
        hasStatusArea
        className="w-full [&>div:last-child]:px-0"
        left={<StatusBarBackButton onClick={() => navigate(-1)} />}
        title="약관동의"
      />

      <div className="mt-8">
        <h1 className="dnf-Title3 text-Gray-10 leading-[1.2] whitespace-pre-line">
          시작하기 전에{'\n'}
          <span className="text-[#FFBE00]">약관에 동의해주세요</span>
        </h1>
      </div>

      <div className="mt-8">
        <UserAgreementItem
          label="약관에 전체 동의"
          checked={isAllChecked}
          showType={false}
          variant="all"
          onToggle={handleToggleAll}
          className="pretendard-Body2-Semibold text-Gray-9"
        />

        <div className="border-Gray-2 mt-2 border-t">
          {AGREEMENTS.map((agreement) => (
            <UserAgreementItem
              key={agreement.id}
              label={agreement.label}
              type={agreement.type}
              checked={checked[agreement.id]}
              onToggle={() => handleToggle(agreement.id)}
              onView={() =>
                navigate(PATH.AGREEMENT_DETAIL, {
                  state: {
                    agreementId: agreement.id,
                    policyId: findPolicyByAgreementId(policiesQuery.data?.items ?? [], agreement.id)
                      ?.policyId,
                  },
                })
              }
            />
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <Button
          isFullWidth
          disabled={
            !isRequiredChecked || !policiesQuery.data || agreePolicies.isPending || !isCsrfReady
          }
          onClick={handleNext}
        >
          {agreePolicies.isPending ? '동의 처리 중...' : '다음'}
        </Button>
      </div>

      {(isCsrfError || policiesQuery.isError || agreePolicies.isError) && (
        <Toast
          message={
            isCsrfError
              ? '온보딩 정보를 불러오지 못했어요'
              : (agreePolicies.error?.serviceMessage ??
                policiesQuery.error?.serviceMessage ??
                '약관 정보를 불러오지 못했어요')
          }
        />
      )}

      {isCsrfError && (
        <Button isFullWidth color="secondary" className="mt-3" onClick={() => void retryCsrf()}>
          다시 시도
        </Button>
      )}
    </main>
  )
}
