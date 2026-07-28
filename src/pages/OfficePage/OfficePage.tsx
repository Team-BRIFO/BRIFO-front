import { Badge } from '@/components/common/Badge'
import { StatusBar, StatusBarNotificationButton } from '@/components/common/StatusBar'
import { type AgentStatusMap, Office } from '@/components/feature/office/Office'
import { OfficeProgressSection } from '@/components/feature/office/OfficeProgressSection'
import Logo from '@/components/logos/logo-small.svg?react'
import { useGetOfficeBriefings } from '@/hooks/queries/useBriefing'
import { useMyUser } from '@/hooks/queries/useMy'
import { MOCK_OFFICE_DATA } from '@/pages/OfficePage/mockOffice'
import type { AgentType } from '@/types/domain/agent'

/** 사무실 탭 - SCR-04: 메인 대시보드 (사원 도트, AP 잔액 등) */
export function OfficePage() {
  const { data: response } = useGetOfficeBriefings()
  const { data: userResponse } = useMyUser()
  const balanceAp = userResponse?.balanceAp ?? 0

  const items = response?.result?.items ?? []
  const availableCount = MOCK_OFFICE_DATA.maxRequestCount - items.length

  return (
    <div className="flex min-h-[100dvh] w-full flex-col pb-4">
      {/* 상단 StatusBar */}
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
              const key = agent.agentType.toUpperCase() as Uppercase<AgentType>
              const current = acc[key]
              if (current !== 'ANALYZING' && current !== 'PENDING') {
                acc[key] = agent.status
              }
            })
            return acc
          }, {})}
        />

        {/* 진행사항 섹션 */}
        <OfficeProgressSection items={items} availableCount={availableCount} />
      </div>
    </div>
  )
}
