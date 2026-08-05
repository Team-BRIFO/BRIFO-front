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
import { useBriefingDetailQuery } from '@/pages/BriefingPage/hooks/useBriefingDetailQuery'
import { usePostDecisionMutation } from '@/pages/BriefingPage/hooks/usePostDecisionMutation'
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

    // 실제 환경에서는 cardId로 조회한 목록에서 해당 사원의 briefingId를 찾아야 하지만,
    // 현재는 모의 데이터 조회를 위해 하드코딩된 UUID를 매핑하여 URL을 변경합니다.
    const MOCK_BRIEFING_IDS: Record<AgentType, string> = {
      rookie: '51f6a481-3a4f-4f74-b5b7-2f7f6a0d8c31',
      pro: '8c3a9f61-9db5-4c0b-90ec-91d3b2a54f81',
      tanker: '2e3f5d77-c6b3-4d13-8f88-637c8c623c44',
    }
    navigate(`/briefing/detail/${MOCK_BRIEFING_IDS[type]}`, { replace: true })
  }

  return (
    <div className="bg-Background1 flex h-screen w-full flex-col gap-3">
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
        <div className="flex flex-1 flex-col overflow-y-auto">
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
                { label: '루키', value: 'rookie' },
                { label: '프로', value: 'pro' },
                { label: '탱커', value: 'tanker' },
              ]}
            />

            {/* 메인 브리핑 시트 (가운데 정렬) */}
            <div className="mt-2 flex justify-center">
              <BriefingMainContentSheet
                agent={data.agent}
                briefing={data.briefing}
                onConfirm={() => setIsDecisionSheetOpen(true)}
              />
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
