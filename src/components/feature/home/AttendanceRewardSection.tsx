import { useState } from 'react'

import AttendanceBonusCard from '@/components/feature/home/AttendanceBonusCard'
import AttendanceModal from '@/components/feature/home/AttendanceModal'
import { useCreateAttendanceRewardMutation } from '@/hooks/queries/ap/useApQueries'

interface AttendanceRewardSectionProps {
  attendedDays: number
  attendanceDates: string[]
  isAttended: boolean
}

/**
 * 출석 보상 카드와 모달이 쓰는 로컬 UI·요청 상태.
 * 모달을 여닫는 동작이 HomePage 전체로 전파되지 않도록 별도 경계를 둔다.
 */
export default function AttendanceRewardSection({
  attendedDays,
  attendanceDates,
  isAttended,
}: AttendanceRewardSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const attendanceReward = useCreateAttendanceRewardMutation()

  return (
    <>
      <AttendanceBonusCard bonus={50} endTime="15:30" onClick={() => setIsModalOpen(true)} />

      <AttendanceModal
        isOpen={isModalOpen}
        attendedDays={attendedDays}
        attendanceDates={attendanceDates}
        reward={50}
        isAttended={isAttended}
        isPending={attendanceReward.isPending}
        onClose={() => setIsModalOpen(false)}
        onComplete={() => {
          attendanceReward.mutate(undefined, {
            onSuccess: () => setIsModalOpen(false),
          })
        }}
      />
    </>
  )
}
