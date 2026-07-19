import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  StatusBar,
  StatusBarBackButton,
  StatusBarNotificationButton,
} from '@/components/common/StatusBar'
import { Tabs } from '@/components/common/Tabs'
import { BriefingMainContentSheet } from '@/components/feature/briefing/BriefingMainContentSheet'
import { useGetBriefingDetail } from '@/hooks/queries/useBriefing'
import { MOCK_AGENT_DETAIL_RESPONSES } from '@/pages/TeamPage/mockAgents'
import type { AgentSummary, AgentType } from '@/types/domain/agent'

export function BriefingPage() {
  const [searchParams] = useSearchParams()
  // URL에서 id 파라미터 추출 (없으면 기본 mock UUID 사용)
  const briefingId = searchParams.get('id') ?? '51f6a481-3a4f-4f74-b5b7-2f7f6a0d8c31'

  const { data: response, isLoading, isError } = useGetBriefingDetail(briefingId)

  // 탭 상태 (API 응답이 오면 해당 사원으로 탭 자동 동기화)
  const [activeTab, setActiveTab] = useState<AgentType>('rookie')

  useEffect(() => {
    if (response?.agent) {
      const type = response.agent.agentType.toLowerCase() as AgentType
      setActiveTab(type)
    }
  }, [response?.agent])

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
  }

  return (
    <div className="bg-Gray-1 flex h-screen w-full flex-col">
      {/* 1. 글로벌 상태바 헤더 (배경 흰색) */}
      <StatusBar
        className="bg-White"
        left={<StatusBarBackButton />}
        title="브리핑"
        right={<StatusBarNotificationButton />}
      />

      {/* 2. 스크롤 가능한 본문 영역 */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-4 px-4 py-6">
          {/* 타이틀 */}
          <h1 className="dnf-Title1 text-Gray-10">브리핑</h1>

          {/* 에이전트 선택 탭 (피그마 스펙 Type 1) */}
          <Tabs
            variant="segmented"
            segmentedType={1}
            value={activeTab}
            onChange={(val) => {
              setActiveTab(val as AgentType)
              // 향후 다른 사원 탭을 누를 때, briefingId를 교체하거나 처리하는 로직 추가 가능
            }}
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
              onConfirm={() => alert('결정!')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
