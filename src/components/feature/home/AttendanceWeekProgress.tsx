/* 주간 출석 현황 */
import CheckIcon from '@/assets/icons/check.svg?react'
import StarIcon from '@/assets/icons/star.svg?react'

const DAYS = ['월', '화', '수', '목', '금', '토', '일'] as const

interface AttendanceWeekProgressProps {
  attendedDays: number
  totalDays?: number
}

export default function AttendanceWeekProgress({
  attendedDays,
  totalDays = 7,
}: AttendanceWeekProgressProps) {
  const safeAttendedDays = Math.min(Math.max(attendedDays, 0), totalDays)

  return (
    <section className="w-full">
      <div className="flex items-center justify-between">
        <span className="pretendard-Caption1 text-Gray-7">이번 주 출석</span>

        <span className="pretendard-Caption1 text-Gray-7 font-bold">
          {safeAttendedDays} / {totalDays}
        </span>
      </div>

      <div className="bg-Gray-2 mt-2 h-px w-full" />

      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {DAYS.map((day, index) => {
          const isAttended = index < safeAttendedDays

          return (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  isAttended ? 'bg-Yellow-40' : 'bg-Gray-1'
                }`}
              >
                {isAttended ? (
                  <CheckIcon className="h-6 w-6 text-white" />
                ) : (
                  <StarIcon className="text-Gray-3 h-6 w-6" />
                )}
              </div>

              <span className="pretendard-Caption1 text-Gray-7">{day}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
