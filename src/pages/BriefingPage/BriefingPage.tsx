import { useState } from 'react'

import {
  StatusBar,
  StatusBarBackButton,
  StatusBarNotificationButton,
} from '@/components/common/StatusBar'
import { Tabs } from '@/components/common/Tabs'
import { BriefingMainContentSheet } from '@/components/feature/briefing/BriefingMainContentSheet'
import type { AgentSummary, AgentType } from '@/types/domain/agent'

const AGENT_DATA: Record<AgentType, AgentSummary> = {
  rookie: {
    id: 'rookie-1',
    type: 'rookie',
    name: '루키',
    modelName: 'Claude Haiku 4.5',
    level: 8,
    levelProgress: 30,
    hitRate: 64,
    dailyAP: 10,
  },
  pro: {
    id: 'pro-1',
    type: 'pro',
    name: '프로',
    modelName: 'GPT-4o',
    level: 15,
    levelProgress: 60,
    hitRate: 75,
    dailyAP: 30,
  },
  tanker: {
    id: 'tanker-1',
    type: 'tanker',
    name: '탱커',
    modelName: 'HyperCLOVA X',
    level: 20,
    levelProgress: 90,
    hitRate: 80,
    dailyAP: 50,
  },
}

export function BriefingPage() {
  const [activeTab, setActiveTab] = useState<AgentType>('rookie')

  const currentAgent = AGENT_DATA[activeTab]

  const dummyBriefing = {
    badgeType: 'rise' as const,
    badgeText: '상승 예측',
    percentage: 72,
    headline: 'HBM 수주 확대로 단기 모멘텀 강세',
    commentTag: '사장님 맞춤',
    comment: '사장님, 지난번 SK하이닉스 관망이 적중하셨죠! 이번 삼성전자도 결이 비슷해요.',
    noteMessage:
      '사장님, 이건 진짜 기회예요! HBM3E 12단 양산이 시작됐고, 엔비디아·AMD 공급 계약까지 임박했어요. 게다가 외국인이 5거래일 연속 순매수 중이라 수급도 든든합니다! 과거 HBM3 양산 발표 때도 한 달간 강세였던 전례가 있어요. 다만 단기 급등 구간이라 분할 접근만 주의하면 좋겠습니다.',
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
            onChange={(val) => setActiveTab(val as AgentType)}
            items={[
              { label: '루키', value: 'rookie' },
              { label: '프로', value: 'pro' },
              { label: '탱커', value: 'tanker' },
            ]}
          />

          {/* 메인 브리핑 시트 (가운데 정렬) */}
          <div className="mt-2 flex justify-center">
            <BriefingMainContentSheet
              agent={currentAgent}
              briefing={dummyBriefing}
              onConfirm={() => alert('결정!')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
