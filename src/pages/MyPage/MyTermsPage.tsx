import { useNavigate } from 'react-router-dom'

import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import UserAgreementItem from '@/components/feature/policy/UserAgreementItem'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { AGREEMENTS } from '@/constants/agreement'
import { usePoliciesQuery } from '@/hooks/queries/policy/usePolicyQueries'
import { findPolicyByAgreementId } from '@/mappers/policyMapper'
import { PATH } from '@/routes/paths'

/** 설정에서 약관 내용을 확인하는 읽기 전용 목록. 동의 상태는 변경하지 않는다. */
export function MyTermsPage() {
  const navigate = useNavigate()
  const policiesQuery = usePoliciesQuery(true)

  const content = (() => {
    if (!!policiesQuery.error && policiesQuery.fetchStatus === 'idle' && !policiesQuery.data) {
      return (
        <PageErrorView
          title="약관 정보를 불러오지 못했어요."
          error={policiesQuery.error}
          onRetry={() => policiesQuery.refetch()}
        />
      )
    }

    if (!policiesQuery.data) return <PageLoadingView />

    const policies = AGREEMENTS.flatMap((agreement) => {
      const policy = findPolicyByAgreementId(policiesQuery.data.items, agreement.id)
      return policy ? [{ agreement, policy }] : []
    })

    return (
      <div className="border-Gray-2 mt-2 border-t">
        {policies.map(({ agreement, policy }) => (
          <UserAgreementItem
            key={policy.policyId}
            label={agreement.label}
            type={agreement.type}
            checked={false}
            readOnly
            onView={() =>
              navigate(PATH.MY_TERMS_DETAIL(policy.policyId), {
                state: { agreementId: agreement.id, policyId: policy.policyId, readOnly: true },
              })
            }
          />
        ))}
      </div>
    )
  })()

  return (
    <main className="flex w-full flex-1 flex-col pb-5">
      <StatusBar
        hasStatusArea={false}
        className="w-full"
        left={<StatusBarBackButton onClick={() => navigate(PATH.MY_SETTINGS)} />}
        title="약관 및 정책"
      />

      <div className="mt-8 px-4">
        <h1 className="dnf-Title3 text-Gray-10 leading-[1.2] whitespace-pre-line">
          BRIFO의{'\n'}
          <span className="text-[#FFBE00]">약관 및 정책</span>
        </h1>

        <p className="pretendard-Caption1 text-Gray-6 mt-3">
          서비스 이용에 필요한 약관과 정책을 확인할 수 있어요.
        </p>
      </div>

      <div className="mt-8 px-4">{content}</div>
    </main>
  )
}
