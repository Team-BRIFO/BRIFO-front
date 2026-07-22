/* 다음 정산까지 */
interface SettlementCardProps {
  remainingTime: string
}

export default function SettlementCard({ remainingTime }: SettlementCardProps) {
  return (
    <div className="border-Gray-1 flex flex-1 flex-col justify-center gap-1 rounded-xl border bg-white px-4 py-3.5 shadow-[0_0_10px_rgba(230,230,230,0.25)]">
      <span className="pretendard-Body2-Semibold text-Gray-10">다음 정산까지</span>

      <span className="dnf-Subtitle2 text-Yellow-40">{remainingTime}</span>
    </div>
  )
}
