import type { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import { Badge } from '@/components/common/Badge'
import type { MyGlossaryEntry } from '@/types/domain/glossary'

export interface GlossaryCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  entry: MyGlossaryEntry
}

/**
 * 내 용어장 카드 (용어 · 분류 · 뜻풀이 · 획득 맥락)
 *
 * TODO(#31): 용어장 도메인 이슈에서 공용 용어 카드가 나오면 이 컴포넌트를 대체할 것.
 *            지금은 마이페이지 단독 진행을 위해 자체 구현해 둔 상태.
 */
export function GlossaryCard({ entry, className = '', ...props }: GlossaryCardProps) {
  const { term, definition, category, caption } = entry

  return (
    <button
      type="button"
      className={twMerge(
        'border-Gray-2 bg-White flex w-full flex-col gap-2 rounded-lg border px-4 py-3.5 text-left',
        'focus-visible:ring-Yellow-45 focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span className="pretendard-Body1-Semibold text-Gray-10 truncate">{term}</span>
        {category && <Badge type="hash">{category}</Badge>}
      </div>

      <p className="pretendard-Caption2 text-Gray-7 line-clamp-2 leading-relaxed">{definition}</p>

      {caption && <span className="pretendard-Caption4 text-Gray-5 truncate">{caption}</span>}
    </button>
  )
}
