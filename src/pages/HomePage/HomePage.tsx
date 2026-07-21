import { useState } from 'react'

import Logo from '@/assets/logo/brifo_logo.svg?react'
import { StatusBar, StatusBarNotificationButton } from '@/components/common/StatusBar'
import AttendanceBonusCard from '@/components/feature/home/AttendanceBonusCard'
import AttendanceModal from '@/components/feature/home/AttendanceModal'
import HomeHeader from '@/components/feature/home/HomeHeader'
import OfficeCard from '@/components/feature/home/OfficeCard'
import PredictionCard from '@/components/feature/home/PredictionCard'
import SettlementCard from '@/components/feature/home/SettlementCard'
import { useNavigate } from 'react-router-dom'

export function HomePage() {
  const navigate = useNavigate()
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)

  return (
    <>
      <main className="flex min-h-screen justify-center bg-white px-6">
        <div className="flex w-82 flex-col">
          <StatusBar
            hasStatusArea
            className="w-full [&>div:last-child]:px-0"
            left={<Logo className="w-23" />}
            right={
              <div className="flex items-center gap-3">
                <div className="dnf-Caption2 bg-Yellow-80 text-Yellow-20 rounded-full px-3 py-2">
                  1280 AP
                </div>

                <StatusBarNotificationButton onClick={() => navigate('/notification')} />
              </div>
            }
          />

          {/*TODO: 닉네임, 회사명 API 연동*/}
          <HomeHeader nickname="포롱" companyName="가즈아 투자사" />

          <div className="flex flex-col gap-3">
            <OfficeCard />

            <div className="grid grid-cols-2 gap-3">
              <SettlementCard remainingTime="02:18:42" />
              <PredictionCard count={3} />
            </div>

            <AttendanceBonusCard
              bonus={50}
              endTime="15:30"
              onClick={() => setIsAttendanceModalOpen(true)}
            />
          </div>
        </div>
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
