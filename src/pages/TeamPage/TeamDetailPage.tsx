import { Navigate, useNavigate, useParams } from 'react-router-dom'

import {
  StatusBar,
  StatusBarBackButton,
  StatusBarNotificationButton,
} from '@/components/common/StatusBar'
import { AgentDetailSection } from '@/components/feature/myEmployee/AgentDetailSection'
import { PATH } from '@/routes/paths'
import { mapAgentDetail } from '@/utils/agentMapper'

import { MOCK_AGENT_DETAIL_RESPONSES } from './mockAgents'

/** 팀 탭 - SCR-12: 사원 상세 (루키/프로/탱커 공용) */
export function TeamDetailPage() {
  const navigate = useNavigate()
  const { agentId = '' } = useParams()

  // TODO: useQuery(agentId) 로 교체 (지금은 mock 응답 → 도메인 매핑)
  const response = MOCK_AGENT_DETAIL_RESPONSES[agentId]

  // 존재하지 않는 사원이면 목록으로
  if (!response) {
    return <Navigate to={PATH.TEAM} replace />
  }

  const agent = mapAgentDetail(response.result)

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
