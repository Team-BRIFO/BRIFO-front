import { Navigate, useNavigate, useParams } from 'react-router-dom'

import { Loading } from '@/components/common/Loading'
import {
  StatusBar,
  StatusBarBackButton,
  StatusBarNotificationButton,
} from '@/components/common/StatusBar'
import { AgentDetailSection } from '@/components/feature/myEmployee/AgentDetailSection'
import { useAgentDetailQuery } from '@/hooks/queries/agent/useAgentQueries'
import { PATH } from '@/routes/paths'

/** 팀 탭 - SCR-12: 사원 상세 (루키/프로/탱커 공용) */
export function TeamDetailPage() {
  const navigate = useNavigate()
  const { agentId = '' } = useParams()

  const { data: agent, isError } = useAgentDetailQuery(agentId || null)

  // 존재하지 않는 사원이면 목록으로
  if (!agentId || (isError && !agent)) {
    return <Navigate to={PATH.TEAM} replace />
  }

  if (!agent) return <Loading className="py-10" />

  return (
    <div className="flex flex-col">
      <StatusBar
        hasStatusArea={false}
        left={<StatusBarBackButton onClick={() => navigate(PATH.TEAM)} />}
        title="사원 상세"
        right={<StatusBarNotificationButton />}
      />

      <div className="px-4 py-4">
        <AgentDetailSection agent={agent} />
      </div>
    </div>
  )
}
