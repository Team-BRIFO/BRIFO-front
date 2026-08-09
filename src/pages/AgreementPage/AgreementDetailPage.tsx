import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Button from '@/components/common/Button'
import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import type { AgreementId } from '@/pages/AgreementPage/agreement'
import { SERVICE_TERMS } from '@/pages/AgreementPage/agreement'
import { usePolicyDetailQuery } from '@/pages/AgreementPage/hooks/usePoliciesApi'
import { formatPolicyEffectiveDate } from '@/pages/AgreementPage/policyMapping'
import { PATH } from '@/routes/paths'

interface AgreementDetailLocationState {
  agreementId?: AgreementId
  policyId?: string
}

export default function AgreementDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [hasReachedBottom, setHasReachedBottom] = useState(false)

  const { agreementId = 'service', policyId } =
    (location.state as AgreementDetailLocationState | null) ?? {}
  const policyDetailQuery = usePolicyDetailQuery(policyId)
  const policyDetail = policyDetailQuery.data

  const checkScrollBottom = useCallback(() => {
    const container = scrollContainerRef.current

    if (!container) return

    const isBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 4

    if (isBottom) {
      setHasReachedBottom(true)
    }
  }, [])

  useEffect(() => {
    checkScrollBottom()
  }, [checkScrollBottom])

  const handleConfirm = () => {
    if (!hasReachedBottom) return

    navigate(PATH.AGREEMENT, {
      replace: true,
      state: {
        checkedAgreementId: agreementId,
      },
    })
  }

  return (
    <main className="flex w-full flex-1 flex-col px-4 pt-6 pb-5">
      <StatusBar
        hasStatusArea
        className="w-full [&>div:last-child]:px-0"
        left={<StatusBarBackButton onClick={() => navigate(-1)} />}
        title="약관"
      />

      <div
        ref={scrollContainerRef}
        onScroll={checkScrollBottom}
        className="min-h-0 flex-1 overflow-y-auto px-2 py-6"
      >
        <h1 className="pretendard-Subtitle2 text-Gray-10">
          {policyDetail?.title ?? SERVICE_TERMS.title}
        </h1>

        <p className="pretendard-Caption2 text-Gray-5 mt-2">
          시행일{' '}
          {policyDetail
            ? formatPolicyEffectiveDate(policyDetail.createdAt)
            : SERVICE_TERMS.effectiveDate}
          <span className="mx-2">·</span>
          버전 {policyDetail ? `v${policyDetail.version}` : SERVICE_TERMS.version}
        </p>

        <div className="mt-8 flex flex-col gap-6">
          {policyDetail ? (
            <p className="pretendard-Button2 font-regular text-Gray-6 leading-6 whitespace-pre-line">
              {policyDetail.content}
            </p>
          ) : (
            SERVICE_TERMS.sections.map((section) => (
              <section key={section.title}>
                <h2 className="pretendard-Subtitle6 text-Gray-6">{section.title}</h2>

                <p className="pretendard-Button2 font-regular text-Gray-6 mt-1.5 leading-6 whitespace-pre-line">
                  {section.content}
                </p>
              </section>
            ))
          )}
        </div>
      </div>

      <Button
        type="button"
        size="lg"
        color="primary"
        isFullWidth
        disabled={!hasReachedBottom}
        onClick={handleConfirm}
      >
        확인했어요
      </Button>
    </main>
  )
}
