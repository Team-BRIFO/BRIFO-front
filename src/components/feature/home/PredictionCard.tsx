/* 오늘 결정한 예측 */
interface PredictionCardProps {
  count: number
  onClick?: () => void
}
export default function PredictionCard({ count, onClick }: PredictionCardProps) {
  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`border-Gray-1 flex flex-col items-start justify-center gap-1 rounded-xl border bg-white px-4 py-3.5 shadow-[0_0_10px_rgba(230,230,230,0.25)] ${onClick ? 'focus-visible:ring-Pink-30 cursor-pointer focus:outline-none focus-visible:ring-2' : ''}`}
    >
      <div className="text-Gray-10 pretendard-Body2-Semibold">오늘 결정한 예측</div>
      <div className="text-Gray-10 dnf-Subtitle1">{count}건</div>
    </div>
  )
}
