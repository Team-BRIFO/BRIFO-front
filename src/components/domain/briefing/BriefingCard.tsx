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
  /** 각 사원별 진행 상태 (옵션). 주어지지 않으면 카드의 type을 따름 */
  agentStatuses?: {
    rookie?: '완료' | '진행중'
    pro?: '완료' | '진행중'
    tanker?: '완료' | '진행중'
  }
  className?: string
  onClick?: () => void
}

export function BriefingCard({
  type,
  active = false,
  rank,
  stock,
  agentStatuses,
  className = '',
  onClick,
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

  const rookieStatus = agentStatuses?.rookie ?? type
  const proStatus = agentStatuses?.pro ?? type
  const tankerStatus = agentStatuses?.tanker ?? type

  return (
    <div
      onClick={onClick}
      className={`shadow-card box-border flex w-full flex-col items-start overflow-hidden rounded-lg border transition-colors ${onClick ? 'cursor-pointer' : ''} ${containerBgClass} ${borderClass} ${className}`}
    >
      {/* 상단 라인: 순위, 로고, 종목명 및 우측 상태 배지 */}
      <div className="flex w-full items-center justify-between px-5 py-3">
        <div className="flex items-center gap-3.5">
          {rank != null && (
            <span className={`dnf-Subtitle3 text-center transition-colors ${rankClass}`}>
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
      <div
        className={`flex w-full items-center gap-3 px-4 py-2 transition-colors ${bottomBgClass}`}
      >
        <Badge type={rookieStatus === '완료' ? 'rookie-complete' : 'rookie-progress'}>
          {`루키 ${rookieStatus}`}
        </Badge>
        <Badge type={proStatus === '완료' ? 'pro-complete' : 'pro-progress'}>
          {`프로 ${proStatus}`}
        </Badge>
        <Badge type={tankerStatus === '완료' ? 'tanker-complete' : 'tanker-progress'}>
          {`탱커 ${tankerStatus}`}
        </Badge>
      </div>
    </div>
  )
}
