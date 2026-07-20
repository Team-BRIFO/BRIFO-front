import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import { Badge } from '@/components/common/Badge'

export interface BriefingReviewItem {
  agentName: string // 사원명 (예: "루키")
  badgeType: 'rise' | 'fall' | 'watch' // API에서 내려주는 배지 타입
  badgeText: string // 배지 텍스트 (예: "상승 예측")
  comment: string // 사원 상세 멘트
}

export interface BriefingReviewSectionProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  isExpanded?: boolean
  reviews: BriefingReviewItem[]
}

export function BriefingReviewSection({
  isExpanded = true,
  reviews,
  className,
  ...props
}: BriefingReviewSectionProps) {
  return (
    <div className={twMerge('flex w-full flex-col gap-3', className)} {...props}>
      {/* Header_Row */}
      <div className="flex items-center justify-between">
        <span className="pretendard-Button1 text-Gray-10">브리핑 다시보기</span>
      </div>

      {/* Review_List_Wrapper (Conditional Rendering) */}
      {isExpanded && (
        <div className="flex flex-col gap-4">
          {reviews.map((review, index) => {
            return (
              <div
                key={index}
                className="border-Gray-2 bg-White flex w-full flex-col items-start gap-2 rounded-xl rounded-bl-none border px-3.5 py-3"
              >
                {/* Agent_Header */}
                <div className="flex w-full items-center justify-between">
                  <span className="dnf-Caption2 text-Gray-10">{review.agentName}</span>
                  <Badge type={review.badgeType}>{review.badgeText}</Badge>
                </div>

                {/* Comment_Text */}
                <span className="pretendard-Caption1 text-Gray-6 w-full break-words">
                  {review.comment}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
