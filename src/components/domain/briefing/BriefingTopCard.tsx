import { Badge } from '@/components/common/Badge'

export interface BriefingTopCardProps {
  /**
   * API 결과에 따른 배지 타입
   * (상승: 'rise', 하락: 'fall', 관망: 'watch')
   */
  badgeType: 'rise' | 'watch' | 'fall'
  /**
   * 배지에 들어갈 텍스트 (예: "상승 예측")
   */
  badgeText: string
  /**
   * 퍼센티지 수치 (예: 29.9)
   */
  percentage: number
  newsTitleText: string
  className?: string
}

export function BriefingTopCard({
  badgeType,
  badgeText,
  percentage,
  newsTitleText,
  className = '',
}: BriefingTopCardProps) {
  return (
    <div
      className={`border-Gray-2 bg-White shadow-card box-border flex w-full flex-col items-start gap-3 rounded-lg border p-4 ${className}`}
    >
      {/* Badge_percentage_Wrapper */}
      <div className="flex shrink-0 items-center gap-1.5">
        <Badge type={badgeType}>{badgeText}</Badge>
        <span className="text-Gray-5 pretendard-Caption2">확신 {percentage}%</span>
      </div>

      {/* Title_Wrapper */}
      <div className="flex w-full items-center">
        <span className="dnf-Caption1 text-Gray-10 line-clamp-2">{newsTitleText}</span>
      </div>
    </div>
  )
}
