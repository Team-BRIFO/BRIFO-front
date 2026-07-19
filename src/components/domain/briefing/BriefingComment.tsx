import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export interface BriefingCommentProps extends HTMLAttributes<HTMLDivElement> {
  /** 상단 태그 텍스트 (예: '사장님 맞춤') */
  tagText?: string
  /** 코멘트 본문 */
  comment: string
}

export function BriefingComment({
  tagText = '사장님 맞춤',
  comment,
  className,
  ...props
}: BriefingCommentProps) {
  return (
    <div
      className={twMerge(
        'from-Pink-50 via-Pink-60 to-Pink-50 box-border flex w-[328px] flex-col items-start gap-2 rounded-[8px] bg-gradient-to-r p-[16px_20px]',
        className,
      )}
      {...props}
    >
      {/* Tag_Wrapper */}
      <div className="bg-Pink-20 flex items-center justify-center rounded-[4px] px-2 py-1">
        <span className="pretendard-Caption1 text-White">{tagText}</span>
      </div>

      {/* Comment_Text */}
      <span className="pretendard-Body2-Semibold text-Pink-30 w-full break-words">{comment}</span>
    </div>
  )
}
