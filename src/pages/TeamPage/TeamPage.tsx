import { useNavigate } from 'react-router-dom'

import { Badge } from '@/components/common/Badge'
import { StatusBar, StatusBarNotificationButton } from '@/components/common/StatusBar'
import { AgentListSection } from '@/components/feature/myEmployee/AgentListSection'
import Logo from '@/components/logos/logo-small.svg?react'
import { PATH } from '@/routes/paths'
import { mapAgentListItem } from '@/utils/agentMapper'

import { MOCK_AGENT_LIST_RESPONSE } from './mockAgents'

// TODO: User 도메인 연동 시 보유 AP로 대체
const MOCK_AP = 1280

/** 팀 탭 - SCR-12: 사원 관리 인사팀 화면 (Level/EXP, 일급) */
export function TeamPage() {
  const navigate = useNavigate()

  // TODO: useQuery 로 교체 (지금은 mock 응답 → 도메인 매핑)
  const agents = MOCK_AGENT_LIST_RESPONSE.result.items.map(mapAgentListItem)

  return (
    <div className="flex flex-col">
      <StatusBar
        hasStatusArea={false}
        left={<Logo width={84} height={24} aria-label="BRIFO" />}
        right={
          <div className="flex items-center gap-3">
            <Badge type="ap" className="bg-Yellow-80 text-Yellow-20">
              {`${MOCK_AP.toLocaleString()} AP`}
            </Badge>
            <StatusBarNotificationButton />
          </div>
        }
      />

      <div className="px-4 py-4">
        <AgentListSection
          agents={agents}
          onSelectAgent={(id) => {
            const agent = agents.find((a) => a.id === id)
            if (agent) navigate(PATH.TEAM_DETAIL(agent.type))
          }}
        />
      </div>
    </div>
  )
}
