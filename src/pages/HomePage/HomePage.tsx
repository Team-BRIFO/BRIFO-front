import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Logo from '@/assets/logo/brifo_logo.svg?react'
import { StatusBar, StatusBarNotificationButton } from '@/components/common/StatusBar'
import AttendanceBonusCard from '@/components/feature/home/AttendanceBonusCard'
import AttendanceModal from '@/components/feature/home/AttendanceModal'
import HomeCardNewsSection from '@/components/feature/home/HomeCardNewsSection'
import HomeHeader from '@/components/feature/home/HomeHeader'
import OfficeCard from '@/components/feature/home/OfficeCard'
import PredictionCard from '@/components/feature/home/PredictionCard'
import SettlementCard from '@/components/feature/home/SettlementCard'
import { useCreateAttendanceRewardMutation } from '@/hooks/queries/ap/useApQueries'
import { useSettlementCountdown } from '@/pages/HomePage/hooks/useSettlementCountdown'
import { useUserHomeQuery } from '@/pages/HomePage/hooks/useUserHomeQuery'
import { PATH } from '@/routes/paths'

function formatBatchTime(batchTime?: string) {
  if (!batchTime) return { date: '', time: '' }

  const date = new Date(batchTime)
  return {
    date: `${date.getMonth() + 1}/${date.getDate()}`,
    time: new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date),
  }
}

export function HomePage() {
  const navigate = useNavigate()
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)
  const attendanceReward = useCreateAttendanceRewardMutation()
  const homeQuery = useUserHomeQuery()
  const settlementRemainingTime = useSettlementCountdown()
  const home = homeQuery.data
  const balanceText = `${(home?.user.balanceAp ?? 0).toLocaleString()} AP`
  const employeeLevels = Object.fromEntries(
    (home?.agents ?? []).map((agent) => [agent.agentType, agent.level]),
  )
  const cardNewsItems = (home?.todayNewsCards.items ?? []).map((item) => ({
    id: item.cardId,
    stock: {
      name: item.stock.name,
      changeRate: item.stock.changeRate,
    },
    newsCount: 1,
    headline: item.headline,
    isCompleted: false,
  }))
  const batchTime = formatBatchTime(home?.todayNewsCards.batchTime)

  return (
    <>
      <main className="min-h-screen bg-white">
        <StatusBar
          hasStatusArea={false}
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
        <div className="flex w-full flex-col px-4 pb-7">
          <HomeHeader
            nickname={home?.user.nickname ?? ''}
            companyName={home?.user.companyName ?? ''}
          />

          <div className="flex flex-col gap-3">
            <OfficeCard levels={employeeLevels} />

            <div className="grid grid-cols-2 gap-3">
              <SettlementCard remainingTime={settlementRemainingTime} />
              <PredictionCard
                count={home?.todayDecisions.count ?? 0}
                onClick={() => navigate(PATH.OFFICE_PREDICTION)}
              />
            </div>

            <AttendanceBonusCard
              bonus={50}
              endTime="15:30"
              onClick={() => setIsAttendanceModalOpen(true)}
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

      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        attendedDays={home?.weeklyAttendanceDays ?? 0}
        attendanceDates={home?.dates ?? []}
        reward={50}
        isAttended={home?.attendedToday ?? false}
        isPending={attendanceReward.isPending}
        onClose={() => setIsAttendanceModalOpen(false)}
        onComplete={() => {
          attendanceReward.mutate(undefined, {
            onSuccess: () => setIsAttendanceModalOpen(false),
          })
        }}
      />
    </>
  )
}
