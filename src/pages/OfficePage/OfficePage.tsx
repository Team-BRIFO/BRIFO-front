import { Badge } from '@/components/common/Badge'
import { StatusBar, StatusBarNotificationButton } from '@/components/common/StatusBar'
import { Office, type AgentStatusMap } from '@/components/feature/office/Office'
import { OfficeProgressSection } from '@/components/feature/office/OfficeProgressSection'
import Logo from '@/components/logos/logo-small.svg?react'
import { useGetOfficeBriefings } from '@/hooks/queries/useBriefing'
import { MOCK_OFFICE_DATA } from '@/pages/OfficePage/mockOffice'
import type { AgentType } from '@/types/domain/agent'

/** 사무실 탭 - SCR-04: 메인 대시보드 (사원 도트, AP 잔액 등) */
export function OfficePage() {
  const { data: response } = useGetOfficeBriefings()

  const items = response?.result?.items ?? []
  const availableCount = MOCK_OFFICE_DATA.maxRequestCount - items.length

  return (
    <div className="flex min-h-[100dvh] w-full flex-col pb-24">
      {/* 상단 StatusBar */}
      <StatusBar
        hasStatusArea={false}
        left={<Logo width={84} height={24} aria-label="BRIFO" />}
        right={
          <div className="flex items-center gap-3">
            <Badge type="ap" className="bg-Yellow-80 text-Yellow-20">
              {`${MOCK_OFFICE_DATA.ap.toLocaleString()} AP`}
            </Badge>
            <StatusBarNotificationButton />
          </div>
        }
      />

      <div className="flex flex-col gap-5.5 px-4">
        {/* 헤더 */}
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="dnf-Subtitle2 text-Gray-10">사무실</h1>
            <p className="pretendard-Button2 text-Gray-6">내 AI 사원들을 관리하세요</p>
          </div>
          {items.length > 0 && (
            <Badge type="gray" size="md" className="pretendard-Caption1 justify-center px-3.5">
              {items[0].stockName}
            </Badge>
          )}
        </header>

        {/* 오피스 일러스트 + 캐릭터 */}
        <Office
          agentStatusMap={
            items.length > 0
              ? items[0].agents.reduce<AgentStatusMap>((acc, agent) => {
                acc[agent.agentType.toUpperCase() as Uppercase<AgentType>] = agent.status
                return acc
              }, {})
              : {}
          }
        />

        {/* 진행사항 섹션 */}
        <OfficeProgressSection items={items} availableCount={availableCount} />
      </div>
    </div>
  )
}
