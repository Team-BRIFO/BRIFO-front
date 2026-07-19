import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export interface BriefingCommentProps extends HTMLAttributes<HTMLDivElement> {
  /** 상단 태그 텍스트 (예: '사장님 맞춤') */
  tagText?: string
  /** 코멘트 본문 */
  comment: string
  /** 에러 상황 여부 (true 시 글자색 Pink-30 변경) */
  isErrorVariant?: boolean
}

export function BriefingComment({
  tagText = '사장님 맞춤',
  comment,
  isErrorVariant = false,
  className,
  ...props
}: BriefingCommentProps) {
  return (
    <div
      className={twMerge(
        'from-Pink-50 via-Pink-60 to-Pink-50 box-border flex w-full flex-col items-start gap-2 rounded-lg bg-gradient-to-r px-5 py-4',
        className,
      )}
      {...props}
    >
      {/* Tag_Wrapper */}
      <div className="bg-Pink-20 flex items-center justify-center rounded px-2 py-1">
        <span className="pretendard-Caption1 text-White">{tagText}</span>
      </div>

      {/* Comment_Text */}
      <span
        className={twMerge(
          'pretendard-Body2-Semibold w-full break-words',
          isErrorVariant ? 'text-Pink-30' : 'text-Pink-5',
        )}
      >
        {comment}
      </span>
    </div>
  )
}
