import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Button from '@/components/common/Button'
import {
  StatusBar,
  StatusBarBackButton,
  StatusBarNotificationButton,
} from '@/components/common/StatusBar'
import { AgentCard } from '@/components/domain/agent/AgentCard'
import type { AnalyzeModalType } from '@/components/feature/analyze/AnalyzeRequestModal'
import { AnalyzeRequestModal } from '@/components/feature/analyze/AnalyzeRequestModal'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { useAgentListQuery } from '@/hooks/queries/agent/useAgentListQuery'
import { useCreateCreditLoanMutation } from '@/hooks/queries/ap/useApQueries'
import { usePostBriefingRequestMutation } from '@/pages/BriefingPage/hooks/usePostBriefingRequestMutation'
import { useGetNewsCardDetail } from '@/pages/NewsCardPage/hooks/useNewsQueries'
import { PATH } from '@/routes/paths'

export function BriefingAssignPage() {
  const { stockId } = useParams<{ stockId: string }>()
  const navigate = useNavigate()
  const { mutate: postBriefingRequest, isPending } = usePostBriefingRequestMutation()
  const { mutate: createCreditLoan, isPending: isCreditLoanPending } = useCreateCreditLoanMutation()

  const newsCardQuery = useGetNewsCardDetail(stockId ?? null)
  const agentsQuery = useAgentListQuery()
  const agentsList = agentsQuery.data ?? []
  const isFetching =
    newsCardQuery.fetchStatus === 'fetching' || agentsQuery.fetchStatus === 'fetching'
  const hasError = !!newsCardQuery.error || !!agentsQuery.error

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // 모달 및 요청 결과 상태
  const [modalType, setModalType] = useState<AnalyzeModalType | null>(null)
  const [modalErrorMessage, setModalErrorMessage] = useState<string | undefined>()

  const cards = newsCardQuery.data ?? []
  const stockName = cards[0]?.relatedStocks?.[0]?.name || ''

  const toggleAgent = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleStartAnalysis = async () => {
    if (!stockId) return

    postBriefingRequest(
      { stockId, agentIds: Array.from(selectedIds) },
      {
        onSuccess: () => {
          setModalType('SUCCESS')
        },
        onError: (error) => {
          // 브리핑 의뢰 마감 시간 이후 요청한 경우 (409 Conflict)
          if (error.code === 'BRIEFING_409_06') {
            setModalType('TIME_OVER')
          }
          // 실패 후 대기 시간 미달 (429 Too Many Requests)
          else if (error.code === 'BRIEFING_429_01') {
            setModalType('RETRY_COUNT')
          }
          // AP 부족 에러
          else if (
            error.status === 402 ||
            error.code?.includes('AP_400') ||
            error.code?.includes('AP_402') ||
            error.code === 'BRIEFING_400_01'
          ) {
            setModalType('SHORTAGE')
          }
          // 재시도 횟수 초과 에러
          else if (error.status === 429 || error.code?.includes('RETRY')) {
            setModalType('RETRY_COUNT')
          }
          // AP 대출 한도 소진 에러
          else if (error.code === 'AP_409_03' || error.code === 'AP_409_04') {
            setModalType('EXHAUSTED')
          }
          // 기타 실패 (429, 409, 400 등)
          else {
            setModalErrorMessage(error.message || '요청 중 오류가 발생했습니다.')
            setModalType('ERROR')
          }
        },
      },
    )
  }

  const handlePrimaryModalClick = () => {
    if (modalType === 'SUCCESS') {
      if (!stockId) return
      navigate(PATH.BRIEFING_FOR_STOCK(stockId), {
        replace: true,
      })
      setModalType(null)
      return
    }
    if (modalType === 'EXHAUSTED' || modalType === 'SHORTAGE' || modalType === 'TIME_OVER') {
      navigate(PATH.HOME)
      setModalType(null)
      return
    }
    if (modalType === 'LLM_FAIL') {
      handleStartAnalysis()
      return
    }
    if (modalType === 'RETRY_COUNT') {
      setModalType(null)
      return
    }

    setModalType(null)
  }

  const handleSecondaryModalClick = () => {
    if (modalType === 'SUCCESS') {
      navigate(PATH.HOME)
      setModalType(null)
      return
    }
    if (modalType === 'SHORTAGE') {
      handleCreditLoan()
      return
    }

    setModalType(null)
  }

  const handleCreditLoan = () => {
    const agentId = Array.from(selectedIds)[0]
    if (!agentId || isCreditLoanPending) return

    createCreditLoan(
      { agentId },
      {
        onSuccess: () => {
          setModalType(null) // 대출 성공 시 모달 닫기
        },
        onError: (error) => {
          // AP 한도 에러(AP_409_03: 이미 사용, AP_409_04: 조건 미충족)만 EXHAUSTED
          const isQuotaError = error.code === 'AP_409_03' || error.code === 'AP_409_04'
          setModalType(isQuotaError ? 'EXHAUSTED' : 'LLM_FAIL')
        },
      },
    )
  }

  // 선택된 사원의 일급 합산
  const totalAP = agentsList
    .filter((agent) => selectedIds.has(agent.id))
    .reduce((sum, agent) => sum + agent.dailyAP, 0)

  // 선택된 사원 이름들 (쉼표로 구분)
  const selectedAgentNames =
    agentsList
      .filter((agent) => selectedIds.has(agent.id))
      .map((agent) => agent.name)
      .join(', ') || '선택한 사원'

  return (
    <div className="bg-White flex h-screen w-full flex-col">
      <StatusBar
        left={<StatusBarBackButton onClick={() => navigate(-1)} />}
        title="사원배치"
        right={<StatusBarNotificationButton />}
      />

      {hasError ? (
        <PageErrorView
          title="사원 배치 정보를 불러오지 못했어요"
          error={newsCardQuery.error || agentsQuery.error}
          onRetry={() => {
            newsCardQuery.refetch()
            agentsQuery.refetch()
          }}
        />
      ) : isFetching || !newsCardQuery.data ? (
        <PageLoadingView />
      ) : agentsList.length === 0 ? (
        <PageErrorView title="배치할 사원이 없어요" description="먼저 사원을 등록해주세요." />
      ) : (
        <>
          <div className="flex flex-1 flex-col overflow-y-auto px-4 pt-6 pb-8">
            <div className="flex w-full flex-col gap-5.5">
              {/* 타이틀 영역 */}
              <div className="flex flex-col gap-1 text-left">
                <p className="dnf-Subtitle2 text-Gray-10">누구에게 맡길까요?</p>
                <p className="pretendard-Button3 text-Gray-6">
                  {stockName} 분석을 맡길 사원을 골라주세요.
                </p>
              </div>

              {/* 사원 카드리스트 */}
              <div className="flex w-full flex-col gap-2">
                {agentsList.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    active={selectedIds.has(agent.id)}
                    onClick={() => toggleAgent(agent.id)}
                  />
                ))}
                {/* 합계 AP 문구 */}
                <div className="bg-Background1 flex w-full items-center justify-between rounded-lg px-4 py-3">
                  <span className="pretendard-Caption1 text-Gray-9">선택한 사원 일급 합계</span>
                  <span className="dnf-Caption1 text-Pink-30">{totalAP} AP</span>
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="px-4 pt-4 pb-8">
            <Button
              isFullWidth
              size="lg"
              color="primary"
              onClick={handleStartAnalysis}
              className="rounded-full!"
              disabled={isPending || selectedIds.size === 0}
            >
              {isPending ? '분석 요청 중...' : '분석 시작하기'}
            </Button>
          </div>
        </>
      )}

      {/* 분석 의뢰 상태 모달 */}
      <AnalyzeRequestModal
        isOpen={modalType !== null}
        onClose={() => {
          setModalType(null)
          setModalErrorMessage(undefined)
        }}
        type={modalType ?? 'SUCCESS'}
        errorMessage={modalErrorMessage}
        stockName={stockName}
        employeeName={selectedAgentNames}
        shortageAP={totalAP}
        retryCount={2}
        maxRetryCount={3}
        onPrimaryClick={handlePrimaryModalClick}
        onSecondaryClick={handleSecondaryModalClick}
        secondaryDisabled={modalType === 'SHORTAGE' && isCreditLoanPending}
      />
    </div>
  )
}
