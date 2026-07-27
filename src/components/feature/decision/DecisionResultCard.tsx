interface DecisionResultCardProps {
  points: number
  stockName: string
  changeRate: number
  resultText: string
  confidenceLevel: number
  comment: string
}

export function DecisionResultCard({
  points,
  stockName,
  changeRate,
  resultText,
  confidenceLevel,
  comment,
}: DecisionResultCardProps) {
  return (
    <section className="border-Gray-2 flex w-full flex-col items-center rounded-2xl border px-5 py-7 text-center">
      <h2 className="dnf-Title4 text-Gray-10">예측 적중!</h2>
      <strong className="dnf-Title3 text-Yellow-40 mt-4">+ {points} AP</strong>

      <div className="mt-5 flex flex-col items-center gap-1">
        <p className="pretendard-Button2 text-Gray-6">
          {stockName}{' '}
          <span className="text-Pink-30">
            {changeRate}% · {resultText}
          </span>
        </p>
        <p className="pretendard-Caption2 text-Gray-6">확신도 {confidenceLevel} × 적중 보너스</p>
      </div>

      <div className="bg-Yellow-100 border-Yellow-80 pretendard-Button1 text-Gray-9 mt-6 w-full rounded-lg border p-3">
        {comment}
      </div>
    </section>
  )
}
