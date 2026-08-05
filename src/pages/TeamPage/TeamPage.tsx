import { useNavigate } from 'react-router-dom'

import { StatusBar, StatusBarNotificationButton } from '@/components/common/StatusBar'
import { PageErrorView } from '@/components/feature/error/PageErrorView'
import { PageLoadingView } from '@/components/feature/error/PageLoadingView'
import { AgentListSection } from '@/components/feature/myEmployee/AgentListSection'
import Logo from '@/components/logos/logo-small.svg?react'
import { useAgentListQuery } from '@/hooks/queries/agent/useAgentListQuery'
import { useUserProfileQuery } from '@/hooks/queries/user/useUserProfileQuery'
import { PATH } from '@/routes/paths'

/** 팀 탭 - SCR-12: 사원 관리 인사팀 화면 (Level/EXP, 일급) */
export function TeamPage() {
  const navigate = useNavigate()

  const agentsQuery = useAgentListQuery()
  const userQuery = useUserProfileQuery()
  const balanceText = userQuery.data
    ? `${userQuery.data.apSummary.balance.toLocaleString()} AP`
    : '0 AP'
  const agents = agentsQuery.data

  if (!!agentsQuery.error && agentsQuery.fetchStatus === 'idle') {
    return (
      <div className="bg-Background1 flex flex-1 flex-col">
        <StatusBar
          hasStatusArea={false}
          left={<Logo className="h-6 w-21" aria-label="BRIFO" />}
          right={
            <div className="flex items-center gap-3">
              <div className="dnf-Caption2 bg-Yellow-80 text-Yellow-20 rounded-full px-3 py-2">
                {balanceText}
              </div>
              <StatusBarNotificationButton />
            </div>
          }
        />
        <PageErrorView
          title="사원 목록을 불러오지 못했어요"
          error={agentsQuery.error}
          onRetry={() => agentsQuery.refetch()}
        />
      </div>
    )
  }

  if (agentsQuery.fetchStatus === 'fetching' || !agents) {
    return (
      <div className="bg-Background1 flex flex-1 flex-col">
        <StatusBar
          hasStatusArea={false}
          left={<Logo className="h-6 w-21" aria-label="BRIFO" />}
          right={
            <div className="flex items-center gap-3">
              <div className="dnf-Caption2 bg-Yellow-80 text-Yellow-20 rounded-full px-3 py-2">
                {balanceText}
              </div>
              <StatusBarNotificationButton />
            </div>
          }
        />
        <PageLoadingView />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <StatusBar
        hasStatusArea={false}
        left={<Logo className="h-6 w-21" aria-label="BRIFO" />}
        right={
          <div className="flex items-center gap-3">
            <div className="dnf-Caption2 bg-Yellow-80 text-Yellow-20 rounded-full px-3 py-2">
              {balanceText}
            </div>
            <StatusBarNotificationButton />
          </div>
        }
      />

      <div className="px-4 py-4">
        {agents.length === 0 ? (
          <PageErrorView title="아직 등록된 사원이 없어요" description="새 사원을 배치해보세요." />
        ) : (
          <AgentListSection
            agents={agents}
            onSelectAgent={(agentId) => navigate(PATH.TEAM_DETAIL(agentId))}
          />
        )}
      </div>
    </div>
  )
}
