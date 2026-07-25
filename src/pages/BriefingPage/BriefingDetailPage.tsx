import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  StatusBar,
  StatusBarBackButton,
  StatusBarNotificationButton,
} from '@/components/common/StatusBar'
import { Tabs } from '@/components/common/Tabs'
import { BriefingMainContentSheet } from '@/components/feature/briefing/BriefingMainContentSheet'
import { DecisionBottomSheet } from '@/components/feature/decision/DecisionBottomSheet'
import { DecisionResultModal } from '@/components/feature/decision/DecisionResultModal'
import { PredictionCompleteModal } from '@/components/feature/decision/PredictionCompleteModal'
import { useGetBriefingDetail } from '@/hooks/queries/useBriefing'
import { usePostDecision } from '@/hooks/queries/useDecision'
import { MOCK_AGENT_DETAIL_RESPONSES } from '@/pages/TeamPage/mockAgents'
import { PATH } from '@/routes/paths'
import type { ConfidenceLevel } from '@/types/api/decision'
import type { AgentSummary, AgentType } from '@/types/domain/agent'

export function BriefingDetailPage() {
  const { briefingId } = useParams<{ briefingId: string }>()
  const navigate = useNavigate()

  const { data: response, isLoading, isError } = useGetBriefingDetail(briefingId ?? null)
  const { mutate: submitDecision } = usePostDecision(briefingId ?? '')

  // 임시로 응답 데이터 중 agent 정보를 이용해 agentType 판단
  const activeTab = (response?.result?.agent?.agentType.toLowerCase() as AgentType) || 'rookie'

  const [isDecisionSheetOpen, setIsDecisionSheetOpen] = useState(false)
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false)
  const [errorModalMsg, setErrorModalMsg] = useState<string | null>(null)

  const [predictionData, setPredictionData] = useState<{
    direction: 'UP' | 'DOWN' | 'NEUTRAL'
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

  if (isLoading) {
    return (
      <div className="bg-Gray-1 flex h-screen w-full flex-col items-center justify-center">
        <p className="pretendard-Body1 text-Gray-6">브리핑을 불러오는 중...</p>
      </div>
    )
  }

  if (isError || !response) {
    return (
      <div className="bg-Gray-1 flex h-screen w-full flex-col items-center justify-center">
        <p className="pretendard-Body1 text-Pink-30">브리핑 데이터를 불러오지 못했습니다.</p>
      </div>
    )
  }

  // 응답 데이터 분해
  const { stock, agent, newsCard, briefing } = response.result

  // 실제 API 연동 전이므로, Agent 상세 모의 데이터를 가져와서 UI 스펙에 맞게 주입
  const agentDetail = MOCK_AGENT_DETAIL_RESPONSES[agent.agentId]?.result

  // API 도메인 모델을 UI 컴포넌트 모델로 변환
  const mappedAgent: AgentSummary = {
    id: agent.agentId,
    type: agent.agentType.toLowerCase() as AgentType,
    name: agent.nickname,
    modelName: agent.modelName,
    level: agentDetail?.level ?? 1,
    levelProgress: agentDetail?.exp ? agentDetail.exp % 100 : 0,
    hitRate: agentDetail?.accuracyRate ?? 0,
    dailyAP: agentDetail?.dailySalary ?? 0,
  }

  const directionMap = {
    UP: { badgeType: 'rise' as const, badgeText: '상승 예측' },
    DOWN: { badgeType: 'fall' as const, badgeText: '하락 예측' },
    NEUTRAL: { badgeType: 'watch' as const, badgeText: '관망' },
  }

  const mappedBriefing = {
    badgeType: directionMap[briefing.direction].badgeType,
    badgeText: directionMap[briefing.direction].badgeText,
    percentage: briefing.confidenceRate,
    headline: newsCard.headline ?? `${stock.name} 관련 뉴스`,
    commentTag: '사장님 맞춤',
    comment: briefing.oneLiner,
    noteMessage: briefing.contentText,
    recommendText: briefing.oneLiner,
  }

  return (
    <div className="bg-Gray-1 flex h-screen w-full flex-col gap-3">
      {/* 1. 글로벌 상태바 헤더 (배경 흰색) */}
      <StatusBar
        className="bg-White"
        left={<StatusBarBackButton onClick={() => navigate(PATH.BRIEFING)} />}
        title="브리핑"
        right={<StatusBarNotificationButton />}
      />

      {/* 2. 스크롤 가능한 본문 영역 */}
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
              agent={mappedAgent}
              briefing={mappedBriefing}
              onConfirm={() => setIsDecisionSheetOpen(true)}
            />
          </div>
        </div>
      </div>

      <DecisionBottomSheet
        isOpen={isDecisionSheetOpen}
        onClose={() => setIsDecisionSheetOpen(false)}
        stock={{
          ...stock,
          hashtags: ['HBM', '반도체', '외국인 순매수'],
        }}
        agent={{ name: agent.nickname }}
        briefing={{
          badgeText: mappedBriefing.badgeText,
          badgeType: mappedBriefing.badgeType,
          oneLiner: mappedBriefing.comment,
        }}
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
      <PredictionCompleteModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        stock={{
          ...stock,
          hashtags: ['HBM', '반도체', '외국인 순매수'],
        }}
        earnedPoint={predictionData ? predictionData.confidence * 20 : 100}
        onConfirm={() => {
          setIsCompleteModalOpen(false)
          navigate(PATH.DIARY)
        }}
      />
      {errorModalMsg && (
        <DecisionResultModal
          isOpen={!!errorModalMsg}
          isSuccess={false}
          points={0}
          stockInfo={{ name: stock.name, changeRate: stock.changeRate }}
          comment={errorModalMsg}
          resultText="등록 실패"
          onAction={() => setErrorModalMsg(null)}
          onClose={() => setErrorModalMsg(null)}
        />
      )}
    </div>
  )
}
