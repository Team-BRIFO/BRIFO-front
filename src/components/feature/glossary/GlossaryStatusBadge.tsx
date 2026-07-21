import { Check } from 'lucide-react'

import { Badge } from '@/components/common/Badge'

export interface GlossaryStatusBadgeProps {
  isLearned: boolean
  className?: string
}

export function GlossaryStatusBadge({ isLearned, className = '' }: GlossaryStatusBadgeProps) {
  // TODO: isLearned === true일 때 "이미 저장된 용어" 상태 뱃지 노출 (나중에 구현)
  if (isLearned) {
    return null
  }

  return (
    <Badge type="normal" size="md" left={<Check />} className={className}>
      내 용어장에 저장했어요
    </Badge>
  )
}
