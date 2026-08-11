import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import Button from '@/components/common/Button'
import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import { SERVICE_TERMS } from '@/constants/agreement'
import { usePolicyDetailQuery } from '@/hooks/queries/policy/usePolicyQueries'
import { PATH } from '@/routes/paths'
import type { AgreementId } from '@/types/domain/agreement'
import { formatPolicyEffectiveDate } from '@/utils/policyDate'

interface AgreementDetailLocationState {
  agreementId?: AgreementId
  policyId?: string
  /** 설정에서는 동의 상태를 바꾸지 않는 읽기 전용으로 열어야 한다. */
  readOnly?: boolean
}

export default function AgreementDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { policyId: routePolicyId } = useParams<{ policyId: string }>()

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [hasReachedBottom, setHasReachedBottom] = useState(false)

  const {
    agreementId = 'service',
    policyId: statePolicyId,
    readOnly: stateReadOnly = false,
  } = (location.state as AgreementDetailLocationState | null) ?? {}
  const policyId = routePolicyId ?? statePolicyId
  // `/my/terms/:policyId`는 새로고침/딥링크에도 설정의 읽기 전용 정책 상세여야 한다.
  const readOnly = stateReadOnly || Boolean(routePolicyId)
  const policyDetailQuery = usePolicyDetailQuery(policyId, readOnly || undefined)
  const policyDetail = policyDetailQuery.data
  const isReadOnlyDetailLoading = readOnly && policyDetailQuery.isPending

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
    if (readOnly) {
      navigate(PATH.MY_TERMS, { replace: true })
      return
    }

    if (!hasReachedBottom) return

    navigate(PATH.AGREEMENT, {
      replace: true,
      state: {
        checkedAgreementId: agreementId,
      },
    })
  }

  const handleBack = () => {
    if (readOnly) {
      navigate(PATH.MY_TERMS, { replace: true })
      return
    }

    navigate(-1)
  }

  return (
    <main
      className={`flex w-full flex-1 flex-col pb-5 ${
        readOnly ? 'h-full min-h-0 overflow-hidden' : 'px-4'
      }`}
    >
      <StatusBar
        hasStatusArea={false}
        className={readOnly ? 'w-full' : 'w-full [&>div:last-child]:px-0'}
        left={<StatusBarBackButton onClick={handleBack} />}
        title="약관"
      />

      <div
        ref={scrollContainerRef}
        onScroll={checkScrollBottom}
        className={`min-h-0 flex-1 overflow-y-auto px-2 py-6 ${readOnly ? 'mx-4' : ''}`}
      >
        {isReadOnlyDetailLoading ? (
          <p className="pretendard-Body2-Regular text-Gray-5 py-10 text-center">
            약관을 불러오는 중이에요.
          </p>
        ) : policyDetailQuery.isError && readOnly ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <p className="pretendard-Body2-Regular text-Gray-5 text-center">
              약관 정보를 불러오지 못했어요.
            </p>
            <Button
              type="button"
              color="secondary"
              onClick={() => void policyDetailQuery.refetch()}
            >
              다시 시도
            </Button>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      <div className={readOnly ? 'mx-4 flex justify-center' : undefined}>
        <Button
          type="button"
          size={readOnly ? 'semilg' : 'lg'}
          color="primary"
          isFullWidth
          disabled={(!readOnly && !hasReachedBottom) || isReadOnlyDetailLoading}
          onClick={handleConfirm}
          className={readOnly ? 'max-w-80' : undefined}
        >
          {readOnly ? '확인' : '확인했어요'}
        </Button>
      </div>
    </main>
  )
}
