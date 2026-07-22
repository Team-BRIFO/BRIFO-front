interface AttendanceBonusCardProps {
  bonus: number
  endTime: string
  onClick?: () => void
}

export default function AttendanceBonusCard({ bonus, endTime, onClick }: AttendanceBonusCardProps) {
  return (
    <div className="bg-Yellow-100 flex h-17 w-82 items-center justify-between rounded-lg px-4 py-3.5">
      <div className="flex flex-col gap-1">
        <p className="pretendard-Button3 text-Yellow-5 font-bold">
          🔥 오늘의 출석 보너스 +{bonus} AP
        </p>

        <p className="pretendard-Caption3 text-Yellow-5 font-bold">{endTime} 장 마감 자동 정산</p>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="pretendard-Button2 bg-Yellow-80 text-Yellow-20 flex h-10 shrink-0 items-center justify-center rounded-[14px] px-4 py-5"
      >
        받기
      </button>
    </div>
  )
}
