import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export interface BriefingNoteProps extends HTMLAttributes<HTMLDivElement> {
  /** 메인 브리핑 코멘트 내용 (기본 노출 본문) */
  message: string
  /** 시스템 에러 혹은 주의 알림용 서브 텍스트 (Optional) */
  errorText?: string
  /** 컴포넌트의 시각적 강조 테마 상태 (기본 또는 에러 스타일) */
  isErrorVariant?: boolean
  /** AI 한마디 텍스트 (Optional, 예: "지금 이 흐름, 놓치기 아까워요 사장님!") */
  recommendText?: string
}

export function BriefingNote({
  message,
  errorText,
  isErrorVariant = false,
  recommendText,
  className,
  ...props
}: BriefingNoteProps) {
  return (
    <div
      className={twMerge(
        'bg-White box-border flex w-[328px] flex-col items-start gap-2 rounded-[8px] p-[16px_20px]',
        className,
      )}
      {...props}
    >
      {/* Text_Area */}
      <span className="pretendard-Body2-Regular text-Gray-6 w-full break-words">{message}</span>

      {/* Ai_Recommend_Text (조건부 렌더링) */}
      {recommendText && (
        <span className="pretendard-Body2-Semibold text-Yellow-30 w-full break-words">
          {recommendText}
        </span>
      )}

      {/* Error_Text_Area (조건부 렌더링) */}
      {(errorText || isErrorVariant) && errorText && (
        <span className="pretendard-Caption1 text-Pink-30 w-full break-words">{errorText}</span>
      )}
    </div>
  )
}
