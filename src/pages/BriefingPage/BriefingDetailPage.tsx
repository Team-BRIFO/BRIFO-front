import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  StatusBar,
  StatusBarBackButton,
  StatusBarNotificationButton,
} from '@/components/common/StatusBar'
import { Tabs } from '@/components/common/Tabs'
import { BriefingMainContentSheet } from '@/components/feature/briefing/BriefingMainContentSheet'
import { PredictionCompleteModal } from '@/components/feature/briefing/PredictionCompleteModal'
import { BriefingResultModal } from '@/components/feature/decision/BriefingResultModal'
import { DecisionBottomSheet } from '@/components/feature/decision/DecisionBottomSheet'
import { useGetBriefingDetail } from '@/hooks/queries/useBriefing'
import { useGetDecision, usePostDecision } from '@/hooks/queries/useDecision'
import { MOCK_AGENT_DETAIL_RESPONSES } from '@/pages/TeamPage/mockAgents'
import type { AgentSummary, AgentType } from '@/types/domain/agent'

export function BriefingDetailPage() {
  const { briefingId } = useParams<{ briefingId: string }>()
  const navigate = useNavigate()

  const { data: response, isLoading, isError } = useGetBriefingDetail(briefingId ?? null)
  const { mutate: submitDecision } = usePostDecision(briefingId ?? '')

  // 탭 상태 (API 응답이 오면 해당 사원으로 탭 자동 동기화)
  const [activeTab, setActiveTab] = useState<AgentType>('rookie')
  const [isDecisionSheetOpen, setIsDecisionSheetOpen] = useState(false)
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false)

  // 테스트용 상태
  const [isTestResultModalOpen, setIsTestResultModalOpen] = useState(false)
  const [testType, setTestType] = useState<
    'success-decision' | 'fail-decision' | 'pending-decision'
  >('success-decision')
  const { data: testResult } = useGetDecision(testType)

  const [predictionData, setPredictionData] = useState<{
    direction: 'UP' | 'DOWN' | 'NEUTRAL'
    confidence: number
  } | null>(null)

  useEffect(() => {
    if (response?.agent) {
      const type = response.agent.agentType.toLowerCase() as AgentType
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(type)
    }
  }, [response?.agent])

  const handleTabChange = (val: string) => {
    const type = val as AgentType
    setActiveTab(type)

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

  const { stock, agent, newsCard, briefing } = response

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
        left={<StatusBarBackButton onClick={() => navigate('/briefing')} />}
        title="브리핑"
        right={<StatusBarNotificationButton />}
      />

      {/* 2. 스크롤 가능한 본문 영역 */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-3 px-4">
          {/* 타이틀 */}
          <div className="flex items-center justify-between">
            <h1 className="dnf-Subtitle1 text-Gray-10">브리핑</h1>
            {/* 임시 테스트 버튼 */}
            <div className="flex gap-2">
              <button
                type="button"
                className="bg-Gray-2 text-Gray-7 rounded px-2 py-1 text-xs"
                onClick={() => {
                  setTestType('success-decision')
                  setIsTestResultModalOpen(true)
                }}
              >
                적중 모달
              </button>
              <button
                type="button"
                className="bg-Gray-2 text-Gray-7 rounded px-2 py-1 text-xs"
                onClick={() => {
                  setTestType('fail-decision')
                  setIsTestResultModalOpen(true)
                }}
              >
                실패 모달
              </button>
            </div>
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
                alert('예측 등록에 실패했습니다.')
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
          if (predictionData) {
            // 임시 테스트용: 선택한 방향에 따라 다른 결과 모달을 띄움
            if (predictionData.direction === 'UP') {
              setTestType('success-decision')
            } else if (predictionData.direction === 'DOWN') {
              setTestType('fail-decision')
            } else {
              setTestType('pending-decision') // 관망
            }
            setIsTestResultModalOpen(true)
          }
        }}
      />
      {testResult && (
        <BriefingResultModal
          isOpen={isTestResultModalOpen}
          isSuccess={testResult.isCorrect ?? false}
          points={Math.abs(testResult.apDelta ?? 0)}
          stockInfo={{
            name: testResult.stock.name,
            changeRate: testResult.stock.changeRate ?? 0,
          }}
          confidenceLevel={predictionData?.confidence ?? testResult.confidenceLevel}
          onClose={() => setIsTestResultModalOpen(false)}
        />
      )}
    </div>
  )
}
