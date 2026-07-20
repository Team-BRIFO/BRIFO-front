/* 오늘 출석 보상 */
interface AttendanceRewardProps {
  reward: number
}

export default function AttendanceReward({ reward }: AttendanceRewardProps) {
  return (
    <section className="flex flex-col items-center text-center">
      <h2 className="dnf-Title4 text-Gray-10">오늘도 출근!</h2>

      <p className="dnf-Title3 text-Yellow-40 mt-2">+ {reward} AP</p>

      <p className="pretendard-Button2 font-regular text-Gray-6 mt-3">
        오늘도 브리포에 출근했어요!
      </p>
    </section>
  )
}
