import { useNavigate } from 'react-router-dom'

import { StatusBar, StatusBarNotificationButton } from '@/components/common/StatusBar'
import { AgentListSection } from '@/components/feature/myEmployee/AgentListSection'
import Logo from '@/components/logos/logo-small.svg?react'
import { useMyUser } from '@/hooks/queries/useMy'
import { PATH } from '@/routes/paths'
import { mapAgentListItem } from '@/utils/agentMapper'

import { MOCK_AGENT_LIST_RESPONSE } from './mockAgents'
/** 팀 탭 - SCR-12: 사원 관리 인사팀 화면 (Level/EXP, 일급) */
export function TeamPage() {
  const navigate = useNavigate()

  // TODO: useQuery 로 교체 (지금은 mock 응답 → 도메인 매핑)
  const agents = MOCK_AGENT_LIST_RESPONSE.result.items.map(mapAgentListItem)

  const { data: userResponse } = useMyUser()
  const balanceAp = userResponse?.balanceAp ?? 0

  return (
    <div className="flex flex-1 flex-col">
      <StatusBar
        hasStatusArea={false}
        left={<Logo className="h-[1.5rem] w-[5.25rem]" aria-label="BRIFO" />}
        right={
          <div className="flex items-center gap-3">
            <div className="dnf-Caption2 bg-Yellow-80 text-Yellow-20 rounded-full px-3 py-2">
              {`${balanceAp.toLocaleString()} AP`}
            </div>
            <StatusBarNotificationButton />
          </div>
        }
      />

      <div className="px-4 pb-4">
        <AgentListSection
          agents={agents}
          onSelectAgent={(agentId) => navigate(PATH.TEAM_DETAIL(agentId))}
        />
      </div>
    </div>
  )
}
