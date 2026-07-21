import { AnalyzeCard } from '@/components/feature/stock/AnalyzeCard'
import type { AnalyzeResultType } from '@/components/feature/stock/AnalyzeCard'

const MOCK_STOCK = {
  stockId: '1',
  name: '삼성전자',
  price: 79200,
  changeRate: 2.1,
  tradeDate: '2026-07-03',
  hashtags: ['HBM3E', '공급계약', '외국인 순매수'],
}

const RESULT_TYPES: AnalyzeResultType[] = [
  'HASHTAG',
  'ERROR',
  'SUCCESS_UP',
  'SUCCESS_DOWN',
  'SUCCESS_HOLD',
  'FAIL_UP',
  'FAIL_DOWN',
  'FAIL_HOLD',
]

/** 홈 탭: 메인 랜딩 (출석체크/알림 컴포넌트 포함 예정) */
export function HomePage() {
  return (
    <div className="bg-Gray-1 flex min-h-[100dvh] w-full flex-col items-center gap-6 p-6 pb-20">
      <h1 className="dnf-Title2 text-Gray-10">AnalyzeCard 컴포넌트</h1>
      <div className="flex w-full flex-col gap-4">
        {RESULT_TYPES.map((type) => (
          <div key={type} className="flex flex-col gap-2">
            <h2 className="pretendard-Subtitle1 text-Gray-8">{type}</h2>
            <AnalyzeCard type="normal" resultType={type} stock={MOCK_STOCK} />
          </div>
        ))}
      </div>
    </div>
  )
}
