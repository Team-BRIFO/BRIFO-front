import { Badge } from '@/components/common/Badge'
import { StockInfo } from '@/components/domain/stock/StockInfo'

export interface BriefingCardProps {
  /** 카드 컴포넌트의 진행 상태 타입 (버전 2 명세) */
  type: '완료' | '진행중'
  /** 클릭/활성화 상태 (테두리 및 인터랙션 변화) */
  active?: boolean
  /** 상단 좌측 랭킹 (예: 1) */
  rank?: number | null
  /** 주식 및 기업 정보 */
  stock: {
    name: string
    logoUrl?: string
    code?: string
    marketType?: string
  }
  className?: string
}

export function BriefingCard({
  type,
  active = false,
  rank,
  stock,
  className = '',
}: BriefingCardProps) {
  // 상태 및 활성화 여부에 따른 동적 스타일 매핑
  let containerBgClass = 'bg-White'
  let borderClass = 'border-Gray-2'
  let bottomBgClass = 'bg-Gray-1'
  let rankClass = 'text-Gray-5'

  if (type === '완료') {
    rankClass = 'text-Pink-30'
    if (active) {
      containerBgClass = 'bg-Pink-100'
      borderClass = 'border-Pink-60' // 피그마 액티브 테두리
      bottomBgClass = 'bg-Pink-60'
    } else {
      containerBgClass = 'bg-White'
      borderClass = 'border-Gray-2'
      bottomBgClass = 'bg-Gray-1'
    }
  } else if (type === '진행중') {
    rankClass = 'text-Gray-5'
    if (active) {
      containerBgClass = 'bg-Gray-1'
      borderClass = 'border-Gray-2' // 피그마 액티브 테두리 명세
      bottomBgClass = 'bg-Gray-2'
    } else {
      containerBgClass = 'bg-White'
      borderClass = 'border-Gray-2'
      bottomBgClass = 'bg-Gray-1'
    }
  }

  return (
    <div
      className={`shadow-card relative box-border flex h-[5.75rem] w-full cursor-pointer flex-col overflow-hidden rounded-lg border px-2 pt-5 pb-[1.375rem] transition-colors ${containerBgClass} ${borderClass} ${className}`}
    >
      {/* 하단 배경색 분리 레이어 (Bottom Half Background) */}
      <div className={`absolute bottom-0 left-0 h-11 w-full transition-colors ${bottomBgClass}`} />

      {/* 내부 콘텐츠 레이어 */}
      <div className="relative z-10 flex h-full flex-col justify-between px-2">
        {/* 상단 라인: 순위, 로고, 종목명 및 우측 상태 배지 */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            {rank != null && (
              <span
                className={`dnf-Subtitle3 w-[1.125rem] text-center transition-colors ${rankClass}`}
              >
                {rank}
              </span>
            )}
            <StockInfo
              name={stock.name}
              logoUrl={stock.logoUrl}
              code={stock.code}
              marketType={stock.marketType}
            />
          </div>

          <Badge type={type === '완료' ? 'complete' : 'progress'}>{type}</Badge>
        </div>

        {/* 하단 라인: 3개의 개별 에이전트 완료/진행중 배지 */}
        <div className="flex w-full items-center gap-1.5">
          <Badge type={type === '완료' ? 'rookie-complete' : 'rookie-progress'}>
            {`루키 ${type}`}
          </Badge>
          <Badge type={type === '완료' ? 'pro-complete' : 'pro-progress'}>{`프로 ${type}`}</Badge>
          <Badge type={type === '완료' ? 'tanker-complete' : 'tanker-progress'}>
            {`탱커 ${type}`}
          </Badge>
        </div>
      </div>
    </div>
  )
}
