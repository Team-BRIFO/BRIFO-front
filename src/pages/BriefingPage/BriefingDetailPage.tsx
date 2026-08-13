import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Modal from '@/components/common/Modal'
import {
  StatusBar,
  StatusBarBackButton,
  StatusBarNotificationButton,
} from '@/components/common/StatusBar'
import { Tabs } from '@/components/common/Tabs'
import { BriefingMainContentSheet } from '@/components/feature/briefing/BriefingMainContentSheet'
import { DecisionBottomSheet } from '@/components/feature/decision/DecisionBottomSheet'
import { DecisionResultModalContent } from '@/components/feature/decision/DecisionResultModal'
import { PredictionCompleteModal } from '@/components/feature/decision/PredictionCompleteModal'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { useAgentListQuery } from '@/hooks/queries/agent/useAgentListQuery'
import { useBriefingDetailQuery } from '@/pages/BriefingPage/hooks/useBriefingDetailQuery'
import { usePostDecisionMutation } from '@/pages/BriefingPage/hooks/usePostDecisionMutation'
import { useStockBriefingsQuery } from '@/pages/BriefingPage/hooks/useStockBriefingsQuery'
import { PATH } from '@/routes/paths'
import type { AgentType } from '@/types/domain/agent'
import type { ConfidenceLevel, DecisionDirection } from '@/types/domain/decision'

export function BriefingDetailPage() {
  const { briefingId } = useParams<{ briefingId: string }>()
  const navigate = useNavigate()

  const { data, fetchStatus, error, refetch } = useBriefingDetailQuery(briefingId ?? null)
  const { mutate: submitDecision, isPending: isSubmitting } = usePostDecisionMutation(
    briefingId ?? '',
  )

  const stockId = data?.stock.id ?? null
  const { data: stockBriefings } = useStockBriefingsQuery(stockId)
  const { data: agentsList } = useAgentListQuery()

  const isReady = !!data && fetchStatus !== 'fetching' && !error
  const activeTab = data?.activeTab ?? 'rookie'

  const [isDecisionSheetOpen, setIsDecisionSheetOpen] = useState(false)
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false)
  const [errorModalMsg, setErrorModalMsg] = useState<string | null>(null)

  const [predictionData, setPredictionData] = useState<{
    direction: DecisionDirection
    confidence: ConfidenceLevel
  } | null>(null)

  const handleTabChange = (val: string) => {
    const type = val as AgentType

    if (!stockBriefings) return

    const targetBriefing = stockBriefings.items.find((item) => item.agentType === type)
    if (targetBriefing) {
      navigate(PATH.BRIEFING_DETAIL(targetBriefing.id), { replace: true })
    }
  }

  // 백엔드 API에서 제공되지 않는 agent 디테일 스펙(레벨, 승률, 일급 등)을 AgentList API 결과를 통해 병합합니다.
  const realAgent = agentsList?.find((a) => a.id === data?.agent.id)
  const displayAgent = realAgent ? { ...data!.agent, ...realAgent } : data?.agent

  return (
    <div className="bg-Background1 flex min-h-full w-full flex-col gap-3 pb-8">
      {/* 1. 글로벌 상태바 헤더 (배경 흰색) */}
      <StatusBar
        className="bg-White"
        left={
          <StatusBarBackButton
            onClick={() => navigate(`${PATH.BRIEFING}${data ? `?stockId=${data.stock.id}` : ''}`)}
          />
        }
        title="브리핑"
        right={<StatusBarNotificationButton />}
      />

      {!!error && fetchStatus === 'idle' ? (
        <PageErrorView
          title="브리핑 데이터를 불러오지 못했습니다."
          error={error}
          onRetry={() => refetch()}
        />
      ) : fetchStatus === 'fetching' || !data ? (
        <PageLoadingView />
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-col gap-3 px-4">
            {/* 타이틀 */}
            <div className="flex items-center justify-between">
              <h1 className="dnf-Subtitle1 text-Gray-10">브리핑</h1>
            </div>

            {/* 에이전트 선택 탭 (피그마 스펙 Type 1) */}
            <Tabs
              variant="segmented"
              segmentedType={1}
              value={activeTab}
              onChange={handleTabChange}
              items={[
                {
                  label: '루키',
                  value: 'rookie',
                },
                {
                  label: '프로',
                  value: 'pro',
                },
                {
                  label: '탱커',
                  value: 'tanker',
                },
              ]}
            />

            {/* 메인 브리핑 시트 (가운데 정렬) */}
            <div className="mt-2 flex justify-center">
              {data && displayAgent && (
                <BriefingMainContentSheet
                  agent={displayAgent}
                  briefing={data.briefing}
                  onConfirm={() => setIsDecisionSheetOpen(true)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {isReady && (
        <DecisionBottomSheet
          isOpen={isDecisionSheetOpen}
          onClose={() => setIsDecisionSheetOpen(false)}
          stock={data.stock}
          agent={{ name: data.agent.name }}
          briefing={{
            badgeText: data.briefing.badgeText,
            badgeType: data.briefing.badgeType,
            oneLiner: data.briefing.comment,
          }}
          isSubmitting={isSubmitting}
          onConfirm={(direction, confidence) => {
            submitDecision(
              { direction, confidenceLevel: confidence },
              {
                onSuccess: () => {
                  setPredictionData({ direction, confidence })
                  setIsDecisionSheetOpen(false)
                  setIsCompleteModalOpen(true)
                },
                onError: () => {
                  setErrorModalMsg('예측 등록에 실패했습니다. 잠시 후 다시 시도해주세요.')
                },
              },
            )
          }}
        />
      )}
      {isReady && (
        <PredictionCompleteModal
          isOpen={isCompleteModalOpen}
          onClose={() => setIsCompleteModalOpen(false)}
          stock={data.stock}
          earnedPoint={predictionData ? predictionData.confidence * 20 : 100}
          onConfirm={() => {
            setIsCompleteModalOpen(false)
            navigate(PATH.DIARY)
          }}
        />
      )}
      {errorModalMsg && (
        <Modal isOpen={!!errorModalMsg} onClose={() => setErrorModalMsg(null)}>
          <DecisionResultModalContent
            isSuccess={false}
            points={0}
            stockInfo={{ name: data?.stock.name ?? '', changeRate: data?.stock.changeRate ?? 0 }}
            comment={errorModalMsg}
            resultText="등록 실패"
            onAction={() => setErrorModalMsg(null)}
            onClose={() => setErrorModalMsg(null)}
          />
        </Modal>
      )}
    </div>
  )
}
