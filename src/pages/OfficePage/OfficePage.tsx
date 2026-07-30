import { Badge } from '@/components/common/Badge'
import { StatusBar, StatusBarNotificationButton } from '@/components/common/StatusBar'
import { PageErrorView } from '@/components/feature/error/PageErrorView'
import { PageLoadingView } from '@/components/feature/error/PageLoadingView'
import { type AgentStatusMap, Office } from '@/components/feature/office/Office'
import { OfficeProgressSection } from '@/components/feature/office/OfficeProgressSection'
import Logo from '@/components/logos/logo-small.svg?react'
import { useUserProfileQuery } from '@/hooks/queries/user/useUserProfileQuery'
import { useOfficeBriefingsQuery } from '@/pages/OfficePage/hooks/useOfficeBriefingsQuery'
import { MOCK_OFFICE_DATA } from '@/pages/OfficePage/mockOffice'

/** 사무실 탭 - SCR-04: 메인 대시보드 (사원 도트, AP 잔액 등) */
export function OfficePage() {
  const briefingsQuery = useOfficeBriefingsQuery()
  const userQuery = useUserProfileQuery()
  const balanceText = userQuery.data
    ? `${userQuery.data.apSummary.balance.toLocaleString()} AP`
    : '0 AP'

  const items = briefingsQuery.data

  return (
    <div className="bg-Background1 flex min-h-dvh w-full flex-col pb-4">
      {/* 상단 StatusBar */}
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

      {briefingsQuery.isError && !items ? (
        <PageErrorView error={briefingsQuery.error} onRetry={() => briefingsQuery.refetch()} />
      ) : !items ? (
        <PageLoadingView />
      ) : (
        <div className="flex flex-col gap-5.5 px-4">
          {/* 헤더 */}
          <header className="flex items-center justify-between pt-3">
            <div className="flex flex-col gap-2">
              <h1 className="dnf-Subtitle2 text-Gray-10">사무실</h1>
              <p className="pretendard-Button2 text-Gray-6">내 AI 사원들을 관리하세요</p>
            </div>
            {items.length > 0 && (
              <Badge
                type="gray"
                size="md"
                className="bg-Gray-2 text-Gray-6 pretendard-Caption1 justify-center px-3.5"
              >
                {items[0].stockName}
              </Badge>
            )}
          </header>

          {/* 오피스 일러스트 + 캐릭터 */}
          <Office
            agentStatusMap={items.reduce<AgentStatusMap>((acc, item) => {
              item.agents.forEach((agent) => {
                const current = acc[agent.type]
                if (current !== 'ANALYZING' && current !== 'PENDING') {
                  acc[agent.type] = agent.status
                }
              })
              return acc
            }, {})}
          />

          {/* 진행사항 섹션 */}
          <OfficeProgressSection
            items={items}
            availableCount={MOCK_OFFICE_DATA.maxRequestCount - items.length}
            isEmpty={items.length === 0}
          />
        </div>
      )}
    </div>
  )
}
