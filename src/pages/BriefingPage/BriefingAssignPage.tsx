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
import { PageErrorView } from '@/components/feature/error/PageErrorView'
import { PageLoadingView } from '@/components/feature/error/PageLoadingView'
import { useAgentListQuery } from '@/hooks/queries/agent/useAgentQueries'
import { useCardNewsBriefingsQuery } from '@/pages/BriefingPage/hooks/useBriefingQueries'
import { usePostBriefingRequestMutation } from '@/pages/BriefingPage/hooks/usePostBriefingRequestMutation'
import { PATH } from '@/routes/paths'

export function BriefingAssignPage() {
  const { cardId } = useParams<{ cardId: string }>()
  const navigate = useNavigate()
  const { mutate: postBriefingRequest, isPending } = usePostBriefingRequestMutation()

  // 임시로 브리핑 목록 API를 통해 주식(stock) 정보를 가져옵니다
  const cardNewsQuery = useCardNewsBriefingsQuery(cardId ?? null)
  const agentsQuery = useAgentListQuery()
  const agentsList = agentsQuery.data ?? []

  // 테스트 목적으로 기본적으로 루키, 탱커를 선택된 상태로 둠 (피그마 명세 기반)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set([agentsList[0]?.id, agentsList[2]?.id].filter((id): id is string => Boolean(id))),
  )

  // 테스트용 모달 상태
  const [modalType, setModalType] = useState<AnalyzeModalType | null>(null)

  const stockName = cardNewsQuery.data?.stock.name ?? ''

  const toggleAgent = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleStartAnalysis = async () => {
    if (!cardId) return

    postBriefingRequest(
      { cardId, agentIds: Array.from(selectedIds) },
      {
        onSuccess: (result) => {
          navigate(PATH.BRIEFING_COMPLETE(cardId), {
            state: { briefingRequest: result },
            replace: true,
          })
        },
        onError: () => {
          setModalType('LLM_FAIL') // Error handling fallback
        },
      },
    )
  }

  const handleNextModal = () => {
    if (!modalType) return
    const MODAL_TYPES: AnalyzeModalType[] = [
      'SUCCESS',
      'SHORTAGE',
      'EXHAUSTED',
      'LLM_FAIL',
      'RETRY_COUNT',
    ]
    const currentIndex = MODAL_TYPES.indexOf(modalType)
    if (currentIndex < MODAL_TYPES.length - 1) {
      setModalType(MODAL_TYPES[currentIndex + 1])
    } else {
      setModalType(null) // 테스트 끝
    }
  }

  // 선택된 사원의 일급 합산
  const totalAP = agentsList
    .filter((agent) => selectedIds.has(agent.id))
    .reduce((sum, agent) => sum + agent.dailyAP, 0)

  return (
    <div className="bg-White flex h-screen w-full flex-col">
      <StatusBar
        left={<StatusBarBackButton />}
        title="사원배치"
        right={<StatusBarNotificationButton />}
      />

      {(cardNewsQuery.isError && !cardNewsQuery.data) ||
      (agentsQuery.isError && !agentsList.length) ? (
        <PageErrorView
          title="사원 배치 정보를 불러오지 못했어요"
          onRetry={() => {
            cardNewsQuery.refetch()
            agentsQuery.refetch()
          }}
        />
      ) : !cardNewsQuery.data || agentsQuery.isLoading ? (
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

      {/* 테스트용 모달 */}
      <AnalyzeRequestModal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        type={modalType ?? 'SUCCESS'}
        stockName={stockName}
        employeeName="프로"
        shortageAP={20}
        retryCount={2}
        maxRetryCount={3}
        onPrimaryClick={handleNextModal}
        onSecondaryClick={handleNextModal}
      />
    </div>
  )
}
