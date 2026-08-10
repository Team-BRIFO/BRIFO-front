import { Navigate, useNavigate, useParams } from 'react-router-dom'

import {
  StatusBar,
  StatusBarBackButton,
  StatusBarNotificationButton,
} from '@/components/common/StatusBar'
import { AgentDetailSection } from '@/components/feature/myEmployee/AgentDetailSection'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { useAgentDetailQuery } from '@/pages/TeamPage/hooks/useAgentDetailQuery'
import { PATH } from '@/routes/paths'

/** 팀 탭 - SCR-12: 사원 상세 (루키/프로/탱커 공용) */
export function TeamDetailPage() {
  const navigate = useNavigate()
  const { agentId = '' } = useParams()

  const { data: agent, fetchStatus, error, refetch } = useAgentDetailQuery(agentId || null)

  // 비정상적인 접근(ID 없음)이면 목록으로
  if (!agentId) {
    return <Navigate to={PATH.TEAM} replace />
  }

  return (
    <div className="bg-Background1 flex min-h-dvh flex-col">
      <StatusBar
        hasStatusArea={false}
        left={<StatusBarBackButton onClick={() => navigate(PATH.TEAM)} />}
        title="사원 상세"
        right={<StatusBarNotificationButton onClick={() => navigate(PATH.NOTIFICATION)} />}
        className="bg-White"
      />

      {!!error && fetchStatus === 'idle' ? (
        <PageErrorView
          title="사원 정보를 불러오지 못했어요"
          error={error}
          onRetry={() => refetch()}
        />
      ) : fetchStatus === 'fetching' || !agent ? (
        <PageLoadingView />
      ) : (
        <div className="px-4 py-4">
          <AgentDetailSection agent={agent} />
        </div>
      )}
    </div>
  )
}
