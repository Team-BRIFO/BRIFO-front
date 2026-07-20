/* 오늘 결정한 예측 */
interface PredictionCardProps {
  count: number
}
export default function PredictionCard({ count }: PredictionCardProps) {
  return (
    <div className="border-Gray-1 flex flex-col items-start justify-center gap-1 rounded-xl border bg-white px-4 py-3.5 shadow-[0_0_10px_rgba(230,230,230,0.25)]">
      <div className="text-Gray-10 pretendard-Body2-Semibold">오늘 결정한 예측</div>
      <div className="text-Gray-10 dnf-Subtitle1">{count}건</div>
    </div>
  )
}
