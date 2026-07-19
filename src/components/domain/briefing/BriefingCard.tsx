import { StockInfo } from '@/components/domain/stock/StockInfo'
import { StockPriceChange } from '@/components/domain/stock/StockPriceChange'

export type BriefingStatus = 'ANALYZING' | 'COMPLETED'

export interface BriefingCardProps {
  /** 주식 및 기업 정보 */
  stock: {
    name: string
    price: number
    changeRate: number
    logoUrl?: string
    code?: string
    marketType?: string
  }
  /** 현재 분석 진행 상태 */
  status: BriefingStatus
  /** 현재 진행률 퍼센티지 수치 (0 ~ 100) */
  progress: number
  className?: string
}

const STATUS_TEXT = {
  ANALYZING: '분석중',
  COMPLETED: '브리핑 완료',
} as const

export function BriefingCard({ stock, status, progress, className = '' }: BriefingCardProps) {
  const badgeText = STATUS_TEXT[status]

  // COMPLETED 상태는 무조건 100%로 수렴 노출
  const displayProgress = status === 'COMPLETED' ? 100 : progress

  return (
    <div
      className={`border-Gray-2 bg-White box-border flex w-[328px] flex-col overflow-hidden rounded-[8px] border shadow-[0px_4px_40px_0px_rgba(224,224,224,0.15)] ${className}`}
    >
      {/* 상단: 주식 정보 영역 */}
      <div className="flex w-full items-start justify-between p-4 pb-4">
        {/* 좌측: 로고, 종목명, 주가/등락률 */}
        <div className="flex flex-col gap-1">
          <StockInfo
            name={stock.name}
            logoUrl={stock.logoUrl}
            code={stock.code}
            marketType={stock.marketType}
          />
          <StockPriceChange
            price={stock.price}
            changeRate={stock.changeRate}
            className="!flex-row items-center gap-1.5 pl-10"
          />
        </div>

        {/* 우측: 에이전트 프로필 및 텍스트 (명세에 없으나 UI 구현을 위해 임시 삽입) */}
        <div className="mt-1 flex items-center gap-1.5">
          <div className="flex -space-x-1.5">
            <div className="border-White bg-Pink-40 h-4 w-4 rounded-full border" />
            <div className="border-White bg-Yellow-40 h-4 w-4 rounded-full border" />
            <div className="border-White bg-Green-40 h-4 w-4 rounded-full border" />
          </div>
          <span className="text-Gray-6 pretendard-Caption2">
            {status === 'COMPLETED' ? '브리핑 완료' : '진행중'}
          </span>
        </div>
      </div>

      {/* 하단: 진행률 바 (Full Width) */}
      <div className="bg-Yellow-50 relative flex h-8 w-full items-center px-3">
        {/* 게이지 활성 (Fill) */}
        <div
          className="bg-Yellow-50 absolute top-0 left-0 h-full transition-all duration-300 ease-in-out"
          style={{ width: `${displayProgress}%` }}
        />

        {/* 텍스트 (Fill 위로 배치) */}
        <div className="relative z-10 flex w-full items-center justify-between">
          <span className="pretendard-Caption1 text-Yellow-10 shrink-0">{badgeText}</span>

          <span className="pretendard-Caption1 text-Yellow-10 shrink-0">{`${displayProgress}%`}</span>
        </div>
      </div>
    </div>
  )
}
