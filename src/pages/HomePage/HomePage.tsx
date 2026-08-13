import { useNavigate } from 'react-router-dom'

import Logo from '@/assets/logo/brifo_logo_small.svg?react'
import { StatusBar, StatusBarNotificationButton } from '@/components/common/StatusBar'
import AttendanceRewardSection from '@/components/feature/home/AttendanceRewardSection'
import HomeCardNewsSection from '@/components/feature/home/HomeCardNewsSection'
import HomeHeader from '@/components/feature/home/HomeHeader'
import OfficeCard from '@/components/feature/home/OfficeCard'
import PredictionCard from '@/components/feature/home/PredictionCard'
import SettlementCountdownCard from '@/components/feature/home/SettlementCountdownCard'
import { mapTodayNewsCardsByStock } from '@/mappers/homeMapper'
import { useUserHomeQuery } from '@/pages/HomePage/hooks/useUserHomeQuery'
import { useOfficeBriefingsQuery } from '@/pages/OfficePage/hooks/useOfficeBriefingsQuery'
import { PATH } from '@/routes/paths'
import { formatBatchTime } from '@/utils/formatBatchTime'

export function HomePage() {
  const navigate = useNavigate()
  const homeQuery = useUserHomeQuery()
  const officeQuery = useOfficeBriefingsQuery()

  const home = homeQuery.data
  const balanceText = `${(home?.user.balanceAp ?? 0).toLocaleString()} AP`
  const employeeLevels = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (home?.agents ?? []).map((agent: any) => [agent.agentType, agent.level]),
  )
  const cardNewsItems = mapTodayNewsCardsByStock(
    home?.todayNewsCards.items ?? [],
    officeQuery.data ?? [],
  )
  const batchTime = formatBatchTime(home?.todayNewsCards.batchTime)

  return (
    <>
      <main className="bg-Background1 min-h-full">
        <StatusBar
          hasStatusArea={false}
          className="bg-white"
          left={<Logo className="h-6 w-21" />}
          right={
            <div className="flex items-center gap-3">
              <div className="dnf-Caption2 bg-Yellow-80 text-Yellow-20 rounded-full px-3 py-2">
                {balanceText}
              </div>

              <StatusBarNotificationButton onClick={() => navigate(PATH.NOTIFICATION)} />
            </div>
          }
        />

        {/* 상단 흰색 영역 */}
        <div className="flex w-full flex-col bg-white px-4 pb-7">
          <HomeHeader
            nickname={home?.user.nickname ?? ''}
            companyName={home?.user.companyName ?? ''}
          />

          <div className="flex flex-col gap-3">
            <OfficeCard levels={employeeLevels} />

            <div className="grid grid-cols-2 gap-3">
              <SettlementCountdownCard />
              <PredictionCard
                count={home?.todayDecisions.count ?? 0}
                onClick={() => navigate(PATH.OFFICE_PREDICTION)}
              />
            </div>

            <AttendanceRewardSection
              attendedDays={home?.weeklyAttendanceDays ?? 0}
              attendanceDates={home?.dates ?? []}
              isAttended={home?.attendedToday ?? false}
            />
          </div>
        </div>

        {/* 카드뉴스 회색 영역 */}
        <section className="bg-Background1 w-full pt-6 pb-24">
          <div className="px-4">
            <HomeCardNewsSection
              items={cardNewsItems}
              date={batchTime.date}
              time={batchTime.time}
              onItemClick={(id) => navigate(PATH.CARD_NEWS_DETAIL(String(id)))}
            />
          </div>
        </section>
      </main>
    </>
  )
}
