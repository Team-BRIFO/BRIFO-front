import { Badge } from '@/components/common/Badge'
import { Loading } from '@/components/common/Loading'
import { StatusBar, StatusBarNotificationButton } from '@/components/common/StatusBar'
import { ErrorView } from '@/components/feature/error/ErrorView'
import { type AgentStatusMap, Office } from '@/components/feature/office/Office'
import { OfficeProgressSection } from '@/components/feature/office/OfficeProgressSection'
import Logo from '@/components/logos/logo-small.svg?react'
import { useUserProfileQuery } from '@/hooks/queries/user/useUserProfileQuery'
import { MOCK_OFFICE_DATA } from '@/pages/OfficePage/mockOffice'

import { useOfficeBriefingsQuery } from './hooks/useOfficeBriefingsQuery'

/** 사무실 탭 - SCR-04: 메인 대시보드 (사원 도트, AP 잔액 등) */
export function OfficePage() {
  const briefingsQuery = useOfficeBriefingsQuery()
  const userQuery = useUserProfileQuery()
  const balanceText = userQuery.data
    ? `${userQuery.data.apSummary.balance.toLocaleString()} AP`
    : userQuery.isError
      ? 'AP 조회 실패'
      : 'AP 불러오는 중'

  const items = briefingsQuery.data

  if (briefingsQuery.isError && !items) {
    return (
      <div className="flex min-h-dvh w-full flex-col pb-4">
        <StatusBar
          hasStatusArea={false}
          left={<Logo className="h-6 w-21" aria-label="BRIFO" />}
          right={<StatusBarNotificationButton />}
        />
        <div className="bg-Background1 flex-1 px-4 py-5">
          <ErrorView
            title="사무실 정보를 불러오지 못했어요"
            description="잠시 후 다시 시도해주세요."
            buttonText="다시 시도"
            onButtonClick={() => briefingsQuery.refetch()}
          />
        </div>
      </div>
    )
  }

  if (!items) {
    return (
      <div className="flex min-h-dvh w-full flex-col pb-4">
        <StatusBar
          hasStatusArea={false}
          left={<Logo className="h-6 w-21" aria-label="BRIFO" />}
          right={<StatusBarNotificationButton />}
        />
        <div className="bg-Background1 flex-1 px-4 py-5">
          <Loading className="py-10" />
        </div>
      </div>
    )
  }

  const availableCount = MOCK_OFFICE_DATA.maxRequestCount - items.length

  return (
    <div className="flex min-h-dvh w-full flex-col pb-4">
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

      <div className="bg-Background1 flex flex-col gap-5.5 px-4">
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
          availableCount={availableCount}
          isEmpty={items.length === 0}
        />
      </div>
    </div>
  )
}
