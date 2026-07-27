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
import { PATH } from '@/routes/paths'
import { useProfileStore } from '@/stores/useProfileStore'

import { HOME_CARD_NEWS_MOCK_DATA } from './mockData'

export function HomePage() {
  const navigate = useNavigate()
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)
  const nickname = useProfileStore((state) => state.nickname)
  const companyName = useProfileStore((state) => state.companyName)

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* 상단 흰색 영역 */}
        <div className="mx-auto flex w-82 flex-col pb-7">
          <StatusBar
            hasStatusArea
            className="w-full [&>div:last-child]:px-0"
            left={<Logo className="w-23" />}
            right={
              <div className="flex items-center gap-3">
                <div className="dnf-Caption2 bg-Yellow-80 text-Yellow-20 rounded-full px-3 py-2">
                  1280 AP
                </div>

                <StatusBarNotificationButton onClick={() => navigate(PATH.NOTIFICATION)} />
              </div>
            }
          />

          <HomeHeader nickname={nickname} companyName={companyName} />

          <div className="flex flex-col gap-3">
            <OfficeCard />

            <div className="grid grid-cols-2 gap-3">
              <SettlementCard remainingTime="02:18:42" />
              <PredictionCard count={3} onClick={() => navigate(PATH.OFFICE_PREDICTION)} />
            </div>

            <AttendanceBonusCard
              bonus={50}
              endTime="15:30"
              onClick={() => setIsAttendanceModalOpen(true)}
            />
          </div>
        </div>

        {/* 카드뉴스 회색 영역 */}
        <section className="bg-Gray-1 w-full pt-6 pb-24">
          <div className="px-4">
            <HomeCardNewsSection
              items={HOME_CARD_NEWS_MOCK_DATA}
              date="5/28"
              time="09:30"
              onItemClick={(id) => navigate(PATH.CARD_NEWS_DETAIL(String(id)))}
            />
          </div>
        </section>
      </main>

      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        attendedDays={5}
        reward={50}
        onClose={() => setIsAttendanceModalOpen(false)}
        onComplete={() => {
          // TODO: 출석 API 호출
          setIsAttendanceModalOpen(false)
        }}
      />
    </>
  )
}
